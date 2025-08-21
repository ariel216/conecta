export interface Evento {
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
  id_contacto: number;
  capacidad_maxima: number;
  duracion_maxima: number;
  hora_descanso_inicio: string;
  hora_descanso_fin: string;
}

export interface Contacto {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  cargo: string;
}

export interface Empresa {
  id: number;
  codigo: string;
  nombre: string;
  rubro: string;
  tipo: "comprador" | "vendedor";
  departamento: string;
  direccion: string;
  sitio_web: string;
  facebook_url: string;
}

// Datos fake de contactos
export const contactosFake: Contacto[] = [
  {
    id: 1,
    nombre: "María González",
    email: "maria.gonzalez@empresa.com",
    telefono: "+57 300 123 4567",
    cargo: "Coordinadora de Eventos",
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@camara.com",
    telefono: "+57 301 234 5678",
    cargo: "Director Comercial",
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    email: "ana.martinez@fundacion.org",
    telefono: "+57 302 345 6789",
    cargo: "Gerente de Proyectos",
  },
];

// Datos fake de eventos
export const eventosFake: Evento[] = [
  {
    id: 1,
    descripcion_evento: "Rueda de Negocios Tecnológica 2024",
    entidad_organizadora: "Cámara de Comercio",
    lugar: "Centro de Convenciones Ágora",
    departamento: "La Paz",
    direccion: "Calle 24 #38-47, Bogotá",
    sitio_web: "https://ccb.org.co",
    fecha_evento: "2024-03-15",
    hora_inicio: "08:00",
    hora_fin: "17:00",
    moneda: "BS",
    url_logo: "/camara-comercio-bogota-logo.png",
    id_contacto: 1,
    capacidad_maxima: 50,
    duracion_maxima: 20,
    hora_descanso_inicio: "12:00",
    hora_descanso_fin: "13:00",
  },
  {
    id: 2,
    descripcion_evento: "Encuentro Empresarial",
    entidad_organizadora: "Hotel Radisson",
    lugar: "Hotel Intercontinental",
    departamento: "Cochabamba",
    direccion: "Avenida Colombia #2-72, Cali",
    sitio_web: "https://propacifico.org",
    fecha_evento: "2025-09-25",
    hora_inicio: "09:00",
    hora_fin: "18:00",
    moneda: "BS",
    url_logo: "/propacifico-logo.png",
    id_contacto: 2,
    capacidad_maxima: 50,
    duracion_maxima: 20,
    hora_descanso_inicio: "12:00",
    hora_descanso_fin: "13:00",
  },
];

// Datos fake de empresas
export const empresasFake: Empresa[] = [
  {
    id: 1,
    codigo: "EMP001",
    nombre: "TechSolutions Colombia",
    rubro: "Tecnología",
    tipo: "vendedor",
    departamento: "Cundinamarca",
    direccion: "Carrera 15 #93-47, Bogotá",
    sitio_web: "https://techsolutions.co",
    facebook_url: "https://facebook.com/techsolutions",
  },
  {
    id: 2,
    codigo: "EMP002",
    nombre: "Distribuidora del Valle",
    rubro: "Distribución",
    tipo: "comprador",
    departamento: "Valle del Cauca",
    direccion: "Avenida 6N #23-45, Cali",
    sitio_web: "https://distvalle.com",
    facebook_url: "https://facebook.com/distvalle",
  },
  {
    id: 3,
    codigo: "EMP003",
    nombre: "Manufacturas del Norte",
    rubro: "Manufactura",
    tipo: "vendedor",
    departamento: "Antioquia",
    direccion: "Calle 50 #45-67, Medellín",
    sitio_web: "https://manufnorte.com",
    facebook_url: "",
  },
];

// Departamentos de Bolivia
export const departamentos = [
  "La Paz",
  "Oruro",
  "Potosí",
  "Chuquisaca",
  "Cochabamba",
  "Tarija",
  "Santa Cruz",
  "Pando",
  "Beni",
];

// Monedas disponibles
export const monedas = [
  { codigo: "BS", nombre: "Bolivianos" },
  { codigo: "USD", nombre: "Dólar Estadounidense" },
  { codigo: "EUR", nombre: "Euro" },
];

// Rubros disponibles
export const rubros = [
  "Tecnología",
  "Manufactura",
  "Distribución",
  "Servicios",
  "Comercio",
  "Construcción",
  "Alimentario",
  "Textil",
  "Automotriz",
  "Salud",
  "Educación",
  "Turismo",
  "Agricultura",
  "Minería",
  "Energía",
];

// Función para agregar un nuevo evento
export function agregarEvento(evento: Omit<Evento, "id">): Evento {
  const nuevoId = Math.max(...eventosFake.map((e) => e.id), 0) + 1;
  const nuevoEvento: Evento = {
    ...evento,
    id: nuevoId,
  };
  eventosFake.push(nuevoEvento);
  return nuevoEvento;
}

function generarCodigoEmpresa(): string {
  const ultimoId = Math.max(...empresasFake.map((e) => e.id), 0);
  return `EMP${String(ultimoId + 1).padStart(3, "0")}`;
}

export function agregarEmpresa(
  empresa: Omit<Empresa, "id" | "codigo">
): Empresa {
  const nuevoId = Math.max(...empresasFake.map((e) => e.id), 0) + 1;
  const nuevaEmpresa: Empresa = {
    ...empresa,
    id: nuevoId,
    codigo: generarCodigoEmpresa(),
  };
  empresasFake.push(nuevaEmpresa);
  return nuevaEmpresa;
}

export interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  unidad_medida: string;
  tiempo_entrega: number;
  id_empresa: number;
}

export const productosFake: Producto[] = [
  {
    id: 1,
    nombre: "Software de Gestión Empresarial",
    cantidad: 50,
    unidad_medida: "licencias",
    tiempo_entrega: 15,
    id_empresa: 1,
  },
  {
    id: 2,
    nombre: "Aplicación Móvil Personalizada",
    cantidad: 10,
    unidad_medida: "proyectos",
    tiempo_entrega: 45,
    id_empresa: 1,
  },
  {
    id: 3,
    nombre: "Productos Alimentarios",
    cantidad: 1000,
    unidad_medida: "unidades",
    tiempo_entrega: 7,
    id_empresa: 2,
  },
  {
    id: 4,
    nombre: "Equipos de Oficina",
    cantidad: 200,
    unidad_medida: "unidades",
    tiempo_entrega: 10,
    id_empresa: 2,
  },
  {
    id: 5,
    nombre: "Maquinaria Industrial",
    cantidad: 5,
    unidad_medida: "equipos",
    tiempo_entrega: 30,
    id_empresa: 3,
  },
  {
    id: 6,
    nombre: "Repuestos Especializados",
    cantidad: 500,
    unidad_medida: "piezas",
    tiempo_entrega: 20,
    id_empresa: 3,
  },
];

export const unidadesMedida = [
  "unidades",
  "kilogramos",
  "toneladas",
  "litros",
  "metros",
  "metros cuadrados",
  "metros cúbicos",
  "cajas",
  "paquetes",
  "licencias",
  "proyectos",
  "servicios",
  "horas",
  "días",
  "equipos",
  "piezas",
];

export function agregarProducto(producto: Omit<Producto, "id">): Producto {
  const nuevoId = Math.max(...productosFake.map((p) => p.id), 0) + 1;
  const nuevoProducto: Producto = {
    ...producto,
    id: nuevoId,
  };
  productosFake.push(nuevoProducto);
  return nuevoProducto;
}

export interface Asistencia {
  id: number;
  id_evento: number;
  id_empresa: number;
  estado: "confirmada" | "pendiente" | "cancelada";
  fecha_registro: string;
}

export interface Reunion {
  id: number;
  id_asistencia: number;
  id_empresa_requerida: number;
  estado: "PROGRAMADA" | "CANCELADA" | "CONCLUIDA";
  fecha_solicitud: string;
}

export const asistenciasFake: Asistencia[] = [
  {
    id: 1,
    id_evento: 1,
    id_empresa: 1,
    estado: "confirmada",
    fecha_registro: "2024-03-10",
  },
  {
    id: 2,
    id_evento: 1,
    id_empresa: 2,
    estado: "pendiente",
    fecha_registro: "2024-03-12",
  },
  {
    id: 3,
    id_evento: 2,
    id_empresa: 3,
    estado: "confirmada",
    fecha_registro: "2024-04-15",
  },
];

export const reunionesFake: Reunion[] = [
  {
    id: 1,
    id_asistencia: 1,
    id_empresa_requerida: 2,
    estado: "PROGRAMADA",
    fecha_solicitud: "2024-03-11",
  },
  {
    id: 2,
    id_asistencia: 1,
    id_empresa_requerida: 3,
    estado: "PROGRAMADA",
    fecha_solicitud: "2024-03-11",
  },
  {
    id: 3,
    id_asistencia: 2,
    id_empresa_requerida: 1,
    estado: "CANCELADA",
    fecha_solicitud: "2024-03-13",
  },
];

export function puedeRegistrarAsistencia(evento: Evento): boolean {
  const hoy = new Date();
  const fechaEvento = new Date(evento.fecha_evento);

  // Solo eventos futuros o del mismo día
  return (
    fechaEvento >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  );
}

export function puedeCancelarAsistencia(evento: Evento): boolean {
  const hoy = new Date();
  const fechaEvento = new Date(evento.fecha_evento);
  const unDiaAntes = new Date(fechaEvento);
  unDiaAntes.setDate(unDiaAntes.getDate() - 1);

  // Se puede cancelar hasta el día antes del evento
  return hoy <= unDiaAntes;
}

let nextId = asistenciasFake.length + 1;

export function agregarAsistencia(eventoId: number, empresaId: number) {
  const nuevaAsistencia: Asistencia = {
    id: nextId++,
    id_evento: eventoId,
    id_empresa: empresaId,
    estado: "pendiente",
    fecha_registro: new Date().toISOString(),
  };

  asistenciasFake.push(nuevaAsistencia);
  return nuevaAsistencia;
}

export function actualizarEstadoAsistencia(
  id: number,
  nuevoEstado: Asistencia["estado"]
): boolean {
  const asistencia = asistenciasFake.find((a) => a.id === id);
  if (asistencia) {
    asistencia.estado = nuevoEstado;
    return true;
  }
  return false;
}

export function agregarReunion(
  reunion: Omit<Reunion, "id" | "fecha_solicitud">
): Reunion {
  const nuevoId = Math.max(...reunionesFake.map((r) => r.id), 0) + 1;
  const nuevaReunion: Reunion = {
    ...reunion,
    id: nuevoId,
    fecha_solicitud: new Date().toISOString().split("T")[0],
  };
  reunionesFake.push(nuevaReunion);
  return nuevaReunion;
}

export function actualizarEstadoReunion(
  id: number,
  nuevoEstado: Reunion["estado"]
): boolean {
  const reunion = reunionesFake.find((r) => r.id === id);
  if (reunion) {
    reunion.estado = nuevoEstado;
    return true;
  }
  return false;
}

export function obtenerEmpresasDisponiblesParaReunion(
  idAsistencia: number
): Empresa[] {
  const asistencia = asistenciasFake.find((a) => a.id === idAsistencia);
  if (!asistencia) return [];

  // Obtener todas las empresas que asisten al mismo evento
  const empresasEnEvento = asistenciasFake
    .filter(
      (a) =>
        a.id_evento === asistencia.id_evento &&
        a.id !== idAsistencia &&
        a.estado === "confirmada"
    )
    .map((a) => a.id_empresa);

  return empresasFake.filter((e) => empresasEnEvento.includes(e.id));
}

export interface Negociado {
  id: number;
  id_reunion: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  fecha_negociacion: string;
}

export const negociadosFake: Negociado[] = [
  {
    id: 1,
    id_reunion: 1,
    descripcion: "Licencias de Software de Gestión Empresarial",
    cantidad: 25,
    precio_unitario: 150000,
    fecha_negociacion: "2024-03-11",
  },
  {
    id: 2,
    id_reunion: 1,
    descripcion: "Servicio de Implementación y Capacitación",
    cantidad: 1,
    precio_unitario: 2500000,
    fecha_negociacion: "2024-03-11",
  },
  {
    id: 3,
    id_reunion: 2,
    descripcion: "Maquinaria Industrial Especializada",
    cantidad: 2,
    precio_unitario: 45000000,
    fecha_negociacion: "2024-03-11",
  },
];

export function agregarNegociado(
  negociado: Omit<Negociado, "id" | "fecha_negociacion">
): Negociado {
  const nuevoId = Math.max(...negociadosFake.map((n) => n.id), 0) + 1;
  const nuevoNegociado: Negociado = {
    ...negociado,
    id: nuevoId,
    fecha_negociacion: new Date().toISOString().split("T")[0],
  };
  negociadosFake.push(nuevoNegociado);
  return nuevoNegociado;
}

export function obtenerReunionesDisponiblesParaNegociar(): Reunion[] {
  return reunionesFake.filter((r) => r.estado === "CONCLUIDA");
}

export function esEventoDisponibleParaAsistencia(evento: Evento): boolean {
  const hoy = new Date();
  const fechaEvento = new Date(evento.fecha_evento);

  // Solo eventos futuros o del mismo día
  return (
    fechaEvento >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  );
}

export function agregarAsistenciaEvento(
  idEvento: number,
  idEmpresa: number
): Asistencia {
  const nuevoId = Math.max(...asistenciasFake.map((a) => a.id), 0) + 1;
  const nuevaAsistencia: Asistencia = {
    id: nuevoId,
    id_evento: idEvento,
    id_empresa: idEmpresa,
    estado: "pendiente",
    fecha_registro: new Date().toISOString().split("T")[0],
  };
  asistenciasFake.push(nuevaAsistencia);
  return nuevaAsistencia;
}
