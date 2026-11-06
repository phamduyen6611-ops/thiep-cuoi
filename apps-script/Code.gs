// Dán toàn bộ mã này vào Mã.gs của dự án Apps Script đang nhận RSVP.
// Giữ nguyên Google Sheets liên kết: A = thời gian, B = tên,
// C = tham dự, D = lời chúc. Không cần công khai bảng tính.

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
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var rows = lastRow ? sheet.getRange(1, 1, lastRow, 4).getValues() : [];
    var testNames = [
      'KIEM TRA KET NOI - CO THE XOA',
      'KIEM TRA TRINH DUYET - CO THE XOA'
    ];
    var wishes = [];
    rows.forEach(function(row, index) {
      // Chỉ nhận các dòng có thời gian hợp lệ do form ghi; bỏ dòng tiêu đề.
      if (!(row[0] instanceof Date) || isNaN(row[0].getTime())) return;
      var name = String(row[1] || '').trim();
      var message = String(row[3] || '').trim();
      if (!name || !message || testNames.indexOf(name) !== -1) return;
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

function rsvpCellText_(value) {
  // Lưu lời chúc như văn bản, kể cả khi bắt đầu bằng ký tự công thức.
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}
