export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'ToDo' | 'InProgress' | 'Review' | 'Completed';

export interface TaskUser {
  id: string;
  name: string;
  email?: string;
}

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
  assignedTo?: TaskUser | null;
  creator: TaskUser;
  teamId?: string | null;
  team?: {
    id: string;
    name: string;
  };
}

export interface Subtask {
  id: string;
  title: string;
  status: Status;
}

export interface TaskFilters {
  teamId?: string;
  scope?: 'team' | 'personal' | 'all';
  status?: Status;
  priority?: Priority;
  sortBy?: 'dueDate' | 'createdAt';
  assignedToMe?: boolean;
  createdByMe?: boolean;
  overdue?: boolean;
  search?: string;
  assignedToId?: string;
  creatorId?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  assignedToId?: string;
  teamId?: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskFormPayload = Omit<CreateTaskInput, 'teamId'>;
