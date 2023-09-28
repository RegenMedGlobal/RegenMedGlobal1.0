import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, SCHEMA_NAME } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {db: {schema: SCHEMA_NAME} });
const maindataTable = 'maindata';

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

const updateUserPassword = async (email, newPassword) => {
  try {
    // Fetch the user data based on their email
    const { data: user } = await supabase
      .from(maindataTable)
      .select('password_salt')
      .eq('email', email)
      .single();

    if (!user) {
      // User not found with the provided email
      throw new Error('User not found');
    }

    // Generate a new salt for the password update
    const salt = generateSalt();

    // Hash the new password with the new salt
    const hashedPassword = await hashPassword(newPassword, salt);

    // Update the user's password and salt in Supabase
    const { error: updateError } = await supabase
      .from(maindataTable)
      .update({
        password: hashedPassword,
        password_salt: salt,
      })
      .eq('email', email);

    if (updateError) {
      throw new Error('Password update failed');
    }

    return { message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error updating password:', error);
    throw error; // Throw the specific error from updateUserPassword
  }
};

export default updateUserPassword;
