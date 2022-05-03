$(document).ready(function () {
    vistacargando('m','Cargando solicitudes...');
    lista_por_aprobar();
    
});

function lista_por_aprobar(){
    $.get('/materiales/lista_ordenes',function(data){
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
        order: [[ 0, "asc" ]],
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
        if(item['estado_dep_orden']=='A' && item['estado_firm_orden']=='P'){
            estado=`<span style="background-color:#2f87f5" class="badge badge-info">Por Firmar</span>`;
            detalle=`<button onclick="detalle('${item['idsolicitud_material_encrypt']}')" type="button" class="btn btn-sm btn-success marginB0">
            <i class="fa fa-eye" >
            </i> Detalle
            </button>`;
            if(item['observacion_egreso']!=null){
                var color='background-color:#ffb3b3';
                var observacion=item['observacion_egreso'];
            }
        }else if(item['estado_dep_orden']=='A'  && item['estado_firm_orden']=='A'){
            if(item['estado_dep_soli']=='A' && item['estado_dep_admi']=='A' && item['estado_dep_orden']=='A' &&  item['estado_firm_orden']=='A'  && item['estado_firm_orden']=='A' && item['estado_dep_egreso']=='A' && item['estado_dep_firma_soli']=='A'){
                estado=`<span style="background-color:#1ea81c" class="badge badge-info"><i class="fa fa-check"></i> Finalizado</span>`;
            }else{
                estado=`<span style="background-color:#f58a2f" class="badge badge-info">Firmado</span>`;
            }
        }
        // var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['recargo']))-parseFloat(item['descuento']);
    	$('#lista_pedidos').append(`<tr role="row" class="odd">
	                        <td width="15%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            ${item['codigo']}
	                        </td>
	                       <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['f_firma_orden_pedido']}
	                        </td>
                            <td style=" vertical-align: middle;"  class="paddingTR">
                                ${item['departamento']['nombre']}
	                        </td>
	                        <td style=" vertical-align: middle;"  class="paddingTR">
                                ${item['descripcion']}
	                        </td>
                            <td style=" vertical-align: middle; ${color}"   class="paddingTR">
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

function firmarManual(){
    vistacargando('m','Por favor espere....');
    $('#input_subirDocumento').val('');
    $('#text_subir_doc_manual').val('');
    $('#vista_doc_firmado').html('');
    $("#modal_metodo_firma").modal("hide");
    $('#input_subirDocumento').html('');
    $('#text_subir_doc_manual').html('');
    setTimeout(() => {
        $('#modal_subir_documento_firmado').modal('show');  
        vistacargando();  
    }, 500); 
}

function metodofirma(){
    $("#modal_metodo_firma").modal("show");
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

       $('#botones_accion').html(`<button type="button" onclick="metodofirma()" class="btn btn-success"><i class="fa fa-magic"></i> Firmar y enviar</button>
       <button type="button" onclick="enviar_revision('${data['detalle']['idsolicitud_material_encrypt']}')" class="btn btn-warning "><i class="fa fa-pencil"></i> Revisión</button>
       <button type="button" onclick="regresar()" class="btn btn-danger "><i class="fa fa-mail-reply"></i> Atrás</button>`);
       $('#idsolicitud_edit').val(data['detalle']['idsolicitud_material_encrypt']);
       $('#idsolicitud_encrypt').val(data['detalle']['idsolicitud_material_encrypt']);
       $('#idsolicitud_encrypt_firmar').val(data['detalle']['idsolicitud_material_encrypt']);
       $('#asunto').val(data['detalle']['descripcion']);
        if(data['detalle']['solicitu_doc']!=null){
            $('#descargar_doc_firma').html(`<p > <a  data-toggle="tooltip" data-placement="right" title="Recuerde que puede descargar el documento y firmarlo." id="btn_descargar_documento_firmar" class="btn btn-info btn-sm"  id="btn_descargar_documento_firmar" href="/materiales/descargardocorden/${data['detalle']['idsolicitud_material_encrypt']}" class="btn btn-info btn-sm" ><i class="fa fa-download"></i> Descargar documento</a></p>`);
        }
        ver_doc_ordenes(data['detalle']['documentoorden'][0]['ruta_encrypt']);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    })
}

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
function ver_doc_ordenes(ruta){
    
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

$(".input_subirDocumento").change(function(e){
    if(e.target.files.length>0){
        // obtenemos y mostramos el nombre del documento seleccionado
        var nombreDocSelc = $(this)[0].files[0].name;
        // validamos la extencion del documeto
        var tipoDocSalec = nombreDocSelc.split('.').pop(); // obtenemos la extención del documento
        if(tipoDocSalec != 'pdf' && tipoDocSalec !='PDF'){
            alertNotificar(`El formato del documento .${tipoDocSalec} no está permitido`, "error");
            return;
        }
        $('#text_subir_doc_manual').val(nombreDocSelc);
        $('#vista_doc_firmado').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
    }else{
        $('#vista_doc_firmado').html(``);
    }
});

function firmaelectronica(){
    $("#modal_metodo_firma").modal("hide");
    $("#modal_firma_electronica").modal("show");
}

$("#form_subir_documento_firmado").submit(function(e){ 
    e.preventDefault();
    $("#modal_subir_documento_firmado").modal("hide");
      var FrmData = new FormData(this);
      $.ajaxSetup({
          headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
      });
      vistacargando('M','Subiendo documento...'); // mostramos la ventana de espera
      $.ajax({
          url: "/materiales/firmar_ordenes",
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
             alertNotificar(data['detalle'],'success');
             location.reload();
                                      
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

$("#frm_firma_electronica").submit(function(e){ 
    e.preventDefault();
    $("#modal_firma_electronica").modal("hide");
    var FrmData = new FormData(this);
    $.ajaxSetup({
          headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
    });
    vistacargando('M','Firmando documento...'); // mostramos la ventana de espera
    $.ajax({
          url: "/materiales/firmar_ordenes_ele",
          method: 'POST',
          data: FrmData,
          dataType: 'json',
          contentType:false,
          cache:false,
          processData:false,
          success: function(data){
            // vistacargando(); // ocultamos la ventana de espera          
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }   
            alertNotificar(data['detalle'],'success');
            location.reload();
          },
          error: function(error){
              vistacargando(); // ocultamos la ventana de espera
              alertNotificar("Error al firmar", "error");
          }
      });
});

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
        url: `/materiales/revisionorden`,
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

 // funcion 1 para seleccionar un archivo
 $(".seleccionar_archivo_p12").click(function(e){
    $(this).parent().siblings('input').val($(this).parent().prop('title'));
    this.value = null; // limpiamos el archivo
});

// funcion 2 para seleccionar un archivo
$(".seleccionar_archivo_p12").change(function(e){

    if(this.files.length>0){ // si se selecciona un archivo
        archivo=(this.files[0].name);
        if(this.files[0].type != "application/x-pkcs12"){
            alertNotificar("Debe seleccionar un archivo .p12");
            this.value = null;
            return;
        }
        $(this).parent().siblings('input').val(archivo);
    }else{
        return;
    }

});
