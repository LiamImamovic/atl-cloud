import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MFLIX API",
        version: "1.0",
        description:
          "API pour l'application MFLIX - données cinématographiques",
        contact: {
          name: "Support MFLIX",
          email: "support@mflix.example.com",
        },
      },
      servers: [
        {
          url: "/api",
          description: "API Server",
        },
      ],
      tags: [
        {
          name: "Movies",
          description: "Opérations sur les films",
        },
        {
          name: "Comments",
          description: "Opérations sur les commentaires",
        },
        {
          name: "Theaters",
          description: "Opérations sur les théâtres et cinémas",
        },
      ],
      components: {
        schemas: {
          Movie: {
            type: "object",
            properties: {
              _id: { type: "string" },
              title: { type: "string" },
              year: { type: "integer" },
              plot: { type: "string" },
              genres: {
                type: "array",
                items: { type: "string" },
              },
              // Autres propriétés peuvent être ajoutées selon la structure de vos documents
            },
          },
          Comment: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              movie_id: { type: "string" },
              text: { type: "string" },
              date: { type: "string", format: "date-time" },
            },
          },
          Theater: {
            type: "object",
            properties: {
              _id: { type: "string" },
              theaterId: { type: "integer" },
              location: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  geo: {
                    type: "object",
                    properties: {
                      type: { type: "string" },
                      coordinates: {
                        type: "array",
                        items: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return spec;
};
