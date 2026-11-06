# Hiển thị lời chúc trên thiệp

1. Mở dự án Apps Script đang nhận xác nhận tham dự.
2. Thay nội dung tệp **Mã.gs** bằng toàn bộ nội dung [Code.gs](Code.gs), rồi lưu.
3. Vào **Triển khai → Quản lý các bản triển khai**, chọn bản Web App hiện tại và bấm biểu tượng bút chì.
4. Tại **Phiên bản**, chọn **Phiên bản mới**, rồi bấm **Triển khai**. Giữ nguyên URL `/exec` và quyền truy cập công khai cho khách mời.
5. Mở URL Web App hiện tại với `?action=wishes` ở cuối. Khi đúng, trang trả về `{"result":"success","wishes":[...]}`.
6. Mở lại trang thiệp và bấm **Tải lại lời chúc**.

Mã đọc và ghi đúng tab **thiep_cuoi** trong Google Sheets liên kết, với cấu trúc: A = thời gian, B = tên, C = tham dự, D = lời chúc. Nếu đổi tên tab, cần sửa tên tương ứng trong hàm `rsvpSheet_`. Dữ liệu cũ được giữ nguyên. Chỉ tên và lời chúc được trả về website; không cần công khai bảng tính.

Lời chúc mới nhất xuất hiện trước. Chỉ bỏ dòng tiêu đề và các dòng thiếu tên hoặc lời chúc; không lọc theo tên người gửi hoặc định dạng ô thời gian. Các dòng nhập tay và lời chúc cũ vẫn được hiển thị. Nếu còn bản ghi kiểm tra kết nối, bạn có thể xóa trực tiếp trong Sheet. Xóa một dòng sẽ gỡ lời chúc đó sau khi tải lại trên thiệp.

Không bấm **Chạy** trực tiếp `doPost` để thử gửi. Hãy gửi từ form trên thiệp, rồi kiểm tra dòng mới trong Sheet. Với `doGet`, dùng URL có `?action=wishes` để kiểm tra.

Tài liệu chính thức: [Apps Script Web Apps](https://developers.google.com/apps-script/guides/web) và [quản lý phiên bản triển khai](https://developers.google.com/apps-script/concepts/deployments#manage_versioned_deployments).

## Tiệc tham dự, số người và link mời riêng

Form xác nhận thêm lựa chọn tiệc nhà gái, nhà trai hoặc cả hai tiệc, cùng số người từ 1 đến 50 (tính cả người gửi). Khi chọn cả hai tiệc, số người áp dụng cho mỗi tiệc. Chọn không tham dự sẽ ẩn phần tiệc và số người.

Để tương thích ngay với Apps Script đang triển khai, toàn bộ lựa chọn được lưu ở cột C, ví dụ: `Có, chắc chắn rồi! | Tiệc nhà gái | 3 người`. Bốn cột A-D được giữ nguyên, không cần triển khai lại Apps Script để dùng phần này. Tên và lời chúc công khai vẫn lấy từ cột B và D.

Mở [trang tạo link](../tao-link.html) để nhập tên khách, tùy chọn tiệc mặc định rồi sao chép link. Tham số `khach` điền tên ở bìa, lời mời và form; tham số `tiec` chọn sẵn tiệc, khách vẫn có thể đổi khi xác nhận. Mỗi lần sửa tên hoặc tiệc, cần bấm **Tạo link mời** lại để tránh sao chép nhầm link cũ.
