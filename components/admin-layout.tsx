"use client";

import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { ThemeToggle } from "./theme-toogle";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header administrativo */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Conecta</h1>
                <p className="text-sm text-muted-foreground">
                  Gestión de Ruedas de Negocios
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Badge className="bg-green-100 text-green-600 dark:text-green-700">
                Administrador
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
