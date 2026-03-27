import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getSignedUrl(path?: string | null) {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from("qr-files")
    .createSignedUrl(path, 60 * 60);

  if (error) return null;
  return data?.signedUrl ?? null;
}

function formatPrice(price: unknown) {
  if (price === null || price === undefined || price === "") return null;

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `${price} €`;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: numericPrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

function normalizeWebsiteUrl(website?: string | null) {
  if (!website) return null;
  return website.startsWith("http") ? website : `https://${website}`;
}

export default async function MenuPage({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  let parsedContent: any = null;

  try {
    parsedContent =
      typeof data.content === "string"
        ? JSON.parse(data.content)
        : data.content;
  } catch {
    notFound();
  }

  const menuData = parsedContent?.menuData;

  if (!menuData?.restaurant) {
    notFound();
  }

  const restaurant = menuData.restaurant;
  const websiteHref = normalizeWebsiteUrl(restaurant.website);

  const featuredItems = [...(menuData.featuredItems || [])].sort(
    (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
  );

  const sections = [...(menuData.sections || [])].sort(
    (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
  );

  const coverUrl = await getSignedUrl(restaurant.coverImagePath);

  const featuredItemsWithImages = await Promise.all(
    featuredItems.map(async (item: any) => ({
      ...item,
      imageUrl: await getSignedUrl(item.imagePath),
    }))
  );

  const sectionsWithImages = await Promise.all(
    sections.map(async (section: any) => ({
      ...section,
      items: await Promise.all(
        (section.items || []).map(async (item: any) => ({
          ...item,
          imageUrl: await getSignedUrl(item.imagePath),
        }))
      ),
    }))
  );

  const infoChips = [
    restaurant.phone
      ? { icon: "📞", label: restaurant.phone }
      : null,
    restaurant.address
      ? { icon: "📍", label: restaurant.address }
      : null,
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <div className="min-h-screen bg-[#05060f] text-white">
      <div className="relative overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
          <div className="absolute right-[-100px] top-[180px] h-[280px] w-[280px] rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute bottom-[-80px] left-1/3 h-[240px] w-[240px] rounded-full bg-amber-400/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="overflow-hidden border-x border-white/10 bg-white/[0.02] shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:my-6 md:rounded-[32px] md:border">
            {/* HERO */}
            <div className="relative h-[320px] w-full md:h-[460px]">
              {coverUrl ? (
                <>
                  <img
                    src={coverUrl}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05060f]/55 via-black/8 to-transparent" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#111827,#090b14,#151515)] text-white/40">
                  Pas de cover
                </div>
              )}

              {/* Floating content */}
              <div className="absolute inset-x-0 bottom-0 translate-y-[52%] md:translate-y-1/2 flex justify-center px-5 md:px-8 z-20">
                <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-7">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
                    Menu digital
                  </div>

                  <h1 className="text-4xl font-black leading-none tracking-tight md:text-6xl">
                    {restaurant.name}
                  </h1>

                  {restaurant.bio && (
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                      {restaurant.bio}
                    </p>
                  )}

                  {(infoChips.length > 0 || websiteHref) && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {infoChips.map((chip, index) => (
                        <span
                          key={`${chip.label}-${index}`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/90 backdrop-blur-md"
                        >
                          <span>{chip.icon}</span>
                          <span>{chip.label}</span>
                        </span>
                      ))}

                      {websiteHref && (
                        <a
                          href={websiteHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/90 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
                        >
                          <span>🌐</span>
                          <span>Site web</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 pt-[18rem] pb-8 md:px-8 md:pt-40 md:pb-10">
              {/* FEATURED */}
              {featuredItemsWithImages.length > 0 && (
                <section className="mb-14">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                        Signature
                      </p>
                      <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                        ⭐ À la une
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {featuredItemsWithImages.map((item: any) => (
                      <MenuItemCard key={item.id} item={item} featured />
                    ))}
                  </div>
                </section>
              )}

              {/* Sections */}
              <div className="space-y-12">
                {sectionsWithImages.map((section: any, index: number) => (
                  <section key={section.id || index} className="relative">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-bold text-white/80 shadow-inner shadow-white/5">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                          {section.title}
                        </h2>
                        <div className="mt-2 h-px w-24 bg-gradient-to-r from-white/30 to-transparent" />
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {(section.items || []).map((item: any) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({
  item,
  featured = false,
}: {
  item: any;
  featured?: boolean;
}) {
  const price = formatPrice(item.price);

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] transition-all duration-300",
        "hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
        featured ? "min-h-[190px]" : "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col md:flex-row">
        {/* IMAGE */}
        <div
          className={[
            "relative shrink-0 overflow-hidden bg-white/[0.03]",
            featured
              ? "h-[220px] w-full md:h-auto md:w-[220px]"
              : "h-[140px] w-full md:h-auto md:w-[150px]",
          ].join(" ")}
        >
          {item.imageUrl ? (
            <>
              <img
                src={item.imageUrl}
                alt={item.name || "Plat"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/5" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/25">
              Aucune image
            </div>
          )}

          {featured && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md">
              ✦ Coup de cœur
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-4 md:p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-extrabold tracking-tight text-white md:text-xl">
                  {item.name}
                </h3>
              </div>

              {price && (
                <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-sm font-bold text-white shadow-inner shadow-white/5">
                  {price}
                </div>
              )}
            </div>

            {item.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-[15px]">
                {item.description}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="h-px flex-1 bg-gradient-to-r from-white/12 via-white/6 to-transparent" />
            <div className="ml-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30 transition-colors duration-300 group-hover:text-white/50">
              {featured ? "Sélection maison" : "Disponible"}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}