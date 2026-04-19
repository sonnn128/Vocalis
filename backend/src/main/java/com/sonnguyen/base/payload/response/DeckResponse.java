package com.sonnguyen.base.payload.response;

import com.sonnguyen.base.model.Deck;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DeckResponse {

    private String id;
    private String title;
    private String description;
    private boolean isPublic;
    private String ownerId;
    private String ownerName;
    private int cardCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DeckResponse fromDeck(Deck deck) {
        return DeckResponse.builder()
                .id(deck.getId())
                .title(deck.getTitle())
                .description(deck.getDescription())
                .isPublic(deck.isPublic())
                .ownerId(deck.getUser() != null ? deck.getUser().getId() : null)
                .ownerName(deck.getUser() != null ? deck.getUser().getFullName() : null)
                .cardCount(deck.getFlashcards() != null ? deck.getFlashcards().size() : 0)
                .createdAt(deck.getCreatedAt())
                .updatedAt(deck.getUpdatedAt())
                .build();
    }
}
