import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description:
    "Generate a QR code from any URL. Fast, free, and no nonsense. Optional URL shortening plus SVG/PNG downloads.",
  alternates: { canonical: "/qr-code-generator" },
  openGraph: {
    title: "QR Code Generator",
    description:
      "Generate a QR code from any URL. Fast, free, and no nonsense. Optional URL shortening plus SVG/PNG downloads.",
    url: "/qr-code-generator",
  },
};

export default function QrCodeGeneratorPage() {
  const faq = [
    {
      q: "How do I generate a QR code from a URL?",
      a: "Paste the URL on the homepage and click Generate. You can then download the QR code as SVG or PNG.",
    },
    {
      q: "Should I use a shortened URL in a QR code?",
      a: "Sometimes. Short URLs can make QR codes less dense (easier to scan), but you’re relying on the shortener to keep working.",
    },
    {
      q: "Can I download a high-resolution QR code?",
      a: "Yes. Use SVG for infinite scaling, or PNG with a custom pixel size.",
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
            <h1 className="text-4xl font-bold tracking-tight">QR Code Generator (No Bullshit)</h1>
            <p className="text-muted-foreground">
              Generate a QR code from any URL in seconds. Optional URL shortening. Download SVG or PNG.
            </p>
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Go to the generator →
            </Link>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">What you get</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>URL → QR code in one click</li>
              <li>Optional URL shortening (falls back to the original URL if unavailable)</li>
              <li>SVG download for perfect printing</li>
              <li>PNG download with custom size and optional transparent background</li>
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


