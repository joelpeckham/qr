import type { Metadata } from "next";
import { HomeClient } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "No Bullshit QR Code Generator",
  description:
    "Generate a QR code from any URL in seconds. Optional URL shortening. Download SVG or PNG with custom sizing.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "No Bullshit QR Code Generator",
    description:
      "Generate a QR code from any URL in seconds. Optional URL shortening. Download SVG or PNG with custom sizing.",
    url: "/",
  },
  twitter: {
    title: "No Bullshit QR Code Generator",
    description:
      "Generate a QR code from any URL in seconds. Optional URL shortening. Download SVG or PNG with custom sizing.",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "No Bullshit QR",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: "https://qr.jpeckham.com/",
    description:
      "Generate a QR code from any URL in seconds. Optional URL shortening. Download SVG or PNG with custom sizing.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
