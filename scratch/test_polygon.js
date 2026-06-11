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

async function testUpdate() {
  // Try to update shape_type of a field to 'polygon'
  const { data: fields } = await supabase.from('template_fields').select('id').limit(1);
  if (!fields || fields.length === 0) {
    console.log("No fields found to test");
    return;
  }
  const fieldId = fields[0].id;
  console.log("Testing update on field ID:", fieldId);

  // Try dry-run update
  const { data, error } = await supabase
    .from('template_fields')
    .update({ shape_type: 'polygon' })
    .eq('id', fieldId)
    .select();

  if (error) {
    console.error("Update failed (shape_type might be constrained):", error.message);
  } else {
    console.log("Update succeeded! Data:", data);
    // Revert it back to 'rect'
    await supabase.from('template_fields').update({ shape_type: 'rect' }).eq('id', fieldId);
    console.log("Reverted successfully");
  }
}

testUpdate();
