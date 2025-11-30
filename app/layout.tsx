import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { BackgroundAnimations } from "@/components/ui/BackgroundAnimations";
import { Providers } from "./providers";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NLP Doomscrolling",
  description: "NLP-powered doomscrolling analysis application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Providers>
          <BackgroundAnimations />
          {children}
        </Providers>
      </body>
    </html>
  );
}
