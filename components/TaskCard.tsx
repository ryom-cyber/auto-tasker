'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Task, Priority } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityConfig: Record<Priority, { label: string; classes: string; dot: string }> = {
  高: {
    label: '高',
    classes: 'bg-red-500/10 text-red-400 border border-red-500/20',
    dot: 'bg-red-500',
  },
  中: {
    label: '中',
    classes: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    dot: 'bg-yellow-500',
  },
  低: {
    label: '低',
    classes: 'bg-green-500/10 text-green-400 border border-green-500/20',
    dot: 'bg-green-500',
  },
};

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-');
  return `${m}/${d}`;
}

function isOverdue(dateStr: string) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const p = priorityConfig[task.priority];
  const overdue = isOverdue(task.dueDate) && task.status !== '完了';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-slate-800 border rounded-lg p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing transition-all select-none
            ${snapshot.isDragging
              ? 'border-blue-500 shadow-lg shadow-blue-500/10 rotate-1 scale-105'
              : 'border-slate-700 hover:border-slate-600'
            }
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-slate-100 font-medium leading-snug flex-1">{task.title}</p>
            <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${p.classes}`}>
              {p.label}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {task.assignee ? (
              <span className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-200 flex-shrink-0">
                  {task.assignee.charAt(0)}
                </span>
                {task.assignee}
              </span>
            ) : (
              <span className="text-xs text-slate-600">担当者未定</span>
            )}

            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {overdue ? '期限切れ ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
