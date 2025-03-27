import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Middleware de validation générique pour les schémas Zod
 * @param schema Schéma Zod à utiliser pour la validation
 * @param data Données à valider
 * @returns Objet contenant les données validées ou une erreur
 */
export const validate = <T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: NextResponse } => {
  try {
    const result = schema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: NextResponse.json(
          {
            status: 400,
            message: "Validation failed",
            errors: formatZodErrors(result.error),
          },
          { status: 400 },
        ),
      };
    }
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: NextResponse.json(
        {
          status: 500,
          message: "Unexpected validation error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
    };
  }
};

/**
 * Formatte les erreurs Zod pour une meilleure lisibilité
 * @param error Erreur Zod
 * @returns Objet d'erreurs formaté
 */
const formatZodErrors = (error: z.ZodError) => {
  const formattedErrors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(err.message);
  });

  return formattedErrors;
};

/**
 * Valide les paramètres de requête contre un schéma Zod
 * @param searchParams Paramètres de recherche de l'URL
 * @param schema Schéma Zod à utiliser pour la validation
 * @returns Objet contenant les paramètres validés ou une erreur
 */
export const validateSearchParams = <T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>,
): { success: true; data: T } | { success: false; error: NextResponse } => {
  const queryObject: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    queryObject[key] = value;
  });

  return validate(schema, queryObject);
};
