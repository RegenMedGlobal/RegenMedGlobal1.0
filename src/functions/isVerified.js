// getConditions.js

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const isVerified = async (maindataId) => {
  try {
    // Query the claimed_data table to check if the maindata_id exists
    const { data, error } = await supabase
      .from('claimed_data')
      .select('maindata_id')
      .eq('maindata_id', maindataId);

    if (error) {
      throw error;
    }

    // If data exists, it means the maindata_id exists in the claimed_data table
    // Return true in this case, indicating verification
    return data.length > 0;
  } catch (error) {
    console.error('Error checking verification:', error);
    return false; // Return false in case of an error
  }
};

export default isVerified;