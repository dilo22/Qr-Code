import { createClient } from "@supabase/supabase-js";
import {
  Mail,
  Phone,
  Globe,
  Building2,
  Briefcase,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

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

function getInitials(name?: string) {
  if (!name) return "VP";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "VP";
}

function normalizeLinks(links: unknown) {
  if (!Array.isArray(links)) return [];

  return links.filter((link) => {
    return (
      link &&
      typeof link === "object" &&
      typeof link.url === "string" &&
      link.url.trim().length > 0
    );
  });
}

function buildContactItems(content: Record<string, any>) {
  return [
    content.phone
      ? {
          label: "Téléphone",
          value: content.phone,
          href: `tel:${content.phone}`,
          icon: <Phone size={16} />,
        }
      : null,
    content.email
      ? {
          label: "Email",
          value: content.email,
          href: `mailto:${content.email}`,
          icon: <Mail size={16} />,
        }
      : null,
    content.website
      ? {
          label: "Site web",
          value: content.website,
          href: content.website,
          icon: <Globe size={16} />,
        }
      : null,
    content.company
      ? {
          label: "Entreprise",
          value: content.company,
          href: null,
          icon: <Building2 size={16} />,
        }
      : null,
    content.jobTitle
      ? {
          label: "Poste",
          value: content.jobTitle,
          href: null,
          icon: <Briefcase size={16} />,
        }
      : null,
    content.address
      ? {
          label: "Adresse",
          value: content.address,
          href: null,
          icon: <MapPin size={16} />,
        }
      : null,
  ].filter(Boolean);
}

export default async function CardPage({
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
      <main className="min-h-screen bg-[#030616] px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          Carte introuvable.
        </div>
      </main>
    );
  }

  if (qr.status !== "active") {
    return (
      <main className="min-h-screen bg-[#030616] px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          Cette carte est désactivée.
        </div>
      </main>
    );
  }

  const content = parseContent(qr.content);

  if (!content) {
    return (
      <main className="min-h-screen bg-[#030616] px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          Contenu introuvable.
        </div>
      </main>
    );
  }

  let avatarUrl: string | null = null;

  if (content.avatarPath) {
    const { data: signed } = await supabase.storage
      .from("qr-files")
      .createSignedUrl(content.avatarPath, 60 * 10);

    avatarUrl = signed?.signedUrl || null;
  }

  const displayName =
    content.displayName ||
    content.name ||
    [content.firstName, content.lastName].filter(Boolean).join(" ") ||
    qr.title ||
    "Carte profil";

  const headline = content.headline || content.jobTitle || "";
  const bio = content.bio || "";
  const contactItems = buildContactItems(content);
  const links = normalizeLinks(content.links);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0b163a_0%,#050814_45%,#02040b_100%)] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="relative overflow-hidden px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%)]" />

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-28 w-28 rounded-full border border-white/15 object-cover shadow-2xl sm:h-36 sm:w-36"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-3xl font-black text-cyan-300 shadow-2xl sm:h-36 sm:w-36 sm:text-4xl">
                    {getInitials(displayName)}
                  </div>
                )}

                <div className="mt-6 max-w-2xl">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">
                    Carte profil
                  </p>

                  <h1 className="break-words text-3xl font-black leading-tight text-white sm:text-5xl">
                    {displayName}
                  </h1>

                  {headline ? (
                    <p className="mt-3 text-base font-medium text-white/75 sm:text-xl">
                      {headline}
                    </p>
                  ) : null}

                  {bio ? (
                    <p className="mx-auto mt-5 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-white/65 sm:text-base">
                      {bio}
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {content.phone ? (
                    <a
                      href={`tel:${content.phone}`}
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-extrabold text-black no-underline transition hover:bg-cyan-300"
                      style={{ color: "#000000", textDecoration: "none" }}
                    >
                      <Phone size={16} />
                      Appeler
                    </a>
                  ) : null}

                  {content.email ? (
                    <a
                      href={`mailto:${content.email}`}
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 font-bold text-white no-underline transition hover:bg-white/[0.14]"
                      style={{ textDecoration: "none" }}
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  ) : null}

                  {content.website ? (
                    <a
                      href={content.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 font-bold text-white no-underline transition hover:bg-white/[0.14]"
                      style={{ textDecoration: "none" }}
                    >
                      <Globe size={16} />
                      Visiter
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {(contactItems.length > 0 || links.length > 0) && (
            <div className="border-t border-white/10 bg-black/20 px-6 py-6 sm:px-10 sm:py-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                {contactItems.length > 0 ? (
                  <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white/55">
                      Informations
                    </h2>

                    <div className="space-y-3">
                      {contactItems.map((item: any, index: number) =>
                        item.href ? (
                          <a
                            key={`${item.label}-${index}`}
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white no-underline transition hover:bg-white/[0.07]"
                            style={{ textDecoration: "none" }}
                          >
                            <span className="mt-0.5 text-cyan-400">{item.icon}</span>
                            <span className="min-w-0">
                              <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                                {item.label}
                              </span>
                              <span className="mt-1 block break-words text-sm text-white/85">
                                {item.value}
                              </span>
                            </span>
                          </a>
                        ) : (
                          <div
                            key={`${item.label}-${index}`}
                            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                          >
                            <span className="mt-0.5 text-cyan-400">{item.icon}</span>
                            <span className="min-w-0">
                              <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                                {item.label}
                              </span>
                              <span className="mt-1 block break-words text-sm text-white/85">
                                {item.value}
                              </span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </section>
                ) : null}

                {links.length > 0 ? (
                  <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white/55">
                      Liens
                    </h2>

                    <div className="space-y-3">
                      {links.map((link: any, index: number) => (
                        <a
                          key={`${link.label || "link"}-${index}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white no-underline transition hover:bg-white/[0.07]"
                          style={{ textDecoration: "none" }}
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                            <LinkIcon size={18} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-white">
                              {link.label?.trim() || "Lien"}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-white/45">
                              {link.url}
                            </span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}