# 📋 Vocalis - Tổng quan dự án

## 1. Giới thiệu

**Vocalis** là một ứng dụng web học tiếng Anh theo phương pháp Active Recall và Spaced Repetition thông qua hệ thống Flashcard, cho phép:
- Người dùng tự do thêm, sửa, quản lý thư viện từ vựng (Decks/Flashcards)
- Cung cấp chế độ học lật thẻ, kiểm tra trắc nghiệm
- Ghi nhận tiến độ học tập và theo dõi sự phát triển mỗi ngày

## 2. Mục tiêu chính

| Mục tiêu | Mô tả |
|----------|-------|
| **Cá nhân hóa** | Mỗi người có một thư viện từ riêng rẽ, không đụng chạm dữ liệu nhau |
| **Ghi nhớ lâu** | Tích hợp thuật toán lặp lại ngắt quãng (Spaced Repetition) |
| **Mở rộng** | Dễ dàng áp dụng để học ngôn ngữ khác hoặc môn học khác (lịch sử, địa lý) |
| **Chia sẻ** | Người học có thể public bộ từ vựng cá nhân để người khác cùng dùng |

## 3. Đối tượng người dùng

### 3.1. Admin
- Quản lý toàn bộ hệ thống
- Có quyền duyệt / xóa các thẻ bài vi phạm hoặc các bộ từ public
- Xem các thống kê về người dùng

### 3.2. User (Người dùng cuối)
- Đăng ký, đăng nhập hệ thống
- Quản lý kho Flashcard cá nhân, có quyền share / private
- Tương tác học tập, lật thẻ, làm bài test

## 4. Phạm vi dự án

### 4.1. Trong phạm vi (In Scope)
- ✅ Quản lý người dùng (Authentication & JWT).
- ✅ Quản lý kho Deck, phân tách quyền riêng tư (Public/Private).
- ✅ Quản lý Flashcard, hỗ trợ đầy đủ các trường (Tên từ, nghĩa, phát âm, ví dụ).
- ✅ Chế độ Study Mode cơ bản (Lật thẻ - Flip cards).
- ✅ Quiz hệ thống tạo bài kiểm tra từ bộ từ vựng.
- ✅ Báo cáo, xem tiến trình học theo biểu đồ.

### 4.2. Ngoài phạm vi MVP (Out of Scope - Tương lai)
- ❌ Tích hợp AI tạo hình ảnh/định nghĩa tự động.
- ❌ Text-to-Speech cao cấp / Nhận diện giọng nói.
- ❌ Thi đấu, so kè điểm số giữa những người chơi (Leaderboard thời gian thực).
- ❌ Ứng dụng điện thoại Native (React Native, Flutter).

## 5. Ràng buộc và giả định

### 5.1. Ràng buộc
- Sử dụng Backend Java (Spring Boot) và Frontend JS (ReactJS/Vite).
- Sử dụng cơ sở dữ liệu quan hệ (Relational DB - MySQL/PostgreSQL).

### 5.2. Deployment Options
| Option | Mô tả |
|--------|-------|
| **Docker Compose** | Cả DB, Backend và Frontend đều chạy bằng docker-compose |
| **Cloud Hosting** | Triển khai Frontend lên Vercel/Netlify, Backend lên VPS/Render |

## 6. Định nghĩa thuật ngữ

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| **Deck** | Bộ từ vựng, chứa một tập hợp các thẻ (Cards) thuộc cùng một chủ đề (VD: TOEIC 600) |
| **Flashcard (Card)** | Thẻ từ vựng có 2 mặt (Front chứa từ vựng, Back chứa giải nghĩa) |
| **Public / Private** | Chế độ hiển thị. Public cho phép người khác xem, Private chỉ cá nhân thấy |
| **Study Mode** | Chế độ học. Thay vì chỉ xem danh sách, người học sẽ tương tác duyệt qua các thẻ |
| **Spaced Repetition** | Thuật toán lặp lại ngắt quãng để tối ưu đưa từ quay lại đúng lúc |

## 7. Cấu trúc mã nguồn mức cao (High-level folder structure)

- `backend/`: Chứa mã nguồn Spring Boot cung cấp RESTful APIs.
- `frontend/`: Chứa mã nguồn ReactJS + Vite cung cấp giao diện người dùng.
- `docs/`: Chứa toàn bộ tài liệu kỹ thuật và thiết kế dự án.

## 8. Tài liệu liên quan

- [Yêu cầu nghiệp vụ](./00_BUSINESS_REQUIREMENTS.md)
- [Kiến trúc hệ thống](./02_ARCHITECTURE.md)
- [Tech Stack](./03_TECH_STACK.md)
- [Database Schema](./04_DATABASE_SCHEMA.md)
- [API Design](./05_API_DESIGN.md)
- [Giai đoạn phát triển](./06_DEVELOPMENT_PHASES.md)
- [Coding Conventions](./07_CODING_CONVENTIONS.md)
- [Hướng dẫn Agent](./08_AGENT_GUIDELINES.md)