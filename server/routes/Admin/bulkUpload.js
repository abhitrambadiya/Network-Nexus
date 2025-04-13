import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB Connection
const MONGO_URI = "mongodb+srv://networknexusMERN:WGKonEqRljv3RlIs@networknexus.wnx9c9d.mongodb.net/alumniNetwork?retryWrites=true&w=majority&appName=NetworkNexus";
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Admin Schema
const bulkUpload = new mongoose.Schema({
  prn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['AIML', 'CSE', 'ENTC', 'MECH', 'CIVIL']
  },
  passOutYear: {
    type: Number,
    required: true
  },
  jobPosition: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  successStory: {
    type: String
  },
  specialAchievements: {
    type: String
  },
  linkedInURL: {
    type: String
  },
  hallOfFame: {
    type: String,
    required: true
  },
  skills: {
    type: String
  },
  role: {
    type: String,
    default: 'Alumni'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const BulkUpload = mongoose.model('BulkUpload', bulkUpload, "alumnis");

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "brainwavebrigades@gmail.com",
    pass: "nbwn fpsm lyvk cfza"
  }
});

// Generate password
const generatePassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const getCoordinates = async (location) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    }
    return { latitude: null, longitude: null };
  } catch (error) {
    return { latitude: null, longitude: null };
  }
};

// Route: POST /api/alumni/bulk-upload
router.post('/bulk-upload', upload.single('csv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const filePath = req.file.path;
  const alumniData = [];

  fs.createReadStream(filePath)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim(), mapValues: ({ value }) => value.trim() }))
    .on('data', (row) => {
      if (row.fullName && row.email && !row.fullName.match(/fullName/i)) {
        alumniData.push(row);
      }
    })
    .on('end', async () => {
      let successCount = 0, skipCount = 0, errorCount = 0;
      const processedData = [];

      for (const alumni of alumniData) {
        try {
          // Since we're not using the model, we'll just process the data
          // and prepare it for frontend consumption
          const password = generatePassword();
          const { latitude, longitude } = await getCoordinates(alumni.location);

          const processedAlumni = {
            fullName: alumni.fullName,
            email: alumni.email,
            phoneNumber: alumni.phoneNumber,
            password: await bcrypt.hash(password, 10),
            prn: alumni.prn,
            department: alumni.department,
            passOutYear: parseInt(alumni.passOutYear),
            jobPosition: alumni.jobPosition,
            companyName: alumni.companyName,
            location: alumni.location,
            latitude, 
            longitude,
            successStory: alumni.successStory,
            specialAchievements: alumni.specialAchievements,
            linkedInURL: alumni.linkedInURL,
            hallOfFame: alumni.hallOfFame,
            role: alumni.role,
            skills: alumni.skills,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          processedData.push(processedAlumni);
          successCount++;
          const newAlumni = new BulkUpload(processedAlumni);
          await newAlumni.save();

          // Still send emails to the alumni
          await transporter.sendMail({
            from: '"Network Nexus Alumni" "brainwavebrigades@gmail.com"',
                        to: alumni.email,
                        subject: 'Welcome to Network Nexus Alumni Portal 🎓',
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
          });

          await new Promise(res => setTimeout(res, 2000));
        } catch (err) {
          errorCount++;
          console.error(err);
        }
      }

      fs.unlinkSync(filePath); // Clean up uploaded file
      res.json({
        message: 'Bulk upload processing complete.',
        summary: { successCount, skipCount, errorCount },
        data: processedData  // Return the processed data to the frontend
      });
    })
    .on('error', (error) => {
      fs.unlinkSync(filePath);
      res.status(500).json({ message: 'CSV Processing Error', error: error.message });
    });
});

export default router;