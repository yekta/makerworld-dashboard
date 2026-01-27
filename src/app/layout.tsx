import Navbar, { NavbarSpacer } from "@/components/navbar";
import Providers from "@/components/providers/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopLoader from "@/components/top-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "@yekta | MakerWorld",
  description: "Statistics dashboard for @yekta on MakerWorld.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark wrap-break-word text-foreground bg-background antialiased`}
      >
        <TopLoader />
        <Providers>{children}</Providers>
        <Navbar />
        <NavbarSpacer />
      </body>
    </html>
  );
}
