var btnSubmit = $("#btn-submit");
var divVizu = $("#div-vizualizacao");
var fileName = $("#file-name");
var title = $("#title");
var formFile = $("#formFile");
var jsonViewer = $("#json-viewer");

// Método responsável por executar um requisição POST para executar o processamento do arquivo e recebe-ló como retorno
function processFile() {
  $.ajax({
    type: "POST",
    url: "/process",
    timeout: 60000, // Definir um tempo limite
    // Manipular o sucesso da requisição
    success: function(data) {
      // Ativar o botão de "processamento"
      $(btnSubmit).prop("disabled", true);
      // Some com form de input
      $(formFile).hide();
      // Mudando o título
      $(title).text("Arquivo processado e pronto para vizualização:");
      // Ativar div de vizualização
      $(divVizu).fadeIn("slow");
      
      // data -> variável se refere ao arquivo processado
      $(jsonViewer).jsonViewer(data, {collapsed: true, withQuotes: false, rootCollapsable: false});
    },
    // Manipular erros da requisição
    error: function() {
      alert("Houve um erro ao realizar sua requisição! Tente novamente.");

      location.reload();
    }
  });
}

// Atribuições de eventos e procedimentos iniciais
$(document).ready(function() {
  // Botão de Submissão/Processamento do log iniciará como desabilitado
  $(btnSubmit).prop("disabled", true);
  $(divVizu).hide();

  // Evento para quando selecionar o arquivo
  $(fileName).change(function() {
    // Só habilitará o botão de enviar o arquivo se o arquivo for == games.log
    if (this.value == "games.log") {
      $(btnSubmit).prop("disabled", false);
    } else {
      $(btnSubmit).prop("disabled", true);
    }
  });

  $(btnSubmit).click(function(event) {
    event.preventDefault();
    event.stopPropagation();

    $(btnSubmit).prop("disabled", true);

    var form = $(formFile)[0];
    var data = new FormData(form);

    $.ajax({
      type: "POST",
      enctype: "multipart/form-data",
      url: "/",
      data: data,
      processData: false, // Impedir que o jQuery tranforma a "data" em querystring
      contentType: false, // Desabilitar o cabeçalho "Content-Type"
      cache: false, // Desabilitar o "cache"
      timeout: 60000, // Definir um tempo limite (opcional)
      // Manipular o sucesso da requisição
      success: function() {
        // Chama a requisição de processar o arquivo
        processFile();
      },
      // Manipular erros da requisição
      error: function() {
        alert("Houve um erro ao realizar sua requisição! Tente novamente.");

        // Reativar o botão de "submit"
        $(btnSubmit).prop("disabled", false);
      }
    });
  });
});
