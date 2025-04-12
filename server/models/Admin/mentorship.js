import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  // Core fields needed by admin
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
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
  mode: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  targetAudience: {
    type: String,
    required: true
  },
  programType: {
    type: String,
    enum: ['mentorship', 'internship'],
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
  // Other fields can remain but aren't primary focus for admin
  studyYear: String,
  department: String,
  limit: String,
  participants: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Mentorship', ProgramSchema, 'mentorships');