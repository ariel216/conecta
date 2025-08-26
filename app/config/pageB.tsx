"use client";

import { EntitiesManagement } from "@/components/config/entities/entities-management";
import { ItemsManagement } from "@/components/config/items/items-management";
import { PersonsManagement } from "@/components/config/persons/persons-management";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Building2, CalendarDays, Settings } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [activeTab, setActiveTab] = useState("persons");

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-4"
                >
                  <TabsList className="flex w-full justify-between">
                    <TabsTrigger
                      value="persons"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Personas
                    </TabsTrigger>
                    <TabsTrigger
                      value="entities"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CalendarDays className="h-4 w-4" />
                      Entidades
                    </TabsTrigger>
                    <TabsTrigger
                      value="items"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="h-4 w-4" />
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
              </CardDescription>
            </div>
            <div className="flex items-center gap-2"></div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Page;
