import { MongoClient } from 'mongodb';

const mentorshipPrograms = [
  {
    fullName: "Abhi Trambadiya",
    jobPosition: "Backend Devloper",
    companyName: "Google",
    title: "Tech Leadership 101",
    description: "A mentorship program for aspiring tech leads focusing on leadership, communication, and technical guidance.",
    mode: "online",
    programType: "mentorship",
    targetAudience: "AIML students",
    date: "14th April 2025",
    studyYear: "SE",
    department: "AIML",
    limit: "80",
    isApproved: false,
    isMarkedAsComplete: false,
    participants: [
      {
        fullName: "Shiv Pardeshi",
        PRN: "2324000413",
        department: "AIML",
        studyYear: "SE",
        phoneNumber: "9782435617"
      },
      {
        fullName: "Aarav Mehta",
        PRN: "2324000421",
        department: "AIML",
        studyYear: "SE",
        phoneNumber: "9876543210"
      },
      {
        fullName: "Isha Sharma",
        PRN: "2324000432",
        department: "AIML",
        studyYear: "SE",
        phoneNumber: "9123456789"
      },
      {
        fullName: "Rohan Kulkarni",
        PRN: "2324000445",
        department: "AIML",
        studyYear: "SE",
        phoneNumber: "9988776655"
      },
      {
        fullName: "Tanvi Deshpande",
        PRN: "2324000456",
        department: "AIML",
        studyYear: "SE",
        phoneNumber: "9090909090"
      }
    ]
  }
];

// MongoDB connection setup
const uri = 'mongodb+srv://networknexusMERN:WGKonEqRljv3RlIs@networknexus.wnx9c9d.mongodb.net/alumniNetwork?retryWrites=true&w=majority&appName=NetworkNexus';
const dbName = 'alumniNetwork';

async function insertMentorshipPrograms() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const mentorshipsCollection = db.collection('mentorships');

    const result = await mentorshipsCollection.insertMany(mentorshipPrograms);
    console.log(`${result.insertedCount} mentorship programs added to 'mentorships' collection.`);
  } catch (error) {
    console.error("Error inserting mentorship programs:", error);
  } finally {
    await client.close();
  }
}

insertMentorshipPrograms();
