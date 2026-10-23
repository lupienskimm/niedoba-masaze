import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { HashRedirect } from "@/components/HashRedirect";
import { Header } from "@/components/Header";
import { MobileQuickBar } from "@/components/MobileQuickBar";
import { NavStackTracker } from "@/components/NavStackTracker";
import { site } from "@/content/site";
import "./globals.css";

/** Single static weight — one file, optional so text paints immediately. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin-ext"],
  weight: "700",
  display: "optional",
  preload: true,
  adjustFontFallback: true,
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
    <html lang="cs" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Critical: hide unused home tree before main CSS loads (fixes LCP). */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".home-desktop{display:none}.home-mobile{display:block}@media (min-width:861px){.home-mobile{display:none!important}.home-desktop{display:block!important}}",
          }}
        />
        <HashRedirect />
        <NavStackTracker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileQuickBar />
      </body>
    </html>
  );
}
