const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://sdbvawkwxcsvsnanweol.supabase.co";
const supabaseKey = "sb_publishable_hn1SoocPLWvRIIzXqocEAQ_KVViGJb4";
const supabase = createClient(supabaseUrl, supabaseKey);

async function listObjects() {
  try {
    const { data: files, error } = await supabase.storage
      .from("templates_admin")
      .list("", { limit: 100 });
      
    if (error) {
      console.log("Error listing templates_admin:", error.message);
    } else {
      console.log("Files/Folders in templates_admin root:", JSON.stringify(files, null, 2));
      for (const file of files) {
        if (file.id === null) {
          // It's a folder
          console.log(`Subfolder found: ${file.name}`);
          const { data: subfiles } = await supabase.storage
            .from("templates_admin")
            .list(file.name, { limit: 10 });
          console.log(`Files in ${file.name}:`, JSON.stringify(subfiles, null, 2));
        }
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

listObjects();
