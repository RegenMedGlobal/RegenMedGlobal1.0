import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, tom, SCHEMA_NAME } from '../config.js';
import axios from 'axios'
import geolib from 'geolib';
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {db: {schema: SCHEMA_NAME} });
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
 // console.log('selected options', selectedOptions)
  // Build a text search query with ILIKE filter for each selected checkbox option
    const optionSearchText = selectedOptions.map(option => `'%${option.value}%'`).join(' & ');
 // console.log('Checkbox Options Query Text:', optionSearchText); // Debugging log

  const { data: checkboxResults, error: checkboxError } = await supabase
      .from(maindataTable)
    .select()
    .textSearch('treatments', optionSearchText)
    .limit(150);

//  console.log('Checkbox Options Query Result:', checkboxResults); // Debugging log

  if (checkboxError) {
    console.error('Error executing checkboxOptions query:', checkboxError);
    return { error: 'Internal Server Error' };
  }

 // console.log('checkbox results', checkboxResults)

  combinedResults = [...combinedResults, ...checkboxResults];
}



    // Query 2: Search by filterTerm (if present)
   // Query 2: Search by filterTerm (if present)
if (filterTerm && filterTerm.trim() !== '') {
  const searchWords = filterTerm.split(/\s+/).filter(word => word.length > 0);

 // console.log('search words:', searchWords)

  // Initialize an array to store results for each word search
  const wordSearchResults = [];

  // Perform a text search for each word and collect the results
  for (const word of searchWords) {
 //   console.log('word: ', word)
    const wordSearchText = `'%${word}%'`;
 //   console.log('Word Search Text:', wordSearchText); // Debugging log
    const { data: wordFilterResults, error: wordFilterError } = await supabase
      .from(maindataTable)
      .select()
      .textSearch('conditions', wordSearchText)
      .limit(150);

    if (wordFilterError) {
      console.error('Error executing filterTerm query:', wordFilterError);
      return { error: 'Internal Server Error' };
    }

    wordSearchResults.push(...wordFilterResults);

    console.log('word filtered results:', wordFilterResults)
  }

  // Combine the results from all word searches
  combinedResults = [...combinedResults, ...wordSearchResults];
}

 //  console.log('combined results:', combinedResults)

    

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

     // console.log('combined results:', combinedResults)

    // Filter the data
    const filteredData = combinedResults.filter(item => {
     // console.log('item', item)
      const conditions = item.conditions || '';
      const treatments = item.treatments || '';

    //  console.log('item: ', item, 'treatments: ', item.treatments)

    //  console.log('treatments', treatments)
  

      // Check if the conditions include the filter term
      const filterWords = filterTerm
     ? filterTerm.split(/\s+/).map(word => word.toLowerCase())
     : [];
   
      const conditionsMatch = filterWords.length === 0 // No filter term
      ? true // Return true if no filter term provided
     : conditions.toLowerCase().split(/\s+/).some(conditionWord => {
      return filterWords.some(filterWord => conditionWord.includes(filterWord));
      });


    //  console.log(`filterterm: ${filterTerm}, Item: ${item.conditions}, Conditions Match: ${conditionsMatch}`);



      // Check if any of the checkbox options are selected and included in the treatments
      const optionsMatch = selectedOptions.every(option =>
        treatments.toLowerCase().includes(option.value.toLowerCase())
      );

     // console.log('options match: ', optionsMatch, 'item: ', item.treatments);

    // console.log('combined results:', combinedResults)

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
     //  console.log('Item filtered:', item, conditionsMatch, optionsMatch, distanceInMiles);

        // Use a ternary expression to conditionally include conditionsMatch
     //  console.log('filterterm: ',filterTerm)
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

    console.log('Filtered Rows:', filteredData);
    localStorage.setItem('lengthFilter', filteredData ? filteredData.length : 0);

    setPercent(100); // Set loading progress to 100% when data is fetched

    return { data: filteredData };
  } catch (error) {
    console.error('Error executing query:', error);
    setPercent(0); // Set loading progress to 0
    return { error: 'Internal Server Error' };
  }
};



export default getData;