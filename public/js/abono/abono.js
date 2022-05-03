$('#frm_buscar_ciudadano').submit(function(e){
    e.preventDefault();
    vistacargando('M','Buscando información...');
     $('#panelInfor').html('');
    $('#tittle_resultado').hide(200);
    $('#panelInfor').hide(200);
    $('#infor_usuario').hide(200);
    $('#success_pago').hide(200);
    $('#total_recaudar').val(0);
    $('#saldo').val(0);
    $('#frm_pagar').hide(200);
    $("#contet_emisiones_selec").html('');
    $('#contribuyente').val('');
    $('#identificacion').val('');
    $('#id_pago_comprobante').attr('href','');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/recaudar/consulta_ciudadano',
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
            $.each(data['detalle'],function(i,item){
                $('#panelInfor').append(` <div style="background-color: cornsilk;text-align: left; vertical-align: middle;" class="row">
                            <div class="col-md-9 col-xs-9 col-lg-9">
                               ${item['nombres']}
                               <div style="font-size:10px;padding-left:20px"><b> Identificación:</b> ${item['cedula_ruc']}</div> 
                               <div style="font-size:10px;padding-left:20px"><b> CIU:</b> ${item['ciu']}</div> 
                            </div>
                            <div class="col-md-3 col-xs-3 col-lg-3" style="padding-top:9px">
                                <button class="btn btn-xs btn-primary" onclick="seleccionar('${item['cedula_ruc']}','${item['nombres']}')">Seleccionar</button>
                            </div>
                        </div><br>`);
            });
            $('#tittle_resultado').show(200);
            $('#panelInfor').show(200);
            vistacargando();
        },
        error: function(e){
            alertNotificar('Ocurrio un error intente nuevamente','error');
            vistacargando();
        }
    });
});

function seleccionar(identificacion,nombres){
    vistacargando('M','Obteniendo información...');

    $('#tb_tabla_abono').html('');
    var subtotal=0;
    var total =0;
    $.get('/recaudar/get_emisiones/'+identificacion,function(data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }
        if(data['detalle'].length==0){alertNotificar('No tiene deudas pendientes','info'); vistacargando(); return;}
        $('#tittle_resultado').hide(200);
        $('#panelInfor').hide(200);
        $('#nombre').html(nombres);
        $('#identificacion').val(identificacion);
        $.each(data['detalle'],function(i,item){
            subtotal=parseFloat(((parseFloat(item.subtotal)+parseFloat(item.interes)+parseFloat(item.recargo))-parseFloat(item.descuento)).toFixed(2));
            total=parseFloat(parseFloat(total)+subtotal);
            $('#saldo').val(total.toFixed(2));
            $('#tb_tabla_abono').append(`
                <tr>
                    <td><b>CLAVE:</b> ${item.clave}<br>
                        <b>IMPUESTO:</b> ${item.impuesto}<br>
                        <b>PERIODO:</b> ${item.mes} / ${item.anio}<br>
                        <b>SUBTOTAL:</b> <b style="color:red">${subtotal}</b></td>
                          <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                                <input data-id="" id="cod_${item['codigo']}" value="${item['codigo']}" name="cod_emision[]"  style="width:20px;height:20px;;cursor: pointer" type="checkbox">
                            </td>


                </tr>
                `)
            $(`#cod_${item['codigo']}`).click(function(){
                 var subtotal_selec=parseFloat(((parseFloat(item.subtotal)+parseFloat(item.interes)+parseFloat(item.recargo))-parseFloat(item.descuento)).toFixed(2));
                  if($(`#cod_${item['codigo']}`).prop('checked')){
                     $("#contet_emisiones_selec").append(`<input id="input_${item['codigo']}" type="hidden" name="list_cod_emisiones[]" value="${item['codigo']};${subtotal_selec}">`);
                     $('#total_recaudar').val((parseFloat($('#total_recaudar').val())+subtotal_selec).toFixed(2));
                     $('#saldo').val(parseFloat((parseFloat($('#saldo').val()))-subtotal_selec).toFixed(2));
                     $('#frm_pagar').show(200);
                  }else{
                    $(`#input_${item['codigo']}`).remove();
                     $('#total_recaudar').val((parseFloat($('#total_recaudar').val())-subtotal_selec).toFixed(2));
                     $('#saldo').val((parseFloat(parseFloat($('#saldo').val())+subtotal_selec).toFixed(2)));
                     if($('#total_recaudar').val()==0){
                        $('#frm_pagar').hide(200);
                     }

                  }
            });
        });
        $('#totalPago').html('$'+total.toFixed(2));
        $('#contribuyente').val(nombres);
        $('#infor_usuario').show(200);
         vistacargando();
    });
   
}

$('#frm_pagar').submit(function(e){
    e.preventDefault();
    

    vistacargando('M','Procesando Pago...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        url: '/recaudar/procesar_pago',
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
            $('#id_pago_comprobante').attr('href','/recaudar/generar_ticket/'+data['pago']['idrecaudarpagos_encrypt']);
            $('#infor_usuario').hide(200);
            $('#success_pago').show(200);
            vistacargando();
        },
        error: function(e){
             alertNotificar('Ocurrio un error intente nuevamente','error');
            vistacargando();
        }
    });
});

        
function procesar_pago(){
    swal({
        title: '',
        text: 'Está seguro que desea procesar el pago',
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
            $('#frm_pagar').submit();

        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
       
    });
}

$('#frm_pagos_procesados').submit(function(e){
    e.preventDefault();
    vistacargando('M','Buscando Información');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/recaudar/lista_procesados',
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
    $.each(data['detalle'], function(i, item){
        $('#body_pagos_procesados').append(`<tr role="row" class="odd">
                           <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['fecharegistro']} 
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['identificacion']} 
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['contribuyente']} 
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['identificacionpago']} 
                            </td>
                            <td style=" vertical-align: middle; text-align:left"  class="paddingTR">
                                <div id="emi_${item['idrecaudar_pagos']}"></div>
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                $${item['total']} 
                            </td>
                        </tr>  `);
        $.each( JSON.parse(item['emisiones']), function(i2, item2){
            $(`#emi_${item['idrecaudar_pagos']}`).append(`<li>${item2['emision']} => $${item2['valor']}</li>`);
        });
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
        order: [[ 0, "asc" ]],
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

