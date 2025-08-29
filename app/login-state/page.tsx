"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function LoginStatePage() {
  const params = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("code");
    const state = params.get("state");

    if (token && state === "200") {
      login(token);
      router.replace("/");
    } else {
      router.replace(process.env.NEXT_CORE_LOGIN!);
    }
  }, [params, router, login]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Procesando login...
        </p>
      </div>
    </div>
  );
}
