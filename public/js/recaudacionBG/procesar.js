$('#procesar_archivo').submit(function(e){
    e.preventDefault();
    vistacargando('M','Por favor espere...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        url: '/recaudacionBG/procesar_archivo',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            vistacargando();
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                return;
            }
            if(data['error']==false){
                if(data['Procesados']!=null){
                    $('#canidadP').html(`Total Procesados: ${data['Procesados'].length}`);
                    $.each(data['Procesados'], function (i, item) { 
                        $('#procesados').append(`${item['detalle']} <br>`);
                    });
                }else{
                    $('#canidadP').html(`Total Procesados: 0`);
                }
                if(data['NoProcesados']!=null){
                    $('#canidadNP').html(`Total No Procesados: ${data['NoProcesados'].length}`);
                    $.each(data['NoProcesados'], function (i2, item2) { 
                        $('#noprocesados').append(`${item2['detalle']}<br>`);
                    });
                }else{
                    $('#canidadNP').html(`Total No Procesados: 0`);
                }
                $('#resultado_proceso').show(200);
                return;
            }
        },error: function(e){
            vistacargando();
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            return;
        }
    });
});

function procesarArchivo(){
    swal({
        title: "",
        text: "¿Esta seguro que desea procesar el Archivo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, procesar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        $('#procesados').html('');
        $('#noprocesados').html('');
        if (isConfirm) { 
            $('#resultado_proceso').hide(200);
            $('#procesar_archivo').submit();
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}