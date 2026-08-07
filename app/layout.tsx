import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PWARegister from "@/components/PWARegister";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Navaja & Co. — Barbería Clásica en Bogotá",
    template: "%s | Navaja & Co.",
  },
  description:
    "Barbería clásica y moderna en Bogotá. Cortes de precisión, afeitado a navaja y arreglo de barba. Reserva tu cita en línea con los mejores barberos.",
  applicationName: "Navaja & Co.",
  keywords: [
    "barbería",
    "barbería en Bogotá",
    "corte de cabello",
    "afeitado a navaja",
    "arreglo de barba",
    "reservar cita barbería",
  ],
  authors: [{ name: "Navaja & Co." }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Navaja & Co.",
  },
  openGraph: {
    title: "Navaja & Co. — Barbería Clásica en Bogotá",
    description:
      "Cortes de precisión, afeitado a navaja y arreglo de barba. Reserva tu cita en línea.",
    url: "/",
    siteName: "Navaja & Co.",
    type: "website",
    locale: "es_CO",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Navaja & Co." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Navaja & Co. — Barbería Clásica en Bogotá",
    description:
      "Cortes de precisión, afeitado a navaja y arreglo de barba. Reserva tu cita en línea.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Navaja & Co.",
  image: `${SITE_URL}/og.jpg`,
  url: SITE_URL,
  telephone: "+57 300 123 4567",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle 85 #12-34",
    addressLocality: "Chapinero",
    addressRegion: "Bogotá",
    addressCountry: "CO",
  },
  geo: { "@type": "GeoCoordinates", latitude: 4.6709, longitude: -74.063 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "18:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "6",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <PWARegister />
      </body>
    </html>
  );
}
