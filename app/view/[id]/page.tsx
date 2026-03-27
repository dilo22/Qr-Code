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

function ActionButton({
  href,
  children,
  download,
  target,
}: {
  href: string;
  children: React.ReactNode;
  download?: string;
  target?: "_blank";
}) {
  return (
    <a
      href={href}
      download={download}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="inline-flex min-h-[48px] items-center justify-center rounded-2xl px-5 py-3 font-extrabold no-underline shadow-lg transition"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        border: "2px solid #000000",
        textDecoration: "none",
        fontSize: "16px",
        lineHeight: "20px",
      }}
    >
      <span
        style={{
          color: "#000000",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: 800,
        }}
      >
        {children}
      </span>
    </a>
  );
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
    return (
      <main className="min-h-screen bg-[#030616] px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          QR code introuvable.
        </div>
      </main>
    );
  }

  if (qr.status !== "active") {
    return (
      <main className="min-h-screen bg-[#030616] px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          Ce QR code est désactivé.
        </div>
      </main>
    );
  }

  const content = parseContent(qr.content);

  if (!content?.storagePath) {
    return (
      <main className="min-h-screen bg-[#030616] px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          Fichier introuvable.
        </div>
      </main>
    );
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from("qr-files")
    .createSignedUrl(content.storagePath, 60 * 10);

  if (signedError || !signed?.signedUrl) {
    return (
      <main className="min-h-screen bg-[#030616] px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          Impossible de charger le fichier.
        </div>
      </main>
    );
  }

  const fileUrl = signed.signedUrl;
  const title = qr.title || qr.name || content.fileName || "Fichier";

  return (
    <main className="min-h-screen bg-[#030616] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
            Fichier
          </p>
          <h1 className="break-words text-xl font-black text-white sm:text-3xl">
            {title}
          </h1>
          {content.fileName ? (
            <p className="mt-2 text-sm text-white/55">{content.fileName}</p>
          ) : null}
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          

          <ActionButton
            href={fileUrl}
            download={content.fileName || "fichier"}
          >
            Télécharger
          </ActionButton>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl backdrop-blur-xl sm:p-5">
          {qr.type === "pdf" && (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
              <iframe
                src={fileUrl}
                title={title}
                className="h-[50vh] w-full sm:h-[65vh]"
              />
            </div>
          )}

          {qr.type === "image" && (
            <div className="flex justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2">
              <img
                src={fileUrl}
                alt={content.fileName || "Image"}
                className="max-h-[50vh] w-auto rounded-xl object-contain sm:max-h-[65vh]"
              />
            </div>
          )}

          {qr.type === "audio" && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <audio controls className="w-full">
                <source src={fileUrl} type={content.mimeType || "audio/mpeg"} />
              </audio>
            </div>
          )}

          {qr.type === "video" && (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <video controls className="max-h-[50vh] w-full sm:max-h-[65vh]">
                <source src={fileUrl} type={content.mimeType || "video/mp4"} />
              </video>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}