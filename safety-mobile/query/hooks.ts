import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  answerTask,
  answerObservation,
  closeTask,
  closeObservation,
  createTask,
  createObservation,
  fetchCategories,
  fetchDepartments,
  fetchLocations,
  fetchTask,
  fetchObservation,
  fetchTasks,
  fetchObservations,
  fetchProfile,
  fetchProjects,
  fetchSubcategories,
  fetchSupervisors,
  rejectTask,
  rejectObservation,
  type ObservationDto,
  type TaskDto,
  type ProjectDto,
  type DepartmentDto,
  type SupervisorDto,
  type CategoryDto,
  type SubcategoryDto,
  type LocationDto,
  type MobileProfile,
} from "@/services/api";
import { qk } from "./keys";

function normalizeScope(scope: string | null | undefined) {
  return scope || "anonymous";
}

function upsertObservationInList(
  list: ObservationDto[] | undefined,
  updated: ObservationDto
) {
  if (!list?.length) return [updated];
  let changed = false;
  const next = list.map((item) => {
    if (item.id !== updated.id) return item;
    changed = true;
    return { ...item, ...updated };
  });
  return changed ? next : [updated, ...list];
}

function upsertTaskInList(list: TaskDto[] | undefined, updated: TaskDto) {
  if (!list?.length) return [updated];
  let changed = false;
  const next = list.map((item) => {
    if (item.id !== updated.id) return item;
    changed = true;
    return { ...item, ...updated };
  });
  return changed ? next : [updated, ...list];
}

export function useProfileQuery(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<MobileProfile>({
    queryKey: qk.profile(scope),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchProfile(params.token!, signal),
    staleTime: 1000 * 60 * 5,
  });
}

export function useObservationsQuery(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<ObservationDto[]>({
    queryKey: qk.observations(scope),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchObservations(params.token!, signal),
    staleTime: 15_000,
  });
}

export function useTasksQuery(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<TaskDto[]>({
    queryKey: qk.tasks(scope),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchTasks(params.token!, signal),
    staleTime: 15_000,
  });
}

export function useObservationQuery(params: {
  token: string | null;
  scope: string | null | undefined;
  id: string | null | undefined;
  enabled?: boolean;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<ObservationDto>({
    queryKey: qk.observation(scope, params.id ?? "missing"),
    enabled: Boolean(params.token && params.id && (params.enabled ?? true)),
    queryFn: ({ signal }) => fetchObservation(params.token!, params.id!, signal),
    staleTime: 15_000,
  });
}

export function useTaskQuery(params: {
  token: string | null;
  scope: string | null | undefined;
  id: string | null | undefined;
  enabled?: boolean;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<TaskDto>({
    queryKey: qk.task(scope, params.id ?? "missing"),
    enabled: Boolean(params.token && params.id && (params.enabled ?? true)),
    queryFn: ({ signal }) => fetchTask(params.token!, params.id!, signal),
    staleTime: 15_000,
  });
}

export function useProjectsQuery(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<ProjectDto[]>({
    queryKey: qk.projects(scope),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchProjects(params.token!, signal),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useDepartmentsQuery(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<DepartmentDto[]>({
    queryKey: qk.departments(scope),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchDepartments(params.token!, signal),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useSupervisorsQuery(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<SupervisorDto[]>({
    queryKey: qk.supervisors(scope),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchSupervisors(params.token!, signal),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategoriesQuery(params: {
  token: string | null;
  scope: string | null | undefined;
  type?: "observation" | "task";
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<CategoryDto[]>({
    queryKey: qk.categories(scope, params.type ?? "observation"),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchCategories(params.token!, params.type ?? "observation", signal),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useSubcategoriesQuery(params: {
  token: string | null;
  scope: string | null | undefined;
  categoryId: string | undefined;
  type?: "observation" | "task";
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<SubcategoryDto[]>({
    queryKey: qk.subcategories(scope, params.type ?? "observation", params.categoryId),
    enabled: Boolean(params.token && params.categoryId),
    queryFn: ({ signal }) =>
      fetchSubcategories(params.token!, params.categoryId!, params.type ?? "observation", signal),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useLocationsQuery(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  return useQuery<LocationDto[]>({
    queryKey: qk.locations(scope),
    enabled: Boolean(params.token),
    queryFn: ({ signal }) => fetchLocations(params.token!, signal),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useCreateObservationMutation(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof createObservation>[1]) => {
      if (!params.token) throw new Error("Session expired. Please log in again.");
      return createObservation(params.token, payload);
    },
    onSuccess: (created) => {
      queryClient.setQueryData(qk.observation(scope, created.id), created);
      queryClient.setQueryData<ObservationDto[]>(qk.observations(scope), (prev) =>
        upsertObservationInList(prev, created)
      );
    },
  });
}

export function useCreateTaskMutation(params: {
  token: string | null;
  scope: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof createTask>[1]) => {
      if (!params.token) throw new Error("Session expired. Please log in again.");
      return createTask(params.token, payload);
    },
    onSuccess: (created) => {
      queryClient.setQueryData(qk.task(scope, created.id), created);
      queryClient.setQueryData<TaskDto[]>(qk.tasks(scope), (prev) =>
        upsertTaskInList(prev, created)
      );
    },
  });
}

export function useAnswerObservationMutation(params: {
  token: string | null;
  scope: string | null | undefined;
  observationId: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof answerObservation>[2]) => {
      if (!params.token || !params.observationId)
        throw new Error("Session expired. Please log in again.");
      return answerObservation(params.token, params.observationId, payload);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.observation(scope, updated.id), updated);
      queryClient.setQueryData<ObservationDto[]>(qk.observations(scope), (prev) =>
        upsertObservationInList(prev, updated)
      );
    },
  });
}

export function useAnswerTaskMutation(params: {
  token: string | null;
  scope: string | null | undefined;
  taskId: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof answerTask>[2]) => {
      if (!params.token || !params.taskId)
        throw new Error("Session expired. Please log in again.");
      return answerTask(params.token, params.taskId, payload);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.task(scope, updated.id), updated);
      queryClient.setQueryData<TaskDto[]>(qk.tasks(scope), (prev) =>
        upsertTaskInList(prev, updated)
      );
    },
  });
}

export function useCloseObservationMutation(params: {
  token: string | null;
  scope: string | null | undefined;
  observationId: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!params.token || !params.observationId)
        throw new Error("Session expired. Please log in again.");
      return closeObservation(params.token, params.observationId);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.observation(scope, updated.id), updated);
      queryClient.setQueryData<ObservationDto[]>(qk.observations(scope), (prev) =>
        upsertObservationInList(prev, updated)
      );
    },
  });
}

export function useCloseTaskMutation(params: {
  token: string | null;
  scope: string | null | undefined;
  taskId: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!params.token || !params.taskId)
        throw new Error("Session expired. Please log in again.");
      return closeTask(params.token, params.taskId);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.task(scope, updated.id), updated);
      queryClient.setQueryData<TaskDto[]>(qk.tasks(scope), (prev) =>
        upsertTaskInList(prev, updated)
      );
    },
  });
}

export function useRejectObservationMutation(params: {
  token: string | null;
  scope: string | null | undefined;
  observationId: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => {
      if (!params.token || !params.observationId)
        throw new Error("Session expired. Please log in again.");
      return rejectObservation(params.token, params.observationId, reason);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.observation(scope, updated.id), updated);
      queryClient.setQueryData<ObservationDto[]>(qk.observations(scope), (prev) =>
        upsertObservationInList(prev, updated)
      );
    },
  });
}

export function useRejectTaskMutation(params: {
  token: string | null;
  scope: string | null | undefined;
  taskId: string | null | undefined;
}) {
  const scope = normalizeScope(params.scope);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof rejectTask>[2]) => {
      if (!params.token || !params.taskId)
        throw new Error("Session expired. Please log in again.");
      return rejectTask(params.token, params.taskId, payload);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.task(scope, updated.id), updated);
      queryClient.setQueryData<TaskDto[]>(qk.tasks(scope), (prev) =>
        upsertTaskInList(prev, updated)
      );
    },
  });
}
