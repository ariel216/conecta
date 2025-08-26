"use client";

import { EntitiesManagement } from "@/components/config/entities/entities-management";
import { ItemsManagement } from "@/components/config/items/items-management";
import { PersonsManagement } from "@/components/config/persons/persons-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  CalendarDays,
  LayoutList,
  Settings,
  UserCheck,
} from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [activeTab, setActiveTab] = useState("persons");
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
              <CardDescription>
                Administre la configuración del sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full justify-between">
              <TabsTrigger
                value="persons"
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                Personas
              </TabsTrigger>
              <TabsTrigger
                value="entities"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="h-4 w-4" />
                Entidades
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="flex items-center gap-2 cursor-pointer"
              >
                <LayoutList className="h-4 w-4" />
                Rubros
              </TabsTrigger>
            </TabsList>

            <TabsContent value="persons">
              <PersonsManagement />
            </TabsContent>

            <TabsContent value="entities">
              <EntitiesManagement />
            </TabsContent>

            <TabsContent value="items">
              <ItemsManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
