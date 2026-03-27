import { MapPin } from "lucide-react";
import Field from "../Field";
import LocationPicker from "@/features/dashboard/create/components/LocationPicker";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function LocationForm({ form, handleFormUpdate }: BaseQrFormProps) {
  return (
    <div className="space-y-5">
      <Field label="Localisation" icon={<MapPin size={14} />}>
        <LocationPicker
          value={{
            address: form.address,
            latitude: form.latitude,
            longitude: form.longitude,
          }}
          onChange={({ address, latitude, longitude }) => {
            handleFormUpdate({
              ...form,
              address,
              latitude,
              longitude,
            });
          }}
        />
      </Field>
    </div>
  );
}