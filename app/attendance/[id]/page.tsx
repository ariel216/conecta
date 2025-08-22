"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eventosFake } from "@/lib/data";
import { AttendanceManagement } from "@/components/attendance-management";
import { decodeId } from "@/lib/hash";

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

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => router.push("/attendance")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Eventos
      </Button>

      <AttendanceManagement eventId={eventId} />
    </div>
  );
}
