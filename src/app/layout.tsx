import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { MqttProvider } from "@/components/MqttProvider";
import { Toaster } from "@/components/Toaster";

import "../styles/index.css";

// Font configurations
const interstate = localFont({
  src: [
    {
      path: "../fonts/InterstateRegular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-interstate",
});

const geometria = localFont({
  src: [
    {
      path: "../fonts/Geometria.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geometria",
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
          interstate.variable,
          geometria.variable,
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
