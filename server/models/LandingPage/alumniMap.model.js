import mongoose from 'mongoose';

const alumniMapSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  jobPosition: String,
  companyName: String,
  location: {
    type: String,
    required: true,
    index: true
  },
  latitude: { type: Number, required: true },  // Separate fields
  longitude: { type: Number, required: true }
}, { timestamps: true,
  collection: 'alumnis' });

// Compound index for location-based queries
alumniMapSchema.index({ location: 1, latitude: 1, longitude: 1 });

const AlumniMap = mongoose.model('AlumniMap', alumniMapSchema);
export default AlumniMap;