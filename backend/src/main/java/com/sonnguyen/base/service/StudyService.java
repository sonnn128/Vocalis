package com.sonnguyen.base.service;

import com.sonnguyen.base.payload.request.ReviewRequest;
import com.sonnguyen.base.payload.response.FlashcardResponse;

import java.util.List;

public interface StudyService {
    List<FlashcardResponse> getDueFlashcards(String userId, String deckId);
    void reviewFlashcard(String userId, ReviewRequest request);
    com.sonnguyen.base.payload.response.StatisticsResponse getStatistics(String userId);
    List<FlashcardResponse> getQuizCards(String deckId, int limit);
}
