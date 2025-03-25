import { getApiDocs } from "@/lib/swagger";
import { ReactSwagger } from "./react-swagger";

export default async function ApiDoc() {
  const spec = await getApiDocs();

  return (
    <section className="container mx-auto py-8 px-4 bg-white rounded-lg shadow-md my-2">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API MFLIX Documentation</h1>
        <p className="text-gray-600">
          Explorez et testez les endpoints de l'API MFLIX pour accéder aux
          données cinématographiques.
        </p>
      </div>
      <ReactSwagger spec={spec} />
    </section>
  );
}
