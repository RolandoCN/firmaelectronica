function btn_eliminar_ED(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// ============================ METODOS PARA LA GESTIÓN DE CAMARA ==================================

    function sector_editar_ED(idep){
        $.get("/gestionInsidencia/evento_departamento/"+idep+"/edit", function (resultado) {

            $('.option_evento').prop('selected',false); // deseleccioamos todas las zonas del combo
            $('.option_departamento').prop('selected',false); // deseleccioamos todas las zonas del combo
            $(`#idevento option[value="${resultado.resultado.idevento}"]`).prop('selected',true);
            $(`#iddepartamento option[value="${resultado.resultado.iddepartamento}"]`).prop('selected',true);
            $("#idevento").trigger("chosen:updated"); // actualizamos el combo
            $("#iddepartamento").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_eventoDepartamento').val('PUT'); // decimo que sea un metodo put
        $('#frm_eventoDepartamento').attr('action','/gestionInsidencia/evento_departamento/'+idep); // actualizamos la ruta del formulario para actualizar
        $('#btn_eventoDepartamento_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_eventoDepartamento').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_eventoDepartamento_cancelar').click(function(){
        $('.option_evento').prop('selected',false);
        $('.option_departamento').prop('selected',false);
        $("#idevento").trigger("chosen:updated");
        $("#iddepartamento").trigger("chosen:updated");
        $('#method_eventoDepartamento').val('POST');
        $('#frm_eventoDepartamento').attr('action','/gestionInsidencia/evento_departamento'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE CAMARA ==================================