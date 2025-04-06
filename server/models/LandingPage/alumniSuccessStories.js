import mongoose from 'mongoose';

const alumniSuccessStorySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  jobPosition: String,
  passOutYear: Number,
  successStory: String,
  // Add other fields as needed
}, { timestamps: true });

export default mongoose.model('AlumniSuccessStory', alumniSuccessStorySchema, 'alumnis');