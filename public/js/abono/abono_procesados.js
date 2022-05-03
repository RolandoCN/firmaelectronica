$('#frm_pagos_procesados').submit(function(e){
    e.preventDefault();
    $('#panel_lista_emisiones').hide(200);
    vistacargando('M','Buscando Información');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/abono/procesados',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'], "error");
                vistacargando();
                return;
            }
            cargartable(data);
            $('#panel_lista_emisiones').show(200);
            vistacargando();
        },
        error: function(e){
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            vistacargando();
        }
    });
});

function cargartable(data){
    $('#body_pagos_procesados').html('');
    $("#table_pagos_procesados").DataTable().destroy();
    $('#table_pagos_procesados tbody').empty();
    contadorGenerado=0;
    var total_saldo=0;
    var total_abonado=0;
    var total_antiguo=0;

    $.each(data['detalle'],function(i,item){
            var totalparcial_antiguo=parseFloat(item['subtotal'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva'])-parseFloat(item['descuento']);
            total_antiguo=parseFloat(parseFloat(total_antiguo)+totalparcial_antiguo);
            var totalparcial_saldo=parseFloat(item['subtotal_saldo'])+parseFloat(item['interes_saldo'])+parseFloat(item['recargo_saldo'])+parseFloat(item['coactiva_saldo'])-parseFloat(item['descuento_saldo']);
            total_saldo=parseFloat(parseFloat(total_saldo)+totalparcial_saldo);
            var totalparcial_abonado=parseFloat(item['subtotal_abonado'])+parseFloat(item['interes_abonado'])+parseFloat(item['recargo_abonado'])+parseFloat(item['coactiva_abonado'])+parseFloat(item['descuento_abonado']);
            total_abonado=parseFloat(parseFloat(total_abonado)+totalparcial_saldo);
            var estado=`<div id="btn_${item['idabono_pagos']}"><button  class="btn btn-sm btn-success" onclick="sincronizar('${item['idabonopagos_encrypt']}','${item['idabono_pagos']}',1)" ><i class="fa fa-check"></i> Sincronizar</button></div>`;
            if(item['estado_sincronizado']==1){
                estado=`<div id="btn_${item['idabono_pagos']}"><button  class="btn btn-sm btn-primary" onclick="sincronizar('${item['idabonopagos_encrypt']}','${item['idabono_pagos']}',0)" ><i class="fa fa-times"></i> Desincronizar</button></div>`;
            }
            $('#body_pagos_procesados').append(`<tr id="tr${item['codigo']}" role="row" class="odd">
                    <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                        ${estado}
                    </td>
                    <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                        ${item['cod_emision']}
                    </td>
                    <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                        ${item['created_at']}
                    </td>
                    <td width="15%"  colspan="1">
                        <b>CIU:</b> ${item['ciu']}<br>
                        <b>Identificación:</b> ${item['identificacion']}<br>
                        <b>Contribuyente:</b> ${item['contribuyente']}<br>
                        <p class="text-center"> 
                            <a href='/abono/ticketpdf/${item['idabonopagos_encrypt']}' class="btn btn-info btn-xs"> <span class="glyphicon glyphicon-save-file" aria-hidden="true"></span>Comprobante</a>
                        </p>
                    </td>
                    <td  width="15%" colspan="1">
                        <b>Impuesto:</b> ${item['detalle']}<br>
                        <b>Código:</b> ${item['clave']}<br>
                        <b>Periodo:</b> ${item['anio']} - ${item['mes']}
                    </td>
                    <td style="font-size:12px" width="20%"  colspan="1">
                        
                        <div class="row">
                            <div class="col-md-6">
                                <b>SubTotal:</b> 
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['subtotal']).toFixed(2)} 
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <b>Interes:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['interes']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <b>Recargo:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['recargo']).toFixed(2)}
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <b>Coativa:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['coactiva']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6" >
                                <b>Descuento:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['descuento']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <b style="color:red">Total:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                <b>$${parseFloat(totalparcial_antiguo).toFixed(2)}</b>
                            </div>
                        </div>
                    </td>
                    <td style="font-size:12px; background-color:#ace9ab63" width="20%"  colspan="1">
                        <div align="center">Abono #${item['nabono']} </div>
                        <div class="row">
                            <div class="col-md-6">
                                <b>SubTotal:</b> 
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['subtotal_abonado']).toFixed(2)} 
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <b>Interes:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['interes_abonado']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <b>Recargo:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['recargo_abonado']).toFixed(2)}
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <b>Coativa:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['coactiva_abonado']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6" >
                                <b>Descuento:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['descuento_abonado']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <b style="color:red">Total:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                <b>$${parseFloat(totalparcial_abonado).toFixed(2)}</b>
                            </div>
                        </div>
                    </td>
                    <td style="font-size:12px" width="20%"  colspan="1">
                        <div class="row">
                            <div class="col-md-6">
                                <b>SubTotal:</b> 
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['subtotal_saldo']).toFixed(2)} 
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <b>Interes:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['interes_saldo']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <b>Recargo:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['recargo_saldo']).toFixed(2)}
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <b>Coativa:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['coactiva_saldo']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6" >
                                <b>Descuento:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['descuento_saldo']).toFixed(2)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <b style="color:red">Total:</b>
                            </div>
                            <div class="col-md-6" align="right">
                                <b>$${parseFloat(totalparcial_saldo).toFixed(2)}</b>
                            </div>
                        </div>
                    </td>
                </tr>  `);
    });



    cargar_estilos_tabla("table_pagos_procesados");

}

var lenguajeTabla = {
    "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                        '<option value="5">5</option>'+
                        '<option value="10">10</option>'+
                        '<option value="20">20</option>'+
                        '<option value="30">30</option>'+
                        '<option value="40">40</option>'+
                        '<option value="-1">Todos</option>'+
                '</select> registros',
    "search": "Buscar:",
    "searchPlaceholder": "Ingrese un criterio de busqueda",
    "zeroRecords": "No se encontraron registros coincidentes",
    "infoEmpty": "No hay registros para mostrar",
    "infoFiltered": " - filtrado de MAX registros",
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
    "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
    }
};

function cargar_estilos_tabla(idtabla){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 1, "asc" ],[ 2, "asc" ]],
        pageLength: 10,
        sInfoFiltered:false,
        "language": lenguajeTabla
    });

    // para posicionar el input del filtro
    $(`#${idtabla}_filter`).css('float', 'left');
    $(`#${idtabla}_filter`).children('label').css('width', '100%');
    $(`#${idtabla}_filter`).parent().css('padding-left','0');
    $(`#${idtabla}_wrapper`).css('margin-top','10px');
    $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
    $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
    //buscamos las columnas que deceamos que sean las mas angostas
    $(`#${idtabla}`).find('.col_sm').css('width','1px');
    $(`#${idtabla}`).find('.resp').css('width','150px');  
    $(`#${idtabla}`).find('.flex').css('display','flex');   
    $('[data-toggle="tooltip"]').tooltip();
    
}
function sincronizar(id,id_no_encrypt,estado){
    if(estado==1){
        vistacargando('m','Sincronizando....');
    }else{
        vistacargando('m','Descincronizando....');
    }
    $.get('/abono/sincronizarAbono/'+id+'/'+estado,function(data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }
        if(estado==1){
            $(`#btn_${id_no_encrypt}`).html(`<button  class="btn btn-sm btn-primary" onclick="sincronizar('${id}','${id_no_encrypt}',0)" ><i class="fa fa-times"></i> Desincronizar</button>`);
        }else{
            $(`#btn_${id_no_encrypt}`).html(`<button  class="btn btn-sm btn-success" onclick="sincronizar('${id}','${id_no_encrypt}',1)" ><i class="fa fa-check"></i> Sincronizar</button>`);
        }
        alertNotificar(data['detalle'],'success');
        vistacargando();
        return;
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
        return;

    });

}