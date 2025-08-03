"use client";

import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import BottomHeader from "@/components/BottomHeader";


const Header = dynamic(() => import("@/components/Header"), { ssr: false });

interface LayoutProps {
  children: ReactNode;
}


export default function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = 
        typeof window !== "undefined" ? window.navigator.userAgent : "";
      
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      
      setIsMobile(mobile);
      setIsLoading(false);
    };

    checkMobile();
  }, []);

  if (isLoading) {
    return null;
  }
  console.log(isMobile);
  

  // if (!isMobile) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background p-4">
  //       <div className="max-w-md text-center space-y-4">
  //         <FloatingMemes />
  //         <h1 className="text-2xl font-bold text-foreground">Mobile Only App</h1>
  //         <p className="text-muted-foreground">
  //           This app is designed for mobile devices only. Please open it on your phone or tablet.
  //         </p>
  //         <div className="w-48 h-48 relative mx-auto border border-border rounded-lg overflow-hidden">
  //           <Image 
  //             src="/images/Website.png" 
  //             alt="QR Code"
  //             fill
  //             className="object-cover"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Header />
      <main>{children}</main>
      <BottomHeader />
    </div>
  );
}