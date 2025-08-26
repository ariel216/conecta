"use client";

import { useParams, useRouter } from "next/navigation";
import { empresasFake } from "@/lib/data";
import { decodeId } from "@/lib/hash";
import { ProductsManagement } from "@/components/companies/products-management";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductsDetailPage() {
  const params = useParams();
  const router = useRouter();

  const companyHash = params.id as string;
  const companyId = decodeId(companyHash);

  if (!companyId) {
    return <p className="text-red-500">Empresa inválido</p>;
  }

  const company = empresasFake.find((e) => e.id === companyId);
  if (!company) return <p className="text-red-500">Empresa no encontrado</p>;

  return (
    <>
      <div className="p-4 bg-card rounded-2xl shadow-sm">
        <div className="flex md:hidden mb-3">
          <Button
            variant="outline"
            onClick={() => router.push("/companies")}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
        </div>

        <div className="relative flex items-center">
          <div className="hidden md:block absolute left-0">
            <Button
              variant="outline"
              onClick={() => router.push("/companies")}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
          </div>

          <div className="flex flex-col items-center mx-auto text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              {company.nombre}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
              Rubro: {company.rubro}
            </div>
          </div>
        </div>
      </div>
      <ProductsManagement company={company} />
    </>
  );
}
