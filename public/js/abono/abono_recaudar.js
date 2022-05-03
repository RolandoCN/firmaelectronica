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
    // $('#TablaEmisionesAtc').html('');
    $('#tb_emisionesBody').html('');
	$("#TablaEmisionesAtc").DataTable().destroy();
    $('#TablaEmisionesAtc tbody').empty();

    $.get('/abono/get_emisiones/'+identificacion,function(data){
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
        var total=0;
        var estado_general=0;
        var des_radio="";
        $.each(data['detalle'],function(i,item){
                var totalparcial=parseFloat(item['subtotal'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva'])-parseFloat(item['descuento']);
                total=parseFloat(parseFloat(total)+totalparcial);
                
                // if(estado_control!='ABONADO'){
                //     if(estado_general>0){
                //         var des_radio="disabled='true'";
                //     }else{
                //         var des_radio="disabled='false'";
                //     }
                // }
                var input='';
                if(totalparcial>0){
                        
                        var estado='';
                        var estado_control='EMITIDO';
                    
                        if(data['estado_abono']=='true'){
                            if(item['estado']=="A"){
                                input =`<input  data-id="" id="cod_${item['codigo']}" value="${item['codigo']}" name="cod_emision[]"  style="width:18px;height:18px;;cursor: pointer" type="radio">`;
                            }else{
                                input =`<input disabled='true' data-id="" id="cod_${item['codigo']}" value="${item['codigo']}" name="cod_emision[]"  style="width:18px;height:18px;;cursor: pointer" type="radio">`;
                            }
                        }else{
                            input =`<input  data-id="" id="cod_${item['codigo']}" value="${item['codigo']}" name="cod_emision[]"  style="width:18px;height:18px;;cursor: pointer" type="radio">`;
                        }
                        if(item['estado']=="A"){
                            estado=`<span class="badge badge-pill" style="background-color:#1577d3">ABONADO</span>`;
                            estado_control="ABONADO";
                        }else{
                            estado=`<span class="badge badge-pill badge-success" style="background-color:#13ba42">EMITIDO</span>`;
                            estado_control="EMITIDO";
                          
                        }
                       
                    $('#tb_emisionesBody').append(`<tr id="tr${item['codigo']}" role="row" class="odd">
                            <td width="2%" align="center" style="text-align: center; vertical-align: middle" class="paddingTR">
                                ${input}
                            </td>
                            <td   width="5%"  colspan="1">
                                <b align="center" >${estado}</b><br><br>
                                <b>Emisión:</b> ${item['codigo']}<br>
                                <b>Impuesto:</b> ${item['impuesto']}<br>
                                <b>Clave:</b> ${item['clave']}<br>
                                <b>Periodo:</b> ${item['anio']} - ${item['mes']}<br>
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
                                        <b>$${parseFloat(totalparcial).toFixed(2)}</b>
                                    </div>
                                </div>
                            </td>
                            <td class="hidden">${item['anio']} - ${item['mes']} </td>
                        </tr>  `);
                       
                    var subtotal_selec=0;
                    $(`#cod_${item['codigo']}`).on('change', function() {
                        $('html,body').animate({scrollTop:$('#totalPago').offset().top},400);
                            $(`#valores_pagar`).html(`<p>Total recaudar: <input  class="form-control" type="number" value="0.00"  autocomplete="off" name="total_recaudar"  id="total_recaudar${item['codigo']}" step="0.01" value="0" ></p>
                            <p>Saldo emisión:<input  class="form-control" type="text" readonly="true" id="saldo_emision${item['codigo']}" ></p>
                            <p>Saldo total:<input  class="form-control" type="text" readonly="true" id="saldo${item['codigo']}" ></p> <input type="hidden" name="anio_mes" value="${item.anio}-${item.mes}"> <input type="hidden" value="${estado_control}" id="estado_${item['codigo']}"> <input type="hidden" value="${item['codigo']}" id="cod_emision"> `);

                            subtotal_selec=parseFloat(((parseFloat(item.subtotal)+parseFloat(item.interes)+parseFloat(item.recargo)+parseFloat(item.coactiva))-parseFloat(item.descuento)).toFixed(2));
                            $('#saldo_emision'+item['codigo'] ).val(parseFloat(subtotal_selec).toFixed(2));
                            $("#contet_emisiones_selec").html(`<input id="input_${item['codigo']}" type="hidden" name="cod_emision" value="${item['codigo']}">`);
                            if($('#total_recaudar'+item['codigo'] ).val()==0){
                                $('#saldo'+item['codigo'] ).val(parseFloat(total).toFixed(2));
                            }else{
                                $('#saldo'+item['codigo'] ).val(parseFloat(total-$('#total_recaudar'+item['codigo'] ).val()).toFixed(2));
                            }
                            $('#frm_pagar').show(200);

                            $("#total_recaudar"+item['codigo'] ).keyup(function() {
                                if(estado_control=='EMITIDO'){
                                    if($('#total_recaudar'+item['codigo'] ).val()>=subtotal_selec){
                                        if($('#total_recaudar'+item['codigo'] ).val()==subtotal_selec){
                                            alertNotificar('El total a recaudar es igual al valor de la emisión,por favor ingrese un valor menor','warning');
                                        }else{
                                            alertNotificar('El total a recaudar es mayor al valor de la emisión,por favor ingrese un valor menor','warning');
                                        }
                                        $('#total_recaudar'+item['codigo'] ).val(0);
                                    }
                                }else{
                                    if($('#total_recaudar'+item['codigo'] ).val()>subtotal_selec){
                                        alertNotificar('El total a recaudar es mayor al valor de la emisión,por favor ingrese un valor menor','warning');
                                        $('#total_recaudar'+item['codigo'] ).val(0);
                                    }
                                }
                                $('#saldo_emision'+item['codigo']).val(parseFloat(subtotal_selec-$('#total_recaudar'+item['codigo'] ).val()).toFixed(2));
                                $('#saldo'+item['codigo']).val(parseFloat(total-$('#total_recaudar'+item['codigo'] ).val()).toFixed(2));

                            });
                            $("#total_recaudar"+item['codigo']  ).on('blur', function() {
                                $("#total_recaudar"+item['codigo']).val(parseFloat($("#total_recaudar"+item['codigo']  ).val()).toFixed(2));
                                if($("#total_recaudar"+item['codigo']).val()==0){
                                    alertNotificar('Debe ingresar un valor abonar diferente de cero','warning');
                                    return;
                                }
                                if(estado_control =='EMITIDO'){
                                    
                                
                                    if($("#saldo_emision"+item['codigo']).val()==0){
                                        alertNotificar('Debe ingresar un valor menor al saldo de la emisión','warning');
                                        $('#saldo_emision'+item['codigo']).val(subtotal_selec);
                                        $('#saldo'+item['codigo']).val(parseFloat(total).toFixed(2));
                                        $("#total_recaudar"+item['codigo']).val(parseFloat(0).toFixed(2));
                                        return;
                                    }
                                }

                            });
                    });
         
                }
        });
        $('#totalPago').html('$'+total.toFixed(2));
        $('#total_pago_t').val(total.toFixed(2));

        $('#contribuyente').val(nombres);
        $('#infor_usuario').show(200);
        $('#panelEmisiones').show(200);
         vistacargando();
         cargar_estilos_tabla('TablaEmisionesAtc');
    }).fail( function( ) {
        alertNotificar('Ocurrió un error intente nuevamente','error');
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
        url: '/abono/procesar_abono',
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
            $('#id_pago_comprobante').attr('href','/abono/ticketpdf/'+data['id']);
            $('#infor_usuario').hide(200);
            $('#success_pago').show(200);
            vistacargando();
            $('html,body').animate({scrollTop:$('#frm_buscar_ciudadano').offset().top},400);
            alertNotificar(data['detalle'],'success');
        },
        error: function(e){
             alertNotificar('Ocurrio un error intente nuevamente','error');
            vistacargando();
        }
    });
});

        
function procesar_pago(){
    var cod_emision=$('#cod_emision').val();
    if($('#total_recaudar'+cod_emision).val()<=0){
        alertNotificar('El valor de abono debe ser mayor a cero','warning');
        return;
    }
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




function cargar_estilos_tabla(idtabla){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 3, "asc" ]],
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


//ESTILOS DE TABLA

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

function detalleEmision(emision){
    $('#bodydetallePago').html('');
    $('#modalDetallePago').modal();
    $('#procesingDetallePaga').show();
    $('#tablaDetallePago').hide();
    $('#errorDetallePaga').hide();
    $('#detalleerrorPago').html('');
    $.get('/estadocuenta/detalleEmision/'+emision, function(data){
        $('#procesingDetallePaga').hide();
        if(data['error']==true){
            $('#errorDetallePaga').show();
            $('#detalleerrorPago').html(data['detalle']);
            return;
        }
        $('#tablaDetallePago').show();
        var sumaTotal=0;
        console.log(data['detalle']);
        $.each(data['detalle'],function(i,item){
            sumaTotal=sumaTotal+parseFloat(item['emi02vdet']);
            var valor=parseFloat(item['emi02vdet']).toFixed(2);
           
            $('#bodydetallePago').append(`
            <tr>
                <td>${item['emi04desd']}</td>
                <td>$${valor}</td>
            </tr>`);

        });
    });
}
