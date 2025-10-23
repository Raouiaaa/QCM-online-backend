import { createResult } from '../services/resultService.js';

export async function submitResult(req, res) {
  try {
    const userId = req.user?.id; // from auth middleware
    const { quizId, score } = req.body || {};
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (!Number.isInteger(quizId) || !Number.isInteger(score) || score < 0) {
      return res.status(400).json({ success: false, message: 'Invalid quizId or score' });
    }

    const saved = await createResult({ userId, quizId, score });
    return res.status(201).json({ success: true, data: saved });
  } catch (e) {
    console.error('submitResult error:', e);
    return res.status(500).json({ success: false, message: 'Failed to submit result' });
  }
}
