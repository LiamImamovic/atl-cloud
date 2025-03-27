import { getAuthFromCookie } from "@/lib/auth";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Params = {
  id: string;
};

type Movie = {
  _id: string;
  title: string;
  year?: number;
  poster?: string;
  plot?: string;
  fullplot?: string;
  genres?: string[];
  directors?: string[];
  cast?: string[];
  writers?: string[];
  runtime?: number;
  rated?: string;
  imdb?: {
    rating?: number;
    votes?: number;
  };
  countries?: string[];
  languages?: string[];
  released?: string;
};

async function getMovie(id: string): Promise<Movie | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "";

    const auth = await getAuthFromCookie();
    if (!auth) {
      throw new Error("Authentification requise");
    }

    const mongoClient = await client.connect();
    const db = mongoClient.db("sample_mflix");

    if (!ObjectId.isValid(id)) {
      throw new Error("ID de film invalide");
    }

    const movie = await db
      .collection("embedded_movies")
      .findOne({ _id: new ObjectId(id) });

    if (!movie) {
      return null;
    }

    return movie as unknown as Movie;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

// Modif le type Props pour éviter le conflit avec PageProps
type MovieDetailProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function MovieDetail(props: any) {
  const auth = await getAuthFromCookie();

  if (!auth) {
    redirect("/login");
  }

  // FUCKING TYPES PROBLEM
  const id =
    typeof props.params?.id === "string"
      ? props.params.id
      : typeof props.params?.then === "function"
      ? await props.params.then((p: any) => p.id)
      : "";

  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>←</span> Retour au catalogue
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Poster */}
          <div className="md:w-1/3 relative">
            <div className="relative h-96 md:h-full w-full bg-gray-200">
              {movie.poster ? (
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-300">
                  <span className="text-gray-500">Image non disponible</span>
                </div>
              )}
            </div>
          </div>

          {/* Informations */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {movie.title} {movie.year && `(${movie.year})`}
            </h1>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Ratings */}
            {movie.imdb?.rating && (
              <div className="mt-4 flex items-center">
                <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded">
                  IMDb {movie.imdb.rating.toFixed(1)}
                </div>
                {movie.imdb.votes && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({movie.imdb.votes.toLocaleString()} votes)
                  </span>
                )}
              </div>
            )}

            {/* Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {movie.directors && movie.directors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Réalisateur(s)
                  </h3>
                  <p className="mt-1 text-black">
                    {movie.directors.join(", ")}
                  </p>
                </div>
              )}

              {movie.writers && movie.writers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Scénariste(s)
                  </h3>
                  <p className="mt-1 text-black">{movie.writers.join(", ")}</p>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Casting</h3>
                  <p className="mt-1 text-black">{movie.cast.join(", ")}</p>
                </div>
              )}

              {movie.released && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date de sortie
                  </h3>
                  <p className="mt-1 text-black">
                    {formatDate(movie.released)}
                  </p>
                </div>
              )}

              {movie.runtime && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                  <p className="mt-1 text-black">{movie.runtime} min</p>
                </div>
              )}

              {movie.countries && movie.countries.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pays</h3>
                  <p className="mt-1 text-black">
                    {movie.countries.join(", ")}
                  </p>
                </div>
              )}

              {movie.languages && movie.languages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Langues</h3>
                  <p className="mt-1 text-black">
                    {movie.languages.join(", ")}
                  </p>
                </div>
              )}

              {movie.rated && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Classification
                  </h3>
                  <p className="mt-1 text-black">{movie.rated}</p>
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-700">
                {movie.fullplot || movie.plot || "Aucun synopsis disponible."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
