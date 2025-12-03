# QR Code Generator

A simple, fast QR code generator that automatically shortens URLs and creates QR codes. Built with Next.js, React, and TypeScript.

## Features

- **Automatic URL Shortening**: URLs are automatically shortened via the Spoo.me API before generating QR codes
- **Multiple Export Formats**: Download QR codes as SVG or PNG
- **Customizable PNG Export**: Adjust PNG size (100-5000px) and toggle transparent backgrounds
- **Copy to Clipboard**: Easily copy shortened URLs
- **Smart URL Handling**: Automatically adds `https://` protocol if missing
- **Accessible**: Built with accessibility in mind (ARIA labels, keyboard navigation)
- **Responsive Design**: Works on all device sizes

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Spoo.me API key (optional, but recommended for production)

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

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your Spoo.me API key to `.env.local`:
```
SPOO_ME_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOO_ME_API_KEY` | Your Spoo.me API key for URL shortening | No (but recommended) |

If `SPOO_ME_API_KEY` is not set, the app will still work but may have limited functionality depending on Spoo.me's API requirements.

## Usage

1. Enter a URL in the input field (with or without `https://`)
2. Click "Generate" or press Enter
3. The URL will be shortened and a QR code will be generated
4. Download the QR code as SVG or PNG
5. For PNG exports, adjust the size and toggle transparent background as needed

## API Route

The app includes an API route at `/api/shorten` that:
- Validates and normalizes URLs
- Shortens URLs via Spoo.me API
- Includes rate limiting (10 requests per minute per IP)
- Validates request size (max 10KB)
- Handles errors gracefully

## Project Structure

```
qr/
├── app/
│   ├── api/
│   │   └── shorten/
│   │       └── route.ts          # API route for URL shortening
│   ├── page.tsx                   # Main page component
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── UrlInput.tsx               # URL input component
│   ├── QRCodeDisplay.tsx         # QR code display component
│   ├── DownloadControls.tsx       # Download buttons component
│   └── PngSettings.tsx            # PNG settings component
├── lib/
│   ├── qr-utils.ts               # QR code utility functions
│   ├── url-utils.ts               # URL normalization utilities
│   └── spoo-api.ts                # Spoo.me API client
└── public/                        # Static assets
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

## License

MIT
