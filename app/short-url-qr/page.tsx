import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Short URL QR Code",
  description:
    "Make a QR code that uses a short URL. Smaller, less dense QR codes can be easier to scan—download SVG or PNG.",
  alternates: { canonical: "/short-url-qr" },
  openGraph: {
    title: "Short URL QR Code",
    description:
      "Make a QR code that uses a short URL. Smaller, less dense QR codes can be easier to scan—download SVG or PNG.",
    url: "/short-url-qr",
  },
};

export default function ShortUrlQrPage() {
  const faq = [
    {
      q: "Why use a short URL in a QR code?",
      a: "A shorter URL usually creates a less dense QR code, which can improve scan reliability—especially at small sizes.",
    },
    {
      q: "Is there a downside to short URLs?",
      a: "Yes: you’re trusting the shortener. If it goes down or the link changes, the QR code will point to a dead URL.",
    },
    {
      q: "What happens if shortening fails?",
      a: "The generator still works: it will fall back to encoding the normalized original URL.",
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Short URL QR Code</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Want a smaller, easier-to-scan QR code? A short URL can help. Generate and download SVG/PNG in seconds.
            </p>
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Generate a short URL QR →
            </Link>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">When it’s worth it</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Small print surfaces (stickers, labels)</li>
              <li>Low-resolution displays</li>
              <li>QR codes that need extra error tolerance</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">FAQ</h2>
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


