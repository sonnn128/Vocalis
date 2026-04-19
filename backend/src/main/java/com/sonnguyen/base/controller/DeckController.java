package com.sonnguyen.base.controller;

import com.sonnguyen.base.payload.request.CreateDeckRequest;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.payload.response.DeckResponse;
import com.sonnguyen.base.service.DeckService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/decks")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;

    /** GET /api/v1/decks — get paginated list of current user's decks */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<DeckResponse>>> getMyDecks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.<Page<DeckResponse>>builder()
                .success(true)
                .message("Success")
                .data(deckService.getMyDecks(pageable))
                .build());
    }

    /** GET /api/v1/decks/public — get paginated public decks */
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Page<DeckResponse>>> getPublicDecks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.<Page<DeckResponse>>builder()
                .success(true)
                .message("Success")
                .data(deckService.getPublicDecks(pageable))
                .build());
    }

    /** GET /api/v1/decks/{deckId} — get one deck detail */
    @GetMapping("/{deckId}")
    public ResponseEntity<ApiResponse<DeckResponse>> getDeck(@PathVariable String deckId) {
        return ResponseEntity.ok(ApiResponse.<DeckResponse>builder()
                .success(true)
                .message("Success")
                .data(deckService.getDeckById(deckId))
                .build());
    }

    /** POST /api/v1/decks — create a new deck */
    @PostMapping
    public ResponseEntity<ApiResponse<DeckResponse>> createDeck(@Valid @RequestBody CreateDeckRequest request) {
        DeckResponse created = deckService.createDeck(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<DeckResponse>builder()
                .success(true)
                .message("Deck created successfully")
                .data(created)
                .build());
    }

    /** PUT /api/v1/decks/{deckId} — update a deck (owner only) */
    @PutMapping("/{deckId}")
    public ResponseEntity<ApiResponse<DeckResponse>> updateDeck(
            @PathVariable String deckId,
            @Valid @RequestBody CreateDeckRequest request) {

        return ResponseEntity.ok(ApiResponse.<DeckResponse>builder()
                .success(true)
                .message("Deck updated successfully")
                .data(deckService.updateDeck(deckId, request))
                .build());
    }

    /** DELETE /api/v1/decks/{deckId} — delete a deck (owner only) */
    @DeleteMapping("/{deckId}")
    public ResponseEntity<ApiResponse<Void>> deleteDeck(@PathVariable String deckId) {
        deckService.deleteDeck(deckId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Deck deleted successfully")
                .build());
    }
}
