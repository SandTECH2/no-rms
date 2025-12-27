const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getProjects: () => request<Project[]>('/projects'),
  getCustomers: () => request<Customer[]>('/customers'),
};

export interface Project {
  id: number | string;
  name: string;
  type: string;
  status: "pending" | "confirmed" | "on-location" | "returned" | string;
  projectManager?: string | null;
  warehouse?: string | null;
}

export interface Customer {
  id: number | string;
  businessName: string;
  orgNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}
