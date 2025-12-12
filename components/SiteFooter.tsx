import Link from "next/link";

const links: Array<{ href: string; label: string }> = [
  { href: "/qr-code-generator", label: "QR Code Generator" },
  { href: "/url-to-qr", label: "URL to QR" },
  { href: "/short-url-qr", label: "Short URL QR" },
  { href: "/faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border/60">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 text-sm text-muted-foreground">
        <nav aria-label="Site navigation" className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground underline-offset-4 hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4">
          <span className="text-foreground/90">No Bullshit QR</span> — generate QR codes fast.{" "}
          <Link href="/" className="hover:text-foreground underline-offset-4 hover:underline">
            Create a QR code now
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}


