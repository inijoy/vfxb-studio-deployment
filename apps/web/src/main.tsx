
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initAuthListener } from "./store/auth";

  initAuthListener();

  createRoot(document.getElementById("root")!).render(<App />);
  