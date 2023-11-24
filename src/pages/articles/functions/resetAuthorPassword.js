import { SUPABASE_API_KEY, SUPABASE_URL } from '../../../config';
import { createClient } from '@supabase/supabase-js';

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

const resetAuthorPassword = async (authorEmail, newPassword) => {
  try {
    // Fetch author data by email
    const { data: authorData, error: fetchError } = await supabase
      .from('author_data')
      .select('*')
      .eq('email', authorEmail)
      .single();

    if (fetchError) {
      throw new Error('Error fetching author data');
    }

    if (!authorData) {
      throw new Error('Author not found');
    }

    // Generate a new random salt for password hashing
    const newSalt = generateSalt();

    // Hash the new password with the new salt
    const newHashedPassword = await hashPassword(newPassword, newSalt);

    // Update the author's password and salt in the database
    const { data: updateData, error: updateError } = await supabase
      .from('author_data')
      .update({
        password: newHashedPassword,
        password_salt: newSalt,
      })
      .eq('id', authorData.id);

    if (updateError) {
      throw new Error('Error updating author password');
    }

    console.log('Author password reset successfully:', updateData);

    return { message: 'Author password reset successfully' };
  } catch (error) {
    console.error('Error resetting author password:', error);
    throw error;
  }
};

export default resetAuthorPassword;
