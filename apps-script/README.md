# Hiển thị lời chúc trên thiệp

1. Mở dự án Apps Script đang nhận xác nhận tham dự.
2. Thay nội dung tệp **Mã.gs** bằng toàn bộ nội dung [Code.gs](Code.gs), rồi lưu.
3. Vào **Triển khai → Quản lý các bản triển khai**, chọn bản Web App hiện tại và bấm biểu tượng bút chì.
4. Tại **Phiên bản**, chọn **Phiên bản mới**, rồi bấm **Triển khai**. Giữ nguyên URL `/exec` và quyền truy cập công khai cho khách mời.
5. Mở URL Web App hiện tại với `?action=wishes` ở cuối. Khi đúng, trang trả về `{"result":"success","wishes":[...]}`.
6. Mở lại trang thiệp và bấm **Tải lại lời chúc**.

Mã dùng đúng cấu trúc Google Sheets hiện tại: A = thời gian, B = tên, C = tham dự, D = lời chúc. Dữ liệu cũ được giữ nguyên. Chỉ tên và lời chúc được trả về website; không cần công khai bảng tính.

Lời chúc mới nhất xuất hiện trước. Dòng tiêu đề, lời chúc trống và hai bản ghi kiểm tra kết nối trước đây được bỏ qua. Xóa một dòng trong Sheet sẽ gỡ lời chúc đó sau khi tải lại trên thiệp.

Không bấm **Chạy** trực tiếp `doPost` để thử gửi. Hãy gửi từ form trên thiệp, rồi kiểm tra dòng mới trong Sheet. Với `doGet`, dùng URL có `?action=wishes` để kiểm tra.

Tài liệu chính thức: [Apps Script Web Apps](https://developers.google.com/apps-script/guides/web) và [quản lý phiên bản triển khai](https://developers.google.com/apps-script/concepts/deployments#manage_versioned_deployments).
