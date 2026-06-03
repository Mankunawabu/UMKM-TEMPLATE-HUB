const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "ey...";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPlatforms() {
  const { data, error } = await supabase
    .from("templates")
    .select("target_platform, categories(name)");
    
  if (error) console.error(error);
  console.log(data);
}
checkPlatforms();
