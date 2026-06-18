# Hướng Dẫn Thực Hành: Getting Started with Antigravity Skills (Step 4)

Tài liệu này tổng hợp chi tiết nội dung của phần thực hành **Step 4** (tương ứng với phần **5. Authoring Skills** trong Codelab). Nội dung hướng dẫn cách tạo lập, phân loại và cài đặt các kỹ năng tùy biến (Agent Skills) tích hợp vào hệ sinh thái Google Antigravity.

---

## 1. Phạm Vi Hoạt Động Của Skills (Scope)

Skills có thể được định nghĩa ở hai cấp độ phạm vi khác nhau tùy theo mục đích sử dụng:

* **Global Scope (Toàn cục - `~/.gemini/config/skills/`):** 
  * Khả dụng trên tất cả các sản phẩm Antigravity (Antigravity IDE, Antigravity CLI) và tất cả các dự án trên máy tính của bạn.
  * Phù hợp cho các tiện ích chung như: định dạng JSON, sinh chuỗi UUID, kiểm tra định dạng mã nguồn (Linter), hoặc tích hợp với các công cụ cá nhân.
* **Project/Workspace Scope (Dự án - `<project-root>/.agents/skills/`):**
  * Chỉ khả dụng bên trong thư mục dự án cụ thể đó.
  * Thích hợp cho các quy trình làm việc đặc thù như: triển khai hạ tầng môi trường thử nghiệm, quản trị cơ sở dữ liệu của ứng dụng đó, hoặc sinh mã boilerplate cho các framework nội bộ.

---

## 2. Cài Đặt và Kích Hoạt Skills

### Quy trình cài đặt
1. Nhân bản (clone) kho lưu trữ chứa các kỹ năng mẫu từ GitHub: `https://github.com/rominirani/antigravity-skills`.
2. Truy cập vào thư mục `antigravity-skills/skills_tutorial`.
3. Sao chép 4 thư mục kỹ năng mẫu sau vào thư mục cấu hình Skills tương ứng:
   * `git-commit-formatter`
   * `license-header-adder`
   * `json-to-pydantic`
   * `database-schema-validator`

### Xác thực kích hoạt
* **Trong Antigravity UI:** Đặt câu hỏi trực tiếp *"What skills are available?"* để xem danh sách phản hồi.
* **Trong Antigravity CLI:** Chạy lệnh hệ thống `/skills` để kiểm tra danh sách các kỹ năng đã được nhận diện.

---

## 3. Chi Tiết Các Cấp Độ Kỹ Năng Thực Hành

### Cấp độ 1: Định tuyến Cơ Bản (Level 1: Basic Router - `git-commit-formatter`)
* **Mục tiêu:** Tự động chuẩn hóa nội dung thông điệp Git Commit theo chuẩn *Conventional Commits* (ví dụ: `feat(auth): implement login with google`).
* **Phương pháp:** Chỉ sử dụng các chỉ dẫn nhắc nhở (Prompting) viết trong tệp `SKILL.md` để quy định cấu trúc và ràng buộc của nội dung văn bản.
* **Xác thực:** Tạo thư mục kiểm thử `git_test`, khởi tạo Git, chỉnh sửa code và yêu cầu Agent thực hiện commit với chỉ dẫn sử dụng Conventional Commits. Sau đó kiểm tra lại bằng `git log`.

### Cấp độ 2: Tận Dụng Tài Nguyên Tĩnh (Level 2: Asset Utilization - `license-header-adder`)
* **Mục tiêu:** Tự động chèn thêm đoạn bản quyền Apache 2.0 (License Header) vào đầu các tệp mã nguồn mới tùy theo ngôn ngữ.
* **Phương pháp:** Đưa mẫu bản quyền dài dòng ra một tệp tin tĩnh đặt tại `resources/HEADER_TEMPLATE.txt`. Việc này giúp tiết kiệm dung lượng cửa sổ ngữ cảnh (Context Window) của LLM và tránh lỗi biến đổi nội dung pháp lý.
* **Xác thực:** Tạo tệp `my_script.py`, yêu cầu Agent chạy kỹ năng `license-header-adder`. Agent sẽ tự động đọc template, chuyển đổi ký hiệu chú thích khối (C-style) sang chú thích dòng Python (`#`) và dán vào đầu tệp.

### Cấp độ 3: Học Qua Ví Dụ (Level 3: Few-Shot Pattern - `json-to-pydantic`)
* **Mục tiêu:** Chuyển đổi dữ liệu JSON thô (như dữ liệu trả về từ API) thành các lớp đối tượng Python định kiểu mạnh bằng Pydantic.
* **Phương pháp:** Cung cấp ví dụ mẫu trực quan `Before/After` trong thư mục `examples/` (`input_data.json` và `output_model.py`) làm mẫu học nhanh (Few-shot) cho mô hình để nó tự suy luận cấu trúc tối ưu thay vì viết hàng chục quy tắc tiếng Anh phức tạp.
* **Xác thực:** Tạo tệp dữ liệu `product.json` và yêu cầu Agent chuyển đổi nó thành Pydantic model lưu tại `product_model.py`.

### Cấp độ 4: Tích Hợp Logic Thủ Tục (Level 4: Procedural Logic - `database-schema-validator`)
* **Mục tiêu:** Kiểm tra tính an toàn và đúng quy chuẩn của các tệp SQL Schema.
* **Phương pháp:** Ủy quyền toàn bộ logic kiểm tra phức tạp cho một kịch bản lập trình Python thực tế (`validate_schema.py` đặt trong `scripts/`). Điều này đảm bảo tính chính xác tuyệt đối (nhận dạng drop table, snake_case, primary key `id`), loại bỏ các lỗi ảo giác suy luận của LLM.
* **Xác thực:** Tạo tệp SQL lỗi `bad_schema.sql` (có chứa DROP TABLE, camelCase) và yêu cầu Agent chạy kiểm tra. Agent sẽ thực thi mã Python qua lệnh hệ thống, đọc mã lỗi phản hồi và hiển thị các gợi ý sửa lỗi tương ứng lên khung chat.
