import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;
const SCHEMA_NAME = process.env.REACT_APP_SUPABASE_SCHEMA_NAME;

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export const supabaseCustomSchema = createClient(SUPABASE_URL, SUPABASE_API_KEY, { db: { schema: SCHEMA_NAME } });
