import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/', () => {
  return HttpResponse.json({ message: 'Mocked root response' });
}),

  http.get('/api/tasks', () => {
    return HttpResponse.json([
      { id: 1, text: '買い物', category: '家事', completed: false },
      { id: 2, text: 'レポート作成', category: '仕事', completed: false }
    ]);
  }),

  http.post('/api/tasks', async ({ request }) => {
    const newTask = await request.json();
    return HttpResponse.json({
      ...newTask,
      id: Date.now()
    });
  }),

  // カテゴリ一覧
  http.get('/api/categories', () => {
    return HttpResponse.json([
      { id: 'work', title: '仕事' },
      { id: 'life', title: '家事' },
      { id: 'study', title: '勉強' },
    ]);
  }),
];
