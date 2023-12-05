import { supabase } from '../../../SupaBaseClient';

const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from (new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const loginAuthor = async (email, password) => {
  console.log("email from loginAuthor: ", email)
  try {
    const { data: authorData, error: fetchError } = await supabase
      .from('author_data')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError) {
      throw new Error('Error fetching author data');
    }

    if (!authorData) {
      throw new Error('Author not found');
    }

    const { password: storedPassword, password_salt } = authorData;
    const hashedPassword = await hashPassword(password, password_salt);

    if (hashedPassword === storedPassword) {
      return { success: true, authorData };
    } else {
      throw new Error('Incorrect password');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export default loginAuthor;
