$(document).ready(function () {
    vistacargando('m','Cargando solicitudes...');
    lista_por_aprobar();
    
});

function lista_por_aprobar(){
    $.get('/materiales/lista_solicitud_bodega',function(data){
        cargartablesolicitud(data);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
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
    "zeroRecords": "No se encontraron registros",
    "infoEmpty": "No hay registros para mostrar",
    "infoFiltered": " - filtrado de MAX registros",
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
    "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
    }
};

function cargar_estilos_tabla(idtabla,pagina=10){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 1, "desc" ]],
        pageLength: pagina,
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

function cargartablesolicitud(data){
	$('#lista_pedidos').html('');
	$("#table_pedidos").DataTable().destroy();
    $('#table_pedidos tbody').empty();
    contadorGenerado=0;
    $.each(data['detalle'], function(i, item){
        var estado='';
        var eliminar='';
        var detalle='';
        var observacion='';
        var color='';
        if(item['estado_dep_admi']=='A' && item['estado_dep_orden']=='P'){
            estado=`<span style="background-color:#2f87f5" class="badge badge-info">Por Generar</span>`;
            detalle=`<button onclick="detalle('${item['idsolicitud_material_encrypt']}')" type="button" class="btn btn-sm btn-success marginB0">
            <i class="fa fa-eye" >
            </i> Detalle
            </button>`;
            if(item['observacion_orden']!=null){
                var color='background-color:#ffb3b3';
                var observacion=item['observacion_orden'];
            }
        }else if(item['estado_dep_admi']=='A'  && item['estado_dep_orden']=='A'){
            if(item['estado_dep_soli']=='A' && item['estado_dep_admi']=='A' && item['estado_dep_orden']=='A' &&  item['estado_firm_orden']=='A'  && item['estado_firm_orden']=='A' && item['estado_dep_egreso']=='A' && item['estado_dep_firma_soli']=='A'){
                estado=`<span style="background-color:#1ea81c" class="badge badge-info"><i class="fa fa-check"></i> Finalizado</span>`;
            }else{
                estado=`<span style="background-color:#f58a2f" class="badge badge-info">Generado</span>`;
            }
            var observacion='';
        }
       
        // var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['recargo']))-parseFloat(item['descuento']);
    	$('#lista_pedidos').append(`<tr role="row" class="odd">
	                        <td width="15%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            ${item['codigo']}
	                        </td>
	                       <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['f_fima_admi']}
	                        </td>
                            <td style=" vertical-align: middle;"  class="paddingTR">
                                ${item['departamento']['nombre']}
	                        </td>
	                        <td style=" vertical-align: middle;"  class="paddingTR">
                                ${item['descripcion']}
	                        </td>
                            <td style=" vertical-align: middle; ${color}"  class="paddingTR">
                                ${observacion}
	                        </td>
                            <td width="5%" style=" vertical-align: middle; text-align:center "  class="paddingTR">
                                ${estado}
	                        </td>
	                        <td width="20%"  style="text-align: center; vertical-align: middle;"  class="paddingTR">
	                        	<center>
                                    ${detalle}
                                    <button onclick="documentos('${item['idsolicitud_material_encrypt']}')" type="button" class="btn btn-sm btn-info marginB0">
                                        <i class="fa fa-file" >
                                        </i> Documentos
                                    </button>
                                    ${eliminar}
                                </center>
	                        </td>
	                        
	                    </tr>  `);
    });
    cargar_estilos_tabla("table_pedidos");
}


function regresar(){
    $('#detalle_aprobar').show(200);
    $('#nueva_solicitud').hide(200);
}

function limpiar_generar_nuevo(){
    $('#botones_accion').addClass('hidden');
    $('#lista_materiales').html('');
    $('#tabla_pedido_carrito').hide(200);
}

function detalle(id){
    limpiar_generar_nuevo();
    vistacargando('m','Por favor espere...');
    $('#lista_materiales_aprobar').html('');
    $('#materiales_proveedores').html('');
    $.get('/materiales/detalle/'+id, function (data){
        if(data['error']==true){
            alertNotificar('Error al obtener detalle, intente nuevamente','error');
            vistacargando();
            return;
        }
        $("#documento_principal_bodega").html('<br><br><div style="font-size:20px" align="center"> <b>Cargando documento.....</b></div>');
        $('#asunto_aprobar').html(`<b>Asunto:</b> ${data['detalle']['descripcion']}`);
        $.each(data['detalle']['detalle'],function(i,item){
                $('#lista_materiales_aprobar').append(`<tr id="tr_${item['idmaterial']}">
                                                <td>${item['idmaterial']} |${item['descripcion']}</td>
                                                <td>${item['cantidad']}</td>
                                                <td>${item['unidad']}</td>
                                                `);
               
        });
       $('#detalle_aprobar').hide(200);
       $('#nueva_solicitud').show(200);
       $('#botones_accion').removeClass('hidden');
       $('#tabla_pedido_carrito').show(200);

       $('#botones_accion').html(`<button type="button" onclick="cargar_proveedor('${data['detalle']['idsolicitud_material_encrypt']}')" class="btn btn-primary "><i class="fa fa-pencil"></i> Generar orden de pedido</button>
       <button type="button" onclick="aprobar_orden('${data['detalle']['idsolicitud_material_encrypt']}')" class="btn btn-success "><i class="fa fa-paper-plane"></i> Aprobar ordenes</button>
       <button type="button" onclick="enviar_revision('${data['detalle']['idsolicitud_material_encrypt']}')" class="btn btn-warning "><i class="fa fa-pencil"></i> Revisión</button>
       <button type="button" onclick="regresar()" class="btn btn-danger "><i class="fa fa-mail-reply"></i> Atrás</button>`);
       $('#idsolicitud_edit').val(data['detalle']['idsolicitud_material_encrypt']);
       $('#idsolicitud_encrypt').val(data['detalle']['idsolicitud_material_encrypt']);
       $('#idsolicitud_encrypt_firmar').val(data['detalle']['idsolicitud_material_encrypt']);
       $('#asunto').val(data['detalle']['descripcion']);
        if(data['detalle']['solicitu_doc']!=null){
            $('#descargar_doc_firma').html(`<p > <a  data-toggle="tooltip" data-placement="right" title="Recuerde que puede descargar el documento y firmarlo." id="btn_descargar_documento_firmar" class="btn btn-info btn-sm"  id="btn_descargar_documento_firmar" href="/materiales/descargardocadmi/${data['detalle']['idsolicitud_material_encrypt']}" class="btn btn-info btn-sm" ><i class="fa fa-download"></i> Descargar documento</a></p>`);
        }
        ver_doc_admi(data['detalle']['documento_admini'][0]['ruta_encrypt']);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrión un error intente nuevamente','error');
        vistacargando();
    })
}

function enviar_revision(id){
    swal({
        title: "¿Está seguro que desea enviar a revisión?",
        html: true,
        text: `<textarea  rows="6" style="resize:none" placeholder="Ingrese la observación" class="form-control" cols="50" id="obsevacion_aprobacion"></textarea>`,
        // type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonClass: "btn-sm btn-success",
        cancelButtonClass: "btn-sm btn-default",
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
    }, function () {
        if ($('#obsevacion_aprobacion').val()=='' ){
            alertNotificar('Por favor llenar todos los campos','error'); 
            return false;
        }
        guardar_revision(id, $('#obsevacion_aprobacion').val());
        sweetAlert.close();        
    });
}

function guardar_revision(id,observacion){
    vistacargando('M','Por Favor Espere..');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: `/materiales/revisionbodega_admi`,
        method: "POST",
        data: {
            'id':id,
            'observacion':observacion,},
        success: function(data){

            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                lista_por_aprobar();
                vistacargando();
                return;
            }
            lista_por_aprobar();
            alertNotificar(data['detalle'],'success');
            vistacargando();
            regresar();
        },
        error: function(){
            alertNotificar("Ocurrió un error intente nuevamente", "error");    
            vistacargando();                
        }
    });
}

function cargar_proveedor(id){
    vistacargando('m','Cargando por favor espere.....');
    $('#materiales_proveedores').html('');
    $("#content_doc_orden").html('');
    $.get('/materiales/detalle_materiales/'+id, function (data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }   
        $('#idsolicitud').val(id);
        if(data['documentoOrden']!=null){
            $('#btn_orden_doc').html(`<button onclick="ver_doc_orden('${data['documentoOrden']['ruta']}')" type="button" class="btn btn-sm btn-info"><i class="fa fa-file"></i> Ver orden de pedido </button>`);
        }

        $.each(data['detalle'],function(i,item){
            $('#materiales_proveedores').append(`<p><div class="row">
                                                        <div class="col-md-6 check_material_limpiar">
                                                            <label style="cursor:pointer" for="check_material${item['idmaterial']}" style="margin: 0;">
                                                                <input class="check_material" style="cursor:pointer"  id="check_material${item['idmaterial']}" name="check_material[]" value="${item['idmaterial']}"  type="checkbox"> ${item['idmaterial']} | ${item['descripcion']}
                                                            </label>
                                                        </div> 
                                                        <div class="col-md-3  check_cantidad_limpiar"> 
                                                            <input min="1" max="${item['cantidad']}" id="input_material${item['idmaterial']}" name="input_material[]" disabled='true' type="number"value="${item['cantidad']}" class="form-control">
                                                            <input id="input_detallematerial${item['idmaterial']}" disabled="true" type="hidden" name="iddetallematerial[]" value="${item['iddetalle_solicitud_materiales']}">
                                                        </div>
                                                    </div>
                                                </p>`)
            $(`#check_material${item['idmaterial']}`).change(function() {
                if(this.checked){
                    $(`#input_material${item['idmaterial']}`).attr('disabled',false);
                    $(`#input_detallematerial${item['idmaterial']}`).attr('disabled',false);

                    // $(`#materiales_orden`).append(`<input id="input_materiales_${item['idmaterial']}" type="hidden" name="input_materiales"  value="${item['idmaterial']}" class="form-control">`)
                }else{
                    $(`#input_material${item['idmaterial']}`).attr('disabled',true);
                    $(`#input_detallematerial${item['idmaterial']}`).attr('disabled',true);

                    // $(`#input_materiales_${item['idmaterial']}`).remove();
                }
            });
        });
        $('#body_orden_pedido').html('');
        $("#table_ordenes_pedido").DataTable().destroy();
        $('#table_ordenes_pedido tbody').empty();
        $.each(data['ordenes'],function(i2,item2){
            var materiales='';
            $.each(item2['detalle_pedido'],function(i3,item_materiales){
                
                materiales=materiales+`<tr>
                                        <td>${item_materiales['detalle_materiales']['idmaterial']} | ${item_materiales['detalle_materiales']['descripcion']}</td>
                                        <td>${item_materiales['cantidad']}</td>
                                        </tr>`
            });
            $('#body_orden_pedido').append(`<tr>
                                            <td>${item2['nombreproveedor']}</td>
                                            <td width="40px">
                                                <table style="color: black; width:100%"   class="table table-striped table-bordered dataTable " role="grid" aria-describedby="datatable_info">
                                                    <thead>
                                                        <th style="font-size:10px">Detalle</th>
                                                        <th style="font-size:10px">Cantidad</th>
                                                    </thead>
                                                    <tbody style="font-size:10px" id="bodytable">
                                                    ${materiales}
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td align="center"><button onclick="eliminar_orden_pedido('${item2['idmateriales_orden_pedido_encrypt']}')"  type="button" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i>  </button></td>
                                            `);
        });
        vistacargando();
        cargar_estilos_tabla('table_ordenes_pedido',3);
        $('#modal_proveedores').modal();
    }).fail(function(){
        alertNotificar('Ocurrión un error intente nuevamente','error');
        vistacargando();
    })
}

function cargar_ordenes_pedidos(idsolicitud){
    vistacargando('m','Cargando ordenes');
    $('#body_orden_pedido').html('');
    $("#table_ordenes_pedido").DataTable().destroy();
    $('#table_ordenes_pedido tbody').empty();
    $('#btn_orden_doc').html('');
    $.get('/materiales/detalle_materiales/'+idsolicitud, function (data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }   
        if(data['documentoOrden']!=null){
            $('#btn_orden_doc').html(`<button onclick="ver_doc_orden('${data['documentoOrden']['ruta']}')" type="button" class="btn btn-sm btn-info"><i class="fa fa-file"></i> Ver orden de pedido </button>`);
        }
        $.each(data['ordenes'],function(i2,item2){
            var materiales='';
            $.each(item2['detalle_pedido'],function(i3,item_materiales){
                materiales=materiales+`<tr>
                                        <td>${item_materiales['detalle_materiales']['idmaterial']} | ${item_materiales['detalle_materiales']['descripcion']}</td>
                                        <td>${item_materiales['cantidad']}</td>
                                        </tr>`
            });
            $('#body_orden_pedido').append(`<tr>
                                            <td>${item2['nombreproveedor']}</td>
                                            <td width="40px">
                                                 <table style="color: black; width:100%"   class="table table-striped table-bordered dataTable " role="grid" aria-describedby="datatable_info">
                                                    <thead>
                                                        <th>Detalle</th>
                                                        <th>Cantidad</th>
                                                    </thead>
                                                    <tbody style="font-size:10px" id="bodytable">
                                                    ${materiales}
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td align="center"><button onclick="eliminar_orden_pedido('${item2['idmateriales_orden_pedido_encrypt']}')" type="button" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i>  </button></td>
                                            `);
            
        });
        cargar_estilos_tabla('table_ordenes_pedido',3);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrión un error intente nuevamente','error');
        vistacargando();
    })
}

$("#form_poveedores").submit(function(e){ 

    e.preventDefault();
    if($('#cmb_proveedores').val()=='' || $('#cmb_proveedores').val()==null ){
        alertNotificar("Debe seleccionar el proveedor para generar la orden de pedido", "default"); return;
    }
    var materiales = $("#materiales_proveedores").find(".check_material:checked");
    if(materiales.length==0){
            alertNotificar("Debe seleccionar al menos un material para generar la orden de pedido", "default"); return;
    }
    vistacargando('m','Generando orden de pedido por favor espere...');
      var FrmData = new FormData(this);
      $.ajaxSetup({
          headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
      });
    //   vistacargando('M','Subiendo documento...'); // mostramos la ventana de espera
      $.ajax({
          url: "/materiales/guardar_orden_pedido",
          method: 'POST',
          data: FrmData,
          dataType: 'json',
          contentType:false,
          cache:false,
          processData:false,
          success: function(data){

             if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
             }   
             vistacargando();
             cargar_ordenes_pedidos(data['idsolicitud']);
             var checks=$('.check_material_limpiar').find('input');
             $.each(checks,function(i,item){
                 $(`#${item.getAttribute('id')}`).prop("checked", false);;
             });
             var checks_cantidad=$('.check_cantidad_limpiar').find('input');
             $.each(checks_cantidad,function(i2,item2){
                 $(`#${item2.getAttribute('id')}`).prop("disabled", true);;
             });

             
             alertNotificar(data['detalle'],'success');
             return;

                                      
          },
          error: function(error){
              vistacargando(); // ocultamos la ventana de espera
              alertNotificar("Error al obtener la información de los informes", "error");
          }
      }).fail(function(){
            alertNotificar('Ocurrión un error intente nuevamente','error');
            vistacargando();
        });


});


function verdocumento(ruta){
    vistacargando('m','Cargando documento');
    $.get(`/materiales/obtenerDocumento/${ruta}`, function(docB64){
            vistacargando();
            var encabezado = '<hr style="margin: 10px 0px;"><p style="font-weight: 700;"><i class="fa fa-desktop"></i> Vista previa del documento</p>';
            $("#content_visualizarDocumento_depa").html(encabezado+" "+`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 650px;"></iframe>`);
    }).fail(function(){
        vistacargando();
        $("#content_visualizarDocumento_depa").html(`
            <h2 class="codDoc_asociado" style="margin-bottom: 20px;"> 
                <center><i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO CARGAR EL DOCUMENTO </center>
            </h2>
        `);
    });
}
function ver_doc_admi(ruta){
    
    $.get(`/materiales/obtenerDocumento/${ruta}`, function(docB64){
        var encabezado = '<hr style="margin: 10px 0px;"><p style="font-weight: 700;"><i class="fa fa-desktop"></i> Vista previa del documento</p>';
        $("#documento_principal_bodega").html(encabezado+" "+`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 650px;"></iframe>`);
    });
}

function documentos(id){
    $("#content_visualizarDocumento_depa").html('');
    vistacargando('m','Obteniendo documentos....');
    $.get('/materiales/listadocumentos/'+id, function (data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }
        $('#btn_descarga_todo').html(`<a id="btn_descargar_todos_documentos" href="/materiales/descargar_todo_doc/${id}"  class="btn btn-info btn-sm" > <i class="fa fa-download"></i> Descargar Todos los Documentos</a>`);
        $('#tbody_documentos').html('');
        $("#tabla_doc").DataTable().destroy();
        $('#tabla_doc tbody').empty();
        var disco='diskSolicitudMateriales';
        $.each(data['detalle'], function(i, item){
            $('#tbody_documentos').append(`<tr role="row" class="bg-warning">
                <td width="50%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                    ${item['departamento'][0]['nombre']}
                </td>
                <td width="20%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                    ${item['descripcion']}
                </td>
                <td width="100%"  style="text-align: center; vertical-align: middle;"  class="paddingTR">
                    <center>
                        <a onclick="verdocumento('${item['ruta_encrypt']}')" data-toggle="tooltip" data-placement="top" data-original-title="Visualizar documento" type="button" class="btn btn-info btn-sm btn_icon_lg">
                            <i class="fa fa-eye" >
                            </i> Ver
                        </a>
                        <a target="_blank" href="/buscarDocumento/diskSolicitudMateriales/${item['ruta_encrypt']}" data-toggle="tooltip" data-placement="top" data-original-title="Abrir documento en otra pestaña" type="button" class="btn btn-primary btn-sm btn_icon_lg ">
                            <i class="fa fa-share" >
                            </i> 
                        </a>
                    </center>
                </td>
            </tr>  `);
        });
        $('[data-toggle="tooltip"]').tooltip(); 
        $('#modal_documentos').modal('show');
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    })
}

function ver_doc_orden(ruta){
    vistacargando('m','Cargando documento...');
    $.get(`/materiales/obtenerDocumentoOrden/${ruta}`, function(docB64){
        var encabezado = '<hr style="margin: 10px 0px;"><p style="font-weight: 700;"><i class="fa fa-desktop"></i> Vista previa del documento</p>';
        $("#content_doc_orden").html(encabezado+" "+`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 450px;"></iframe> <br><div align="center"><button onclick="ocultar_documento()" class="btn btn-primary"> Ocultar documento</button></div>`);
        vistacargando();
        // $('#modal_doc_orden').modal();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
}

function ocultar_documento(){
    $("#content_doc_orden").html('');
}

function eliminar_orden_pedido(id){
    $('#modal_proveedores').addClass('disabled_content');
    swal({
        title: "",
        text: "¿Esta seguro que desea eliminar la orden de pedido",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            vistacargando("M",'Eliminando orden de pedido');
            $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
        
            $.ajax({
                type: "DELETE",
                url: '/materiales/elimar_orden_pedido/'+id,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){ 
                    if(data['error']==true){
                        alertNotificar(data['detalle'],'error');
                        vistacargando();
                        return;
                    }
                    if(data['error']==false){
                        alertNotificar(data['detalle'],'success');
                        cargar_ordenes_pedidos(data['idsolicitud']);
                    }
                    vistacargando();
                }
            }); 
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
        $('#modal_proveedores').removeClass('disabled_content');

    }); 

}

function aprobar_orden(idsolicitud){
    $('#modal_proveedores').addClass('disabled_content');
    swal({
        title: "",
        text: "¿Está seguro que desea aprobar la orden de pedido?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, aprobar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            vistacargando('m','Aprobando orden de pedido...');
            $.get(`/materiales/aprobarOrdenes/${idsolicitud}`, function(data){
                if(data['error']==true){
                    alertNotificar(data['detalle'],'error');
                    vistacargando();
                    return;
                }
                if(data['error']==false){
                    window.location='/materiales/ordenPedido';
                    // cargar_ordenes_pedidos(data['idsolicitud']);
                }
                // vistacargando();
            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente','error');
                vistacargando();
            });
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
        $('#modal_proveedores').removeClass('disabled_content');
    }); 
}