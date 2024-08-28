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
