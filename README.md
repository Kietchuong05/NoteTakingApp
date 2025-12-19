# 📝 NoteTaking APP
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)]
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)]
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)]
[![License](https://img.shields.io/badge/License-MIT-A31F34?logo=open-source-initiative&logoColor=white)]

## 🚀 Tính Năng Chính

| Chức năng | Mô tả |
|----------|------|
| **Xác thực** | Đăng nhập bằng Google thông qua Firebase Authentication |
| **Quản lý người dùng** | Lưu thông tin người dùng sau khi đăng nhập |
| **Quản lý nội dung** | Soạn thảo nội dung bằng Tiptap Editor |
| **Giao diện** | UI hiện đại với Material UI + Emotion |
| **Routing** | Điều hướng trang với React Router DOM |
| **Animation** | Hiệu ứng mượt với Framer Motion |
---

## 🛠 Công Nghệ Sử Dụng

### Frontend
- **React 19**
- **Vite** – Công cụ build nhanh, nhẹ
- **React Router DOM v7** – Routing & bảo vệ route
- **Material UI (MUI)** – UI Component Library
- **Emotion** – CSS-in-JS cho MUI
- **Framer Motion** – Animation
- **Tiptap Editor** – Rich Text Editor
- **Firebase** – Google Authentication
### Backend
- Python 3.10+
- FastAPI – Framework xây dựng REST API nhanh, hiện đại
- Uvicorn – ASGI server cho FastAPI
- SQLAlchemy – ORM thao tác cơ sở dữ liệu
- MySQL – Hệ quản trị cơ sở dữ liệu
- mysql-connector-python / PyMySQL – Kết nối MySQL
- Pydantic – Validate và serialize dữ liệu
- python-dotenv – Quản lý biến môi trường
- python-dotenv – Quản lý biến môi trường
## ⚙️ Cài Đặt Dự Án
### Yêu Cầu Hệ Thống
- Node.js >= 18
- npm hoặc yarn
### Bước 1: Clone repository (tải dự án này về máy, bật Terminal của Visiual Studio Code hoặc các IDE khác để nhập lệnh)
```bash
git clone https://github.com/Kietchuong05/NoteTakingApp.git
cd NoteTaKingApp
```

### Bước 2: Cài đặt dependencies
```bash
# Tham chiếu đến thư mục frontend bằng cách:
cd frontend
```
```bash
# Sau khi tới đường dẫn frontend rồi thì thiết lập thư viện cần thiết (yêu cầu có ứng dụng Node.js trong máy):
npm install
```
```bash
# hoặc (Tuỳ, nhưng khuyến khích npm install)
yarn install
```
```bash
# Sau đó quay về thư mục gốc bằng cách:
cd ..
```
```bash
# Tiếp theo tham chiếu đến thư mục backend bằng cách:
cd backend
```
# sau đó nhập các lệnh sau
```bash
pip install -r requirements.txt
```
```bash
.\venv\Scripts\activate
```

### Bước 3: Khởi chạy ứng dụng 
```bash
# ở Console Terminal frontend (cd frontend):
npm run dev
```
```bash
# ở Console Terminal backend (cd backend):
uvicorn main:app --reload
```



