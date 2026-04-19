package com.sonnguyen.base.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "flashcards")
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    @Column(name = "front_text", nullable = false, length = 255)
    private String frontText;

    @Column(name = "back_text", nullable = false, columnDefinition = "TEXT")
    private String backText;

    @Column(length = 255)
    private String pronunciation;

    @Column(columnDefinition = "TEXT")
    private String example;

    @Column(name = "part_of_speech", length = 50)
    private String partOfSpeech;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
