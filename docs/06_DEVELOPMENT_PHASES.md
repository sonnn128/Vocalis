# Development Phases

## Phase 1: Cấu hình và Xác thực (Authentication)
- Setup database, Docker.
- Hoàn thiện luồng Đăng ký, Đăng nhập (JWT).
- Phân quyền User / Admin cơ bản.

## Phase 2: Core Flashcard (CRUD)
- Backend: Tạo Entity, Repository, Controller cho Deck và Flashcard.
- Frontend: Tạo trang quản lý danh sách Deck (Grid view), tạo giao diện thêm/sửa/xóa Flashcard trong 1 Deck.

## Phase 3: Chế độ học tập (Study Mode)
- Thực hiện logic Spaced Repetition đơn giản hoặc thẻ lật (Flip Card).
- Giao diện Study Mode: Lật thẻ bằng click, có nút điều hướng "Chưa thuộc" / "Đã thuộc".
- Gọi API cập nhật tiến trình luyện tập.

## Phase 4: Thống kê và Nâng cao
- Thêm Dashboard xem tiến độ học (Số từ đã thuộc, chuỗi học liên tiếp - streaks).
- Bổ sung âm thanh (Audio) đọc từ vựng hoặc hình ảnh minh họa cho thẻ.
- Tinh chỉnh CSS/UI/UX (Responsive cho Mobile).
