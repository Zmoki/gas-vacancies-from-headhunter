function loadVacanciesTest() {
  var items = loadVacancies();
  Logger.log(items.length);
}

function loadVacanciesTestDateFrom() {
  var items = loadVacancies('2015-12-30');
  Logger.log(items.length);
}

function loadVacanciesTestDateFromFull() {
  var items = loadVacancies('2015-12-30T21:43:21+0300');
  Logger.log(items.length);
}
