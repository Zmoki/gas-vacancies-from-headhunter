function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function clearSheet() {
  var sheet = getSheet();

  var lastRow = sheet.getLastRow();

  if(lastRow > 2) {
    sheet.deleteRows(2, lastRow);
  }
}

function insertRows(rows) {
  var sheet = getSheet();

  rows.forEach(function(row) {
    sheet.appendRow(row);
  });
}
