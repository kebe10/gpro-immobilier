import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPRO Immobilier — Location d'entrepôts & biens résidentiels à Abidjan",
  description:
    "GPRO Immobilier, leader de la location d'entrepôts à Abidjan. Entrepôts logistiques et villas résidentielles disponibles.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${oswald.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
