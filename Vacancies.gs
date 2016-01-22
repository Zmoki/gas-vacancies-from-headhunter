var published_at_column = 3;
var created_at_column = 4;

function loadVacancies(dateFrom) {
  var base_url = 'https://api.hh.ru/vacancies?'
  + 'area=2'
  + '&text=javascript'
  + '&per_page=100';

  if(dateFrom) {
    base_url += '&date_from=' + encodeURIComponent(dateFrom);
  }

  var items = [];

  function sendPagingRequest(page) {
    var url = base_url
    + '&page=' + page;

    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);

    items = items.concat(data.items);

    if((page + 1) < data.pages) {
      sendPagingRequest(page + 1);
    }
  }

  sendPagingRequest(0);

  return items;
}

function vacanciesToSheet(vacancies) {
  var rows = [], row, vacancy;

  for(var i = 0; i < vacancies.length; i++) {
    vacancy = vacancies[i];
    row = [];

    row.push(vacancy.id);
    row.push(vacancy.employer.id);
    row.push(vacancy.published_at);
    row.push(myDate(vacancy.created_at));
    row.push(vacancy.name);
    row.push((vacancy.salary != null && vacancy.salary.from != null) ? vacancy.salary.from : '');
    row.push((vacancy.salary != null && vacancy.salary.to != null) ? vacancy.salary.to : '');
    row.push((vacancy.salary != null && vacancy.salary.currency != null) ? vacancy.salary.currency : '');
    row.push(vacancy.employer.name);
    row.push(vacancy.employer.alternate_url);
    row.push(vacancy.snippet.responsibility ? vacancy.snippet.responsibility.replace(/(<highlighttext>|<\/highlighttext>)/g, '') : '');
    row.push(vacancy.snippet.requirement ? vacancy.snippet.requirement.replace(/(<highlighttext>|<\/highlighttext>)/g, '') : '');
    row.push(vacancy.alternate_url);

    rows.push(row);
  }

  insertRows(rows);
}

function allVacancies() {
  clearSheet();
  var vacancies = loadVacancies();
  vacanciesToSheet(vacancies);
  var sheet = getSheet();
  sheet.sort(published_at_column, false);
}

function freshVacancies() {
  var sheet = getSheet();

  sheet.sort(published_at_column);

  var last_row = sheet.getLastRow();

  var cell_published_at = sheet.getRange(sheet.getLastRow(), published_at_column);

  var last_date = cell_published_at.getValue();

  var vacancies = loadVacancies(last_date);

  var cells_id = sheet.getRange(2, 1, last_row - 1);

  var ids = (cells_id.getValues()).map(function(id) {
    return id.toString();
  });

  var new_vacancies = [];
  var update_vacancies = [];
  for(var i = 0; i < vacancies.length; i++) {
    var in_ids = ids.indexOf(vacancies[i].id);

    if(!~in_ids) {
      new_vacancies.push(vacancies[i]);
    } else {
      update_vacancies.push({
        row: in_ids + 2,
        vacancy: vacancies[i]
      });
    }
  }

  if(update_vacancies.length) {
    for(var i = 0; i < update_vacancies.length; i++) {
      var cell = sheet.getRange(update_vacancies[i].row, published_at_column);
      cell.setValue(update_vacancies[i].vacancy.published_at);

      cell = sheet.getRange(update_vacancies[i].row, created_at_column);
      cell.setValue(myDate(update_vacancies[i].vacancy.created_at));
    }
  }

  if(new_vacancies.length) {
    vacanciesToSheet(new_vacancies.length);
  }

  sheet.sort(published_at_column, false);
}
