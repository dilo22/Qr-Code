import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  switch (qr.type) {
    case "url":
    case "instagram":
    case "facebook":
    case "tiktok":
    case "linkedin":
    case "twitter":
    case "youtube":
    case "pdf":
    case "image":
    case "audio":
    case "app":
    case "menu":
    case "review":
      return parsedContent.url || null;

    default:
      return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !qr) {
    return new NextResponse("QR code introuvable.", { status: 404 });
  }

  const userAgent = request.headers.get("user-agent");
  const device = detectDevice(userAgent);

  const { error: scanError } = await supabase.from("qr_scans").insert({
    qr_code_id: qr.id,
    device,
  });

  if (scanError) {
    console.error("SCAN INSERT ERROR:", scanError);
  }

  const redirectUrl = getRedirectUrl(qr);

  if (!redirectUrl) {
    return new NextResponse("Aucune URL de redirection trouvée.", {
      status: 400,
    });
  }

  return NextResponse.redirect(redirectUrl);
}