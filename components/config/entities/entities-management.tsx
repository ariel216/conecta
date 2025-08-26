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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Building2,
  Grid,
  List,
} from "lucide-react";
import { EntidadDialog } from "./entities-dialog";

// --- Tipado ---
type Entidad = {
  id: number;
  nombre: string;
  sigla: string;
  url_logo?: string;
};

type ViewMode = "table" | "cards";
type ModalMode = "create" | "edit" | "view" | "delete";

// --- Componente principal ---
export function EntitiesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedEntidad, setSelectedEntidad] = useState<Entidad | null>(null);

  // Estado local con data de prueba
  const [data, setData] = useState<Entidad[]>([
    {
      id: 1,
      nombre: "Cámara de Comercio",
      sigla: "CCB",
      url_logo:
        "https://img.freepik.com/vector-premium/plantilla-vector-premium-diseno-gradiente-m-lgoo_646033-83.jpg",
    },
    {
      id: 2,
      nombre: "Ministerio de Desarrollo",
      sigla: "MDRyT",
    },
  ]);

  const filteredEntidades = data.filter((e) => {
    return (
      searchTerm === "" ||
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.sigla.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteEntidad = () => {
    if (selectedEntidad) {
      setData(data.filter((e) => e.id !== selectedEntidad.id));
      setModalMode(null);
      setSelectedEntidad(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Nombre", "Sigla", "URL Logo"];
    const csvContent = [
      headers.join(","),
      ...filteredEntidades.map((e) =>
        [e.id, `"${e.nombre}"`, e.sigla, e.url_logo ?? ""].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `entidades_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
  };

  // --- Vista Cards ---
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEntidades.map((e) => (
        <Card key={e.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{e.nombre}</CardTitle>
            <CardDescription>{e.sigla}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {e.url_logo && (
              <img
                src={e.url_logo}
                alt={e.nombre}
                className="h-16 object-contain"
              />
            )}
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedEntidad(e);
                      setModalMode("view");
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedEntidad(e);
                      setModalMode("edit");
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedEntidad(e);
                      setModalMode("delete");
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Gestión de Entidades
              </CardTitle>
              <CardDescription>
                Administre todas las entidades registradas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredEntidades.length} de {data.length} entidades
              </Badge>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedEntidad(null);
                  setModalMode("create");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Entidad
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar entidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Sigla</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntidades.length > 0 ? (
                    filteredEntidades.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">
                          {e.nombre}
                        </TableCell>
                        <TableCell>{e.sigla}</TableCell>
                        <TableCell>
                          {e.url_logo ? (
                            <img
                              src={e.url_logo}
                              alt={e.nombre}
                              className="h-8"
                            />
                          ) : (
                            "-"
                          )}
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
                                onClick={() => {
                                  setSelectedEntidad(e);
                                  setModalMode("view");
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" /> Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEntidad(e);
                                  setModalMode("edit");
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEntidad(e);
                                  setModalMode("delete");
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm
                          ? "No se encontraron entidades"
                          : "No hay entidades registradas"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Modal dinámico --- */}
      <Dialog open={!!modalMode} onOpenChange={() => setModalMode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            {modalMode === "create" && (
              <>
                <DialogTitle>Nueva Entidad</DialogTitle>
                <DialogDescription>
                  Complete los datos de la entidad
                </DialogDescription>
              </>
            )}
            {modalMode === "edit" && (
              <>
                <DialogTitle>Editar Entidad</DialogTitle>
                <DialogDescription>
                  Modifique los datos de la entidad seleccionada
                </DialogDescription>
              </>
            )}
            {modalMode === "view" && (
              <>
                <DialogTitle>Detalles de Entidad</DialogTitle>
                <DialogDescription>Información registrada</DialogDescription>
              </>
            )}
            {modalMode === "delete" && (
              <>
                <DialogTitle>Eliminar Entidad</DialogTitle>
                <DialogDescription>
                  ¿Está seguro que desea eliminar a{" "}
                  <strong>{selectedEntidad?.nombre}</strong>?
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          <EntidadDialog
            mode={modalMode}
            entidad={selectedEntidad}
            onClose={() => setModalMode(null)}
            onCreate={(e) => {
              setData([...data, e]);
              setModalMode(null);
            }}
            onEdit={(e) => {
              setData(data.map((x) => (x.id === e.id ? e : x)));
              setModalMode(null);
            }}
            onDelete={(id) => {
              setData(data.filter((x) => x.id !== id));
              setModalMode(null);
            }}
          />

          {modalMode === "delete" && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModalMode(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteEntidad}>
                Eliminar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
