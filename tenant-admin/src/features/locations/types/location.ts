import type { Project } from "@/features/projects/types/project";

export type Location = {
  id: string;
  name: string;
  projectId: string;
  project?: Project;
  createdAt?: string;
};

export type LocationInput = {
  name: string;
  projectId: string;
};
