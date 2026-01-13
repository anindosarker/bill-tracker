"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-2xl font-bold">
          Bill Tracker
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
