import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';


const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const fetchArticleData = async (uuid) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('authorId', uuid) // Assuming 'id' is the field in the 'articles' table that represents the unique ID
      .eq('recordStatus', true); 

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, message: 'Error fetching article.' };
    } else {
      console.log('Fetched article data:', data);
      return { success: true, message: 'Article fetched successfully', articleData: data };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'An error occurred while fetching the article.' };
  }
};

export default fetchArticleData;