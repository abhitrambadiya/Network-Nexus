import Alumni from '../../models/Admin/addAlumni.js';
import { getCoordinates } from '../../services/geocodingService.js';
import { sendWelcomeEmail } from '../../services/emailService.js';

/**
 * Add a single alumni record
 */
const addSingleAlumni = async (req, res) => {
  try {
    const {
      prn,
      fullName,
      email,
      password,
      phoneNumber,
      department,
      passOutYear,
      position,
      companyName,
      location,
      successStory,
      specialAchievements,
      linkedInURL,
      hallOfFame,
      skills,
    } = req.body;

    // Check if alumni with same PRN or email already exists
    const existingAlumni = await Alumni.findOne({
      $or: [{ prn }, { email }]
    });

    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: existingAlumni.prn === prn 
          ? 'PRN already exists' 
          : 'Email already exists'
      });
    }

    // Get coordinates for the location
    const { latitude, longitude } = await getCoordinates(location);

    // Create new alumni record
    const newAlumni = new Alumni({
      prn,
      fullName,
      email,
      password, // Will be hashed by pre-save hook
      phoneNumber: phoneNumber,
      department,
      passOutYear: parseInt(passOutYear),
      jobPosition: position,
      companyName: companyName,
      location,
      latitude,
      longitude,
      successStory: successStory,
      specialAchievements,
      linkedInURL,
      hallOfFame,
      skills,
      isVerified: true // Admin-added alumni are verified by default
    });

    // Save alumni to database
    const savedAlumni = await newAlumni.save();

    // Send welcome email
    await sendWelcomeEmail(savedAlumni, password);

    res.status(201).json({
      success: true,
      message: 'Alumni added successfully',
      data: {
        id: savedAlumni._id,
        prn: savedAlumni.prn,
        fullName: savedAlumni.fullName,
        email: savedAlumni.email
      }
    });
  } catch (error) {
    console.error('Error adding alumni:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add alumni',
      error: error.message
    });
  }
};

export { addSingleAlumni };