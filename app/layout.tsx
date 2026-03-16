import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FrenchMaestro — EntreCultures 1",
  description:
    "Mastery-based French 1 learning app for Skyline High School — EntreCultures 1 ©2026 curriculum",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          {/* Desktop sidebar — hidden on mobile via CSS */}
          <Sidebar />

          {/* Content shifts right on desktop to account for sidebar */}
          <div className="md:pl-[256px] flex flex-col min-h-dvh">
            <TopBar />
            <main className="flex-1 px-4 md:px-6 py-6 pb-[calc(1.5rem+60px)] md:pb-6 max-w-screen overflow-x-hidden">
              {children}
            </main>
          </div>

          {/* Mobile bottom nav — hidden on desktop */}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
