import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cinzel_Decorative } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "./theme-provider";
import { LightboxProvider } from "./components/lightbox";
import { PaletteProvider } from "./components/palette/palette-provider";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ornate",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vatsbrothers.com"),
  title: "Vats Brothers · AI Engineers, Dallas & Ahmedabad",
  description:
    "Siddarath and Vinayak Vats are brothers and AI engineers. One in Dallas, one in Ahmedabad. We design multi-agent systems, ship production RAG, and untangle the data and infra around them, together or independently.",
  openGraph: {
    title: "Vats Brothers · AI Engineers",
    description:
      "Two brothers building AI systems. Available together as a small consulting practice, or independently.",
    url: "https://vatsbrothers.com",
    siteName: "Vats Brothers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vats Brothers · AI Engineers",
    description:
      "Two brothers building AI systems. Available together as a small consulting practice, or independently.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${cinzelDecorative.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="vb-theme"
          disableTransitionOnChange
        >
          <LightboxProvider>
            <PaletteProvider>{children}</PaletteProvider>
          </LightboxProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
