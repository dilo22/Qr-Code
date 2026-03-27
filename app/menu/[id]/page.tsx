import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MenuPage({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    return <div className="p-6 text-white">Menu introuvable</div>;
  }

  const parsedContent = JSON.parse(data.content);
  const menuData = parsedContent.menuData;

  const restaurant = menuData.restaurant;
  const sections = menuData.sections || [];
  const featuredItems = menuData.featuredItems || [];

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      {/* RESTAURANT */}
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>

      {restaurant.bio && (
        <p className="mt-2 text-sm text-white/70">{restaurant.bio}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/60">
        {restaurant.phone && <span>📞 {restaurant.phone}</span>}
        {restaurant.website && (
          <a href={restaurant.website} target="_blank" className="underline">
            🌐 Site web
          </a>
        )}
        {restaurant.address && <span>📍 {restaurant.address}</span>}
      </div>

      {/* FEATURED */}
      {featuredItems.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">⭐ À la une</h2>

          <div className="space-y-3">
            {featuredItems.map((item: any) => (
              <div key={item.id} className="border-b border-white/10 pb-2">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.price} €</span>
                </div>

                {item.description && (
                  <p className="text-sm text-white/60">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTIONS */}
      <div className="mt-8">
        {sections.map((section: any) => (
          <div key={section.id} className="mb-6">
            <h2 className="text-lg font-semibold">{section.title}</h2>

            <div className="mt-3 space-y-3">
              {section.items.map((item: any) => (
                <div
                  key={item.id}
                  className="border-b border-white/10 pb-2"
                >
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.price} €</span>
                  </div>

                  {item.description && (
                    <p className="text-sm text-white/60">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}