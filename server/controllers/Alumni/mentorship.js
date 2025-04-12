// controllers/mentorship.js
import AddMentorship from '../../models/Alumni/mentorship.js';

// Create a new Mentorship opportunity
export const createMentorship = async (req, res) => {
  try {
    const {
      title,
      description,
      mode,
      targetAudience,
      date,
      department,
      studyYear,
      limit,
      fullName,
      companyName,
      jobPosition
    } = req.body;

    // Get the alumni ID from the authenticated user
    const alumniId = req.alumni._id;

    // Create the new Mentorship
    const mentorship = new AddMentorship({
      title,
      description,
      mode,
      targetAudience,
      department,
      studyYear,
      limit: parseInt(limit, 10),
      date,
      alumniId,
      fullName,
      companyName,
      jobPosition,
      isApproved: false,
      isMarkedAsComplete: false,
      participants: []
    });

    await mentorship.save();

    return res.status(201).json({
      success: true,
      message: 'Mentorship opportunity created successfully',
      data: mentorship
    });
  } catch (error) {
    console.error('Error creating Mentorship:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Mentorship opportunity',
      error: error.message
    });
  }
};