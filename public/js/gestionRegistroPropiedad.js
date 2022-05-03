
    function adjuntarDepartamento(input_file, btn){
        $("#"+input_file).click(); // abrimos el input file para seleccionar el documento
        $("#"+input_file).change(function (){
            console.clear();
            var nombreDocSelc = "Seleccione un documento";
            if($(this)[0].files[0]){
                nombreDocSelc = $(this)[0].files[0].name; // obtenemos el nombre del documento seleccionado
            }
            $(btn).parent().siblings('.document_name').val(nombreDocSelc);                
        });
    }