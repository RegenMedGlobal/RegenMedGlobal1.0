import { supabase } from '../../../SupaBaseClient';

const addArticleToSupabase = async (articleData) => {
  try {
    const { data, error } = await supabase.from('articles').upsert([articleData]);
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, message: 'Error adding article.' };
    } else {
      console.log('Article added:', data);
      return { success: true, message: 'Article added successfully' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'An error occurred while adding the article.' };
  }
};



export default addArticleToSupabase;
