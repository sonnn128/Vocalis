import api from '@/config/api.js';

export const studyService = {
  /**
   * Get due flashcards for a specific deck
   * GET /api/v1/study/{deckId}/due
   */
  getDueCards: async (deckId) => {
    const response = await api.get(`/study/${deckId}/due`);
    return response.data;
  },

  /**
   * Submit a review for a specific flashcard
   * POST /api/v1/study/review
   * @param {{ flashcardId: string, quality: number }} data 
   * quality: 0 (Hard/Again), 3 (Good), 5 (Easy)
   */
  submitReview: async (data) => {
    const response = await api.post(`/study/review`, data);
    return response.data;
  }
};
