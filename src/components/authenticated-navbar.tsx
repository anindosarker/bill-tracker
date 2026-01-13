"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";

export function AuthenticatedNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/dashboard" className="text-2xl font-bold">
          Bill Tracker
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Bill
            </Button>
          </Link>
          <Link href="/dashboard/bills">
            <Button variant="ghost" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              All Bills
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
