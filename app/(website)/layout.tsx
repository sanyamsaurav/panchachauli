import { Nav, Footer } from "@/components/layout";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});


export const metadata = {
  title: "Fly Panchachuli",
  description: "Explore Incredible Destinations",
};

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteSettingsProvider>
      <div className={`${inter.className} bg-gray-100 text-gray-800`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </SiteSettingsProvider>
  );
}