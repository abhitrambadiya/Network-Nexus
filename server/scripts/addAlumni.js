import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';

dotenv.config();

// MongoDB Connection
const MONGO_URI = "mongodb+srv://networknexusMERN:WGKonEqRljv3RlIs@networknexus.wnx9c9d.mongodb.net/alumniNetwork?retryWrites=true&w=majority&appName=NetworkNexus";
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Alumni Schema with latitude and longitude as top-level fields
const alumniSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    prn: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    passOutYear: { type: Number, required: true },
    jobPosition: String,
    companyName: String,
    location: String,
    latitude: Number,  // Separate latitude field
    longitude: Number, // Separate longitude field
    successStory: String,
    mentorshipAreas: [String],
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create geospatial index using the separate fields
alumniSchema.index({ longitude: 1, latitude: 1 });

const Alumni = mongoose.model('Alumni', alumniSchema);

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "brainwavebrigades@gmail.com",
        pass: "nbwn fpsm lyvk cfza"
    }
});

// Function to generate a random password
const generatePassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Function to get coordinates from location using Nominatim API
const getCoordinates = async (location) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
        
        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
            };
        }
        return { latitude: null, longitude: null };
    } catch (error) {
        console.error(`❌ Error fetching coordinates for ${location}:`, error.message);
        return { latitude: null, longitude: null };
    }
};

// Function to process CSV and add alumni
const importAlumniFromCSV = async (filePath) => {
    const alumniData = [];

    // Read CSV file with explicit headers
    fs.createReadStream(filePath)
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim()
        }))
        .on('data', (row) => {
            if (row.fullName && row.email && !row.fullName.match(/fullName/i)) {
                alumniData.push(row);
            }
        })
        .on('end', async () => {
            console.log(`📊 CSV file successfully processed. Found ${alumniData.length} valid alumni records.`);
            
            if (alumniData.length === 0) {
                console.log('❌ No valid alumni records found in CSV file.');
                mongoose.connection.close();
                return;
            }

            let successCount = 0;
            let skipCount = 0;
            let errorCount = 0;

            for (const alumni of alumniData) {
                try {
                    console.log(`Processing: ${alumni.fullName}`);

                    // Check if alumni already exists by email or PRN
                    const existingAlumni = await Alumni.findOne({ 
                        $or: [
                            { email: alumni.email },
                            { prn: alumni.prn }
                        ]
                    });
                    
                    if (existingAlumni) {
                        console.log(`⚠️ Alumni ${alumni.fullName} (${alumni.email}) already exists. Skipping...`);
                        skipCount++;
                        continue;
                    }

                    // Generate password
                    const password = generatePassword();

                    // Get coordinates from location
                    const { latitude, longitude } = await getCoordinates(alumni.location);

                    // Create new alumni document
                    const newAlumni = new Alumni({
                        fullName: alumni.fullName,
                        email: alumni.email,
                        password: await bcrypt.hash(password, 10),
                        prn: alumni.prn,
                        department: alumni.department,
                        passOutYear: parseInt(alumni.passOutYear),
                        jobPosition: alumni.jobPosition,
                        companyName: alumni.companyName,
                        location: alumni.location,
                        latitude: latitude,
                        longitude: longitude,
                        successStory: alumni.successStory,
                        mentorshipAreas: alumni.mentorshipArea ? 
                            alumni.mentorshipArea.split(',').map(area => area.trim()) : []
                    });

                    // Save to database
                    await newAlumni.save();
                    successCount++;
                    console.log(`✅ Alumni added: ${alumni.fullName}`);

                    // Send welcome email
                    const mailOptions = {
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
                    };

                    await transporter.sendMail(mailOptions);
                    console.log(`📧 Email sent to: ${alumni.email}`);

                    // Delay to prevent rate limits (emails and geocoding)
                    await new Promise(resolve => setTimeout(resolve, 2000));

                } catch (error) {
                    errorCount++;
                    console.error(`❌ Error processing ${alumni.fullName || 'alumni'}:`, error.message);
                    console.error('Error details:', error);
                }
            }

            console.log('\n📊 Import Summary:');
            console.log(`✅ Successfully added: ${successCount}`);
            console.log(`⚠️ Skipped (already exists): ${skipCount}`);
            console.log(`❌ Errors: ${errorCount}`);

            mongoose.connection.close();
            console.log("🔗 MongoDB Connection Closed");
        })
        .on('error', (error) => {
            console.error('❌ CSV Processing Error:', error);
            mongoose.connection.close();
        });
};

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("⚠️ MongoDB Connection Closed due to SIGINT");
    process.exit(0);
});

// Run the script with your CSV file path
importAlumniFromCSV('./AlumniForm.csv');