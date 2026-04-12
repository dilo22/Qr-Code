import { useState } from "react";
import { Globe } from "lucide-react";
import Field from "../Field";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript|file):/i;

export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  if (BLOCKED_PROTOCOLS.test(candidate)) return null;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export default function UrlForm({ form, handleChange }: BaseQrFormProps) {
  const [touched, setTouched] = useState(false);

  const raw = form.url || "";
  const normalized = raw ? normalizeUrl(raw) : null;
  const hasError = touched && raw.length > 0 && normalized === null;

  const handleBlur = () => {
    setTouched(true);
    if (raw && normalized) {
      handleChange("url", normalized);
    }
  };

  return (
    <Field label="Lien de redirection" icon={<Globe size={14} />}>
      <input
        type="text"
        placeholder="https://example.com"
        value={raw}
        onChange={(e) => handleChange("url", e.target.value)}
        onBlur={handleBlur}
        className={`${inputClass} ${hasError ? "border-red-500/60 focus:border-red-500" : ""}`}
      />
      {hasError && (
        <p className="mt-1.5 text-xs text-red-400">
          URL invalide — doit commencer par https:// ou http://
        </p>
      )}
    </Field>
  );
}