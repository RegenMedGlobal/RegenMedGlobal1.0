import { supabaseCustomSchema as supabase } from '../SupaBaseClient';

const maindataTable = 'maindata';

// Function to hash the password using Web Crypto API
const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const loginUser = async ({ email, password }) => {
  try {
    // Validate the email and password
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    // Retrieve the user from the database based on the email (case-insensitive)
    const { data: users, error: retrievalError } = await supabase
      .from(maindataTable)
      .select()
      .ilike('email', email)
      .limit(2); // Limit the query to 2 records

    if (retrievalError) {
      throw new Error('Error retrieving user from the database.');
    }

    if (!users || users.length === 0) {
      throw new Error('Invalid email or password. Please check your email and password.');
    }

    if (users.length > 1) {
      throw new Error('Multiple users found with the same email. Please contact support.');
    }

    const user = users[0]; // Access the first user in the array

    // Get the salt used to hash the stored password
    const storedSalt = user.password_salt;

    if (user.password === null) {
      // Password is null in the database
      throw new Error('Password is not set for this user. Please reset your password.');
    }

    // Hash the provided password with the stored salt
    const hashedPassword = await hashPassword(password, storedSalt);

    // Compare the hashed passwords
    const passwordMatch = hashedPassword === user.password;

    if (!passwordMatch) {
      throw new Error('Invalid email or password. Please check your email and password.');
    }

    // Construct the user data to include in the response
    const userData = {
      userId: user.id, // Assuming there is an 'id' property in the user object
      // Other user data properties...
    };

    return userData;
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // Throw the specific error from loginUser
  }
};

export default loginUser;
