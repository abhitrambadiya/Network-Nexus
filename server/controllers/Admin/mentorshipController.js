// controllers/programController.js
import Mentorship from '../../models/Admin/mentorship.js';

// Get all programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Mentorship.find();
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Approve program
export const approveProgram = async (req, res) => {
  try {
    const program = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found'
      });
    }

    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Mark program as complete
export const markProgramComplete = async (req, res) => {
  try {
    const program = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { isMarkedAsComplete: true },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found'
      });
    }

    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete a program
export const deleteProgram = async (req, res) => {
  try {
    const program = await Mentorship.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};