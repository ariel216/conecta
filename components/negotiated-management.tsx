"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye } from "lucide-react"
import { negociadosFake, reunionesFake, asistenciasFake, empresasFake, eventosFake } from "@/lib/data"

export function NegotiatedManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterReunion, setFilterReunion] = useState("all")

  const filteredNegociados = negociadosFake.filter((negociado) => {
    const matchesSearch = negociado.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesReunion = filterReunion === "all" || negociado.id_reunion.toString() === filterReunion

    return matchesSearch && matchesReunion
  })

  const obtenerInfoReunion = (idReunion: number) => {
    const reunion = reunionesFake.find((r) => r.id === idReunion)
    if (!reunion) return { empresas: "N/A", evento: "N/A" }

    const asistencia = asistenciasFake.find((a) => a.id === reunion.id_asistencia)
    if (!asistencia) return { empresas: "N/A", evento: "N/A" }

    const empresaSolicitante = empresasFake.find((e) => e.id === asistencia.id_empresa)
    const empresaRequerida = empresasFake.find((e) => e.id === reunion.id_empresa_requerida)
    const evento = eventosFake.find((ev) => ev.id === asistencia.id_evento)

    return {
      empresas: `${empresaSolicitante?.nombre} ↔ ${empresaRequerida?.nombre}`,
      evento: evento?.descripcion_evento || "N/A",
    }
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const calcularTotal = (cantidad: number, precioUnitario: number) => {
    return formatearPrecio(cantidad * precioUnitario)
  }

  const exportarCSV = () => {
    const headers = ["ID", "Descripción", "Empresas", "Evento", "Cantidad", "Precio Unitario", "Total", "Fecha"]
    const rows = filteredNegociados.map((negociado) => {
      const info = obtenerInfoReunion(negociado.id_reunion)
      return [
        negociado.id,
        negociado.descripcion,
        info.empresas,
        info.evento,
        negociado.cantidad,
        negociado.precio_unitario,
        negociado.cantidad * negociado.precio_unitario,
        negociado.fecha_negociacion,
      ]
    })

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "negociados.csv"
    a.click()
  }

  const reunionesUnicas = Array.from(new Set(negociadosFake.map((n) => n.id_reunion)))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Negociados</CardTitle>
          <CardDescription>Administre los productos y servicios negociados en las reuniones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterReunion} onValueChange={setFilterReunion}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por reunión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las reuniones</SelectItem>
                {reunionesUnicas.map((idReunion) => {
                  const info = obtenerInfoReunion(idReunion)
                  return (
                    <SelectItem key={idReunion} value={idReunion.toString()}>
                      {info.empresas}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Button onClick={exportarCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Empresas</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unit.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNegociados.map((negociado) => {
                  const info = obtenerInfoReunion(negociado.id_reunion)
                  return (
                    <TableRow key={negociado.id}>
                      <TableCell className="font-medium">{negociado.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={negociado.descripcion}>
                          {negociado.descripcion}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{info.empresas}</TableCell>
                      <TableCell className="text-sm">{info.evento}</TableCell>
                      <TableCell>{negociado.cantidad.toLocaleString()}</TableCell>
                      <TableCell>{formatearPrecio(negociado.precio_unitario)}</TableCell>
                      <TableCell className="font-semibold">
                        {calcularTotal(negociado.cantidad, negociado.precio_unitario)}
                      </TableCell>
                      <TableCell>{negociado.fecha_negociacion}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredNegociados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron negociados que coincidan con los filtros
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
