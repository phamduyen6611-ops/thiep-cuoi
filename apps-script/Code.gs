// Dán toàn bộ mã này vào Mã.gs của dự án Apps Script đang nhận RSVP.
// Giữ nguyên Google Sheets liên kết: A = thời gian, B = tên,
// C = tham dự, D = lời chúc. Không cần công khai bảng tính.
// Đọc và ghi cùng tab thiep_cuoi, không phụ thuộc tab đang mở.

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return rsvpJson_({ result: 'error', message: 'Hãy gửi xác nhận từ trang thiệp.' });
    }
    var name = String(e.parameter.name || '').trim();
    var attend = String(e.parameter.attend || '').trim();
    var message = String(e.parameter.message || '').trim();
    if (!name || name.length > 80 || message.length > 2000) {
      return rsvpJson_({ result: 'error', message: 'Tên hoặc lời chúc chưa hợp lệ.' });
    }
    var sheet = rsvpSheet_();
    sheet.appendRow([
      new Date(),
      rsvpCellText_(name),
      rsvpCellText_(attend),
      rsvpCellText_(message)
    ]);
    return rsvpJson_({ result: 'success' });
  } catch (error) {
    console.error(error);
    return rsvpJson_({ result: 'error', message: 'Chưa lưu được xác nhận.' });
  }
}

function doGet(e) {
  try {
    if (!e || !e.parameter || e.parameter.action !== 'wishes') {
      return rsvpJson_({ result: 'error', message: 'Yêu cầu chưa hợp lệ.' });
    }
    var sheet = rsvpSheet_();
    var lastRow = sheet.getLastRow();
    // Chỉ đọc các cột B-D. Không yêu cầu ô thời gian phải có kiểu Date:
    // lời chúc nhập tay hoặc nhập từ dữ liệu cũ vẫn được hiển thị.
    var rows = lastRow ? sheet.getRange(1, 2, lastRow, 3).getDisplayValues() : [];
    var wishes = [];
    rows.forEach(function(row, index) {
      var name = String(row[0] || '').trim();
      var message = String(row[2] || '').trim();
      if (!name || !message) return;
      if (index === 0 && rsvpIsHeader_(name, message)) return;
      wishes.push({ id: String(index + 1), name: name, message: message });
    });
    // Chỉ công khai tên và lời chúc; không trả về thông tin tham dự.
    return rsvpJson_({ result: 'success', wishes: wishes.reverse() });
  } catch (error) {
    console.error(error);
    return rsvpJson_({ result: 'error', message: 'Chưa tải được lời chúc.' });
  }
}

function rsvpJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function rsvpSheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('thiep_cuoi');
  if (!sheet) throw new Error('Không tìm thấy tab thiep_cuoi.');
  return sheet;
}

function rsvpCellText_(value) {
  // Lưu lời chúc như văn bản, kể cả khi bắt đầu bằng ký tự công thức.
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function rsvpIsHeader_(name, message) {
  function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  var nameHeaders = ['ten', 'ho ten', 'ho va ten', 'ten cua ban', 'ten khach', 'ten khach moi', 'name'];
  var messageHeaders = ['loi chuc', 'loi chuc gui toi co dau chu re', 'message'];
  return nameHeaders.indexOf(normalize(name)) !== -1
    && messageHeaders.indexOf(normalize(message)) !== -1;
}
