import { supabaseCustomSchema as supabase } from '../SupaBaseClient';

const maindataTable = 'maindata';

const updateData = async (id, fieldName, value) => {
  try {
    const { data, error } = await supabase
      .from(maindataTable)
      .update({ [fieldName]: value })
      .eq('id', id);

    if (error) {
      throw new Error('Error updating profile');
    }

    console.log('Updated profile:', data);
    // TODO: Handle the success case here
    // Perform any necessary actions or display a success message
  } catch (error) {
    console.error('Error updating profile:', error);
    // TODO: Handle the error case here
    // Perform any necessary error handling or display an error message
  }
};

export default updateData
