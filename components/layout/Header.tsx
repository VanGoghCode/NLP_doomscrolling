"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@heroui/react";

interface HeaderProps {
  variant?: "floating" | "sticky";
  transparent?: boolean;
}

export function Header({ variant = "floating", transparent = false }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  if (variant === "sticky") {
    return (
      <header className={`border-b border-stone-200 ${transparent ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <NextLink href="/" className="flex items-center gap-2 group">
            <Icon
              name="Smartphone"
              className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-lg text-stone-800 tracking-tight group-hover:text-primary transition-colors">
              Doomscroll Check
            </span>
          </NextLink>
          <nav className="flex items-center gap-4">
            <NextLink
              href="/assessment"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/assessment')
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Assessment
            </NextLink>
            <NextLink
              href="/journal"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/journal')
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Journal
            </NextLink>
            <NextLink
              href="/dashboard"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Dashboard
            </NextLink>
          </nav>
        </div>
      </header>
    );
  }

  // Floating variant (default)
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-4xl px-4">
      <Navbar
        className="bg-white/60 backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-2xl shadow-lg shadow-black/5 px-6 py-2"
        classNames={{
          wrapper: "px-4 gap-8 min-h-0 h-auto justify-between w-full",
          item: "data-[active=true]:text-primary",
        }}
      >
        <NavbarBrand>
          <NextLink href="/" className="flex items-center gap-2 group">
            <Icon
              name="Smartphone"
              className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-base text-stone-800 tracking-tight group-hover:text-primary transition-colors">
              Doomscroll Check
            </span>
          </NextLink>
        </NavbarBrand>
        <NavbarContent justify="end" className="gap-6">
          <NavbarItem isActive={isActive('/assessment')}>
            <Link
              as={NextLink}
              href="/assessment"
              className={`font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/assessment')
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Assessment
            </Link>
          </NavbarItem>
          <NavbarItem isActive={isActive('/journal')}>
            <Link
              as={NextLink}
              href="/journal"
              className={`font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/journal')
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Journal
            </Link>
          </NavbarItem>
          <NavbarItem isActive={isActive('/dashboard')}>
            <Link
              as={NextLink}
              href="/dashboard"
              className={`font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem isActive={isActive('/results')}>
            <Link
              as={NextLink}
              href="/results"
              className={`font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/results')
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Results
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
