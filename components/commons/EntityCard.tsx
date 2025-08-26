import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function EntityCard({ entidad }: { entidad: any }) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4">
        <img
          src={entidad.url_logo || "/placeholder-logo.png"}
          alt={`Logo de ${entidad.nombre}`}
          className="h-24 w-24 object-contain rounded-lg border bg-white shadow-sm"
        />
        <CardTitle className="mt-3 text-xl font-bold text-center">
          {entidad.nombre}
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {entidad.sigla}
        </p>
      </CardHeader>
      <CardContent className="p-4 text-center space-y-2">
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Entidad:</strong> {entidad.nombre}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Sigla:</strong> {entidad.sigla}
        </p>
        {entidad.url_logo && (
          <a
            href={entidad.url_logo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-600 dark:text-blue-300 hover:underline text-sm"
          >
            Ver logo en grande
          </a>
        )}
      </CardContent>
    </Card>
  );
}
