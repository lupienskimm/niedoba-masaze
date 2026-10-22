import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Fraunces,
  Karla,
  Manrope,
  Outfit,
  Playfair_Display,
  Barlow_Condensed,
} from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const displayKombi = Fraunces({
  variable: "--font-display-kombi",
  subsets: ["latin", "latin-ext"],
});

const bodyKombi = DM_Sans({
  variable: "--font-body-kombi",
  subsets: ["latin", "latin-ext"],
});

const displaySalt = Cormorant_Garamond({
  variable: "--font-display-salt",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const bodySalt = Outfit({
  variable: "--font-body-salt",
  subsets: ["latin", "latin-ext"],
});

const displayMed = Barlow_Condensed({
  variable: "--font-display-med",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const bodyMed = Manrope({
  variable: "--font-body-med",
  subsets: ["latin", "latin-ext"],
});

const displayMcg = Playfair_Display({
  variable: "--font-display-mcg",
  subsets: ["latin", "latin-ext"],
});

const bodyMcg = Karla({
  variable: "--font-body-mcg",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.masaze-niedoba.cz"),
  title: {
    default: `${site.name} | Jablunkov a Třinec`,
    template: `%s | ${site.name}`,
  },
  description: site.heroLead,
  icons: {
    icon: [
      { url: "/logos/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/logos/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logos/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
  },
  openGraph: {
    title: site.name,
    description: site.heroLead,
    images: ["/logos/og.png"],
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      data-theme="kombi"
      className={[
        displayKombi.variable,
        bodyKombi.variable,
        displaySalt.variable,
        bodySalt.variable,
        displayMed.variable,
        bodyMed.variable,
        displayMcg.variable,
        bodyMcg.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
