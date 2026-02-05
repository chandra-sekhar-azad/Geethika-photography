import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { sendOTPEmail, sendWelcomeEmail } from '../config/email.js';

const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in database
const storeOTP = async (email, otp, purpose) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await pool.query(
    'INSERT INTO otps (email, otp, purpose, expires_at) VALUES ($1, $2, $3, $4)',
    [email, otp, purpose, expiresAt]
  );
};

// Verify OTP
const verifyOTP = async (email, otp, purpose) => {
  const result = await pool.query(
    'SELECT * FROM otps WHERE email = $1 AND otp = $2 AND purpose = $3 AND used = false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [email, otp, purpose]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Mark OTP as used
  await pool.query(
    'UPDATE otps SET used = true WHERE id = $1',
    [result.rows[0].id]
  );

  return true;
};

// Register
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('phone').optional().isMobilePhone()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, phone } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (email, password, name, phone) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, hashedPassword, name, phone]
      );

      const user = result.rows[0];

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Forgot Password - Send OTP
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      console.log(`\n📧 Forgot password request for: ${email}`);

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        console.log(`⚠️ User not found: ${email}`);
        // Don't reveal if email exists or not for security
        return res.json({ message: 'If that email exists, we sent an OTP' });
      }

      console.log(`✅ User found: ${email}`);

      // Generate and store OTP
      const otp = generateOTP();
      console.log(`🔑 Generated OTP: ${otp}`);
      
      await storeOTP(email, otp, 'password-reset');
      console.log(`💾 OTP stored in database`);

      console.log(`\n🔐 Password Reset OTP for ${email}: ${otp}`);
      console.log(`⏰ Valid for 10 minutes\n`);

      // Send OTP via email
      try {
        console.log(`📤 Attempting to send email to ${email}...`);
        const emailResult = await sendOTPEmail(email, otp, 'password-reset');
        console.log(`✅ OTP email sent successfully to ${email}`);
        console.log(`📬 Message ID: ${emailResult.messageId}`);
        
        res.json({ 
          message: 'OTP sent to your email',
          // For development - remove in production
          devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
        });
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        console.error('Error details:', emailError.message);
        console.error('Error stack:', emailError.stack);
        
        // Still return success but with OTP in console
        res.json({ 
          message: 'OTP generated. Check console for OTP (email service issue)',
          devOTP: otp // Show OTP when email fails
        });
      }
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Failed to process request' });
    }
  }
);

// Verify OTP and Reset Password
router.post('/reset-password',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
    body('password').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, otp, password } = req.body;

      // Verify OTP
      const isValidOTP = await verifyOTP(email, otp, 'password-reset');
      
      if (!isValidOTP) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password
      const result = await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2 RETURNING id',
        [hashedPassword, email]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }
);

// Get Profile
router.get('/profile',
  async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const result = await pool.query(
        'SELECT id, email, name, phone, role, created_at FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }
);

// Update Profile
router.put('/profile',
  [
    body('name').trim().notEmpty(),
    body('phone').optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { name, phone } = req.body;

      const result = await pool.query(
        'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING id, email, name, phone, role',
        [name, phone, decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// Change Password
router.put('/change-password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { currentPassword, newPassword } = req.body;

      // Get user
      const userResult = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResult.rows[0];

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, decoded.id]
      );

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

export default router;
