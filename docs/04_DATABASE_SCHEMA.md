# Database Schema

Dự kiến sơ đồ cơ sở dữ liệu cho tính năng học tiếng Anh (Flashcard):

## Bảng `users`
- `id` (PK)
- `username`
- `email`
- `password`
- `role`

## Bảng `decks` (Bộ từ vựng)
- `id` (PK)
- `user_id` (FK -> users.id)
- `title` (Tên bộ từ)
- `description`
- `created_at`
- `updated_at`

## Bảng `flashcards` (Thẻ từ)
- `id` (PK)
- `deck_id` (FK -> decks.id)
- `front_text` (Từ vựng)
- `back_text` (Nghĩa)
- `pronunciation` (Phiên âm)
- `example` (Câu ví dụ)
- `created_at`

## Bảng `user_progress` (Tiến độ học)
- `id` (PK)
- `user_id` (FK -> users.id)
- `flashcard_id` (FK -> flashcards.id)
- `status` (Enum: NEW, LEARNING, REVIEW, MASTERED)
- `last_reviewed_at` (Lần cuối ôn tập)
- `next_review_at` (Lần ôn tập tiếp theo - Dùng cho Spaced Repetition)
