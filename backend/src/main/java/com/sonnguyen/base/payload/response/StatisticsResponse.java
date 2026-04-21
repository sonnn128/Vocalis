package com.sonnguyen.base.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private long totalDecks;
    private long totalCards;
    private long newCards;
    private long learningCards;
    private long masteredCards;
}
