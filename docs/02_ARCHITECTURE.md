# Architecture

## 1. Tổng quan kiến trúc
Dự án được triển khai theo mô hình Client-Server chuyên biệt:
- **Client (Frontend):** Ứng dụng Single Page Application (SPA) xây dựng bằng React. Giao tiếp với server qua REST API.
- **Server (Backend):** Ứng dụng Spring Boot cung cấp các RESTful endpoints.
- **Database:** Cơ sở dữ liệu quan hệ (Relational Database) để lưu trữ thông tin hệ thống.

## 2. Luồng dữ liệu (Data Flow)
1. User thao tác trên trình duyệt (React Frontend).
2. Frontend gửi HTTP Request (kèm JWT token nếu gọi API cần xác thực) lên Backend Spring Boot.
3. Controller trong Backend tiếp nhận, gọi Service xử lý business logic.
4. Service gọi Repository để thao tác với Database.
5. Kết quả được trả về dưới dạng JSON cho Frontend hiển thị.
