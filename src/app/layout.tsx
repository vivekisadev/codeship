import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ReportIssue } from "@/components/ReportIssue";
import { Preloader } from "@/components/Preloader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Codeship | Auto-Push LeetCode to GitHub",
  description: "A powerful browser extension that automatically pushes your accepted LeetCode solutions directly to your GitHub repository.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
        <div className="noise-overlay"></div>
        <div className="mesh-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <Providers>
          <Preloader>
            {children}
            <ReportIssue />
          </Preloader>
        </Providers>
      </body>
    </html>
  );
}
