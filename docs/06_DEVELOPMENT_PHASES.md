# � Vocalis - Development Phases

## Tổng quan các giai đoạn

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT ROADMAP  (VOCALIS)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PHASE 0          PHASE 1           PHASE 2          PHASE 3/4         │
│  [Setup]          [Auth & Core]     [Study Mode]     [Quizzes & Polish]│
│                                                                         │
│  ┌─────┐          ┌─────────┐       ┌──────────┐     ┌───────────┐     │
│  │ 1w  │────────▶ │  2-3w   │─────▶ │  2-3w    │───▶ │  Ongoing  │     │
│  └─────┘          └─────────┘       └──────────┘     └───────────┘     │
│                                                                         │
│  - Project setup  - Auth/JWT        - Flip Cards     - Quizzes UI      │
│  - DB setup       - User Mgmt       - SRS Algo       - Charts/Stats    │
│  - Boilerplate    - Decks CRUD      - Due filters    - Social Sharing  │
│                   - Cards CRUD      - Progress logic - Audio/TTS       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Trạng thái triển khai hiện tại (Update)

- [x] Phase 1 (Auth + Deck/Flashcard CRUD): Đã có luồng chính hoạt động end-to-end.
- [x] Phase 2 (Study + SRS): Đã có due queue, review API, study statistics.
- [ ] Phase 3 (Quizzes & Analytics): Đã có Quiz page + Quiz hub + lưu lịch sử session ở FE, cần thêm analytics charts nâng cao.

## Phase 0: Project Setup (1 tuần)

### Mục tiêu
Thiết lập nền móng dự án, CI/CD cơ bản và cấu trúc thư mục từ đầu.

### Tasks

#### 0.1. Backend Setup
| Task | Priority | Estimated |
|------|----------|-----------|
| Khởi tạo Spring Boot project (Web, JPA, Security, PostgreSQL) | P0 | 2h |
| Cấu hình database credentials & application.yml | P0 | 1h |
| Xây dựng BaseResponse & GlobalExceptionHandler | P0 | 2h |
| Setup JWT Utility classes | P0 | 2h |
| Cấu hình CORS cho React Frontend | P0 | 1h |
| Setup Swagger/OpenAPI | P1 | 1h |

#### 0.2. Frontend Setup
| Task | Priority | Estimated |
|------|----------|-----------|
| Khởi tạo React/Vite project | P0 | 1h |
| Cài đặt Tailwind CSS / Router / Axios | P0 | 1h |
| Setup folder structure (components, pages, services, contexts) | P0 | 1h |
| Cấu hình tĩnh Axios (baseURL, interceptors cơ bản) | P0 | 2h |
| Basic Layout UI (Navbar, Sidebar tĩnh) | P1 | 3h |

#### 0.3. Environment & Tools
| Task | Priority | Estimated |
|------|----------|-----------|
| Tạo `compose.yml` cho DB | P0 | 1h |
| Viết README.md hướng dẫn setup local | P0 | 1h |

### Deliverables
- [x] Backend chạy được và kết nối được Database.
- [ ] Giao diện lỗi (`/swagger-ui/index.html`) hoạt động trơn tru.
- [x] Frontend chạy được và render được Layout Header/Sidebar.

---

## Phase 1: Authentication & Content Management (2-3 tuần)

### Mục tiêu
Cốt lõi MVP: Người dùng có thể đăng nhập, tạo, sửa, xóa các bộ từ vựng và thẻ từ.

### Sprint 1.1: Authentication
| Task | Priority | Estimated |
|------|----------|-----------|
| [BE] Entities `User`, `UserRole` + Security Config | P0 | 3h |
| [BE] API `/api/v1/auth/register` & `/api/v1/auth/login` | P0 | 4h |
| [BE] API `/api/v1/auth/me` để lấy account info | P0 | 2h |
| [FE] Giao diện RegisterPage & LoginPage | P0 | 4h |
| [FE] AuthContext lưu info, Axios Token Interceptor | P0 | 3h |
| [FE] Protected Route hạn chế truy cập | P0 | 2h |

#### Deliverables
- [x] Đăng ký, đăng nhập lấy JWT thành công.
- [x] Truy cập URL cần Auth bị văng ra Login nếu chưa login.

### Sprint 1.2: Deck & Flashcard CRUD
| Task | Priority | Estimated |
|------|----------|-----------|
| [BE] Entities `Deck`, `Flashcard` + Repository | P0 | 4h |
| [BE] Rest APIs CRUD cho `Decks` (Check quyền Owner) | P0 | 4h |
| [BE] Rest APIs CRUD cho `Flashcards` | P0 | 4h |
| [FE] Dashboard Page show danh sách Decks (Grid/List) | P0 | 6h |
| [FE] Form (Modal) Create/Edit Deck | P0 | 3h |
| [FE] Deck Detail Page & bảng chứa danh sách Flashcard | P0 | 6h |
| [FE] Form Create/Edit Flashcard | P0 | 4h |

#### Deliverables
- [x] User tự thao tác vòng đời đầy đủ của Deck & Flashcard của họ.
- [ ] Validate đầu vào chính xác cả backend (JPA, @Valid) lẫn Frontend.

---

## Phase 2: Study Mode & Spaced Repetition (2-3 tuần)

### Mục tiêu
Tính năng học tập chính (Lật thẻ) và lưu vết tiến độ.

### Sprint 2.1: Study Mode UI
| Task | Priority | Estimated |
|------|----------|-----------|
| [FE] UI thành phần: `FlashcardItem` hiệu ứng CSS lật 3D | P0 | 4h |
| [FE] Study/Review Interface hiển thị 1 thẻ chính giữa màn hình | P0 | 4h |
| [FE] Các nút Action: Lật thẻ, Khó (Hard), Bình thường (Good), Dễ (Easy) | P0 | 3h |

### Sprint 2.2: Tracking Progress & SRS Logic
| Task | Priority | Estimated |
|------|----------|-----------|
| [BE] Entity `UserProgress` lưu trữ interval và next_review | P0 | 3h |
| [BE] Logic API `/api/v1/study/review`: Tính ngày học (SM-2 basic) | P0 | 6h |
| [BE] API `/api/v1/study/due`: Lấy danh sách thẻ tới hạn hôm nay | P0 | 4h |
| [FE] Tích hợp call API lúc user bấm các nút Hành động (Hard/Easy) | P0 | 4h |
| [FE] Lọc danh sách thẻ cho Study Mode từ list DUE | P0 | 3h |

#### Deliverables
- [x] Lật thẻ CSS mượt mà.
- [x] Ôn tập theo khoảng thời gian thực tế tính toán bằng thuật toán.
- [x] Mỗi ngày hệ thống chỉ query ra các từ "tới hạn".

---

## Phase 3: Quizzes & Analytics (1-2 tuần)

### Mục tiêu
Tạo động lực học tập bằng gamification và biểu đồ thống kê.

### Tasks
| Task | Priority | Estimated |
|------|----------|-----------|
| [BE] API Sinh random câu hỏi trắc nghiệm từ Deck | P1 | 6h |
| [FE] UI làm bài đánh giá (Quiz), chấm điểm, lưu session history local | P1 | 6h |
| [BE] API Thống kê số thẻ mới, đang học, đã thuộc | P1 | 4h |
| [FE] UI hiển thị Biểu đồ (Charts) ở màn hình Statistics + gamification cơ bản | P1 | 4h |

#### Deliverables
- [x] Tính năng Quiz random hoạt động.
- [x] Biểu đồ thể hiện trực quan quá trình học.

### Ghi chú mở rộng (đã triển khai)
- [x] Quiz report sau khi nộp bài (danh sách đúng/sai theo câu).
- [x] Gamification foundation (points + streak + session counters) ở frontend local storage.

---

## Phase 4: Public Sharing & Enhancement (Tương lai)

### Mục tiêu
Mở rộng chức năng cộng đồng và tiện ích người dùng. Không nằm trong cốt lõi MVP.

### Tasks
| Task | Priority |
|------|----------|
| [BE & FE] Tìm kiếm Decks có cờ `is_public` | P2 |
| [BE & FE] Chức năng Clone Deck public về thư viện của User | P2 |
| [FE] Tích hợp Browser SpeechSynthesis API (Text-to-Speech) đọc thẻ | P2 |
| [BE] Thêm API Upload Avatar / Hình ảnh vào Deck/Flashcard | P2 |
| [FE] Giao diện Reponsive tối ưu 100% Mobile (Bottom navigation) | P2 |

---

## Development Guidelines

### Priority Levels
| Level | Meaning |
|-------|---------|
| P0 | Must have - Bắt buộc để ra mắt (MVP) |
| P1 | Should have - Cải thiện trải nghiệm tốt hơn |
| P2 | Nice to have - Chỉ làm khi có dư dả plan và thời gian |

### Code Review Checklist
- [ ] Code tuân thủ theo `07_CODING_CONVENTIONS.md`.
- [ ] Logic Authentication / Authorization được áp dụng chặt chẽ ở các Layer.
- [ ] Các API đều bắt lỗi tốt, trả về format BaseResponse có tính thống nhất.
- [ ] Tính thẩm mĩ Frontend gọn gàng, chia Component hợp lý, không viết dồn đống ở File Page.
