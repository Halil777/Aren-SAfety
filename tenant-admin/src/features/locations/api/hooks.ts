import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLocation, deleteLocation, fetchLocations, updateLocation } from "./locations";
import type { Location, LocationInput } from "../types/location";

export function useLocationsQuery() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
}

export function useCreateLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: (created) => {
      queryClient.setQueryData<Location[]>(["locations"], (old) =>
        old ? [created, ...old] : [created]
      );
    },
  });
}

export function useUpdateLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LocationInput }) =>
      updateLocation(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Location[]>(["locations"], (old) =>
        old ? old.map((item) => (item.id === updated.id ? updated : item)) : [updated]
      );
    },
  });
}

export function useDeleteLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Location[]>(["locations"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });
}
