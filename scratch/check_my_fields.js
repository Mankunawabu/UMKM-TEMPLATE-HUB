const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkMyFields() {
  console.log("=== published templates ===");
  const { data: templates, error: tempError } = await supabase
    .from('templates')
    .select('id, nama_template, status, master_template_url');
  
  if (tempError) {
    console.error("Templates error:", tempError);
    return;
  }
  console.log(templates);

  console.log("\n=== template fields ===");
  const { data: fields, error: fieldError } = await supabase
    .from('template_fields')
    .select('id, template_id, placeholder_label, field_role, render_mode, z_index, x, y, width, height');
  
  if (fieldError) {
    console.error("Fields error:", fieldError);
    return;
  }
  console.log(fields);
}

checkMyFields();
