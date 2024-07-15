import type { Metadata } from "next";
import "@/styles/globals.css";
import { Karla as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar/Navbar";
import BGCloud1 from '@/components/icons/BGCloud1';
import styles from "@/app/(with-nav)/Layout.module.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dream Journal",
  description: "Log your dreams",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="app flex">
          <Navbar />
          {children}
        </div>
        <BGCloud1 className={`${styles.bgcloud} ${styles.bgcloud1}`} />
        <BGCloud1 className={`${styles.bgcloud} ${styles.bgcloud2}`} />
        <BGCloud1 className={`${styles.bgcloud} ${styles.bgcloud3}`} />
      </div>
    </>
  );
}
