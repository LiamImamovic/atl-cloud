import { AuthForm } from "@/app/components/auth/AuthForm";
import Link from "next/link";

export const metadata = {
  title: "Connexion | Movie App",
  description: "Connectez-vous pour accéder à notre catalogue de films",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center mb-6">
        <Link href="/" className="inline-block">
          <h2 className="text-3xl font-bold text-blue-600">Movie App</h2>
        </Link>
        <p className="mt-2 text-gray-600">
          Connectez-vous pour explorer notre collection de films
        </p>
      </div>

      <AuthForm />

      <div className="mt-8 text-center text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          &larr; Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
