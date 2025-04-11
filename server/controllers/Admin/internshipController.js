// controllers/internshipController.js
import Internship from '../../models/Admin/internship.js';

// Get all internships
export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find();
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new internship
export const createInternship = async (req, res) => {
  try {
    const internship = new Internship(req.body);
    const savedInternship = await internship.save();
    res.status(201).json(savedInternship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.status(200).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve an internship
export const approveInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id, 
      { isApproved: true },
      { new: true }
    );
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.status(200).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark internship as complete
export const markInternshipComplete = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id, 
      { isMarkAsComplete: true },
      { new: true }
    );
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.status(200).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an internship
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.status(200).json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};