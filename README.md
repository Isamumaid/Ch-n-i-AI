# Chèn Ơi! AI — triển khai trực tuyến

## Chạy thử trên máy tính
1. Cài Node.js 18 trở lên.
2. Mở terminal trong thư mục dự án.
3. Chạy `npm install`.
4. Cấu hình biến môi trường `GEMINI_API_KEY` (không ghi key vào `index.html` hoặc commit lên Git).
   - Windows PowerShell: `$env:GEMINI_API_KEY="DAN_API_KEY_CUA_BAN"; npm start`
   - macOS/Linux: `GEMINI_API_KEY="DAN_API_KEY_CUA_BAN" npm start`
5. Mở `http://localhost:3000`.

## Triển khai online (Render)
1. Tạo một repository GitHub mới và tải toàn bộ nội dung thư mục này lên.
2. Vào Render, tạo **New Web Service**, kết nối repository đó.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Trong Environment Variables, thêm:
   - `GEMINI_API_KEY` = API key mới của bạn
   - `GEMINI_MODEL` = `gemini-2.5-flash` (tùy chọn)
6. Deploy, đợi dịch vụ chạy rồi mở URL `https://...onrender.com` được cấp.
7. Gửi thử một câu trong chatbot. Mở nút **Kết nối** để kiểm tra trạng thái.

## Quan trọng về API key
- Không đăng API key trong mã frontend, GitHub, ảnh chụp hoặc tin nhắn công khai.
- File HTML cũ có một chuỗi trông giống API key được nhúng trực tiếp. Hãy vào Google AI Studio/Google Cloud để thu hồi hoặc xoay vòng key đó trước khi triển khai.
- Chỉ nhập key vào phần Environment Variables của máy chủ.
- Đường dẫn `/api/health` kiểm tra máy chủ đã nhận biến môi trường hay chưa; không tiết lộ key.
- QR code được tạo từ URL hiện tại. QR chỉ dùng để chia sẻ được sau khi đã deploy website.
