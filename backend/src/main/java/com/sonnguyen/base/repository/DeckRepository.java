package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Deck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeckRepository extends JpaRepository<Deck, String> {

    Page<Deck> findByUserId(String userId, Pageable pageable);

    Page<Deck> findByIsPublicTrue(Pageable pageable);
}
