function btn_eliminar_EI(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// ============================ METODOS PARA LA GESTIÓN DE CAMARA ==================================

    function sector_editar_EI(id){
        $.get("/gestionInsidencia/evento_institucion/"+id+"/edit", function (resultado) {

            $('.option_evento').prop('selected',false); // deseleccioamos todas las zonas del combo
            $('.option_institucion').prop('selected',false); // deseleccioamos todas las zonas del combo
            $(`#idevento option[value="${resultado.resultado.idevento}"]`).prop('selected',true);
            console.log(resultado.resultado.idinstitucion);
            $(`#idinstitucion option[value="${resultado.resultado.idinstitucion}"]`).prop('selected',true);
            $("#idevento").trigger("chosen:updated"); // actualizamos el combo
            $("#idinstitucion").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_eventoInstitucion').val('PUT'); // decimo que sea un metodo put
        $('#frm_eventoInstitucion').attr('action','/gestionInsidencia/evento_institucion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_eventoInstitucion_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_eventoInstitucion').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_eventoInstitucion_cancelar').click(function(){
        $('.option_evento').prop('selected',false);
        $('.option_institucion').prop('selected',false);
        $("#idevento").trigger("chosen:updated");
        $("#idinstitucion").trigger("chosen:updated");
        $('#method_eventoInstitucion').val('POST');
        $('#frm_eventoInstitucion').attr('action','/gestionInsidencia/evento_institucion'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE CAMARA ==================================