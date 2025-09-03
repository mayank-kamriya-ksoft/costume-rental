import bcrypt from 'bcryptjs';
import session from 'express-session';
import type { RequestHandler } from 'express';
import { storage } from './storage';
import type { User } from '@shared/schema';

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'costume-rental-secret-key',
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax' as const,
  },
};

// Extend session to include user
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: User;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Authentication middleware
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }
  next();
};

// Optional auth middleware (doesn't require auth but adds user if available)
export const optionalAuth: RequestHandler = async (req, res, next) => {
  if (req.session.userId && !req.session.user) {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.session.user = user;
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    }
  }
  next();
};

// Login helper
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await storage.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }
    
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    
    // Don't return password in user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}