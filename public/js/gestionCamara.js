

function btn_eliminar_camara(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
} 

// ============================ METODOS PARA LA GESTIÓN DE CAMARA ==================================

    function sector_editar_camara(idcamara){
        $.get("/gestionInsidencia/camara/"+idcamara+"/edit", function (resultado) {
            //console.log(resultado);
            $('#camara').val(resultado.resultado.nombre);
            $('#estado').val(resultado.resultado.estado);
            $('#latitud').val(resultado.resultado.latitud);
            $('#longitud').val(resultado.resultado.longitud);
            $('.option_camara').prop('selected',false);
            $(`#idparroquia option[value="${resultado.resultado.idparroquia}"]`).prop('selected',true);
            $("#idparroquia").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_camara').val('PUT'); // decimo que sea un metodo put
        $('#frm_camara').attr('action','/gestionInsidencia/camara/'+idcamara);
        $('#btn_camara_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_camara').offset().top},400);
    }


    $('#btn_camara_cancelar').click(function(){
        $('#camara').val('');
        $('#estado').val('');
        $('#latitud').val('');
        $('#longitud').val('');
        $('.option_camara').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#idparroquia").trigger("chosen:updated"); // actualizamos el combo
        $('#method_camara').val('POST'); // decimo que sea un metodo put
        $('#frm_camara').attr('action','/gestionInsidencia/camara'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE CAMARA ==================================