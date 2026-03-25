"use client";

import { useParams } from "next/navigation";
import QrDetailsView from "@/components/dashboard/qr-details-view";

export default function QrDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return <QrDetailsView qrId={id} />;
}