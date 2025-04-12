// controllers/alumni/alumniController.js
import Alumni from '../../models/Alumni/alumniLogin.js';
import { generateToken } from '../../middleware/Alumni/alumniMiddleware.js';
import sendEmail from '../../utils/emailService.js';
import bcrypt from 'bcryptjs';

// @desc    Login alumni
// @route   POST /api/alumni/login
// @access  Public
export const loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for alumni user
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await alumni.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: alumni._id,
      fullName: alumni.fullName,
      email: alumni.email,
      token: generateToken(alumni._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/alumni/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // Generate OTP
    const otp = alumni.getOTPToken();
    await alumni.save();

    // Send email with OTP
    const resetMessage = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your alumni account.</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      email: alumni.email,
      subject: 'Password Reset OTP',
      html: resetMessage,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    
    // Reset OTP fields
    if (error.alumni) {
      error.alumni.otpToken = undefined;
      error.alumni.otpExpire = undefined;
      await error.alumni.save();
    }
    
    res.status(500).json({ message: 'Could not send OTP email' });
  }
};

// @desc    Verify OTP and get access to reset password
// @route   POST /api/alumni/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const alumni = await Alumni.findOne({
      email,
      otpExpire: { $gt: Date.now() }
    });

    if (!alumni) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP matches
    const isMatch = await alumni.matchOTP(otp);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, send temporary token for password reset
    const tempToken = generateToken(alumni._id);

    res.status(200).json({ success: true, tempToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   PUT /api/alumni/reset-password
// @access  Private (requires temp token)
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    const alumni = await Alumni.findById(req.alumni._id);

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    alumni.password = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP fields
    alumni.otpToken = undefined;
    alumni.otpExpire = undefined;
    
    await alumni.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlumniProfile = async (req, res) => {
  try {
    // req.alumni already has the user details from the protect middleware
    const alumni = req.alumni;
    
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.status(200).json({
      _id: alumni._id,
      fullName: alumni.fullName,
      email: alumni.email,
      department: alumni.department,
      jobPosition: alumni.jobPosition,
      passOutYear: alumni.passOutYear,
      companyName: alumni.companyName
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};