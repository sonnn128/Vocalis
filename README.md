# Vocalis - English Learning Platform

Vocalis là một nền tảng ứng dụng web học tiếng Anh, tập trung vào phương pháp học ghi nhớ qua Flashcard. Hệ thống giúp người dùng tự tạo các bộ từ vựng, học tập qua các thẻ lật (Flashcards) và theo dõi tiến độ một cách khoa học.

## Lộ trình phát triển (Development Roadmap)

### Phase 1: Core MVP (Minimum Viable Product)
Giai đoạn này tập trung vào các tính năng cơ bản nhất để ứng dụng có thể hoạt động được.
- [ ] **Xác thực người dùng:** Đăng nhập, Đăng ký bằng JWT.
- [ ] **Quản lý hệ thống Flashcard:** 
  - [ ] Tạo, đọc, cập nhật, xóa (CRUD) các **Decks** (Bộ từ vựng).
  - [ ] Thêm, sửa, xóa các **Flashcards** (Thẻ từ) bên trong các Decks.
- [ ] **Chế độ học cơ bản (Study Mode):**
  - [ ] Giao diện lật thẻ (Flip Card) mặt trước (Từ vựng) - mặt sau (Nghĩa).
  - [ ] Các nút đánh giá đơn giản: "Đã nhớ" / "Chưa nhớ".
- [ ] **Giao diện (UI/UX):** Dashboard đơn giản cho người dùng quản lý bộ từ vựng của mình.

### Phase 2: Enhanced Learning (Nâng cao trải nghiệm học)
- [ ] **Thuật toán Spaced Repetition (Lặp lại ngắt quãng):** Tối ưu hóa chu kỳ xuất hiện của Flashcard dựa trên khả năng ghi nhớ của người dùng.
- [ ] **Theo dõi tiến độ (Progress Tracking):** 
  - [ ] Biểu đồ thống kê số từ đang học, đã thuộc.
  - [ ] Streak (Chuỗi ngày học liên tục).
- [ ] **Đa phương tiện:** Hỗ trợ phát âm thanh (Audio) và hình ảnh minh họa cho thẻ từ.

### Phase 3: Advanced Features & Community (Tính năng mở rộng & Cộng đồng)
- [ ] **Bộ từ vựng công khai (Public Decks):** Người dùng có thể chia sẻ bộ từ vựng của mình cho cộng đồng hoặc sao chép bộ từ vựng của người khác.
- [ ] **Chế độ học đa dạng:** Thêm chế độ Trắc nghiệm (Quiz), Gõ lại từ (Typing mode).
- [ ] **Gamification:** Bảng xếp hạng (Leaderboards), Hệ thống điểm thưởng/Huy hiệu khi hoàn thành mục tiêu.

### Phase 4: Optimization & Deployment (Tối ưu hóa & Triển khai)
- [ ] **Tối ưu hiệu năng:** Cải thiện tốc độ load (Lazy loading, Caching).
- [ ] **Responsive Design:** Giao diện tối ưu hoàn toàn cho thiết bị di động.
- [ ] **Triển khai (Deployment):** Thiết lập CI/CD, deploy hệ thống lên cloud (AWS / Vercel / Heroku,...).

---

## Tech Stack
- **Frontend:** ReactJS, Vite, Tailwind CSS.
- **Backend:** Java Spring Boot, Spring Security (JWT).
- **Database:** MySQL / PostgreSQL.
- **Infrastructure:** Docker.

## Cấu trúc thư mục dự án
- `backend/`: Chứa mã nguồn API (Spring Boot).
- `frontend/`: Chứa mã nguồn giao diện (React).
- `docs/`: Chứa các tài liệu thiết kế và yêu cầu kỹ thuật chi tiết của dự án.
