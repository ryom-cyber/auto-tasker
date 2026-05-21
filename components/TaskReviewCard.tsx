'use client';

import { Task, Priority } from '@/lib/types';

interface TaskReviewCardProps {
  task: Task;
  index: number;
  onChange: (patch: Partial<Task>) => void;
  onDelete: () => void;
}

const priorityColors: Record<Priority, string> = {
  高: 'bg-red-500/10 text-red-400 border-red-500/30',
  中: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  低: 'bg-green-500/10 text-green-400 border-green-500/30',
};

export default function TaskReviewCard({ task, index, onChange, onDelete }: TaskReviewCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs flex items-center justify-center font-mono">
            {index + 1}
          </span>
          <input
            type="text"
            value={task.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="flex-1 bg-transparent text-white font-semibold text-sm focus:outline-none border-b border-transparent focus:border-blue-500 pb-0.5 transition-colors min-w-0"
            placeholder="タスク名"
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="flex-shrink-0 text-slate-600 hover:text-red-400 transition-colors p-1"
          title="削除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-500 font-medium">担当者</label>
          <input
            type="text"
            value={task.assignee}
            onChange={(e) => onChange({ assignee: e.target.value })}
            placeholder="未定"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-500 font-medium">期限</label>
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-500 font-medium">優先度</label>
          <div className="relative">
            <select
              value={task.priority}
              onChange={(e) => onChange({ priority: e.target.value as Priority })}
              className={`w-full border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer ${priorityColors[task.priority]} bg-slate-800`}
            >
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
