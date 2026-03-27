import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return new NextResponse("QR code introuvable.", { status: 404 });
  }

  const baseUrl = new URL(request.url).origin;

  switch (data.type) {
    case "url":
    case "instagram":
    case "facebook":
    case "tiktok":
    case "linkedin":
    case "twitter":
    case "youtube":
    case "app":
    case "review": {
      if (!data.url) {
        return new NextResponse("Aucune destination trouvée.", { status: 404 });
      }

      return NextResponse.redirect(data.url);
    }

    case "menu": {
      return NextResponse.redirect(`${baseUrl}/menu/${data.id}`);
    }

    case "location": {
      if (data.latitude && data.longitude) {
        return NextResponse.redirect(
          `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
        );
      }

      if (data.address) {
        return NextResponse.redirect(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`
        );
      }

      return new NextResponse("Aucune destination trouvée.", { status: 404 });
    }

    case "phone": {
      if (!data.phone) {
        return new NextResponse("Aucune destination trouvée.", { status: 404 });
      }

      return NextResponse.redirect(`tel:${data.phone}`);
    }

    case "email": {
      if (!data.email) {
        return new NextResponse("Aucune destination trouvée.", { status: 404 });
      }

      const subject = encodeURIComponent(data.subject || "");
      const body = encodeURIComponent(data.body || "");

      return NextResponse.redirect(
        `mailto:${data.email}?subject=${subject}&body=${body}`
      );
    }

    case "sms": {
      if (!data.phone) {
        return new NextResponse("Aucune destination trouvée.", { status: 404 });
      }

      const message = encodeURIComponent(data.message || "");
      return NextResponse.redirect(`sms:${data.phone}?body=${message}`);
    }

    default: {
      return new NextResponse("Type de QR non pris en charge.", { status: 400 });
    }
  }
}