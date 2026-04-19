import api from '@/config/api';

export const flashcardService = {
  /**
   * Get all flashcards in a deck
   */
  getFlashcards: async (deckId) => {
    const response = await api.get(`/decks/${deckId}/flashcards`);
    return response.data;
  },

  /**
   * Add a flashcard to a deck (owner only)
   * @param {string} deckId
   * @param {{ frontText, backText, pronunciation, example, partOfSpeech }} data
   */
  createFlashcard: async (deckId, data) => {
    const response = await api.post(`/decks/${deckId}/flashcards`, data);
    return response.data;
  },

  /**
   * Update a flashcard by its ID (owner only)
   */
  updateFlashcard: async (cardId, data) => {
    const response = await api.put(`/flashcards/${cardId}`, data);
    return response.data;
  },

  /**
   * Delete a flashcard by its ID (owner only)
   */
  deleteFlashcard: async (cardId) => {
    const response = await api.delete(`/flashcards/${cardId}`);
    return response.data;
  },
};
