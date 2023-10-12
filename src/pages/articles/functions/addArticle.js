import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';


const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const addArticleToSupabase = async (articleData) => {
  try {
    const { error } = await supabase.from('articles').upsert([articleData]);

    if (error) {
      console.error('Error adding article:', error);
      return { success: false, message: 'Error adding article' };
    } else {
      console.log('Article added successfully');
      return { success: true, message: 'Article added successfully' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Error adding article' };
  }
};

export default addArticleToSupabase;
