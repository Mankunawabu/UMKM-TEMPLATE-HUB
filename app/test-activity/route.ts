import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // Test inserting an activity log directly
  const { data: userAuth, error: authError } = await supabase.auth.getUser();
  if (authError || !userAuth.user) {
    return NextResponse.json({ error: "Not logged in", details: authError });
  }

  const { data: insertData, error: insertError } = await supabase
    .from("activity_logs")
    .insert({
      user_id: userAuth.user.id,
      action: "test_action",
      entity_type: "test",
      entity_id: "test",
      metadata: { name: "test metadata" },
      severity: "info",
    })
    .select();

  // Test selecting the activity logs
  const { data: selectData, error: selectError } = await supabase
    .from("activity_logs")
    .select("*, profiles(nama_lengkap)");

  return NextResponse.json({
    insertData,
    insertError,
    selectData,
    selectError,
    user: userAuth.user.id,
  });
}
