# 🤖 Vocalis - Agent Guidelines

## Mục đích tài liệu

Tài liệu này hướng dẫn AI Agent (trợ lý lập trình) cách phát triển ứng dụng Vocalis - English Learning Platform một cách nhất quán, đúng yêu cầu, và không bị lạc đề.

---

## 1. Tổng quan dự án

### 1.1. Vocalis là gì?
- Ứng dụng web hỗ trợ việc học từ vựng tiếng Anh
- Sử dụng flashcards, bộ từ (decks) và các bài test nhỏ
- Cung cấp trải nghiệm học tập cá nhân hóa và theo dõi tiến độ

### 1.2. Tech Stack (KHÔNG thay đổi)

| Component | Technology |
|-----------|------------|
| Frontend | **ReactJS + Vite** |
| Backend | **Spring Boot** + Java |
| Database | **MySQL / PostgreSQL** |
| ORM | Spring Data JPA / Hibernate |
| Auth | JWT + Spring Security |
| Deployment | Docker, Nginx |

> ⚠️ **QUAN TRỌNG**: Không đề xuất thay đổi tech stack. Ưu tiên sử dụng lại các hàm, service, component đã có sẵn thay vì tạo mới.

---

## 2. Nguyên tắc phát triển

### 2.1. Đọc tài liệu trước khi code

Trước khi implement bất kỳ feature nào, PHẢI đọc các file sau nếu cần thiết để lấy context:

| File | Nội dung |
|------|----------|
| `docs/00_BUSINESS_REQUIREMENTS.md` | Yêu cầu nghiệp vụ gốc |
| `docs/01_PROJECT_OVERVIEW.md` | Tổng quan và scope dự án |
| `docs/02_ARCHITECTURE.md` | Kiến trúc hệ thống |
| `docs/03_TECH_STACK.md` | Công nghệ sử dụng |
| `docs/04_DATABASE_SCHEMA.md` | Thiết kế database |
| `docs/05_API_DESIGN.md` | Thiết kế API |
| `docs/06_DEVELOPMENT_PHASES.md` | Thứ tự ưu tiên phát triển |
| `docs/07_CODING_CONVENTIONS.md` | Quy ước code |

### 2.2. Các bước triển khai tính năng mới
- **B1**: Phân tích Backend (Entity -> Repository -> Service -> Controller).
- **B2**: Cập nhật cấu trúc API vào `05_API_DESIGN.md` nếu có thay đổi.
- **B3**: Cập nhật Frontend (Tạo API Service -> Context (nếu cần) -> Component/Page).
- **B4**: Phối hợp kiểm tra qua log hoặc terminal trước khi hoàn thành task.

### 2.3. Nguyên tắc KHÔNG làm

❌ **KHÔNG** thêm tính năng ngoài scope (VD: multi-language, AI generation) trừ khi được yêu cầu rõ ràng.
❌ **KHÔNG** tự ý xóa code hiện hành nếu không rõ luồng.
❌ **KHÔNG** thiết kế lại giao diện hệ thống nếu đã có code nền tảng (Base Component).

---

## 3. Hướng dẫn Backend

### 3.1. Cấu trúc và Quy tắc Controller

```java
// ✅ ĐÚNG: Controller chỉ handle HTTP, mọi logic đẩy sang Service.
// Luôn wrap kết quả trong BaseResponse.
@PostMapping
public ResponseEntity<BaseResponse<DeckResponse>> createDeck(@Valid @RequestBody CreateDeckRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(BaseResponse.success(deckService.createDeck(request)));
}

// ❌ SAI: KHÔNG đặt business logic trong Controller
@PostMapping
public ResponseEntity<BaseResponse<DeckResponse>> create(@RequestBody CreateDeckRequest request) {
    // KHÔNG validate tay ở đây
    // KHÔNG gọi repository trực tiếp
}
```

### 3.2. Quy tắc Service

```java
// ✅ ĐÚNG: Service chứa business logic và authentication check
@Service
@Transactional(readOnly = true)
public class DeckServiceImpl implements DeckService {
    
    @Override
    @Transactional
    public DeckResponse createDeck(CreateDeckRequest request) {
        User user = getCurrentUser(); // Từ Security utils
        
        Deck deck = deckMapper.toEntity(request);
        deck.setUser(user);
        
        Deck saved = deckRepository.save(deck);
        return deckMapper.toResponse(saved);
    }
}
```

### 3.3. API Endpoints Template

Tuân thủ đúng thiết kế REST API: `GET`, `POST`, `PUT`, `DELETE`. Endpoints kết thúc nên ở dạng số nhiều (VD: `/api/v1/decks`, `/api/v1/flashcards`).

---

## 4. Hướng dẫn Frontend

### 4.1. Khởi tạo Component

```jsx
// ✅ ĐÚNG: Functional component với hooks, tách riêng logic gọi API vào /services.
export const DeckCard = ({ deck }) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 border rounded-md shadow-sm" onClick={() => navigate(`/decks/${deck.id}`)}>
      <h3 className="text-xl font-bold">{deck.title}</h3>
      <p>{deck.description}</p>
    </div>
  );
}
```

### 4.2. Quản lý trạng thái và Side Effects

```jsx
// ✅ ĐÚNG: useEffect gọi service function
import { useEffect, useState } from 'react';
import { getDecks } from '../services/deck.service';

function DeckList() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    getDecks().then(res => {
      if (isMounted && res.success) setDecks(res.data);
    }).finally(() => setLoading(false));

    return () => { isMounted = false; }; // Cleanup
  }, []);

  if (loading) return <div>Loading...</div>;
  return decks.map(deck => <DeckCard key={deck.id} deck={deck} />);
}
```

---

## 7. Error Handling

### 7.1. Backend Errors

```java
// Throw custom exceptions tại Service
throw new ResourceNotFoundException("Deck", deckId);
throw new BusinessException("Bộ từ vựng này không được public");
throw new UnauthorizedException("Bạn không phải chủ sở hữu của bộ từ vựng này");

// GlobalExceptionHandler sẽ tự động convert thành BaseResponse:
{
  "success": false,
  "message": "Bộ từ vựng này không được public",
  "data": null,
  "error": "BUSINESS_ERROR"
}
```

### 7.2. Frontend Errors

```jsx
// ✅ ĐÚNG: Toast cho mutations gọi qua Action
try {
  const res = await createDeck(data);
  if (res.success) {
    toast.success('Đã tạo thành công bộ từ vựng mới');
  } else {
    toast.error(res.message || 'Có lỗi xảy ra');
  }
} catch (error) {
  // Lỗi throw từ interceptor như 500 server error
  toast.error('Lỗi máy chủ, vui lòng thử lại');
}
```

---

## 8. Testing Guidelines

### 8.1. Backend Tests (Ví dụ)

```java
// Unit test cho Service
@ExtendWith(MockitoExtension.class)
class DeckServiceTest {
    @Mock
    private DeckRepository deckRepository;
    
    @InjectMocks
    private DeckServiceImpl deckService;
    
    @Test
    void createDeck_Success() {
        // Arrange
        CreateDeckRequest request = new CreateDeckRequest("TOEIC 600", "Public");
        when(deckRepository.save(any())).thenReturn(deck);
        
        // Act
        DeckResponse result = deckService.createDeck(request);
        
        // Assert
        assertThat(result.getTitle()).isEqualTo("TOEIC 600");
    }
}
```

---

## 9. Checklist khi implement feature

### 9.1. Trước khi code

- [ ] Đọc yêu cầu trong `00_BUSINESS_REQUIREMENTS.md`
- [ ] Xem thiết kế API trong `05_API_DESIGN.md`
- [ ] Xem schema database trong `04_DATABASE_SCHEMA.md`
- [ ] Feature có trong scope Phase hiện tại ở `06_DEVELOPMENT_PHASES.md` không?

### 9.2. Backend checklist

- [ ] Entity đúng với schema
- [ ] DTO có validation annotations (`@Valid`, `@NotBlank`)
- [ ] Service thực thi business logic, không để lộ ở Controller
- [ ] Chủ chốt: Kiểm tra quyền (Authorization) tài nguyên sở hữu.
- [ ] Controller chỉ bọc BaseResponse
- [ ] Exception được handle đúng

### 9.3. Frontend checklist

- [ ] Component đúng folder structure
- [ ] State management xử lý bằng React Context đúng
- [ ] Quản lý error bằng Toast/Alert
- [ ] Loading states đầy đủ trước khi call API hiển thị
- [ ] Giao diện Responsive nếu cần thiết

### 9.4. Sau khi code

- [ ] Test trực tiếp API với Swagger/Postman
- [ ] Test end-to-end trên UI Browser
- [ ] Xóa bỏ các lệnh `console.log()` / `System.out.println()` không cần thiết
- [ ] Code follows conventions

---

## 10. Liên hệ & Escalation

Khi gặp yêu cầu không rõ ràng hoặc không có context:
1. Đọc lại tài liệu trong thư mục `docs/`.
2. Kiểm tra xem file cấu hình (`application.yml`, `.env`) có đang thiếu gì không.
3. Nếu không chắc chắn, đặt câu hỏi làm rõ (clarifying question) với người dùng trước khi viết code rườm rà.

> 💡 **Nguyên tắc vàng**: Khi không chắc chắn, hãy hỏi thay vì đoán và viết code đi lạc hướng.
