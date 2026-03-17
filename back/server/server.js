const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors({
  origin:[
    'http://localhost:5173', 
    'http://localhost:3000',  
    process.env.CLIENT_URL   
  ].filter(Boolean),
  credentials: true
}));

// --- CONFIGURATION ---
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// --- USER SCHEMA ---
const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google/GitHub Users
  profilePicture: { type: String },
  secretWord: { type: String } // MUST HAVE THIS FOR NO-EMAIL RESETS
});
const User = mongoose.model('User', UserSchema);

// ================= ROUTES ================= //

// 1. SIGN UP (Email, Password, Secret Word)
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, secretWord } = req.body;
    
    if (!secretWord) return res.status(400).json({ message: "Secret Word is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      secretWord, 
      profilePicture: null 
    });

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// 2. SIGN IN (Email/Password)
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    if (!existingUser.password) {
      return res.status(400).json({ message: "Please sign in with Google or GitHub" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 3. GOOGLE AUTH LOGIN
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body; // Frontend sends an 'access_token' via useGoogleLogin

  try {
    // We use the access token to get the user's profile info directly from Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error("Failed to fetch Google user info");
    
    const { email, name, picture } = await response.json();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profilePicture: picture,
      });
    }

    const jwtToken = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({ result: user, token: jwtToken });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

// 4. GITHUB AUTH LOGIN
app.post('/api/auth/github', async (req, res) => {
  const { code } = req.body; // Frontend sends the ?code=... from the URL

  try {
    // 1. Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) throw new Error(tokenData.error_description);
    
    const accessToken = tokenData.access_token;

    // 2. Fetch the user's GitHub profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await userResponse.json();

    // 3. Fetch user emails (required because some users set their primary email to private)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emailsData = await emailsResponse.json();
    
    // Find the primary email from the array
    const primaryEmailObj = emailsData.find((e) => e.primary) || emailsData[0];
    const email = primaryEmailObj?.email;

    if (!email) return res.status(400).json({ message: "No email associated with this GitHub account" });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: userData.name || userData.login,
        email,
        profilePicture: userData.avatar_url,
      });
    }

    const jwtToken = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ result: user, token: jwtToken });

  } catch (error) {
    console.error("GitHub Auth Error:", error);
    res.status(401).json({ message: "GitHub Authentication Failed" });
  }
});

// 5. RESET PASSWORD
app.post('/api/reset-password', async (req, res) => {
  const { email, secretWord, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res.status(400).json({ message: "Please sign in with Google or GitHub." });
    }

    if (!user.secretWord || user.secretWord.toLowerCase() !== secretWord.toLowerCase()) {
      return res.status(400).json({ message: "Incorrect Secret Word!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully! You can now log in." });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
}

module.exports = app;