package com.sonnguyen.base.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateFlashcardRequest {

    @NotBlank(message = "Front text is required")
    @Size(max = 255, message = "Front text must not exceed 255 characters")
    private String frontText;

    @NotBlank(message = "Back text is required")
    private String backText;

    @Size(max = 255)
    private String pronunciation;

    private String example;

    @Size(max = 50)
    private String partOfSpeech;
}
