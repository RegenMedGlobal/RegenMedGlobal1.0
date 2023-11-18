import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, SCHEMA_NAME } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {db: {schema: SCHEMA_NAME} });
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
