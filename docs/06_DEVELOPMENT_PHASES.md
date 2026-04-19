# 📈 Vocalis - Development Phases

Quá trình phát triển dự án được chia làm nhiều **Phase** (Giai đoạn) với thứ tự ưu tiên rõ ràng. Agent và Developer **PHẢI** tuân thủ thứ tự này, không nhảy cóc sang tính năng của Phase sau khi Phase trước chưa hoàn thiện.

---

## 🚀 Phase 0: System Setup & Architecture
**Mục tiêu:** Thiết lập nền móng dự án, CI/CD cơ bản và cấu trúc thư mục.

1. Khởi tạo Spring Boot Backend (Cấu hình Security, Exception Handler, Base Response).
2. Khởi tạo React/Vite Frontend (Cấu hình Axios baseURL, Router cơ bản).
3. Thiết lập Database (PostgreSQL/MySQL) và kiểm tra kết nối CSDL thành công.
4. Cấu hình Docker & Docker Compose để run cả cụm phục vụ quá trình test.

---

## 🔐 Phase 1: Authentication & User Management (Core MVP)
**Mục tiêu:** Người dùng có thể đăng ký, đăng nhập và hệ thống nhận diện được user qua JWT. **Ưu tiên cao nhất**.

1. Cấu hình Spring Security kết hợp JWT Filter ở Backend.
2. Xây dựng API `/api/v1/auth/register` và `/api/v1/auth/login`.
3. Xây dựng Frontend: Trang Đăng ký (RegisterPage), Trang Đăng nhập (LoginPage).
4. Lưu trữ JWT Token ở client (localStorage/cookies) và setup Axios Interceptor tự động đính kèm token.
5. Cập nhật Sidebar/Navbar hiển thị tên/avatar người dùng khi đã đăng nhập.

---

## 🗂️ Phase 2: Deck & Flashcard Management (CRUD)
**Mục tiêu:** Người dùng tự quản lý dữ liệu học tập cá nhân (Thêm/Sửa/Xóa bộ từ và thẻ từ).

1. Backend: Xây dựng Entity, Repository, Service và Controller cho `Decks` và `Flashcards`. Đảm bảo user chỉ sửa/xóa được Deck của chính mình.
2. Thiết kế API lấy danh sách Decks của user (`/api/v1/decks`).
3. Frontend: Giao diện lưới (Grid/List) hiển thị các Decks ở Dashboard.
4. Frontend: Giao diện tạo mới / chỉnh sửa Deck (Modal / Page).
5. Frontend: Giao diện chi tiết Deck (Deck Detail) hiển thị danh sách Flashcards bên trong dạng bảng.
6. Cung cấp form (Form validation với React Hook Form/Zod) để thêm nhanh một thẻ từ (Word, Meaning, IPA, Example) vào một Deck cụ thể.

---

## 🧠 Phase 3: Study Mode (Lật thẻ & Ôn tập)
**Mục tiêu:** Tính năng cốt lõi giúp người dùng học tập và tương tác lật thẻ.

1. Frontend: Xây dựng Component `FlashcardItem` có hiệu ứng CSS (Flip Card 3D chuyển mặt trước/sau).
2. Giao diện "Study Mode": Slider hiển thị từng thẻ một trong Deck. Người dùng nhấp để lật, sau đó đánh giá mức độ nhớ (VD: Nút "Nhớ" và nút "Quên").
3. Backend: Xây dựng bảng `user_progress` để lưu trữ trạng thái học của thẻ (`NEW`, `LEARNING`, `MASTERED`).
4. API `/api/v1/study/review`: Nhận kết quả đánh giá (Nhớ/Quên) và tính toán khoảng cách ngày lặp lại (Spaced Repetition - SRS cơ bản hoặc thuật toán tùy chỉnh).
5. Load danh sách thẻ tới hạn ôn tập (DUE) trong ngày.

---

## 📊 Phase 4: Quizzes & Progress Tracking
**Mục tiêu:** Bài kiểm tra nhỏ và báo cáo học tập tạo động lực.

1. Backend: Bổ sung API tự động random sinh ra câu hỏi trắc nghiệm (Quiz) từ danh sách Flashcard thuộc một Deck (VD: Đưa nghĩa tiếng Việt, chọn 4 đáp án tiếng Anh).
2. Frontend: Trình làm bài kiểm tra (Quiz UI), chấm điểm trực tiếp.
3. Trang Dashboard/Profile: Thống kê dạng biểu đồ (Số thẻ đã thuộc, số thẻ đang học, số ngày học liên tiếp - Streaks).

---

## 🌟 Phase 5: Enhancement & Public Sharing (Tương lai)
**Mục tiêu:** Cải tiến UX và mở rộng cộng đồng (Scope nâng cao, chỉ làm khi MVP từ Phase 1-4 ổn định).

1. Tìm kiếm (Search) bộ từ vựng Public của người khác. Tính năng Clone/Bookmark.
2. Tích hợp Audio phát âm (Text-to-Speech của trình duyệt hoặc sử dụng API Google TTS).
3. Hỗ trợ import/export danh sách từ vựng bằng file Excel/CSV.
4. Hỗ trợ hiển thị trên thiết bị di động (Responsive 100% Mobile UI) hoặc làm App (React Native).

---

> ⚠️ **Chú ý cho Agent:** Không implement các tính năng Phase 4, Phase 5 cho đến khi Phase 1, Phase 2, Phase 3 hoàn thành và chạy mượt mà. Đảm bảo Core (CRUD) luôn chạy đúng trước khi tối ưu thuật toán (SRS).
