import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { MqttProvider } from "@/components/MqttProvider";
import { Toaster } from "@/components/Toaster";

import "../styles/index.css";

// TODO ask for font "interstate"
const teleNeo = localFont({
  src: [
    {
      path: "../fonts/TeleNeo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/TeleNeo-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/TeleNeo-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/TeleNeo-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Iron Mountain Overlook Tablet",
  description: "",
  robots: {
    follow: false,
    index: false,
  },
};

export const viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-theme="dark">
      <body
        className={cn(
          teleNeo.className,
          "text-foreground-primary bg-background-primary antialiased",
        )}
      >
        <MqttProvider>{children}</MqttProvider>

        {/* Toast Alerts */}
        <Toaster />
      </body>
    </html>
  );
}
