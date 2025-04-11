// seedDatabase.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Internship from '../models/Admin/internship.js';

dotenv.config();

const initialInternships = [
  {
    title: "Frontend Development Internship",
    company: "TechNova Inc.",
    description: "3-month internship focused on modern frontend technologies and best practices.",
    location: "Seattle, WA",
    contact: "emma.brown@example.com",
    type: "Technical",
    mode: "On-site",
    duration: "3 months",
    stipend: "₹8,000/month",
    deadline: "2025-04-30",
    prerequisites: "Basic React, Git, JavaScript",
    requiredSkills: ["React", "JavaScript", "CSS"],
    isApproved: false,
    isMarkAsComplete: false
  },
  {
    title: "UX Design Internship",
    company: "Designify",
    description: "6-month internship program working on user experience design for enterprise applications.",
    location: "San Francisco, CA",
    contact: "alex.chen@example.com",
    type: "Design",
    mode: "On-site",
    duration: "6 months",
    stipend: "Unpaid",
    deadline: "2025-05-10",
    prerequisites: "Basic Figma and wireframing knowledge",
    requiredSkills: ["Figma", "Adobe XD", "Wireframing"],
    isApproved: false,
    isMarkAsComplete: false
  },
  {
    title: "Data Science Intern",
    company: "DataLabs",
    description: "Summer internship working with big data and machine learning models.",
    location: "Boston, MA",
    contact: "sarah.johnson@example.com",
    type: "Technical",
    mode: "Hybrid",
    duration: "2 months",
    stipend: "₹15,000/month",
    deadline: "2025-05-01",
    prerequisites: "Python, Statistics, Pandas",
    requiredSkills: ["Python", "Pandas", "ML"],
    isApproved: false,
    isMarkAsComplete: false
  },
  {
    title: "Product Management Intern",
    company: "StartSmart",
    description: "Learn product management fundamentals in a fast-paced startup environment.",
    location: "New York, NY",
    contact: "michael.smith@example.com",
    type: "Business",
    mode: "On-site",
    duration: "3 months",
    stipend: "₹12,000/month",
    deadline: "2025-04-25",
    prerequisites: "Strong communication, Analytical thinking",
    requiredSkills: ["Agile", "Excel", "Analytics"],
    isApproved: false,
    isMarkAsComplete: false
  },
  {
    title: "Cloud Engineering Internship",
    company: "Cloudscape",
    description: "Hands-on experience with cloud infrastructure and DevOps practices.",
    location: "Remote / Virtual",
    contact: "david.wilson@example.com",
    type: "Technical",
    mode: "Remote",
    duration: "3 months",
    stipend: "₹10,000/month",
    deadline: "2025-05-15",
    prerequisites: "Linux basics, Cloud fundamentals",
    requiredSkills: ["AWS", "Docker", "CI/CD"],
    isApproved: false,
    isMarkAsComplete: false
  }
];

const seedDB = async () => {
  try {
    const MONGO_URI = "mongodb+srv://networknexusMERN:WGKonEqRljv3RlIs@networknexus.wnx9c9d.mongodb.net/alumniNetwork?retryWrites=true&w=majority&appName=NetworkNexus";
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ MongoDB Connected'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
    
    // Clear existing data
    await Internship.deleteMany({});
    console.log('Existing internships deleted');
    
    // Insert new data
    const createdInternships = await Internship.insertMany(initialInternships);
    console.log(`${createdInternships.length} internships inserted`);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

seedDB();