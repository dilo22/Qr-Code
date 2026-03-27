import { Globe, Hash, Plus, Trash2 } from "lucide-react";
import Field from "./Field";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { LinkItem } from "@/features/dashboard/create/types/qr-content.types";

type Props = {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
};

export default function LinksEditor({ links, onChange }: Props) {
  const addLinkItem = () => onChange([...(links || []), { label: "", url: "" }]);

  const updateLinkItem = (index: number, field: "label" | "url", value: string) => {
    const nextLinks = [...links];
    nextLinks[index] = { ...nextLinks[index], [field]: value };
    onChange(nextLinks);
  };

  const removeLinkItem = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="pl-1 text-[11px] font-black uppercase tracking-[0.1em] text-white/45">
          Liens personnalisés
        </label>

        <button
          type="button"
          onClick={addLinkItem}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
        >
          <Plus size={14} />
          Ajouter un lien
        </button>
      </div>

      {links.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
          Aucun lien ajouté pour le moment.
        </div>
      )}

      {links.map((link, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr_auto]">
            <Field label="Label" icon={<Hash size={14} />}>
              <input
                type="text"
                placeholder="Ex: Portfolio"
                value={link.label || ""}
                onChange={(e) => updateLinkItem(index, "label", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Lien" icon={<Globe size={14} />}>
              <input
                type="text"
                placeholder="https://..."
                value={link.url || ""}
                onChange={(e) => updateLinkItem(index, "url", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeLinkItem(index)}
                className="inline-flex h-[50px] items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-red-300 transition hover:bg-red-500/20"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}