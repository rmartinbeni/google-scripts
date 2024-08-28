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
