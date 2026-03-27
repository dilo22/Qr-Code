import { CalendarDays, Clock3, MapPin } from "lucide-react";
import Field from "../Field";
import { inputClass, nativeInputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function EventForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <div className="space-y-5">
      <Field label="Titre de l’événement" icon={<CalendarDays size={14} />}>
        <input type="text" placeholder="Conférence annuelle" value={form.title || ""} onChange={(e) => handleChange("title", e.target.value)} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Date de début" icon={<CalendarDays size={14} />}>
          <input type="date" value={form.startDate || ""} onChange={(e) => handleChange("startDate", e.target.value)} className={nativeInputClass} />
        </Field>

        <Field label="Heure de début" icon={<Clock3 size={14} />}>
          <input type="time" value={form.startTime || ""} onChange={(e) => handleChange("startTime", e.target.value)} className={nativeInputClass} />
        </Field>
      </div>

      <Field label="Lieu" icon={<MapPin size={14} />}>
        <input type="text" placeholder="Salle / Adresse" value={form.location || ""} onChange={(e) => handleChange("location", e.target.value)} className={inputClass} />
      </Field>
    </div>
  );
}