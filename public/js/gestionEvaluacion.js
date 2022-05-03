



// ============================ METODOS PARA LA GESTIÓN DE EVALUACION ==================================
    function sector_editar_evaluacion(ideva){
        $.get("/gestionEvaluacionPoa/evaluacion/"+ideva+"/edit", function (resultado) {
            //console.log(resultado);
            $('#fecha_inicio').val(resultado.resultado.fecha_inicio);
            $('#fecha_fin').val(resultado.resultado.fecha_fin);
            $('#numero').val(resultado.resultado.numero);
            $('.option_periodo').prop('selected',false);
            $(`#idperiodo option[value="${resultado.resultado.idperiodo}"]`).prop('selected',true);
            $("#idperiodo").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_evaluacion').val('PUT'); // decimo que sea un metodo put
        $('#frm_evaluacion').attr('action','/gestionEvaluacionPoa/evaluacion/'+ideva);
        $('#btn_evaluacion_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_evaluacion').offset().top},400);
    }


    $('#btn_evaluacion_cancelar').click(function(){
        $('#fecha_inicio').val('');
        $('#fecha_fin').val('');
        $('#numero').val('');
        $('.option_periodo').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#idperiodo").trigger("chosen:updated"); // actualizamos el combo
        $('#method_evaluacion').val('POST'); // decimo que sea un metodo put
        $('#frm_evaluacion').attr('action','/gestionEvaluacionPoa/evaluacion'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE EVALUACION ==================================