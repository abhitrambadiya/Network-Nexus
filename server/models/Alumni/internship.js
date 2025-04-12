// models/Internship.js
import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  name: String,
  email: String,
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { _id: true });

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['Online', 'Offline']
  },
  duration: {
    type: String,
    required: true
  },
  stipend: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true
  },
  prerequisites: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumni',
    required: true
  },
  alumniName: {
    type: String,
    required: true
  },
  alumniCompany: {
    type: String,
    required: true
  },
  alumniPosition: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isMarkAsComplete: {
    type: Boolean,
    default: false
  },
  participants: [participantSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AddInternship = mongoose.model('AddInternship', internshipSchema, "internships");

export default AddInternship;