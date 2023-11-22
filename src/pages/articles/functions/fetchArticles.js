import { createClient } from '@supabase/supabase-js';
import { SUPABASE_API_KEY, SUPABASE_URL } from '../../config';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const fetchArticles = async () => {
  try {
    const { data, error } = await supabase.from('articles').select('*');
    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export default fetchArticles