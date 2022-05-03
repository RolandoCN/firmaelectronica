
$('#check_destinatarios').on('ifChecked', function(event){ // si se checkea
    $('#check_funcionario_correo').iCheck('uncheck');
    $('#check_funcionarios_whatsapp').iCheck('uncheck');
    $('#check_destinatarios_whatsap').iCheck('uncheck');
    $('#destinatarios').val('');
    $('#destinatariosdiv').show(200);

});

$('#check_destinatarios').on('ifUnchecked', function(event){ // si se deschekea.
    $('#destinatarios').val('');
    $('#destinatariosdiv').hide(200);
});

$('#check_funcionario_correo').on('ifChecked', function(event){ // si se checkea
    $('#check_destinatarios').iCheck('uncheck');
    $('#check_funcionarios_whatsapp').iCheck('uncheck');
    $('#check_destinatarios_whatsap').iCheck('uncheck');
    $('#destinatarios').val('');
    $('#destinatariosdiv').hide(200);
});

$('#check_funcionarios_whatsapp').on('ifChecked', function(event){ // si se checkea
    $('#check_destinatarios').iCheck('uncheck');
    $('#check_funcionario_correo').iCheck('uncheck');
    $('#check_destinatarios_whatsap').iCheck('uncheck');
    $('#destinatarios').val('');
    $('#destinatariosdiv').hide(200);
});

$('#check_destinatarios_whatsap').on('ifChecked', function(event){ // si se checkea
    $('#check_destinatarios').iCheck('uncheck');
    $('#check_funcionario_correo').iCheck('uncheck');
    $('#check_funcionarios_whatsapp').iCheck('uncheck');
    $('#destinatarios').val('');
    $('#destinatariosdiv').hide(200);
    $('#destinatarios_whatsap').val('');
    $('#destinatariosdiv_whatsap').show(200);
    
});

$('#check_destinatarios_whatsap').on('ifUnchecked', function(event){ // si se deschekea.
    $('#destinatarios_whatsap').val('');
    $('#destinatariosdiv_whatsap').hide(200);
});


$('#frm_enviar_mensaje').submit(function(e){
    e.preventDefault();

    vistacargando('M','Enviando mensajes...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/notificaciones/enviarmensaje',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }else{
                alertNotificar(`Enviados: ${data['enviados']}<br>No enviados: ${data['noenviados']}`,'success');
            }
            vistacargando();
        },
        error: function(e){
            vistacargando();
            alertNotificar('Ocurrió un error intente nuevamente o llene correctamente la información','error');

        }
    });
});

function enviar_mensajes(){
    if($('#mensaje').val()==''){
        alertNotificar('Ingrese el mensaje','warning');
        return;
    }
    swal({
        title: '',
        text: 'Está seguro que desea enviar los mensajes',
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-sm btn-info",
        cancelButtonClass: "btn-sm btn-danger",
        confirmButtonText: "Si, Aceptar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
   
        if (isConfirm) { // si dice que si
            $('#frm_enviar_mensaje').submit();

        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
       
    });
}


