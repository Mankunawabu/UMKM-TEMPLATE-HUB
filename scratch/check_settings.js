import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSettings() {
  const { data, error } = await supabase.from('app_settings').select('*');
  if (error) {
    console.error('Error fetching settings:', error.message);
  } else {
    console.log('Settings:', data);
  }
}

checkSettings();
