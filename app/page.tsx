'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/lib/store';
import { Task } from '@/lib/types';
import StepIndicator from '@/components/StepIndicator';

const SAMPLE_TEXT = `【週次ミーティング議事録】
日時: 2026年5月21日（水）14:00〜15:00
参加者: 佐藤、鈴木、田中、山本

■ 議題1: Q2提案資料について
佐藤さんから、先方のフィードバックを受けてデザインを修正してほしいとのこと。
至急対応が必要で、今週末までに完成させること。担当は鈴木さん。

■ 議題2: クライアントへの見積もり
山本さんが来週月曜日（5/25）までに最終見積もりをクライアントへ送付する。
金額の最終確認は佐藤さんが明日中に行うこと。

■ 議題3: 次回デザインレビュー
田中さんが来月初旬を目処にデザインレビューの日程を調整してメンバーに共有する。
優先度は中程度でOK。`;

export default function HomePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setTasks = useTaskStore((s) => s.setTasks);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('議事録テキストを入力してください');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '解析に失敗しました');
      setTasks(data.tasks as Task[]);
      router.push('/review');
    } catch (e) {
      setError(e instanceof Error ? e.message : '解析中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-bold text-white">
          議事録をペーストするだけ
        </h1>
        <p className="text-slate-400">
          AIがタスク・担当者・期限・優先度を自動抽出します
        </p>
      </div>

      <StepIndicator currentStep={1} />

      <div className="max-w-3xl mx-auto space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ここに議事録やミーティングメモをペーストしてください…"
            rows={14}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed scrollbar-thin"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-600">
            {text.length} 文字
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setText(SAMPLE_TEXT)}
            className="text-sm text-slate-400 hover:text-slate-200 underline underline-offset-2 transition-colors"
          >
            サンプルテキストを使う
          </button>
          <div className="flex items-center gap-3">
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                クリア
              </button>
            )}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI解析中…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI解析する
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 pt-4">
        {[
          { icon: '📋', title: 'ペーストするだけ', desc: 'テキストを貼り付けてボタンを押すだけ' },
          { icon: '✏️', title: '確認・修正できる', desc: '登録前にAI結果を自由に編集' },
          { icon: '🗂️', title: 'カンバンで管理', desc: 'D&Dで進捗をリアルタイム更新' },
        ].map((item) => (
          <div key={item.title} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center space-y-1.5">
            <div className="text-2xl">{item.icon}</div>
            <div className="text-sm font-semibold text-slate-200">{item.title}</div>
            <div className="text-xs text-slate-500">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
