import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Script from "next/script";
import CalendlyClickTracker from "@/components/analytics/CalendlyClickTracker";
import ClickToCallTracker from "@/components/analytics/ClickToCallTracker";
import ScrollToTopOnNavigate from "@/components/ScrollToTopOnNavigate";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Golden Hour Cleaning Co.",
  description: "Residential and Commercial Cleaning by Golden Hour Cleaning Co.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={josefinSans.variable}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}",
          }}
        />
        {/* Google tag (gtag.js) — Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17703846603"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17703846603');
            gtag('config', 'G-BLS3NWN214');
          `}
        </Script>
      </head>
      <body className={`${josefinSans.className} antialiased`}>
        <ScrollToTopOnNavigate />
        <CalendlyClickTracker />
        <ClickToCallTracker />
        {children}
      </body>
    </html>
  );
}
