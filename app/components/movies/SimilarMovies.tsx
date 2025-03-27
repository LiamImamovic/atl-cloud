"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Movie = {
  _id: string;
  title: string;
  poster?: string;
  year?: number;
};

type SimilarMoviesProps = {
  genres: string[];
  currentMovieId: string;
};

export const SimilarMovies = ({
  genres,
  currentMovieId,
}: SimilarMoviesProps) => {
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        // TODO: implémenter un endpoint API qui retourne des films similaires
        // basés sur les genres
        const response = await fetch(
          `/api/movies/similar?genres=${genres.join(
            ",",
          )}&exclude=${currentMovieId}`,
        );

        if (!response.ok)
          throw new Error(
            "Erreur lors de la récupération des films similaires",
          );

        const data = await response.json();
        setSimilarMovies(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (genres.length > 0) {
      fetchSimilarMovies();
    }
  }, [genres, currentMovieId]);

  if (isLoading || similarMovies.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Films similaires</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {similarMovies.slice(0, 5).map((movie) => (
          <Link key={movie._id} href={`/movies/${movie._id}`} className="group">
            <div className="relative h-48 rounded-lg overflow-hidden">
              {movie.poster ? (
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-300">
                  <span className="text-gray-500 text-sm">
                    Image non disponible
                  </span>
                </div>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium group-hover:text-blue-600 truncate">
              {movie.title} {movie.year && `(${movie.year})`}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};
