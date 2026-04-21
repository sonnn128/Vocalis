package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    Optional<UserProgress> findByUserIdAndFlashcardId(String userId, String flashcardId);

    List<UserProgress> findByUserIdAndNextReviewBefore(String userId, LocalDateTime date);

    List<UserProgress> findByUserIdAndFlashcard_Deck_IdAndNextReviewBefore(String userId, String deckId, LocalDateTime date);
    
    @Query("SELECT f FROM UserProgress up JOIN up.flashcard f WHERE up.user.id = :userId AND f.deck.id = :deckId AND up.nextReview <= :date")
    List<UserProgress> findDueCards(@Param("userId") String userId, @Param("deckId") String deckId, @Param("date") LocalDateTime date);
    
    List<UserProgress> findByUserId(String userId);
}
