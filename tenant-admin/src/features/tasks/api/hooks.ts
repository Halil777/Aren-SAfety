import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addTaskMedia, createTask, deleteTask, fetchTasks, updateTask, type TaskMediaPayload } from './tasks'
import type { Task, TaskInput } from '../types/task'

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: created => {
      queryClient.setQueryData<Task[]>(['tasks'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskInput> }) => updateTask(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<Task[]>(['tasks'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useAddTaskMediaMutation() {
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: TaskMediaPayload }) =>
      addTaskMedia(taskId, data),
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Task[]>(['tasks'], old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
