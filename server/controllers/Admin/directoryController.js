import Alumni from '../../models/Admin/directory.js';

export const adminDirectory = async (req, res) => {
  try {
    const directory = await Alumni.find(
      {}, // No filter – fetch all alumni
      {
        _id: 0,
        fullName: 1,
        email: 1,
        prn: 1,
        department: 1,
        passOutYear: 1,
        jobPosition: 1,
        companyName: 1,
        location: 1,
        latitude: 1,
        longitude: 1,
        successStory: 1,
        linkedInURL: 1,
        phoneNumber: 1,
        skills: 1,
        role: 1,
        specialAchievements: 1,
        isVerified: 1,
        createdAt: 1,
        updatedAt: 1
      }
    );

    res.json(directory);
  } catch (error) {
    console.error('Error fetching admin directory:', error);
    res.status(500).json({ error: "Failed to fetch directory" });
  }
};
