// getConditions.js

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getConditions(filterTerm = '') {
  try {
    let query = supabase.from('conditions').select('primary_name');

    // Apply a filter if a filter term is provided
    if (filterTerm) {
      query = query.filter('primary_name', 'ilike', `%${filterTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Extract and clean up the primary names
    const primaryNames = data.map((row) => row.primary_name.trim());

    // Remove duplicates (case-insensitive) and empty strings
    // const uniquePrimaryNames = [...new Set(primaryNames.filter(name => name !== ''))];

    // Log the fetched conditions data
    // console.log('Fetched Conditions:', uniquePrimaryNames);

    return primaryNames;
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return [];
  }
}
