$(document).ready(function(){
    cargarContenidoTablas('listapagostable');
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

function revertirPago(parametro) {
    
    $('#reversionModal').modal('show');

    $('#enviarSolicitud').val(parametro);
    
}

function revertir(parametro){

    $('#enviarSolicitud').html('<span class="spinner-border " role="status" aria-hidden="true"></span> Procesando...');
    $('#enviarSolicitud').attr("disabled", true);
    
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var request = $.ajax({
        url: "reversionClient/"+ $('#enviarSolicitud').val(),
        method: "PUT",
        dataType: "json"
      });
       
      request.done(function( msg ) {
        //var json = JSON.parse(msg);

        $('#reversionModal').modal('hide');

         //var json = JSON.parse(msg);
         console.log(msg.status); 

         if(msg.status)
         {
             $('#successAlert').fadeIn(); //.delay(100000).fadeOut();

             setTimeout(function(){
                 $('#successAlert').fadeOut()
             }, 4000);  

             $('#tr_'+$('#enviarSolicitud').val()).html('<td colspan="8"><div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>!PAGO REVERTIDO!</strong> </div></td>');
                
             setTimeout(function(){
                 $('#tr_'+$('#enviarSolicitud').val()).remove()
             }, 10000);  

         }else
         {
            $('#errorAlert').fadeIn(); //.delay(100000).fadeOut();

            setTimeout(function(){
                $('#errorAlert').fadeOut()
            }, 4000);  
         }
          $('#enviarSolicitud').html('Revertir');
          $('#enviarSolicitud').attr("disabled", false);
        $('html,body').animate({scrollTop:$('#administrador_pendientes').offset().top},400);

      });
       
      request.fail(function( jqXHR, textStatus ) {
        $('#reversionModal').modal('hide');

        console.log("!Fail¡: " + textStatus );
        $('#errorAlert').fadeIn(); //.delay(100000).fadeOut();

        setTimeout(function(){
            $('#errorAlert').fadeOut()
        }, 4000);  
         $('#enviarSolicitud').html('Revertir');
          $('#enviarSolicitud').attr("disabled", false);
        $('html,body').animate({scrollTop:$('#administrador_pendientes').offset().top},400);
          
      });



      
}

