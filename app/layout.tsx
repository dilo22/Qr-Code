import type { Metadata } from "next";
import "./globals.css";
import { AutoLogout } from "@/features/auth/components/AutoLogout";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "MyQR",
  description: "Créez des QR codes magnifiques, dynamiques et intelligents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <AutoLogout timeoutMs={15 * 60 * 1000} />
        {children}
      </body>
    </html>
  );
}