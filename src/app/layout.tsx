import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create next app",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-gray-100 min-h-lvh md:grid md:grid-cols-10">
          <div className="md:col-span-3 xl:col-span-2">
            <Sidebar />
          </div>
          <div className="md:py-12 md:px-14 pt-4 md:col-span-7 xl:col-span-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}