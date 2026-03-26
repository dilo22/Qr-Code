import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}