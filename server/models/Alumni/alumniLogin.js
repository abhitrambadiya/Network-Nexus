// models/alumni/alumniModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const alumniSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ['AIML', 'CSE', 'ENTC', 'MECH', 'CIVIL']
    },
  jobPosition: {
    type: String,
    required: true
  },
  passOutYear: {
    type: Number,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
    otpToken: String,
    otpExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
alumniSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash OTP token
alumniSchema.methods.getOTPToken = function () {
  // Generate a 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash OTP token
  this.otpToken = bcrypt.hashSync(otp, 10);
  
  // Set expire time - 10 minutes
  this.otpExpire = Date.now() + 10 * 60 * 1000;

  return otp;
};

// Match OTP
alumniSchema.methods.matchOTP = async function (enteredOTP) {
  return await bcrypt.compare(enteredOTP, this.otpToken);
};

const Alumni = mongoose.model('Alumni', alumniSchema);

export default Alumni;