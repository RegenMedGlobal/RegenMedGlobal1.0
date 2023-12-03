import { supabase } from '../../../SupaBaseClient';

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