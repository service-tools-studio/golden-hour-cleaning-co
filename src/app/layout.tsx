import type { Metadata, Viewport } from "next";
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

/** Reduce iOS Chrome jumpiness when browser chrome shows/hides. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
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
              "try{if('scrollRestoration' in history)history.scrollRestoration='manual';var h=location.hash;if(!h||h==='#'||h.indexOf(':~:')!==-1){scrollTo(0,0);document.documentElement.scrollTop=0;}}catch(e){}",
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
        <div id="page-top" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
