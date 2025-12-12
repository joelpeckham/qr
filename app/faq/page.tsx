import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "QR Code Generator FAQ",
  description:
    "Answers to common QR code questions: sizing, scanning, SVG vs PNG, and whether you should use a short URL.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "QR Code Generator FAQ",
    description:
      "Answers to common QR code questions: sizing, scanning, SVG vs PNG, and whether you should use a short URL.",
    url: "/faq",
  },
};

export default function FaqPage() {
  const faq = [
    {
      q: "What size should a QR code be?",
      a: "Big enough to scan comfortably at the viewing distance. For print, SVG is ideal because it scales perfectly.",
    },
    {
      q: "Should I use a transparent background?",
      a: "Only if the placement background is high-contrast. For maximum reliability, use a light background behind dark modules.",
    },
    {
      q: "SVG vs PNG: which should I choose?",
      a: "Choose SVG for print and scaling. Choose PNG if you need a raster image for a specific workflow.",
    },
    {
      q: "Do QR codes expire?",
      a: "The QR image doesn’t expire, but the destination can. If you use a short URL, your QR depends on that service staying up.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-4 py-8 sm:py-10">
        <main className="mx-auto w-full max-w-2xl space-y-6 sm:space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">QR Code Generator FAQ</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Quick answers, no fluff.</p>
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Back to the generator →
            </Link>
          </header>

          <section className="space-y-4">
            <div className="space-y-4">
              {faq.map((f) => (
                <div key={f.q} className="rounded-lg border border-border/60 p-4">
                  <div className="font-medium">{f.q}</div>
                  <div className="mt-1 text-muted-foreground">{f.a}</div>
                </div>
              ))}
            </div>
          </section>

          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}


