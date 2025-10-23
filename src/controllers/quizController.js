import { listQuizzes, getQuizWithQuestions } from '../services/quizService.js';

export async function getQuizzes(req, res) {
  try {
    const data = await listQuizzes();
    return res.json({ success: true, data });
  } catch (e) {
    console.error('getQuizzes error:', e);
    return res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
  }
}

export async function getQuizById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz id' });
    }
    const quiz = await getQuizWithQuestions(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    return res.json({ success: true, data: quiz });
  } catch (e) {
    console.error('getQuizById error:', e);
    return res.status(500).json({ success: false, message: 'Failed to fetch quiz' });
  }
}
