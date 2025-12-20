export const qk = {
  profile: (scope: string) => ["profile", scope] as const,

  observations: (scope: string) => ["observations", scope] as const,
  observation: (scope: string, id: string) => ["observation", scope, id] as const,

  tasks: (scope: string) => ["tasks", scope] as const,
  task: (scope: string, id: string) => ["task", scope, id] as const,

  projects: (scope: string) => ["projects", scope] as const,
  departments: (scope: string) => ["departments", scope] as const,
  supervisors: (scope: string) => ["supervisors", scope] as const,
  categories: (scope: string, type: "observation" | "task" = "observation") =>
    ["categories", scope, type] as const,
  subcategories: (
    scope: string,
    type: "observation" | "task" = "observation",
    categoryId?: string
  ) => ["subcategories", scope, type, categoryId ?? "all"] as const,
  locations: (scope: string) => ["locations", scope] as const,
};
