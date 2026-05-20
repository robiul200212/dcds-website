import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dcds.vercel.app"),
  title: {
    default: "DCDS — Dhaka College Debating Society",
    template: "%s | DCDS",
  },
  description:
    "Dhaka College Debating Society (DCDS) — Bangladesh's premier academic debate club at Dhaka College. Fostering critical thinking, public speaking, and leadership since 1995.",
  keywords: [
    "DCDS",
    "Dhaka College Debating Society",
    "debate club Bangladesh",
    "Dhaka College",
    "debating society",
    "public speaking Bangladesh",
  ],
  authors: [{ name: "DCDS" }],
  creator: "Dhaka College Debating Society",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DCDS — Dhaka College Debating Society",
    title: "DCDS — Dhaka College Debating Society",
    description:
      "Bangladesh's premier academic debate club. Join DCDS to develop critical thinking, public speaking and leadership.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "DCDS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DCDS — Dhaka College Debating Society",
    description: "Bangladesh's premier academic debate club.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "", // Add Google Search Console verification here
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0F2040",
                color: "#fff",
                border: "1px solid rgba(27,143,216,0.3)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#1B8FD8", secondary: "#fff" } },
              error: { iconTheme: { primary: "#C41230", secondary: "#fff" } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
