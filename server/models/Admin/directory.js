import mongoose from 'mongoose';

const adminDirectory = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    prn: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    passOutYear: { type: Number, required: true },
    jobPosition: String,
    companyName: String,
    location: String,
    latitude: Number,
    longitude: Number,
    successStory: String,
    linkedInURL: String, // <-- Updated key
    phoneNumber: String,
    skills: String,
    role: { type: String, default: "Alumni" }, // <-- Added default
    specialAchievements: String,
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('AdminDirectory', adminDirectory, 'alumnis');