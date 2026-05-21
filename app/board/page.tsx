'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/lib/store';
import StepIndicator from '@/components/StepIndicator';
import KanbanBoard from '@/components/KanbanBoard';

export default function BoardPage() {
  const router = useRouter();
  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);

  useEffect(() => {
    if (tasks.length === 0) {
      router.replace('/');
    }
  }, [tasks, router]);

  const handleReset = () => {
    setTasks([]);
    router.push('/');
  };

  if (tasks.length === 0) return null;

  const done = tasks.filter((t) => t.status === '完了').length;
  const progress = Math.round((done / tasks.length) * 100);

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
