"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageContainerProps {
  children: ReactNode;
  headerVariant?: "floating" | "sticky";
  footerVariant?: "full" | "minimal";
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  transparentHeader?: boolean;
}

export function PageContainer({
  children,
  headerVariant = "floating",
  footerVariant = "full",
  className = "",
  showHeader = true,
  showFooter = true,
  transparentHeader = false,
}: PageContainerProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && <Header variant={headerVariant} transparent={transparentHeader} />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer variant={footerVariant} />}
    </div>
  );
}
