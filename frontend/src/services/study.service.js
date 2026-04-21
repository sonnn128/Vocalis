import api from '@/config/api.js';

export const studyService = {
  /**
   * Get due flashcards
   * GET /api/v1/study/due?deckId={deckId}
   */
  getDueCards: async (deckId) => {
    const response = await api.get('/study/due', {
      params: deckId ? { deckId } : undefined,
    });
    return response.data;
  },

  /**
   * Submit a review for a specific flashcard
   * POST /api/v1/study/review
   * @param {{ flashcardId: string, quality: number }} data 
   * quality: 1 (Hard), 2 (Good), 3 (Easy)
   */
  submitReview: async (data) => {
    const response = await api.post('/study/review', data);
    return response.data;
  },

  /**
   * Get statistics for current user
   * GET /api/v1/study/statistics
   */
  getStatistics: async () => {
    const response = await api.get('/study/statistics');
    return response.data;
  },

  getQuizCards: async (deckId, limit = 10) => {
    const response = await api.get(`/study/quiz/${deckId}`, {
      params: { limit },
    });
    return response.data;
  }
};
