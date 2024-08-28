function onOpen() {
  var ui = SpreadsheetApp.getUi()
  ui.createMenu('Drive Manager')
    .addItem('Listar Archivos en Drive', 'listFilesInDrive')
    .addItem('Eliminar Archivos Marcados', 'deleteMarkedFiles')
    .addToUi()
}

function listFilesInDrive() {
  try {
    var files = getAllFiles()
    var sheet = getOrCreateSpreadsheet()
    var dataSheet = sheet.getActiveSheet()
    clearSheet(dataSheet)
    addHeaders(dataSheet)
    addDataToSheet(dataSheet, files)
    Logger.log(
      `El script se ha completado con éxito. Puedes ver los resultados en la hoja de cálculo: ${sheet.getUrl()}`
    )
  } catch (e) {
    Logger.log('Error: ' + e.message)
  }
}

function getAllFiles() {
  var files = []
  var allFiles = DriveApp.searchFiles('trashed = false')

  while (allFiles.hasNext()) {
    var file = allFiles.next()
    var folders = file.getParents()
    var folderName = folders.hasNext() ? folders.next().getName() : 'Root'
    var isShared = file.getSharingAccess() !== DriveApp.Access.PRIVATE
    var fileSize = rmartinbeni_lib.humanFileSize(file.getSize())

    files.push({
      id: file.getId(),
      name: file.getName(),
      lastUpdated: file.getLastUpdated(),
      folder: folderName,
      shared: isShared ? 'Sí' : 'No',
      size: fileSize,
    })
  }

  return files
}

function getOrCreateSpreadsheet() {
  var spreadsheetName = '⚙️ Google Drive Manager'
  var files = DriveApp.getFilesByName(spreadsheetName)
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next())
  } else {
    return SpreadsheetApp.create(spreadsheetName)
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

function deleteFile(fileId) {
  try {
    var file = DriveApp.getFileById(fileId)
    var ui = SpreadsheetApp.getUi()
    var response = ui.alert(
      'Confirmación',
      `¿Estás seguro de que deseas eliminar el archivo ${file.getName()} ?`,
      ui.ButtonSet.YES_NO
    )

    if (response == ui.Button.YES) {
      file.setTrashed(true)
      ui.alert('Archivo eliminado con éxito.')
      listFilesInDrive()
    }
  } catch (e) {
    Logger.log('Error: ' + e.message)
    SpreadsheetApp.getUi().alert('Error: ' + e.message)
  }
}

function deleteMarkedFiles() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var data = sheet.getDataRange().getValues()
  var ui = SpreadsheetApp.getUi()
  var filesToDelete = []

  for (var i = 1; i < data.length; i++) {
    var action = data[i][6]
    var fileId = data[i][0]

    if (action === 'Eliminar') {
      filesToDelete.push(fileId)
    }
  }

  Logger.log(`Archivos a eliminar: ${filesToDelete.join(', ')}`)

  if (filesToDelete.length > 0) {
    var response = ui.alert(
      'Confirmación',
      `¿Estás seguro de que deseas eliminar ${filesToDelete.length} archivos?`,
      ui.ButtonSet.YES_NO
    )

    if (response == ui.Button.YES) {
      filesToDelete.forEach(function (fileId) {
        try {
          var file = DriveApp.getFileById(fileId)
          Logger.log(`Eliminando archivo: ${fileId}`)
          file.setTrashed(true)
        } catch (e) {
          Logger.log(`Error al eliminar archivo ${fileId}: ${e.message}`)
        }
      })
      Logger.log('Archivos eliminados con éxito.')
      listFilesInDrive()
    }
  } else {
    Logger.log('No hay archivos marcados para eliminar.')
  }
}
