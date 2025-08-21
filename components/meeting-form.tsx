"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  agregarReunion,
  asistenciasFake,
  obtenerEmpresasDisponiblesParaReunion,
  eventosFake,
  empresasFake,
} from "@/lib/data"

export function MeetingForm() {
  const [idAsistencia, setIdAsistencia] = useState("")
  const [idEmpresaRequerida, setIdEmpresaRequerida] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!idAsistencia || !idEmpresaRequerida) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    try {
      agregarReunion({
        id_asistencia: Number.parseInt(idAsistencia),
        id_empresa_requerida: Number.parseInt(idEmpresaRequerida),
        estado: "PROGRAMADA",
      })

      toast({
        title: "Reunión programada",
        description: "La solicitud de reunión ha sido registrada exitosamente.",
      })

      // Limpiar formulario
      setIdAsistencia("")
      setIdEmpresaRequerida("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al programar la reunión.",
        variant: "destructive",
      })
    }
  }

  const asistenciasConfirmadas = asistenciasFake.filter((a) => a.estado === "confirmada")
  const empresasDisponibles = idAsistencia ? obtenerEmpresasDisponiblesParaReunion(Number.parseInt(idAsistencia)) : []

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Programar Nueva Reunión</CardTitle>
        <CardDescription>Seleccione una asistencia confirmada y la empresa con la que desea reunirse</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="asistencia">Asistencia Confirmada *</Label>
              <Select value={idAsistencia} onValueChange={setIdAsistencia}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asistencia confirmada" />
                </SelectTrigger>
                <SelectContent>
                  {asistenciasConfirmadas.length === 0 ? (
                    <SelectItem value="" disabled>
                      No hay asistencias confirmadas
                    </SelectItem>
                  ) : (
                    asistenciasConfirmadas.map((asistencia) => {
                      const evento = eventosFake.find((e) => e.id === asistencia.id_evento)
                      const empresa = empresasFake.find((e) => e.id === asistencia.id_empresa)
                      return (
                        <SelectItem key={asistencia.id} value={asistencia.id.toString()}>
                          {empresa?.nombre} - {evento?.descripcion_evento}
                        </SelectItem>
                      )
                    })
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa-requerida">Empresa para reunión *</Label>
              <Select value={idEmpresaRequerida} onValueChange={setIdEmpresaRequerida} disabled={!idAsistencia}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresasDisponibles.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id.toString()}>
                      {empresa.nombre} ({empresa.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={asistenciasConfirmadas.length === 0}>
            Programar Reunión
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
