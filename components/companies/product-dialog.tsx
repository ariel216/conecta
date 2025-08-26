"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { agregarProducto, unidadesMedida, type Producto } from "@/lib/data";
import { Package } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
  onProductAdded?: (producto: Producto) => void;
}

export function ProductDialog({ onProductAdded }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    cantidad: "",
    unidad_medida: "",
    tiempo_entrega: "",
    id_empresa: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.cantidad ||
      !formData.unidad_medida ||
      !formData.tiempo_entrega
    ) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    const cantidad = Number.parseInt(formData.cantidad);
    const tiempo_entrega = Number.parseInt(formData.tiempo_entrega);
    const id_empresa = Number.parseInt(formData.id_empresa);

    if (cantidad < 1) {
      toast.error("La cantidad debe ser mayor o igual a 1");
      return;
    }

    if (tiempo_entrega < 1) {
      toast.error("El tiempo de entrega debe ser mayor a 0 días");
      return;
    }

    const nuevoProducto = agregarProducto({
      nombre: formData.nombre,
      cantidad,
      unidad_medida: formData.unidad_medida,
      tiempo_entrega,
      id_empresa,
    });

    onProductAdded?.(nuevoProducto);

    // Limpiar formulario
    setFormData({
      nombre: "",
      cantidad: "",
      unidad_medida: "",
      tiempo_entrega: "",
      id_empresa: "",
    });
    toast.success("Producto registrado exitosamente");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Registrar Nuevo Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej: Software de Gestión"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad *</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) =>
                  setFormData({ ...formData, cantidad: e.target.value })
                }
                placeholder="Ej: 100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidad_medida">Unidad de Medida *</Label>
              <Select
                value={formData.unidad_medida}
                onValueChange={(value) =>
                  setFormData({ ...formData, unidad_medida: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesMedida.map((unidad) => (
                    <SelectItem key={unidad} value={unidad}>
                      {unidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="tiempo_entrega">Tiempo de Entrega (días) *</Label>
              <Input
                id="tiempo_entrega"
                type="number"
                min="1"
                value={formData.tiempo_entrega}
                onChange={(e) =>
                  setFormData({ ...formData, tiempo_entrega: e.target.value })
                }
                placeholder="Ej: 15"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Package className="mr-2 h-4 w-4" />
            Registrar Producto
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
