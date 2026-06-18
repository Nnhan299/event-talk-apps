# Hướng Dẫn Thực Hành: Codelabs Step 6 - Phát triển Ứng dụng & Đẩy lên GitHub

Tài liệu này tổng hợp chi tiết nội dung của phần thực hành **Step 6** từ tài liệu Google Developers Codelab cho Antigravity CLI. Phần này tập trung vào hai hoạt động chính: lập trình ứng dụng đọc tin cập nhật (vibe coding) và làm việc với kho lưu trữ Git/GitHub.

---

## 1. Phát Triển Ứng Dụng (Vibe Coding)

### Yêu cầu ban đầu (Specification)
Người học đưa ra một đặc tả yêu cầu tự nhiên để Antigravity CLI tự động xây dựng ứng dụng:
> *"Hãy xây dựng một ứng dụng web bằng Python Flask, HTML, JavaScript và CSS thuần để lấy thông tin cập nhật của BigQuery từ XML Feed và hiển thị lên màn hình. Thiết kế một nút làm mới đơn giản kèm hiệu ứng tải xoay vòng. Tôi cũng muốn có khả năng chọn một cập nhật cụ thể để soạn thảo nội dung đăng lên Twitter."*

### Quy trình thực hiện của Antigravity CLI
1. **Khảo sát không gian làm việc:** Quét thư mục hiện hành để tìm kiếm cấu trúc dự án có sẵn.
2. **Đọc cấu trúc XML Feed:** Gửi yêu cầu HTTP lấy dữ liệu từ XML Feed của Google Cloud để phân tích các thẻ namespace Atom (`<entry>`, `<title>`, `<content>`).
3. **Đề xuất Kế hoạch triển khai (Implementation Plan):**
   * CLI sẽ tạo một tệp kế hoạch dưới dạng Artifact (ví dụ: `implementation_plan.md`).
   * Người dùng sử dụng lệnh `/artifact` để xem xét, duyệt (approve) hoặc từ chối (reject) kế hoạch trước khi mã nguồn được viết.
4. **Tự động hóa xây dựng:**
   * Tạo môi trường ảo Python (`venv`).
   * Cài đặt thư viện thông qua `requirements.txt` (`Flask`, `requests`, `beautifulsoup4`).
   * Viết mã nguồn backend và frontend, sau đó chạy thử máy chủ Flask trên cổng `5000`.

---

## 2. Quản Lý Mã Nguồn Bằng Git & GitHub

### Tạo tệp bỏ qua (.gitignore)
Yêu cầu CLI tạo tệp cấu hình `.gitignore` để loại bỏ các tệp tin không cần thiết khỏi hệ thống quản lý phiên bản:
* Thư mục môi trường ảo (`venv/`, `.venv/`).
* Các tệp tin biên dịch Python (`__pycache__/`, `*.pyc`).
* Cấu hình cá nhân của IDE (`.vscode/`, `.idea/`).

### Đồng bộ lên GitHub
Quy trình đẩy toàn bộ mã nguồn lên một kho lưu trữ mới trên tài khoản GitHub cá nhân:
1. **Khởi tạo Git cục bộ:** Khởi chạy kho lưu trữ trống, tạo nhánh chính `main`, thêm toàn bộ tệp tin dự án và thực hiện commit đầu tiên.
2. **Tích hợp GitHub CLI:** Sử dụng công cụ `gh` (GitHub CLI) đã được xác thực trên máy để tự động tạo một kho lưu trữ trống mới trên đám mây với tên dạng `<Your-Name>-event-talks-app`.
3. **Liên kết và đẩy mã nguồn:** Kết nối kho lưu trữ cục bộ với remote URL của GitHub và thực hiện lệnh đẩy (`git push -u origin main`).

---

## 3. Mở Rộng Tính Năng Developer (Bài Tập Thực Hành Thêm)

Sau khi ứng dụng cơ bản đã vận hành tốt, bài thực hành yêu cầu người học tương tác với CLI để thực hiện các công việc bảo trì và nâng cấp phổ biến:

* **Đọc hiểu mã nguồn:** Yêu cầu CLI giải thích chi tiết cấu trúc tệp [app.py](file:///C:/Users/ngodn/bigquery-updates-app/app.py) hoặc cách thức hoạt động của các hàm định tuyến (Routing).
* **Tạo tài liệu hướng dẫn:** Yêu cầu CLI viết tệp thông tin dự án `README.md` tự động dựa trên cấu trúc thư mục hiện tại.
* **Xây dựng tính năng bổ sung:**
  * Thêm nút **"Copy to Clipboard"** (Sao chép vào khay nhớ tạm) tại mỗi thẻ cập nhật.
  * Thêm nút **"Export to CSV"** để tải về danh sách cập nhật dưới dạng bảng tính.
  * Thiết kế nút gạt chuyển đổi giao diện **Sáng / Tối (Dark/Light mode)** bằng cách ghi đè trực tiếp các biến CSS Root.
* **Đánh giá trải nghiệm người dùng (UX Assessment):** Yêu cầu CLI kiểm tra ứng dụng về độ mượt mà, tính phản hồi (responsiveness) và đề xuất danh sách các điểm cần cải tiến, sau đó chọn một mục để tự động triển khai sửa lỗi.
