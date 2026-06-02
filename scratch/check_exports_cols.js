const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCols() {
  const { data, error } = await supabase
    .from('export_logs')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Row:', data[0] || 'No rows');
    if (data[0]) {
      console.log('Columns:', Object.keys(data[0]));
    }
  }
}

checkCols();
