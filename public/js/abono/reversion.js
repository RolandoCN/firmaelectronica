$('#frm_buscar_ciudadano').submit(function(e){
    e.preventDefault();
    vistacargando('M','Buscando información...');
    $('#infor_usuario').hide(200);
    $('#tb_tabla_abono').html('');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/recaudar/lista_pagos',
        // data: e.serialize(),
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }
            if(data['detalle']-length==0){
                alertNotificar('No se encuentran pagos registrados','info');
                vistacargando();
                return;
            }
            $('#nombre').html(data['detalle'][0]['contribuyente']);
            $('#identificacion').html(data['detalle'][0]['identificacion']);

                $.each(data['detalle'],function(i,item){
                    $('#tb_tabla_abono').append(`
                        <tr>
                                <td><b>Cod. Pago:</b> ${item['identificacionpago']}<br>
                                <b>Total:</b>  $${item['total']}<br>
                                <b>Fecha:</b>  ${item['fecharegistro']}<br></td>
                                <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                                    <button onclick="revertir_pago('${item['idrecaudarpagos_encrypt']}')" class="btn btn-sm btn-danger"><span class="fa fa-refresh"></span> Revertir</button>
                                     <a type="button" href="/recaudar/generar_ticket/${item['idrecaudarpagos_encrypt']}" class="btn btn-sm btn-warning"><span class="fa fa-download"></span> Descargar Comprobante</a>
                                </td>
        
        
                        </tr>
                        `)
                });
            $('#infor_usuario').show(200);
            vistacargando();
        },
        error: function(e){
            vistacargando();
        }
    });
});

function revertir_pago(idpago){
    
    swal({
        title: '',
        text: 'Está seguro que desea revertir el pago',
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
            vistacargando('M','Revirtiendo pago.....')
            $.get('/recaudar/revertir/'+idpago,function(data){
                if(data['error']==true){
                    alertNotificar(data['detalle'],'error');
                    vistacargando();
                    return;
                }
                alertNotificar(data['detalle'],'success');
                $('#infor_usuario').hide(200);
                $('#tb_tabla_abono').html('');
                $('#parametro').val('');
                vistacargando();
            }).fail(function(){
                alertNotificar('Ocurrión un error intente nuevamente','error');
                vistacargando();
        
            });

        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    });
    
}
$('#parametro').on('input', function() {
    this.value = this.value.replace(/[^0-9]/g,'');
 });


