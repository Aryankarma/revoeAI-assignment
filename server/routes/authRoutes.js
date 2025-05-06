import { Router } from "express";
import pkg from "bcryptjs";
const { compare } = pkg;
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import crypto from "crypto";
import cookieParser from "cookie-parser";

const router = Router();

// Cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Only secure in production
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Access token expiry - short lived (15 minutes)
const ACCESS_TOKEN_EXPIRY = "15m";
// Refresh token expiry - long lived (30 days)
const REFRESH_TOKEN_EXPIRY = "30d";

// Email verification token expiry (24 hours)
const EMAIL_TOKEN_EXPIRY = "24h";
// Password reset token expiry (1 hour)
const PASSWORD_RESET_EXPIRY = "1h";

// Configure rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs per IP
  message: "Too many attempts, please try again after 15 minutes",
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});



// CSRF protection middleware - apply to routes that use cookies
const csrfProtection = csrf({ cookie: { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 } });

// Helper function to generate JWT tokens
function generateTokens(userId) {
  // Generate access token (short-lived)
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  
  // Generate refresh token (long-lived)
  const refreshToken = jwt.sign(
    { id: userId, tokenId: uuidv4() }, 
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  
  return { accessToken, refreshToken };
}

// Register route with rate limiting
router.post('/register', authLimiter, async (req, res) => { 
  const { name, email, password } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generate verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: EMAIL_TOKEN_EXPIRY,
    });
    
    const user = new User({
      name,
      email,
      password,
      verificationToken,
      isVerified: false,
    });
    
    await user.save();
    
    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Store refresh token in user document
    user.refreshTokens = [{ token: refreshToken, createdAt: new Date() }];
    await user.save();
    
    // Set cookies
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 minutes
    
    res.status(201).json({ 
      token: accessToken, // For backward compatibility
      user: { id: user._id, name, email, isVerified: false },
      message: 'Registration successful. Please verify your email.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification route
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, verificationToken: token });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    
    // Mark user as verified and remove token
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired verification token' });
  }
});

// Login route with rate limiting
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if email is verified (optional: you can make this mandatory)
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Store refresh token in user document
    // Limit to 5 active sessions per user
    user.refreshTokens = [...(user.refreshTokens || []).slice(-4), { token: refreshToken, createdAt: new Date() }];
    await user.save();
    
    // Set cookies
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 minutes
    
    res.json({ 
      token: accessToken, // For backward compatibility
      user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Token refresh route
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    );
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Check if refresh token is in user's refreshTokens array
    const tokenExists = user.refreshTokens.some(token => token.token === refreshToken);
    if (!tokenExists) {
      // Remove all refresh tokens if someone tries to use an invalid token
      // This forces the user to log in again on all devices
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Token rotation - remove the used refresh token
    user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Store new refresh token
    user.refreshTokens.push({ token: newRefreshToken, createdAt: new Date() });
    await user.save();
    
    // Set cookies
    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 minutes
    
    res.json({ 
      token: accessToken, // For backward compatibility
      user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    try {
      // Verify token to get user ID
      const decoded = jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
      );
      
      // Find user and remove the refresh token
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
        await user.save();
      }
    } catch (error) {
      // Continue with logout even if token verification fails
      console.error('Logout error:', error);
    }
  }
  
  // Clear cookies regardless of token validity
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.json({ message: 'Logged out successfully' });
});

// Forgot password route
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if email doesn't exist to prevent email enumeration
      return res.json({ message: 'If your email is registered, you will receive password reset instructions' });
    }
    
    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Save token hash to user document
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    
    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `
        <h1>Reset Your Password</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
    
    res.json({ message: 'If your email is registered, you will receive password reset instructions' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password route
router.post('/reset-password', authLimiter, async (req, res) => {
  const { token, password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }
  
  try {
    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Update password and clear reset token
    user.password = password; // Will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Invalidate all refresh tokens (force logout on all devices)
    user.refreshTokens = [];
    
    await user.save();
    
    res.json({ message: 'Password reset successful. Please log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to validate the token received from frontend
router.post("/validate-token", async (req, res) => {
  // First check for HTTP-only cookie
  const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!accessToken) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -refreshTokens");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    res.json({ valid: true, user });
  } catch (error) {
    // If access token is invalid, client should try to refresh
    console.error('Token validation error:', error);
    res.status(401).json({ message: "Token is not valid" });
  }
});

// Get active sessions route
router.get('/sessions', async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!accessToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Return active sessions data
    const sessions = user.refreshTokens.map((token, index) => ({
      id: index,
      createdAt: token.createdAt,
      isCurrent: token.token === req.cookies.refreshToken
    }));
    
    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Revoke specific session route
router.post('/revoke-session', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!accessToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.refreshTokens[sessionId]) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    // Check if trying to revoke current session
    const isCurrentSession = user.refreshTokens[sessionId].token === req.cookies.refreshToken;
    
    // Remove the specific refresh token
    user.refreshTokens.splice(sessionId, 1);
    await user.save();
    
    // If current session was revoked, clear cookies
    if (isCurrentSession) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.json({ message: 'Current session revoked. You have been logged out.' });
    }
    
    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CSRF token route
router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});





export default router;
