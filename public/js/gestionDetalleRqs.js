function btn_eliminar_rqs(btn){
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

    function det_rqs_editar(iddetalleRqs){
        //console.log(idhorarios_inspeccion);
        $(".check_rqs").iCheck('uncheck')// deseleccionamos los dias seleccioandos por defecto
        $.get("/gestionRqs/detallerqs/"+iddetalleRqs+"/edit", function (data){
   
                console.log(data);       
          

            $.each(data.resultado.detalle_rqs,function(i,item){
                console.log(item.detalle);
                 if(item.detalle=="Reclamo"){
                
                    $('#check_reclamo').iCheck('check');
                 }
                if(item.detalle=="Queja"){
                
                 $('#check_queja').iCheck('check');
                }
                if(item.detalle=="Sugerencia"){
                
                 $('#check_sugerencia').iCheck('check');
                }
                
            });
               
                   
            $('#detalle').val(data.resultado.descripcion);
            //$('#cmb_detallerqs_area').val(data.re)
            $('.option_detallerqs_area').prop('selected',false); // deseleccioamos todas las zonas del combo
            $(`#cmb_detallerqs_area option[value="${data.resultado['areaDocumental']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
            $("#cmb_detallerqs_area").trigger("chosen:updated"); 

            $('.option_detallerqs_tipoproceso').prop('selected',false); // deseleccioamos todas las zonas del combo
            $(`#cmb_detallerqs_tipoproceso option[value="${data.resultado['tipoprocesoDocumental']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
            $("#cmb_detallerqs_tipoproceso").trigger("chosen:updated"); 
        
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_RQS').val('PUT'); 
        $('#frm_RQS').prop('action',window.location.protocol+'//'+window.location.host+'/gestionRqs/detallerqs/'+iddetalleRqs);
        $('#btn_rqs_cancelar').removeClass('hidden');// mostramos el boton cancelaradministrador_horarios

        $('html,body').animate({scrollTop:$('#administradorRqs').offset().top},400);// realizamos la animación de subir a la parte superior de la pagina        
    }


   //ACCION DEL BOTON DE CANCELAR EN ZONA
$('#btn_rqs_cancelar').click(function(){
    //seleccionamos los dias seleccioandos por defecto
    $('#check_rqs').val('');
    $('#detalle').val('');
     $(".check_rqs").iCheck('uncheck')// deseleccionamos los dias seleccioandos por defecto
    
    $('.option_detallerqs_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_detallerqs_area").trigger("chosen:updated"); // actualizamos el combo de zonas

    
    $('.option_detallerqs_tipoproceso').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_detallerqs_tipoproceso").trigger("chosen:updated"); // actualizamos el combo de zonas


    $('#method_RQS').val('POST'); // decimos que sea un metodo put
    $('#frm_RQS').prop('action',window.location.protocol+'//'+window.location.host+'/gestionRqs/detallerqs');
    $(this).addClass('hidden');
});

// ============================ /METODOS PARA LA GESTIÓN DE SECTORES ==================================




//######################################################################################################


