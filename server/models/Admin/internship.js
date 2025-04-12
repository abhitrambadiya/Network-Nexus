// models/internshipModel.js
import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
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
  type: {
    type: String,
    required: true,
    enum: ['Technical', 'Design', 'Business']
  },
  mode: {
    type: String,
    required: true,
    enum: ['Remote', 'On-site', 'Hybrid']
  },
  duration: {
    type: String,
    required: true
  },
  stipend: {
    type: String,
    required: true
  },
  deadline: {
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
  isApproved: {
    type: Boolean,
    default: false
  },
  isMarkAsComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
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
    }
});

const Internship = mongoose.model('Internship', internshipSchema);

export default Internship;