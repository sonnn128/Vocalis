# Coding Conventions

## 1. Naming Conventions (Quy tắc đặt tên)
- **Frontend (React, JS):**
  - Tên File/Component: `PascalCase` (vd: `FlashcardItem.jsx`, `StudyMode.jsx`).
  - Hàm, biến: `camelCase` (vd: `handleFlipCard`, `deckList`).
  - Hằng số: `UPPER_SNAKE_CASE` (vd: `MAX_CARDS_PER_DAY`).
  
- **Backend (Java, Spring Boot):**
  - Tên Class, Interface: `PascalCase` (vd: `DeckService`, `FlashcardController`).
  - Tên method, properties: `camelCase` (vd: `getDeckById`, `frontText`).
  - Tên package: `lowercase` (vd: `com.sonnguyen.base.controller`).

## 2. API Format (Chuẩn trả về)
Mọi API trả về nên được wrap trong một cấu trúc chuẩn (BaseResponse):
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

## 3. Git Workflow
- Nhánh chính: `main` hoặc `master`.
- Nhánh phát triển: `dev`.
- Các tính năng mới tạo nhánh từ `dev`: `feature/ten-tinh-nang`.
