import { MovieList } from "@/app/components/movies/MovieList";
import { getAuthFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "../components/auth/LogoutButton";

export default async function DashboardPage() {
  const auth = await getAuthFromCookie();

  if (!auth) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Catalogue de Films</h1>
          <p className="text-gray-600">Bienvenue, {auth.name || auth.email}</p>
        </div>
        <LogoutButton />
      </div>

      <MovieList />
    </div>
  );
}
