$(document).ready(function(){
    cargarContenidoTablas('listapendientes');
});
function cargarContenidoTablas(tabla) {
    $(`#${tabla}`).DataTable( {
        'order': [[1,'desc']],
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

function validarPago(parametro) {
    
    $("#"+parametro).html('<span class="spinner-border " role="status" aria-hidden="true"></span> Procesando...');
    $("#"+parametro).attr("disabled", true);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var request = $.ajax({
        url: "validacion/"+ parametro,
        method: "PUT",
        dataType: "json",
        data: parametro,
      });
       
    request.done(function( msg ) {
        //var json = JSON.parse(msg);
        console.log(msg); 
        console.log("!Done¡");

         //Valido que la tarea se haya ejecutado
        if(msg.status)
        {
            if(msg.statusPay == 'APPROVED')
            {
                $('#tr_'+parametro).html('<td colspan="8"><div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>!PAGO APROBADO!</strong> El pago ha sido aprobado satisfactoriamente por el sistema de pagos.</div></td>');
                
                setTimeout(function(){
                    $('#tr_'+parametro).remove()
                }, 10000);  
                $("#"+parametro).html('Validar Pago');
                $("#"+parametro).attr("disabled", false);
                
              
            }

            if(msg.statusPay == 'REJECTED')
            {
                $('#tr_'+parametro).html('<td colspan="8"><div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>!PAGO RECHAZADO!</strong> El pago ha sido verificado y no ha sido aprobado por el sistema de pagos.</div></td>');
                
                setTimeout(function(){
                    $('#tr_'+parametro).remove()
                }, 10000);  
                $("#"+parametro).html('Validar Pago');
                 $("#"+parametro).attr("disabled", false);
            }

            if(msg.statusPay == 'PENDING')
            {
                $('#pendingAlert').fadeIn(); //.delay(100000).fadeOut();
                setTimeout(function(){
                    $('#pendingAlert').fadeOut()
                }, 6000);  

                $("#"+parametro).html('Validar Pago');
                $("#"+parametro).attr("disabled", false);
            }

        }
        else
        {
            console.log('Estado:' + msg.statusPay +', Detalle: '+ msg.detalle);
            
            $('#errorAlert').fadeIn(); //.delay(100000).fadeOut();
            setTimeout(function(){
                $('#errorAlert').fadeOut()
            }, 6000);  

            $("#"+parametro).html('Validar Pago');
            $("#"+parametro).attr("disabled", false);
        }

         $('html,body').animate({scrollTop:$('#administrador_validacion').offset().top},400);
      });
       
    request.fail(function( jqXHR, textStatus ) {
        console.log("!Fail¡: " + textStatus );
        console.log('Estado:' + msg.statusPay +', Detalle: '+ msg.detalle);
            
        $('#errorAlert').fadeIn(); //.delay(100000).fadeOut();
        setTimeout(function(){
            $('#errorAlert').fadeOut()
        }, 6000);  

        $("#"+parametro).html('Validar Pago');
        $("#"+parametro).attr("disabled", false);
        $('html,body').animate({scrollTop:$('#administrador_validacion').offset().top},400);
    });
      
}