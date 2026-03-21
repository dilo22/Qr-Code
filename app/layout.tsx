import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeonPulse QR",
  description: "Créez des QR codes magnifiques, dynamiques et intelligents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}