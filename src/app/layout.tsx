import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { anton, inter } from "@/lib/fonts";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import CookieBanner from "@/components/CookieBanner";
import PromoPopup from "@/components/PromoPopup";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DROPX — Limited sneaker drops and exclusive releases",
  description:
    "Shop limited-release sneakers, upcoming drops, and member deals at DROPX.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthSessionProvider>
          {children}
          <PromoPopup />
          <CookieBanner />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
