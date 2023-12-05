import { supabaseCustomSchema as supabase } from '../SupaBaseClient';

// Function to insert a new search term into the topsearches table
const insertTopSearch = async (searchTerm) => {
  try {
    console.log('Inserting search term:', searchTerm);

    // Check if the search term already exists in the table
    const { data: existingSearchTerms, error: searchError } = await supabase
      .from('topsearches')
      .select('id, count')
      .eq('searchterm', searchTerm);

    if (searchError) {
      console.log('Error checking existing search term:', searchError.message);
      return;
    }

    console.log('Existing search terms:', existingSearchTerms);

    if (existingSearchTerms.length === 0) {
      console.log('Search term does not exist, inserting with count = 1');

      // Search term does not exist, insert it with count = 1
      const { data: insertedSearchTerm, error: insertError } = await supabase
        .from('topsearches')
        .insert({ searchterm: searchTerm, count: 1 });

      if (insertError) {
        console.log('Error inserting search term:', insertError.message);
        return;
      }

      console.log('Search term inserted successfully:', insertedSearchTerm);
    } else {
      console.log('Search term already exists, updating count');

      // Search term already exists, update the count
      const existingSearchTerm = existingSearchTerms[0];
      const { data: updatedSearchTerm, error: updateError } = await supabase
        .from('topsearches')
        .update({ count: existingSearchTerm.count + 1 })
        .eq('id', existingSearchTerm.id);

      if (updateError) {
        console.log('Error updating search term:', updateError.message);
        return;
      }

      console.log('Search term updated successfully:', updatedSearchTerm);
    }
  } catch (error) {
    console.log('Error inserting/updating search term:', error.message);
  }
};

export default insertTopSearch;