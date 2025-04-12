// studentSeeder.js

import mongoose from "mongoose";

// MongoDB connection
mongoose.connect("mongodb+srv://networknexusMERN:WGKonEqRljv3RlIs@networknexus.wnx9c9d.mongodb.net/alumniNetwork?retryWrites=true&w=majority&appName=NetworkNexus", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const studentSchema = new mongoose.Schema({
    fullName: String,
    PRN: String,
    department: String,
    studyYear: String,
    phoneNumber: String,
  });
  
  const Student = mongoose.model("Student", studentSchema);
  
  // Manually defined students
  const manualStudents = [
    {
      fullName: "Abhi Trambadiya",
      PRN: "2324000344",
      department: "AIML",
      studyYear: "SE",
      phoneNumber: "8767816240",
    },
    {
      fullName: "Tanish Patgaonkar",
      PRN: "2324000399",
      department: "AIML",
      studyYear: "SE",
      phoneNumber: "8329259944",
    },
    {
      fullName: "Shiv Pardeshi",
      PRN: "2324000413",
      department: "AIML",
      studyYear: "SE",
      phoneNumber: "9782435617",
    },
    {
      fullName: "Atharva Shewale",
      PRN: "2324000613",
      department: "AIML",
      studyYear: "SE",
      phoneNumber: "8762456190",
    },
    {
      fullName: "Tanishq Jain",
      PRN: "2324000422",
      department: "AIML",
      studyYear: "SE",
      phoneNumber: "7862314235",
    },
  ];
  
  // Insert into DB
  Student.insertMany(manualStudents)
    .then(() => {
      console.log("✅ Manual student data inserted successfully!");
      mongoose.disconnect();
    })
    .catch((err) => {
      console.error("❌ Error inserting students:", err);
      mongoose.disconnect();
    });