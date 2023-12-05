import axios from 'axios'
import localforage from 'localforage';
import { supabaseCustomSchema as supabase } from '../SupaBaseClient';

const maindataTable = 'maindata';

const geocodeCity = async (city, state, country) => {
  try {
    const address = `${city}, ${state}, ${country}`;
    const encodedAddress = encodeURIComponent(address);

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
    );

    const results = response.data;
 //   console.log('geocode results:', results);

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


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusMiles = 3958.8; // Earth's radius in miles

  const toRadians = degrees => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceMiles = earthRadiusMiles * c;

  return distanceMiles;
};

const getData = async (filterTerm, checkboxOptions, city, state, country, maxDistance = 25, setPercent) => {
  console.log('Executing getData...');
  console.log('Filter term from getData:', filterTerm);
  console.log('Checkbox options:', checkboxOptions);

  try {
    // Initialize an empty array to store the results
    let combinedResults = [];

    // Query 1: Search by checkboxOptions
    const selectedOptions = checkboxOptions.filter(option => option.checked);
    if (selectedOptions.length > 0) {
      // Build a text search query with ILIKE filter for each selected checkbox option
      const optionSearchText = selectedOptions.map(option => `'%${option.value}%'`).join(' & ');

      const { data: checkboxResults, error: checkboxError } = await supabase
        .from(maindataTable)
        .select()
        .textSearch('treatments', optionSearchText)
        .limit(2000);

      console.log('Checkbox Options Query Result:', checkboxResults); // Debugging log

      if (checkboxError) {
        console.error('Error executing checkboxOptions query:', checkboxError);
        return { error: 'Internal Server Error' };
      }

      console.log('checkbox results', checkboxResults)

      combinedResults = [...combinedResults, ...checkboxResults];
    }

    // Query 2: Search by filterTerm (if present)
 // Query 2: Search by filterTerm and checkboxOptions (if filterTerm is present or at least one checkbox option is selected)
if (filterTerm && filterTerm.trim() !== '') {
  const selectedOptions = checkboxOptions.filter(option => option.checked);
  if (selectedOptions.length > 0) {
    const searchWords = filterTerm.split(/\s+/).filter(word => word.length > 0);
    const wordSearchPromises = searchWords.map(async word => {
      const wordSearchText = `'%${word}%'`;
      const { data: wordFilterResults, error: wordFilterError } = await supabase
        .from(maindataTable)
        .select()
        .textSearch('conditions', wordSearchText)
        .limit(200);

      if (wordFilterError) {
        console.error('Error executing filterTerm query:', wordFilterError);
        return [];
      }

      return wordFilterResults;
    });

    const wordSearchResults = await Promise.all(wordSearchPromises);
    const flattenedResults = wordSearchResults.flat();

    combinedResults = [...combinedResults, ...flattenedResults];
  }
}

    console.log('combined results:', combinedResults);

    // Geocode the provided city, state, country
    const cityLocation = await geocodeCity(city, state, country);
    console.log('Geocoded city location:', cityLocation);

    if (!cityLocation) {
      console.log('Invalid location:', city, state, country);
      return { error: 'Invalid location' };
    }

    const cityLatitude = cityLocation.latitude;
    const cityLongitude = cityLocation.longitude;

    console.log('City latitude:', cityLatitude);
    console.log('City longitude:', cityLongitude);

    // Filter the data
    const filteredData = combinedResults.filter(item => {
      const conditions = item.conditions || '';
      const treatments = item.treatments || '';

      // Check if the conditions include the filter term
      const filterWords = filterTerm
        ? filterTerm.split(/\s+/).map(word => word.toLowerCase())
        : [];

      const conditionsMatch = filterWords.length === 0 // No filter term
        ? false // Return true if no filter term provided
        : conditions.toLowerCase().split(/\s+/).some(conditionWord => {
          return filterWords.some(filterWord => conditionWord.includes(filterWord));
        });

      // Check if any of the checkbox options are selected and included in the treatments
      const optionsMatch = selectedOptions.every(option =>
        treatments.toLowerCase().includes(option.value.toLowerCase())
      );

      const latitude = parseFloat(item.latitude);
      const longitude = parseFloat(item.longitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const distanceInMiles = calculateDistance(
          latitude,
          longitude,
          parseFloat(cityLatitude),
          parseFloat(cityLongitude)
        );

        // Debugging log to see which items pass the filtering conditions
        // console.log('Item filtered:', item, optionsMatch, distanceInMiles);

        // Use a ternary expression to conditionally include conditionsMatch
        return filterTerm
          ? conditionsMatch && optionsMatch && distanceInMiles <= maxDistance
          : optionsMatch && distanceInMiles <= maxDistance;
      }

      // Progress tracking for each filtered item
      setPercent(percent => {
        const progressStep = 100 / combinedResults.length;
        return percent + progressStep;
      });

      return false;
    });

    // Deduplicate the filtered data based on a unique identifier (e.g., 'id')
    const uniqueResults = [];
    const uniqueIds = new Set();

    for (const result of filteredData) {
      if (!uniqueIds.has(result.id)) {
        uniqueResults.push(result);
        uniqueIds.add(result.id);
      }
    }

console.log('filter term: ', filterTerm)
    console.log('Filtered and Deduplicated Results:', uniqueResults);

    // Store or use the uniqueResults as needed

    setPercent(100); // Set loading progress to 100% when data is fetched

    return { data: uniqueResults };
  } catch (error) {
    console.error('Error executing query:', error);
    setPercent(0); // Set loading progress to 0
    return { error: 'Internal Server Error' };
  }
};

export default getData;