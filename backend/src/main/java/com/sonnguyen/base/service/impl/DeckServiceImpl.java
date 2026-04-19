package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.exception.CommonException;
import com.sonnguyen.base.model.Deck;
import com.sonnguyen.base.model.User;
import com.sonnguyen.base.payload.request.CreateDeckRequest;
import com.sonnguyen.base.payload.response.DeckResponse;
import com.sonnguyen.base.repository.DeckRepository;
import com.sonnguyen.base.service.DeckService;
import com.sonnguyen.base.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DeckServiceImpl implements DeckService {

    private final DeckRepository deckRepository;

    @Override
    public Page<DeckResponse> getMyDecks(Pageable pageable) {
        User currentUser = SecurityUtils.getCurrentUser();
        return deckRepository.findByUserId(currentUser.getId(), pageable)
                .map(DeckResponse::fromDeck);
    }

    @Override
    public Page<DeckResponse> getPublicDecks(Pageable pageable) {
        return deckRepository.findByIsPublicTrue(pageable)
                .map(DeckResponse::fromDeck);
    }

    @Override
    public DeckResponse getDeckById(String deckId) {
        Deck deck = findDeckOrThrow(deckId);
        User currentUser = SecurityUtils.getCurrentUser();

        // Only allow access to own decks or public decks
        if (!deck.isPublic() && !deck.getUser().getId().equals(currentUser.getId())) {
            throw new CommonException("You do not have permission to view this deck", HttpStatus.FORBIDDEN);
        }

        return DeckResponse.fromDeck(deck);
    }

    @Override
    @Transactional
    public DeckResponse createDeck(CreateDeckRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();

        Deck deck = new Deck();
        deck.setTitle(request.getTitle());
        deck.setDescription(request.getDescription());
        deck.setPublic(request.isPublic());
        deck.setUser(currentUser);

        Deck saved = deckRepository.save(deck);
        return DeckResponse.fromDeck(saved);
    }

    @Override
    @Transactional
    public DeckResponse updateDeck(String deckId, CreateDeckRequest request) {
        Deck deck = findDeckOrThrow(deckId);
        checkOwnership(deck);

        deck.setTitle(request.getTitle());
        deck.setDescription(request.getDescription());
        deck.setPublic(request.isPublic());

        Deck saved = deckRepository.save(deck);
        return DeckResponse.fromDeck(saved);
    }

    @Override
    @Transactional
    public void deleteDeck(String deckId) {
        Deck deck = findDeckOrThrow(deckId);
        checkOwnership(deck);
        deckRepository.delete(deck);
    }

    // ---------- helpers ----------

    private Deck findDeckOrThrow(String deckId) {
        return deckRepository.findById(deckId)
                .orElseThrow(() -> new CommonException("Deck not found with id: " + deckId, HttpStatus.NOT_FOUND));
    }

    private void checkOwnership(Deck deck) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (!deck.getUser().getId().equals(currentUser.getId())) {
            throw new CommonException("You are not the owner of this deck", HttpStatus.FORBIDDEN);
        }
    }
}
