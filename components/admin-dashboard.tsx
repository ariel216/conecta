"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  contactosFake,
  productosFake,
  asistenciasFake,
  reunionesFake,
  negociadosFake,
  type Evento,
  type Empresa,
} from "@/lib/data";
import {
  CalendarDays,
  Building2,
  Users,
  MapPin,
  TrendingUp,
  Package,
  UserCheck,
  Handshake,
  DollarSign,
} from "lucide-react";

interface AdminDashboardProps {
  eventos: Evento[];
  empresas: Empresa[];
}

export function AdminDashboard({ eventos, empresas }: AdminDashboardProps) {
  // Estadísticas calculadas
  const totalEventos = eventos.length;
  const eventosProximos = eventos.filter(
    (evento) => new Date(evento.fecha_evento) > new Date()
  ).length;
  const eventosPasados = totalEventos - eventosProximos;
  const departamentosUnicos = new Set(
    eventos.map((evento) => evento.departamento)
  ).size;

  const totalEmpresas = empresas.length;
  const empresasCompradoras = empresas.filter(
    (empresa) => empresa.tipo === "comprador"
  ).length;
  const empresasVendedoras = empresas.filter(
    (empresa) => empresa.tipo === "vendedor"
  ).length;

  const totalProductos = productosFake.length;
  const empresasConProductos = new Set(productosFake.map((p) => p.id_empresa))
    .size;
  const cantidadTotalProductos = productosFake.reduce(
    (sum, p) => sum + p.cantidad,
    0
  );
  const tiempoPromedioEntrega = Math.round(
    productosFake.reduce((sum, p) => sum + p.tiempo_entrega, 0) /
      productosFake.length || 0
  );

  const totalAsistencias = asistenciasFake.length;
  const asistenciasConfirmadas = asistenciasFake.filter(
    (a) => a.estado === "confirmada"
  ).length;
  const asistenciasPendientes = asistenciasFake.filter(
    (a) => a.estado === "pendiente"
  ).length;
  const asistenciasCanceladas = asistenciasFake.filter(
    (a) => a.estado === "cancelada"
  ).length;

  // Estadísticas de reuniones
  const totalReuniones = reunionesFake.length;
  const reunionesProgramadas = reunionesFake.filter(
    (r) => r.estado === "PROGRAMADA"
  ).length;
  const reunionesCanceladas = reunionesFake.filter(
    (r) => r.estado === "CANCELADA"
  ).length;
  const reunionesConcluidas = reunionesFake.filter(
    (r) => r.estado === "CONCLUIDA"
  ).length;

  // Estadísticas de negociados
  const totalNegociados = negociadosFake.length;
  const valorTotalNegociado = negociadosFake.reduce(
    (sum, n) => sum + n.cantidad * n.precio_unitario,
    0
  );
  const cantidadTotalNegociada = negociadosFake.reduce(
    (sum, n) => sum + n.cantidad,
    0
  );
  const valorPromedioNegociado =
    totalNegociados > 0 ? valorTotalNegociado / totalNegociados : 0;

  // Eventos próximos (los 3 más cercanos)
  const proximosEventos = eventos
    .filter((evento) => new Date(evento.fecha_evento) > new Date())
    .sort(
      (a, b) =>
        new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime()
    )
    .slice(0, 3);

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEventos}</div>
            <p className="text-xs text-muted-foreground">Eventos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmpresas}</div>
            <p className="text-xs text-muted-foreground">
              Empresas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Eventos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">
              {eventosProximos}
            </div>
            <p className="text-xs text-muted-foreground">Por realizarse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asistencias
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalAsistencias}
            </div>
            <p className="text-xs text-muted-foreground">
              Asistencias registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asistencias Confirmadas
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {asistenciasConfirmadas}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAsistencias > 0
                ? Math.round((asistenciasConfirmadas / totalAsistencias) * 100)
                : 0}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asistencias Pendientes
            </CardTitle>
            <UserCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {asistenciasPendientes}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAsistencias > 0
                ? Math.round((asistenciasPendientes / totalAsistencias) * 100)
                : 0}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asistencias Canceladas
            </CardTitle>
            <UserCheck className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {asistenciasCanceladas}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAsistencias > 0
                ? Math.round((asistenciasCanceladas / totalAsistencias) * 100)
                : 0}
              % del total
            </p>
          </CardContent>
        </Card>
      </div> */}

      {/* Sección de estadísticas de reuniones */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reuniones
            </CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalReuniones}
            </div>
            <p className="text-xs text-muted-foreground">
              Reuniones solicitadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reuniones Programadas
            </CardTitle>
            <Handshake className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reunionesProgramadas}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalReuniones > 0
                ? Math.round((reunionesProgramadas / totalReuniones) * 100)
                : 0}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reuniones Concluidas
            </CardTitle>
            <Handshake className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reunionesConcluidas}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalReuniones > 0
                ? Math.round((reunionesConcluidas / totalReuniones) * 100)
                : 0}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reuniones Canceladas
            </CardTitle>
            <Handshake className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reunionesCanceladas}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalReuniones > 0
                ? Math.round((reunionesCanceladas / totalReuniones) * 100)
                : 0}
              % del total
            </p>
          </CardContent>
        </Card>
      </div> */}

      {/* Sección de estadísticas de negociados */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Negociados
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {totalNegociados}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos/servicios negociados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatearPrecio(valorTotalNegociado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total negociado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cantidad Total
            </CardTitle>
            <Package className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {cantidadTotalNegociada.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Unidades negociadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatearPrecio(valorPromedioNegociado)}
            </div>
            <p className="text-xs text-muted-foreground">Por negociación</p>
          </CardContent>
        </Card>
      </div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalProductos}</div>
            <p className="text-xs text-muted-foreground">Productos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas con Productos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{empresasConProductos}</div>
            <p className="text-xs text-muted-foreground">
              {totalEmpresas > 0 ? Math.round((empresasConProductos / totalEmpresas) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cantidad Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{cantidadTotalProductos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Unidades disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{tiempoPromedioEntrega}</div>
            <p className="text-xs text-muted-foreground">Días de entrega</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Próximos eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Próximos Eventos
          </CardTitle>
          <CardDescription>
            Los eventos más cercanos en el calendario
          </CardDescription>
        </CardHeader>
        <CardContent>
          {proximosEventos.length > 0 ? (
            <div className="space-y-4">
              {proximosEventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{evento.descripcion_evento}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {evento.entidad_organizadora}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {evento.lugar}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {new Date(evento.fecha_evento).toLocaleDateString(
                        "es-BO"
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {evento.hora_inicio} - {evento.hora_fin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay eventos próximos programados
            </p>
          )}
        </CardContent>
      </Card>

      {/* Resumen de contactos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contactos Disponibles
          </CardTitle>
          <CardDescription>
            Personal asignado para la gestión de eventos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactosFake.map((contacto) => (
              <div key={contacto.id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{contacto.nombre}</h4>
                <p className="text-sm text-muted-foreground">
                  {contacto.cargo}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {contacto.email}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
