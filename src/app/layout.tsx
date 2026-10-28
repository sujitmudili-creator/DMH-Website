import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { OfflineToast } from "@/components/ui/NetworkToasts";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Morepen Home · Care at home",
  description: "Nurses, doctors and lab tests at home, booked in a few taps.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={`${inter.variable} ${instrument.variable} antialiased`}>
        {children}
        <OfflineToast />
      </body>
    </html>
  );
}
