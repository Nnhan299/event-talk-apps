# BigQuery Release Notes Tracker & Twitter Publisher

Một ứng dụng web nhỏ gọn được xây dựng bằng **Python Flask** (Backend) và **HTML, JavaScript, CSS thuần** (Frontend) để theo dõi các bản cập nhật phát hành (Release Notes) từ Google Cloud BigQuery và hỗ trợ chia sẻ trực tiếp lên Twitter (X).

---

## 🚀 Tính Năng Chính

* **Cập nhật Bảng tin thời gian thực**: Lấy dữ liệu XML trực tiếp từ Google Cloud BigQuery Release Notes Feed.
* **Làm mới thông tin nhanh**: Nút làm mới động với hiệu ứng xoay icon và hiển thị thời gian cập nhật gần nhất.
* **Tìm kiếm & Bộ lọc nhanh**: Tìm kiếm cập nhật theo từ khóa và lọc các thay đổi theo danh mục (`Feature`, `Announcement`, `Issue`, `Deprecation`) ngay tại máy khách.
* **Trình soạn thảo Twitter thông minh**: Tự động tạo bản pháp tweet tối ưu kèm liên kết nguồn khi chọn một thẻ cập nhật bất kỳ.
* **Bộ đếm ký tự & Vòng tiến trình SVG**: Theo dõi số lượng ký tự trực quan thời gian thực (Giới hạn 280 ký tự của X), thay đổi màu sắc vòng tròn cảnh báo và tự động khóa nút gửi khi quá độ dài.
* **Trình xem trước Tweet (X Live Preview)**: Minh họa bài đăng thực tế trước khi xuất bản.
* **Đăng Tweet ngay lập tức**: Sử dụng Twitter Web Intent giúp gửi bài viết an toàn, không cần cấu hình API Key hay bảo mật OAuth phức tạp ở máy chủ.

---

## 🛠️ Cấu Trúc Dự Án

* `app.py`: Máy chủ Flask xử lý tải và phân tích cú pháp XML Feed.
* `templates/index.html`: Cấu trúc giao diện ứng dụng.
* `static/css/style.css`: Thiết kế Dark Mode cao cấp và hiệu ứng chuyển động CSS.
* `static/js/app.js`: Logic quản lý trạng thái máy khách, tương tác và đăng tweet.
* `docs/`: Thư mục lưu trữ tài liệu phân tích chi tiết:
  * [implementation_plan.md](docs/implementation_plan.md): Kế hoạch và kiến trúc triển khai dự án.
  * [project_deep_dive.md](docs/project_deep_dive.md): Phân tích chi tiết vai trò Server-side/Client-side và Luồng xử lý dữ liệu.
  * [codelab_step6_summary.md](docs/codelab_step6_summary.md): Tài liệu tóm tắt nội dung Codelab hướng dẫn bài thực hành số 6 (Phát triển ứng dụng).
  * [getting_started_with_skills_step4.md](docs/getting_started_with_skills_step4.md): Tài liệu tóm tắt nội dung Codelab hướng dẫn lập trình kỹ năng (Skills) trên Antigravity.

---

## 💻 Cách Chạy Ứng Dụng Dưới Cục Bộ

### 1. Yêu cầu hệ thống
* Python 3.10 trở lên
* Trình quản lý gói `pip`

### 2. Thiết lập môi trường ảo và cài đặt thư viện
```bash
# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo
# Trên Windows (Powershell):
.\venv\Scripts\Activate.ps1
# Trên macOS/Linux:
source venv/bin/activate

# Cài đặt thư viện yêu cầu
pip install -r requirements.txt
```

### 3. Chạy máy chủ phát triển
```bash
python app.py
```
Ứng dụng sẽ khả dụng tại địa chỉ: **[http://127.0.0.1:5000](http://127.0.0.1:5000)**.
