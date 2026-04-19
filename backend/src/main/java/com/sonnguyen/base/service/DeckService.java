package com.sonnguyen.base.service;

import com.sonnguyen.base.payload.request.CreateDeckRequest;
import com.sonnguyen.base.payload.response.DeckResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DeckService {

    Page<DeckResponse> getMyDecks(Pageable pageable);

    Page<DeckResponse> getPublicDecks(Pageable pageable);

    DeckResponse getDeckById(String deckId);

    DeckResponse createDeck(CreateDeckRequest request);

    DeckResponse updateDeck(String deckId, CreateDeckRequest request);

    void deleteDeck(String deckId);
}
