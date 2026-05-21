'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useTaskStore } from '@/lib/store';
import { Status } from '@/lib/types';
import KanbanColumn from './KanbanColumn';

const COLUMNS: Status[] = ['未着手', '進行中', '完了'];

export default function KanbanBoard() {
  const { tasks, moveTask } = useTaskStore();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Status;
    moveTask(result.draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
