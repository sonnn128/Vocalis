# 📚 Vocalis - English Learning Platform

Dưới đây là **mô tả nghiệp vụ chi tiết (Business Requirements)** cho dự án Vocalis - một nền tảng web học tiếng Anh thông qua hệ thống Flashcard.

---

# 📌 1. Giới thiệu ứng dụng

Ứng dụng giúp **người dùng học, ôn tập và ghi nhớ từ vựng tiếng Anh** thông qua phương pháp lặp lại ngắt quãng (Spaced Repetition) kết hợp với các bộ flashcard sinh động và bài test nhỏ để đánh giá quá trình học tập.

Đối tượng sử dụng:
- Học sinh, sinh viên cần luyện thi (IELTS, TOEIC, TOEFL)
- Người đi làm cần trau dồi vốn từ vựng chuyên ngành
- Người mới bắt đầu học tiếng Anh

---

# 👤 2. Nghiệp vụ Người dùng & Quản trị

## 2.1. Quản lý tài khoản (Authentication & Authorization)
- Người dùng (Người học) có thể:
  - Đăng ký tài khoản (Register)
  - Đăng nhập (Login bằng Email/Password qua JWT)
  - Quên mật khẩu, đổi mật khẩu
  - Cập nhật thông tin profile (Tên, Ảnh đại diện)
- Quản trị viên (Admin) có thể:
  - Quản lý tất cả người dùng (Khóa/Mở khóa tài khoản)
  - Xem tổng quan thống kê hệ thống

## 2.2. Phân quyền truy cập
- **Admin**: Quản trị tài khoản, quản lý các bộ từ vựng dùng chung (Public Decks).
- **User (Learner)**: Có không gian học tập riêng, tạo và học các bộ từ của cá nhân.

---

# 🗂️ 3. Nghiệp vụ Quản lý Nội dung (Flashcards & Decks)

## 3.1. Quản lý Bộ từ vựng (Decks)
- Người dùng có thể tạo, sửa, xóa bộ từ vựng (Deck) cá nhân.
- Các bộ từ vựng có thể được đặt ở chế độ:
  - **Private**: Chỉ người tạo mới xem và học được.
  - **Public**: Mọi người dùng khác đều có thể nhìn thấy và lấy về học.
- Quản lý metadata: Tên bộ từ, mô tả, hình ảnh minh họa (nếu có), danh mục (Category).

## 3.2. Quản lý Thẻ từ vựng (Flashcards)
- Trong mỗi Deck, người dùng có thể thêm, sửa, xóa các thẻ từ (Flashcard).
- Một Flashcard bao gồm:
  - **Mặt trước (Front):** Từ vựng tiếng Anh.
  - **Mặt sau (Back):** Ý nghĩa (tiếng Việt/tiếng Anh), loại từ, phiên âm (IPA).
  - **Mở rộng (Optional):** Câu ví dụ (Example sentence), từ đồng nghĩa (Synonyms), hình ảnh.

---

# 🧠 4. Nghiệp vụ Học tập (Study Mode)

## 4.1. Học qua lật thẻ (Flip Card)
- Hiển thị mặt trước của thẻ, người dùng tự nhớ nghĩa.
- Nhấp để lật thẻ xem mặt sau và tự đánh giá mức độ nhớ (Dễ, Bình thường, Khó).

## 4.2. Bài kiểm tra (Quizzes / Tests)
- Tự động sinh ra các bài test từ bộ Flashcard đang học:
  - Trắc nghiệm (Multiple Choice)
  - Điền từ vào chỗ trống (Fill in the blank)
- Tính điểm và thông báo kết quả.

## 4.3. Thuật toán Spaced Repetition (Tương lai)
- Dựa vào đánh giá của người dùng để điều chỉnh tần suất lặp lại của từng thẻ từ.
- Các từ khó sẽ xuất hiện nhiều hơn, từ dễ xuất hiện ít hơn để tối ưu thời gian học.

---

# 📊 5. Nghiệp vụ Theo dõi Tiến độ (Progress Tracking)

- **Thống kê Học tập:**
  - Tổng số từ vựng đã học / đã thuộc.
  - Streak (Số ngày học liên tiếp).
  - Biểu đồ số lượng thẻ học mỗi ngày.
- **Lịch sử học tập:** Lịch sử làm bài test, kết quả điểm số.

---

# 🔍 6. Tìm kiếm & Khám phá

- Tìm kiếm bộ từ vựng public theo tên, danh mục (ví dụ: TOEIC, IELTS).
- Chức năng lưu (Bookmark/Clone) bộ từ vựng của người khác về tài khoản của mình để tự học.

---

# 🌱 7. Nghiệp vụ mở rộng (Tương lai)
- Hỗ trợ thêm các ngôn ngữ khác ngoài tiếng Anh.
- **AI Tích hợp:** AI tự động tạo ví dụ, phiên âm và âm thanh phát âm cho từ mới.
- **Phát âm:** Hỗ trợ Text-to-Speech đọc từ vựng chuẩn.

---

# 🧱 8. Quy định dữ liệu ưu tiên
- Dữ liệu bắt buộc của 1 Flashcard:
  - Word (thẻ mặt trước)
  - Meaning (thẻ mặt sau)
- Dữ liệu tùy chọn nhưng khuyến khích:
  - Câu ví dụ, hình ảnh, loại từ (Noun, Verb, Adj...).

---

# 🎉 Tổng kết
Vocalis không chỉ là nơi lưu trữ từ vựng đơn thuần mà là một phòng học chủ động (Active Recall) kết hợp với thuật toán thông minh, đem lại động lực và kết quả thực sự cho người dùng trong quá trình theo đuổi ngoại ngữ.
