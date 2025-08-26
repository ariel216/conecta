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
import EntityCard from "@/components/commons/EntityCard";

export type Entidad = {
  id: number;
  nombre: string;
  sigla: string;
  url_logo?: string;
};

export type ModalMode = "create" | "edit" | "view" | "delete";

interface EntidadModalProps {
  mode: ModalMode | null;
  entidad: Entidad | null;
  onClose: () => void;
  onCreate: (e: Entidad) => void;
  onEdit: (e: Entidad) => void;
  onDelete: (id: number) => void;
}

export function EntidadDialog({
  mode,
  entidad,
  onClose,
  onCreate,
  onEdit,
  onDelete,
}: EntidadModalProps) {
  // estados internos para el form
  const [nombre, setNombre] = useState(entidad?.nombre || "");
  const [sigla, setSigla] = useState(entidad?.sigla || "");
  const [urlLogo, setUrlLogo] = useState(entidad?.url_logo || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaEntidad: Entidad = {
      id: entidad?.id ?? Math.floor(Math.random() * 100000),
      nombre,
      sigla,
      url_logo: urlLogo,
    };
    mode === "edit" ? onEdit(nuevaEntidad) : onCreate(nuevaEntidad);
  };

  return (
    <Dialog open={!!mode} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {mode === "create" && (
            <>
              <DialogTitle>Nueva Entidad</DialogTitle>
              <DialogDescription>
                Complete los datos de la entidad
              </DialogDescription>
            </>
          )}
          {mode === "edit" && (
            <>
              <DialogTitle>Editar Entidad</DialogTitle>
              <DialogDescription>
                Modifique los datos de la entidad seleccionada
              </DialogDescription>
            </>
          )}
          {mode === "view" && (
            <>
              <DialogTitle>Detalles de Entidad</DialogTitle>
              <DialogDescription>Información registrada</DialogDescription>
            </>
          )}
          {mode === "delete" && (
            <>
              <DialogTitle>Eliminar Entidad</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar a{" "}
                <strong>{entidad?.nombre}</strong>?
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {mode === "create" || mode === "edit" ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Input
              placeholder="Nombre de la entidad"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              placeholder="Sigla"
              value={sigla}
              onChange={(e) => setSigla(e.target.value)}
              required
            />
            <Input
              placeholder="URL del logo (opcional)"
              value={urlLogo}
              onChange={(e) => setUrlLogo(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        ) : null}

        {mode === "view" && entidad && <EntityCard entidad={entidad} />}

        {mode === "delete" && (
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (entidad) onDelete(entidad.id);
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
