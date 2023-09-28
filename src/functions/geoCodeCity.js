import axios from 'axios';


const geocodeCity = async (city, state, country) => {
    try {
      const address = `${city}, ${state}, ${country}`;
      const encodedAddress = encodeURIComponent(address);
  
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
      );
  
      const results = response.data;
      console.log('geocode results:', results);
  
      if (results && results.length > 0) {
        const result = results[0];
        const { lat, lon } = result;
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        console.log('No results found for the city:', city, state, country);
        return null;
      }
    } catch (error) {
      console.log('Error geocoding:', error);
      return null;
    }
  };
  
  export default geocodeCity