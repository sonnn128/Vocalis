# 🛠️ Vocalis - Tech Stack

## 1. Tổng quan công nghệ

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | ReactJS (Vite) | 18.x |
| Backend | Spring Boot | 3.x |
| Database | PostgreSQL / MySQL | 15.x / 8.x |
| ORM | Hibernate/JPA | 6.x (via Spring Boot) |
| Auth | JWT + Spring Security | 6.x |
| Java Runtime | OpenJDK | 17 / 21 |

---

## 2. Frontend Stack

### 2.1. Core Framework

| Package | Purpose | Version |
|---------|---------|---------|
| `react` | UI library | ^18.2.0 |
| `react-dom` | React DOM renderer | ^18.2.0 |
| `react-router-dom` | Client-side routing | ^6.x |
| `vite` | Build tool và dev server cực nhanh | ^5.x |

### 2.2. Styling & UI

| Package | Purpose | Version |
|---------|---------|---------|
| `tailwindcss` | Utility-first CSS (nếu dùng) | ^3.x |
| `lucide-react` / `react-icons` | Icon library (Tùy chọn) | - |
| `clsx` / `tailwind-merge` | Xử lý nối class cho Tailwind (Tùy chọn) | - |

> *Ghi chú:* Giao diện ưu tiên sử dụng CSS thuần hoặc TailwindCSS tùy thuộc vào setup ban đầu gốc của dự án.

### 2.3. State Management & Data Fetching

| Package | Purpose | Version |
|---------|---------|---------|
| `axios` | HTTP Client thay cho fetch | ^1.x |
| `React Context` | Quản lý state toàn cục (Auth, Theme) | Built-in |

> *Ghi chú:* Chưa cần thiết sử dụng Redux hoặc RTK Query ở MVP. Sử dụng Context + useState/useEffect là đủ.

### 2.4. Utilities & Dev Tools

| Package | Purpose |
|---------|---------|
| `eslint` | Linting code JS/JSX |
| `jwt-decode` | Giải mã JWT token ở client |

---

## 3. Backend Stack

### 3.1. Core Framework

Dự án sử dụng **Spring Boot 3.x** yêu cầu tối thiểu Java 17.

```xml
<!-- Spring Boot Parent -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.x.x</version>
</parent>
```

### 3.2. Dependencies chính

| Dependency | Purpose |
|------------|---------|
| `spring-boot-starter-web` | REST API, Tomcat nhúng |
| `spring-boot-starter-data-jpa` | Database access, ORM |
| `spring-boot-starter-security` | Authentication & Authorization |
| `spring-boot-starter-validation` | Input validation (`@Valid`, `@NotNull`) |

### 3.3. Database & Security

| Dependency | Purpose |
|------------|---------|
| `mysql-connector-j` / `postgresql` | JDBC driver (Tùy chọn CSDL) |
| `jjwt-api`, `jjwt-impl`, `jjwt-jackson` | Thư viện làm việc với JSON Web Token |

### 3.4. Utilities

| Dependency | Purpose |
|------------|---------|
| `lombok` | Reduce boilerplate code (getter, setter, builder) |
| `springdoc-openapi-starter-webmvc-ui` | Auto generate Swagger UI documentation |

---

## 4. Development Tools

### 4.1. IDE & Editor
- **VS Code / Cursor IDE** (For Frontend & Backend tùy chọn)
- **IntelliJ IDEA** (Recommended for Spring Boot)

### 4.2. Database Tools
- **DBeaver / DataGrip / pgAdmin / MySQL Workbench**

### 4.3. API Testing
- **Postman / Insomnia**
- **Swagger UI** (sẵn có ở backend `/swagger-ui/index.html`)

---

## 5. Deployment Setup

Ưu tiên sử dụng **Docker** và **Docker Compose** để chuẩn hóa môi trường local cũng như production.

### Lựa chọn môi trường:

| Option | Layer | Hosting Platform |
|--------|-------|------------------|
| **Split** | Frontend | Vercel / Netlify / Render |
| | Backend + DB | Render / Railway / VPS |
| **All-in-one**| Frontend + Backend + DB | Docker compose trên 1 VPS (DigitalOcean/Linode) |

> Xem chi tiết file `compose.yml` nguyên gốc trong dự án để cấu hình triển khai cụ thể bằng Docker.
