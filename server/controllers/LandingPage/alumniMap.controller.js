import AlumniMap from '../../models/LandingPage/alumniMap.model.js';

export const getMapAlumniData = async (req, res) => {
  try {
    const locations = await AlumniMap.aggregate([
      {
        $match: {
          latitude: { $exists: true, $ne: null },
          longitude: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$location',
          alumniCount: { $sum: 1 },
          latitude: { $first: '$latitude' }, // Directly access the fields
          longitude: { $first: '$longitude' },
          sampleAlumni: {
            $push: {
              fullName: '$fullName',
              jobPosition: '$jobPosition',
              companyName: '$companyName'
            }
          }
        }
      },
      {
        $project: {
          location: '$_id',
          position: ["$latitude", "$longitude"], // Create array here
          alumniCount: 1,
          alumni: { $slice: ['$sampleAlumni', 3] }
        }
      }
    ]);

    res.json({
      success: true,
      data: locations.filter(loc => loc.position[0] && loc.position[1]) // Filter valid positions
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data'
    });
  }
};