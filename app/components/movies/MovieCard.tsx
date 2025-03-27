import Image from "next/image";
import Link from "next/link";

type MovieProps = {
  movie: {
    _id: string;
    title: string;
    year?: number;
    poster?: string;
    plot?: string;
    genres?: string[];
  };
};

export const MovieCard = ({ movie }: MovieProps) => {
  const { _id, title, year, poster, plot, genres } = movie;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-64 w-full bg-gray-200">
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/public/images/movie-placeholder.jpg";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-300">
            <span className="text-gray-500">Image non disponible</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/movies/${_id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
            {title} {year && `(${year})`}
          </h3>
        </Link>

        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {genre}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                +{genres.length - 3}
              </span>
            )}
          </div>
        )}

        {plot && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{plot}</p>
        )}
      </div>
    </div>
  );
};
