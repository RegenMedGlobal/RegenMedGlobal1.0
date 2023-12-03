import { supabaseCustomSchema as supabase } from '../SupaBaseClient';

const maindataTable = 'maindata';

const getProfile = async (id) => {
  try {
    // Retrieve the profile by ID
    const { data: profile, error } = await supabase
      .from(maindataTable)
      .select('name, description, conditions, treatments, website, address, city,  email, phone, id, state, country, zipCode')
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
