import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://barberia-demo.vercel.app"),
  title: {
    default: "Navaja & Co. — Barbería Clásica en Bogotá",
    template: "%s | Navaja & Co.",
  },
  description:
    "Barbería clásica y moderna. Cortes de precisión, afeitado a navaja y arreglo de barba. Reserva tu cita en línea con los mejores barberos de la ciudad.",
  keywords: [
    "barbería",
    "corte de cabello",
    "afeitado a navaja",
    "barba",
    "Bogotá",
    "reservar cita",
  ],
  openGraph: {
    title: "Navaja & Co. — Barbería Clásica",
    description:
      "Cortes de precisión, afeitado a navaja y arreglo de barba. Reserva tu cita en línea.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
