import { MongoClient } from 'mongodb';

const mentorshipPrograms = [
  {
    title: "Tech Leadership 101",
    description: "A mentorship program for aspiring tech leads focusing on leadership, communication, and technical guidance.",
    location: "online",
    image: "https://cdn.example.com/images/tech-leadership.jpg",
    prn: "2324000344",
    contact: "john.doe@example.com", // dummy contact, can be PRN-linked
    type: "Career",
    programType: "mentorship",
    isApproved: false,
    isMarkedAsComplete: false
  },
  {
    title: "Startup Bootcamp",
    description: "An intensive program to help students launch their own startup ideas with mentorship from real founders.",
    location: "offline",
    image: "https://cdn.example.com/images/startup-bootcamp.jpg",
    prn: "2324006969",
    contact: "jane.smith@example.com",
    type: "Technical",
    programType: "mentorship",
    isApproved: false,
    isMarkedAsComplete: false
  },
  {
    title: "AI Research Mentorship",
    description: "One-on-one mentorships with professors and researchers in AI & ML.",
    location: "online",
    image: "https://cdn.example.com/images/ai-research.jpg",
    prn: "2324000877",
    contact: "alan.turing@example.edu",
    type: "Technical",
    programType: "mentorship",
    isApproved: false,
    isMarkedAsComplete: false
  }
];

// MongoDB connection setup
const uri = 'mongodb+srv://networknexusMERN:WGKonEqRljv3RlIs@networknexus.wnx9c9d.mongodb.net/alumniNetwork?retryWrites=true&w=majority&appName=NetworkNexus';
const dbName = 'alumniNetwork'; // Replace this

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
