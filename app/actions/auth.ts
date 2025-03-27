"use server";

import { getAuthFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  email: string;
  password: string;
  name: string;
};

export async function login(formData: LoginFormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Une erreur est survenue lors de la connexion",
    );
  }

  return data;
}

export async function register(formData: RegisterFormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Une erreur est survenue lors de l'inscription",
    );
  }

  return data;
}

export async function logout() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/logout`, {
    method: "POST",
  });

  redirect("/");
}

export async function getCurrentUser() {
  return getAuthFromCookie();
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
}
