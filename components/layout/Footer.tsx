"use client";

import NextLink from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@heroui/react";

interface FooterProps {
  variant?: "full" | "minimal";
}

export function Footer({ variant = "full" }: FooterProps) {
  if (variant === "minimal") {
    return (
      <footer className="py-8 border-t border-stone-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-400">
          <p>
            Based on research from the Open Science Framework. Your responses
            are stored locally and are not shared.
          </p>
        </div>
      </footer>
    );
  }

  // Full variant (default)
  return (
    <footer className="py-16 px-4 border-t border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Smartphone" className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">Doomscroll Check</span>
            </div>
            <p className="text-stone-500 leading-relaxed">
              A research-based tool to help you understand and improve your 
              relationship with social media and news consumption.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link as={NextLink} href="/assessment" className="text-stone-500 hover:text-primary transition-colors">
                  Take Assessment
                </Link>
              </li>
              <li>
                <Link as={NextLink} href="/results" className="text-stone-500 hover:text-primary transition-colors">
                  View Results
                </Link>
              </li>
              <li>
                <Link as={NextLink} href="/dashboard" className="text-stone-500 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Research</h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              Based on &quot;The Dark at the End of the Tunnel: Doomscrolling on 
              Social Media Newsfeeds&quot; and other peer-reviewed studies on 
              problematic social media use (n=401 participants).
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-400">
            © 2025 Doomscroll Check. Built for those who want their time back.
          </p>
          <p className="text-xs text-stone-300">
            Not a substitute for professional mental health advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
