import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import Script from "next/script";

export const metadata = {
  title: "Geocodificadores Uruguay",
  description: "Aplicación para probar geocodificadores en Uruguay",
  keywords: "geocodificación, uruguay, mapas, direcciones, coordenadas",
  authors: [{ name: "Carlos Andrés Chiale" }],
  creator: "Geocodificadores Uruguay",
  publisher: "Carlos Andrés Chiale",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://geocode-uy.chiale.dev/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Geocodificadores Uruguay",
    description: "Aplicación para probar geocodificadores en Uruguay",
    url: "https://geocode-uy.chiale.dev/",
    siteName: "Geocodificadores Uruguay",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geocodificadores Uruguay",
    description: "Aplicación para probar geocodificadores en Uruguay",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "SukCiFdAK_kMOxTolPbFkpQ5Ba4TAVE8MPFQViQYE6Q",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Geocodificadores Uruguay",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Geocodificadores Uruguay"
        />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Geocodificadores Uruguay",
              description: "Aplicación para probar geocodificadores en Uruguay",
              url: "https://geocode-uy.chiale.dev/",
              author: {
                "@type": "Person",
                name: "Carlos Andrés Chiale",
              },
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Header />
        <main className="flex-1 lg:pb-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
