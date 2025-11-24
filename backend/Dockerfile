# Sử dụng Node.js bản 20 ổn định
FROM node:20-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies (chế độ production)
RUN npm install --production

# Copy toàn bộ source code của ứng dụng vào thư mục làm việc (./backend/)
# Giả định cấu trúc thư mục là:
# /backend/
#   /config
#   /models
#   server.js
#   ...
COPY . .

# Đặt biến môi trường mặc định (sẽ bị ghi đè bởi docker-compose)
ENV PORT=3000

# Mở cổng cho container
EXPOSE 3000

# Lệnh khởi động ứng dụng
# LƯU Ý: Chắc chắn rằng server.js của bạn đang sử dụng cú pháp ESM (import/export)
CMD ["node", "server.js"]