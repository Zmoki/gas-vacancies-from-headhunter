function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Vacancies')
      .addItem('Update vacancies', 'updateVacancies')
      .addToUi();
}

function updateVacancies() {
  freshVacancies();
}
