// middleware/authMiddleware.js - Enhanced with security features
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import User from '../models/User.js';

const protect = async (req, res, next) => {
    // Check for token in cookies first (preferred), then in Authorization header
    const token = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        
        // Get user from database (excluding sensitive data)
        const user = await User.findById(decoded.id).select('-password -refreshTokens');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        // Check if account is verified (optional)
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email to access this resource' });
        }
        
        // Check if account is locked
        if (user.isAccountLocked()) {
            return res.status(403).json({ message: 'Account is temporarily locked due to too many failed login attempts' });
        }
        
        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired',
                tokenExpired: true // Signal to frontend that it should try to refresh the token
            });
        }
        
        res.status(401).json({ message: 'Not authenticated' });
    }
};

// Middleware for permission-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        const userRole = req.user.role || 'user'; // Default role if not specified
        
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Not authorized to access this resource' });
        }
        
        next();
    };
};

// CSRF protection validation middleware
const validateCsrf = (req, res, next) => {
    // Skip CSRF validation for non-cookie auth or GET requests
    if (!req.cookies.accessToken || req.method === 'GET') {
        return next();
    }
    
    const csrfToken = req.header('X-CSRF-Token');
    
    if (!csrfToken) {
        return res.status(403).json({ message: 'CSRF token missing' });
    }
    
    // CSRF validation would be handled by csurf middleware
    // This is just an additional check
    next();
};

export { protect, authorize, validateCsrf };