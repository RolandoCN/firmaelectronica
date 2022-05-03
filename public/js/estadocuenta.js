$('#frm_buscar').submit(function(e){
    e.preventDefault();
    vistacargando('M','Buscando información...');
    $('#panelInfor').html('');
    $('#tittle_resultado').hide(200);
    $('#panelInfor').hide(200);
    $('#panelInformacion').hide(200);
    $('#panelEmisiones').hide(200);
    // $('#infor_usuario').hide(200);
    // $('#success_pago').hide(200);
    // $('#total_recaudar').val(0);
    // $('#saldo').val(0);
    // $('#frm_pagar').hide(200);
    // $("#contet_emisiones_selec").html('');
    // $('#contribuyente').val('');
    // $('#identificacion').val('');
    // $('#id_pago_comprobante').attr('href','');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/estadocuenta/consulta_ciudadano',
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
                                <button class="btn btn-xs btn-primary" onclick="seleccionar('${item['cedula_ruc']}','${item['nombres']}')"><i class="fa fa-check"></i> Seleccionar</button>
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



function seleccionar(cedula,nombre){
    vistacargando('M','Por favor espere...');
    $('#bodyInformacionCont').html('');
    $("#btn_imprimir").hide();
    $("#btn_imprimir").attr("href", '#');

    $.get('/estadocuenta/gad/'+cedula,function(data){
        vistacargando();
        if(data['error']==true){
           
            alertNotificar(data['detalle'], data['status']);
            vistacargando();
            // return;
        }
        if(data['error']==false){
            $('#panelInformacion').hide(200);
            $('#panelEmisiones').hide(200);
            $('#tittle_resultado').hide(200);
            $('#panelInfor').html('');
            $('#panelInfor').hide(200);
            // $("#btn_imprimir").attr("href", '/estadocuenta/pdf/'+cedula);
            $('#bodyInformacionCont').html(`
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-4 col-xs-12" >Contribuyente: 
                            </label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <p >${nombre}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-4 col-xs-12" >Cédula: 
                            </label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <p >${cedula}</p>
                            </div>
                        </div>
                    `);
                    $('#panelInformacion').show(200);
                    $('#panelEmisiones').show(200);
                    cargartableLocales(data,cedula);
        }
    }).fail(function(){
        vistacargando();
        alertNotificar('Ocurrió un error intente nuevamente', 'error');
        
    });
}

function cargartableLocales(data,cedula){
	$('#tb_emisionesBody').html('');
	$("#TablaEmisionesAtc").DataTable().destroy();
    $('#TablaEmisionesAtc tbody').empty();
  
    var total=0;
    $.each(data['detalle'], function(i, listaEmision){
        $.each(listaEmision, function(i2, item){
            
            var estado='----';
            var f_emision='';
            var f_pago='';
            var f_baja='';
            var descargar='';
            var totalparcial=parseFloat(item['valor'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva'])-parseFloat(item['descuento']);
            if(item['fecha_crea']!=null){
                f_emision='Emisión: '+item['fecha_crea'];
            }
            if(item['fecha_pago']!=null){
                f_pago='Pago: '+item['fecha_pago'];
            }
            if(item['fecha_baja']!=null){
                f_baja='Baja: '+item['fecha_baja'];
            }
            if(item['estado']=="EMITIDO"){
                total=parseFloat(total)+parseFloat(totalparcial);
                estado=`<span class="badge badge-pill" style="background-color:#1577d3">${item['estado']}</span><br> <b style="font-size:10px">${f_emision}<br>${f_pago}<br>${f_baja}</b>`;
            }else if(item['estado']=="RECAUDADO"){
                estado=`<span class="badge badge-pill badge-success" style="background-color:#13ba42">${item['estado']}</span><br> <b style="font-size:10px">${f_emision}<br>${f_pago}<br>${f_baja}</b>`;
                descargar=`<a href="https://enlinea.chone.gob.ec/titulocredito/validacion/${item['emi01codi']}"><span class="fa fa-download"></span> Descargar título</a>`;
            }else if(item['estado']=="BAJA"){
                estado=`<span class="badge badge-pill badge-warning" style="background-color:#ff1919">${item['estado']}</span><br> <b style="font-size:10px">${f_emision}<br>${f_pago}<br>${f_baja}</b>`;
            }else if(item['estado']=="ABONO"){
                estado=`<span class="badge badge-pill badge-warning" style="background-color:#ffb219">${item['estado']}</span><br> <b style="font-size:10px">${f_emision}<br>${f_pago}<br>${f_baja}</b>`;
            }
            $('#tb_emisionesBody').append(`<tr role="row" class="odd">
                    <td   width="15%" align="center"  colspan="1">
                        ${estado}
                    </td>
                    <td colspan="1">
                        ${item['impuesto']}<br>
                        <b>Cod:</b> ${item['emi01codi']}<br>
                        ${descargar}
                       
                    </td>
                    <td  colspan="1">
                        ${item['clave_catastral']}
                    </td>
                    <td width="3%"  colspan="1">
                        ${item['anio']} - ${item['mes']}
                    </td>
                    <td  colspan="1">
                        ${item['titulo']}
                    </td>
                    <td style="font-size:12px" width="20%"  colspan="1">
                        <div class="row">
                            <div class="col-md-6">
                                <b>SubTotal:</b> 
                            </div>
                            <div class="col-md-6" align="right">
                                $${parseFloat(item['valor']).toFixed(2)} 
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
                   
                    <td  width="5%"  colspan="1">
                       <button onclick="detalleEmision(${item['emi01codi']})" class="btn btn-sm btn-primary"><i class="fa fa-eye"></i> Ver</button>
                    </td>
                </tr>  `);
        });

    });
    console.log(total);
    if(total>0){
        $("#btn_imprimir").attr("href", '/estadocuenta/pdf/'+cedula);
        $("#btn_imprimir").show();
    }
    $('#total_deuda').html('$'+total.toFixed(2));
    cargar_estilos_tabla("TablaEmisionesAtc");
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
        order: [[ 3, "desc" ]],
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


// $('#cedula').on('input', function() {
//     this.value = this.value.replace(/[^0-9]/g,'');
//  });
 