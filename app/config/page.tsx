import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Settings } from "lucide-react";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>
                Funcionalidades de configuración estarán disponibles en futuras
                versiones
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
