import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: baseUrl,
    title: "فندق أوز بارك — القنفذة | OZ Park Hotel Al Qunfudhah",
    description:
      "في سواحل القنفذة وعلى مقربةٍ من البحر الأحمر، يقدّم فندق أوز بارك إقامة ساحلية فاخرة تجمع بين الخصوصية والرفاهية وإطلالات البحر الهادئة.",
    icons: {
      icon: "/images/ozpark/oz-park-icon.png",
      shortcut: "/images/ozpark/oz-park-icon.png",
    },
    openGraph: {
      title: "فندق أوز بارك — OZ Park Hotel",
      description: "جمال القنفذة من نافذة أوز بارك — Where Comfort Meets the Sea in Al Qunfudhah.",
      images: [{ url: new URL("/images/ozpark/hero-main.png", baseUrl).toString(), width: 1920, height: 1137 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "فندق أوز بارك — OZ Park Hotel",
      description: "جمال القنفذة من نافذة أوز بارك — Where Comfort Meets the Sea in Al Qunfudhah.",
      images: [new URL("/images/ozpark/hero-main.png", baseUrl).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
