// app/types/task.ts
export interface Task {
  _id: string;        // now a simple string
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: string;
  status: string;
}
export interface TaskInput {
  projectId: string;   // now holds the project name
  title: string;
  description: string;
  assignedTo: string;  // now holds the user name or email
  dueDate: string;
  priority: string;
  status: string;
}