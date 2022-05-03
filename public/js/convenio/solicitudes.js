$(document).ready(function () {
    vistacargando('m','Cargando solicitudes...');
    lista_solicitudes();
    
});

function lista_solicitudes(){
    $.get('/convenio/lista_solicitudes',function(data){
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
        order: [[ 0, "desc" ]],
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
	$('#body_lista_solicitudes').html('');
	$("#table_solicitudes").DataTable().destroy();
    $('#table_solicitudes tbody').empty();
    contadorGenerado=0;
    $.each(data['detalle'], function(i, item){
        var estado='';
        var observacion='';
        var observacion_reprueba='';
        if(item['estado_aprobacion']=='A'){
            estado=`<span style="background-color:#1ea81c" class="badge badge-info"> <i class="fa fa-check"></i> Aprobado</span>`;
            
            if(item['estado_pago']=='A'){
                var observacion='Pago realizado';
            }
            if(item['estado_pago']=='R' || item['estado_pago']=='P'){
                var observacion='Por pagar';
            }
            if(item['estado_pago']=='A' && item['estado']=='A'){
                var observacion='Convenio finalizado';
            }
        }else if(item['estado_aprobacion']=='P'){
            estado=`<span style="background-color:#f58a2f" class="badge badge-info"> Pendiente de aprobar</span>`;
        }else if(item['estado_aprobacion']=='R'){
            estado=`<span style="background-color:#ec3b3b" class="badge badge-info"> Reprobado</span>`;
            observacion_reprueba=item['observacion_reprueba'];
        }
       
    	$('#body_lista_solicitudes').append(`<tr role="row" class="odd">
	                        <td width="15%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            ${item['created_at']}
	                        </td>
	                       <td width="35%" style=" vertical-align: middle; text-align:left"  class="paddingTR">
                               <b> Razón social: </b> ${item['usuario']['name']} <br>
                               <b> Identificación: </b> ${item['usuario']['cedula']} <br>

	                        </td>
                            <td width="20%" style=" vertical-align: middle;"  class="paddingTR">
                                ${observacion_reprueba}
	                        </td>
	                        <td width="5%"  style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${estado}
                                <b style="font-size:9px">${observacion}</b>
	                        </td>
	                        <td width="10%"   style="text-align: center; vertical-align: middle;"  class="paddingTR">
	                        	<center>
                                    <button onclick="detalle('${item['idconv_solicitud_encrypt']}')" type="button" class="btn btn-sm btn-info marginB0">
                                        <i class="fa fa-edit" >
                                        </i> Detalle
                                    </button>
                                </center>
	                        </td>
	                        
	                    </tr>  `);
    });
    cargar_estilos_tabla("table_solicitudes");
}

function detalle(id){
    $('#body_tabla_emision').html('');
	$("#tabla_emision").DataTable().destroy();
    $('#tabla_emision tbody').empty();
    var num_col = $("#tabla_emision thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tabla_emision tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 

    $('#body_tabla_cuotas_pago').html('');
	$("#tabla_cuotas").DataTable().destroy();
    $('#tabla_cuotas tbody').empty();
    var num_col = $("#tabla_cuotas thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tabla_cuotas tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 



    vistacargando('m','Por favor espere...');
    $('#lista_materiales_aprobar').html('');
    $('#materiales_proveedores').html('');
    $.get('/convenio/detalle/'+id, function (data){
        if(data['error']==true){
            alertNotificar('Error al obtener detalle, intente nuevamente','error');
            vistacargando();
            return;
        }
       

        var estado='';
        var observacion='';
        var observacion_reprueba='';
        var estado_pago='Pendiente';
        var color='';
        var documento_convenio='';
        if(data['detalle']['estado_aprobacion']=='A'){
            estado=`<span style="background-color:#1ea81c" class="badge badge-info"> <i class="fa fa-check"></i> Aprobado</span>`;
            
            if(data['detalle']['estado_pago']=='A'){
                var observacion=`<p style="color:black"class="col-md-6"><b>Estado de pago:</b> Pago realizado</p>`;
                estado_pago='Pagado';
                color=`background-color:#dffbdf`;
                var documento_convenio=`<p style="color:black"class="col-md-6"><b>Documento:</b> <span class="btn btn-xs btn-primary" onclick="generar_documento('${data.detalle.idconv_solicitud}')">Visualizar</span></p>`;
            }
            if(data['detalle']['estado_pago']=='R' || data['detalle']['estado_pago']=='P'){
                var observacion=`<p style="color:black"class="col-md-6" ><b>Estado de pago:</b> Por pagar</p>`;
            }
            if(data['detalle']['estado_pago']=='A' && data['detalle']['estado']=='A'){
                `<p style="color:black"class="col-md-6"><b>Estado de pago:</b> Convenio finalizado</p>`
                estado_pago='Pagado';
            }
        }else if(data['detalle']['estado_aprobacion']=='P'){
            estado=`<span style="background-color:#f58a2f" class="badge badge-info"> Pendiente de aprobar</span>`;
        }else if(data['detalle']['estado_aprobacion']=='R'){
            estado=`<span style="background-color:#ec3b3b" class="badge badge-info"> Reprobado</span>`;
            observacion_reprueba=`<p style="color:black" class="col-md-6"><b>Observación:</b> ${data['detalle']['observacion_reprueba']}</p>`;
        }

        var titulos_creditos=`<p style="color:black"class="col-md-6"><b>Títulos de Créditos:</b> <span class="btn btn-xs btn-primary" onclick="verTitulos()">Visualizar</span></p>`;

        $('#detalle_solicitud_us').html(`<p style="color:black"class="col-md-6" ><b>Usuario:</b> ${data['detalle']['usuario']['name']}</p>
        <p style="color:black" class="col-md-6"><b>Deuda total:</b> $${data['detalle']['deudaactual']}</p>
        <p style="color:black" class="col-md-6" ><b>Valor de entrada:</b> $${data['detalle']['cuotaentrada']}</p>
        <p style="color:black" class="col-md-6"><b>Número de cuotas:</b> ${data['detalle']['cantidad_cuotas']}</p>
       
        
       
        ${observacion}
        ${observacion_reprueba}
        <p style="color:black" class="col-md-6"><b>Estado:</b> ${estado}</p>
        ${documento_convenio}
        ${titulos_creditos}
        `);

        $('#body_tabla_cuotas_pago').html('');
        $('#body_tabla_cuotas_pago').html(`<tr style="text-align:center;${color}"><td>Cuota inicial</td><td>$${data['detalle']['cuotaentrada']}</td><td>${data['detalle']['fecha_solicitud']}</td><td>${estado_pago}</td></tr>`);
		$.each(data['detalle']['cuotas'],function(i,item){
            if(item['estado_pago']=='Pagado'){
                color=`background-color:#dffbdf`;
            }else{
                color=``;
            }
			$('#tabla_cuotas').append(`<tr style="text-align:center;${color}">
								<td>${item['numero']}</td>
								<td>$${item['valor']}</td>
								<td>${item['fechaobligacion']}</td>
                                <td>${item['estado_pago']}</td>
								</tr>`);
		});
        cargar_estilos_tabla_cuotas("tabla_cuotas",10);


        //seccion titulo credito
        var emisiones=jQuery.parseJSON(data.detalle.json_emisiones);
        var lista_emi=[];
        $.each(emisiones,function(i,item){
          lista_emi.push(item.emi01codi);
		});
		$('#body_tabla_emision').html('');	
        $.each(emisiones,function(i,item){
            var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva']))-parseFloat(item['descuento']);
           
			$('#tabla_emision').append(`<tr">
								<td style="text-align:center;width:20%">${item['emi01codi']}</td>
								<td style="text-align:left;width:50%">${item['impuesto']}</td>
								<td style="text-align:center;width:20%">${item['fecha_obli']}</td>
                                <td style="text-align:center;width:10%">$${parseFloat(total).toFixed(2)}</td>
								</tr>`);
		});
        cargar_estilos_tabla_emision("tabla_emision",5);

        $('#div_lista_solicitudes').hide(200);
        $('#detalle_convenio').show(200);

        // $('#botones_accion').html(`<button type="button" onclick="aprobar_egresos('${data['detalle']['idsolicitud_material_encrypt']}')" class="btn btn-success"><i class="fa fa-magic"></i> Aprobar egresos</button>
        // ${botonrevision}
        // <button type="button" onclick="regresar()" class="btn btn-danger "><i class="fa fa-mail-reply"></i> Atrás</button>`);
        
        if(data['detalle'].estado_pago=='P' && data['detalle']['estado_aprobacion']=='A' ){
            $('#botones_accion').html(`<button type="button" onclick="reprobar('${id}')" class="btn btn-danger"><i class="fa fa-thumbs-o-down"></i> Reprobar solicitud</button><button type="button" onclick="regresar()" class="btn btn-warning "><i class="fa fa-mail-reply"></i> Atrás</button>`);
        }
        else if(data['detalle'].estado_pago=='P' && data['detalle']['estado_aprobacion']=='R' ){
            $('#botones_accion').html(`<button type="button" onclick="aprobar('${id}')" class="btn btn-success"><i class="fa fa-thumbs-o-up"></i> Aprobar solicitud</button><button type="button" onclick="regresar()" class="btn btn-warning "><i class="fa fa-mail-reply"></i> Atrás</button>`);
        }

        else if(data['detalle']['estado_aprobacion']=='P'){
            $('#botones_accion').html(`<button type="button" onclick="aprobar('${id}')" class="btn btn-success"><i class="fa fa-thumbs-o-up"></i> Aprobar solicitud</button><button type="button" onclick="reprobar('${id}')" class="btn btn-danger"><i class="fa fa-thumbs-o-down"></i> Reprobar solicitud</button><button type="button" onclick="regresar()" class="btn btn-warning "><i class="fa fa-mail-reply"></i> Atrás</button>`);
        }else{
            $('#botones_accion').html(`<button type="button" onclick="regresar()" class="btn btn-danger "><i class="fa fa-mail-reply"></i> Atrás</button>`);
        }

        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
}
function cargar_estilos_tabla_emision(idtabla,pageLength){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "asc" ]],
        pageLength: pageLength,
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
function cargar_estilos_tabla_cuotas(idtabla,pageLength){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        // order: [[ 0, "asc" ]],
        pageLength: pageLength,
        sInfoFiltered:false,
        searching:false,
        ordering:false,
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

function verTitulos(){
    $('#modal_titulo').modal('show');
}

function regresar(){
    $('#div_lista_solicitudes').show(200);
    $('#detalle_convenio').hide(200);
}



function aprobar(id){
    swal({
        title: "",
        text: "¿Está seguro que desea aprobar la solicitud?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, aprobar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        
        if (isConfirm) { // si dice que si
            vistacargando('M','Espere por favor...');
            $.get('/convenio/aprobar/'+id, function (data){
                if(data['error']==true){
                    alertNotificar(data['detalle'],'error');
                    vistacargando();
                    lista_solicitudes();
                    return;
                }
                alertNotificar(data['detalle'],'success');
                lista_solicitudes();
                vistacargando();
                regresar();
            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente','error');
                vistacargando();
            });      
        }

        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
    
}


function reprobar(id){
    swal({
        title: "¿Está seguro que desea reprobar esta solicitud?",
        html: true,
        text: `<textarea  rows="6" style="resize:none" placeholder="Ingrese la observación" class="form-control" cols="50" id="obsevacion_reprobacion"></textarea>`,
        // type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonClass: "btn-sm btn-success",
        cancelButtonClass: "btn-sm btn-default",
        confirmButtonText: "Reprobar",
        cancelButtonText: "Cancelar",
    }, function () {
        if ($('#obsevacion_reprobacion').val()=='' ){
            alertNotificar('Por favor llenar todos los campos','error'); 
            return false;
        }
        guardar_reprobar(id, $('#obsevacion_reprobacion').val());
        sweetAlert.close();        
    });
}

function guardar_reprobar(id,observacion){
    vistacargando('M','Espere por favor..');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: `/convenio/reprobar`,
        method: "POST",
        data: {
            'id':id,
            'observacion':observacion,},
        success: function(data){

            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                lista_solicitudes();
                return;
            }
            alertNotificar(data['detalle'],'success');
            lista_solicitudes();
            vistacargando();
            regresar();
        },
        error: function(){
            alertNotificar("Ocurrió un error intente nuevamente", "error");    
            vistacargando();                
        }
    });
}

//para generar y visulizar el documento
function generar_documento(id){
    
    $('#btn_modal_doc').html('');
    vistacargando("m", "Espere por favor");
    $.get('/convenio/generarDocumento/'+id,function(data){
        console.log(data)
        vistacargando();
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        verpdf(data.solicitud.ruta_documento,data.solicitud.idconv_solicitud,data.solicitud.archivo_subido_firmado);
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
}

//permite visualizarr el pdf de la emision en una modal
function verpdf(ruta,codigo,estdo_firma){
    var iframe=$('#iframePdf');
    iframe.attr("src", "/convenio/visualizarDoc/"+ruta);   
    // $("#vinculo").attr("href", '/convenio/descargarDoc/'+codigo+'/descargar');
    $("#documentopdf").modal("show");
    $('#titulo').html('Convenio de Pago');

    if(estdo_firma==1){
        var btn_volver_generar=` <button type="button" class="btn btn-success" onclick="volver_generar(${codigo})"> Volver Generar Documento</button>`;
        var btn_subir_arch="";
    }else{
        var btn_volver_generar='';
        var btn_subir_arch=`  <button type="button" class="btn btn-danger" onclick="subir_firmado(${codigo})"> Subir Documento Firmado</button>`;
    }
    $('#btn_modal_doc').append(`<a href="/convenio/descargarDoc/${codigo}/descargar" id="vinculo"><button  type="button" id="descargar"class="btn btn-primary"><i class="fa fa-mail"></i> Descargar</button> </a>        
    ${btn_subir_arch}
    ${btn_volver_generar} `)
}

//limpiamos los datos de la modal
$('#documentopdf').on('hidden.bs.modal', function (e) {            
    var iframe=$('#iframePdf');
    iframe.attr("src", null);
    cancelar_subir_doc();
    $('#documento_subido').val('');

});

$('#descargar').click(function(){
    $('#documentopdf').modal("hide");
});

//si da clic en subir un archivo
function subir_firmado(id){
    $('#archivo_form').show();
    $('#archivo').hide();
    $('#pie_modal_arch').hide();
    $('#idsolicitud').val(id);
}

//si cancela la operacion de subir archivo
function cancelar_subir_doc(){
    $('#archivo_form').hide();
    $('#archivo').show();
    $('#pie_modal_arch').show();
    $('#documento_subido').val('');
    $('#idsolicitud').val('');
}

//si presiona el boton guardar de subir documento
function subir_documento(){
    //comprobamos que suba el archivo
    var nuevo_doc=$('#documento_subido').val();
    if(nuevo_doc=='' || nuevo_doc==undefined){
        alertNotificar("Debe subir un documento","error");
        return;
    }
    var ext = nuevo_doc.split('.').pop();
    if(ext != "pdf"){
        alertNotificar("Debe subir un documento, en formato PDF","error");
        return;
    }

    swal({
        title: "",
        text: "¿Está seguro que desea subir este documento?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, continuar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        
        if (isConfirm) { // si dice que si
            $('#frmArchivoSubir').submit();
        }

        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}

//formulario para subir el archivo
$('#frmArchivoSubir').submit(function(e){
    e.preventDefault();
    vistacargando('m','Espere por favor');
    $.ajaxSetup({
       headers: {
               'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
       });        

       $.ajax({
           type: "POST",
           url: '/convenio/subirDocumento',
           data: new FormData(this),
           contentType: false,
           cache: false,
           processData:false,
           success: function(data){ 
             
               vistacargando();
               if(data['error']==true){
                   alertNotificar(data['detalle'],'error');
                   return;
               }
               if(data['error']==false){
                   alertNotificar(data['detalle'],'success');
                   $('#documentopdf').modal("hide");
               }
            },error: function(e){
                vistacargando("");
                alertNotificar('Ocurrió un error, intente nuevamente', "error");
                return;
            }
       });
   
});

//si presiona el boton de generar nuevamente el documento
function volver_generar(id){
    
    swal({
        title: "",
        text: "¿Está seguro que desea generar de nuevo el documento?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, continuar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        
        if (isConfirm) { // si dice que si
           
            vistacargando("m", "Espere por favor");
            $.get('/convenio/volverGenerarDocumento/'+id,function(data){
                vistacargando();
                if(data.error==true){
                    alertNotificar(data.mensaje,'error');
                    return;                      
                }
                $('#documentopdf').modal("hide");
                alertNotificar('Documento generado exitosamente','success');
            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente','error');
                vistacargando();
            });
        }

        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}
