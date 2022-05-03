$(document).ready(function(){
    cargar_eventos();
    cargar_destinatarios();
    cargar_evento_destino();
});


function selecc_requiere(){
	var cmb_requiere=$('#requiere').val();
	if(cmb_requiere=='Si'){
		$('#ruta_secc').show();
	}else if(cmb_requiere=='No'){
		$('#ruta_secc').hide();
		$('#ruta').val('');
	}else{
		alertNotificar("Seleccione si requiere o no de documento","error");
	}
}

//carga listado en la tabla
function cargar_eventos(){
	$('#tb_listaEventos').html('');
	$("#tablaEvento").DataTable().destroy();
    $('#tablaEvento tbody').empty();
    var num_col = $("#tablaEvento thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tablaEvento tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);   
   
    $.get("/gestionCoactiva/cargarListadoEvento", function(data){
        
        if(data.error==true){
            $("#tablaEvento tbody").html('');
            $("#tablaEvento tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            $("#tablaEvento tbody").html('');
            $("#tablaEvento tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            return;                      

        }
        $("#tablaEvento tbody").html('');
        $.each(data['resultado'], function(i, item){
            
            
            $('#tablaEvento').append(`<tr role="row" class="odd">
                                <td  width="1%" colspan="1">
                                    ${i+1}
                                </td>

								<td style=" vertical-align: middle; text-align:center"  class="paddingTR">
									${item['codigo_documento']}
								</td>
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['descripcion']}
                                </td>
								<td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['requiere_documento']}
                                </td>
								<td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['titulo_coactivado']}
                                </td>
                               
                                <td width="15%"style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                    <center>
                                        <button type="button" onclick="evento_editar('${item.id_registro_eventos_encrypt}')" class="btn btn-sm btn-primary marginB0" >
                                            <i class="fa fa-edit" ></i> Editar
                                        </button>

                                        <button type="button" onclick="evento_eliminar('${item.id_registro_eventos_encrypt}')"class="btn btn-sm btn-danger marginB0" >
                                            <i class="fa fa-trash" ></i> Eliminar
                                        </button>
                                </center>
                                </td>
                                
                            </tr>  `);
                       
        });
    
        cargar_estilos_tabla("tablaEvento",10);
    
    }).fail(function(){
        $("#tablaEvento tbody").html('');
        $("#tablaEvento tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   

}

//carga listado en la tabla
function cargar_destinatarios(){
	$('#tb_listaDestino').html('');
	$("#tablaDestino").DataTable().destroy();
    $('#tablaDestino tbody').empty();
    var num_col = $("#tablaDestino thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tablaDestino tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);   
   
    $.get("/gestionCoactiva/cargarListadoDestinatario", function(data){
        
        if(data.error==true){
            $("#tablaDestino tbody").html('');
            $("#tablaDestino tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            $("#tablaDestino tbody").html('');
            $("#tablaDestino tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            return;                      

        }
        $("#tablaDestino tbody").html('');
        $.each(data['resultado'], function(i, item){
            
            
            $('#tablaDestino').append(`<tr role="row" class="odd">
                                <td  width="1%" colspan="1">
                                    ${i+1}
                                </td>
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['descripcion']}
                                </td>
                               
                                <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                    <center>
                                        <button type="button" onclick="destino_editar('${item.idregistro_destino_encrypt}')" class="btn btn-sm btn-primary marginB0" >
                                            <i class="fa fa-edit" ></i> Editar
                                        </button>

                                        <button type="button" onclick="destino_eliminar('${item.idregistro_destino_encrypt}')"class="btn btn-sm btn-danger marginB0" >
                                            <i class="fa fa-trash" ></i> Eliminar
                                        </button>
                                    </center>
                                </td>
                                
                            </tr>  `);
                       
        });
    
        cargar_estilos_tabla("tablaDestino",10);
    
    }).fail(function(){
        $("#tablaDestino tbody").html('');
        $("#tablaDestino tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   

}


function cargar_estilos_tabla(idtabla,pageLength){
   
    $("#"+idtabla).DataTable({
        'paging'      : true,
        'searching'   : true,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : false,
        "destroy":true,
        pageLength: 10,
        sInfoFiltered:false,
        language: {
            url: '/json/datatables/spanish.json',
        },
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


function evento_editar(idevento){
	vistacargando("m","Espere por favor");
	$.get("/gestionCoactiva/eventos/"+idevento+"/edit", function (data) {
        vistacargando("");
		$('#idevento').val(data.resultado.id_registro_eventos_encrypt);
        $('#txtevento').val(data.resultado.descripcion);
		$('#codigo').val(data.resultado.codigo_documento);
		$('#ruta').val(data.resultado.ruta_reporte);

		$('.option_req').prop('selected',false); // deseleccioamos 
        $(`#requiere option[value="${data.resultado.requiere_documento}"]`).prop('selected',true); 
        $("#requiere").trigger("chosen:updated"); 

		$('.option_tit').prop('selected',false); // deseleccioamos 
        $(`#tituloscoac option[value="${data.resultado.titulo_coactivado}"]`).prop('selected',true); 
        $("#tituloscoac").trigger("chosen:updated"); 

		if(data.resultado.requiere_documento=='Si'){
			$('#ruta_secc').show();
		}else{
			$('#ruta_secc').hide();
		}


		$('#txtevento').val(data.resultado.descripcion);
        $('#method_Eventos').val('PUT'); // decimo que sea un metodo put
	    $('#frm_Eventos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/eventos/'+idevento);
	    $('#btn_cancelar_evento').removeClass('hidden');
	    $('html,body').animate({scrollTop:$('#administradorEvento').offset().top},400);
    }).fail(function(error){
        vistacargando("");
        alertNotificar("Error al ejecutar la petición","error");
    });

}

//ACCION DEL BOTON DE CANCELAR EN EVENTO
$('#btn_cancelar_evento').click(function(){
    limpiar_campos_eventos();
    $('#method_Eventos').val('POST'); // decimos que sea un metodo put
    $('#frm_Eventos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/eventos');
    $(this).addClass('hidden');
});

function limpiar_campos_eventos(){
	$('#txtevento').val('');
	$('#idevento').val('');
	$('#txtevento').val('');
	$('#codigo').val('');
	$('#ruta').val('');

	$('.option_req').prop('selected',false); // deseleccionamos 
    $("#requiere").trigger("chosen:updated"); // actualizamos el combo 

	$('.option_tit').prop('selected',false); // deseleccionamos 
    $("#tituloscoac").trigger("chosen:updated"); // actualizamos el combo 

	$('#ruta_secc').hide();
	
}


///formulario de registro y actualizacion//
$("#frm_Eventos").on("submit", function(e){
	e.preventDefault();
	var descripcion=$('#txtevento').val();
	var codigo=$('#codigo').val();
	var requiere=$('#requiere').val();
	var ruta=$('#ruta').val();
	if(descripcion=="" || descripcion==null){
		alertNotificar("Debe registrar un evento","error");
		return;
	}
	if(codigo=="" || codigo==null){
		alertNotificar("Debe registrar un codigo","error");
		return;
	}
	if(requiere=="" || requiere==null){
		alertNotificar("Seleccione si requiere o no de documento","error");
		return;
	}
	if(requiere=="Si"){
		if(ruta=="" || ruta==null){
			alertNotificar("Debe registrar una ruta","error");
			return;
		}
	}
	$('#btn_guardar_zona').attr('disabled','disabled');

	if($('#method_Eventos').val()=='POST'){
	 guardar_evento(); 
	}else{
	 editar_evento();
	}
});

////guardar
function guardar_evento() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
	
	var data=$("#frm_Eventos").serialize();
	$.ajax({
		url:'/gestionCoactiva/eventos', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_eventos("");
			limpiar_campos_eventos();
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			limpiar_campos_eventos();
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}


////editar
function editar_evento() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	
	var id=$('#idevento').val();
	var data=$("#frm_Eventos").serialize();
	$.ajax({
		url:'/gestionCoactiva/eventos/'+id, // Url que se envia para la solicitud
		method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_eventos("");
			limpiar_campos_eventos();
			$('#method_Eventos').val('POST'); 
            $('#frm_Eventos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/eventos');
			$('#btn_cancelar_evento').addClass('hidden');
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}

////eliminar evento
function evento_eliminar(id) {
    
    if(confirm('¿Quiere eliminar el registro?')){
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		vistacargando("m","Espere por favor");
		$('#btn_guardar_zona').attr('disabled','disabled');
		$.ajax({
			url:'/gestionCoactiva/eventos/'+id, // Url que se envia para la solicitud
			method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
			dataType: 'json',
			success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
			{
				cargar_eventos("");
				limpiar_campos_eventos();
				vistacargando("");
				alertNotificar(requestData.mensaje,requestData.estadoP);
                $('#btn_cancelar_evento').click();
					
			}, error:function (requestData) {
                $('#btn_cancelar_evento').click();
				vistacargando("");
				alertNotificar(requestData.mensaje,requestData.estadoP);
				limpiar_campos_eventos();
			}
		});
    }

	limpiar_campos_eventos();
}





////////////DESTINOS//////////

function destino_editar(iddestino){
	vistacargando("m","Espere por Favor");
	$.get("/gestionCoactiva/destinos/"+iddestino+"/edit", function (data) {
        vistacargando("");
        
		$('#iddestino').val(data.resultado.idregistro_destino_encrypt);
        $('#txtdestino').val(data.resultado.descripcion);
        $('#method_Destino').val('PUT'); // decimo que sea un metodo put
	    $('#frm_Destino').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/destinos/'+iddestino);
	    $('#btn_cancelar_destino').removeClass('hidden');
	    $('html,body').animate({scrollTop:$('#administradorEvento').offset().top},400);
    }).fail(function(error){
        vistacargando("");
        alertNotificar("Error al ejecutar la petición","error");
    });

}

//ACCION DEL BOTON DE CANCELAR EN EVENTO
$('#btn_cancelar_destino').click(function(){
    limpiar_campos_destinos();
    $('#method_Destino').val('POST'); // decimos que sea un metodo put
    $('#frm_Destino').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/destinos');
    $(this).addClass('hidden');
});

function limpiar_campos_destinos(){
	$('#txtdestino').val('');
	$('#iddestino').val('');
	
}


///formulario de registro y actualizacion//
$("#frm_Destino").on("submit", function(e){
	e.preventDefault();
	var descripcion=$('#txtdestino').val();
	if(descripcion=="" || descripcion==null){
		alertNotificar("Debe registrar un destino","error");
		return;
	}
	$('#btn_guardar_zona').attr('disabled','disabled');

	if($('#method_Destino').val()=='POST'){
	 guardar_destino(); 
	}else{
	 editar_destino();
	}
});

////guardar
function guardar_destino() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
	
	var data=$("#frm_Destino").serialize();
	$.ajax({
		url:'/gestionCoactiva/destinos', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_destinatarios("");
			limpiar_campos_destinos();
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			limpiar_campos_destinos();
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}


////editar
function editar_destino() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	
	var id=$('#iddestino').val();
	var data=$("#frm_Destino").serialize();
	$.ajax({
		url:'/gestionCoactiva/destinos/'+id, // Url que se envia para la solicitud
		method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_destinatarios("");
			limpiar_campos_destinos();
			$('#method_Destino').val('POST'); 
            $('#frm_Destino').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/destinos');
			$('#btn_cancelar_destino').addClass('hidden');
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}

////eliminar destino
function destino_eliminar(id) {
    if(confirm('¿Quiere eliminar el registro?')){
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		vistacargando("m","Espere por favor");
		$('#btn_guardar_zona').attr('disabled','disabled');
		$.ajax({
			url:'/gestionCoactiva/destinos/'+id, // Url que se envia para la solicitud
			method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
			dataType: 'json',
			success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
			{
				$('#btn_cancelar_destino').click();
                cargar_destinatarios("");
				limpiar_campos_destinos();
				vistacargando("");
				alertNotificar(requestData.mensaje,requestData.estadoP);
					
			}, error:function (requestData) {
                $('#btn_cancelar_destino').click();
				vistacargando("");
				alertNotificar(requestData.mensaje,requestData.estadoP);
				limpiar_campos_destinos();
			}
		});
    }

	limpiar_campos_destinos();
}

////////FIN DESTINO



/////INICIO EVENTO DESTINO////////////////////

//carga listado en la tabla
function cargar_evento_destino(){
	$('#tb_listaEventosDEstinos').html('');
	$("#tablaEventoDestino").DataTable().destroy();
    $('#tablaEventoDestino tbody').empty();
    var num_col = $("#tablaEventoDestino thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tablaEventoDestino tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);   
   
    $.get("/gestionCoactiva/cargarEventoDestinatario", function(data){

		if(data.error==true){
            $("#tablaEventoDestino tbody").html('');
            $("#tablaEventoDestino tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            $("#tablaEventoDestino tbody").html('');
            $("#tablaEventoDestino tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            return;                      

        }
        $("#tablaEventoDestino tbody").html('');
        $.each(data['resultado'], function(i, item){
            
            
            $('#tablaEventoDestino').append(`<tr role="row" class="odd">
                                <td  width="1%" colspan="1">
                                    ${i+1}
                                </td>
								
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['evento']['descripcion']}
                                </td>
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['destino']['descripcion']}
                            </td>
                               
                                <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                    <center>
                                        <button type="button" onclick="eventodestino_editar('${item.idevento_destino_encrypt}')" class="btn btn-sm btn-primary marginB0" >
                                            <i class="fa fa-edit" ></i> Editar
                                        </button>

                                        <button type="button" onclick="event_destino_eliminar('${item.idevento_destino_encrypt}')"class="btn btn-sm btn-danger marginB0" >
                                            <i class="fa fa-trash" ></i> Eliminar
                                        </button>
                                    </center>
                                </td>
                                
                            </tr>  `);
                       
        });
    
        cargar_estilos_tabla("tablaEventoDestino",10);
    
    }).fail(function(){
        $("#tablaEventoDestino tbody").html('');
        $("#tablaEventoDestino tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   

}


function eventodestino_editar(iddestino){
	vistacargando("m","Espere por Favor");
	$.get("/gestionCoactiva/eventosDestinos/"+iddestino+"/edit", function (data) {
        vistacargando("");
		$('#ideventodestino').val(data.resultado.idevento_destino_encrypt);
        $('.option_evento').prop('selected',false); // deseleccioamos 
        $(`#cmb_evento option[value="${data.resultado.id_registro_eventos}"]`).prop('selected',true); 
        $("#cmb_evento").trigger("chosen:updated"); 

        $('.option_dirigido').prop('selected',false); // deseleccioamos 
        $(`#cmb_destino option[value="${data.resultado.idregistro_destino}"]`).prop('selected',true); 
        $("#cmb_destino").trigger("chosen:updated"); 

        $('#method_EventosDestinos').val('PUT'); // decimo que sea un metodo put
	    $('#frm_EventosDestinos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/eventosDestinos/'+iddestino);
	    $('#btn_cancelar_eventodes').removeClass('hidden');
	    $('html,body').animate({scrollTop:$('#administradorEvento').offset().top},400);
    }).fail(function(error){
        vistacargando("");
        alertNotificar("Error al ejecutar la petición","error");
    });

}

//ACCION DEL BOTON DE CANCELAR EN EVENTO
$('#btn_cancelar_eventodes').click(function(){
    limpiar_campos_event_destinos();
    $('#method_EventosDestinos').val('POST'); // decimos que sea un metodo put
    $('#frm_EventosDestinos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/eventosDestinos');
    $(this).addClass('hidden');
});

function limpiar_campos_event_destinos(){

	$('#ideventodestino').val('');
	cargarCmbEvento();
	cargarCmbDestino();
	// $('#cmb_evento').html('');
	$('#cmb_evento').append(`<option class="option_dirigido"value=""></option>`);
    $('.option_evento').prop('selected',false); // deseleccionamos 
    $("#cmb_evento").trigger("chosen:updated"); // actualizamos el combo 
    $('.option_dirigido').prop('selected',false); // deseleccionamos 
    $("#cmb_destino").trigger("chosen:updated"); // actualizamos el combo 
	
}


///formulario de registro y actualizacion//
$("#frm_EventosDestinos").on("submit", function(e){
	e.preventDefault();
	var evento=$('#cmb_evento').val();
    var destino=$('#cmb_destino').val();
	if(evento=="" || evento==null){
		alertNotificar("Debe seleccionar un evento","error");
		return;
	}
    if(destino=="" || destino==null){
		alertNotificar("Debe seleccionar un destino","error");
		return;
	}
	$('#btn_guardar_zona').attr('disabled','disabled');

	if($('#method_EventosDestinos').val()=='POST'){
	 guardar_eventodestino(); 
	}else{
	 editar_eventodestino();
	}
});

////guardar
function guardar_eventodestino() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
	
	var data=$("#frm_EventosDestinos").serialize();
	$.ajax({
		url:'/gestionCoactiva/eventosDestinos', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_evento_destino("");
			limpiar_campos_event_destinos();
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			limpiar_campos_event_destinos();
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}


////editar
function editar_eventodestino() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	
	var id=$('#ideventodestino').val();
	var data=$("#frm_EventosDestinos").serialize();
   
	$.ajax({
		url:'/gestionCoactiva/eventosDestinos/'+id, // Url que se envia para la solicitud
		method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{   
			vistacargando("");
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_evento_destino("");
			limpiar_campos_event_destinos();
			$('#method_EventosDestinos').val('POST'); 
            $('#frm_EventosDestinos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/eventosDestinos');
			$('#btn_cancelar_destino').addClass('hidden');
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}

////eliminar destino
function event_destino_eliminar(id) {
    
    if(confirm('¿Quiere eliminar el registro?')){
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		vistacargando("m","Espere por favor");
		$('#btn_guardar_zona').attr('disabled','disabled');
		$.ajax({
			url:'/gestionCoactiva/eventosDestinos/'+id, // Url que se envia para la solicitud
			method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
			dataType: 'json',
			success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
			{
				vistacargando("");
				if(requestData.estadoP=='error'){
					alertNotificar(requestData.mensaje,requestData.estadoP);
					return;
				}
				limpiar_campos_event_destinos();
				cargar_evento_destino("");
				alertNotificar(requestData.mensaje,requestData.estadoP);
					
			}, error:function (requestData) {
               
				vistacargando("");
				alertNotificar(requestData.mensaje,requestData.estadoP);
				limpiar_campos_event_destinos();
			}
		});
    }

	
}

function cargarCmbEvento(){
    $('#cmb_evento').html('');
	$('#cmb_evento').attr('disabled',true);
    $.get("/gestionCoactiva/cargarListadoEvento", function (data) {
       
        // $('#cmb_evento').html('');
        $('#cmb_evento').append(`<option class="option_dirigido"value=""></option>`);
        $('#cmb_evento').attr('disabled',false);
        $.each(data.resultado,function(i,item){
            $('#cmb_evento').append(`<option value="${item.id_registro_eventos}">${item.descripcion}</option>`);
        })
        $("#cmb_evento").trigger("chosen:updated"); // actualizamos el combo
    }).fail(function(error){
        alertNotificar("Error al ejecutar la petición","error");
    });
}

function cargarCmbDestino(){
    $('#cmb_destino').html('');
	$('#cmb_destino').attr('disabled',true);
    $.get("/gestionCoactiva/cargarListadoDestinatario", function (data) {
       
        $('#cmb_destino').append(`<option class="option_dirigido"value=""></option>`);
        $('#cmb_destino').attr('disabled',false);
        $.each(data.resultado,function(i,item){
            $('#cmb_destino').append(`<option value="${item.idregistro_destino}">${item.descripcion}</option>`);
        })
        $("#cmb_destino").trigger("chosen:updated"); // actualizamos el combo
    }).fail(function(error){
        alertNotificar("Error al ejecutar la petición","error");
    });
}


$('#evdest').click(function(){
    cargarCmbEvento();
    cargarCmbDestino();
    // $('#btn_cancelar_eventodes').click();

});

$('#dest').click(function(){
    $('#btn_cancelar_destino').click();
});

$('#event').click(function(){
    $('#btn_cancelar_evento').click();
});