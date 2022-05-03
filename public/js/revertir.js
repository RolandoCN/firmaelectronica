
function solicitarReversion(parametro) {

    $('#reversionModal').modal('show');

    $('#enviarSolicitud').val(parametro);
    
}

function revertir(){

    $('#enviarSolicitud').html('<span class="spinner-border " role="status" aria-hidden="true"></span> Procesando...');
    $('#enviarSolicitud').attr("disabled", true);
    
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var request = $.ajax({
        url: "reversion/"+ $('#enviarSolicitud').val(),
        method: "PUT",
        dataType: "json",
        data: { justificacion: $('#justificacion').val()},
      });
       
      request.done(function( msg ) {
        //var json = JSON.parse(msg);

        $('#reversionModal').modal('hide');

        console.log(msg.status); 

        $('#tr_'+$('#enviarSolicitud').val()).html('<td colspan="9"><div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>!SOLICITUD ENVIADA!</strong> La solicitud ha sido enviada satisfactoriamente, se procesar&aacute; y notificar&aacute; en los proximos minutos</div></td>');
                
        setTimeout(function(){
            $('#tr_'+$('#enviarSolicitud').val()).remove()
        }, 6000);  

        $('#enviarSolicitud').html('Enviar solicitud');
        $('#enviarSolicitud').attr("disabled", false);
        $('#justificacion').val('');

      });
       
      request.fail(function( jqXHR, textStatus ) {
        console.log("!Fail¡: " + textStatus );
     
      });
}

