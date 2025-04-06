import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

// Verify environment variables are loaded
console.log('Email User:', process.env.EMAIL_USER); // Should show your email
console.log('Email Pass:', process.env.EMAIL_PASS ? '***loaded***' : 'missing'); // Should show 

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // From environment variables
    pass: process.env.EMAIL_PASS
  }
});

// Test connection
transporter.verify((error) => {
  if (error) {
    console.error('Mail server connection failed:', error);
  } else {
    console.log('Mail server is ready');
  }
});

export default transporter;