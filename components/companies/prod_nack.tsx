"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "@/components/companies/product-dialog";
import {
  productosFake,
  empresasFake,
  unidadesMedida,
  type Producto,
} from "@/lib/data";
import {
  Package,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Building2,
  Clock,
  Hash,
  Plus,
} from "lucide-react";

interface ProductsManagementProps {
  onProductAdded?: (producto: Producto) => void;
}

export function ProductsManagement({
  onProductAdded,
}: ProductsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmpresa, setFilterEmpresa] = useState("all");
  const [filterUnidad, setFilterUnidad] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredProducts = productosFake.filter((producto) => {
    const matchesSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesEmpresa =
      filterEmpresa === "all" ||
      producto.id_empresa.toString() === filterEmpresa;
    const matchesUnidad =
      filterUnidad === "all" || producto.unidad_medida === filterUnidad;

    return matchesSearch && matchesEmpresa && matchesUnidad;
  });

  const handleProductAdded = (producto: Producto) => {
    onProductAdded?.(producto);
    setShowCreateForm(false);
  };

  const getEmpresaInfo = (id_empresa: number) => {
    return empresasFake.find((empresa) => empresa.id === id_empresa);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Nombre",
      "Empresa",
      "Cantidad",
      "Unidad",
      "Tiempo Entrega (días)",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((producto) => {
        const empresa = getEmpresaInfo(producto.id_empresa);
        return [
          producto.id,
          `"${producto.nombre}"`,
          `"${empresa?.nombre || "N/A"}"`,
          producto.cantidad,
          `"${producto.unidad_medida}"`,
          producto.tiempo_entrega,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productos.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Productos</h2>
          <p className="text-muted-foreground">
            Administra los productos de las empresas registradas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Producto
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm onProductAdded={handleProductAdded} />
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="mt-4"
            >
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar producto</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre del producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por empresa</label>
              <Select value={filterEmpresa} onValueChange={setFilterEmpresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las empresas</SelectItem>
                  {empresasFake.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id.toString()}>
                      {empresa.codigo} - {empresa.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por unidad</label>
              <Select value={filterUnidad} onValueChange={setFilterUnidad}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las unidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las unidades</SelectItem>
                  {unidadesMedida.map((unidad) => (
                    <SelectItem key={unidad} value={unidad}>
                      {unidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{filteredProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Empresas con Productos
                </p>
                <p className="text-2xl font-bold">
                  {new Set(filteredProducts.map((p) => p.id_empresa)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Cantidad Total</p>
                <p className="text-2xl font-bold">
                  {filteredProducts
                    .reduce((sum, p) => sum + p.cantidad, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    filteredProducts.reduce(
                      (sum, p) => sum + p.tiempo_entrega,
                      0
                    ) / filteredProducts.length || 0
                  )}{" "}
                  días
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Tiempo Entrega</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((producto) => {
                  const empresa = getEmpresaInfo(producto.id_empresa);
                  return (
                    <TableRow key={producto.id}>
                      <TableCell className="font-mono">{producto.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{producto.nombre}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{empresa?.nombre}</div>
                            <div className="text-sm text-muted-foreground">
                              {empresa?.codigo} • {empresa?.tipo}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {producto.cantidad.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>{producto.unidad_medida}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {producto.tiempo_entrega} días
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
