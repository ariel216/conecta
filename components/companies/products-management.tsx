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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Package,
  Grid,
  List,
} from "lucide-react";
import { ProductDialog } from "./product-dialog";
import { toast } from "sonner";

// --- Tipado ---
export type Producto = {
  id: number;
  nombre: string;
  cantidad: number;
  unidad_medida: string;
  tiempo_entrega: number;
  id_empresa: number;
  empresaNombre?: string;
};

type ViewMode = "table" | "cards";
type ModalMode = "create" | "edit" | "view" | "delete";

// --- Componente principal ---
export function ProductsManagement({ company }: { company: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

  const [data, setData] = useState<Producto[]>([]); // iniciar vacío

  const filteredProductos = data.filter((p) => {
    return (
      searchTerm === "" ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteProducto = () => {
    if (selectedProducto) {
      setData(data.filter((p) => p.id !== selectedProducto.id));
      setModalMode(null);
      setSelectedProducto(null);
      toast.success("Producto eliminado");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Nombre",
      "Cantidad",
      "Unidad",
      "TiempoEntrega",
      "ID Empresa",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredProductos.map((p) =>
        [
          p.id,
          `"${p.nombre}"`,
          p.cantidad,
          p.unidad_medida,
          p.tiempo_entrega,
          p.id_empresa,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `productos_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
  };

  // --- Vista Cards ---
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProductos.map((p) => (
        <Card key={p.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{p.nombre}</CardTitle>
            <CardDescription>
              {p.cantidad} {p.unidad_medida} - {p.tiempo_entrega} días
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedProducto(p);
                    setModalMode("view");
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" /> Ver
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedProducto(p);
                    setModalMode("edit");
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedProducto(p);
                    setModalMode("delete");
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestión de Productos
            </CardTitle>
            <CardDescription>
              Administre todos los productos registrados
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {filteredProductos.length} de {data.length}
            </Badge>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Exportar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedProducto(null);
                setModalMode("create");
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Crear Producto
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
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
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Tiempo Entrega</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductos.length > 0 ? (
                    filteredProductos.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          {p.nombre}
                        </TableCell>
                        <TableCell>{p.cantidad}</TableCell>
                        <TableCell>{p.unidad_medida}</TableCell>
                        <TableCell>{p.tiempo_entrega} días</TableCell>
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
                                  setSelectedProducto(p);
                                  setModalMode("view");
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" /> Ver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProducto(p);
                                  setModalMode("edit");
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProducto(p);
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
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm
                          ? "No se encontraron productos"
                          : "No hay productos registrados"}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            {modalMode === "create" && (
              <>
                <DialogTitle>Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Complete los datos del producto
                </DialogDescription>
              </>
            )}
            {modalMode === "edit" && (
              <>
                <DialogTitle>Editar Producto</DialogTitle>
                <DialogDescription>
                  Modifique los datos del producto
                </DialogDescription>
              </>
            )}
            {modalMode === "view" && (
              <>
                <DialogTitle>Detalles del Producto</DialogTitle>
                <DialogDescription>Información registrada</DialogDescription>
              </>
            )}
            {modalMode === "delete" && (
              <>
                <DialogTitle>Eliminar Producto</DialogTitle>
                <DialogDescription>
                  ¿Está seguro que desea eliminar{" "}
                  <strong>{selectedProducto?.nombre}</strong>?
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          {modalMode !== "delete" && (
            <ProductDialog
              onProductAdded={(p) => {
                if (modalMode === "create") {
                  const newId = data.length
                    ? Math.max(...data.map((x) => x.id)) + 1
                    : 1;
                  setData([...data, { ...p, id: newId }]);
                  //toast.success("Producto creado");
                } else if (modalMode === "edit" && selectedProducto) {
                  setData(
                    data.map((x) =>
                      x.id === selectedProducto.id ? { ...p, id: x.id } : x
                    )
                  );
                  //toast.success("Producto actualizado");
                }
                setModalMode(null);
              }}
            />
          )}

          {modalMode === "delete" && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModalMode(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteProducto}>
                Eliminar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
