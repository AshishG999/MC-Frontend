import axios from 'axios';

// Function to call /property/find
export const findProperty = async ({ searchValue, productId, area }) => {
  try {
    const response = await axios.post('https://safebridge.urbanpillar.com/api/property/find', {
      searchValue,
      productId,
      area
    });

    // Access the data
    const { property, totalproperty } = response.data;

    return { property, totalproperty };
  } catch (error) {
    throw error;
  }
};