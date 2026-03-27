import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function MenuPage({ params }: Props) {
  const { id } = params;

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data || data.type !== "menu") {
    return notFound();
  }

  const menuData = data.menuData;

  if (!menuData) {
    return notFound();
  }

  const restaurant = menuData.restaurant;
  const featuredItems = menuData.featuredItems || [];
  const sections = (menuData.sections || []).sort(
    (a: any, b: any) => a.order - b.order
  );

  return (
    <div className="min-h-screen bg-[#05060f] text-white">
      {/* COVER */}
      {restaurant.coverImagePath && (
        <div className="relative h-[220px] w-full overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/qr-files/${restaurant.coverImagePath}`}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* RESTO INFO */}
        <div className="mb-6">
          <h1 className="text-2xl font-black">{restaurant.name}</h1>

          {restaurant.bio && (
            <p className="mt-2 text-sm text-white/70">{restaurant.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
            {restaurant.phone && <span>📞 {restaurant.phone}</span>}
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                className="underline"
              >
                🌐 Site web
              </a>
            )}
            {restaurant.address && <span>📍 {restaurant.address}</span>}
          </div>
        </div>

        {/* FEATURED */}
        {featuredItems.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold">⭐ À la une</h2>

            <div className="space-y-4">
              {featuredItems.map((item: any) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* SECTIONS */}
        {sections.map((section: any) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-lg font-bold">{section.title}</h2>

            {section.description && (
              <p className="mb-3 text-sm text-white/60">
                {section.description}
              </p>
            )}

            <div className="space-y-4">
              {section.items
                .sort((a: any, b: any) => a.order - b.order)
                .map((item: any) => (
                  <MenuItem key={item.id} item={item} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuItem({ item }: { item: any }) {
  const imageUrl = item.imagePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/qr-files/${item.imagePath}`
    : null;

  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      {imageUrl && (
        <img
          src={imageUrl}
          className="h-20 w-20 rounded-xl object-cover"
          alt={item.name}
        />
      )}

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{item.name}</h3>
          {item.price && (
            <span className="text-sm font-bold text-cyan-400">
              {item.price} €
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-1 text-sm text-white/60">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}