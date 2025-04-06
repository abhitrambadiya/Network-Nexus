import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
const MONGO_URI = "mongodb+srv://networknexusMERN:WGKonEqRljv3RlIs@networknexus.wnx9c9d.mongodb.net/alumniNetwork?retryWrites=true&w=majority&appName=NetworkNexus";
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Admin Schema
const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    adminDepartment: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Admins Data
const admins = [
    { name: 'Abhi Trambadiya', email: 'abhitrambadiya48@gmail.com', password: 'abhi@admin', adminDepartment: 'AIML' },
    { name: 'Tanishq Jain', email: 'tanishqjain3011@gmail.com', password: 'tanishq@2005', adminDepartment: 'CSBS' },
    { name: 'Atharva Shewale', email: 'atharvgaming10@gmail.com', password: 'anna12', adminDepartment: 'ENTC' },
    { name: 'Shiv Pardeshi', email: 'pardeshishiv789@gmail.com', password: 'Shiv@P', adminDepartment: 'Mechanical' },
    { name: 'Tanish Patgaonkar', email: 'tanishpatgaonkar@gmail.com', password: 'tanish@123', adminDepartment: 'Civil' },
    { name: 'Brainwave Brigades', email: 'brainwavebrigades@gmail.com', password: 'brainwavebrigades@kit', adminDepartment: 'MAIN' }
];

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "brainwavebrigades@gmail.com",
        pass: "nbwn fpsm lyvk cfza"
    }
});

// Function to Add Admins Sequentially
const addAdmins = async () => {
    for (let i = 0; i < admins.length; i++) {
        const { name, email, password, adminDepartment } = admins[i];
        try {
            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                console.log(`⚠️ Admin ${name} already exists. Skipping...`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Add to database with upsert to avoid duplicates
            const newAdmin = await Admin.findOneAndUpdate(
                { email },
                { name, email, password: hashedPassword, adminDepartment, updatedAt: new Date() },
                { upsert: true, new: true }
            );

            console.log(`✅ Admin added: ${name}`);

            // Send Email
            const mailOptions = {
                from: '"Network Nexus" <' + process.env.EMAIL_USER + '>',
                to: email,
                subject: 'Welcome to the Admin Panel 🎉',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
                        <h2 style="color: #4CAF50; text-align: center;">Welcome, ${name}!</h2>
                        <p style="font-size: 16px;">You have been successfully added as an admin for the <strong>${adminDepartment}</strong> department.</p>
                        <p><strong>Your login details:</strong></p>
                        <div style="background: #f4f4f4; padding: 10px; border-radius: 5px;">
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Password:</strong> ${password}</p>
                        </div>
                        <p style="font-size: 14px; color: #555;">Please keep these details safe and do not share them with anyone.</p>
                        <hr>
                        <p style="text-align: center; font-size: 14px; color: #777;">Regards, <br> <strong>Team NetworkNexus</strong></p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`📧 Email sent to: ${email}`);

            // Delay to prevent rate limits
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay

        } catch (error) {
            console.error(`❌ Error processing ${name}:`, error.message);
        }
    }

    mongoose.connection.close();
    console.log("🔗 MongoDB Connection Closed");
};

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("⚠️ MongoDB Connection Closed due to SIGINT");
    process.exit(0);
});

// Run the script
addAdmins();
