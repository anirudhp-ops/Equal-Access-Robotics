import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Equal Access Robotics | Code belongs to everyone",
  description: "Equal Access Robotics connects young creators with volunteer tutors across 16 countries.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "Equal Access Robotics", description: "Code belongs to everyone.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Equal Access Robotics", description: "Code belongs to everyone.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
