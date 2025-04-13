import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AlumniSchema = new mongoose.Schema({
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

// Pre-save hook to hash password
AlumniSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
AlumniSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const SingleAddAlumni = mongoose.model('SingleAddAlumni', AlumniSchema, "alumnis");

export default SingleAddAlumni;