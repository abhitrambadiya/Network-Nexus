import Mentorship from '../../models/Admin/mentorship.js';

// Get all programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Mentorship.find();
    
    // Transform data to include only the required fields
    const transformedPrograms = programs.map(program => ({
      _id: program._id,
      title: program.title,
      description: program.description,
      fullName: program.fullName,
      jobPosition: program.jobPosition,
      companyName: program.companyName,
      mode: program.mode,
      date: program.date,
      targetAudience: program.targetAudience,
      studyYear: program.studyYear,
      department: program.department,
      limit: program.limit,
      isApproved: program.isApproved,
      isMarkedAsComplete: program.isMarkedAsComplete
    }));

    res.status(200).json({
      success: true,
      count: transformedPrograms.length,
      data: transformedPrograms
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
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

    // Transform for frontend compatibility with required fields
    const transformedProgram = {
      _id: program._id,
      title: program.title,
      description: program.description,
      fullName: program.fullName,
      jobPosition: program.jobPosition,
      companyName: program.companyName,
      mode: program.mode,
      date: program.date,
      targetAudience: program.targetAudience,
      studyYear: program.studyYear,
      department: program.department,
      limit: program.limit,
      isApproved: program.isApproved,
      isMarkedAsComplete: program.isMarkedAsComplete
    };

    res.status(200).json({
      success: true,
      data: transformedProgram
    });
  } catch (error) {
    console.error('Error approving program:', error);
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

    // Transform for frontend compatibility with required fields
    const transformedProgram = {
      _id: program._id,
      title: program.title,
      description: program.description,
      fullName: program.fullName,
      jobPosition: program.jobPosition,
      companyName: program.companyName,
      mode: program.mode,
      date: program.date,
      targetAudience: program.targetAudience,
      studyYear: program.studyYear,
      department: program.department,
      limit: program.limit,
      isApproved: program.isApproved,
      isMarkedAsComplete: program.isMarkedAsComplete
    };

    res.status(200).json({
      success: true,
      data: transformedProgram
    });
  } catch (error) {
    console.error('Error marking program complete:', error);
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