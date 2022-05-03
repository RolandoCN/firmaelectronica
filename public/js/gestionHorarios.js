function btn_eliminar_horarios(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

//---------funcion valida hora inicio-------------------------------------------//
function valida_hora_inicio(){
    var hora_inicio=document.getElementById('HoraInicio').value();
    var hora_fin=document.getElementById('HoraFin').value();
    if(hora_inicio < hora_fin)
    {
        alert("La hora de inicio debe ser mayor a la hora final");
        return false;
    }
    return true;
}



//_----------------------------------------------------------//

// seleccionamos en el combo sector//
      /*  $('.option_cmb_area').prop('selected',false); // deseleccioamos todas las zonas del combo
            $(`#cmb_area option[value="${resultado.resultado.zona.idzona}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
        $(`#cmb_area option[value="${resultado.resultado.areas.idperiodo}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
            $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo       */
// ============================ METODOS PARA LA GESTIÓN DE SECTORES ==================================

    function sector_editar_horarios(idhorarios_inspeccion){
        //console.log(idhorarios_inspeccion);
        $(".check_dia").iCheck('uncheck')// deseleccionamos los dias seleccioandos por defecto
        $.get("/gestionAgenda/registroHorario/"+idhorarios_inspeccion+"/edit", function (data){
   
                console.log(data);
                $('#HoraInicio').val(data.resultado.horaInicio);
                $('#HoraFin').val(data.resultado.horaFin);
                  $('#cantidad_Turnos').val(data.resultado.cantidadTurnos);
                $('#mediaAtencion').val(data.resultado.mediaAtencion);
            
            $.each(data.resultado.detalle,function(i,item){
               // console.log(item.dia);
                 if(item.dia=="Lunes"){
                
                    $('#check_lunes').iCheck('check');
                 }
                if(item.dia=="Martes"){
                
                 $('#check_martes').iCheck('check');
                }
                if(item.dia=="Miercoles"){
                
                 $('#check_miercoles').iCheck('check');
                }
                if(item.dia=="Jueves"){
                
                 $('#check_jueves').iCheck('check');
                }
                if(item.dia=="Viernes"){
                
                 $('#check_viernes').iCheck('check');
                }
            });
           
            $('.option_cmb_area').prop('selected',false); // deseleccioamos todas las zonas del combo
                $(`#cmb_area option[value="${data.resultado.departamento.iddepartamento}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
                $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo*/
                   
            
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_horario2').val('PUT'); 
        $('#frm_horarios2').prop('action',window.location.protocol+'//'+window.location.host+'/gestionAgenda/registroHorario/'+idhorarios_inspeccion);
        $('#btn_horario_cancelar').removeClass('hidden');// mostramos el boton cancelaradministrador_horarios

        $('html,body').animate({scrollTop:$('#administrador_horarios').offset().top},400);// realizamos la animación de subir a la parte superior de la pagina        
    }


   //ACCION DEL BOTON DE CANCELAR EN ZONA
$('#btn_horario_cancelar').click(function(){
    $('#HoraInicio').val('');
    $('#HoraFin').val('');
    $('#check_dias').val('');
    $('#cantidad_Turnos').val('');
    $('#mediaAtencion').val('');
    $('#cmb_area').val('');
    $(".check_dia").iCheck('uncheck')// deseleccionamos los dias seleccioandos por defecto
    
    $('#method_horario2').val('POST'); // decimos que sea un metodo put
    $('#frm_horarios2').prop('action',window.location.protocol+'//'+window.location.host+'/gestionAgenda/registroHorario');
    $(this).addClass('hidden');
});

// ============================ /METODOS PARA LA GESTIÓN DE SECTORES ==================================




//######################################################################################################


