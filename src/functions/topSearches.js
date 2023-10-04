import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchTopSearches() {
  try {
    const { data, error } = await supabase
      .from('topsearches')
      .select('searchterm')
      .order('count', { ascending: false })
      .limit(20); // Adjust the limit as needed to get the top terms.

    if (error) {
      throw error;
    }

    // Extract and clean up the search terms
    const searchTerms = data.map((row) => row.searchterm.trim());

    // Remove duplicates (case-insensitive) and empty strings
    const uniqueSearchTerms = [...new Set(searchTerms.filter(term => term !== ''))];

    return uniqueSearchTerms;
  } catch (error) {
    console.error('Error fetching top searches:', error);
    return [];
  }
}