import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "Kiyora Brand Analysis | ระบบวิเคราะห์แบรนด์",
  description: "ระบบวิเคราะห์ข้อมูลและทำนายพฤติกรรมลูกค้าสำหรับแบรนด์ Kiyora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#FFFAF5] font-sans">
        <div className="flex h-full">
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <Sidebar />
          </div>
          <main className="lg:pl-72 flex-1 h-full overflow-auto">
            <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
