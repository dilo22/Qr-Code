import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RouteContext = {
  params: {
    id: string;
  };
};

function normalizeUrl(url: string | null | undefined) {
  const value = String(url || "").trim();

  if (!value) return null;

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)) {
    return value;
  }

  return `https://${value}`;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = context.params;

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log("QR introuvable:", { id, error });
    return new NextResponse("QR code introuvable.", { status: 404 });
  }

  console.log("QR row:", data);
  console.log("DEBUG DATA:", {
  id,
  type: data.type,
  dataUrl: data.url,
  payload: data.qr_data,
  content: data.content,
  payloadAlt: data.payload,
  dataAlt: data.data,
});

  const payload =
    data.qr_data ??
    data.content ??
    data.payload ??
    data.data ??
    {};

  const baseUrl = new URL(request.url).origin;

  const url = data.url ?? payload.url ?? null;
  console.log("DEBUG URL:", {
    id,
    dataUrl: data.url,
    payloadUrl: payload.url,
    finalUrl: url,
    payload,
  });

  const phone = data.phone ?? payload.phone ?? null;
  const email = data.email ?? payload.email ?? null;
  const subject = data.subject ?? payload.subject ?? "";
  const body = data.body ?? payload.body ?? "";
  const latitude = data.latitude ?? payload.latitude ?? null;
  const longitude = data.longitude ?? payload.longitude ?? null;
  const address = data.address ?? payload.address ?? null;

  switch (data.type) {
    case "url":
case "instagram":
case "facebook":
case "tiktok":
case "linkedin":
case "twitter":
case "youtube":
case "app":
case "review":
case "file":
case "pdf":
case "image": {
      const destination = normalizeUrl(url);

      if (!destination) {
  return NextResponse.json(
    {
      error: "Aucune destination trouvée",
      id,
      type: data.type,
      dataUrl: data.url ?? null,
      payloadUrl: payload?.url ?? null,
      qr_data: data.qr_data ?? null,
      content: data.content ?? null,
      payload: data.payload ?? null,
      dataField: data.data ?? null,
    },
    { status: 404 }
  );
}

      return NextResponse.redirect(destination);
    }

    case "menu": {
      return NextResponse.redirect(`${baseUrl}/menu/${data.id}`);
    }

    case "location": {
      if (latitude && longitude) {
        return NextResponse.redirect(
          `https://www.google.com/maps?q=${latitude},${longitude}`
        );
      }

      if (address) {
        return NextResponse.redirect(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        );
      }

      console.log("Destination location manquante:", { id, data, payload });
      return new NextResponse("Aucune destination trouvée.", { status: 404 });
    }

    case "phone": {
      if (!phone) {
        console.log("Téléphone manquant:", { id, data, payload });
        return new NextResponse("Aucune destination trouvée.", { status: 404 });
      }

      return NextResponse.redirect(`tel:${phone}`);
    }

    case "email": {
      if (!email) {
        console.log("Email manquant:", { id, data, payload });
        return new NextResponse("Aucune destination trouvée.", { status: 404 });
      }

      return NextResponse.redirect(
        `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      );
    }

    case "sms": {
      if (!phone) {
        console.log("SMS phone manquant:", { id, data, payload });
        return new NextResponse("Aucune destination trouvée.", { status: 404 });
      }

      return NextResponse.redirect(
        `sms:${phone}?body=${encodeURIComponent(body || payload.message || "")}`
      );
    }

    default: {
      console.log("Type non pris en charge:", { id, type: data.type, data });
      return new NextResponse("Type de QR non pris en charge.", { status: 400 });
    }
  }
}