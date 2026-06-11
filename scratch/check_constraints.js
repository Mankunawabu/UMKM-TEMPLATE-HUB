const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkConstraints() {
  // Query to get all check constraints for the table
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_query: `
      SELECT tc.constraint_name, cc.check_clause 
      FROM information_schema.table_constraints tc 
      JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name 
      WHERE tc.table_name = 'template_fields'
    `
  });

  if (error) {
    console.error("RPC exec_sql not available or failed:", error.message);
    
    // Fallback: Query system tables directly via rest API using rpc if available, or just fetch some rows to check values
    console.log("Attempting direct schema queries or listing fields...");
    
    // Let's do another query using standard REST interface on pg_catalog if exposed, but usually it's not.
    // Let's print out a row from template_fields to see what values are there
    const { data: rows } = await supabase.from('template_fields').select('*').limit(5);
    console.log("Typical rows:", rows);
  } else {
    console.log("Check constraints on template_fields:", data);
  }
}

checkConstraints();
