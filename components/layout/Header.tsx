"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

interface HeaderProps {
  variant?: "floating" | "sticky";
  transparent?: boolean;
}

export function Header({ variant = "floating", transparent = false }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "Home", mobileOnly: true },
    { href: "/assessment", label: "Assessment" },
    { href: "/journal", label: "Journal" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/results", label: "Results" },
  ];

  if (variant === "sticky") {
    return (
      <header className={`border-b border-stone-200 ${transparent ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <NextLink href="/" className="flex items-center gap-2 group cursor-pointer">
            <Icon
              name="Smartphone"
              className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-lg text-stone-800 tracking-tight group-hover:text-primary transition-colors">
              Doomscroll Check
            </span>
          </NextLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.filter(item => !item.mobileOnly).map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-stone-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </NextLink>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6 text-stone-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white">
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-stone-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.label}
                </NextLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Floating variant (default)
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95vw] md:w-[90vw] max-w-4xl px-2 md:px-4">
      <div className="bg-white/80 backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-2xl shadow-lg shadow-black/5 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <NextLink href="/" className="flex items-center gap-2 group cursor-pointer">
            <Icon
              name="Smartphone"
              className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-sm md:text-base text-stone-800 tracking-tight group-hover:text-primary transition-colors">
              Doomscroll Check
            </span>
          </NextLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.filter(item => !item.mobileOnly).map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                className={`font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-stone-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </NextLink>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100/50 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <nav className="flex flex-col p-3 gap-1">
            {navItems.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium text-base px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-stone-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </NextLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
