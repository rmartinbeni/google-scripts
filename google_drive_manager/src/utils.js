function getOrCreateSpreadsheet() {
  var files = DriveApp.getFilesByName(SHEETNAME)
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next())
  } else {
    return SpreadsheetApp.create(SHEETNAME)
  }
}

function clearSheet(sheet) {
  sheet.clear()
}

function addHeaders(sheet) {
  var headers = ['Id', 'Nombre del Archivo', 'Última Modificación', 'Carpeta', 'Compartido', 'Tamaño', 'Acciones']
  sheet.appendRow(headers)

  var headerRange = sheet.getRange(1, 1, 1, headers.length)
  headerRange.setFontWeight('bold')
  headerRange.setBackground('#22a5f7')
  headerRange.setFontSize(10)
  headerRange.setHorizontalAlignment('center')
}

function addDataToSheet(sheet, files) {
  var data = files.map(function (file) {
    return [file.id, file.name, file.lastUpdated, file.folder, file.shared, file.size, '']
  })
  sheet.getRange(2, 1, data.length, 7).setValues(data)

  var actionRange = sheet.getRange(2, 7, data.length)
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(['Eliminar', 'Ver Detalles'], true).build()
  actionRange.setDataValidation(rule)
}
