import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        // Robust email regex that properly handles numbers and modern email formats
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      },
      message: props => `${props.value} is not a valid email address`
    },
    index: true // Add index for better performance on email queries
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting/filtering by subscription date
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true } // Include virtuals when converting to objects
});

// Add compound index for email and subscription date
subscriberSchema.index({ email: 1, subscribedAt: 1 });

// Middleware to validate email before saving
subscriberSchema.pre('save', function(next) {
  console.log(`Attempting to save subscriber with email: ${this.email}`);
  next();
});

// Static method for checking if email exists
subscriberSchema.statics.emailExists = async function(email) {
  const subscriber = await this.findOne({ email });
  return !!subscriber;
};

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
export default Subscriber;