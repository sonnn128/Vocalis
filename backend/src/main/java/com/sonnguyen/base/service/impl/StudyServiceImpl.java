package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.exception.CommonException;
import com.sonnguyen.base.model.Flashcard;
import com.sonnguyen.base.model.User;
import com.sonnguyen.base.model.UserProgress;
import com.sonnguyen.base.payload.request.ReviewRequest;
import com.sonnguyen.base.payload.response.FlashcardResponse;
import com.sonnguyen.base.repository.FlashcardRepository;
import com.sonnguyen.base.repository.UserProgressRepository;
import com.sonnguyen.base.repository.UserRepository;
import com.sonnguyen.base.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final UserProgressRepository userProgressRepository;
    private final FlashcardRepository flashcardRepository;
    private final UserRepository userRepository;
    private final com.sonnguyen.base.repository.DeckRepository deckRepository;

    @Override
    public List<FlashcardResponse> getDueFlashcards(String userId, String deckId) {
        LocalDateTime now = LocalDateTime.now();
        List<UserProgress> dueProgresses;
        if (deckId != null) {
            dueProgresses = userProgressRepository.findByUserIdAndFlashcard_Deck_IdAndNextReviewBefore(userId, deckId, now);
        } else {
            dueProgresses = userProgressRepository.findByUserIdAndNextReviewBefore(userId, now);
        }

        List<String> studiedCardIds = userProgressRepository.findAll().stream()
                .filter(p -> p.getUser().getId().equals(userId) && p.getFlashcard().getDeck().getId().equals(deckId))
                .map(p -> p.getFlashcard().getId())
                .collect(Collectors.toList());

        // Find totally new cards in the deck
        List<Flashcard> newCards;
        if (deckId != null) {
            if (studiedCardIds.isEmpty()) {
                newCards = flashcardRepository.findByDeckId(deckId);
            } else {
                newCards = flashcardRepository.findByDeckIdAndIdNotIn(deckId, studiedCardIds);
            }
        } else {
            newCards = List.of(); // Requires deckId for study
        }

        // Merge due and new
        List<FlashcardResponse> responses = dueProgresses.stream()
                .map(p -> FlashcardResponse.fromFlashcard(p.getFlashcard()))
                .collect(Collectors.toList());

        responses.addAll(newCards.stream().map(FlashcardResponse::fromFlashcard).collect(Collectors.toList()));
        
        return responses;
    }

    @Override
    public com.sonnguyen.base.payload.response.StatisticsResponse getStatistics(String userId) {
        long totalDecks = deckRepository.countByUserId(userId);
        long totalCards = flashcardRepository.countByDeck_User_Id(userId);

        List<UserProgress> progresses = userProgressRepository.findByUserId(userId);
        long learningCards = progresses.stream().filter(p -> p.getRepetitions() > 0 && p.getIntervalDays() < 21).count();
        long masteredCards = progresses.stream().filter(p -> p.getIntervalDays() >= 21).count();
        long newCards = totalCards - learningCards - masteredCards;

        return com.sonnguyen.base.payload.response.StatisticsResponse.builder()
                .totalDecks(totalDecks)
                .totalCards(totalCards)
                .newCards(newCards < 0 ? 0 : newCards)
                .learningCards(learningCards)
                .masteredCards(masteredCards)
                .build();
    }

    @Override
    public List<FlashcardResponse> getQuizCards(String deckId, int limit) {
        List<Flashcard> allCards = flashcardRepository.findByDeckId(deckId);
        java.util.Collections.shuffle(allCards);
        return allCards.stream()
                .limit(limit)
                .map(FlashcardResponse::fromFlashcard)
                .collect(Collectors.toList());
    }

    @Override
    public void reviewFlashcard(String userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException("User not found", HttpStatus.NOT_FOUND));
        Flashcard flashcard = flashcardRepository.findById(request.getFlashcardId())
                .orElseThrow(() -> new CommonException("Flashcard not found", HttpStatus.NOT_FOUND));

        UserProgress progress = userProgressRepository.findByUserIdAndFlashcardId(userId, flashcard.getId())
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .flashcard(flashcard)
                        .intervalDays(0)
                        .easeFactor(2.5)
                        .repetitions(0)
                        .build());

        calculateNextReview(progress, request.getQuality());

        userProgressRepository.save(progress);
    }

    private void calculateNextReview(UserProgress progress, int quality) {
        // Simple SM-2 implementation with mapped qualities:
        // 0: Again, 1: Hard, 2: Good, 3: Easy
        // Map our 0-3 to standard SM-2 (0-5)
        int sm2Quality = switch (quality) {
            case 0 -> 0; // Blackout
            case 1 -> 3; // Hard
            case 2 -> 4; // Good
            case 3 -> 5; // Easy
            default -> 0;
        };

        if (sm2Quality < 3) {
            progress.setRepetitions(0);
            progress.setIntervalDays(1);
        } else {
            if (progress.getRepetitions() == 0) {
                progress.setIntervalDays(1);
            } else if (progress.getRepetitions() == 1) {
                progress.setIntervalDays(6);
            } else {
                progress.setIntervalDays((int) Math.round(progress.getIntervalDays() * progress.getEaseFactor()));
            }
            progress.setRepetitions(progress.getRepetitions() + 1);
        }

        double easeFactor = progress.getEaseFactor() + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }
        progress.setEaseFactor(easeFactor);

        progress.setNextReview(LocalDateTime.now().plusDays(progress.getIntervalDays()));
    }
}
