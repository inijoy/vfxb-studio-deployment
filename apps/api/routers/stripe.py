import os
from datetime import datetime, timezone
from typing import Any

import stripe
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel

from db.client import get_db
from middleware.auth import CurrentUser

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
PRO_PRICE_ID = os.getenv("STRIPE_PRICE_PRO_MONTHLY", "")
ENTERPRISE_PRICE_ID = os.getenv("STRIPE_PRICE_ENTERPRISE_MONTHLY", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


class CheckoutRequest(BaseModel):
    plan: str  # pro | enterprise


@router.post("/stripe/create-checkout")
async def create_checkout_session(user: CurrentUser, body: CheckoutRequest):
    if body.plan not in {"pro", "enterprise"}:
        raise HTTPException(status_code=422, detail="plan must be 'pro' or 'enterprise'")

    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    price_id = PRO_PRICE_ID if body.plan == "pro" else ENTERPRISE_PRICE_ID
    if not price_id:
        raise HTTPException(status_code=500, detail=f"Missing Stripe price id for plan {body.plan}")

    db = get_db()
    sub_result = db.table("subscriptions").select("*").eq("user_id", user.id).limit(1).execute()
    existing_sub = sub_result.data[0] if sub_result.data else None

    customer_id = existing_sub.get("stripe_customer_id") if existing_sub else None
    if not customer_id:
        customer = stripe.Customer.create(email=user.email, metadata={"user_id": user.id})
        customer_id = customer.id

    checkout = stripe.checkout.Session.create(
        mode="subscription",
        customer=customer_id,
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=f"{FRONTEND_URL}/settings?billing=success",
        cancel_url=f"{FRONTEND_URL}/settings?billing=cancel",
        metadata={"user_id": user.id, "plan": body.plan},
        allow_promotion_codes=True,
    )

    if existing_sub:
        db.table("subscriptions").update({"stripe_customer_id": customer_id}).eq("user_id", user.id).execute()
    else:
        db.table("subscriptions").insert(
            {
                "user_id": user.id,
                "stripe_customer_id": customer_id,
                "plan": "free",
                "status": "active",
            }
        ).execute()

    return {"checkout_url": checkout.url, "session_id": checkout.id}


@router.get("/stripe/portal")
async def create_billing_portal(user: CurrentUser):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    db = get_db()
    sub_result = db.table("subscriptions").select("stripe_customer_id").eq("user_id", user.id).limit(1).execute()
    if not sub_result.data or not sub_result.data[0].get("stripe_customer_id"):
        raise HTTPException(status_code=404, detail="No Stripe customer found")

    customer_id = sub_result.data[0]["stripe_customer_id"]
    portal = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=f"{FRONTEND_URL}/settings",
    )
    return {"portal_url": portal.url}


@router.post("/stripe/webhook", include_in_schema=False)
async def stripe_webhook(request: Request):
    if not stripe.api_key or not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Stripe webhook not configured")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payload")
    except Exception as exc:
        if exc.__class__.__name__ == "SignatureVerificationError":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")
        raise

    db = get_db()

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("metadata", {}).get("user_id")
        plan = session.get("metadata", {}).get("plan", "pro")
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")

        if user_id:
            db.table("subscriptions").upsert(
                {
                    "user_id": user_id,
                    "stripe_customer_id": customer_id,
                    "stripe_subscription_id": subscription_id,
                    "plan": plan,
                    "status": "active",
                },
                on_conflict="user_id",
            ).execute()

            videos_limit = 3 if plan == "free" else 999999
            db.table("users").update({"plan": plan, "videos_limit": videos_limit}).eq("id", user_id).execute()

    elif event["type"] in {"customer.subscription.deleted", "customer.subscription.updated"}:
        subscription = event["data"]["object"]
        subscription_id = subscription.get("id")
        status_value = subscription.get("status", "canceled")

        new_plan = "free"
        items = subscription.get("items", {}).get("data", [])
        if items:
            price_id = items[0].get("price", {}).get("id")
            if price_id == ENTERPRISE_PRICE_ID:
                new_plan = "enterprise"
            elif price_id == PRO_PRICE_ID:
                new_plan = "pro"

        period_end_raw = subscription.get("current_period_end")
        period_end = None
        if period_end_raw:
            period_end = datetime.fromtimestamp(period_end_raw, tz=timezone.utc).isoformat()

        db.table("subscriptions").update(
            {
                "plan": new_plan if status_value in {"active", "trialing", "past_due"} else "free",
                "status": status_value,
                "current_period_end": period_end,
            }
        ).eq("stripe_subscription_id", subscription_id).execute()

        sub_row = db.table("subscriptions").select("user_id").eq(
            "stripe_subscription_id", subscription_id
        ).single().execute()
        sub_data = sub_row.data if isinstance(sub_row.data, dict) else {}

        if sub_data.get("user_id"):
            user_plan = "free" if status_value in {"canceled", "unpaid", "incomplete_expired"} else new_plan
            videos_limit = 3 if user_plan == "free" else 999999
            db.table("users").update({"plan": user_plan, "videos_limit": videos_limit}).eq("id", sub_data["user_id"]).execute()

    return {"received": True}
