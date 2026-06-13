import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sillessico",
  description: "Inventa parole nuove per concetti senza nome.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
