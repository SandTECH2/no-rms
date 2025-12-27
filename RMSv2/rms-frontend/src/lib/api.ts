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
  getProjects: () => request<Project[]>("/projects"),
  createProject: (payload: CreateProjectPayload) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify(payload) }),
  getCustomers: () => request<Customer[]>("/customers"),
  createCustomer: (payload: CreateCustomerPayload) =>
    request<Customer>("/customers", { method: "POST", body: JSON.stringify(payload) }),
  getEquipment: () => request<Equipment[]>("/equipment"),
  createEquipment: (payload: CreateEquipmentPayload) =>
    request<Equipment>("/equipment", { method: "POST", body: JSON.stringify(payload) }),
  getCrew: () => request<CrewMember[]>("/crew"),
  createCrew: (payload: CreateCrewPayload) =>
    request<CrewMember>("/crew", { method: "POST", body: JSON.stringify(payload) }),
  getWarehouses: () => request<Warehouse[]>("/warehouses"),
  createWarehouse: (payload: CreateWarehousePayload) =>
    request<Warehouse>("/warehouses", { method: "POST", body: JSON.stringify(payload) }),
  getOrganizations: () => request<Organization[]>("/organizations"),
  createOrganization: (payload: CreateOrganizationPayload) =>
    request<Organization>("/organizations", { method: "POST", body: JSON.stringify(payload) }),
  scanEquipment: (serial: string) => request(`/equipment/scan/${serial}`, { method: "POST" }),
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

export interface Equipment {
  id: number | string;
  code: string;
  name: string;
  quantity: number;
  available: number;
  totalQuantity: number;
  price?: string | null;
  shelf?: string | null;
  warehouse?: string | null;
  serialCount?: number;
}

export interface CrewMember {
  id: number | string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  role: string;
  email?: string | null;
  phone?: string | null;
}

export interface Warehouse {
  id: number | string;
  name: string;
  address?: string | null;
  internalNote?: string | null;
  organization?: string | null;
}

export interface Organization {
  id: number | string;
  name: string;
  users: number;
  projects: number;
}

export interface CreateProjectPayload {
  name: string;
  type: string;
  status: string;
  projectManager?: string;
  warehouseId?: number;
  clientId?: number;
  organizationId?: number;
}

export interface CreateCustomerPayload {
  businessName: string;
  orgNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CreateEquipmentPayload {
  code: string;
  name: string;
  quantity?: number;
  pricePer?: number;
  warehouseId?: number;
}

export interface CreateCrewPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
  email?: string;
  phone?: string;
  organizationId?: number;
}

export interface CreateWarehousePayload {
  name: string;
  address?: string;
  internalNote?: string;
  organizationId: number;
}

export interface CreateOrganizationPayload {
  name: string;
}
