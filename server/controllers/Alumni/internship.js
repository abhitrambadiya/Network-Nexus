// controllers/internshipController.js
import AddInternship from '../../models/Alumni/internship.js';

// Create a new internship opportunity
export const createInternship = async (req, res) => {
  try {
    const {
      title,
      company,
      mode,
      duration,
      stipend,
      limit,
      description,
      prerequisites,
      requiredSkills,
      deadline,
      alumniName,
      alumniCompany,
      alumniPosition
    } = req.body;

    // Get the alumni ID from the authenticated user
    const alumniId = req.alumni._id;

    // Create the new internship
    const internship = new AddInternship({
      title,
      company,
      mode,
      duration,
      stipend,
      limit: parseInt(limit, 10),
      description,
      prerequisites,
      requiredSkills,
      deadline,
      alumniId,
      alumniName,
      alumniCompany,
      alumniPosition,
      isApproved: false,
      isMarkAsComplete: false,
      participants: []
    });

    await internship.save();

    return res.status(201).json({
      success: true,
      message: 'Internship opportunity created successfully',
      data: internship
    });
  } catch (error) {
    console.error('Error creating internship:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create internship opportunity',
      error: error.message
    });
  }
};