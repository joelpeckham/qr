import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "URL to QR Code",
  description:
    "Convert any URL into a QR code. Fast generation, optional URL shortening, and SVG/PNG downloads for print or digital use.",
  alternates: { canonical: "/url-to-qr" },
  openGraph: {
    title: "URL to QR Code",
    description:
      "Convert any URL into a QR code. Fast generation, optional URL shortening, and SVG/PNG downloads for print or digital use.",
    url: "/url-to-qr",
  },
};

export default function UrlToQrPage() {
  const faq = [
    {
      q: "Do I need to include https:// in my URL?",
      a: "No. If you paste a domain without a protocol, we’ll normalize it (typically to https://) before generating the QR code.",
    },
    {
      q: "Will the QR code scan on iPhone and Android?",
      a: "Yes. Modern camera apps scan QR codes. The biggest factor is contrast and size—SVG is ideal for printing.",
    },
    {
      q: "What’s better for printing: SVG or PNG?",
      a: "SVG. It scales cleanly to any size. Use PNG when you specifically need a raster image.",
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
      <div className="flex-1 px-4 py-10">
        <main className="mx-auto w-full max-w-2xl space-y-8">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">URL to QR Code</h1>
            <p className="text-muted-foreground">
              Turn any link into a QR code. No fluff: paste a URL, generate, and download SVG/PNG.
            </p>
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Convert a URL to QR →
            </Link>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Common uses</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Business cards and resumes</li>
              <li>Flyers and posters</li>
              <li>Menus, signage, and packaging</li>
              <li>App downloads and social profiles</li>
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


