'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Task } from '@/lib/types';
import StepIndicator from '@/components/StepIndicator';
import KanbanBoard from '@/components/KanbanBoard';

export default function BoardPage() {
  const router = useRouter();
  const { tasks, setTasks } = useTaskStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const loaded: Task[] = (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        assignee: row.assignee,
        dueDate: row.due_date,
        priority: row.priority,
        status: row.status,
      }));

      setTasks(loaded);
      setLoading(false);
    };

    fetchTasks();
  }, [setTasks]);

  const handleReset = () => {
    setTasks([]);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        タスクを読み込み中…
      </div>
    );
  }

  const done = tasks.filter((t) => t.status === '完了').length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold text-white">カンバンボード</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {tasks.length}件中 {done}件完了
            <span className="ml-2 text-blue-400 font-medium">{progress}%</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しい議事録を解析
        </button>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <StepIndicator currentStep={3} />

      <KanbanBoard />
    </div>
  );
}
