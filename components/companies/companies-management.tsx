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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyForm } from "@/components/companies/company-form";
import { departamentos, rubros, type Empresa } from "@/lib/data";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Filter,
  Grid,
  List,
  Download,
  Globe,
  Facebook,
  Plus,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { encodeId } from "@/lib/hash";

interface CompaniesManagementProps {
  empresas: Empresa[];
  onEditCompany?: (empresa: Empresa) => void;
  onDeleteCompany?: (empresaId: number) => void;
  onCompanyCreated?: (empresa: Empresa) => void;
}

type ViewMode = "table" | "cards";
type FilterType = "all" | "comprador" | "vendedor";

export function CompaniesManagement({
  empresas,
  onEditCompany,
  onDeleteCompany,
  onCompanyCreated,
}: CompaniesManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterRubro, setFilterRubro] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredEmpresas = empresas.filter((empresa) => {
    const matchesSearch =
      searchTerm === "" ||
      empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.rubro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.departamento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || empresa.tipo === filterType;
    const matchesRubro = filterRubro === "all" || empresa.rubro === filterRubro;
    const matchesDepartment =
      filterDepartment === "all" || empresa.departamento === filterDepartment;

    return matchesSearch && matchesType && matchesRubro && matchesDepartment;
  });

  const handleCompanyCreated = (empresa: Empresa) => {
    onCompanyCreated?.(empresa);
    setShowCreateForm(false);
  };

  const router = useRouter();

  const handleProductsRoute = (id: number) => {
    router.push(`/companies/${encodeId(id)}`);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Código",
      "Nombre",
      "Rubro",
      "Tipo",
      "Departamento",
      "Dirección",
      "Sitio Web",
      "Facebook",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredEmpresas.map((empresa) =>
        [
          empresa.id,
          empresa.codigo,
          `"${empresa.nombre}"`,
          `"${empresa.rubro}"`,
          empresa.tipo,
          `"${empresa.departamento}"`,
          `"${empresa.direccion}"`,
          empresa.sitio_web,
          empresa.facebook_url,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `empresas_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEmpresas.map((empresa) => (
        <Card key={empresa.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">
                  {empresa.nombre}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Building2 className="h-4 w-4" />
                  {empresa.codigo}
                </CardDescription>
              </div>
              <Badge
                variant={empresa.tipo === "comprador" ? "default" : "secondary"}
                className="ml-2"
              >
                {empresa.tipo}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {empresa.departamento}
            </div>

            <Badge variant="outline">{empresa.rubro}</Badge>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                {empresa.sitio_web && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={empresa.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {empresa.facebook_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={empresa.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => console.log("Ver empresa", empresa.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditCompany?.(empresa)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteCompany?.(empresa.id)}
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
                Gestión de Empresas
              </CardTitle>
              <CardDescription>
                Administre todas las empresas registradas en el sistema
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredEmpresas.length} de {empresas.length} empresas
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
                Crear Empresa
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <CompanyForm onCompanyCreated={handleCompanyCreated} />
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
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterType}
              onValueChange={(value: FilterType) => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="comprador">Compradores</SelectItem>
                <SelectItem value="vendedor">Vendedores</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRubro} onValueChange={setFilterRubro}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rubro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los rubros</SelectItem>
                {rubros.map((rubro) => (
                  <SelectItem key={rubro} value={rubro}>
                    {rubro}
                  </SelectItem>
                ))}
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
                    <TableHead>Empresa</TableHead>
                    <TableHead>Rubro</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Enlaces</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmpresas.length > 0 ? (
                    filteredEmpresas.map((empresa) => (
                      <TableRow key={empresa.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{empresa.nombre}</div>
                            <div className="text-sm text-muted-foreground">
                              {empresa.codigo}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{empresa.rubro}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              empresa.tipo === "comprador"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {empresa.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm">
                                {empresa.departamento}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {empresa.direccion}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {empresa.sitio_web && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={empresa.sitio_web}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Globe className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {empresa.facebook_url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={empresa.facebook_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Facebook className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
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
                                onClick={() => handleProductsRoute(empresa.id)}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                Productos
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  console.log("Ver empresa", empresa.id)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onEditCompany?.(empresa)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDeleteCompany?.(empresa.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
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
                        {searchTerm ||
                        filterType !== "all" ||
                        filterRubro !== "all" ||
                        filterDepartment !== "all"
                          ? "No se encontraron empresas que coincidan con los filtros aplicados"
                          : "No hay empresas registradas"}
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
