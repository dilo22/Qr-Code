"use client";

import { useParams } from "next/navigation";
import QrDetailsView from "@/components/dashboard/qr-details-view";

export default function QrDetailsPage() {
  const params = useParams();
  const qrId = params?.id as string;

  if (!qrId) {
    return <div className="p-8 text-red-300">ID du QR code manquant.</div>;
  }

  return <QrDetailsView qrId={qrId} />;
}