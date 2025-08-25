"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, UserCheck } from "lucide-react";
import {
  eventosFake,
  asistenciasFake,
  esEventoDisponibleParaAsistencia,
} from "@/lib/data";
import Link from "next/link";
import { encodeId } from "@/lib/hash";

export default function AttendancePage() {
  const eventosDisponibles = eventosFake.filter((evento) =>
    esEventoDisponibleParaAsistencia(evento)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Reuniones en Eventos Disponibles
            </CardTitle>
            <CardDescription>
              Selecciona un evento para ver y gestionar sus reuniones
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventosDisponibles.map((evento) => {
              const asistenciasCount = asistenciasFake.filter(
                (a) => a.id_evento === evento.id
              ).length;
              const confirmadas = asistenciasFake.filter(
                (a) => a.id_evento === evento.id && a.estado === "confirmada"
              ).length;

              return (
                <Link key={evento.id} href={`/meetings/${encodeId(evento.id)}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {evento.descripcion_evento}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {evento.lugar}
                          </p>
                          <div className="flex flex-col items-start gap-2 text-xs">
                            <span className="text-gray-600 dark:text-gray-300">
                              {new Date(evento.fecha_evento).toLocaleDateString(
                                "es-BO"
                              )}
                            </span>
                            <div className="flex gap-2">
                              <span className="px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                                {asistenciasCount} asistencias
                              </span>
                              <span className="px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                                {confirmadas} confirmadas
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
