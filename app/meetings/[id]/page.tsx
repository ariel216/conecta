"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eventosFake } from "@/lib/data";
import { AttendanceManagement } from "@/components/meetings/attendance-management";
import { decodeId } from "@/lib/hash";
import MatchMeetings from "@/components/meetings/match-meetings";
import { useState } from "react";

export default function AttendanceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const eventHash = params.id as string;
  const eventId = decodeId(eventHash);

  if (!eventId) {
    return <p className="text-red-500">Evento inválido</p>;
  }

  const evento = eventosFake.find((e) => e.id === eventId);
  if (!evento) {
    return <p className="text-red-500">Evento no encontrado</p>;
  }

  const selectedEvent = eventosFake.find((e) => e.id === eventId);
  if (!selectedEvent)
    return <p className="text-red-500">Evento no encontrado</p>;

  const [confirmedCompanies, setConfirmedCompanies] = useState<any[]>([]);

  return (
    <div className="space-y-2">
      <div className="p-4 bg-card rounded-2xl shadow-sm">
        <div className="flex md:hidden mb-3">
          <Button
            variant="outline"
            onClick={() => router.push("/meetings")}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Reuniones
          </Button>
        </div>

        <div className="relative flex items-center">
          <div className="hidden md:block absolute left-0">
            <Button
              variant="outline"
              onClick={() => router.push("/meetings")}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Volver a Reuniones
            </Button>
          </div>

          <div className="flex flex-col items-center mx-auto text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              {selectedEvent.descripcion_evento}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <span>
                {selectedEvent.lugar} •{" "}
                {new Date(selectedEvent.fecha_evento).toLocaleDateString(
                  "es-BO",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="border rounded-xl p-2 shadow-sm">
          <AttendanceManagement
            eventId={eventId}
            onConfirmedChange={setConfirmedCompanies}
          />
        </div>
        <div className="border rounded-xl p-2 shadow-sm">
          <MatchMeetings
            event={evento}
            confirmedCompanies={confirmedCompanies}
          />
        </div>
      </div>
    </div>
  );
}
