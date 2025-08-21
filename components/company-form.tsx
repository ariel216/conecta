"use client";

import type React from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  departamentos,
  rubros,
  agregarEmpresa,
  type Empresa,
} from "@/lib/data";
import {
  Building2,
  MapPin,
  Globe,
  Facebook,
  Tag,
  Users,
  UserRound,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface CompanyFormProps {
  onCompanyCreated?: (empresa: Empresa) => void;
}

export function CompanyForm({ onCompanyCreated }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    rubro: "",
    tipo: "" as "comprador" | "vendedor" | "",
    departamento: "",
    direccion: "",
    sitio_web: "",
    facebook_url: "",
    representante: "",
    celular: "",
    correo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nuevaEmpresa = agregarEmpresa({
        ...formData,
        tipo: formData.tipo as "comprador" | "vendedor",
      });

      onCompanyCreated?.(nuevaEmpresa);

      // Limpiar formulario
      setFormData({
        nombre: "",
        rubro: "",
        tipo: "",
        departamento: "",
        direccion: "",
        sitio_web: "",
        facebook_url: "",
        representante: "",
        celular: "",
        correo: "",
      });
      toast.success(
        `Empresa registrada exitosamente con código: ${nuevaEmpresa.codigo}`
      );
    } catch (error) {
      toast.error(`Error al registrar la empresa`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Building2 className="h-6 w-6" />
          Registro de Empresa
        </CardTitle>
        <CardDescription>
          Complete la información de la empresa para registrarla en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label
                htmlFor="nombre"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Nombre de la Empresa *
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: TechSolutions Colombia"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="rubro"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Rubro *
              </Label>
              <Select
                value={formData.rubro}
                onValueChange={(value) => handleInputChange("rubro", value)}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccione rubro" />
                </SelectTrigger>
                <SelectContent>
                  {rubros.map((rubro) => (
                    <SelectItem key={rubro} value={rubro}>
                      {rubro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="tipo"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Tipo de Empresa *
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange("tipo", value)}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprador">Comprador</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Representante */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label
                htmlFor="representante"
                className="text-sm font-medium flex items-center gap-2"
              >
                <UserRound className="h-4 w-4" />
                Representante Legal *
              </Label>
              <Input
                id="representante"
                placeholder="Ej: Juan Pérez"
                value={formData.representante}
                onChange={(e) =>
                  handleInputChange("representante", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="celular"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Celular *
              </Label>
              <Input
                id="celular"
                type="tel"
                placeholder="Ej: 70012345"
                value={formData.celular}
                onChange={(e) => handleInputChange("celular", e.target.value)}
                required
                className="mt-1"
                pattern="^[0-9]{8}$"
                title="El celular debe tener exactamente 8 dígitos numéricos"
              />
            </div>

            <div>
              <Label
                htmlFor="correo"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Correo del Representante *
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej: juan.perez@email.com"
                value={formData.correo}
                onChange={(e) => handleInputChange("correo", e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="departamento"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Departamento *
              </Label>
              <Select
                value={formData.departamento}
                onValueChange={(value) =>
                  handleInputChange("departamento", value)
                }
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccione departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="direccion" className="text-sm font-medium">
                Dirección *
              </Label>
              <Input
                id="direccion"
                placeholder="Ej: Carrera 15 #93-47"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Información web */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="sitio_web"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Sitio Web
              </Label>
              <Input
                id="sitio_web"
                type="url"
                placeholder="https://ejemplo.com"
                value={formData.sitio_web}
                onChange={(e) => handleInputChange("sitio_web", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="facebook_url"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Label>
              <Input
                id="facebook_url"
                type="url"
                placeholder="https://facebook.com/empresa"
                value={formData.facebook_url}
                onChange={(e) =>
                  handleInputChange("facebook_url", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Registrando..." : "Registrar Empresa"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
