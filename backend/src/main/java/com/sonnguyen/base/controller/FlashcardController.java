package com.sonnguyen.base.controller;

import com.sonnguyen.base.payload.request.CreateFlashcardRequest;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.payload.response.FlashcardResponse;
import com.sonnguyen.base.service.FlashcardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    /** GET /api/v1/decks/{deckId}/flashcards — list all cards in a deck */
    @GetMapping("/api/v1/decks/{deckId}/flashcards")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> getFlashcards(@PathVariable String deckId) {
        return ResponseEntity.ok(ApiResponse.<List<FlashcardResponse>>builder()
                .success(true)
                .message("Success")
                .data(flashcardService.getFlashcardsByDeck(deckId))
                .build());
    }

    /** POST /api/v1/decks/{deckId}/flashcards — add a new card to a deck */
    @PostMapping("/api/v1/decks/{deckId}/flashcards")
    public ResponseEntity<ApiResponse<FlashcardResponse>> createFlashcard(
            @PathVariable String deckId,
            @Valid @RequestBody CreateFlashcardRequest request) {

        FlashcardResponse created = flashcardService.createFlashcard(deckId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<FlashcardResponse>builder()
                .success(true)
                .message("Flashcard created successfully")
                .data(created)
                .build());
    }

    /** PUT /api/v1/flashcards/{cardId} — update a flashcard */
    @PutMapping("/api/v1/flashcards/{cardId}")
    public ResponseEntity<ApiResponse<FlashcardResponse>> updateFlashcard(
            @PathVariable String cardId,
            @Valid @RequestBody CreateFlashcardRequest request) {

        return ResponseEntity.ok(ApiResponse.<FlashcardResponse>builder()
                .success(true)
                .message("Flashcard updated successfully")
                .data(flashcardService.updateFlashcard(cardId, request))
                .build());
    }

    /** DELETE /api/v1/flashcards/{cardId} — delete a flashcard */
    @DeleteMapping("/api/v1/flashcards/{cardId}")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcard(@PathVariable String cardId) {
        flashcardService.deleteFlashcard(cardId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Flashcard deleted successfully")
                .build());
    }
}
