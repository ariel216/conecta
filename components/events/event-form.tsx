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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  contactosFake,
  departamentos,
  monedas,
  agregarEvento,
  type Evento,
} from "@/lib/data";
import {
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  Globe,
  DollarSign,
  Users,
  Timer,
  Coffee,
} from "lucide-react";
import { toast } from "sonner";

interface EventFormProps {
  onEventCreated?: (evento: Evento) => void;
}

export function EventForm({ onEventCreated }: EventFormProps) {
  const [formData, setFormData] = useState({
    descripcion_evento: "",
    entidad_organizadora: "",
    lugar: "",
    departamento: "",
    direccion: "",
    sitio_web: "",
    fecha_evento: "",
    hora_inicio: "",
    hora_fin: "",
    moneda: "BS",
    url_logo: "",
    id_contacto: "",
    capacidad_maxima: "",
    duracion_maxima: "",
    hora_descanso_inicio: "",
    hora_descanso_fin: "",
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

      const nuevoEvento = agregarEvento({
        ...formData,
        id_contacto: Number.parseInt(formData.id_contacto),
        capacidad_maxima: Number.parseInt(formData.capacidad_maxima),
        duracion_maxima: Number.parseInt(formData.duracion_maxima),
      });

      onEventCreated?.(nuevoEvento);

      setFormData({
        descripcion_evento: "",
        entidad_organizadora: "",
        lugar: "",
        departamento: "",
        direccion: "",
        sitio_web: "",
        fecha_evento: "",
        hora_inicio: "",
        hora_fin: "",
        moneda: "BS",
        url_logo: "",
        id_contacto: "",
        capacidad_maxima: "",
        duracion_maxima: "",
        hora_descanso_inicio: "",
        hora_descanso_fin: "",
      });
      toast.success("Evento registrado exitosamente");
    } catch (error) {
      toast.error("Error al registrar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <CalendarDays className="h-6 w-6" />
          Registro de Evento - Rueda de Negocios
        </CardTitle>
        <CardDescription>
          Complete la información del evento para registrarlo en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica del evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label
                htmlFor="descripcion_evento"
                className="text-sm font-medium"
              >
                Descripción del Evento *
              </Label>
              <Textarea
                id="descripcion_evento"
                placeholder="Ej: Rueda de Negocios Tecnológica"
                value={formData.descripcion_evento}
                onChange={(e) =>
                  handleInputChange("descripcion_evento", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="entidad_organizadora"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Entidad Organizadora *
              </Label>
              <Input
                id="entidad_organizadora"
                placeholder="Ej: Cámara de Comercio"
                value={formData.entidad_organizadora}
                onChange={(e) =>
                  handleInputChange("entidad_organizadora", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>

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
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="lugar"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Lugar del Evento *
              </Label>
              <Input
                id="lugar"
                placeholder="Ej: Centro de Convenciones"
                value={formData.lugar}
                onChange={(e) => handleInputChange("lugar", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="departamento" className="text-sm font-medium">
                Departamento *
              </Label>
              <Select
                value={formData.departamento}
                onValueChange={(value) =>
                  handleInputChange("departamento", value)
                }
                required
              >
                <SelectTrigger className="mt-1 w-full">
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

            <div className="md:col-span-2">
              <Label htmlFor="direccion" className="text-sm font-medium">
                Dirección *
              </Label>
              <Input
                id="direccion"
                placeholder="Ej: Calle 24 #38-47"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label
                htmlFor="fecha_evento"
                className="text-sm font-medium flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                Fecha del Evento *
              </Label>
              <Input
                id="fecha_evento"
                type="date"
                value={formData.fecha_evento}
                onChange={(e) =>
                  handleInputChange("fecha_evento", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="hora_inicio"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Hora de Inicio *
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) =>
                  handleInputChange("hora_inicio", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="hora_fin"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Hora de Fin *
              </Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) => handleInputChange("hora_fin", e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Configuración adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="id_contacto" className="text-sm font-medium">
                Contacto Asignado *
              </Label>
              <Select
                value={formData.id_contacto}
                onValueChange={(value) =>
                  handleInputChange("id_contacto", value)
                }
                required
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Seleccione contacto" />
                </SelectTrigger>
                <SelectContent>
                  {contactosFake.map((contacto) => (
                    <SelectItem
                      key={contacto.id}
                      value={contacto.id.toString()}
                    >
                      {contacto.nombre} - {contacto.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url_logo" className="text-sm font-medium">
                URL del Logo
              </Label>
              <Input
                id="url_logo"
                type="url"
                placeholder="https://ejemplo.com/logo.png"
                value={formData.url_logo}
                onChange={(e) => handleInputChange("url_logo", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capacidad máxima */}
            <div>
              <Label
                htmlFor="capacidad_maxima"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Capacidad Máxima de Participantes *
              </Label>
              <Input
                id="capacidad_maxima"
                type="number"
                min="1"
                placeholder="Ej: 200"
                value={formData.capacidad_maxima}
                onChange={(e) =>
                  handleInputChange("capacidad_maxima", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>

            {/* Duración máxima */}
            <div>
              <Label
                htmlFor="duracion_maxima"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Timer className="h-4 w-4" />
                Duración Máxima de Reuniones (minutos) *
              </Label>
              <Input
                id="duracion_maxima"
                type="number"
                min="5"
                placeholder="Ej: 30"
                value={formData.duracion_maxima}
                onChange={(e) =>
                  handleInputChange("duracion_maxima", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Horario de descanso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="hora_descanso_inicio"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Coffee className="h-4 w-4" />
                Hora de Inicio del Descanso
              </Label>
              <Input
                id="hora_descanso_inicio"
                type="time"
                value={formData.hora_descanso_inicio}
                onChange={(e) =>
                  handleInputChange("hora_descanso_inicio", e.target.value)
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="hora_descanso_fin"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Coffee className="h-4 w-4" />
                Hora de Fin del Descanso
              </Label>
              <Input
                id="hora_descanso_fin"
                type="time"
                value={formData.hora_descanso_fin}
                onChange={(e) =>
                  handleInputChange("hora_descanso_fin", e.target.value)
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
              {isSubmitting ? "Registrando..." : "Registrar Evento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
