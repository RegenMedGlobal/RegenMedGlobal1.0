// getConditions.js

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getConditions() {
  try {
    const { data, error } = await supabase
      .from('conditions')
      .select('primary_name');

    if (error) {
      throw error;
    }

    // Extract and clean up the primary names
    const primaryNames = data.map((row) => row.primary_name.trim());

    // Remove duplicates (case-insensitive) and empty strings
    const uniquePrimaryNames = [...new Set(primaryNames.filter(name => name !== ''))];

    // Log the fetched conditions data
    console.log('Fetched Conditions:', uniquePrimaryNames);

    return uniquePrimaryNames;
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return [];
  }
}
