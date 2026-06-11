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

async function testColumn(columnName, testValue) {
  const { data: fields } = await supabase.from('template_fields').select('id').limit(1);
  if (!fields || fields.length === 0) {
    console.log("No fields to test");
    return;
  }
  const fieldId = fields[0].id;
  
  const updateData = {};
  updateData[columnName] = testValue;
  
  const { error } = await supabase
    .from('template_fields')
    .update(updateData)
    .eq('id', fieldId);
    
  if (error) {
    console.log(`Column '${columnName}' FAILED with error:`, error.message);
  } else {
    console.log(`Column '${columnName}' SUCCEEDED!`);
  }
}

async function runTests() {
  console.log("Testing columns for constraints...");
  await testColumn('font_family', '55,10 76,17 92,39');
  await testColumn('font_weight', '55,10 76,17 92,39');
  await testColumn('color', '55,10 76,17 92,39');
  await testColumn('text_align', '55,10 76,17 92,39');
  await testColumn('placeholder_label', '55,10 76,17 92,39');
}

runTests();
