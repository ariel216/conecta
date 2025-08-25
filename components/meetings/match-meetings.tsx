"use client";

import { Calendar, Clock, Grid, Shuffle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { Asistencia, Empresa, empresasFake, Evento } from "@/lib/data";
import BusinessDialog from "./business-dialog";

interface MatchMeetingsProps {
  event: Evento;
  confirmedCompanies: Asistencia[];
}

export default function MatchMeetings({
  event,
  confirmedCompanies,
}: MatchMeetingsProps) {
  const empresas = empresasFake;
  const [agenda, setAgenda] = useState<
    {
      empresa1: Empresa;
      empresa2: Empresa;
      start: string;
      end: string;
      mesa: number;
    }[]
  >([]);
  const [viewMode, setViewMode] = useState<"cronologica" | "mesas">(
    "cronologica"
  );

  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const generarAgenda = () => {
    if (confirmedCompanies.length < 2) return;

    // unir asistencia con empresa
    const empresasConfirmadas = confirmedCompanies
      .filter((a) => a.estado === "confirmada")
      .map((a) => empresas.find((e) => e.id === a.id_empresa)!)
      .filter(Boolean);

    if (empresasConfirmadas.length < 2) return;

    // combinaciones
    const combinations: [Empresa, Empresa][] = [];
    for (let i = 0; i < empresasConfirmadas.length; i++) {
      for (let j = i + 1; j < empresasConfirmadas.length; j++) {
        combinations.push([empresasConfirmadas[i], empresasConfirmadas[j]]);
      }
    }

    const startTime = parseTime(event.hora_inicio);
    const endTime = parseTime(event.hora_fin);
    const breakStart = parseTime(event.hora_descanso_inicio);
    const breakEnd = parseTime(event.hora_descanso_fin);
    const duration = event.duracion_maxima;
    const mesas = Array.from(
      { length: event.capacidad_maxima },
      (_, i) => i + 1
    );

    const nuevaAgenda: typeof agenda = [];
    let currentTime = startTime;

    while (currentTime + duration <= endTime && combinations.length > 0) {
      if (currentTime >= breakStart && currentTime < breakEnd) {
        currentTime = breakEnd;
        continue;
      }

      const empresasOcupadas = new Set<number>();
      const reunionesSlot: typeof agenda = [];

      for (
        let m = 0;
        m < event.capacidad_maxima && combinations.length > 0;
        m++
      ) {
        const idx = combinations.findIndex(
          ([e1, e2]) =>
            !empresasOcupadas.has(e1.id) && !empresasOcupadas.has(e2.id)
        );

        if (idx === -1) break;

        const [e1, e2] = combinations.splice(idx, 1)[0];

        empresasOcupadas.add(e1.id);
        empresasOcupadas.add(e2.id);

        reunionesSlot.push({
          empresa1: e1,
          empresa2: e2,
          start: formatTime(currentTime),
          end: formatTime(currentTime + duration),
          mesa: mesas[m],
        });
      }

      nuevaAgenda.push(...reunionesSlot);
      currentTime += duration;
    }

    setAgenda(nuevaAgenda);
  };

  // Colores para diferenciar las mesas
  const mesaColors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-red-100 text-red-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
  ];

  const getMesaColor = (mesa: number) =>
    mesaColors[(mesa - 1) % mesaColors.length];

  // Orden cronológico
  const agendaCronologica = [...agenda].sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  // Agrupado por mesa
  const agendaPorMesas = agenda.reduce(
    (acc: Record<number, typeof agenda>, item) => {
      if (!acc[item.mesa]) acc[item.mesa] = [];
      acc[item.mesa].push(item);
      acc[item.mesa].sort((a, b) => a.start.localeCompare(b.start));
      return acc;
    },
    {}
  );

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-300" />
              <h2 className="text-lg font-semibold">Agenda de Reuniones</h2>
            </div>

            {/* Toggle de vista */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "cronologica" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cronologica")}
                className="flex items-center gap-1"
              >
                <Clock className="w-4 h-4" />
                Cronológica
              </Button>
              <Button
                variant={viewMode === "mesas" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("mesas")}
                className="flex items-center gap-1"
              >
                <Grid className="w-4 h-4" />
                Por Mesas
              </Button>
            </div>
          </div>

          {/* Contenido */}
          {agenda.length === 0 ? (
            <>
              <h2 className="text-lg text-center font-semibold text-gray-900 dark:text-gray-400">
                No hay agenda generada
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-200 text-center">
                Genera la agenda automáticamente para crear reuniones entre los
                participantes confirmados.
              </p>
              <Button
                className="mt-4 flex items-center gap-2 cursor-pointer"
                onClick={generarAgenda}
                disabled={confirmedCompanies.length < 2}
              >
                <Shuffle />
                Generar Agenda Ahora
              </Button>
            </>
          ) : viewMode === "cronologica" ? (
            /* Vista cronológica */
            <div className="flex flex-col gap-3">
              {agendaCronologica.map((item, idx) => (
                <ReunionCard
                  key={idx}
                  item={item}
                  getMesaColor={getMesaColor}
                />
              ))}
            </div>
          ) : (
            /* Vista por mesas */
            <div className="flex flex-col gap-6">
              {Object.keys(agendaPorMesas).map((mesa) => (
                <div key={mesa} className="flex flex-col gap-2">
                  <h3
                    className={`text-sm font-semibold px-3 py-1 rounded-md inline-block w-fit ${getMesaColor(
                      parseInt(mesa)
                    )}`}
                  >
                    Mesa {mesa}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {agendaPorMesas[parseInt(mesa)].map((item, idx) => (
                      <ReunionCard
                        key={idx}
                        item={item}
                        getMesaColor={getMesaColor}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ReunionCard({
  item,
  getMesaColor,
}: {
  item: {
    empresa1: Empresa;
    empresa2: Empresa;
    start: string;
    end: string;
    mesa: number;
  };
  getMesaColor: (mesa: number) => string;
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition">
      {/* Horario y mesa */}
      <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-200 mb-3">
        <span
          className={`px-2 py-0.5 rounded-md font-semibold ${getMesaColor(
            item.mesa
          )}`}
        >
          Mesa {item.mesa}
        </span>
        <span className="font-medium">
          {item.start} - {item.end}
        </span>
      </div>

      {/* Empresas */}
      <div className="flex items-center gap-8">
        {/* Empresa 1 */}
        <div className="flex flex-col items-center text-center">
          <img
            src={item.empresa1.url_logo || "/propacifico-logo.png"}
            alt={item.empresa1.nombre}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <span className="text-sm font-semibold mt-2 text-gray-800 dark:text-gray-100">
            {item.empresa1.nombre}
          </span>
        </div>

        <span className="text-gray-500 dark:text-gray-300 text-xl font-bold">
          ↔
        </span>

        {/* Empresa 2 */}
        <div className="flex flex-col items-center text-center">
          <img
            src={item.empresa2.url_logo || "/logo.png"}
            alt={item.empresa2.nombre}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <span className="text-sm font-semibold mt-2 text-gray-800 dark:text-gray-100">
            {item.empresa2.nombre}
          </span>
        </div>
      </div>
      <div className="block">
        <BusinessDialog />
      </div>
    </div>
  );
}
