import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure transporter with your email service details
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send welcome email to newly added alumni
 */
const sendWelcomeEmail = async (alumni, password) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: alumni.email,
      subject: 'Welcome to Alumni Connect!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50; text-align: center;">Welcome, ${alumni.fullName}!</h2>
          <p style="font-size: 16px;">You have been successfully registered in our alumni network.</p>
          <p><strong>Your login details:</strong></p>
          <div style="background: #f4f4f4; padding: 10px; border-radius: 5px;">
              <p><strong>Email:</strong> ${alumni.email}</p>
              <p><strong>Password:</strong> ${password}</p>
          </div>
          <p style="font-size: 14px; color: #555;">
              Please <a href="${process.env.PORTAL_URL || 'https://your-alumni-portal.com/login'}">Visit here</a> 
              to checkout our website.
          </p>
          <p style="font-size: 14px; color: #555;">
              We recommend changing your password after first login.
          </p>
          <hr>
          <p style="text-align: center; font-size: 14px; color: #777;">
              Regards, <br> 
              <strong>Network Nexus Team</strong>
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export { sendWelcomeEmail };
