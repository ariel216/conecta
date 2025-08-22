"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Menu,
  CalendarDays,
  Home,
  Building,
  Package,
  Users,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "./theme-toogle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const menuItems = [
  { name: "Inicio", href: "/", icon: <Home className="h-4 w-4" /> },
  {
    name: "Eventos",
    href: "/events",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    name: "Empresas",
    href: "/companies",
    icon: <Building className="h-4 w-4" />,
  },
  {
    name: "Asistencias",
    href: "/attendance",
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: "Configuración",
    href: "/config",
    icon: <Settings className="h-4 w-4" />,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header administrativo */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Nombre */}
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

            {/* Menú desktop */}
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              {menuItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1 transition-colors hover:text-foreground ${
                      active
                        ? "text-foreground border-b-2 border-primary pb-1"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Badge className="bg-green-100 text-green-600 dark:text-green-700">
                Administrador
              </Badge>

              {/* Menú móvil */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-4">
                    <nav className="flex flex-col gap-4 mt-4">
                      {menuItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 text-base transition-colors hover:text-foreground ${
                              active
                                ? "text-foreground font-semibold border-l-2 border-primary pl-2"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 py-2">{children}</main>
    </div>
  );
}
