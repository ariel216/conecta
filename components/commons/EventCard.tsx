"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Coffee,
  Building,
} from "lucide-react";
import Image from "next/image";

interface EventoProps {
  evento: {
    id: number;
    descripcion_evento: string;
    entidad_organizadora: string;
    lugar: string;
    departamento: string;
    direccion: string;
    sitio_web: string;
    fecha_evento: string;
    hora_inicio: string;
    hora_fin: string;
    moneda: string;
    url_logo: string;
    capacidad_maxima: number;
    duracion_maxima: number;
    hora_descanso_inicio: string;
    hora_descanso_fin: string;
  };
}

export function EventoCard({ evento }: EventoProps) {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p- flex flex-col gap-4">
      {/* Logo y Nombre */}
      <div className="flex items-center gap-4">
        <Image
          src={evento.url_logo}
          alt={evento.entidad_organizadora}
          width={60}
          height={60}
          className="rounded-lg"
        />
        <div>
          <h2 className="text-xl font-bold">{evento.descripcion_evento}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Building className="w-4 h-4" /> {evento.entidad_organizadora}
          </p>
        </div>
      </div>

      {/* Fecha y Horario */}
      <div className="flex items-center gap-6 text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <span>{evento.fecha_evento}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-500" />
          <span>
            {evento.hora_inicio} - {evento.hora_fin}
          </span>
        </div>
      </div>

      {/* Lugar */}
      <div className="flex items-center gap-2 text-gray-700">
        <MapPin className="w-5 h-5 text-red-500" />
        <div>
          <p>{evento.lugar}</p>
          <p className="text-sm text-gray-500">
            {evento.direccion}, {evento.departamento}
          </p>
        </div>
      </div>

      {/* Sitio web */}
      <div className="flex items-center gap-2 text-gray-700">
        <Globe className="w-5 h-5 text-purple-500" />
        <a
          href={evento.sitio_web}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-purple-700"
        >
          Visitar sitio web
        </a>
      </div>

      {/* Capacidad y duración */}
      <div className="flex items-center gap-6 text-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-yellow-500" />
          <span>Máximo: {evento.capacidad_maxima} participantes</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          <span>Tiempo por Reunión: {evento.duracion_maxima} min.</span>
        </div>
      </div>

      {/* Descanso */}
      <div className="flex items-center gap-2 text-gray-700">
        <Coffee className="w-5 h-5 text-orange-500" />
        <span>
          Descanso: {evento.hora_descanso_inicio} - {evento.hora_descanso_fin}
        </span>
      </div>
    </div>
  );
}
