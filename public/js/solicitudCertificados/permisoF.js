$('#frm_buscar').submit(function(event){
	    event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#panelInformacion').hide();
		$('#infoBusqueda').hide();
		$('#panelEstablecimientos').hide();
		$('#panelEstablecimientosAtc').hide();

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/solicitudCertificado/datosContribuyentePF',
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
		                        <div class="alert alert-success col-md-6 col-sm-6 col-xs-12" role="alert">
								  <div class="row">
								  	<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12">
								  		${data['detalleDeuda']['detalleDeuda']}
								  	</div>
								  </div>
								</div>
	                    	</div>

	                    `);
	                    cargartableLocales(data['listaLocales'],$('#cedula').val());
						$('#panelEstablecimientosAtc').show(200);
						
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
	  	 		alertNotificar('Tiempo de espera agotado intente nuevamente', "error");
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
	  	 		alertNotificar('Ocurrió un error intente nuevamente', "error");
				return;
	        }
	    }
	});
});


function cargartableLocales(data,cedula){
	$('#tb_listaLocalesBody').html('');
	$("#TablaEstablecimientosAtc").DataTable().destroy();
    $('#TablaEstablecimientosAtc tbody').empty();

    if(data['detalle'].length==0){
		$('#tb_listaLocalesBody').html(`<tr><td colspan=4><div style="color:black; background-color:#faebcc" class="alert alert-dismissible " role="alert" >
                                        <strong>MENSAJE!</strong> <span id="mensaje_info_edit">El contribuyente no tiene locales registrados clic <a href="/establecimiento/registroActR/${cedula}">Aquí</a>.</span>
                                    </tr></td></div>`);
		$('#tb_listaLocalesBody').show(200);
		return;
	}
    $.each(data['detalle'], function(i, item){
    	

    	if(item['establecimiento']['nombre']==null){
    		var establecimiento=item['establecimiento']['tipoestablecimiento']['descripcion'];
    	}else{
    		var establecimiento=`${item['establecimiento']['tipoestablecimiento']['descripcion']} - ${item['establecimiento']['nombre']}`;
    	}
    	if(item['area']!=null){
    		var area=`${item['area']} metros cuadrados`;
    	}else{
    		var area=``;
    	}
    	if(item['area']!=null){
    		var aforo=item['aforo'];
    	}else{
    		var aforo=``;
    	}
    	if(item['nombreComercial']!=null){
    		var nombreComercial=item['nombreComercial'];
    	}else{
    		var nombreComercial=``;
    	}
    	
    	$('#tb_listaLocalesBody').append(`<tr role="row" class="odd">
	                        <td width="30%" colspan="1">
	                            <b>Propietario:</b> ${item['predio']['pro_nombres']}<br>
	                            <b>Clave:</b> ${item['predio']['fic_clave']}<br>
	                            <b>Dirección:</b> ${item['predio']['direccion']}<br>
	                            <span class="badge badge-warning">
	                            ${establecimiento}
	                            </span>
	                        </td>
	                        <td style="font-size: 12px" id="${item['idestablecimiento_responsable']}_Comercial">
	                            
	                            <b>Nombre comercial:</b> 
	                            ${nombreComercial}
	                            <br>
                                <b>Área: </b>${area} <br>
                                <b>Aforo:</b>${aforo}
	                        </td>
	                        <td id="${item['idestablecimiento_responsable']}_Actividad">
	                        	<div id="idactividad_${item['idestablecimiento_responsable']}"
	                        </td>
	                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                <center>
                                    <button type="button" class="btn btn-sm btn-success marginB0" onClick="modalSolicitud(${item['idestablecimiento_responsable']},'${item['cedula_arrendatario']}','${item['nombreComercial']}')">
                                            <i class="fa fa-send" >
                                                
                                            </i> Solicitar Certificado
                                        </button>
                                </center>
                            </td>
	                    </tr>  `);

    	
	    	$.each(item['establecimiento_actividades'], function(i, itemAct){
	    		
	    		if(itemAct['actividades']['Detalle']!=null){
	    			var detalle=itemAct['actividades']['Detalle'];
	    		}else{
	    			var detalle='';
	    		}
	    		if(itemAct['actividades']['condicionado']=='Si'){
	    			var condicionado=`&nbsp;<span style="background-color:#ffc107; color:black;font-size:10px" class="badge badge-warning"> Requiere Inspección   </span>`;
	    		}else{
	    			var condicionado='';
	    		}
	    		$(`#idactividad_${item['idestablecimiento_responsable']}`).append(`<p><span style="color: green" class="fa fa-asterisk"></span>  ${itemAct['actividades']['Descripcion']} ${condicionado}<br><b style="font-size:11px; padding-left:18px">${detalle}</b></p>`);
	    	});

    });
    cargar_estilos_tabla("TablaEstablecimientosAtc");
   

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





$('#cedula').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});

function modalSolicitud(establecimientoResponsable,identificacion,nombreComercial){
	validatorrequisito=0;
	$('#bodyPermisoF').html('');
	if(nombreComercial!='null'){
		$('#nombreLocal').html(`<b>${nombreComercial}</b>`);
	}else{
		$('#nombreLocal').html(``);
	}
	$('#detalleProcess').html('Cargando Información...');
	$('#detalleRequisitos').hide();
	$('#detalleOrdenPago').hide();
	$('#btnsolicitud').hide();
	$("#procesing").show();
	$('#GenerandoCerti').hide();
	$("#pendienteCerti").hide();
	requisitos(identificacion,establecimientoResponsable);
	$('#modal_Solicitud_PF').modal();
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
  var validatorrequisito=0;
function requisitos(identificacion,establecimientoResponsable){

	$.get('requisitosPF/'+establecimientoResponsable+'/'+identificacion, function (data) { 
			$('#idresponsable').val(establecimientoResponsable);
			$('#identificacion').val(identificacion);
            if(data['error']==true){
            	$("#procesing").hide();
                solicitudPendiente(`¡ATENCIÓN! <b>${data['detalle']}</b>`);
                $("#pendienteCerti").show();
                return;
            }

            if(data['pendientes']==true){
                $('#btnsolicitud').html('');
                $("#procesing").hide();
                solicitudPendiente(`¡ATENCIÓN! Ud tiene una solicitud, puede revisar el estado de su solicitud desde <a href="/solicitudCertificado/consultaR/${identificacion}">Aquí</a>.`);
                $("#pendienteCerti").show();
                return ;
            }

            $.each(data['detalle'],function(i,val){
		        	if(val['codCer']=='ND'){
	        				var observacion =`<td align="center" id="Cargando_EstadoAP"><i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i></td>
                                        <td align="center" id="Obs_EstadoCuentaAP"><i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i></td>`;
	        		}else{
		        		if(val['certivigente'] != null){
		        			var observacion=`<td align="center" id=""><i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i></td>
					  				<td align="center" id="">Tiene certificado vigente puede descargarlo  <a target="_blank" href="/validacion/certificado/${val['certivigente']['codRastreo']}"> aquí</a></td> `;
			        	}else{
			        		if(val['interno']=='No'){
			        			if(validatorrequisito>0){var disable='disable'}else{var disable=''}
			        			var observacion=`<td align="center" id="">Adjuntar Documento PDF</td>
					  				<td align="center" id="">
					  					<div class="row">
								  			<div class="col-md-2 col-sm-2 col-xs-12"></div>
								  			<div  class="col-md-8 col-sm-8 col-xs-12">
									            <div  class=" ${disable} input-prepend input-group sinmargenbutton">
									                <label   title="Agregar un documento" class="  control-label btn btn-primary btn-upload add-on input-group-addon" for="formato_${val['idrequisito']}">
									                    <input  onchange="selecccionDoc(this,${val['idrequisito']})" id="formato_${val['idrequisito']}" name="formato_${val['idrequisito']}" class=" sr-only file_selec_certificado" type="file" accept="application/pdf" >
									                    <span title="" class="docs-tooltip" data-toggle="tooltip" data-original-title="Agregar un documento">
									                    <span class="fa fa-upload"></span>
									                    </span>
									                </label> 
									               <input  style="height: 45px " id="nombreFormatoSeleccionado_${val['idrequisito']}" name="nombreFormatoSeleccionado_${val['idrequisito']}" class="form-control" type="text" placeholder="Seleccionar archivo">
									            </div>  
									        </div>
								  			<div class="col-md-2 col-sm-2 col-xs-12"></div>
									    </div>
									</td> `;
									if(val['obligado']=='Si'){
										validatorrequisito=validatorrequisito+1;	
									}
									

			        		}else if(val['interno']=='Si'){
			        			var observacion=`<td align="center" id=""><i style="font-size: 180%; color: red" class="fa fa-times-circle-o" aria-hidden="true"></i></td>  
													  		<td align="center" id="">No tiene un certificado vigente, puede solicitarlo <a href="/solicitudCertificado/${val['ruta']}R/${identificacion}">aquí</a></td> `;
			        			validatorrequisito=validatorrequisito+1;
			        		}
			        	}

		        	}
		        	$('#valR').val(validatorrequisito);
	        		if(val['obligado']=='Si'){
		        		var obligado=`<b style="color:red">*</b>`;
		        	}else if(val['obligado']=='No'){
		        		var obligado='';
		        	}


	        		$('#bodyPermisoF').append(`<tr style="color:black">
					        <td><center>${val['requisito']} ${obligado}</center></td>
					        ${observacion};
					</tr>`);
		        });

		        if(data['totalPagar']!=0){
		        	var estadoInspeccion='<td align="center" id=""><i style="font-size: 180%; color: red" class="fa fa-times-circle-o" aria-hidden="true"></i></td>';
		        	var valorPagar=`<td style="font-weight:bold; font-size:19px"><center> <b style="color:red">$${data['totalPagar']}</b></center></td>`;
		        }else{
		        	var estadoInspeccion='<td align="center" ><i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i></td>';
		        	var valorPagar='<td align="center" ><i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i></td>';
		        }
	        	$('#bodyPermisoF').append(`<tr style="color:black">
				        <td><center>Pago por concepto de inspección <b style="color:red">*</b></center></td>
				      	${estadoInspeccion}
				        ${valorPagar}

				</tr>`);
				$('#btnsolicitud').html(`<div class="row" ><div class="col-lg-12 col-sm-12 col-md-12 col-xs-12" align=center>
					 <button  id="btnSolicitudModal" type="button" onClick="confirmarSolicitud()"  class="btn btn-success  " ><i class="fa fa-money"> </i> Generar Orden de Pago </button></div></div>`); 
                $('#btnsolicitud').show();
	   			$('#nota').html(`<div class="col-md-12 col-sm-12 col-xs-12">
                              Todos los campos marcados con ( <b style="color:red">*</b> ) son obligatorios y deben ser llenados para que su solicitud pueda ser atendida
                            </div>`);
            $("#procesing").hide();
            $("#detalleRequisitos").show();
        });
}

$('#frmsolicitar').submit(function(e){
	e.preventDefault();

	$('#GenerandoCerti').hide();
	$('#detalleProcess').html('Procesando solicitud...');
    $("#procesing").show();
    $("#btnSolicitudModal").remove();
    $('#detalleOrdenPago').hide();
    $('#ordenEmision').html('');
    $('#detalleRequisitos').hide();
  	
    $.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});

    
    $.ajax({
		type: 'POST',
		url: '/solicitudCertificado/generarPF',
		data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
		// data: { _token: $('meta[name="csrf-token"]').attr('content'),
		// 	   metodo:'Orden',
		// 	   identificacion:identificacion,
		// 	   razonsocial:$('#razonsocialInput').val(),
		// 	   idEstResponsable:establecimientoResponsable},
		success: function (data) {
			if(data['cumple']==false){
				alertNotificar(data['detalle'],'warning');
           		$("#procesing").hide();
	            solicitudPendiente(`¡ATENCIÓN! <b>${data['detalle']}</b></a>.`);
	            $("#pendienteCerti").show();
	            $('#detalleOrdenPago').hide();
	            $('#detallePago').hide();
	            $("#btnSolicitudModal").remove();
	            return;
			}
			if(data['error']==true){
				alertNotificar(data['detalle'],'error');
           		$("#procesing").hide();
	            solicitudPendiente(`¡ATENCIÓN! <b>${data['detalle']}</b></a>.`);
	            $("#pendienteCerti").show();
	            $('#detalleOrdenPago').hide();
	            $('#detallePago').hide();
	            $("#btnSolicitudModal").remove();
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
});


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

function  confirmarSolicitud(){

	if(validatorrequisito>0){
        $('#inforRequisitos').html('');
                $('#inforRequisitos').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong> No cumple con todos los requisitos.
                    </div>`);
                
                $('#inforRequisitos').show(200);
                setTimeout(function() {
                $('#inforRequisitos').hide(200);
                },  5000);
        return;
    }
    $('#btncerrar').prop('disabled',true);
	$('#btnXcerrar').prop('disabled',true);

        swal({
            title: "¿Está seguro que desea generar una orden de pago? ",
            text: "Una vez cancelada la orden de pago, en máximo dos minutos se enviará el detalle de la inspección al correo electrónico registrado, o puede revisar en el menú certificados opción consultar. ",
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
            	$('#frmsolicitar').submit()
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
            $('#btncerrar').prop('disabled',false);
			$('#btnXcerrar').prop('disabled',false);

        });
    
}

//es para pasar el nombre del archivo seleccionado en el input del formato del requisito
function selecccionDoc(input,id){
	archivo="Seleccione un archivo";
	
	if(input.files.length>0){ // si se selecciona un archivo
		var tamanioDoc=(input.files[0].size/1024)/1024;
		var tipoDoc=input.files[0].type;
	  	if(tipoDoc!="application/pdf"){
	  		alertNotificar('Sólo se permite subir documento en Formato PDF.','warning');
	  		$('#nombreFormatoSeleccionado_'+id).val('');
			return;
		}
		if(tamanioDoc>$('#tamDoc').val()){
	  		alertNotificar(`El documento no debe exceder de <b style="color:red">${$('#tamDoc').val()}MB</b>`,'warning');
	  		$('#nombreFormatoSeleccionado_'+id).val('');
			return;
		}
		archivo=(input.files[0].name);
		$('#nombreFormatoSeleccionado_'+id).val(archivo);
		validatorrequisito=validatorrequisito-1;
	}else{
		$('#nombreFormatoSeleccionado_'+id).val('');
		$(`#formato_${id}`).val('');
		return;
	}
}






 






