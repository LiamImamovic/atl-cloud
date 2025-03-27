import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.REDIS_URL || "",
  token: process.env.REDIS_TOKEN || "",
});

type RateLimitConfig = {
  limit: number;
  window: number; // en secondes
};

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 10, // 10 requêtes maximum
  window: 60, // par période de 60 secondes
};

/**
 * Middleware de limitation de taux de requêtes utilisant Redis
 * @param request La requête entrante
 * @param config Configuration optionnelle pour la limite de taux
 * @returns Objet indiquant si la requête est autorisée
 */
export const rateLimit = async (
  request: NextRequest,
  config: RateLimitConfig = DEFAULT_CONFIG,
) => {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const key = `rate-limit:${ip}`;

  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, config.window);
    }

    if (count > config.limit) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "Too Many Requests" },
          {
            status: 429,
            headers: {
              "Retry-After": config.window.toString(),
              "X-RateLimit-Limit": config.limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": (
                Math.floor(Date.now() / 1000) + config.window
              ).toString(),
            },
          },
        ),
      };
    }

    const remaining = Math.max(0, config.limit - count);

    return {
      success: true,
      remaining,
      limit: config.limit,
    };
  } catch (error) {
    console.error("Rate limiting error:", error);
    return { success: true };
  }
};
