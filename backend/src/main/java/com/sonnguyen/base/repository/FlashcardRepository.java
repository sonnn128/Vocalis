package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, String> {

    List<Flashcard> findByDeckId(String deckId);

    List<Flashcard> findByDeckIdAndIdNotIn(String deckId, List<String> ids);

    long countByDeck_User_Id(String userId);
}
