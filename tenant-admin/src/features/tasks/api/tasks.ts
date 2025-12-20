import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Task, TaskInput } from '../types/task'

export async function fetchTasks(): Promise<Task[]> {
  return apiClient.get<Task[]>(ROUTES.TASKS.LIST)
}

export async function createTask(data: TaskInput) {
  return apiClient.post<Task>(ROUTES.TASKS.LIST, data)
}

export async function updateTask(id: string, data: Partial<TaskInput>) {
  return apiClient.patch<Task>(ROUTES.TASKS.DETAIL(id), data)
}

export async function deleteTask(id: string) {
  return apiClient.delete<{ success: boolean }>(ROUTES.TASKS.DETAIL(id))
}

export type TaskMediaPayload = {
  type: 'IMAGE' | 'VIDEO' | 'FILE'
  url: string
  uploadedByUserId: string
  isCorrective: boolean
}

export async function addTaskMedia(taskId: string, data: TaskMediaPayload) {
  return apiClient.post<unknown>(`${ROUTES.TASKS.DETAIL(taskId)}/media`, data)
}
