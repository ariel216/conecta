"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { eliminarCookie } from "@/lib/cookies";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    eliminarCookie("auth");
    logout();
    window.location.href = process.env.NEXT_CORE_LOGIN || "/";
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="rounded-xl px-4 py-2 cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
