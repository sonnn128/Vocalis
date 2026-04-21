package com.sonnguyen.base.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull
    private String flashcardId;

    @NotNull
    @Min(0)
    @Max(3) // 0: Again, 1: Hard, 2: Good, 3: Easy
    private Integer quality;
}
