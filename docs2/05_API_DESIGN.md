# 🔌 LineageHub - API Design

## 1. API Overview

| Aspect | Value |
|--------|-------|
| Base URL | `http://localhost:8080/api` |
| Protocol | REST over HTTP |
| Format | JSON |
| Authentication | JWT Bearer Token |
| API Docs | `/swagger-ui.html` |

## 2. Authentication APIs

### 2.1. Đăng ký tài khoản

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "Nguyễn Văn A"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "status": "PENDING",
  "roles": [],
  "message": "Tài khoản đã được tạo, vui lòng chờ admin phê duyệt"
}
```

### 2.2. Đăng nhập

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "status": "ACTIVE",
    "roles": [
      {
        "id": "role-uuid-1",
        "role": "BRANCH_ADMIN",
        "managedMemberId": "770e8400-e29b-41d4-a716-446655440001",
        "managedMemberName": "Nguyễn Văn A (Đời 2)"
      },
      {
        "id": "role-uuid-2",
        "role": "BRANCH_ADMIN",
        "managedMemberId": "770e8400-e29b-41d4-a716-446655440005",
        "managedMemberName": "Nguyễn Văn B (Đời 2)"
      }
    ]
  }
}
```

### 2.3. Lấy thông tin user hiện tại

```
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "status": "ACTIVE",
  "roles": [
    {
      "id": "role-uuid-1",
      "role": "BRANCH_ADMIN",
      "managedMemberId": "770e8400-e29b-41d4-a716-446655440001",
      "managedMemberName": "Nguyễn Văn A (Đời 2)"
    },
    {
      "id": "role-uuid-2",
      "role": "BRANCH_ADMIN",
      "managedMemberId": "770e8400-e29b-41d4-a716-446655440005",
      "managedMemberName": "Nguyễn Văn B (Đời 2)"
    }
  ],
  "permissions": {
    "canEditMembers": true,
    "canViewAuditLogs": false,
    "canManageUsers": false
  }
}
```

### 2.4. Đăng nhập OAuth (Google/Facebook) - Phase 3

```
POST /api/auth/oauth/{provider}
```

**Path Parameters:**
- `provider`: `google` | `facebook`

**Request Body:**
```json
{
  "accessToken": "oauth-access-token-from-provider"
}
```

**Response:** Same as login response

---

## 3. User Management APIs (Super Admin only)

### 3.1. Lấy danh sách users

```
GET /api/users
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 0 | Trang (0-indexed) |
| size | int | 20 | Số item/trang |
| status | string | - | Filter by status |
| role | string | - | Filter by role |
| search | string | - | Tìm theo tên/email |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "status": "ACTIVE",
      "roles": [
        {
          "id": "role-uuid-1",
          "role": "BRANCH_ADMIN",
          "managedMemberId": "770e8400-e29b-41d4-a716-446655440001",
          "managedMemberName": "Nguyễn Văn B (Đời 2)"
        },
        {
          "id": "role-uuid-2",
          "role": "BRANCH_ADMIN",
          "managedMemberId": "770e8400-e29b-41d4-a716-446655440005",
          "managedMemberName": "Nguyễn Văn C (Đời 3)"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "viewer@example.com",
      "fullName": "Trần Văn C",
      "status": "ACTIVE",
      "roles": [
        {
          "id": "role-uuid-3",
          "role": "USER",
          "managedMemberId": null,
          "managedMemberName": null
        }
      ],
      "createdAt": "2024-01-16T08:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 25,
  "totalPages": 2
}
```

### 3.2. Phê duyệt user

```
PATCH /api/users/{id}/approve
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "ACTIVE",
  "message": "Tài khoản đã được phê duyệt"
}
```

### 3.3. Vô hiệu hóa user

```
PATCH /api/users/{id}/deactivate
Authorization: Bearer {token}
```

### 3.4. Xóa user

```
DELETE /api/users/{id}
Authorization: Bearer {token}
```

---

## 4. User Roles APIs (Super Admin only)

### 4.1. Lấy danh sách roles của user

```
GET /api/users/{userId}/roles
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userEmail": "user@example.com",
  "roles": [
    {
      "id": "role-uuid-1",
      "role": "BRANCH_ADMIN",
      "managedMemberId": "770e8400-e29b-41d4-a716-446655440001",
      "managedMemberName": "Nguyễn Văn A (Đời 2)",
      "managedMemberGeneration": 2,
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": {
        "id": "admin-uuid",
        "fullName": "Super Admin"
      }
    },
    {
      "id": "role-uuid-2",
      "role": "BRANCH_ADMIN",
      "managedMemberId": "770e8400-e29b-41d4-a716-446655440005",
      "managedMemberName": "Nguyễn Văn B (Đời 2)",
      "managedMemberGeneration": 2,
      "createdAt": "2024-01-16T08:00:00Z",
      "createdBy": {
        "id": "admin-uuid",
        "fullName": "Super Admin"
      }
    }
  ]
}
```

### 4.2. Thêm role cho user

```
POST /api/users/{userId}/roles
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "role": "BRANCH_ADMIN",
  "managedMemberId": "770e8400-e29b-41d4-a716-446655440001"
}
```

**Business Rules:**
- `role = SUPER_ADMIN`: `managedMemberId` phải là `null`
- `role = BRANCH_ADMIN`: `managedMemberId` **bắt buộc** (member gốc của subtree được quản lý)
- `role = USER`: `managedMemberId` phải là `null`
- Mỗi user chỉ có **1 role SUPER_ADMIN** hoặc **1 role USER**
- User có thể có **nhiều role BRANCH_ADMIN** với các `managedMemberId` khác nhau
- Không thể gán cùng `managedMemberId` cho user đã có role BRANCH_ADMIN với member đó

**Response (201 Created):**
```json
{
  "id": "role-uuid-new",
  "role": "BRANCH_ADMIN",
  "managedMemberId": "770e8400-e29b-41d4-a716-446655440001",
  "managedMemberName": "Nguyễn Văn A (Đời 2)",
  "createdAt": "2024-01-17T09:00:00Z",
  "message": "Đã thêm role BRANCH_ADMIN"
}
```

### 4.3. Xóa role của user

```
DELETE /api/users/{userId}/roles/{roleId}
Authorization: Bearer {token}
```

**Business Rules:**
- Không thể xóa role cuối cùng của user (user phải có ít nhất 1 role)
- Không thể xóa role SUPER_ADMIN của chính mình

**Response (200 OK):**
```json
{
  "message": "Đã xóa role"
}
```

### 4.4. Thay đổi role (shortcut API)

```
PUT /api/users/{userId}/roles
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "roles": [
    {
      "role": "BRANCH_ADMIN",
      "managedMemberId": "member-uuid-1"
    },
    {
      "role": "BRANCH_ADMIN",
      "managedMemberId": "member-uuid-2"
    }
  ]
}
```

**Description:**
- Thay thế toàn bộ roles của user bằng danh sách mới
- Xóa tất cả roles cũ và tạo roles mới

**Response (200 OK):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "roles": [
    {
      "id": "new-role-uuid-1",
      "role": "BRANCH_ADMIN",
      "managedMemberId": "member-uuid-1",
      "managedMemberName": "Nguyễn Văn A (Đời 2)"
    },
    {
      "id": "new-role-uuid-2",
      "role": "BRANCH_ADMIN",
      "managedMemberId": "member-uuid-2",
      "managedMemberName": "Nguyễn Văn B (Đời 3)"
    }
  ],
  "message": "Đã cập nhật roles"
}
```

---

## 5. Member APIs

### 5.1. Lấy danh sách thành viên

```
GET /api/members
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 0 | Trang |
| size | int | 20 | Số item/trang |
| generation | int | - | Filter theo đời |
| gender | string | - | MALE/FEMALE/OTHER |
| search | string | - | Tìm theo tên |
| isDeceased | boolean | - | Còn sống/đã mất |
| isBloodRelative | boolean | - | Con ruột/dâu rể |
| rootMemberId | UUID | - | Lấy subtree từ member này |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "fullName": "Nguyễn Văn A",
      "gender": "MALE",
      "birthDate": "1920-05-15",
      "deathDate": "1995-03-20",
      "address": "Hà Nội",
      "phone": null,
      "email": null,
      "avatarUrl": "/uploads/members/avatar-001.jpg",
      "isBloodRelative": true,
      "branchName": "Nhánh Cả",
      "generation": 1,
      "isDeceased": true,
      "canEdit": true
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 200,
  "totalPages": 10
}
```

**Chú thích:**
- `canEdit`: `true` nếu user hiện tại có quyền sửa member này

### 5.2. Lấy chi tiết thành viên

```
GET /api/members/{id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "fullName": "Nguyễn Văn A",
  "gender": "MALE",
  "birthDate": "1920-05-15",
  "deathDate": "1995-03-20",
  "address": "Hà Nội",
  "phone": null,
  "email": null,
  "avatarUrl": "/uploads/members/avatar-001.jpg",
  "notes": "Cụ tổ của dòng họ",
  "isBloodRelative": true,
  "branchName": "Nhánh Cả",
  "generation": 1,
  "isDeceased": true,
  "canEdit": true,
  "relationships": {
    "parents": [],
    "spouses": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "fullName": "Trần Thị B",
        "gender": "FEMALE",
        "isBloodRelative": false
      }
    ],
    "children": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440003",
        "fullName": "Nguyễn Văn C",
        "gender": "MALE",
        "isBloodRelative": true
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440004",
        "fullName": "Nguyễn Thị D",
        "gender": "FEMALE",
        "isBloodRelative": true
      }
    ]
  },
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-12T14:30:00Z",
  "createdBy": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Admin"
  }
}
```

### 5.3. Tạo thành viên mới

```
POST /api/members
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn E",
  "gender": "MALE",
  "birthDate": "1990-08-25",
  "deathDate": null,
  "address": "TP. Hồ Chí Minh",
  "phone": "0901234567",
  "email": "nguyenvane@gmail.com",
  "notes": "",
  "isBloodRelative": true,
  "branchName": null,
  "parentIds": ["770e8400-e29b-41d4-a716-446655440003"],
  "spouseIds": []
}
```

**Validation Rules:**
- `fullName`: **required**, max 255 chars
- `gender`: **required**, enum (MALE, FEMALE, OTHER)
- `isBloodRelative`: **required**, boolean
- `birthDate`: optional, format YYYY-MM-DD
- `deathDate`: optional, must be >= birthDate
- `parentIds`: max 2 (cha + mẹ)
- `branchName`: optional, chỉ nên đặt cho member có `isBloodRelative = true`

**Authorization:**
- SUPER_ADMIN: có thể tạo bất kỳ đâu
- BRANCH_ADMIN: chỉ tạo member trong subtree của mình (con/cháu của managed_member hoặc vợ/chồng của member trong subtree)

**Response (201 Created):** Member object với `canEdit: true`

### 5.4. Cập nhật thành viên

```
PUT /api/members/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn E",
  "gender": "MALE",
  "birthDate": "1990-08-25",
  "deathDate": null,
  "address": "TP. Hồ Chí Minh",
  "phone": "0901234567",
  "email": "nguyenvane@gmail.com",
  "notes": "Đã cập nhật địa chỉ",
  "isBloodRelative": true,
  "branchName": "Chi Hai"
}
```

**Authorization:**
- SUPER_ADMIN: có thể update bất kỳ member
- BRANCH_ADMIN: chỉ update member trong subtree của mình

**Response (200 OK):** Updated member object

### 5.5. Xóa thành viên

```
DELETE /api/members/{id}
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| force | boolean | false | Force delete kèm relationships |

**Business Rules:**
- Mặc định không thể xóa nếu có quan hệ (có con, có vợ/chồng)
- `force=true` (chỉ SUPER_ADMIN): xóa kèm cascade relationships
- Không thể xóa member đang được gán cho BRANCH_ADMIN

### 5.6. Upload avatar

```
POST /api/members/{id}/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Image file (jpg, png, max 5MB)

**Response (200 OK):**
```json
{
  "avatarUrl": "/uploads/members/avatar-770e8400.jpg"
}
```

### 5.7. Lấy subtree của member

```
GET /api/members/{id}/subtree
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| maxDepth | int | 10 | Số đời tối đa |
| includeSpouses | boolean | true | Bao gồm vợ/chồng |

**Response (200 OK):**
```json
{
  "rootMember": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "fullName": "Nguyễn Văn A",
    "gender": "MALE"
  },
  "members": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "fullName": "Nguyễn Văn A",
      "depth": 0
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "fullName": "Nguyễn Văn B",
      "depth": 1
    }
  ],
  "totalMembers": 45,
  "maxDepth": 4
}
```

---

## 6. Relationship APIs

### 6.1. Thêm quan hệ cha-con

```
POST /api/relationships/parent-child
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "parentId": "770e8400-e29b-41d4-a716-446655440003",
  "childId": "770e8400-e29b-41d4-a716-446655440010"
}
```

**Validation:**
- Kiểm tra không tạo vòng lặp (child không thể là tổ tiên của parent)
- Mỗi member chỉ có tối đa 2 parents (cha + mẹ)

**Authorization:**
- SUPER_ADMIN: tạo bất kỳ quan hệ
- BRANCH_ADMIN: 
  - Có thể tạo quan hệ cho các member trong subtree
  - **KHÔNG thể** tạo quan hệ parent→managed_member (quan hệ với đời trên)

**Response (201 Created):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "fromMemberId": "770e8400-e29b-41d4-a716-446655440003",
  "fromMemberName": "Nguyễn Văn B",
  "toMemberId": "770e8400-e29b-41d4-a716-446655440010",
  "toMemberName": "Nguyễn Văn E",
  "relationshipType": "PARENT_CHILD",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 6.2. Thêm quan hệ vợ/chồng

```
POST /api/relationships/spouse
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "member1Id": "770e8400-e29b-41d4-a716-446655440003",
  "member2Id": "770e8400-e29b-41d4-a716-446655440005"
}
```

**Business Rules:**
- Tự động tạo 2 records (quan hệ 2 chiều)
- Member có `isBloodRelative = false` thường là vợ/chồng vào gia đình

**Authorization:**
- SUPER_ADMIN: tạo bất kỳ
- BRANCH_ADMIN: chỉ cần 1 trong 2 member nằm trong subtree

### 6.3. Xóa quan hệ

```
DELETE /api/relationships/{id}
Authorization: Bearer {token}
```

**Authorization:**
- SUPER_ADMIN: xóa bất kỳ
- BRANCH_ADMIN:
  - Có thể xóa quan hệ trong subtree
  - **KHÔNG thể** xóa quan hệ của managed_member với đời trên

### 6.4. Lấy quan hệ của member

```
GET /api/members/{id}/relationships
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "memberId": "770e8400-e29b-41d4-a716-446655440003",
  "memberName": "Nguyễn Văn B",
  "parents": [
    {
      "relationshipId": "880e8400-e29b-41d4-a716-446655440001",
      "memberId": "770e8400-e29b-41d4-a716-446655440001",
      "memberName": "Nguyễn Văn A",
      "gender": "MALE",
      "canEdit": true
    }
  ],
  "spouses": [
    {
      "relationshipId": "880e8400-e29b-41d4-a716-446655440002",
      "memberId": "770e8400-e29b-41d4-a716-446655440005",
      "memberName": "Trần Thị C",
      "gender": "FEMALE",
      "canEdit": true
    }
  ],
  "children": [
    {
      "relationshipId": "880e8400-e29b-41d4-a716-446655440003",
      "memberId": "770e8400-e29b-41d4-a716-446655440010",
      "memberName": "Nguyễn Văn E",
      "gender": "MALE",
      "canEdit": true
    }
  ]
}
```

---

## 7. Family Tree APIs

### 7.1. Lấy dữ liệu cây gia phả (Graph Structure)

```
GET /api/tree
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| rootMemberId | UUID | - | Bắt đầu từ member cụ thể (mặc định lấy tổ tiên gốc) |
| depth | int | 10 | Số đời tối đa cần lấy |

**Response (200 OK):**
```json
{
  "nodes": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "fullName": "Nguyễn Văn A",
      "gender": "MALE",
      "birthDate": "1920-05-15",
      "deathDate": "1995-03-20",
      "avatarUrl": "/uploads/members/avatar-001.jpg",
      "generation": 1,
      "isBloodRelative": true,
      "branchName": "Nhánh Cả",
      "isDeceased": true
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "fullName": "Trần Thị B",
      "gender": "FEMALE",
      "birthDate": "1925-08-20",
      "deathDate": null,
      "avatarUrl": null,
      "generation": 1,
      "isBloodRelative": false,
      "branchName": null,
      "isDeceased": false
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "fullName": "Nguyễn Văn C",
      "gender": "MALE",
      "birthDate": "1950-03-10",
      "deathDate": null,
      "avatarUrl": null,
      "generation": 2,
      "isBloodRelative": true,
      "branchName": "Nhánh Cả",
      "isDeceased": false
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "770e8400-e29b-41d4-a716-446655440001",
      "target": "770e8400-e29b-41d4-a716-446655440002",
      "type": "SPOUSE"
    },
    {
      "id": "edge-2",
      "source": "770e8400-e29b-41d4-a716-446655440001",
      "target": "770e8400-e29b-41d4-a716-446655440003",
      "type": "PARENT_CHILD"
    }
  ],
  "stats": {
    "totalMembers": 200,
    "totalGenerations": 5,
    "totalBranches": 10
  }
}
```

**Node Structure:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | ID của thành viên |
| fullName | String | Họ tên đầy đủ |
| gender | Enum | MALE, FEMALE, OTHER |
| birthDate | String (ISO 8601) | Ngày sinh (nullable) |
| deathDate | String (ISO 8601) | Ngày mất (nullable) |
| avatarUrl | String | URL ảnh đại diện (nullable) |
| isBloodRelative | Boolean | Có phải huyết thống không |
| isDeceased | Boolean | Đã qua đời hay chưa |
| generation | Integer | Đời thứ mấy |
| branchName | String | Tên nhánh (nullable) |

**Edge Structure:**
| Field | Type | Description |
|-------|------|-------------|
| id | String | ID unique của edge |
| source | UUID | ID của member nguồn |
| target | UUID | ID của member đích |
| type | Enum | PARENT_CHILD hoặc SPOUSE |

**Edge Types:**
- `PARENT_CHILD`: Quan hệ cha/mẹ - con (source là parent, target là child)
- `SPOUSE`: Quan hệ vợ/chồng (không có hướng, có thể swap source/target)

**Notes:**
- Cấu trúc graph với nodes và edges riêng biệt
- Mỗi member chỉ xuất hiện 1 lần trong mảng nodes (không duplicate)
- Edges biểu diễn relationships giữa các members
- Dễ dàng mở rộng thêm loại relationships khác trong tương lai
- Field `birthDate` và `deathDate` dùng ISO 8601 format (YYYY-MM-DD)
- Frontend có thể tự quyết định cách layout và render

**Authorization:**
- Tất cả users đã authenticated đều có thể xem tree
- BRANCH_ADMIN chỉ thấy nodes/edges trong subtree mình quản lý
- SUPER_ADMIN thấy toàn bộ tree

**Error Responses:**
- `404 Not Found`: rootMemberId không tồn tại
- `403 Forbidden`: User không có quyền xem member được chỉ định

### 7.2. Lấy đường đi giữa 2 thành viên

```
GET /api/tree/path
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| fromId | UUID | Member bắt đầu |
| toId | UUID | Member kết thúc |

**Response (200 OK):**
```json
{
  "path": [
    {
      "memberId": "770e8400-e29b-41d4-a716-446655440010",
      "memberName": "Nguyễn Văn E",
      "relationship": null
    },
    {
      "memberId": "770e8400-e29b-41d4-a716-446655440003",
      "memberName": "Nguyễn Văn C",
      "relationship": "cha"
    },
    {
      "memberId": "770e8400-e29b-41d4-a716-446655440001",
      "memberName": "Nguyễn Văn A",
      "relationship": "ông nội"
    }
  ],
  "relationshipDescription": "Nguyễn Văn E là cháu đời 2 của Nguyễn Văn A"
}
```

---

## 8. Export APIs

### 8.1. Export cây gia phả

```
POST /api/export/tree
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "format": "PNG",
  "rootMemberId": null,
  "paperSize": "A1",
  "includePhotos": true,
  "includeDeceased": true,
  "showBirthYear": true,
  "showDeathYear": true
}
```

**Response (200 OK):**
```json
{
  "downloadUrl": "/api/export/download/export-2024-01-15-abc123.png",
  "expiresAt": "2024-01-16T10:30:00Z",
  "fileSize": 2048576
}
```

### 8.2. Download exported file

```
GET /api/export/download/{filename}
Authorization: Bearer {token}
```

**Response:** Binary file (PNG/PDF)

### 8.3. Lấy lịch sử export

```
GET /api/export/history
Authorization: Bearer {token}
```

---

## 9. Statistics API

### 9.1. Lấy thống kê tổng quan

```
GET /api/statistics
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "totalMembers": 200,
  "livingMembers": 180,
  "deceasedMembers": 20,
  "generationCount": 5,
  "genderDistribution": {
    "MALE": 105,
    "FEMALE": 95
  },
  "bloodRelatives": 150,
  "nonBloodRelatives": 50
}
```

### 9.2. Lấy thống kê subtree của member

```
GET /api/members/{id}/statistics
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "rootMemberId": "770e8400-e29b-41d4-a716-446655440001",
  "rootMemberName": "Nguyễn Văn A",
  "totalMembers": 45,
  "livingMembers": 40,
  "deceasedMembers": 5,
  "generationCount": 4,
  "genderDistribution": {
    "MALE": 25,
    "FEMALE": 20
  }
}
```

---

## 10. Search API

### 10.1. Tìm kiếm thành viên

```
GET /api/search/members
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | Từ khóa tìm kiếm |
| limit | int | Số kết quả (default 10) |

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440010",
      "fullName": "Nguyễn Văn E",
      "gender": "MALE",
      "birthYear": 1990,
      "generation": 3,
      "highlight": "Nguyễn <em>Văn E</em>",
      "canEdit": true
    }
  ],
  "totalResults": 5
}
```

---

## 11. Audit Log API (Super Admin)

### 11.1. Lấy lịch sử thay đổi

```
GET /api/audit-logs
Authorization: Bearer {token}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| entityType | string | USER, MEMBER, RELATIONSHIP, USER_ROLE |
| entityId | UUID | ID của entity |
| userId | UUID | Người thực hiện |
| action | string | CREATE, UPDATE, DELETE |
| from | datetime | Từ ngày |
| to | datetime | Đến ngày |
| page | int | Trang |
| size | int | Số item/trang |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "entityType": "MEMBER",
      "entityId": "770e8400-e29b-41d4-a716-446655440010",
      "action": "UPDATE",
      "changes": {
        "fullName": {
          "old": "Nguyễn Văn E",
          "new": "Nguyễn Văn Đức"
        }
      },
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "fullName": "Admin"
      },
      "createdAt": "2024-01-15T14:30:00Z"
    },
    {
      "id": "990e8400-e29b-41d4-a716-446655440002",
      "entityType": "USER_ROLE",
      "entityId": "role-uuid-1",
      "action": "CREATE",
      "changes": {
        "role": "BRANCH_ADMIN",
        "managedMemberId": "member-uuid-1"
      },
      "user": {
        "id": "admin-uuid",
        "fullName": "Super Admin"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "totalElements": 150
}
```

---

## 12. Error Response Format

Tất cả errors trả về format thống nhất:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Họ tên không được để trống",
  "path": "/api/members",
  "details": {
    "field": "fullName",
    "rejectedValue": null,
    "code": "NotBlank"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Business rule violation |
| 500 | Internal Error | Server error |

### Common Error Codes

| Error | Status | Message |
|-------|--------|---------|
| VALIDATION_ERROR | 400 | Field validation failed |
| UNAUTHORIZED | 401 | Token missing or invalid |
| FORBIDDEN | 403 | No permission to access |
| NOT_FOUND | 404 | Resource not found |
| CYCLE_DETECTED | 409 | Relationship creates a cycle |
| CANNOT_EDIT_PARENT_RELATION | 403 | Cannot edit relationship with ancestors |
| MEMBER_HAS_RELATIONS | 409 | Cannot delete member with relationships |
| DUPLICATE_ROLE | 409 | User already has this role for member |

---

## 13. Authorization Summary

### Role Permissions

| Action | SUPER_ADMIN | BRANCH_ADMIN | USER |
|--------|-------------|--------------|------|
| View all members | ✅ | ✅ | ✅ |
| View tree | ✅ | ✅ | ✅ |
| Export tree | ✅ | ✅ | ✅ |
| Create member (subtree) | ✅ | ✅ | ❌ |
| Edit member (subtree) | ✅ | ✅ | ❌ |
| Delete member | ✅ | ✅* | ❌ |
| Create relationship | ✅ | ✅* | ❌ |
| Edit/Delete relationship | ✅ | ✅* | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Manage user roles | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |

**✅*** = Chỉ trong subtree(s) của `managed_member`, và không thể sửa/xóa quan hệ với đời trên.

### BRANCH_ADMIN Restrictions (với nhiều subtrees)

```
BRANCH_ADMIN với:
  - managed_member = A2
  - managed_member = A4

✅ CÓ THỂ:
- Xem toàn bộ gia phả
- Sửa thông tin A2 và subtree A2 (B1, B2, C1...)
- Sửa thông tin A4 và subtree A4 (D1, D2...)
- Thêm vợ/chồng cho A2, A4
- Thêm con cho A2, A4 và con cháu
- Thêm/sửa/xóa quan hệ trong subtree A2 và A4

❌ KHÔNG THỂ:
- Sửa/xóa quan hệ A1→A2, A1→A4 (A1 là cha của A2, A4)
- Sửa member ngoài subtrees (A1, A3, B4...)
- Quản lý users
- Xem audit logs
```

### Mô hình dữ liệu User với nhiều Roles

```
User: nguyen.van.a@gmail.com
├── UserRole 1: BRANCH_ADMIN (managed_member = A2)
│   └── Quản lý subtree: A2 → B1, B2, B3, C1, C2, Vợ_A2...
└── UserRole 2: BRANCH_ADMIN (managed_member = A4)
    └── Quản lý subtree: A4 → D1, D2, D3, Vợ_A4...
```
