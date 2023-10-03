import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, SCHEMA_NAME } from '../config.js';
import { get } from 'react-hook-form';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {db: {schema: SCHEMA_NAME} });
const maindataTable = 'maindata';

const getProfile = async (id) => {
  try {
    // Retrieve the profile by ID
    const { data: profile, error } = await supabase
      .from(maindataTable)
      .select('name, description, conditions, treatments, website, address, email, phone, id, state, country, zipCode')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error retrieving profile:', error);
      return { error: 'Failed to retrieve profile' };
    }

    if (!profile) {
      return { error: 'Profile not found' };
    }

    // Return the profile data
    return profile;
  } catch (error) {
    console.error('Error retrieving profile:', error);
    return { error: 'Failed to retrieve profile' };
  }
};

export default getProfile
