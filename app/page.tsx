import { testDatabaseConnection } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const isConnected = await testDatabaseConnection();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          MFLIX API Platform
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          <Image
            className="dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={150}
            height={32}
            priority
          />
          {" + "}
          <Image
            className="dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:saturate-100 dark:brightness-100"
            src="/mongodb.svg"
            alt="MongoDB Logo"
            width={150}
            height={32}
            priority
          />
        </div>

        {isConnected ? (
          <div className="text-center mb-12">
            <p className="text-lg text-green-500 font-semibold">
              ✅ Connecté à MongoDB Atlas avec succès!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              La base de données est prête à être utilisée.
            </p>
          </div>
        ) : (
          <div className="text-center mb-12 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-lg text-red-500 font-semibold">
              ❌ Non connecté à MongoDB Atlas
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Veuillez vérifier votre configuration dans le fichier .env.local
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/api-doc"
            className="block p-6 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Documentation API</h2>
            <p className="text-gray-600">
              Explorez la documentation Swagger interactive de l'API MFLIX.
            </p>
          </Link>

          <a
            href="https://github.com/your-repo/mflix-api"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Code Source</h2>
            <p className="text-gray-600">
              Accédez au code source du projet sur GitHub.
            </p>
          </a>

          <div className="block p-6 border border-gray-200 rounded-xl md:col-span-2">
            <h2 className="text-2xl font-bold mb-2">Endpoints API</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2">Films</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <code className="text-blue-600">/api/movies</code> - Liste
                    tous les films
                  </li>
                  <li>
                    <code className="text-blue-600">/api/movies/:id</code> -
                    Détails d'un film
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2">Commentaires</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <code className="text-blue-600">/api/movies/comments</code>{" "}
                    - Tous les commentaires
                  </li>
                  <li>
                    <code className="text-blue-600">
                      /api/movies/comments/:id
                    </code>{" "}
                    - Détails d'un commentaire
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2">Théâtres</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <code className="text-blue-600">/api/theaters</code> - Liste
                    tous les théâtres
                  </li>
                  <li>
                    <code className="text-blue-600">/api/theaters/:id</code> -
                    Détails d'un théâtre
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
