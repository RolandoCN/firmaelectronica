$('#frm_buscar').submit(function(){
	    event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaEmisiones').hide();
		$('#panelInformacion').hide();
		$('#infoBusqueda').hide();
	
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/solicitudCertificado/datosContribuyente',
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				if(data['error']==true){
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}
		                  </div>`);
		    		$('#infoBusqueda').show(200);
					alertNotificar(data['detalle'], "error");
					// return;
				}
				if(data['error']==false){

					if(data['detalle']['nombre']!=''){
						var razonsocial=data['detalle']['nombre'];
					}else{
						var razonsocial='--------';
					}
					if(data['detalle']['ciu']!=''){
						var ciu=data['detalle']['ciu'];
					}else{
						var ciu='--------';
					}
					if(data['detalle']['direccion']!=''){
						var direccion=data['detalle']['direccion'];
					}else{
						var direccion='--------';
					}
					
					if(data['detalleDeuda']['statusdeuda']==true){
						if(data['detalleDeuda']['detalleDeuda']['gad']['valor']!=null){
							var valorGad=`<div class="col-md-12">
								  		<label class="control-label col-md-4 col-sm-4 col-xs-12" style='color:black' >GADM Chone: 
				                        </label>
				                        <div class="col-md-1 col-sm-1 col-xs-12">
				                            <b>$${data['detalleDeuda']['detalleDeuda']['gad']['valor']}</b>
				                        </div>
				                        <div class="col-md-7 col-sm-7 col-xs-12">
				                            <a target="_blank" href="https://enlinea.chone.gob.ec/publico/pago">Realizar pago aquí </a>
				                        </div>
								  	</div>`;

						}else{
							var valorGad='';
						}

						if(data['detalleDeuda']['detalleDeuda']['h2o']['valor']!=null){
							var valorH2o=`<div class="col-md-12">
								  		<label class="control-label col-md-4 col-sm-4 col-xs-12" style='color:black' >Empresa pública Aguas del Chuno: 
				                        </label>
				                        <div class="col-md-1 col-sm-1 col-xs-12">
				                            <b>$${data['detalleDeuda']['detalleDeuda']['h2o']['valor']}</b>
				                        </div>
				                        <div class="col-md-7 col-sm-7 col-xs-12">
				                            <a target="_blank"  href="https://enlinea.chone.gob.ec/pago/aguaPublico">Realizar pago aquí </a>
				                        </div>
								  	</div>`;

						}else{
							var valorH2o='';
						}

	                    $('#bodyInformacionCont').html(`
							<div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Razon Social: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${razonsocial}</p>
		                            <input id="razonsocialInput" type="hidden" value="${razonsocial}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >CIU: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${ciu}</p>
		                            <input  type="hidden" value="${ciu}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Dirección: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${direccion}</p>
		                            <input  type="hidden" value="${direccion}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <div class="alert alert-danger col-md-9 col-sm-9 col-xs-12" role="alert">
								  <div class="row">
								  	<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12">
								  		<p><b>Tiene Deudas pendientes</b></p>
								  	</div>
								  	${valorGad}
								  	${valorH2o}
								  </div>
								</div>
		                    </div>
	                    `);
					}else{
						$('#bodyInformacionCont').html(`
							<div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Razon Social: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${razonsocial}</p>
		                            <input id="razonsocialInput" type="hidden" value="${razonsocial}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >CIU: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${ciu}</p>
		                            <input  type="hidden" value="${ciu}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Dirección: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${direccion}</p>
		                            <input  type="hidden" value="${direccion}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <div class="alert alert-success col-md-9 col-sm-9 col-xs-12" role="alert">
								  <div class="row">
								  	<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12">
								  		${data['detalleDeuda']['detalleDeuda']}
								  	</div>
								  </div>
								</div>
	                    	</div>
	                    	<div class="form-group">
		                        <div class="row" >
			                        <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12" align=center>
										<button  type="button" onclick="modalSolicitud('${$('#cedula').val()}')" class="btn btn-primary"><i class="fa fa-send"></i> Solicitar Certificado</button>
		                    		</div>
	                    		</div>
	                    `);
					}
					$('#panelInformacion').show(200);
					
				}
				$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				

				
		},
		error: function(e){
	        if (e.statusText==='timeout'){
	          $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			    //MOSTRAR INFORMACION DE BUSQUEDAS
			    $('#infoBusqueda').html('');
	    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Tiempo de espera agotado intente nuevamente.
	                  </div>`);
	    		$('#infoBusqueda').show(200);
	    		setTimeout(function() {
	  	 		$('#infoBusqueda').hide(200);
	  	 		},  3000);
				return;
	        }
	        else{
	           $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			    //MOSTRAR INFORMACION DE BUSQUEDAS
			    $('#infoBusqueda').html('');
	    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Ocurrió un error intente nuevamente.
	                  </div>`);
	    		$('#infoBusqueda').show(200);
	    		setTimeout(function() {
	  	 		$('#infoBusqueda').hide(200);
	  	 		},  3000);
				return;
	        }
	    }
	});
});

function emisionVigente(tipo,identificacion){
	$.get('especieVigente/'+tipo+'/'+tipo+'/'+identificacion, function (data) { 

        if(data['vigencia']!='Vigente'){
            $('#obsEspecie').html(`<b>${data['vigencia']}</b>`);
            $('#cargandoEspecie').html('<i style="font-size: 180%; color: red" class="fa fa-times-circle-o" aria-hidden="true"></i>');
        	$('#btnsolicitud').html(`<div class="row" ><div class="col-lg-12 col-sm-12 col-md-12 col-xs-12" align=center>
					 <button  id="btnSolicitudModal" type="button" onclick="confirmarSolicitud('P','${identificacion}')" class="btn btn-success  " ><i class="fa fa-money"> </i> Generar Orden de Pago </button></div></div>`); 
        }else{
            $('#obsEspecie').html(`<b>${data['vigencia']}</b>`);
            $('#cargandoEspecie').html('<i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i>');
			$('#btnsolicitud').html(`<div class="row" ><div class="col-lg-12 col-sm-12 col-md-12 col-xs-12" align=center>
					<button id="btnSolicitudModal"  type="button" onclick="confirmarSolicitud('V','${identificacion}')" class="btn btn-primary"><i class="fa fa-send"></i> Solicitar Certificado</button>`);
          
        }
           $('#btnsolicitud').show();
    });
}

function modalSolicitud(identificacion){
	$('#GenerandoCerti').show();
    $("#procesing").hide();
    $("#btnSolicitudModal").hide();
	cargando();
	emisionVigente('ND',identificacion);
	$('#modal_Estado_R_ND').modal();
	return;
}

function cargando(){
	$('#Cargando_EstadoCuenta').html(`<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>`);
	$('#Obs_EstadoCuenta').html(`<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>`);
	
	$('#Cargando_EstadoAP').html(`<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>`);
	$('#Obs_AP').html(`<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>`);

	$('#cargandoEspecie').html(`<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>`);
    $('#obsEspecie').html(`<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>`); 
    $('#BtnSolitarCerti').html(''); 
    $("#detalleOrdenPago").hide();
    $("#pendienteCerti").hide();
    $("#success").hide();

}



$('#cedulaRuc').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});

function solicitudCertificado(valor,identificacion){
	$('#GenerandoCerti').hide();
	$('#detalleOrdenPago').hide();
    $("#procesing").show();
    $("#btnSolicitudModal").remove();
    $('#detalleOrdenPago').hide();
    $('#ordenEmision').html('');

    if(valor=='P'){
    	var metodo="orden";
    }else{
    	var metodo='especie';
    }
    $.ajax({
		type: 'POST',
		url: '/solicitudCertificado/generarNodeudor',
		data: { _token: $('meta[name="csrf-token"]').attr('content'),
			   metodo:metodo,
			   identificacion:identificacion,
			   razonsocial:$('#razonsocialInput').val()},
		success: function (data) {
			console.log(data);


			if(data['error']==true){
           		$("#procesing").hide();
	            solicitudPendiente(`¡ATENCIÓN! <b>${data['detalle']}</b></a>.`);
	            $("#pendienteCerti").show();
	            $('#detalleOrdenPago').hide();
	            $('#detallePago').hide();
	            $("#btnSolicitudModal").remove();
	            return;
              
			}

			if(data['error']==false && data['status']=='success'){
				alertNotificar('Se generó el certificado correctamente','success');
           		$("#btnDescargarCerti").attr("href", 'buscarDocumento/'+data['codRastreo']);
           		$("#procesing").hide();
           		$("#success").show();
	            // solicitudPendiente(`¡ATENCIÓN! <b>${data['detalle']}</b></a>.`);
	            // $("#pendienteCerti").show();
	            // $('#detalleOrdenPago').hide();
	            // $('#detallePago').hide();
	            // $("#btnSolicitudModal").remove();
	            return;
              
			}
		  	if(data['pendienteOrden']==true){
	            $("#procesing").hide();
	            solicitudPendiente(`¡ATENCIÓN! Ud tiene una orden de pago pendiente con número de emisión  <b>${data['detalle']}</b></a>.`);
	            $("#pendienteCerti").show();
	            $('#detalleOrdenPago').hide();
	            $('#detallePago').hide();
	            $("#btnSolicitudModal").remove();
	            return;
          	}

          	if(data['tipo']=="orden"){
	            $("#procesing").hide();
	            $('#ordenEmision').html(`Se ha generado la orden con el número de emisión <b>${data['detalle']}</b> ,puede realizar el pago en las instituciones que se detallan <a href="https://enlinea.chone.gob.ec/pago/puntospago" target="_blank">aquí.</a>`)
	            $("#btndescargar").attr("href", 'ordenPDF/'+data['codEncrypt']+'/'+data['razonsocial']);
	            $('#detalleOrdenPago').show();
	            $('#detallePago').hide();
	            $("#btnSolicitudModal").remove();
	            // $('.modal').modal('hide');
	            return;
          	}
			
		},
		error: function (data) {
                $("#procesing").hide();
                solicitudPendiente(`¡ATENCIÓN! ha ocurrido un error inténtelo nuevamente.`);
                $("#pendienteCerti").show();
	            $('#detalleOrdenPago').hide();
	            $('#detallePago').hide();
	            $("#btnSolicitudModal").remove();
	            return;
		},
	});
}


function solicitudPendiente(texto){
    $('#pendienteCerti').html(`<div class="panel-heading">
      <div class="row">
            <p class="text-center">
              <span class="glyphicon glyphicon-info-sign fa-5x" aria-hidden="true"></span>
            </p>
            <p class="text-center">
              <strong>
              ${texto}
              </strong>
            </p>
      </div>
      `);
}

function  confirmarSolicitud(valor,identificacion){
	$('#btncerrar').prop('disabled',true);
	$('#btnXcerrar').prop('disabled',true);
	if(valor=='V'){
		var titulo='¿Está seguro que desea generar una solicitud de certificado.';
	}else{
		var titulo="¿Está seguro que desea generar una orden de pago? ";
		var mensaje=`Si ha generado y realizó el proceso de pago por favor esperar máximo dos mínutos para que los cambios se actualicen.`;
	}
    swal({
            title: titulo,
            text: mensaje,
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
            	solicitudCertificado(valor,identificacion);

            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
            $('#btncerrar').prop('disabled',false);
			$('#btnXcerrar').prop('disabled',false);

        });
    
}

