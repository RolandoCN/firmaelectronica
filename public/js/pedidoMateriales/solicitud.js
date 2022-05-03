$(document).ready(function () {
    vistacargando('m','Cargando solicitudes...');
    lista_solicitudes();
    
});

function lista_solicitudes(){
    $.get('/materiales/lista_solicitud',function(data){
   
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

function cargar_estilos_tabla(idtabla){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 1, "desc" ]],
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

function cargartablesolicitud(data){
	$('#lista_pedidos').html('');
	$("#table_pedidos").DataTable().destroy();
    $('#table_pedidos tbody').empty();
    contadorGenerado=0;
    $.each(data['detalle'], function(i, item){
        var estado='';
        var eliminar='';
        var editar='';
        var color='';
        var observacion='';
        if(item['estado_dep_soli']=='E'){
            estado=`<span style="background-color:#f5af2f" class="badge badge-warning">En elaboración</span>`;
            eliminar=`<button onclick="eliminar_solicitud('${item['idsolicitud_material_encrypt']}')" type="button" class="btn btn-sm btn-danger marginB0">
                            <i class="fa fa-file" >
                            </i> Eliminar
                        </button>`;
            editar=` <button onclick="editar_solicitud('${item['idsolicitud_material_encrypt']}')" type="button" class="btn btn-sm btn-info marginB0">
                            <i class="fa fa-pencil" >
                            </i> Editar
                    </button>`;
            if(item['observacion']!=null){
                var color='background-color:#ffb3b3';
                var observacion=item['observacion'];
            }
        }else if(item['estado_dep_soli']=='S'){
            estado=`<span style="background-color:#2f87f5" class="badge badge-info">Subido</span>`;
        }else if(item['estado_dep_soli']=='A'){
            if(item['estado_dep_soli']=='A' && item['estado_dep_admi']=='A' && item['estado_dep_orden']=='A' &&  item['estado_firm_orden']=='A'  && item['estado_firm_orden']=='A' && item['estado_dep_egreso']=='A'&& item['estado_dep_firma_soli']=='A'){
                estado=`<span style="background-color:#1ea81c" class="badge badge-info"><i class="fa fa-check"></i> Finalizado</span>`;
            }else{
                estado=`<span style="background-color:#f58a2f" class="badge badge-info">Aprobado por el Jefe</span>`;
            }
        }

   
        // var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['recargo']))-parseFloat(item['descuento']);
    	$('#lista_pedidos').append(`<tr role="row" class="odd">
	                        <td width="15%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            ${item['codigo']}
	                        </td>
	                       <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['created_at']}
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
	                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
	                        	<center>
                                    ${editar}
                                    <button onclick="documentos('${item['idsolicitud_material_encrypt']}')" type="button" class="btn btn-sm btn-info marginB0">
                                        <i class="fa fa-file" >
                                        </i> Documento
                                    </button>
                                    ${eliminar}
                                </center>
	                        </td>
	                        
	                    </tr>  `);
    });
    cargar_estilos_tabla("table_pedidos");
}

function nuevasolicitud(solicitud,fecha){
    //verificar si esta hablitado para solicitar materiales
    if(solicitud==0){
        alertNotificar(`Actualmente no se puede realizar solicitud, fecha para realizar solicitud <br> <b style="color:red">${fecha}</b>`)
        return;
    }
    $('#generarnuevo').hide(200);
    $('#nueva_solicitud').show(200);
    limpiar_generar_nuevo();
    $('#idsolicitud_edit').val('');
}

function regresarsolicitud(){
    $('#generarnuevo').show(200);
    $('#nueva_solicitud').hide(200);
}

//accion cuando seleeciona un item de los materiales
$('#cmb_material').on('change', function() {
    var idmaterial=$('#cmb_material').val();
    vistacargando("M", "Espere..");
    $.get('/materiales/seleccionarmaterial/'+idmaterial, function (data){
        vistacargando();
        if(data['error']==true){
            alertNotificar(data.resultado,'error');
            $('.option_material').prop('selected',false); 
            $(`#cmb_material option[value=""]`).prop('selected',true); 
            $("#cmb_material").trigger("chosen:updated");
            $('#stock').val('');
            // $('#cupo').val('');
            $('#repuestoname').val('');
            $('#unidad').val('');
            // $('#idrep').val('');
            // $('#idtipo').val('');
            $('#cantidad').val('');
            vistacargando();
            return;
        }
        $('#stock').val(data.resultado[0].cantidad);
        $('#cunitario').val(parseFloat(data.resultado[0].cpromedio).toFixed(2));
        $('#repuestoname').val(data.resultado[0].descripcion);
        $('#unidad').val(data.resultado[0].unidad);
        // $('#cupo').val(data.resultado[0].cupo);
        // $('#idrep').val(data.resultado[0].idrepuesto);
        // $('#idtipo').val(data.resultado[0].idtipo);
        $('#cantidad').val('');
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        $('.option_material').prop('selected',false); 
        $(`#cmb_material option[value=""]`).prop('selected',true); 
        $("#cmb_material").trigger("chosen:updated");
        $('#stock').val('');
        // $('#cupo').val('');
        $('#repuestoname').val('');
        $('#unidad').val('');
        vistacargando();
    })

})


function calcularTotal(input){
        var busqueda = $(input).val();
        var stockpermitido=$('#stock').val();
        // var cupo=$('#cupo').val();
        
        // if(parseInt(busqueda)>parseInt(cupo)){
        //     alertNotificar('No puede solicitar más del cupo permitido de: '+cupo,'warning');
        //     $("#cantidad").val('');
        //     $('#ctotal').val('');
        //     return;
        // }
        if(parseInt(busqueda)>parseInt(stockpermitido)){
        console.log(stockpermitido);
          alertNotificar(`No puede solicitar más del stock de bodega. <br> <b>Stock bodega: ${stockpermitido} </b>`,'warning');
          $("#cantidad").val('');
          $('#ctotal').val('');
        }
}

function agregar_material(){
    if($('#asunto').val()==''){
        alertNotificar('Por favor ingrese el asunto','warning');
        return;
    }
    if($('#cmb_material').val()==''){
        alertNotificar('Por favor seleccione el material','warning');
        return;
    }
    if($('#cantidad').val()=='' || $('#cantidad').val()==0){
        alertNotificar('Por ingrese la cantidad a solicitar','warning');
        return;
    }

    if($(`#input_${$('#cmb_material').val()}`).val()!=null){
        alertNotificar('Material ya se encuentra agregado','warning');
        return;
    }
    $('#group_material').append(`<input name="input_materiales[]" id="input_${$('#cmb_material').val()}" value="${$('#cmb_material').val()};${$('#cantidad').val()}">`);
    $('#lista_materiales').append(`<tr id="tr_${$('#cmb_material').val()}">
                                        <td>${$('#cmb_material option:selected').text()}</td>
                                        <td>${$('#cantidad').val()}</td>
                                        <td>${$('#unidad').val()}</td>
                                        <td align="center" ><button type="button" onclick="eliminar_material(${$('#cmb_material').val()})" class="btn btn-danger btn-sm"><i class="fa fa-times"></i> Quitar</button></td>`);
    $('#botones_accion').removeClass('hidden');
    $('#tabla_pedido_carrito').show(200);

}

function eliminar_material(idmaterial){
    $(`#tr_${idmaterial}`).remove();
    $(`#input_${idmaterial}`).remove();
    if($('#group_material').children('input').length<=0){
        $('#botones_accion').addClass('hidden');
    }else{
        $('#botones_accion').removeClass('hidden');
    }
}
 
$('#frm_add_material').submit(function(e){
    e.preventDefault();

    vistacargando('M','Procesando solicitud...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        url: '/materiales/guardar_solicitud',
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
            lista_solicitudes();
            $('#generarnuevo').show(200);
            $('#nueva_solicitud').hide(200);
            alertNotificar(data['detalle'],'success');
            limpiar_generar_nuevo();
        },
        error: function(e){
             alertNotificar('Ocurrio un error intente nuevamente','error');
            vistacargando();
        }
    });
});

function guardar_solicitud(subir=null){
    var tittle='¿Esta seguro que desea guardar la solicitud, está opción la dejará en estado de elaboración?';
    var guardar='Si, guardar';
    if(subir==1){
        $('#idsolicitud_enviar').val(1);
        tittle='¿Esta seguro que desea guardar y subir la solicitud para que el jefe del departamento apruebe?';
        guardar='Si, guardar y subir';
    }
    swal({
        title: "",
        text: tittle,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: guardar,
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            
            $('#frm_add_material').submit();
        }
        $('#idsolicitud_enviar').val(0);
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}


function limpiar_generar_nuevo(){
    $('#stock').val('');
    $('#asunto').val('');
    $('#cunitario').val('');
    $('#cupo').val('');
    $('#unidad').val('');
    $('#cantidad').val('');
    $('#ctotal').val('');
    $('#group_material').html('');
    $('#botones_accion').addClass('hidden');
    $('#lista_materiales').html('');
    $('.option_material').prop('selected',false); 
    $(`#cmb_material option[value=""]`).prop('selected',true); 
    $("#cmb_material").trigger("chosen:updated");
    $('#tabla_pedido_carrito').hide(200);
}

function editar_solicitud(id){
    limpiar_generar_nuevo();
    vistacargando('m','Por favor espere...');
    $.get('/materiales/edit/'+id, function (data){
       $.each(data['detalle']['detalle'],function(i,item){
            $('#group_material').append(`<input name="input_materiales[]" id="input_${item['idmaterial']}" value="${item['idmaterial']};${item['cantidad']}">`);
            $('#lista_materiales').append(`<tr id="tr_${item['idmaterial']}">
                                            <td>${item['idmaterial']} |${item['descripcion']}</td>
                                            <td>${item['cantidad']}</td>
                                            <td>${item['unidad']}</td>
                                            <td align="center"><button type="button" onclick="eliminar_material(${item['idmaterial']})" class="btn btn-danger btn-sm"><i class="fa fa-times"></i> Quitar</button></td>`);
       });
       $('#generarnuevo').hide(200);
       $('#nueva_solicitud').show(200);
       $('#botones_accion').removeClass('hidden');
       $('#tabla_pedido_carrito').show(200);

       $('#botones_accion').html(`<button type="button" onclick="guardar_solicitud()" class="btn btn-success"><i class="fa fa-save"></i> Guardar</button>
       <button type="button" onclick="guardar_solicitud(1)" class="btn btn-info "><i class="fa fa-upload"></i> Guardar y subir solicitud</button>`);
       $('#idsolicitud_edit').val(data['detalle']['idsolicitud_material_encrypt']);
       $('#asunto').val(data['detalle']['descripcion']);
       vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrión un error intente nuevamente','error');
        vistacargando();
    })
}

function eliminar_solicitud(id){
    swal({
        title: "",
        text: "¿Esta segur@ que desea eliminar la solicitud",
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
            vistacargando('m','Eliminando solicitud...');
            $.get('/materiales/eliminar/'+id, function (data){
                if(data['error']==true){
                    alertNotificar(data['detalle'],'error');
                    lista_solicitudes();
                    vistacargando();
                    return;
                }
                lista_solicitudes();
                alertNotificar(data['detalle'],'success');
                vistacargando();
            }).fail(function(){
                alertNotificar('Ocurrión un error intente nuevamente','error');
                vistacargando();
            })
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
    
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
        $.each(data['detalle'], function(i, item){
            $('#tbody_documentos').append(`<tr role="row" class="bg-warning">
                <td width="50%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                    ${item['departamento'][0]['nombre']}
                </td>
                <td width="20%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                    ${item['descripcion']}
                </td>
                <td width="100%" style="text-align: center; vertical-align: middle;"  class="paddingTR">
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
        alertNotificar('Ocurrión un error intente nuevamente','error');
        vistacargando();
    })
}

   