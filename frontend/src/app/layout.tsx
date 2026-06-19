import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Management App",
  description: "A premium task management application",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
