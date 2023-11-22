import { createClient } from '@supabase/supabase-js';
import { SUPABASE_API_KEY, SUPABASE_URL } from '../../config';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

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
const insertNewAuthor = async (authorData) => {
  try {
    const {
      authorName,
      email,
      password, // Include the password as plain text
      bio,
      facebookLink,
      twitterLink,
      instagramLink,
      youtubeLink,
    } = authorData;

    // Check if the email is already used in the database
    const { data: existingAuthor, error: fetchError } = await supabase
      .from('author_data')
      .select('email')
      .eq('email', email)
      .single();

     if (existingAuthor) {
      // Email already exists in the database, log a message and throw an error
      console.log('Email already in use. Please choose a different email address.');
      const error = new Error('Email already in use. Please choose a different email address.');
      error.name = 'EmailExistingError';
      throw error;
    }

    // Generate a unique ID for the author
     // Generate a unique ID for the author

     const id = Math.floor(Math.random() * 9000000) + 1000000;

    const authorId = 'A' + id


    // Generate a random salt for password hashing
    const salt = generateSalt();

    // Hash the password
    const hashedPassword = await hashPassword(password, salt);

    // Prepare the data to be inserted into the "author_data" table
    const newAuthorData = {
      id: id,
      authorId: authorId,
      authorName: authorName,
      email: email,
      password: hashedPassword, // Use the hashed password
      password_salt: salt, // Use the salt
      bio: bio,
      facebookLink: facebookLink,
      twitterLink: twitterLink,
      instagramLink: instagramLink,
      youtubeLink: youtubeLink,
    };

    // Insert data into the "author_data" table using Supabase
    const { data, error } = await supabase.from('author_data').insert([newAuthorData]);

    if (error) {
      throw new Error('Failed to insert author data');
    }

    console.log('Author data inserted successfully:', data);

    return { message: 'Author data inserted successfully' };
  } catch (error) {
    console.error('Error inserting author data:', error);
    throw error;
  }
};

export default insertNewAuthor;