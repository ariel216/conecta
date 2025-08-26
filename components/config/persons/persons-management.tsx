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
  List,
  Grid,
  Filter,
  UserCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonaDialog } from "./persons-dialog";

type Persona = {
  id: number;
  nombre: string;
  celular: string;
  correo: string;
  tipo: "contacto" | "representante" | "participante";
};

type ViewMode = "table" | "cards";
type FilterType = "all" | "contacto" | "representante" | "participante";
type ModalMode = "create" | "edit" | "view" | "delete";

// --- Componente principal ---
export function PersonsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  // Estado interno con data local
  const [data, setData] = useState<Persona[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      celular: "70012345",
      correo: "juan@example.com",
      tipo: "representante",
    },
    {
      id: 2,
      nombre: "María Gómez",
      celular: "70154321",
      correo: "maria@example.com",
      tipo: "participante",
    },
  ]);

  const filteredPersonas = data.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.celular.includes(searchTerm);

    const matchesType = filterType === "all" || p.tipo === filterType;

    return matchesSearch && matchesType;
  });

  const handleDeletePersona = () => {
    if (selectedPersona) {
      setData(data.filter((p) => p.id !== selectedPersona.id));
      setModalMode(null);
      setSelectedPersona(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Nombre", "Celular", "Correo", "Tipo"];
    const csvContent = [
      headers.join(","),
      ...filteredPersonas.map((p) =>
        [p.id, `"${p.nombre}"`, p.celular, p.correo, p.tipo].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `personas_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
  };

  // --- Vista Cards ---
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPersonas.map((p) => (
        <Card key={p.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{p.nombre}</CardTitle>
            <CardDescription>{p.tipo}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">{p.correo}</div>
            <div className="text-sm">{p.celular}</div>
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
                      setSelectedPersona(p);
                      setModalMode("view");
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPersona(p);
                      setModalMode("edit");
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPersona(p);
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
                <UserCheck className="h-5 w-5" />
                Gestión de Personas
              </CardTitle>
              <CardDescription>
                Administre todos los contactos registrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredPersonas.length} de {data.length} personas
              </Badge>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedPersona(null);
                  setModalMode("create");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Persona
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
                placeholder="Buscar personas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterType}
              onValueChange={(value: FilterType) => setFilterType(value)}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="contacto">Contactos</SelectItem>
                <SelectItem value="representante">Representantes</SelectItem>
                <SelectItem value="participante">Participantes</SelectItem>
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersonas.length > 0 ? (
                    filteredPersonas.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          {p.nombre}
                        </TableCell>
                        <TableCell>{p.celular}</TableCell>
                        <TableCell>{p.correo}</TableCell>
                        <TableCell>
                          <Badge>{p.tipo}</Badge>
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
                                  setSelectedPersona(p);
                                  setModalMode("view");
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" /> Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPersona(p);
                                  setModalMode("edit");
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPersona(p);
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
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm || filterType !== "all"
                          ? "No se encontraron personas"
                          : "No hay personas registradas"}
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
                <DialogTitle>Nueva Persona</DialogTitle>
                <DialogDescription>
                  Complete los datos de la persona
                </DialogDescription>
              </>
            )}
            {modalMode === "edit" && (
              <>
                <DialogTitle>Editar Persona</DialogTitle>
                <DialogDescription>
                  Modifique los datos de la persona seleccionada
                </DialogDescription>
              </>
            )}
            {modalMode === "view" && (
              <>
                <DialogTitle>Detalles de Persona</DialogTitle>
                <DialogDescription>Información registrada</DialogDescription>
              </>
            )}
            {modalMode === "delete" && (
              <>
                <DialogTitle>Eliminar Persona</DialogTitle>
                <DialogDescription>
                  ¿Está seguro que desea eliminar a{" "}
                  <strong>{selectedPersona?.nombre}</strong>?
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          <PersonaDialog
            mode={modalMode}
            persona={selectedPersona}
            onClose={() => setModalMode(null)}
            onCreate={(p) => {
              setData([...data, p]);
              setModalMode(null);
            }}
            onEdit={(p) => {
              setData(data.map((x) => (x.id === p.id ? p : x)));
              setModalMode(null);
            }}
            onDelete={(id) => {
              setData(data.filter((x) => x.id !== id));
              setModalMode(null);
            }}
          />

          {modalMode === "view" && selectedPersona && (
            <div className="space-y-2">
              <p>
                <strong>Nombre:</strong> {selectedPersona.nombre}
              </p>
              <p>
                <strong>Celular:</strong> {selectedPersona.celular}
              </p>
              <p>
                <strong>Correo:</strong> {selectedPersona.correo}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedPersona.tipo}
              </p>
            </div>
          )}

          {modalMode === "delete" && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModalMode(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeletePersona}>
                Eliminar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
