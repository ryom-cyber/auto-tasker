'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTaskStore } from '@/lib/store';
import { Task } from '@/lib/types';
import StepIndicator from '@/components/StepIndicator';
import TaskReviewCard from '@/components/TaskReviewCard';

export default function ReviewPage() {
  const router = useRouter();
  const { tasks, updateTask, deleteTask } = useTaskStore();

  useEffect(() => {
    if (tasks.length === 0) {
      router.replace('/');
    }
  }, [tasks, router]);

  const handleRegister = () => {
    router.push('/board');
  };

  if (tasks.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-bold text-white">AI解析結果の確認</h1>
        <p className="text-slate-400">
          抽出された{tasks.length}件のタスクを確認・編集してからカンバンに登録してください
        </p>
      </div>

      <StepIndicator currentStep={2} />

      <div className="max-w-3xl mx-auto space-y-3">
        {tasks.map((task, i) => (
          <TaskReviewCard
            key={task.id}
            task={task}
            index={i}
            onChange={(patch) => updateTask(task.id, patch as Partial<Task>)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            全タスクが削除されました。
            <button
              onClick={() => router.push('/')}
              className="ml-2 text-blue-400 hover:underline"
            >
              最初に戻る
            </button>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto flex items-center justify-between pt-2 pb-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          戻る
        </button>

        <button
          type="button"
          onClick={handleRegister}
          disabled={tasks.length === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          カンバンへ登録（{tasks.length}件）
        </button>
      </div>
    </div>
  );
}
