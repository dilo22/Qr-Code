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

export default async function ViewQrFilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !qr) {
    return <main className="p-8 text-white">QR code introuvable.</main>;
  }

  if (qr.status !== "active") {
    return <main className="p-8 text-white">Ce QR code est désactivé.</main>;
  }

  const content = parseContent(qr.content);

  if (!content?.storagePath) {
    return <main className="p-8 text-white">Fichier introuvable.</main>;
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from("qr-files")
    .createSignedUrl(content.storagePath, 60 * 10);

  if (signedError || !signed?.signedUrl) {
    return <main className="p-8 text-white">Impossible de charger le fichier.</main>;
  }

  const fileUrl = signed.signedUrl;
  const title = qr.title || qr.name || content.fileName || "Fichier";

  return (
    <main className="mx-auto max-w-5xl p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>

      {qr.type === "pdf" && (
        <iframe
          src={fileUrl}
          className="h-[80vh] w-full rounded-xl border border-white/10 bg-white"
        />
      )}

      {qr.type === "image" && (
        <img
          src={fileUrl}
          alt={content.fileName || "Image"}
          className="max-h-[80vh] rounded-xl border border-white/10"
        />
      )}

      {qr.type === "audio" && (
        <audio controls className="w-full">
          <source src={fileUrl} type={content.mimeType || "audio/mpeg"} />
        </audio>
      )}

      {qr.type === "video" && (
        <video controls className="w-full rounded-xl border border-white/10">
          <source src={fileUrl} type={content.mimeType || "video/mp4"} />
        </video>
      )}

      <a
        href={fileUrl}
        download={content.fileName || true}
        className="mt-6 inline-block rounded-xl bg-white px-4 py-2 font-semibold text-black"
      >
        Télécharger
      </a>
    </main>
  );
}