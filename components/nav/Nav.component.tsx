"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavProps = {
  person_type: "filip" | "klara";
};

const navLinks = (slug: string) => [
  { href: `/${slug}`, label: "Dashboard" },
  { href: `/${slug}/entries`, label: "Entries" },
  { href: `/${slug}/settings`, label: "Settings" },
];

export const Nav = ({ person_type }: NavProps) => {
  const pathname = usePathname();
  const links = navLinks(person_type);
  const otherPerson = person_type === "filip" ? "klara" : "filip";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" ref={menuRef}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                  {
                    "bg-primary text-primary-foreground shadow-sm": isActive(href),
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50":
                      !isActive(href),
                  }
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="sm:hidden flex items-center gap-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          <Link
            href={`/${otherPerson}`}
            className="text-xs text-muted-foreground hover:text-foreground capitalize transition-colors whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Switch to {otherPerson}</span>
            <span className="sm:hidden">{otherPerson}</span>
          </Link>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden pb-4 border-t mt-2 pt-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                    {
                      "bg-primary text-primary-foreground shadow-sm": isActive(href),
                      "text-muted-foreground hover:text-foreground hover:bg-muted/50":
                        !isActive(href),
                    }
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
