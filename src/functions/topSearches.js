import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, SCHEMA_NAME } from '../config.js';
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {db: {schema: SCHEMA_NAME} });
const maindataTable = 'topsearches';