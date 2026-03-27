import { Hash, User, Wallet } from "lucide-react";
import Field from "../Field";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function PaymentForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <div className="space-y-5">
      <Field label="Nom du bénéficiaire" icon={<User size={14} />}>
        <input type="text" placeholder="Nom ou entreprise" value={form.payee || ""} onChange={(e) => handleChange("payee", e.target.value)} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Montant" icon={<Wallet size={14} />}>
          <input type="text" placeholder="49.99" value={form.amount || ""} onChange={(e) => handleChange("amount", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Devise" icon={<Hash size={14} />}>
          <input type="text" placeholder="EUR" value={form.currency || ""} onChange={(e) => handleChange("currency", e.target.value)} className={inputClass} />
        </Field>
      </div>
    </div>
  );
}