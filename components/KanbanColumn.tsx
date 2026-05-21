'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Task, Status } from '@/lib/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
}

const columnConfig: Record<Status, { label: string; accent: string; bg: string; border: string }> = {
  未着手: {
    label: '未着手',
    accent: 'text-slate-300',
    bg: 'bg-slate-900',
    border: 'border-slate-700',
  },
  進行中: {
    label: '進行中',
    accent: 'text-blue-400',
    bg: 'bg-blue-950/30',
    border: 'border-blue-800/50',
  },
  完了: {
    label: '完了',
    accent: 'text-green-400',
    bg: 'bg-green-950/30',
    border: 'border-green-800/50',
  },
};

export default function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const config = columnConfig[status];

  return (
    <div className={`flex flex-col rounded-xl border ${config.border} ${config.bg} min-h-[400px]`}>
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h2 className={`font-semibold text-sm ${config.accent}`}>{config.label}</h2>
        <span className="text-xs bg-slate-800 text-slate-400 rounded-full px-2 py-0.5 font-mono">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-2.5 min-h-[100px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-blue-500/5' : ''
            }`}
          >
            {tasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 text-xs text-slate-600 border-2 border-dashed border-slate-800 rounded-lg">
                ここにドロップ
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
