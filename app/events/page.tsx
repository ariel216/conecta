"use client";

import { EventsManagement } from "@/components/events/events-management";
import { Evento, eventosFake } from "@/lib/data";
import { NextPage } from "next";
import { useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [eventos, setEventos] = useState<Evento[]>(eventosFake);

  const handleEventCreated = (nuevoEvento: Evento) => {
    setEventos((prev) => [...prev, nuevoEvento]);
  };

  const handleEditEvent = (evento: Evento) => {
    console.log("Editar evento:", evento);
    alert(`Funcionalidad de edición para: ${evento.descripcion_evento}`);
  };

  const handleDeleteEvent = (eventoId: number) => {
    if (confirm("¿Está seguro de que desea eliminar este evento?")) {
      setEventos((prev) => prev.filter((evento) => evento.id !== eventoId));
      alert("Evento eliminado exitosamente");
    }
  };

  return (
    <EventsManagement
      eventos={eventos}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      onEventCreated={handleEventCreated}
    />
  );
};

export default Page;
