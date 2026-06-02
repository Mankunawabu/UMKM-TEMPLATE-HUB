import * as React from "react";
import { createClient } from "@/lib/supabase/server";

export default async function TestLogPage() {
  const supabase = await createClient();

  const { data: userAuth } = await supabase.auth.getUser();
  const userId = userAuth?.user?.id;

  const insertResult = await supabase
    .from("activity_logs")
    .insert({
      user_id: userId || null,
      action: "test_action",
      entity_type: "test",
      entity_id: "test",
      metadata: { test: true },
      severity: "info",
    })
    .select();

  const selectResult = await supabase
    .from("activity_logs")
    .select("*, profiles(nama_lengkap)");

  const exportsResult = await supabase
    .from("exports")
    .select("*, profiles(nama_usaha), templates(nama_template)")
    .limit(1);

  return (
    <div className="p-8 font-sans space-y-6">
      <h1 className="text-2xl font-bold text-[#3D1E30]">Test Activity Log</h1>

      <div className="space-y-2">
        <h2 className="font-bold">Select Result (with Join):</h2>
        <pre className="bg-slate-100 p-4 rounded text-xs">
          {JSON.stringify(selectResult, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <h2 className="font-bold">Exports Result (with Join):</h2>
        <pre className="bg-slate-100 p-4 rounded text-xs">
          {JSON.stringify(exportsResult, null, 2)}
        </pre>
      </div>
    </div>
  );
}
