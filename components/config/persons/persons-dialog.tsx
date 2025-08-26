"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Persona = {
  id: number;
  nombre: string;
  celular: string;
  correo: string;
  tipo: "contacto" | "representante" | "participante";
};

export type ModalMode = "create" | "edit" | "view" | "delete";

interface PersonaModalProps {
  mode: ModalMode | null;
  persona: Persona | null;
  onClose: () => void;
  onCreate: (p: Persona) => void;
  onEdit: (p: Persona) => void;
  onDelete: (id: number) => void;
}

export function PersonaDialog({
  mode,
  persona,
  onClose,
  onCreate,
  onEdit,
  onDelete,
}: PersonaModalProps) {
  // estados internos para el form
  const [nombre, setNombre] = useState(persona?.nombre || "");
  const [celular, setCelular] = useState(persona?.celular || "");
  const [correo, setCorreo] = useState(persona?.correo || "");
  const [tipo, setTipo] = useState<Persona["tipo"]>(
    persona?.tipo || "contacto"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaPersona: Persona = {
      id: persona?.id ?? Math.floor(Math.random() * 100000),
      nombre,
      celular,
      correo,
      tipo,
    };
    mode === "edit" ? onEdit(nuevaPersona) : onCreate(nuevaPersona);
  };

  return (
    <Dialog open={!!mode} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {mode === "create" && (
            <>
              <DialogTitle>Nueva Persona</DialogTitle>
              <DialogDescription>
                Complete los datos de la persona
              </DialogDescription>
            </>
          )}
          {mode === "edit" && (
            <>
              <DialogTitle>Editar Persona</DialogTitle>
              <DialogDescription>
                Modifique los datos de la persona seleccionada
              </DialogDescription>
            </>
          )}
          {mode === "view" && (
            <>
              <DialogTitle>Detalles de Persona</DialogTitle>
              <DialogDescription>Información registrada</DialogDescription>
            </>
          )}
          {mode === "delete" && (
            <>
              <DialogTitle>Eliminar Persona</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar a{" "}
                <strong>{persona?.nombre}</strong>?
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {mode === "create" || mode === "edit" ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Input
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              placeholder="Celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
            <Input
              placeholder="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <Select
              value={tipo}
              onValueChange={(val: Persona["tipo"]) => setTipo(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contacto">Contacto</SelectItem>
                <SelectItem value="representante">Representante</SelectItem>
                <SelectItem value="participante">Participante</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        ) : null}

        {mode === "view" && persona && (
          <div className="space-y-2">
            <p>
              <strong>Nombre:</strong> {persona.nombre}
            </p>
            <p>
              <strong>Celular:</strong> {persona.celular}
            </p>
            <p>
              <strong>Correo:</strong> {persona.correo}
            </p>
            <p>
              <strong>Tipo:</strong> {persona.tipo}
            </p>
          </div>
        )}

        {mode === "delete" && (
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (persona) onDelete(persona.id);
              }}
            >
              Eliminar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
