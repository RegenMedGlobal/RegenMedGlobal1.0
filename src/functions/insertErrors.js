import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, SCHEMA_NAME } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {db: {schema: SCHEMA_NAME} });
const errorLogTable = 'error_log';

const insertErrorLog = async (error, additionalInfo) => {
    try {
      // Prepare the data to be inserted
      const newData = {
        error: error.message,
        message: error.name,
        created_at: new Date().toISOString(),
        additionalInfo,
      };
  
      // Insert data into the "error_log" table using Supabase
      const { data, error: insertError } = await supabase
        .from(errorLogTable)
        .insert([newData]);
  
      if (insertError) {
        console.error('Failed to insert error log:', insertError);
      } else {
        console.log('Error log inserted successfully:', data);
      }
    } catch (error) {
      console.error('Error inserting error log:', error);
    }
  };
  

export default insertErrorLog;
