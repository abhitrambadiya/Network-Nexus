import alumniSuccessStories from '../../models/LandingPage/alumniSuccessStories.js';

export const getSuccessStories = async (req, res) => {
  try {
    const stories = await alumniSuccessStories.find(
      { successStory: { $exists: true } },
      { _id: 0, fullName: 1, jobPosition: 1, passOutYear: 1, successStory: 1 }
    );
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};