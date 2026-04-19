# 📝 Vocalis - Coding Conventions

## 1. General Principles

### 1.1. Code Quality
- **Readability** > Cleverness
- **Consistency** > Personal preference
- **Simplicity** > Premature optimization
- **Explicit** > Implicit

### 1.2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files/Folders | kebab-case / PascalCase | `study-mode.jsx`, `FlashcardItem.jsx` |
| Components | PascalCase | `FlashcardItem` |
| Functions | camelCase | `handleFlipCard` |
| Constants | UPPER_SNAKE | `MAX_CARDS_PER_DAY` |
| Database tables | snake_case | `flashcards`, `decks` |
| API endpoints | kebab-case | `/api/v1/flashcards/{id}` |

---

## 2. Frontend Conventions (React + Vite)

### 2.1. File Structure

```
frontend/src/
├── assets/                 # Hình ảnh, fonts, v.v.
├── components/             # Reusable components
│   ├── common/             # Button, Input, Modal...
│   ├── layout/             # Header, Footer, Sidebar...
│   └── feature/            # Các component chuyên biệt (VD: FlashcardList)
├── contexts/               # React Context (AuthContext, ThemeContext)
├── hooks/                  # Custom hooks (useAuth, useDeck)
├── pages/                  # Page components tương ứng route
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Study.jsx
├── services/               # Gọi API (axios instances)
│   ├── api.js              # Cấu hình axios chung
│   ├── auth.service.js
│   └── deck.service.js
└── utils/                  # Helper functions (formatDate, jwtUtils)
```

### 2.2. Component Structure

```jsx
// 1. Imports (grouped and ordered)
import React, { useState, useEffect } from 'react';    // React
import { useNavigate } from 'react-router-dom';        // Router
import { useAuth } from '../../contexts/AuthContext';  // Contexts
import Button from '../common/Button';                 // Components
import { getDeckById } from '../../services/deck';     // Services
import { formatDate } from '../../utils/format';       // Utils

// 2. Component definition
const DeckDetail = ({ deckId }) => {
  // 2.1. Hooks first
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2.2. Derived state / computations
  const isOwner = user?.id === deck?.ownerId;

  // 2.3. Effects
  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const data = await getDeckById(deckId);
        setDeck(data);
      } catch (error) {
        console.error('Failed to fetch deck', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [deckId]);

  // 2.4. Event handlers
  const handleStudyClick = () => {
    navigate(`/study/${deckId}`);
  };

  // 2.5. Render
  if (loading) return <div>Loading...</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <div className="deck-detail-container">
      <h2>{deck.title}</h2>
      <p>Created by: {deck.ownerName} on {formatDate(deck.createdAt)}</p>
      <Button onClick={handleStudyClick} variant="primary">Study Now</Button>
    </div>
  );
};

export default DeckDetail;
```

### 2.3. React Rules
- **✅ DO:** Tách logic gọi API ra thư mục `services/`.
- **✅ DO:** Sử dụng Context API cho state toàn cục (Auth, Theme).
- **✅ DO:** Hủy các subscriptions và timers trong cleanup function của `useEffect`.
- **❌ DON'T:** Để logic gọi API trực tiếp dính chặt vào UI render trừ khi có hooks tiện ích.
- **❌ DON'T:** Thay đổi state trực tiếp (Vd: `state.value = 1`), luôn dùng hàm `setState`.

---

## 3. Backend Conventions (Spring Boot + Java)

### 3.1. Package Structure

```
com.sonnguyen.base/
├── config/                 # Security, CORS, Swagger configs
├── controller/             # REST Controllers
├── service/                # Business logic interfaces
│   └── impl/               # Service implementations
├── repository/             # Spring Data JPA interfaces
├── entity/                 # JPA Entities
├── dto/                    # Data Transfer Objects
│   ├── request/            # Input DTOs
│   └── response/           # Output DTOs
├── exception/              # Global exceptions handler
├── security/               # JWT filters, providers
└── util/                   # Common utilities
```

### 3.2. Controller Convention

```java
@RestController
@RequestMapping("/api/v1/decks")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;

    @GetMapping
    public ResponseEntity<BaseResponse<Page<DeckResponse>>> getDecks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<DeckResponse> decks = deckService.getDecks(pageable);
        
        return ResponseEntity.ok(BaseResponse.success(decks));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BaseResponse<DeckResponse>> createDeck(
            @Valid @RequestBody CreateDeckRequest request) {
        
        DeckResponse created = deckService.createDeck(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(BaseResponse.success("Tạo bộ từ vựng thành công", created));
    }
}
```

### 3.3. Service Convention
- Service chỉ chứa Business Logic.
- Không chứa HTTP logic như `ResponseEntity`, `HttpServletRequest` tại đây.

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DeckServiceImpl implements DeckService {

    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DeckResponse createDeck(CreateDeckRequest request) {
        User user = getCurrentUser(); // Lấy user từ SecurityContext
        
        Deck deck = new Deck();
        deck.setTitle(request.getTitle());
        deck.setDescription(request.getDescription());
        deck.setUser(user);
        
        Deck saved = deckRepository.save(deck);
        return mapToResponse(saved);
    }
    
    // ...
}
```

### 3.4. DTO và API Format (Chuẩn trả về)
Mọi API trả về nên được wrap trong một cấu trúc chuẩn (`BaseResponse`):

```java
@Data
@Builder
public class BaseResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> BaseResponse<T> success(T data) {
        return BaseResponse.<T>builder().success(true).message("Thành công").data(data).build();
    }
    
    public static <T> BaseResponse<T> success(String message, T data) {
        return BaseResponse.<T>builder().success(true).message(message).data(data).build();
    }
}
```

---

## 4. Database Conventions

### 4.1. Naming
- Tables: `snake_case`, plural (`users`, `decks`, `flashcards`)
- Columns: `snake_case` (`full_name`, `created_at`)
- Primary keys: `id` (bigint hoặc uuid)
- Foreign keys: `{table_singular}_id` (`user_id`, `deck_id`)

---

## 5. Git Conventions

### 5.1. Branch Naming
```text
main                    # Production-ready
develop                 # Integration branch
feature/add-flashcard   # New feature
bugfix/login-error      # Bug fix
hotfix/security-patch   # Urgent fix
```

### 5.2. Commit Messages
```text
feat: add study mode for flashcards
fix: resolve JWT expiration issue
docs: update API documentation
refactor: extract button component
test: add deck service unit tests
style: fix UI alignment in header
chore: update dependencies
```

### 5.3. Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows conventions
- [ ] Self-reviewed
- [ ] No console.log / print statements
- [ ] No hardcoded values
```
