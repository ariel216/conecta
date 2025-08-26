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

export type Item = {
  id: number;
  nombre: string;
};

export type ModalMode = "create" | "edit" | "view" | "delete";

interface RubroModalProps {
  mode: ModalMode | null;
  item: Item | null;
  onClose: () => void;
  onCreate: (e: Item) => void;
  onEdit: (e: Item) => void;
  onDelete: (id: number) => void;
}

export function ItemDialog({
  mode,
  item,
  onClose,
  onCreate,
  onEdit,
  onDelete,
}: RubroModalProps) {
  // estados internos para el form
  const [nombre, setNombre] = useState(item?.nombre || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoItem: Item = {
      id: item?.id ?? Math.floor(Math.random() * 100000),
      nombre,
    };
    mode === "edit" ? onEdit(nuevoItem) : onCreate(nuevoItem);
  };

  return (
    <Dialog open={!!mode} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {mode === "create" && (
            <>
              <DialogTitle>Nuevo Rubro</DialogTitle>
              <DialogDescription>
                Complete los datos del rubro
              </DialogDescription>
            </>
          )}
          {mode === "edit" && (
            <>
              <DialogTitle>Editar Rubro</DialogTitle>
              <DialogDescription>
                Modifique los datos del rubro seleccionado
              </DialogDescription>
            </>
          )}
          {mode === "view" && (
            <>
              <DialogTitle>Detalles del Rubro</DialogTitle>
              <DialogDescription>Información registrada</DialogDescription>
            </>
          )}
          {mode === "delete" && (
            <>
              <DialogTitle>Eliminar Rubro</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar a{" "}
                <strong>{item?.nombre}</strong>?
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {mode === "create" || mode === "edit" ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Input
              placeholder="Nombre del rubro"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        ) : null}

        {mode === "view" && item && (
          <div className="space-y-2">
            <p>
              <strong>Nombre:</strong> {item.nombre}
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
                if (item) onDelete(item.id);
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
