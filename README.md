# 📚 Book Backend API

## 🚀 Giới thiệu

**Book Backend API** là hệ thống backend cho website bán sách, cung cấp API cho frontend (React) giao tiếp.

Dự án được xây dựng theo kiến trúc **RESTful API**, hỗ trợ đầy đủ các chức năng của hệ thống e-commerce:

* Authentication (JWT)
* Quản lý sản phẩm
* Quản lý đơn hàng
* Quản lý người dùng
* Coupon / giảm giá
* Thống kê doanh thu

---

## 🛠️ Công nghệ sử dụng

* 🟢 Node.js
* 🚂 Express.js
* 🟦 TypeScript
* 🗄️ Prisma ORM
* 🐘 PostgreSQL (hoặc MySQL)
* 🔐 JWT (jsonwebtoken)
* 📄 Swagger (API Docs)
* 🐳 Docker

---

## 📂 Cấu trúc thư mục

```
src/
│── controllers/     # Xử lý request/response
│── services/        # Business logic
│── routes/          # Định nghĩa API routes
│── middlewares/     # Auth, validate...
│── utils/           # Helper functions
│── configs/         # Config (env, db...)
│── modules/         # Chia theo domain (auth, user, product...)

prisma/
│── schema.prisma    # Database schema
```

---

## ⚙️ Cài đặt

### 1. Clone project

```bash
git clone https://github.com/your-username/book-backend-react.git
cd book-backend-react
```

### 2. Cài dependencies

```bash
npm install
# hoặc
yarn
```

### 3. Cấu hình môi trường

Tạo file `.env`:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/book_db"
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

### 4. Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Chạy project

```bash
npm run dev
```

Server chạy tại:

```
http://localhost:5000
```

---

## 🔐 Authentication

Sử dụng **JWT + Refresh Token**:

* Access Token: thời gian ngắn
* Refresh Token: dùng để cấp lại access token

Flow:

1. Login → trả về access + refresh token
2. Gọi API → gửi access token
3. Hết hạn → dùng refresh token để cấp lại

---

## 📌 API chính

### 👤 Auth

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/refresh`

### 📚 Product

* `GET /products`
* `GET /products/:id`
* `POST /products`
* `PUT /products/:id`
* `DELETE /products/:id`

### 🛒 Order

* `POST /orders`
* `GET /orders`
* `GET /orders/:id`

### 🎟️ Coupon

* `POST /coupons`
* `GET /coupons`
* `POST /coupons/apply`

---

## 📄 Swagger Docs

API documentation:

```
http://localhost:5000/api-docs
```

File cấu hình:

```
swagger.yaml
```

---

## 🐳 Docker

Build image:

```bash
docker build -t book-backend .
```

Run container:

```bash
docker run -p 5000:5000 book-backend
```

---

## 📊 Tính năng nâng cao

* ✅ Phân quyền (Admin / User)
* ✅ Middleware verifyToken
* ✅ Validate dữ liệu
* ✅ Logging
* ✅ Pagination
* ✅ Revenue thống kê (weekly, monthly)

---

## 🤝 Đóng góp

```bash
# Tạo branch
git checkout -b feature/your-feature

# Commit
git commit -m "Add feature"

# Push
git push origin feature/your-feature
```

---

## 📄 License

MIT License

---

## 👨‍💻 Tác giả

**HoQuocNam92** 🚀

---

## ⭐ Nếu thấy hữu ích hãy star repo nhé!
