import { useTasksContext } from '../state/TasksProvider';

export function useTasks() {
  return useTasksContext();
}
