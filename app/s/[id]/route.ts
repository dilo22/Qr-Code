import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizeUrl(url: string | null | undefined) {
  const value = String(url || "").trim();

  if (!value) return null;

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)) {
    return value;
  }

  return `https://${value}`;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id);

  console.log("LOOKUP DEBUG:", { id, data, error });

  const row = data?.[0] ?? null;

  if (error || !row) {
    return NextResponse.json(
      {
        error: "QR code introuvable",
        id,
        dbCount: data?.length ?? 0,
        dbError: error ?? null,
      },
      { status: 404 }
    );
  }

  console.log("QR row:", row);
  console.log("DEBUG DATA:", {
    id,
    type: row.type,
    dataUrl: row.url,
    payload: row.qr_data,
    content: row.content,
    payloadAlt: row.payload,
    dataAlt: row.data,
  });

  const payload =
    row.qr_data ??
    row.content ??
    row.payload ??
    row.data ??
    {};

  const baseUrl = new URL(request.url).origin;

  const url = row.url ?? payload?.url ?? null;
  console.log("DEBUG URL:", {
    id,
    dataUrl: row.url,
    payloadUrl: payload?.url,
    finalUrl: url,
    payload,
  });

  const phone = row.phone ?? payload?.phone ?? null;
  const email = row.email ?? payload?.email ?? null;
  const subject = row.subject ?? payload?.subject ?? "";
  const body = row.body ?? payload?.body ?? "";
  const latitude = row.latitude ?? payload?.latitude ?? null;
  const longitude = row.longitude ?? payload?.longitude ?? null;
  const address = row.address ?? payload?.address ?? null;

  switch (row.type) {
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
            type: row.type,
            dataUrl: row.url ?? null,
            payloadUrl: payload?.url ?? null,
            qr_data: row.qr_data ?? null,
            content: row.content ?? null,
            payload: row.payload ?? null,
            dataField: row.data ?? null,
          },
          { status: 404 }
        );
      }

      return NextResponse.redirect(destination);
    }

    case "menu": {
      return NextResponse.redirect(`${baseUrl}/menu/${row.id}`);
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

      return NextResponse.json(
        {
          error: "Aucune destination trouvée",
          id,
          type: row.type,
          latitude,
          longitude,
          address,
          qr_data: row.qr_data ?? null,
          content: row.content ?? null,
          payload: row.payload ?? null,
          dataField: row.data ?? null,
        },
        { status: 404 }
      );
    }

    case "phone": {
      if (!phone) {
        return NextResponse.json(
          {
            error: "Aucune destination trouvée",
            id,
            type: row.type,
            phone: row.phone ?? payload?.phone ?? null,
            qr_data: row.qr_data ?? null,
            content: row.content ?? null,
            payload: row.payload ?? null,
            dataField: row.data ?? null,
          },
          { status: 404 }
        );
      }

      return NextResponse.redirect(`tel:${phone}`);
    }

    case "email": {
      if (!email) {
        return NextResponse.json(
          {
            error: "Aucune destination trouvée",
            id,
            type: row.type,
            email: row.email ?? payload?.email ?? null,
            qr_data: row.qr_data ?? null,
            content: row.content ?? null,
            payload: row.payload ?? null,
            dataField: row.data ?? null,
          },
          { status: 404 }
        );
      }

      return NextResponse.redirect(
        `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      );
    }

    case "sms": {
      if (!phone) {
        return NextResponse.json(
          {
            error: "Aucune destination trouvée",
            id,
            type: row.type,
            phone: row.phone ?? payload?.phone ?? null,
            body,
            qr_data: row.qr_data ?? null,
            content: row.content ?? null,
            payload: row.payload ?? null,
            dataField: row.data ?? null,
          },
          { status: 404 }
        );
      }

      return NextResponse.redirect(
        `sms:${phone}?body=${encodeURIComponent(body || payload?.message || "")}`
      );
    }

    default: {
      return NextResponse.json(
        {
          error: "Type de QR non pris en charge",
          id,
          type: row.type,
        },
        { status: 400 }
      );
    }
  }
}