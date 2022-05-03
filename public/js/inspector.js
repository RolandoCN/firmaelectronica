$(document).ready(function(){
    cargarContenidoTablas('datatableInspector');
});
function cargarContenidoTablas(tabla) {
    $(`#${tabla}`).DataTable( {
        "language": {
            "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                        '<option value="5">5</option>'+
                        '<option value="10">10</option>'+
                        '<option value="20">20</option>'+
                        '<option value="30">30</option>'+
                        '<option value="40">40</option>'+
                        '<option value="-1">Todos</option>'+
                        '</select> registros',
            "search": "Buscar:",
            "zeroRecords": "No se encontraron registros coincidentes",
            "infoEmpty": "No hay registros para mostrar",
            "infoFiltered": " - filtrado de MAX registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
        }
    }
} );
}

//elimnar el registro
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

//editar la tabla de inspector
function inspector_editar(idinspector){
	   
        $("#cmb_horario").html('');
        $("#cmb_horario").trigger("chosen:updated"); 
        $.get("/gestionAgenda/registroInspector/"+idinspector+"/edit", function (resultado) {
            $('.option_cmb_usuario').prop('selected',false); 
            $(`#cmb_usuario option[value="${resultado['resultado']['usuarios'].idus001}"]`).prop('selected',true); 
            $("#cmb_usuario").trigger("chosen:updated"); 
            $('.option_cmb_area').prop('selected',false); 
            $(`#cmb_area option[value="${resultado['resultado']['departamento'].iddepartamento}"]`).prop('selected',true); 
            $("#cmb_area").trigger("chosen:updated"); 
            $('#EstadoInspector').val(resultado['resultado'].estado)
            $("#fecha_inicio_inspector").val(resultado['resultado'].fechaInicio);
            $("#fecha_fin_inspector").val(resultado['resultado'].fechaFin);
            horariosPorAreas($('#cmb_area').val());
           

        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_inspector').val('PUT'); // decimo que sea un metodo put
        $('#frm_US_inspector').prop('action',window.location.protocol+'//'+window.location.host+'/gestionAgenda/registroInspector/'+idinspector); // actualizamos la ruta del formulario para actualizar
        $('#btn_inspector_cancelar').removeClass('hidden'); // mostramos el boton cancelar
        $('html,body').animate({scrollTop:$('#administrador_inspectores').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina        
    }

    $('#btn_inspector_cancelar').click(function(){
        $('.option_cmb_usuario').prop('selected',false); 
        $("#cmb_usuario").trigger("chosen:updated"); 
        $('.option_cmb_area').prop('selected',false); 
        $("#cmb_area").trigger("chosen:updated"); 
        $('.option_cmb_horario').prop('selected',false); 
         $("#cmb_horario").html(""); 
        $("#cmb_horario").trigger("chosen:updated"); 
        $('#method_inspector').val('POST'); 
        $('#frm_US_inspector').prop('action',window.location.protocol+'//'+window.location.host+'/gestionAgenda'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); 
    });

    //FIN editar


    function horariosPorAreas(idarea){
        $("#cmb_horario").append(`<option>Cargando...</option>`);
        $("#cmb_horario").trigger("chosen:updated"); 
    	var dias='';
        $.get("/gestionAgenda/horarioidArea/"+idarea, function (resultado) {
             $("#cmb_horario").html('');
             $("#cmb_horario").trigger("chosen:updated");

        	$.each(resultado['resultado'],function(i, item){

        		$.each(item['detalle'],function(i2, item2){
        			dias=dias+' '+item2.dia;
        		});

        		$("#cmb_horario").append(`<option class="option_cmb_horario" value="${item.idhorarios_inspeccion}">
                                                   ${item.horaInicio} - ${item.horaFin} - (
                                                   ${dias} ) - 
                                                   Turnos: ${item.cantidadTurnos}
                                                </option>`); 
        		$("#cmb_horario").trigger("chosen:updated"); 
        		dias='';
    	    });
             $("#cmb_horario").prop('disabled',false);
    	});
    	$("#cmb_horario").prop('disabled',false);

    }