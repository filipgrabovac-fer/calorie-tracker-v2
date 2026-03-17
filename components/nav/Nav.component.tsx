"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddEntryForm } from "@/features/entries/add-entry-form/AddEntryForm.component";
import { QuickAddMealPicker } from "@/features/meals/quick-add-meal-picker/QuickAddMealPicker.component";

type NavProps = {
  person_type: "filip" | "klara";
};

const navLinks = (slug: string) => [
  { href: `/${slug}`, label: "Dashboard" },
  { href: `/${slug}/entries`, label: "Entries" },
  { href: `/${slug}/meals`, label: "Meals" },
  { href: `/${slug}/meal-plan`, label: "Meal Plan" },
  { href: `/${slug}/recipes`, label: "Recipes" },
  { href: `/${slug}/settings`, label: "Settings" },
];

export const Nav = ({ person_type }: NavProps) => {
  const pathname = usePathname();
  const links = navLinks(person_type);
  const otherPerson = person_type === "filip" ? "klara" : "filip";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
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
    <>
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

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsQuickAddOpen(true)}
                aria-label="Quick add meal"
                title="Quick Add"
              >
                <Zap className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsAddEntryOpen(true)}
                aria-label="Add entry"
                title="Add Entry"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <Link
                href={`/${otherPerson}`}
                className="text-xs text-muted-foreground hover:text-foreground capitalize transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">Switch to {otherPerson}</span>
                <span className="sm:hidden">{otherPerson}</span>
              </Link>
            </div>
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

      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <DialogContent
          className="sm:max-w-lg max-sm:fixed max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:h-dvh max-sm:rounded-none max-sm:border-0 flex flex-col p-0 gap-0 overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>Add Entry</DialogTitle>
            <DialogDescription>Record a new meal or snack</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4">
            <AddEntryForm
              person_type={person_type}
              defaultDate={new Date()}
              onSuccess={() => setIsAddEntryOpen(false)}
              onCancel={() => setIsAddEntryOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <QuickAddMealPicker
        person_type={person_type}
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
      />
    </>
  );
};
