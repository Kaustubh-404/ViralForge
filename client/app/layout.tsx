"use client";

import { Providers } from './providers';
import localFont from "next/font/local";
import "./globals.css";
import { useEffect, useState } from "react";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Optional: Animated floating memes component
const FloatingMemes = () => {
  return (
    <div className="relative h-40 mb-6">
      {/* Add floating meme animations here if desired */}
      {/* Example placeholder for animation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        🎭
      </div>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileView, setIsMobileView] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 440);
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener('resize', checkMobileView);

    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Show nothing while checking screen size
  // if (isMobileView === null) {
  //   return null;
  // }

  // Desktop view with QR code
  // if (!isMobileView) {
  //   return (
  //     <html lang="en">
  //       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  //         <div className="min-h-screen flex items-center justify-center bg-background p-4">
  //           <div className="max-w-md text-center space-y-4">
  //             <FloatingMemes />
  //             <h1 className="text-2xl font-bold text-foreground">
  //               Mobile Only App
  //             </h1>
  //             <p className="text-muted-foreground">
  //               This app is designed for mobile devices only. Please open it on
  //               your phone or tablet with a screen width smaller than 440px.
  //             </p>
  //             <div className="w-48 h-48 relative mx-auto border border-border rounded-lg overflow-hidden">
  //               <Image
  //                 src="/FunnyOrFud.png"
  //                 alt="QR Code"
  //                 fill
  //                 className="object-cover"
  //                 priority
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   );
  // }

  // Mobile view
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}