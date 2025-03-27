"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type AuthMode = "login" | "register";

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const router = useRouter();

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSuccess = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "login" ? "Se connecter" : "Créer un compte"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "login"
            ? "Accédez à notre catalogue de films"
            : "Rejoignez-nous pour explorer notre catalogue"}
        </p>
      </div>

      {mode === "login" ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSuccess={() => setMode("login")} />
      )}

      <div className="text-center pt-2">
        <button
          onClick={toggleMode}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          {mode === "login"
            ? "Vous n'avez pas de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
};
