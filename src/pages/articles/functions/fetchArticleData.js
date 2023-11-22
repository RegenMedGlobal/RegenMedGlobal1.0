import { createClient } from '@supabase/supabase-js';
import { SUPABASE_API_KEY, SUPABASE_URL } from '../../config';

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