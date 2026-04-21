package com.sonnguyen.base.controller;

import com.sonnguyen.base.payload.request.ReviewRequest;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.payload.response.FlashcardResponse;
import com.sonnguyen.base.service.StudyService;
import com.sonnguyen.base.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;

    @GetMapping("/due")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> getDueCards(@RequestParam(required = false) String deckId) {
        String userId = SecurityUtils.getCurrentUser().getId();
        List<FlashcardResponse> result = studyService.getDueFlashcards(userId, deckId);
        
        ApiResponse<List<FlashcardResponse>> response = ApiResponse.<List<FlashcardResponse>>builder()
                .success(true)
                .message("Thành công")
                .data(result)
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PostMapping("/review")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> reviewCard(@Valid @RequestBody ReviewRequest request) {
        String userId = SecurityUtils.getCurrentUser().getId();
        studyService.reviewFlashcard(userId, request);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Review recorded successfully")
                .data(null)
                .build();
                
        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<com.sonnguyen.base.payload.response.StatisticsResponse>> getStatistics() {
        String userId = SecurityUtils.getCurrentUser().getId();
        com.sonnguyen.base.payload.response.StatisticsResponse stats = studyService.getStatistics(userId);
        
        return ResponseEntity.ok(ApiResponse.<com.sonnguyen.base.payload.response.StatisticsResponse>builder()
                .success(true)
                .message("Lấy thống kê thành công")
                .data(stats)
                .build());
    }

    @GetMapping("/quiz/{deckId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> getQuizCards(
            @PathVariable String deckId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<FlashcardResponse> quizCards = studyService.getQuizCards(deckId, limit);
        return ResponseEntity.ok(ApiResponse.<List<FlashcardResponse>>builder()
                .success(true)
                .message("Lấy câu hỏi thành công")
                .data(quizCards)
                .build());
    }
}
