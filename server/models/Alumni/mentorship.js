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
  department: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['Online', 'Offline']
  },
  date: {
    type: String,
    required: true
  },
  studyYear: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true,
    min: 1
  },
  targetAudience: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumni',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobPosition: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isMarkedAsComplete: {
    type: Boolean,
    default: false
  },
  participants: [participantSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AddMentorship = mongoose.model('AddMentorship', internshipSchema, "mentorships");

export default AddMentorship;