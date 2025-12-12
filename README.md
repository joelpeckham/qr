# No Bullshit QR Code Generator

A simple, fast QR code generator for URLs with **optional** URL shortening. Built with Next.js, React, and TypeScript.

## Features

- **URL → QR (fast)**: Paste a URL, generate instantly
- **Optional URL Shortening**: If configured, URLs are shortened via the Spoo.me API before generating QR codes
- **Works without an API key**: If `SPOO_ME_API_KEY` is not set (or Spoo fails), the QR code will encode the normalized long URL instead
- **Multiple Export Formats**: Download QR codes as SVG or PNG
- **Customizable PNG Export**: Adjust PNG size (1–5000px) and toggle transparent backgrounds
- **Copy to Clipboard**: Copy the QR destination URL (shortened when available)
- **Smart URL Handling**: Automatically adds `https://` protocol if missing
- **Dark mode**: Theme toggle in the UI
- **Responsive Design**: Works on all device sizes

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Spoo.me API key (optional, enables URL shortening)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd qr
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. (Optional) Add your Spoo.me API key to a `.env.local` file in the root directory:
```
SPOO_ME_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

- **`/`**: The QR code generator UI
- **`/api/shorten`**: URL normalization + optional shortening (used by the UI when “Shorten URL” is enabled)
- **SEO/FAQ pages**: `/qr-code-generator`, `/url-to-qr`, `/short-url-qr`, `/faq`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOO_ME_API_KEY` | Your Spoo.me API key for URL shortening | No (but recommended) |

If `SPOO_ME_API_KEY` is not set (or Spoo.me is unavailable), the app will still work: the QR code will encode the normalized long URL and the UI will indicate it wasn’t shortened.

## Usage

1. Enter a URL in the input field (with or without `https://`)
2. Click "Generate" or press Enter
3. If "Shorten URL" is enabled, the URL will be shortened (when configured) and a QR code will be generated; otherwise the QR code will encode the normalized long URL
4. Download the QR code as SVG or PNG
5. For PNG exports, adjust the size and toggle transparent background as needed

## API Route

The app includes an API route at `/api/shorten` that:
- Validates and normalizes URLs
- Attempts to shorten URLs via Spoo.me (when configured)
- Includes rate limiting (10 requests per minute per IP; in-memory per server instance)
- Validates request size (max 10KB)
- Handles errors gracefully

### Request/Response

**Request body**:

```json
{ "longUrl": "https://example.com" }
```

**Successful response** (shortened):

```json
{
  "longUrl": "https://example.com",
  "shortUrl": "https://spoo.me/abc123",
  "qrUrl": "https://spoo.me/abc123",
  "wasShortened": true
}
```

**Successful response** (fallback; not shortened):

```json
{
  "longUrl": "https://example.com",
  "qrUrl": "https://example.com",
  "wasShortened": false,
  "warning": "Optional: reason shortening failed"
}
```

**Error response**:

```json
{ "error": "Message" }
```


## Building for Production

```bash
npm run build
npm start
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `SPOO_ME_API_KEY` environment variable
4. Deploy

The app is also compatible with other platforms that support Next.js.

## Technologies Used

- [Next.js](https://nextjs.org) - React framework
- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [qrcode.react](https://www.npmjs.com/package/qrcode.react) - QR code generation
- [Spoo.me API](https://spoo.me) - URL shortening
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme switching
- [Vercel Analytics](https://vercel.com/docs/analytics) - Analytics (optional)

## License

MIT
