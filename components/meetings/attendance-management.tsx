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
import { Search, Download, X, Check, Plus, Building2 } from "lucide-react";
import {
  asistenciasFake,
  eventosFake,
  empresasFake,
  actualizarEstadoAsistencia,
  puedeCancelarAsistencia,
  agregarAsistencia,
  type Asistencia,
} from "@/lib/data";
import { toast } from "sonner";

interface AttendanceManagementProps {
  eventId: number;
  onConfirmedChange?: (confirmed: Asistencia[]) => void;
}

export function AttendanceManagement({
  eventId,
  onConfirmedChange,
}: AttendanceManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  //const [confirmed, setConfirmed] = useState<any[]>([]);

  const selectedEvent = eventosFake.find((e) => e.id === eventId);
  if (!selectedEvent)
    return <p className="text-red-500">Evento no encontrado</p>;

  const getEmpresaNombre = (id: number) => {
    return (
      empresasFake.find((e) => e.id === id)?.nombre || "Empresa no encontrada"
    );
  };

  const filteredAsistencias = asistenciasFake.filter((asistencia) => {
    if (asistencia.id_evento !== eventId) return false;
    const empresa = getEmpresaNombre(asistencia.id_empresa).toLowerCase();
    const matchesSearch = empresa.includes(searchTerm.toLowerCase());
    const matchesEstado =
      filterEstado === "todos" || asistencia.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getEmpresasDisponibles = () => {
    const empresasConAsistencia = asistenciasFake
      .filter((a) => a.id_evento === eventId)
      .map((a) => a.id_empresa);

    return empresasFake.filter(
      (empresa) => !empresasConAsistencia.includes(empresa.id)
    );
  };

  const handleConfirmarAsistencia = (asistencia: Asistencia) => {
    actualizarEstadoAsistencia(asistencia.id, "confirmada");
    setRefreshKey((prev) => prev + 1);
    toast.success("Asistencia confirmada exitosamente");

    const confirmadas = getAsistenciasConfirmadas();
    onConfirmedChange?.(confirmadas);
  };

  const handleCancelarAsistencia = (asistencia: Asistencia) => {
    if (puedeCancelarAsistencia(selectedEvent)) {
      actualizarEstadoAsistencia(asistencia.id, "cancelada");
      setRefreshKey((prev) => prev + 1);
      toast.success("Registro exitoso");

      const confirmadas = getAsistenciasConfirmadas();
      onConfirmedChange?.(confirmadas);
    } else {
      toast.error(
        "No se puede cancelar la asistencia. El evento es muy próximo"
      );
    }
  };

  const getAsistenciasConfirmadas = () => {
    return asistenciasFake.filter(
      (a) => a.id_evento === eventId && a.estado === "confirmada"
    );
  };

  const exportToCSV = () => {
    const headers = ["ID", "Empresa", "Estado", "Fecha Registro"];
    const data = filteredAsistencias.map((asistencia) => [
      asistencia.id,
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
    a.download = `asistencias_evento_${eventId}.csv`;
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

  // --- lógica de registrar empresas ---
  const [selectedEmpresas, setSelectedEmpresas] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [empresaSearch, setEmpresaSearch] = useState("");
  const pageSize = 10;

  const empresasDisponibles = getEmpresasDisponibles();
  const filteredEmpresas = empresasDisponibles.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(empresaSearch.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEmpresas.length / pageSize);
  const paginatedEmpresas = filteredEmpresas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleEmpresaSeleccionada = (id: number) => {
    setSelectedEmpresas((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleAllPage = () => {
    const idsPagina = paginatedEmpresas.map((e) => e.id);
    const allSelected = idsPagina.every((id) => selectedEmpresas.includes(id));
    if (allSelected) {
      setSelectedEmpresas((prev) =>
        prev.filter((id) => !idsPagina.includes(id))
      );
    } else {
      setSelectedEmpresas((prev) => [
        ...prev,
        ...idsPagina.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleAgregarAsistencias = () => {
    if (selectedEmpresas.length === 0) return;
    selectedEmpresas.forEach((idEmpresa) => {
      agregarAsistencia(eventId, idEmpresa);
    });
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
    setSelectedEmpresas([]);
    setEmpresaSearch("");
    toast.success("Registro exitoso");
  };

  return (
    <div className="mt-2" key={refreshKey}>
      <div className="flex justify-between items-center ml-1 mb-2">
        <div className="flex items-center gap-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 cursor-pointer">
                <Plus className="h-4 w-4" /> Agregar Asistencia
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar empresa..."
                    value={empresaSearch}
                    onChange={(e) => {
                      setEmpresaSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>

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
                      {paginatedEmpresas.map((empresa) => {
                        const isSelected = selectedEmpresas.includes(
                          empresa.id
                        );

                        return (
                          <TableRow
                            key={empresa.id}
                            className={`cursor-pointer ${
                              isSelected ? "bg-muted" : ""
                            }`}
                            onClick={(e) => {
                              if (
                                (e.target as HTMLElement).tagName !== "INPUT"
                              ) {
                                toggleEmpresaSeleccionada(empresa.id);
                              }
                            }}
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={isSelected}
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
                        );
                      })}

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

                {/* paginador */}
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

                {/* acciones */}
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
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* tabla asistencias */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Asistencias ({filteredAsistencias.length})
          </CardTitle>
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
          <div className="overflow-x-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAsistencias.map((asistencia) => {
                  const puedeCancelar = puedeCancelarAsistencia(selectedEvent);
                  return (
                    <TableRow key={asistencia.id}>
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
                        <div className="flex gap-2">
                          {asistencia.estado === "pendiente" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleConfirmarAsistencia(asistencia)
                                }
                                className="flex items-center gap-1"
                              >
                                <Check className="h-4 w-4" /> Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleCancelarAsistencia(asistencia)
                                }
                                disabled={!puedeCancelar}
                                className="flex items-center gap-1"
                              >
                                <X className="h-4 w-4" /> Cancelar
                              </Button>
                            </>
                          )}
                          {asistencia.estado === "confirmada" && (
                            <>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleCancelarAsistencia(asistencia)
                                }
                                disabled={!puedeCancelar}
                                className="flex items-center gap-1"
                              >
                                <X className="h-4 w-4" /> Cancelar
                              </Button>
                            </>
                          )}
                          {asistencia.estado === "cancelada" && (
                            <span className="text-gray-400 text-sm">
                              Cancelada
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredAsistencias.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500 py-4"
                    >
                      No se encontraron asistencias
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
