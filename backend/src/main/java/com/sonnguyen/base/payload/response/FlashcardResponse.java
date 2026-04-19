package com.sonnguyen.base.payload.response;

import com.sonnguyen.base.model.Flashcard;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FlashcardResponse {

    private String id;
    private String deckId;
    private String frontText;
    private String backText;
    private String pronunciation;
    private String example;
    private String partOfSpeech;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FlashcardResponse fromFlashcard(Flashcard card) {
        return FlashcardResponse.builder()
                .id(card.getId())
                .deckId(card.getDeck() != null ? card.getDeck().getId() : null)
                .frontText(card.getFrontText())
                .backText(card.getBackText())
                .pronunciation(card.getPronunciation())
                .example(card.getExample())
                .partOfSpeech(card.getPartOfSpeech())
                .createdAt(card.getCreatedAt())
                .updatedAt(card.getUpdatedAt())
                .build();
    }
}
