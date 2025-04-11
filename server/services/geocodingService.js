import axios from 'axios';

/**
 * Get latitude and longitude for a given location using Nominatim (OpenStreetMap) API
 * No API key required, but has usage limits
 */
const getCoordinates = async (location) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'Alumni-Management-System/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon)
      };
    }
    
    // Default coordinates if location not found
    return {
      latitude: null,
      longitude: null
    };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    // Return null values if geocoding fails
    return {
      latitude: null,
      longitude: null
    };
  }
};

export { getCoordinates };