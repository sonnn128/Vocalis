package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.exception.CommonException;
import com.sonnguyen.base.model.Deck;
import com.sonnguyen.base.model.Flashcard;
import com.sonnguyen.base.model.User;
import com.sonnguyen.base.payload.request.CreateFlashcardRequest;
import com.sonnguyen.base.payload.response.FlashcardResponse;
import com.sonnguyen.base.repository.DeckRepository;
import com.sonnguyen.base.repository.FlashcardRepository;
import com.sonnguyen.base.service.FlashcardService;
import com.sonnguyen.base.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FlashcardServiceImpl implements FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final DeckRepository deckRepository;

    @Override
    public List<FlashcardResponse> getFlashcardsByDeck(String deckId) {
        Deck deck = findDeckOrThrow(deckId);
        checkDeckAccess(deck);

        return flashcardRepository.findByDeckId(deckId)
                .stream()
                .map(FlashcardResponse::fromFlashcard)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FlashcardResponse createFlashcard(String deckId, CreateFlashcardRequest request) {
        Deck deck = findDeckOrThrow(deckId);
        checkDeckOwnership(deck);

        Flashcard card = new Flashcard();
        card.setDeck(deck);
        card.setFrontText(request.getFrontText());
        card.setBackText(request.getBackText());
        card.setPronunciation(request.getPronunciation());
        card.setExample(request.getExample());
        card.setPartOfSpeech(request.getPartOfSpeech());

        Flashcard saved = flashcardRepository.save(card);
        return FlashcardResponse.fromFlashcard(saved);
    }

    @Override
    @Transactional
    public FlashcardResponse updateFlashcard(String cardId, CreateFlashcardRequest request) {
        Flashcard card = findCardOrThrow(cardId);
        checkDeckOwnership(card.getDeck());

        card.setFrontText(request.getFrontText());
        card.setBackText(request.getBackText());
        card.setPronunciation(request.getPronunciation());
        card.setExample(request.getExample());
        card.setPartOfSpeech(request.getPartOfSpeech());

        Flashcard saved = flashcardRepository.save(card);
        return FlashcardResponse.fromFlashcard(saved);
    }

    @Override
    @Transactional
    public void deleteFlashcard(String cardId) {
        Flashcard card = findCardOrThrow(cardId);
        checkDeckOwnership(card.getDeck());
        flashcardRepository.delete(card);
    }

    // ---------- helpers ----------

    private Deck findDeckOrThrow(String deckId) {
        return deckRepository.findById(deckId)
                .orElseThrow(() -> new CommonException("Deck not found with id: " + deckId, HttpStatus.NOT_FOUND));
    }

    private Flashcard findCardOrThrow(String cardId) {
        return flashcardRepository.findById(cardId)
                .orElseThrow(() -> new CommonException("Flashcard not found with id: " + cardId, HttpStatus.NOT_FOUND));
    }

    private void checkDeckAccess(Deck deck) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (!deck.isPublic() && !deck.getUser().getId().equals(currentUser.getId())) {
            throw new CommonException("You do not have permission to view this deck", HttpStatus.FORBIDDEN);
        }
    }

    private void checkDeckOwnership(Deck deck) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (!deck.getUser().getId().equals(currentUser.getId())) {
            throw new CommonException("You are not the owner of this deck", HttpStatus.FORBIDDEN);
        }
    }
}
