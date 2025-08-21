"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Search, Download, Plus, Eye } from "lucide-react"
import {
  reunionesFake,
  asistenciasFake,
  empresasFake,
  eventosFake,
  actualizarEstadoReunion,
  negociadosFake,
  agregarNegociado,
} from "@/lib/data"
import { MeetingForm } from "./meeting-form"

export function MeetingsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [negotiatedForm, setNegotiatedForm] = useState({
    descripcion: "",
    cantidad: "",
    precio_unitario: "",
  })

  const filteredMeetings = reunionesFake.filter((reunion) => {
    const asistencia = asistenciasFake.find((a) => a.id === reunion.id_asistencia)
    const empresaSolicitante = asistencia ? empresasFake.find((e) => e.id === asistencia.id_empresa) : null
    const empresaRequerida = empresasFake.find((e) => e.id === reunion.id_empresa_requerida)
    const evento = asistencia ? eventosFake.find((e) => e.id === asistencia.id_evento) : null

    const matchesSearch =
      empresaSolicitante?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresaRequerida?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento?.descripcion_evento.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || reunion.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (id: number, newStatus: "PROGRAMADA" | "CANCELADA" | "CONCLUIDA") => {
    if (actualizarEstadoReunion(id, newStatus)) {
      toast({
        title: "Estado actualizado",
        description: "El estado de la reunión ha sido actualizado exitosamente.",
      })
      setRefreshKey((prev) => prev + 1)
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la reunión.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNegotiated = (e: React.FormEvent, meetingId: number) => {
    e.preventDefault()

    if (!negotiatedForm.descripcion || !negotiatedForm.cantidad || !negotiatedForm.precio_unitario) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    const cantidad = Number.parseInt(negotiatedForm.cantidad)
    const precio = Number.parseFloat(negotiatedForm.precio_unitario)

    if (cantidad < 1) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor o igual a 1.",
        variant: "destructive",
      })
      return
    }

    if (precio <= 0) {
      toast({
        title: "Error",
        description: "El precio unitario debe ser mayor a 0.",
        variant: "destructive",
      })
      return
    }

    try {
      agregarNegociado({
        id_reunion: meetingId,
        descripcion: negotiatedForm.descripcion,
        cantidad,
        precio_unitario: precio,
      })

      toast({
        title: "Negociado registrado",
        description: "El producto/servicio negociado ha sido registrado exitosamente.",
      })

      setNegotiatedForm({ descripcion: "", cantidad: "", precio_unitario: "" })
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el negociado.",
        variant: "destructive",
      })
    }
  }

  const getNegociadosForMeeting = (meetingId: number) => {
    return negociadosFake.filter((n) => n.id_reunion === meetingId)
  }

  const exportToCSV = () => {
    const headers = ["ID", "Empresa Solicitante", "Empresa Requerida", "Evento", "Estado", "Fecha Solicitud"]
    const csvData = filteredMeetings.map((reunion) => {
      const asistencia = asistenciasFake.find((a) => a.id === reunion.id_asistencia)
      const empresaSolicitante = asistencia ? empresasFake.find((e) => e.id === asistencia.id_empresa) : null
      const empresaRequerida = empresasFake.find((e) => e.id === reunion.id_empresa_requerida)
      const evento = asistencia ? eventosFake.find((e) => e.id === asistencia.id_evento) : null

      return [
        reunion.id,
        empresaSolicitante?.nombre || "N/A",
        empresaRequerida?.nombre || "N/A",
        evento?.descripcion_evento || "N/A",
        reunion.estado,
        reunion.fecha_solicitud,
      ]
    })

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "reuniones.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROGRAMADA":
        return <Badge variant="default">Programada</Badge>
      case "CANCELADA":
        return <Badge variant="destructive">Cancelada</Badge>
      case "CONCLUIDA":
        return <Badge variant="secondary">Concluida</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6" key={refreshKey}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Gestión de Reuniones</CardTitle>
              <CardDescription>Administre las solicitudes de reuniones entre empresas</CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <MeetingForm />
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="mt-4">
                Cancelar
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Buscar reuniones</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por empresa o evento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Filtrar por estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="PROGRAMADA">Programada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Empresa Solicitante</TableHead>
                  <TableHead>Empresa Requerida</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Negociados</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map((reunion) => {
                  const asistencia = asistenciasFake.find((a) => a.id === reunion.id_asistencia)
                  const empresaSolicitante = asistencia
                    ? empresasFake.find((e) => e.id === asistencia.id_empresa)
                    : null
                  const empresaRequerida = empresasFake.find((e) => e.id === reunion.id_empresa_requerida)
                  const evento = asistencia ? eventosFake.find((e) => e.id === asistencia.id_evento) : null
                  const negociados = getNegociadosForMeeting(reunion.id)

                  return (
                    <TableRow key={reunion.id}>
                      <TableCell className="font-medium">{reunion.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{empresaSolicitante?.nombre || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{empresaSolicitante?.rubro}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{empresaRequerida?.nombre || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">
                            {empresaRequerida?.tipo} - {empresaRequerida?.rubro}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48">
                          <div className="font-medium truncate">{evento?.descripcion_evento || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{evento?.fecha_evento}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reunion.estado)}</TableCell>
                      <TableCell>{reunion.fecha_solicitud}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {negociados.length} negociado{negociados.length !== 1 ? "s" : ""}
                          </Badge>
                          {negociados.length > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Negociados de la Reunión</DialogTitle>
                                  <DialogDescription>
                                    Productos y servicios negociados en esta reunión
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {negociados.map((negociado) => (
                                    <div key={negociado.id} className="border rounded p-3">
                                      <h4 className="font-medium">{negociado.descripcion}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Cantidad: {negociado.cantidad} | Precio: $
                                        {negociado.precio_unitario.toLocaleString()}
                                      </p>
                                      <p className="text-sm font-medium">
                                        Total: ${(negociado.cantidad * negociado.precio_unitario).toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={reunion.estado}
                            onValueChange={(value) => handleStatusChange(reunion.id, value as any)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PROGRAMADA">Programada</SelectItem>
                              <SelectItem value="CANCELADA">Cancelada</SelectItem>
                              <SelectItem value="CONCLUIDA">Concluida</SelectItem>
                            </SelectContent>
                          </Select>
                          {reunion.estado === "CONCLUIDA" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Agregar Negociado</DialogTitle>
                                  <DialogDescription>
                                    Registre un producto o servicio negociado en esta reunión
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={(e) => handleCreateNegotiated(e, reunion.id)} className="space-y-4">
                                  <div>
                                    <Label htmlFor="descripcion">Descripción *</Label>
                                    <Input
                                      id="descripcion"
                                      value={negotiatedForm.descripcion}
                                      onChange={(e) =>
                                        setNegotiatedForm((prev) => ({ ...prev, descripcion: e.target.value }))
                                      }
                                      placeholder="Descripción del producto/servicio"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="cantidad">Cantidad *</Label>
                                      <Input
                                        id="cantidad"
                                        type="number"
                                        min="1"
                                        value={negotiatedForm.cantidad}
                                        onChange={(e) =>
                                          setNegotiatedForm((prev) => ({ ...prev, cantidad: e.target.value }))
                                        }
                                        placeholder="1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="precio">Precio Unitario *</Label>
                                      <Input
                                        id="precio"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={negotiatedForm.precio_unitario}
                                        onChange={(e) =>
                                          setNegotiatedForm((prev) => ({ ...prev, precio_unitario: e.target.value }))
                                        }
                                        placeholder="0.00"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <DialogTrigger asChild>
                                      <Button variant="outline" type="button">
                                        Cancelar
                                      </Button>
                                    </DialogTrigger>
                                    <Button type="submit">Registrar Negociado</Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredMeetings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron reuniones que coincidan con los criterios de búsqueda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
