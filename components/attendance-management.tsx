"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  X,
  Check,
  Calendar,
  Building2,
  Plus,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import {
  asistenciasFake,
  eventosFake,
  empresasFake,
  actualizarEstadoAsistencia,
  puedeCancelarAsistencia,
  agregarAsistencia,
  esEventoDisponibleParaAsistencia,
  type Asistencia,
} from "@/lib/data";
import { toast } from "sonner";

export function AttendanceManagement() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const getEventoNombre = (id: number) => {
    return (
      eventosFake.find((e) => e.id === id)?.descripcion_evento ||
      "Evento no encontrado"
    );
  };

  const getEmpresaNombre = (id: number) => {
    return (
      empresasFake.find((e) => e.id === id)?.nombre || "Empresa no encontrada"
    );
  };

  const getEvento = (id: number) => {
    return eventosFake.find((e) => e.id === id);
  };

  const eventosDisponibles = eventosFake.filter((evento) =>
    esEventoDisponibleParaAsistencia(evento)
  );

  const filteredAsistencias = selectedEventId
    ? asistenciasFake.filter((asistencia) => {
        if (asistencia.id_evento !== selectedEventId) return false;

        const empresa = getEmpresaNombre(asistencia.id_empresa).toLowerCase();
        const matchesSearch = empresa.includes(searchTerm.toLowerCase());
        const matchesEstado =
          filterEstado === "todos" || asistencia.estado === filterEstado;

        return matchesSearch && matchesEstado;
      })
    : [];

  const getEmpresasDisponibles = () => {
    if (!selectedEventId) return [];

    const empresasConAsistencia = asistenciasFake
      .filter((a) => a.id_evento === selectedEventId)
      .map((a) => a.id_empresa);

    return empresasFake.filter(
      (empresa) => !empresasConAsistencia.includes(empresa.id)
    );
  };

  const handleCancelarAsistencia = (asistencia: Asistencia) => {
    const evento = getEvento(asistencia.id_evento);
    if (evento && puedeCancelarAsistencia(evento)) {
      actualizarEstadoAsistencia(asistencia.id, "cancelada");
      setRefreshKey((prev) => prev + 1);
      toast.success("Registro exitoso");
    } else {
      toast.error(
        "No se puede cancelar la asistencia. El evento es muy próximo"
      );
    }
  };

  const handleConfirmarAsistencia = (asistencia: Asistencia) => {
    actualizarEstadoAsistencia(asistencia.id, "confirmada");
    setRefreshKey((prev) => prev + 1);
    toast.success("Asistencia confirmada exitosamente");
  };

  const exportToCSV = () => {
    const headers = ["ID", "Evento", "Empresa", "Estado", "Fecha Registro"];
    const data = filteredAsistencias.map((asistencia) => [
      asistencia.id,
      getEventoNombre(asistencia.id_evento),
      getEmpresaNombre(asistencia.id_empresa),
      asistencia.estado,
      new Date(asistencia.fecha_registro).toLocaleDateString("es-CO"),
    ]);

    const csvContent = [headers, ...data]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asistencias_evento_${selectedEventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEstadoBadge = (estado: Asistencia["estado"]) => {
    switch (estado) {
      case "confirmada":
        return (
          <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
        );
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "cancelada":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  //////////////////
  const [selectedEmpresas, setSelectedEmpresas] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [empresaSearch, setEmpresaSearch] = useState("");
  const pageSize = 10;

  const empresasDisponibles = getEmpresasDisponibles();

  // Filtrado por buscador
  const filteredEmpresas = empresasDisponibles.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(empresaSearch.toLowerCase())
  );

  // Calcular paginación
  const totalPages = Math.ceil(filteredEmpresas.length / pageSize);
  const paginatedEmpresas = filteredEmpresas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Toggle checkbox individual
  const toggleEmpresaSeleccionada = (id: number) => {
    setSelectedEmpresas((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Toggle checkbox de página completa
  const toggleAllPage = () => {
    const idsPagina = paginatedEmpresas.map((e) => e.id);
    const allSelected = idsPagina.every((id) => selectedEmpresas.includes(id));

    if (allSelected) {
      // deseleccionar todos
      setSelectedEmpresas((prev) =>
        prev.filter((id) => !idsPagina.includes(id))
      );
    } else {
      // agregar todos los de la página
      setSelectedEmpresas((prev) => [
        ...prev,
        ...idsPagina.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  // Registrar múltiples asistencias
  const handleAgregarAsistencias = () => {
    if (!selectedEventId || selectedEmpresas.length === 0) return;

    selectedEmpresas.forEach((idEmpresa) => {
      agregarAsistencia(selectedEventId, idEmpresa);
    });

    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
    setSelectedEmpresas([]);
    setEmpresaSearch("");
    toast.success("Registro exitoso");
  };
  /////////////////

  if (!selectedEventId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold ">Gestión de Asistencias</h2>
          <p className="dark:text-gray-400 mt-1">
            Selecciona un evento para gestionar sus asistencias
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Eventos Disponibles</CardTitle>
            <CardDescription>
              Selecciona un evento para ver y gestionar sus asistencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eventosDisponibles.map((evento) => {
                const asistenciasCount = asistenciasFake.filter(
                  (a) => a.id_evento === evento.id
                ).length;
                const confirmadas = asistenciasFake.filter(
                  (a) => a.id_evento === evento.id && a.estado === "confirmada"
                ).length;

                return (
                  <Card
                    key={evento.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedEventId(evento.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {evento.descripcion_evento}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {evento.lugar}
                          </p>
                          <div className="flex flex-col items-start gap-2 text-xs">
                            <span className="text-gray-600 dark:text-gray-300">
                              {new Date(evento.fecha_evento).toLocaleDateString(
                                "es-BO"
                              )}
                            </span>
                            <div className="flex gap-2">
                              <span className="px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                                {asistenciasCount} asistencias
                              </span>
                              <span className="px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                                {confirmadas} confirmadas
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedEvent = getEvento(selectedEventId);
  //const empresasDisponibles = getEmpresasDisponibles();

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedEventId(null)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Eventos
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              Asistencias - {selectedEvent?.descripcion_evento}
            </h2>
            <div className="flex flex-row gap-2">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-300 mt-1" />
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedEvent?.lugar} •{" "}
                {selectedEvent &&
                  new Date(selectedEvent.fecha_evento).toLocaleDateString(
                    "es-CO"
                  )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                Agregar Asistencia
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Asistencia</DialogTitle>
                <DialogDescription>
                  Selecciona una o varias empresas para registrar sus
                  asistencias
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar empresa..."
                    value={empresaSearch}
                    onChange={(e) => {
                      setEmpresaSearch(e.target.value);
                      setCurrentPage(1); // reset página al buscar
                    }}
                    className="pl-10"
                  />
                </div>

                {/* Tabla de empresas */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <input
                            type="checkbox"
                            onChange={toggleAllPage}
                            checked={
                              paginatedEmpresas.length > 0 &&
                              paginatedEmpresas.every((e) =>
                                selectedEmpresas.includes(e.id)
                              )
                            }
                          />
                        </TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Rubro</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEmpresas.map((empresa) => (
                        <TableRow key={empresa.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedEmpresas.includes(empresa.id)}
                              onChange={() =>
                                toggleEmpresaSeleccionada(empresa.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {empresa.nombre}
                          </TableCell>
                          <TableCell>{empresa.rubro}</TableCell>
                          <TableCell>{empresa.tipo}</TableCell>
                        </TableRow>
                      ))}
                      {paginatedEmpresas.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-gray-500"
                          >
                            No se encontraron empresas
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginador */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {currentPage} de {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Siguiente
                  </Button>
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAgregarAsistencias}
                    disabled={selectedEmpresas.length === 0}
                  >
                    Registrar Asistencias
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2 bg-transparent cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>
            Filtra las asistencias por estado o busca por empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Asistencias ({filteredAsistencias.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAsistencias.map((asistencia) => {
                  const evento = getEvento(asistencia.id_evento);
                  const puedeCancelar = evento
                    ? puedeCancelarAsistencia(evento)
                    : false;

                  return (
                    <TableRow key={asistencia.id}>
                      <TableCell className="font-medium">
                        #{asistencia.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-600" />
                          {getEmpresaNombre(asistencia.id_empresa)}
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(asistencia.estado)}</TableCell>
                      <TableCell>
                        {new Date(asistencia.fecha_registro).toLocaleDateString(
                          "es-BO"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {asistencia.estado === "pendiente" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleConfirmarAsistencia(asistencia)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {asistencia.estado !== "cancelada" &&
                            puedeCancelar && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleCancelarAsistencia(asistencia)
                                }
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          {!puedeCancelar &&
                            asistencia.estado !== "cancelada" && (
                              <span className="text-xs text-gray-500">
                                No cancelable
                              </span>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
