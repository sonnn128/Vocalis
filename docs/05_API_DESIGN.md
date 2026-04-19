# API Design

## 1. Authentication
- `POST /api/auth/login`: Đăng nhập, trả về JWT Token.
- `POST /api/auth/register`: Đăng ký tài khoản mới.

## 2. Decks (Bộ từ vựng)
- `GET /api/decks`: Lấy danh sách Deck của user hiện tại.
- `GET /api/decks/{deckId}`: Lấy chi tiết Deck.
- `POST /api/decks`: Tạo Deck mới.
- `PUT /api/decks/{deckId}`: Cập nhật thông tin Deck.
- `DELETE /api/decks/{deckId}`: Xóa Deck.

## 3. Flashcards (Thẻ từ vựng)
- `GET /api/decks/{deckId}/flashcards`: Lấy tất cả Flashcards trong 1 Deck.
- `POST /api/decks/{deckId}/flashcards`: Thêm thẻ mới.
- `PUT /api/flashcards/{cardId}`: Sửa thẻ.
- `DELETE /api/flashcards/{cardId}`: Xóa thẻ.

## 4. Study / Progress
- `POST /api/study/review`: Gửi kết quả ôn tập (quên/nhớ) của 1 thẻ lên server để cập nhật tiến độ (Spaced Repetition).
- `GET /api/study/due`: Lấy danh sách các thẻ cần ôn tập hôm nay.
