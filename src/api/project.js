import axios from 'axios';

// Function to call /property/find
export const findProperty = async ({ searchValue}) => {
  try {
    // const response = await axios.post('http://localhost:8000/api/property', {
    const response = await axios.post('https://safebridge.urbanpillar.com/api/property', {
      searchValue,
      listingType: 'residential'
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};