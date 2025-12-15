export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'ToDo' | 'InProgress' | 'Review' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: Priority;
  status: Status;
  creatorId: string;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  sortBy?: 'dueDate' | 'createdAt';
  assignedToMe?: boolean;
  createdByMe?: boolean;
  overdue?: boolean;
  search?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  assignedToId?: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;
