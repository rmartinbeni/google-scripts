function onOpen() {
  var ui = SpreadsheetApp.getUi()
  ui.createMenu('Drive Manager')
    .addItem('Listar archivos en Drive', 'listFilesInDrive')
    .addItem('Buscar archivos', 'show_search_form')
    //.addItem('Eliminar Archivos Marcados', 'deleteMarkedFiles')
    .addToUi()
}

const show_search_form = () => {
  var form = HtmlService.createHtmlOutputFromFile('src/templates/search_form').setTitle('Search Files')
  SpreadsheetApp.getUi().showSidebar(form)
}
