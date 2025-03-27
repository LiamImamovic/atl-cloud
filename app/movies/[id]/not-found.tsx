import Link from "next/link";

export default function MovieNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Film non trouvé</h1>
      <p className="text-gray-600 mb-8">
        Le film que vous recherchez n'existe pas ou a été supprimé.
      </p>
      <Link
        href="/dashboard"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour au catalogue
      </Link>
    </div>
  );
}
