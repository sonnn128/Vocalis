package com.sonnguyen.base.service;

import com.sonnguyen.base.payload.request.CreateFlashcardRequest;
import com.sonnguyen.base.payload.response.FlashcardResponse;

import java.util.List;

public interface FlashcardService {

    List<FlashcardResponse> getFlashcardsByDeck(String deckId);

    FlashcardResponse createFlashcard(String deckId, CreateFlashcardRequest request);

    FlashcardResponse updateFlashcard(String cardId, CreateFlashcardRequest request);

    void deleteFlashcard(String cardId);
}
