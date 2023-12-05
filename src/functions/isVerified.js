// getConditions.js
import { supabase } from '../SupaBaseClient';

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