# Agent Guidelines

Tài liệu này định hướng cho các AI Agent (trợ lý lập trình) khi tham gia phát triển dự án.

## 1. Nguyên tắc chung
- Luôn kiểm tra kỹ ngữ cảnh (context) trước khi đưa ra code.
- Ưu tiên sử dụng lại các hàm, service, component đã có sẵn thay vì tạo mới.
- Tuân thủ nghiêm ngặt `CODING_CONVENTIONS.md` và `ARCHITECTURE.md`.
- Sử dụng tiếng Việt chuẩn để giải thích và comment nếu cần thiết cho developer, nhưng tên biến và commit messsage nên dùng tiếng Anh.

## 2. Các bước triển khai tính năng mới
- B1: Phân tích Backend (Entity -> Repository -> Service -> Controller).
- B2: Cập nhật cấu trúc API vào `API_DESIGN.md` nếu có thay đổi.
- B3: Cập nhật Frontend (Tạo API Service -> Context (nếu cần) -> Component/Page).
- B4: Phối hợp kiểm tra qua log hoặc terminal trước khi hoàn thành task.

## 3. Khắc phục lỗi (Debugging)
- Phân tích log lỗi chi tiết.
- Không tự ý xóa code hiện hành nếu không rõ luồng.
- Luôn chỉ ra nguyên nhân gốc rễ và đề xuất giải pháp có tỷ lệ thành công cao nhất.
