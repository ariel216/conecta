"use client";

import { CompaniesManagement } from "@/components/companies/companies-management";
import { Empresa, empresasFake } from "@/lib/data";
import { NextPage } from "next";
import { useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasFake);
  const handleCompanyCreated = (nuevaEmpresa: Empresa) => {
    setEmpresas((prev) => [...prev, nuevaEmpresa]);
  };

  const handleEditCompany = (empresa: Empresa) => {
    console.log("Editar empresa:", empresa);
    alert(`Funcionalidad de edición para: ${empresa.nombre}`);
  };

  const handleDeleteCompany = (empresaId: number) => {
    if (confirm("¿Está seguro de que desea eliminar esta empresa?")) {
      setEmpresas((prev) => prev.filter((empresa) => empresa.id !== empresaId));
      alert("Empresa eliminada exitosamente");
    }
  };
  return (
    <>
      <CompaniesManagement
        empresas={empresas}
        onEditCompany={handleEditCompany}
        onDeleteCompany={handleDeleteCompany}
        onCompanyCreated={handleCompanyCreated}
      />
    </>
  );
};

export default Page;
