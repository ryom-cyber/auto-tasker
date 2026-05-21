export type Priority = '高' | '中' | '低';
export type Status = '未着手' | '進行中' | '完了';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  status: Status;
}
