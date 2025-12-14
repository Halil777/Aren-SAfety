import { ROUTES } from "@/shared/config/api";
import { apiClient } from "@/shared/lib/api-client";
import type { Location, LocationInput } from "../types/location";

export async function fetchLocations(): Promise<Location[]> {
  return apiClient.get<Location[]>(ROUTES.LOCATIONS.LIST);
}

export async function createLocation(data: LocationInput): Promise<Location> {
  return apiClient.post<Location>(ROUTES.LOCATIONS.LIST, data);
}

export async function updateLocation(id: string, data: LocationInput): Promise<Location> {
  return apiClient.patch<Location>(ROUTES.LOCATIONS.DETAIL(id), data);
}

export async function deleteLocation(id: string): Promise<void> {
  await apiClient.delete(ROUTES.LOCATIONS.DETAIL(id));
}
