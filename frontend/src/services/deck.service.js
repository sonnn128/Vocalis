import api from '@/config/api';

export const deckService = {
  /**
   * Get paginated list of the current user's decks
   */
  getMyDecks: async (page = 0, size = 20) => {
    const response = await api.get('/decks', { params: { page, size } });
    return response.data;
  },

  /**
   * Get paginated list of public decks
   */
  getPublicDecks: async (page = 0, size = 20) => {
    const response = await api.get('/decks/public', { params: { page, size } });
    return response.data;
  },

  /**
   * Get a single deck by ID
   */
  getDeckById: async (deckId) => {
    const response = await api.get(`/decks/${deckId}`);
    return response.data;
  },

  /**
   * Create a new deck
   * @param {{ title: string, description: string, isPublic: boolean }} data
   */
  createDeck: async (data) => {
    const response = await api.post('/decks', data);
    return response.data;
  },

  /**
   * Update an existing deck (owner only)
   */
  updateDeck: async (deckId, data) => {
    const response = await api.put(`/decks/${deckId}`, data);
    return response.data;
  },

  /**
   * Delete a deck (owner only)
   */
  deleteDeck: async (deckId) => {
    const response = await api.delete(`/decks/${deckId}`);
    return response.data;
  },
};
