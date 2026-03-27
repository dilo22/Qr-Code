import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseContent(content: string | null) {
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function detectDevice(userAgent: string | null) {
  if (!userAgent) return "unknown";

  const ua = userAgent.toLowerCase();

  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobile|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

function getRedirectUrl(qr: any) {
  const parsedContent = parseContent(qr.content);
  if (!parsedContent) return null;

  return parsedContent.url || null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  console.log("ROUTE ID:", id);

  // 🔍 TEST : voir si Supabase retourne des lignes
  const { data: sampleRows, error: sampleError } = await supabase
    .from("qr_codes")
    .select("id, name")
    .limit(5);

  console.log("SAMPLE ROWS:", sampleRows);
  console.log("SAMPLE ERROR:", sampleError);

  // 🔍 vraie requête
  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  console.log("QR FETCHED:", qr);
  console.log("QR ERROR:", error);

  if (!qr) {
    return new NextResponse("QR code introuvable.", { status: 404 });
  }

  const userAgent = request.headers.get("user-agent");
  const device = detectDevice(userAgent);

  let visitorKey = request.cookies.get("visitor_key")?.value;
  if (!visitorKey) {
    visitorKey = randomUUID();
  }

  console.log("VISITOR KEY:", visitorKey);

  await supabase.from("qr_scans").insert({
    qr_code_id: qr.id,
    device,
    visitor_key: visitorKey,
  });

  const redirectUrl = getRedirectUrl(qr);

  if (!redirectUrl) {
    return new NextResponse("Aucune URL de redirection trouvée.", {
      status: 400,
    });
  }

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("visitor_key", visitorKey, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}