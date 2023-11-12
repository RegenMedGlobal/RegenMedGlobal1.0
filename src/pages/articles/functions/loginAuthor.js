import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';



const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

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
