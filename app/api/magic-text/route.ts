import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Groq API key is not configured" }, { status: 500 });
  }

  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    // Ambil konfigurasi AI dari Supabase
    const supabase = await createClient();
    const { data: aiConfigData } = await supabase
      .from("app_settings")
      .select("setting_value")
      .eq("setting_key", "ai_magic")
      .single();

    const config = aiConfigData?.setting_value || {};
    
    // Default values if not configured yet
    const model = config.ai_model || "llama-3.3-70b-versatile";
    const maxTokens = config.ai_max_tokens || 50;
    
    const defaultPrompt = `Bertindaklah sebagai ahli copywriting marketing handal.
Buatlah 1 kalimat promosi singkat yang sangat menarik, kreatif, dan bikin penasaran (maksimal 40 huruf) untuk produk atau layanan berikut: "{keyword}".
Jangan gunakan tanda kutip di hasil akhir. Jangan gunakan awalan seperti "Ini dia", "Halo", atau "Berikut". Langsung tuliskan kalimat utamanya.`;
    
    let rawPrompt = config.ai_prompt || defaultPrompt;
    
    // Replace {keyword} if present, else append it to the end
    let finalPrompt = rawPrompt;
    if (rawPrompt.includes("{keyword}")) {
      finalPrompt = rawPrompt.replace(/{keyword}/g, keyword);
    } else {
      finalPrompt = `${rawPrompt}\n\nKeyword: ${keyword}`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      throw new Error(data.error?.message || "Failed to fetch from Groq");
    }

    const text = data.choices[0]?.message?.content?.replace(/["']/g, "").trim();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error generating magic text:", error);
    return NextResponse.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
