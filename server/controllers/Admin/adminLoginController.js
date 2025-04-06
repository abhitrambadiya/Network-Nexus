// controllers/admin/adminController.js
import Admin from '../../models/Admin/adminLogin.js';
import { generateToken } from '../../middleware/Admin/adminMiddleware.js';
import sendEmail from '../../utils/emailService.js';
import bcrypt from 'bcryptjs';

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin user
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/admin/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Generate OTP
    const otp = admin.getOTPToken();
    await admin.save();

    // Send email with OTP
    const resetMessage = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your admin account.</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      email: admin.email,
      subject: 'Password Reset OTP',
      html: resetMessage,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    
    // Reset OTP fields
    if (error.admin) {
      error.admin.otpToken = undefined;
      error.admin.otpExpire = undefined;
      await error.admin.save();
    }
    
    res.status(500).json({ message: 'Could not send OTP email' });
  }
};

// @desc    Verify OTP and get access to reset password
// @route   POST /api/admin/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({
      email,
      otpExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP matches
    const isMatch = await admin.matchOTP(otp);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, send temporary token for password reset
    const tempToken = generateToken(admin._id);

    res.status(200).json({ success: true, tempToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   PUT /api/admin/reset-password
// @access  Private (requires temp token)
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP fields
    admin.otpToken = undefined;
    admin.otpExpire = undefined;
    
    await admin.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};