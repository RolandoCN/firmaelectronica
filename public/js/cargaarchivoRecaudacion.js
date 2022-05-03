$('#frm_carga_archivo').submit(function(e){
    e.preventDefault();
    if($('#archivo').val()==''){
        alertNotificar('Por favor seleccionar el archivo', "warning");
        return;
    }
    vistacargando('M','Subiendo Archivo');
  
    $('#resultado_proceso').hide(200);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/recaudacionExterna/guardarArchivo',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            
            if(data['error']==true){
                alertNotificar(data['detalle'], "error");
                // $('#documentos_adjuntos').show();
                vistacargando();
                return;
            }
            if(data['error']==false){
                $('#documentos_adjuntos').show();
                $('#titulo_carga').html(`<i class="fa fa-align-left"></i> Documento Cargado Exitosamente el ${data['detalle']['fecha_hora_registro']} `);
                $("#lista_documentos_adjuntos").html(`
                    <div class="alert  f_documento_adjunto   " style="margin-bottom: 5px;">
                        <button type="button" class="btn btn-danger btn-sm btn_doc_creado" onclick="eliminarArchivo('${data['detalle']['idrecaudacioncargaarchivo_encrypt']}')"><i class="fa fa-trash"></i></button>
                        <strong><i class="icono_left fa fa-file-pdf-o"></i></strong> 
                            <span id=""></span>  ${data['detalle']['nombre']}   
                    </div>  
                    <div align="center" class="col-md-12 col-sm-12 col-xs-12">
                        <button style="font-size:16px" onclick="procesarArchivo('${data['detalle']['idrecaudacioncargaarchivo_encrypt']}')" class="btn btn-success btn-sm"><span class="fa fa-refresh"></span > Procesar Archivo</button>
                    </div>
                `);
                $('#archivo').val('');
                alertNotificar('Archivo cargado correctamente','success');
                vistacargando();
            }
        },
        error: function(e){
            alertNotificar('Ocurrió un error intente nuevamente', "error");

        }
    });
});


function procesarArchivo(idarchivo){
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
            vistacargando("M",'Procesando Archivo, por favor espere...');
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: "POST",
                url: '/recaudacionExterna/procesarArchivo',
                data: 
                    {    
                        idarchivo: idarchivo,
                    },
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
                        $('#documentos_adjuntos').hide(200);
                        return;
                    }
                    
                },
                error: function(e){
                    alertNotificar('Ocurrió un error intente nuevamente', "error");
                    return;
                }
            });       


        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}

function eliminarArchivo(idarchivo){
    swal({
        title: "",
        text: "¿Esta seguro que desea eliminar el Archivo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, procesar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            vistacargando("M",'Eliminando Archivo, por favor espere...');
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                method: "DELETE",
                url: '/recaudacionExterna/eliminarArchivo/'+idarchivo,
                dataType: 'json',
                success: function(data){ 
                    if(data['error']==true){
                        alertNotificar(data['detalle'],'error');
                    }
                    if(data['error']==false){
                        $('#documentos_adjuntos').hide(200);
                        $("#lista_documentos_adjuntos").html('');
                        alertNotificar(data['detalle'],'success');
                    }
                    vistacargando();
                },
                error: function(e){
                    alertNotificar(data['detalle'], "error");
                    vistacargando();
                    return;
                }
            });
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}


$('#frm_pagos_procesados').submit(function(e){
    e.preventDefault();
    vistacargando('M','Buscando Información...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/recaudacionExterna/lista_pagos',
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
    var total=0;
    $.each(data['detalle'], function(i, item){
        var subtotal=0;
        $.each(item['detallerecaudacionprocesados'], function(i2, item2){
            subtotal=parseFloat(subtotal)+parseFloat(item2['valor']);
        });
        $('#body_pagos_procesados').append(`<tr role="row" class="odd">
                           <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['fecha_hora_registro']} 
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['fechasincronizacion']} 
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['detallerecaudacionprocesados'].length} 
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                $${subtotal.toFixed(2)} 
                            </td>
                            <td align="center">
                                <button onclick="detalle_pago('${item['idrecaudacion_carga_archivo']}')" class="btn btn-sm btn-info"><span class="fa fa-eye"></span> Detalle</button>
                            </td>
                            
                        </tr>  `);
        total=parseFloat(total)+parseFloat(subtotal);

    });
    $('#total').html('<b>Total: $'+total.toFixed(2)+'</b>');

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
   
function detalle_pago(idarchivo){
    vistacargando('M','Obteniendo detalle...');
    $.get('/recaudacionExterna/detalle_pago/'+idarchivo,function(data){

        cargartable_detalle(data);
        $('#administrador_principal').hide(200);
        $('#administrador_procesados').show(200);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
}

function cargartable_detalle(data){
    $('#audits').html('');
    $("#table_detalle").DataTable().destroy();
    $('#table_detalle tbody').empty();
    $.each(data['detalle'], function(i, item){
        $('#body_detalle').append(`<tr role="row" class="odd">
                           <td  class="paddingTR">
                                ${item['contrapartida']} 
                            </td>
                            <td  class="paddingTR">
                                ${item['referencia']} 
                            </td>
                            <td  class="paddingTR">
                                ${item['numero_transaccion']} 
                            </td>
                            <td  class="paddingTR">
                                ${item['fecha_proceso']} 
                            </td>
                            <td  class="paddingTR">
                                ${item['valor']} 
                            </td>
                        </tr>  `);
    });

    cargar_estilos_tabla("table_detalle");

}

function regresar(){
    $('#administrador_principal').show(200);
    $('#administrador_procesados').hide(200);
}
