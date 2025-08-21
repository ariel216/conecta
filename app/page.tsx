"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { AdminDashboard } from "@/components/admin-dashboard";
import { EventsManagement } from "@/components/events-management";
import { CompaniesManagement } from "@/components/companies-management";
import { ProductsManagement } from "@/components/products-management";
import { AttendanceManagement } from "@/components/attendance-management";
import { MeetingsManagement } from "@/components/meetings-management";
import { NegotiatedManagement } from "@/components/negotiated-management";
import {
  eventosFake,
  empresasFake,
  productosFake,
  type Evento,
  type Empresa,
  type Producto,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  BarChart3,
  Settings,
  Building2,
  Package,
  UserCheck,
  Handshake,
  DollarSign,
} from "lucide-react";

export default function HomePage() {
  const [eventos, setEventos] = useState<Evento[]>(eventosFake);
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasFake);
  const [productos, setProductos] = useState<Producto[]>(productosFake);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleEventCreated = (nuevoEvento: Evento) => {
    setEventos((prev) => [...prev, nuevoEvento]);
  };

  const handleEditEvent = (evento: Evento) => {
    console.log("Editar evento:", evento);
    alert(`Funcionalidad de edición para: ${evento.descripcion_evento}`);
  };

  const handleDeleteEvent = (eventoId: number) => {
    if (confirm("¿Está seguro de que desea eliminar este evento?")) {
      setEventos((prev) => prev.filter((evento) => evento.id !== eventoId));
      alert("Evento eliminado exitosamente");
    }
  };

  const handleCompanyCreated = (nuevaEmpresa: Empresa) => {
    setEmpresas((prev) => [...prev, nuevaEmpresa]);
  };

  const handleEditCompany = (empresa: Empresa) => {
    console.log("Editar empresa:", empresa);
    alert(`Funcionalidad de edición para: ${empresa.nombre}`);
  };

  const handleDeleteCompany = (empresaId: number) => {
    if (confirm("¿Está seguro de que desea eliminar esta empresa?")) {
      setEmpresas((prev) => prev.filter((empresa) => empresa.id !== empresaId));
      alert("Empresa eliminada exitosamente");
    }
  };

  const handleProductCreated = (nuevoProducto: Producto) => {
    setProductos((prev) => [...prev, nuevoProducto]);
  };

  return (
    <AdminLayout>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="h-4 w-4" />
            Panel
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="flex items-center gap-2 cursor-pointer"
          >
            <CalendarDays className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="h-4 w-4" />
            Empresas
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Package className="h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            Asistencias
          </TabsTrigger>
          <TabsTrigger
            value="meetings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Handshake className="h-4 w-4" />
            Reuniones
          </TabsTrigger>
          {/* <TabsTrigger value="negotiated" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Negociados
          </TabsTrigger> */}
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard eventos={eventos} empresas={empresas} />
        </TabsContent>

        <TabsContent value="events">
          <EventsManagement
            eventos={eventos}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onEventCreated={handleEventCreated}
          />
        </TabsContent>

        <TabsContent value="companies">
          <CompaniesManagement
            empresas={empresas}
            onEditCompany={handleEditCompany}
            onDeleteCompany={handleDeleteCompany}
            onCompanyCreated={handleCompanyCreated}
          />
        </TabsContent>

        <TabsContent value="products">
          <ProductsManagement onProductAdded={handleProductCreated} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceManagement />
        </TabsContent>

        <TabsContent value="meetings">
          <MeetingsManagement />
        </TabsContent>

        <TabsContent value="negotiated">
          <NegotiatedManagement />
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Configuración del Sistema
            </h3>
            <p className="text-muted-foreground">
              Funcionalidades de configuración estarán disponibles en futuras
              versiones
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
