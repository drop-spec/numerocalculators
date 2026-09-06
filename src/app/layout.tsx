import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@/components/SiteChrome";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://numerocalculators.com"),
  title: { default: "Numero Calculators — Free calculators for everyday life", template: "%s | Numero Calculators" },
  description: "Quick, useful calculators for money, percentages, time, conversions, health, math, business, and AI costs.",
  verification: { google: "2o-ysAMZ-u80FkmVLwo8gSpeXtMCL1FP5Fsygn_GTT8" },
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Numero Calculators" },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TBKPDQR9RZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TBKPDQR9RZ');`}
        </Script>
      </body>
    </html>
  );
}
