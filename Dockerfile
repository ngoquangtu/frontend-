# Sử dụng Node.js làm base image
FROM node:16

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng
# FROM nginx:alpine
# COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
