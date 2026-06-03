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

async function fixRenderModes() {
  console.log("Updating all text fields to render_mode = 'over'...");
  const { data, error } = await supabase
    .from('template_fields')
    .update({ render_mode: 'over' })
    .eq('field_role', 'text');
  
  if (error) {
    console.error("Error updating fields:", error);
  } else {
    console.log("Success! Updated text fields.");
  }

  // Double check
  const { data: fields } = await supabase
    .from('template_fields')
    .select('id, template_id, placeholder_label, field_role, render_mode, z_index');
  console.log("Current state of fields:", fields);
}

fixRenderModes();
