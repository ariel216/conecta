"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  agregarNegociado,
  obtenerReunionesDisponiblesParaNegociar,
  reunionesFake,
  asistenciasFake,
  empresasFake,
  eventosFake,
} from "@/lib/data"

export function NegotiatedForm() {
  const [formData, setFormData] = useState({
    id_reunion: "",
    descripcion: "",
    cantidad: "",
    precio_unitario: "",
  })

  const reunionesDisponibles = obtenerReunionesDisponiblesParaNegociar()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.id_reunion || !formData.descripcion || !formData.cantidad || !formData.precio_unitario) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      })
      return
    }

    const cantidad = Number.parseInt(formData.cantidad)
    const precio = Number.parseFloat(formData.precio_unitario)

    if (cantidad < 1) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor o igual a 1",
        variant: "destructive",
      })
      return
    }

    if (precio <= 0) {
      toast({
        title: "Error",
        description: "El precio unitario debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    try {
      const nuevoNegociado = agregarNegociado({
        id_reunion: Number.parseInt(formData.id_reunion),
        descripcion: formData.descripcion,
        cantidad,
        precio_unitario: precio,
      })

      toast({
        title: "Éxito",
        description: "Negociado registrado correctamente",
      })

      // Limpiar formulario
      setFormData({
        id_reunion: "",
        descripcion: "",
        cantidad: "",
        precio_unitario: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al registrar el negociado",
        variant: "destructive",
      })
    }
  }

  const obtenerInfoReunion = (idReunion: number) => {
    const reunion = reunionesFake.find((r) => r.id === idReunion)
    if (!reunion) return ""

    const asistencia = asistenciasFake.find((a) => a.id === reunion.id_asistencia)
    if (!asistencia) return ""

    const empresaSolicitante = empresasFake.find((e) => e.id === asistencia.id_empresa)
    const empresaRequerida = empresasFake.find((e) => e.id === reunion.id_empresa_requerida)
    const evento = eventosFake.find((ev) => ev.id === asistencia.id_evento)

    return `${empresaSolicitante?.nombre} ↔ ${empresaRequerida?.nombre} (${evento?.descripcion_evento})`
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Negociado</CardTitle>
        <CardDescription>Registre los productos o servicios negociados en reuniones concluidas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reunion">Reunión</Label>
            <Select
              value={formData.id_reunion}
              onValueChange={(value) => setFormData({ ...formData, id_reunion: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una reunión concluida" />
              </SelectTrigger>
              <SelectContent>
                {reunionesDisponibles.map((reunion) => (
                  <SelectItem key={reunion.id} value={reunion.id.toString()}>
                    {obtenerInfoReunion(reunion.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del Producto/Servicio</Label>
            <Textarea
              id="descripcion"
              placeholder="Describa el producto o servicio negociado"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                placeholder="Cantidad negociada"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio Unitario (COP)</Label>
              <Input
                id="precio"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Precio por unidad"
                value={formData.precio_unitario}
                onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Registrar Negociado
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
