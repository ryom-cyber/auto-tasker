import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/lib/types';

const MOCK_TASKS: Task[] = [
  {
    id: uuidv4(),
    title: '提案資料の修正',
    assignee: '佐藤',
    dueDate: '2026-05-28',
    priority: '高',
    status: '未着手',
  },
  {
    id: uuidv4(),
    title: 'クライアントへの見積もり送付',
    assignee: '鈴木',
    dueDate: '2026-05-23',
    priority: '高',
    status: '未着手',
  },
  {
    id: uuidv4(),
    title: 'デザインレビューの日程調整',
    assignee: '田中',
    dueDate: '2026-05-30',
    priority: '中',
    status: '未着手',
  },
];

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: '議事録テキストを入力してください' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1500));
    return NextResponse.json({
      tasks: MOCK_TASKS.map((t) => ({ ...t, id: uuidv4() })),
    });
  }

  const today = new Date().toISOString().split('T')[0];

  const prompt = `あなたは議事録からタスクを抽出する専門AIです。
今日の日付は ${today} です。

以下のルールに従ってJSON形式でタスクを抽出してください:
- タスク名(title): 具体的かつ簡潔なアクションアイテム
- 担当者(assignee): 議事録内の人名（不明な場合は空文字）
- 期限(dueDate): YYYY-MM-DD形式（「来週末」「5/25」等の相対表現は今日を基準に変換。不明な場合は2週間後）
- 優先度(priority): 「高」「中」「低」の3段階（「至急」「なるはや」→高、明示なし→中）
- ステータス(status): 常に「未着手」

必ず以下のJSONスキーマのみを返してください（説明文不要）:
{"tasks": [{"title": string, "assignee": string, "dueDate": string, "priority": "高"|"中"|"低", "status": "未着手"}]}

以下の議事録からタスクを抽出してください:

${text}`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const result = await model.generateContent(prompt);
  const content = result.response.text();
  const parsed = JSON.parse(content);
  const rawTasks = parsed.tasks ?? [];

  const tasks: Task[] = rawTasks.map((t: Omit<Task, 'id'>) => ({
    ...t,
    id: uuidv4(),
    status: '未着手' as const,
  }));

  return NextResponse.json({ tasks });
}
