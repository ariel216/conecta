"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { agregarNegociado, negociadosFake } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Handshake, Search } from "lucide-react";

export default function BusinessDialog() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [negotiatedForm, setNegotiatedForm] = useState({
    descripcion: "",
    cantidad: "",
    precio_unitario: "",
  });

  const getNegociadosForMeeting = (meetingId: number) => {
    return negociadosFake.filter((n) => n.id_reunion === meetingId);
  };
  const negociados = getNegociadosForMeeting(1);

  const handleCreateNegotiated = (e: React.FormEvent, meetingId: number) => {
    e.preventDefault();

    if (
      !negotiatedForm.descripcion ||
      !negotiatedForm.cantidad ||
      !negotiatedForm.precio_unitario
    ) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const cantidad = Number.parseInt(negotiatedForm.cantidad);
    const precio = Number.parseFloat(negotiatedForm.precio_unitario);

    if (cantidad < 1) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor o igual a 1.",
        variant: "destructive",
      });
      return;
    }

    if (precio <= 0) {
      toast({
        title: "Error",
        description: "El precio unitario debe ser mayor a 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      agregarNegociado({
        id_reunion: meetingId,
        descripcion: negotiatedForm.descripcion,
        cantidad,
        precio_unitario: precio,
      });

      toast({
        title: "Negociado registrado",
        description:
          "El producto/servicio negociado ha sido registrado exitosamente.",
      });

      setNegotiatedForm({ descripcion: "", cantidad: "", precio_unitario: "" });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el negociado.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="secondary" size="sm">
          <Search className="w-4 h-4" />
          Detalle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-3xl lg:max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2">
              <Handshake className="w-6 h-6" /> Intensiones de Negocio
            </div>
          </DialogTitle>
          <DialogDescription>Detalles de la reunión</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="border rounded-xl p-2 shadow-sm">
            <div className="space-y-4">
              {negociados.map((negociado) => (
                <div key={negociado.id} className="border rounded p-3">
                  <h4 className="font-medium">{negociado.descripcion}</h4>
                  <p className="text-sm text-muted-foreground">
                    Cantidad: {negociado.cantidad} | Precio: $
                    {negociado.precio_unitario.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium">
                    Total: $
                    {(
                      negociado.cantidad * negociado.precio_unitario
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded-xl p-2 shadow-sm">
            <form
              onSubmit={(e) => handleCreateNegotiated(e, 1)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Input
                  id="descripcion"
                  value={negotiatedForm.descripcion}
                  onChange={(e) =>
                    setNegotiatedForm((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
                    }))
                  }
                  placeholder="Descripción del producto/servicio"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad *</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={negotiatedForm.cantidad}
                    onChange={(e) =>
                      setNegotiatedForm((prev) => ({
                        ...prev,
                        cantidad: e.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio Unitario *</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={negotiatedForm.precio_unitario}
                    onChange={(e) =>
                      setNegotiatedForm((prev) => ({
                        ...prev,
                        precio_unitario: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit">Registrar</Button>
              </div>
            </form>
          </div>
        </div>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" className="w-sm">
            Cerrar
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
