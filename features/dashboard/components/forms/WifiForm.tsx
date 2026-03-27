import { ChevronDown, Lock, ShieldCheck, Wifi } from "lucide-react";
import Field from "../Field";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function WifiForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <div className="space-y-5">
      <Field label="Nom du réseau (SSID)" icon={<Wifi size={14} />}>
        <input
          type="text"
          placeholder="Ex: MaBox_Guest"
          value={form.ssid || ""}
          onChange={(e) => handleChange("ssid", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Mot de passe" icon={<Lock size={14} />}>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Sécurité" icon={<ShieldCheck size={14} />}>
          <div className="relative">
            <select
              value={form.encryption || "WPA"}
              onChange={(e) => handleChange("encryption", e.target.value)}
              className={`${inputClass} appearance-none pr-12`}
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Ouvert</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
              size={16}
            />
          </div>
        </Field>
      </div>
    </div>
  );
}