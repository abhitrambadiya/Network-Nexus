// models/Program.js
import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Technical', 'Career']
  },
  programType: {
    type: String,
    required: true,
    enum: ['mentorship', 'internship']
  },
  image: {
    type: String
  },
  prn: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Mentorship', ProgramSchema, 'mentorships');
