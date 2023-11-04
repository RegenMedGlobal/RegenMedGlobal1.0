// getConditions.js

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const isVerified = async (maindataId) => {
  try {
    // Query the claimed_data table to check if the maindata_id exists
    console.log(maindataId)
    const { data, error } = await supabase
      .from('maindata')
      .select('isVerified')
      .eq('id', maindataId)
      .single();

    if (error) {
      throw error;
    }

    console.log(data)

    // If data exists, it means the maindata_id exists in the claimed_data table
    // Return true in this case, indicating verification
    return data.isVerified;
  } catch (error) {
    console.error('Error checking verification:', error);
    if(!error.code) {
      // return false; // Return false in case of an error
    }
    
  }
};

export default isVerified;