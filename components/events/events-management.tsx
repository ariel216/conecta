"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventForm } from "@/components/events/event-form";
import { contactosFake, departamentos, type Evento } from "@/lib/data";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Building2,
  Filter,
  Grid,
  List,
  Download,
  Plus,
} from "lucide-react";

interface EventsManagementProps {
  eventos: Evento[];
  onEditEvent?: (evento: Evento) => void;
  onDeleteEvent?: (eventoId: number) => void;
  onEventCreated?: (evento: Evento) => void;
}

type ViewMode = "table" | "cards";
type FilterStatus = "all" | "upcoming" | "today" | "past";

export function EventsManagement({
  eventos,
  onEditEvent,
  onDeleteEvent,
  onEventCreated,
}: EventsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filteredEventos, setFilteredEventos] = useState(eventos);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const applyFilters = () => {
    let filtered = eventos;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (evento) =>
          evento.descripcion_evento
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          evento.entidad_organizadora
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          evento.lugar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.departamento.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      filtered = filtered.filter((evento) => {
        const fechaEvento = new Date(evento.fecha_evento);
        fechaEvento.setHours(0, 0, 0, 0);

        switch (filterStatus) {
          case "upcoming":
            return fechaEvento > hoy;
          case "today":
            return fechaEvento.getTime() === hoy.getTime();
          case "past":
            return fechaEvento < hoy;
          default:
            return true;
        }
      });
    }

    if (filterDepartment !== "all") {
      filtered = filtered.filter(
        (evento) => evento.departamento === filterDepartment
      );
    }

    setFilteredEventos(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, filterDepartment, eventos]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleEventCreated = (evento: Evento) => {
    onEventCreated?.(evento);
    setShowCreateForm(false);
  };

  const getEventoEstado = (fechaEvento: string) => {
    const fecha = new Date(fechaEvento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    if (fecha > hoy) {
      return { label: "Próximo", variant: "default" as const };
    } else if (fecha.getTime() === hoy.getTime()) {
      return { label: "Hoy", variant: "secondary" as const };
    } else {
      return { label: "Finalizado", variant: "outline" as const };
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Descripción",
      "Organizador",
      "Lugar",
      "Departamento",
      "Dirección",
      "Fecha",
      "Hora Inicio",
      "Hora Fin",
      "Moneda",
      "Contacto ID",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredEventos.map((evento) =>
        [
          evento.id,
          `"${evento.descripcion_evento}"`,
          `"${evento.entidad_organizadora}"`,
          `"${evento.lugar}"`,
          `"${evento.departamento}"`,
          `"${evento.direccion}"`,
          evento.fecha_evento,
          evento.hora_inicio,
          evento.hora_fin,
          evento.id_contacto,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `eventos_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEventos.map((evento) => {
        const estado = getEventoEstado(evento.fecha_evento);
        return (
          <Card key={evento.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {evento.descripcion_evento}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Building2 className="h-4 w-4" />
                    {evento.entidad_organizadora}
                  </CardDescription>
                </div>
                <Badge variant={estado.variant} className="ml-2">
                  {estado.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(evento.fecha_evento).toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {evento.lugar}, {evento.departamento}
              </div>

              <div className="flex items-center justify-between pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => console.log("Ver evento", evento.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditEvent?.(evento)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteEvent?.(evento.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gestión de Eventos
              </CardTitle>
              <CardDescription>
                Administre todos los eventos registrados en el sistema
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredEventos.length} de {eventos.length} eventos
              </Badge>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Evento
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <EventForm onEventCreated={handleEventCreated} />
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="mt-4"
              >
                Cancelar
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterStatus}
              onValueChange={(value: FilterStatus) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="upcoming">Próximos</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="past">Finalizados</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-[200px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {departamentos.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "cards" ? (
            <CardView />
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Organizador</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEventos.length > 0 ? (
                    filteredEventos.map((evento) => {
                      const estado = getEventoEstado(evento.fecha_evento);
                      return (
                        <TableRow key={evento.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {evento.descripcion_evento}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {evento.id}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {evento.entidad_organizadora}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div>{evento.lugar}</div>
                                <div className="text-sm text-muted-foreground">
                                  {evento.departamento}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>
                                {new Date(
                                  evento.fecha_evento
                                ).toLocaleDateString("es-CO")}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {evento.hora_inicio} - {evento.hora_fin}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={estado.variant}>
                              {estado.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {contactosFake.find(
                                (c) => c.id === evento.id_contacto
                              )?.nombre || "No asignado"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    console.log("Ver evento", evento.id)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onEditEvent?.(evento)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteEvent?.(evento.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm ||
                        filterStatus !== "all" ||
                        filterDepartment !== "all"
                          ? "No se encontraron eventos que coincidan con los filtros aplicados"
                          : "No hay eventos registrados"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
