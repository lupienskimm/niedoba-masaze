import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const classic = Libre_Baskerville({
  variable: "--font-classic",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
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
      className={`${inter.variable} ${classic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
