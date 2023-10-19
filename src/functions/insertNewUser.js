import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, EMAILJS_API_KEY, SCHEMA_NAME } from '../config.js';
import axios from 'axios';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: SCHEMA_NAME } });
const maindataTable = 'maindata';

import emailjs from 'emailjs-com';

// import { Mandrill } from 'mandrill-api';



// Initialize EmailJS with your User ID
emailjs.init(EMAILJS_API_KEY);

const generateSalt = () => {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const geocodeCity = async (city, state, country) => {
  try {
    const address = `${city}, ${state}, ${country}`;
    const encodedAddress = encodeURIComponent(address);

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
    );

    const results = response.data;

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


export const resetPassword = async(data, id) => {
  try {
    console.log("Entered")
    console.log(data)
    console.log(id)
    // Generate a random salt for password hashing
    const salt = generateSalt();

    // Hash the password
    const hashedPassword = await hashPassword(data.password, salt);

    const { error } = await supabase
                          .from('maindata')
                          .update({ password: hashedPassword, password_salt: salt })
                          .eq('id', id);
    
    return true;

  }catch(e) {
    console.log("Error ", e)
  }
  return false
}

export const insertNewUser = async (userData) => {
  try {
    const {
      clinicName,
      description,
      conditions,
      treatments,
      address,
      country,
      city,
      state,
      phone,
      email,
      password,
    } = userData;

    // Check if the email is already used in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from(maindataTable)
      .select('email') // Specify the columns you want to retrieve (e.g., 'email')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Email already exists in the database, throw an error
      const error = new Error('Email already in use. Please choose a different email address.');
      error.name = 'EmailExistingError';
      throw error;
    }

    // Generate a random 7-digit number as the id
    const id = Math.floor(Math.random() * 9000000) + 1000000;

    // Generate a random salt for password hashing
    const salt = generateSalt();

    // Hash the password
    const hashedPassword = await hashPassword(password, salt);

    // Geocode the city, state, and country to get the latitude and longitude
    const userCoordinates = await geocodeCity(city, state, country);
    if (!userCoordinates) {
      const error = new Error('Invalid location');
      error.name = 'LocationError';
      throw error;
    }

    // Prepare the data to be inserted, explicitly adding the 'salt' property
    const newData = {
      id: id,
      name: clinicName,
      description: description,
      conditions: conditions,
      treatments: treatments,
      address: address,
      city: city,
      country: country,
      state: state,
      phone: phone,
      email: email,
      password: hashedPassword,
      password_salt: salt, // Use the correct column name 'password_Salt
      latitude: userCoordinates.latitude,
      longitude: userCoordinates.longitude,
      created_at: new Date().toISOString(),
    };

    // Insert data into the "maindata" table using Supabase
    const { data, error } = await supabase.from(maindataTable).insert([newData]);

    if (error) {
      throw new Error('Failed to insert data');
    }

    console.log('Data inserted successfully:', data);




    return { message: 'Data inserted successfully' };
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error; // Throw the specific error from insertNewUser
  }
};

export const isEmailAlreadyInDB = async (email) => {

  try {

    const { data: existingUser, error: fetchError } = await supabase
      .from(maindataTable)
      .select('email') // Specify the columns you want to retrieve (e.g., 'email')
      .eq('email', email)
      .single();
    
    if(fetchError) {
      return false;
    }

    if (existingUser) {
      return true;
    }
  } catch (error) {
    console.error("Error in checking email: ", error);
    throw error;
  }

  return false;
}
