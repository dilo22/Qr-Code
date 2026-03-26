import QRDetailsView from "@/features/dashboard/components/qr-details/QRDetailsView";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QrDetailsPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    return <div className="p-8 text-red-300">ID du QR code manquant.</div>;
  }

  return <QRDetailsView qrId={id} />;
}