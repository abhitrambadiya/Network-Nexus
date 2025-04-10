import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


// Landing Page ke Routes
import alumniSuccessStoriesRoutes from './routes/LandingPage/alumniSuccessStoriesRoutes.js';
import emailRoutes from './routes/LandingPage/emailRoutes.js';
import contactRoutes from './routes/LandingPage/contactRoutes.js';
import alumniMapRoutes from './routes/LandingPage/alumniMap.routes.js';


// only and only Admin ke routes
import adminRoutes from './routes/Admin/adminRoutes.js';
import bulkUploadRoute from './routes/Admin/bulkUpload.js';
import adminDirectory from './routes/Admin/directoryRoutes.js';
import programRoutes from './routes/Admin/mentorship.js';

// only and only Alumni ke routes
import alumniRoutes from './routes/Alumni/alumniRoutes.js';

const app = express();

const allowedOrigins = [
  "http://localhost:5173",  // Local development
  "https://networknexus.onrender.com"  // Deployed frontend
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("MongoDB connection error:", err));


// Landing Page ke Routes
app.use('/api', alumniSuccessStoriesRoutes);
app.use('/api', emailRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/alumni-map', alumniMapRoutes);

// only and only Admin ke routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', bulkUploadRoute);
app.use('/api/admin', adminDirectory);
app.use('/api/programs', programRoutes);

// only and only Alumni ke routes
app.use('/api/alumni', alumniRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));