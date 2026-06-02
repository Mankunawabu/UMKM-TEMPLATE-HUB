const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCols() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'export_logs' });
  if (error) {
    console.log("RPC get_table_columns failed, trying select...", error.message);
    const { data: d, error: e } = await supabase.from('export_logs').select('*').limit(1);
    console.log("Export logs sample:", d);
  } else {
    console.log("Columns:", data);
  }
}

checkCols();
