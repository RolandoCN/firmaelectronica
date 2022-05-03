
function buscar_por_solicitud(valor){
    if(valor.value=='DEP'){
        $('#departamento_div').show('200');
        $('#criterio_div').hide(200);
    }else{
        $('#criterio_div').show(200);
        $('#departamento_div').hide('200');

    }
}

$("#frm_buscar_solicitud").submit(function(e){ 

    e.preventDefault();
    if($('#buscar_por').val()!='DEP'){
        // if($('#criterio').val()==''){
        //     alertNotificar("Debe seleccionar el criterio de busqueda", "default"); return;
        // }
    }else{
        if($('#cmb_departamento').val()==''){
            alertNotificar("Debe seleccionar el departamento", "default"); return;
        }
    }
      vistacargando('m','Buscando información...');
      var FrmData = new FormData(this);
      $.ajaxSetup({
          headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
      });
      $.ajax({
          url: "/materiales/buscar_solicitud",
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
             cargartable(data);
             $('#div_tabla').show(200);
          },
          error: function(error){
              vistacargando(); // ocultamos la ventana de espera
              alertNotificar("Error al obtener la información de las solicitudes", "error");
          }
      }).fail(function(){
            alertNotificar('Ocurrió un error intente nuevamente','error');
            vistacargando();
        });


});

function cargartable(data){
	$('#body_solicitudes').html('');
	$("#tabla_solicitudes").DataTable().destroy();
    $('#tabla_solicitudes tbody').empty();
    var estado='---';
    $.each(data['detalle'], function(i, item){

        if(item['estado_dep_soli']=='A' && item['estado_dep_admi']=='A' && item['estado_dep_orden']=='A' &&  item['estado_firm_orden']=='A'  && item['estado_firm_orden']=='A' && item['estado_dep_egreso']=='A' && item['estado_dep_firma_soli']=='A'){
            estado=`<span style="background-color:#1ea81c" class="badge badge-info"><i class="fa fa-check"></i> Finalizado</span>`;
        }else{
            estado=`<span style="background-color:#f58a2f" class="badge badge-info">Pendiente</span>`;
        }
    	$('#body_solicitudes').append(`<tr role="row" class="odd">
                            <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            ${i+1}
	                        </td>
	                        <td width="15%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            ${item['codigo']}
	                        </td>
	                       <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['created_at']}
	                        </td>
                            <td style=" vertical-align: middle;"  class="paddingTR">
                                ${item['descripcion']}
	                        </td>
	                        <td style=" vertical-align: middle;"  class="paddingTR">
                                ${item['departamento']['nombre']}
	                        </td>
                            <td width="5%" style="  vertical-align: middle; text-align:center "  class="paddingTR">
                                ${estado}
                            </td>
	                        <td width="20%"  style="text-align: center; vertical-align: middle;"  class="paddingTR">
	                        	<center>
                                    <button onclick="detalle_solicitud('${item['idsolicitud_material_encrypt']}')" type="button" class="btn btn-sm btn-info marginB0">
                                        <i class="fa fa-eye" >
                                        </i> Detalle
                                    </button>
                                </center>
	                        </td>
	                    </tr>  `);
    });
    cargar_estilos_tabla("tabla_solicitudes");
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
        order: [[ 1, "asc" ]],
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

function detalle_solicitud(idsolicitud){
    vistacargando('m','Por favor espere...');
    $.get(`/materiales/consulta_detalle/${idsolicitud}`, function(data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }
        $('#panel_buscar').hide();
        $('#detalle_solicitud').show(200);
        //cargamos la data
        $('#asunto_detalle').html('<b>Asunto:</b> '+data['detalle']['descripcion']);
        $('#cod_solicitud').html('<b>Código:</b> '+data['detalle']['codigo']);
        $('#documentos_solicitud').html(`<b>Documentos: </b> <button onclick="documentos('${idsolicitud}')" class="btn btn-sm btn-info"><i class="fa fa-eye"></i> Ver documentos</button>`);

        cod_solicitud
        var solicitud='Solicitud';
        var estado_solicitud='<b style="color:red">Pendiente</b>';
        var administrativo='Aprobación administrativo';
        var estado_administrativo='<b style="color:red">Pendiente</b>';
        var orden='Orden de pedido';
        var estado_orden='<b style="color:red">Pendiente</b>';
        var firma_orden='Firma orden de pedido';
        var estado_firmarorden='<b style="color:red">Pendiente</b>';
        var egreso='Gestión egreso';
        var estado_egreso='<b style="color:red">Pendiente</b>';
        var firmaegreso='Firma egreso solicitante';
        var estado_firmaegreso='<b style="color:red">Pendiente</b>';
        if(data['detalle']['estado_dep_soli']=='E'){
            estado_solicitud='En elaboración';
        }
        if(data['detalle']['estado_dep_soli']=='S'){
            estado_solicitud='Subido';
        }
        if(data['detalle']['estado_dep_soli']=='A'){
            estado_solicitud='<b style="color:green">Aprobado</b>';
        }
        if(data['detalle']['estado_dep_admi']=='A'){
            estado_administrativo='<b style="color:green">Aprobado</b>';
        }
        if(data['detalle']['estado_dep_orden']=='A'){
            estado_orden='<b style="color:green">Generada</b>';
        }
        if(data['detalle']['estado_firm_orden']=='A'){
            estado_firmarorden='<b style="color:green">Aprobado</b>';
        }
        if(data['detalle']['estado_dep_egreso']=='A'){
            estado_egreso='<b style="color:green">Aprobado</b>';
        }
        if(data['detalle']['estado_dep_firma_soli']=='A'){
            estado_firmaegreso='<b style="color:green">Aprobado</b>';
        }

        $('#body_table_historial').html(`
                                        <tr>
                                            <td>${solicitud}</td>
                                            <td>${estado_solicitud}</td>
                                        </tr>
                                        <tr>
                                            <td>${administrativo}</td>
                                            <td>${estado_administrativo}</td>
                                        </tr>
                                        <tr>
                                            <td>${orden}</td>
                                            <td>${estado_orden}</td>
                                        </tr>
                                        <tr>
                                            <td>${firma_orden}</td>
                                            <td>${estado_firmarorden}</td>
                                        </tr>
                                        <tr>
                                            <td>${egreso}</td>
                                            <td>${estado_egreso}</td>
                                        </tr>
                                        <tr>
                                            <td>${firmaegreso}</td>
                                            <td>${estado_firmaegreso}</td>
                                        </tr>                                    
        `);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });

}

function regresar(){
    $('#detalle_solicitud').hide();
    $('#panel_buscar').show(200);
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