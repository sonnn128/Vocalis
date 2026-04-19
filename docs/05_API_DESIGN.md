# 📡 Vocalis - API Design

Tài liệu này mô tả thiết kế các API RESTful cung cấp bởi Backend Spring Boot.
Mọi API trả về cần được gói trong một `BaseResponse` chuẩn theo thiết kế `07_CODING_CONVENTIONS.md`.

---

## 1. Nguyên tắc thiết kế (Design Principles)

- **Domain/Resource Oriented**: Sử dụng danh từ số nhiều cho endpoints (`/api/v1/users`, `/api/v1/decks`).
- **HTTP Methods chuẩn**:
  - `GET`: Lấy thông tin (Read).
  - `POST`: Tạo mới tài nguyên hoặc gọi hành động đặc thù (Create / Action).
  - `PUT`: Cập nhật toàn bộ tài nguyên (Update).
  - `PATCH`: Cập nhật 1 phần tài nguyên (Partial Update).
  - `DELETE`: Xóa tài nguyên (Delete).
- **Authentication**: Tất cả endpoint API (ngoại trừ login/register/public) đều yêu cầu Header: `Authorization: Bearer <jwt_token>`.

---

## 2. Các Endpoints API Chính

### 2.1. Authentication (Ngoại trừ Token)

| Endpoint | Method | Quyền | Mô tả |
|----------|--------|-------|-------|
| `/api/v1/auth/login` | `POST` | `PUBLIC` | Đăng nhập tài khoản bằng Email & Password. Trả về JWT Token. |
| `/api/v1/auth/register` | `POST` | `PUBLIC` | Đăng ký tài khoản mới. |
| `/api/v1/auth/me` | `GET` | `USER, ADMIN` | Lấy profile user hiện tại. Cần JWT Token. |

### 2.2. Decks (Quản lý Bộ từ vựng)

| Endpoint | Method | Quyền | Mô tả |
|----------|--------|-------|-------|
| `/api/v1/decks` | `GET` | `USER, ADMIN` | Lấy danh sách Decks của User hiện tại (Hỗ trợ phân trang). |
| `/api/v1/decks/public` | `GET` | `PUBLIC, USER` | Lấy danh sách các Decks có flag `is_public=true`. |
| `/api/v1/decks/{deckId}` | `GET` | `USER, ADMIN` | Lấy chi tiết một bộ Deck (bao gồm metadata). Cần kiểm tra quyền xem nếu là private. |
| `/api/v1/decks` | `POST` | `USER, ADMIN` | Tạo mới một Deck cá nhân. |
| `/api/v1/decks/{deckId}` | `PUT` | `Ower` (User sở hữu) | Cập nhật thông tin tiêu đề, mô tả của Deck. |
| `/api/v1/decks/{deckId}` | `DELETE` | `Owner` (User sở hữu) | Xóa Deck và toàn bộ Flashcards bên trong (Cascade Delete). |

### 2.3. Flashcards (Quản lý các Thẻ từ)

Việc quản lý thẻ từ liên kết chặt chẽ với một ID cụ thể của Deck.

| Endpoint | Method | Quyền | Mô tả |
|----------|--------|-------|-------|
| `/api/v1/decks/{deckId}/flashcards` | `GET` | `USER, ADMIN` (Cần quyền) | Lấy toàn bộ Flashcards trong 1 bộ Deck để User review hoặc Edit. |
| `/api/v1/decks/{deckId}/flashcards` | `POST` | `Owner` | Thêm thẻ từ mới vào Deck. Bao gồm (Word, Meaning, IPA...). |
| `/api/v1/flashcards/{cardId}` | `PUT` | `Owner` | Cập nhật một thẻ từ vựng với id cụ thể. |
| `/api/v1/flashcards/{cardId}` | `DELETE` | `Owner` | Xóa vĩnh viễn thẻ từ vựng. |

### 2.4. Study & Progress (Tiến độ Học & Spaced Repetition)

| Endpoint | Method | Quyền | Mô tả |
|----------|--------|-------|-------|
| `/api/v1/study/due` | `GET` | `USER` | Lấy danh sách Flashcard cần được ôn tập lại *trong ngày hôm nay* (next_review_at <= today). |
| `/api/v1/study/review` | `POST` | `USER` | Submit kết quả tự đánh giá thẻ từ (VD: 1=Khó, 2=Trung bình, 3=Dễ) cho 1 thẻ từ. Server sẽ tính toán lưu lại ngày tiếp theo cần ôn (SRP). |
| `/api/v1/study/progress` | `GET` | `USER` | Lấy thống kê/báo cáo về quá trình học (Số từ mastered, số từ new...). |

---

## 3. Cấu trúc Response & Request DTOs

### 3.1. Standard Response Body

```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "content": [],
    "totalElements": 100,
    "totalPages": 5
  }
}
```

### 3.2. Error Response Body
Mọi lỗi ở Controller hay nghiệp vụ (Service) đều ném Exception tương ứng. `GlobalExceptionHandler` bắt và đưa về JSON chuẩn này.

```json
{
  "success": false,
  "message": "Deck với ID d90b3... không tồn tại",
  "data": null,
  "error": "RESOURCE_NOT_FOUND" 
}
```

### 3.3. DTO Sample: `CreateFlashcardRequest`
Body để tạo thẻ từ trong Controller:

```json
{
  "front_text": "Apple",
  "back_text": "Quả táo",
  "pronunciation": "/ˈæp.əl/",
  "part_of_speech": "Noun",
  "example": "He eats an apple."
}
```
