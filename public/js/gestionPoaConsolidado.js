//evento del select de la lista de periodo
function selectPeriodo(gestion) {
    var url=window.location.protocol+'//'+window.location.host;
	if($('#selectDepartamento').val()!="" &&  $('#selectPeriodo').val()!="" ){

		vistacargando('M','Cargando..');
		if(gestion=='gestionProyectoPartida'){
			window.location=url+"/gestionProyectoPartidaPoa/getProyectoPartida/"+$('#selectPeriodo').val()+"/"+$('#selectDepartamento').val();
		}else if(gestion=='gestionConsolidadoPoa'){
			window.location=url+"/gestionProyectoPoa/bandejaPoaConsolidado/"+$('#selectPeriodo').val()+"/"+$('#selectDepartamento').val()+"/"+gestion;
		}else if(gestion=='gestionConsultaPoa'){
			window.location=url+"/gestionProyectoPoa/bandejaPoaConsolidado/"+$('#selectPeriodo').val()+"/"+$('#selectDepartamento').val()+"/"+gestion;}
	}else{
		vistacargando();
		console.log('falta un campo');
	}
	// vistacargando();
}
//actualizar campo consolidado de los proyectos POA
function consolidado(id, estado) {
	var opcion = confirm("¿Estas seguro que deseas ejecutar esta acción? ");
	  if (opcion) {
	  	// vistacargando('M','Actualizando');
	      $.get("/gestionProyectoPoa/updateProyectoConsolidado/"+id+"/"+estado, function (resultado) {
	           console.log(resultado);
	           if(resultado=='success'){
	           		if($('#selectDepartamento').val()!="" &&  $('#selectPeriodo').val()!="" ){
	           			 selectPeriodo('gestionConsolidadoPoa');
	           			}else{
	           				vistacargando('M','Cargando..');
	           				var url=window.location.protocol+'//'+window.location.host;
	           				window.location=url+"/gestionProyectoPoa/bandejaPoaConsolidado/";
	           			}

	           }else if(resultado=='danger'){
	           	  alert("No se pudo ejecutar la petición");
	           }
	      }).fail(function(error){
	              alert("Error al ejecutar la petición");
	              vistacargando();
	      });
	  }
}
//guardar seleccion de partidad
function selectEstadoFinanciero(idplan,este,partida) {
	var EstaF=$(este).val();
	var Conpartida= EstaF.substr(3,6);
	if(Conpartida!=partida){
		new PNotify({
		    title: 'Mensaje de Información',
		    text: `La partida con el clasificador presupuestario no coinciden`,
		    type: 'error',
		    hide: true,
		    delay: 3000,
		    styling: 'bootstrap3',
		    addclass: ''
		});
		return;
	}
	if(confirm('¿Estas seguro que quieres ejecutar la acción?')){
		// vistacargando('M','Guardando..');
		$.ajaxSetup({
		    headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
		var FrmData = {
		    partida: $(este).val(),
		    idplan_contratacion:idplan
		};
		$.ajax({
		    url:'/gestionProyectoPartidaPoa/enlaceFinanciero', // Url que se envia para la solicitud
		    method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		    data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		    dataType: 'json',
		    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		    {
		    	    new PNotify({
		    	        title: 'Mensaje de Información',
		    	        text: `${requestData.msm}`,
		    	        type: `${requestData.estado}`,
		    	        hide: true,
		    	        delay: 2000,
		    	        styling: 'bootstrap3',
		    	        addclass: ''
		    	    });
		    	   //activamos eliminar si se ingresa por primera vez la partida
		    	   $('.tdborrar'+requestData.idplan).html(`
						<i class="fa fa-trash-o red btn" onclick="borrarPartida('${requestData.idestadoFinanciero }','${requestData.idplan}')"></i>
		    	   	`);
		    }, error:function (requestData) {
		    	console.log(requestData);
		    	// vistacargando();
		    }
		});
	}
}
//funcion para editar el clasificador
function selectClasificadorPre(idPre,este,partida,desPartida,idplan) {

	if(confirm('¿Estas seguro que quieres ejecutar la acción?')){
		// vistacargando('M','Guardando..');
		$.ajaxSetup({
		    headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
		var FrmData = {
		    partida: $(este).val(),
		    descripcion_partida:desPartida,
		    idplan_contratacion:idplan
		};
		$.ajax({
		    url:'/gestionProyectoPartidaPoa/enlaceFinanciero/'+idPre, // Url que se envia para la solicitud
		    method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
		    data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		    dataType: 'json',
		    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		    {
		    	    new PNotify({
		    	        title: 'Mensaje de Información',
		    	        text: `${requestData.msm}`,
		    	        type: `${requestData.estado}`,
		    	        hide: true,
		    	        delay: 3000,
		    	        styling: 'bootstrap3',
		    	        addclass: ''
		    	    });
		    	    vistacargando('M','Cargando..');
		    	   var url=window.location.protocol+'//'+window.location.host;
		    	   	window.location=url+"/gestionProyectoPartidaPoa/enlaceFinanciero";

		    }, error:function (requestData) {
		    	console.log(requestData);
		    	// vistacargando();
		    }
		});
	}
}
//quitar partida en la tabal
function borrarPartida(idEF,a) {
	if(confirm('¿Estas seguro que quieres ejecutar la acción?')){
		vistacargando('M','Eliminando..');
		$.ajaxSetup({
		    headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
		$.ajax({
		    url:'/gestionProyectoPartidaPoa/enlaceFinanciero/'+idEF, // Url que se envia para la solicitud
		    method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
		    dataType: 'json',
		    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		    {
		    		vistacargando();
		    	    new PNotify({
		    	        title: 'Mensaje de Información',
		    	        text: `${requestData.msm}`,
		    	        type: `${requestData.estado}`,
		    	        hide: true,
		    	        delay: 2000,
		    	        styling: 'bootstrap3',
		    	        addclass: ''
		    	    });
		    	   //ocultamos campo eliminar
		    		$('.tdborrar'+a).html('<i class="fa fa-edit blue"></i>');
		    		$('.option_idestadoFinanciero'+a).prop('selected',false); // deseleccionamos las zonas seleccionadas
       				$("#idestadoFinanciero"+a).trigger("chosen:updated"); // actualizamos el combo
		    }, error:function (requestData) {
		    	 vistacargando();
		    }
		});
	}
}
//modal para agregar observaciones
function ejecutarAccion(id) {
	$('#modalObservacion').modal('show');
  	$('#idmodal').val(id);
}
$('#btnObC').click(function (e) {
  $('#modalObservacion').modal('hide');
});
$('#btnObG').click(function (e) {
  confirmarUpdateVisor($('#idmodal').val(),'C','CD',$('#txtobservacion').val());
});


//alerta de confirmacion del modulo de aprobacion POA
function confirmarUpdateVisor(idp,estado,estado_info,obs) {
  var opcion = confirm("¿Estas seguro que deseas ejecutar esta acción? ");
    if (opcion) {
    	vistacargando('M','Actualizando');
        $.get("/gestionProyectoPoa/updateProyecto/"+idp+'/'+estado+'/'+estado_info+'/'+obs, function (resultado) {
            // console.log(resultado);
             if(resultado=='success'){
                   // window.location="/gestionProyectoPoa/"+url;
                   location.reload();
             }else{
                 alert("Error al ejecutar la petición");
                 vistacargando();
             }
        }).fail(function(error){
                alert("Error al ejecutar la petición");
                vistacargando();
        });
    }else{
    	vistacargando();
    	 // location.reload();
    }
}

//evento del estado revisado
 $('.estado_r').on('ifChecked', function(event){
 	 var btn=`<a disabled class="btn btn-primary btn-block btn-flat"><i class="fa fa-folder"></i> Corregir </a>`;
 	 var id =$(this).val();
 	 updateEstadoPoa(id,'1',btn);
 	 $(this).parents('tr').find('td').eq(9).html(btn);
 });

//chekeck
 $('.estado_r').on('ifUnchecked', function(event){
 	var id =$(this).val();
 	var btn=` <a onclick=" ejecutarAccion('${id}')"  class="btn btn-primary btn-block btn-flat"><i class="fa fa-folder"></i> Corregir </a>`;
 	updateEstadoPoa(id,'0',btn);
 	$(this).parents('tr').find('td').eq(9).html(btn);
 });

 //funcion para actualizar el estado de revisado de un proyecto
 function updateEstadoPoa(idp,estado,btn) {
  	vistacargando('M','Actualizando');
      $.get("/gestionProyectoPoa/updateProyectoEstadoRevisado/"+idp+'/'+estado, function (resultado) {
      	console.log(resultado);
                 vistacargando();
                 new PNotify({
                     title: 'Mensaje de Información',
                     text: `${resultado.msm}`,
                     type: resultado.estado,
                     hide: true,
                     delay: 3000,
                     styling: 'bootstrap3',
                     addclass: ''
                 });

                 if(resultado.estado=='error'){
                 	 location.reload();
                 }
      }).fail(function(error){
              alert("Error al ejecutar la petición");
              vistacargando();
      });
 }