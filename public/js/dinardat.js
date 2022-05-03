	$('#cedula').on('input', function() {
	   this.value = this.value.replace(/[^0-9]/g,'');
	});

function limpiar(){
	$('#paneldetalle').hide();
	$('#ciudadano').html('');
	$('#cedulaR').html('');
	$('#nombreApellido').html('');
	$('#lnacimiento').html('');
	$('#fechanacimiento').html('');
	$('#estadoCivil').html('');
	$('#conyugue').html('');
	$('#profesion').html('');
	$('#fechaExpi').html('');
	$('#fechaDefuncion').html('');
	$('#fechaInscripcionDef').html('');
	$('#paneldefuncion').hide();


}
$('#frmBuscar').submit(function(e){

		e.preventDefault();

		$('#panelCiudadano').hide(200);
		$('#panelRuc').hide(200);
		$('#panelActividades').hide(200);
		$('#panelEstablecimientos').hide(200);
		$('#buscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/consultas/consultaDinardap',
			// data: e.serialize(),
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				
				if(data['error']==false){
					$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					if(data['empresa']==false){
						 $('#panelCiudadano').show(200);
						 cargando('bodyCiudadano');
						 datosciudadano(data['cedula']);
					}	
						$('#panelRuc').show(200);
						$('#panelActividades').show(200);
						$('#panelEstablecimientos').show(200);
						cargando('bodyRuc');
						cargando('bodyActividades');
						cargando('bodyEstablecimientos');
						datosruc(data['cedula'],data['estadoRuc']);
						actividades(data['cedula'],data['estadoRuc']);
						establecimientos(data['cedula'],data['estadoRuc']);		
					
				}
				if(data['error']==true){
					$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  3000);
					return;
				}

				$('#tableLista').show(200);
					
			},
	        error: function(e){
	            $('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> Ocurrió un error, revise la identificación e intente nuevamente.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  3000);
					return;
	        }
		});
});

function datosciudadano(cedula){
	$.get("/consultas/registroCivil/"+cedula,function(data){
		if(data['error']==true){
			$('#bodyCiudadano').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	            </button>
	            <strong>¡Atención!</strong> Error al obtener información.
	          </div>`);
			return;				    
		}
		if(data['error']==false){
				
				$('#bodyCiudadano').html(`<div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Ciudadano: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="ciudadano">---</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Cédula: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="cedulaR">---</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Nombres y apellidos: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="nombreApellido">--</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Lugar nacimiento: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="lnacimiento">---</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha nacimiento: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="fechanacimiento">----</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Estado civil: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="estadoCivil">----</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Conyugue: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="conyugue">----</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Profesión: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="profesion">---</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha expiración: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="fechaExpi">----</p>
                                    </div>
                                </div>
                                <div id="paneldefuncion" style="display: none">
                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha defunción: 
                                        </label>
                                        <div class="col-md-9 col-sm-9 col-xs-12">
                                            <p id="fechaDefuncion">-----</p>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha de inscripción de defunción: 
                                        </label>
                                        <div class="col-md-9 col-sm-9 col-xs-12">
                                            <p id="fechaInscripcionDef">------</p>
                                        </div>
                                    </div>
                                </div>`);
					if(data['detalle'][1]['valor']!=''){
						if(data['detalle'][1]['valor']=='FALLECIDO'){
							$('#ciudadano').html(`<span style="background-color:#dc3545" class="badge badge-danger">${data['detalle'][1]['valor']}</span>`);
						}else if(data['detalle'][1]['valor']=='CIUDADANO'){
							$('#ciudadano').html(`<span style="background-color:#28a745" class="badge badge-success">${data['detalle'][1]['valor']}</span>`);
						}else{
						    $('#ciudadano').html(data['detalle'][1]['valor']);
						}
					}else{
						$('#ciudadano').html('--------');
					}
					if(data['detalle'][0]['valor']!=''){
						$('#cedulaR').html(data['detalle'][0]['valor']);
					}else{
						$('#cedulaR').html('--------');
					}
					if(data['detalle'][9]['valor']!=''){
						$('#nombreApellido').html(data['detalle'][9]['valor']);
					}else{
						$('#nombreApellido').html('--------');
					}
					if(data['detalle'][9]['valor']!=''){
						$('#lnacimiento').html(data['detalle'][8]['valor']);
					}else{
						$('#lnacimiento').html('--------');
					}
					if(data['detalle'][7]['valor']!=''){
						$('#fechanacimiento').html(data['detalle'][7]['valor']);
					}else{
						$('#fechanacimiento').html('--------');
					}
					if(data['detalle'][3]['valor']!=''){
						$('#estadoCivil').html(data['detalle'][3]['valor']);
					}else{
						$('#estadoCivil').html('--------');
					}
					if(data['detalle'][2]['valor']!=''){
						$('#conyugue').html(data['detalle'][2]['valor']);
					}else{
						$('#conyugue').html('--------');
					}
					if(data['detalle'][10]['valor']!=''){
						$('#profesion').html(data['detalle'][10]['valor']);
					}else{
						$('#profesion').html('--------');
					}
					if(data['detalle'][5]['valor']!=''){
						$('#fechaExpi').html(data['detalle'][5]['valor']);
					}else{
						$('#fechaExpi').html('--------');
					}

					if(data['detalle'][1]['valor']=='FALLECIDO'){
						$('#fechaDefuncion').html(data['detalle'][4]['valor']);
						$('#fechaInscripcionDef').html(data['detalle'][6]['valor']);
						$('#paneldefuncion').show();
					}
					$('#bodyCiudadano').show(200);
				

		}

	});
}

function datosruc(cedula,status){
	if(status==false){
		$('#bodyRuc').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
            </button>
            <strong>¡Atención!</strong> El ciudadano/a no tiene RUC registrado.
          </div>`);
		return;				    
	}
	$.get("/consultas/ruc/"+cedula,function(data){
		if(data['error']==true){
			$('#bodyRuc').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	            </button>
	            <strong>¡Atención!</strong> Incovenientes al consultar información.
	          </div>`);
			return;				    
		}
		$('#bodyRuc').html(`<div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >RUC: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="numeroRuc">--------</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Razón social: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="razonsocial">--------</p>
                                    </div>
                                </div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-4 col-xs-12" >Representante legal: 
									</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<p id="representante_legal">--------</p>
									</div>
								</div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Estado: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="estadoRuc">--------</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Actividad económica principal: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="actividadP">--------</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Obligado a llevar contabilidad: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="oblCon">--------</p>
                                    </div>
                                </div>
                                 
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha actualización: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="fechaAtc">--------</p>
                                    </div>
                                </div>
                                 <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha suspensión: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="fechaSuspe">--------</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha reinicio actividades: 
                                    </label>
                                    <div class="col-md-9 col-sm-9 col-xs-12">
                                        <p id="fechaRestart">--------</p>
                                    </div>
                                </div>
                                `);

					if(data['razonSocial']['detalle'][0]['valor']!=''){
						    $('#numeroRuc').html(data['razonSocial']['detalle'][0]['valor']);
					}else{
						$('#numeroRuc').html('--------');
					}
					if(data['razonSocial']['detalle'][1]['valor']!=''){
						    $('#razonsocial').html(data['razonSocial']['detalle'][1]['valor']);
					}else{
						$('#razonsocial').html('--------');
					}
					if(data['ruc'][0]['valor']!=''){
						if(data['ruc'][0]['valor']=='ACTIVO'){
							var color='#28a745';
						}else{
							var color='#dc3545';
						}
						$('#estadoRuc').html(`<span style="background-color:${color}" class="badge badge-danger">${data['ruc'][0]['valor']}</span>`);
					}else{
						$('#estadoRuc').html('--------');
					}
					if(data['representante_legal']!=null){
						if(data['representante_legal'][2]['valor']=='' && data['representante_legal'][3]['valor']=='' ){
							$('#representante_legal').html('--------');
						}else{
							$('#representante_legal').html(`${data['representante_legal'][2]['valor']} | ${data['representante_legal'][3]['valor']}`);
						}
					}else{
						$('#representante_legal').html('--------');
					}
					if(data['actividadP']['detalle'][0]['valor']!=''){
						$('#actividadP').html(data['actividadP']['detalle'][0]['valor']);
					}else{
						$('#actividadP').html('--------');
					}

					if(data['ruc'][7]['valor']!=''){
						if(data['ruc'][7]['valor']=='S'){
							var oblcon='SI';
						}else{
							var oblcon='NO';
						}
						$('#oblCon').html(oblcon);
					}else{
						$('#oblCon').html('--------');
					}

					if(data['ruc'][3]['valor']!=''){
						$('#fechaAtc').html(data['ruc'][3]['valor']);
					}else{
						$('#fechaAtc').html('--------');
					}

					if(data['ruc'][6]['valor']!=''){
						$('#fechaSuspe').html(data['ruc'][6]['valor']);
					}else{
						$('#fechaCanc').html('--------');
					}

					if(data['ruc'][5]['valor']!=''){
						$('#fechaRestart').html(data['ruc'][5]['valor']);
					}else{
						$('#fechaRestart').html('--------');
					}
		

	});
	;
}

function actividades(cedula,status){
	if(status==false){
		$('#bodyActividades').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
            </button>
            <strong>¡Atención!</strong> El ciudadano/a no tiene RUC registrado.
          </div>`);
		return;				    
	}
	$.get("/consultas/actividades/"+cedula,function(data){
		$('#bodyActividades').html('');
		if(data['error']==true){
			$('#bodyActividades').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}.
		                  </div>`);
			return;
		}
		
		$.each(data['detalle'],function(i,item){
			if(item!=''){
				var actividad=item;
			}else{
				var actividad='------';
			}
			$('#bodyActividades').append(`<div class="form-group">
                                    <li>${actividad}</li>
                                </div>`)
		});
		

	});
	;
}

function establecimientos(cedula,status){
	if(status==false){
		$('#bodyEstablecimientos').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
            </button>
            <strong>¡Atención!</strong> El ciudadano/a no tiene RUC registrado.
          </div>`);
		return;				    
	}
	$.get("/consultas/establecimientos/"+cedula,function(data){
		if(data['error']==true){
			$('#bodyEstablecimientos').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}.
		                  </div>`);
			return;
		}
			
			$('#bodyEstablecimientos').html(`<div class="table-responsive"  >
                        <div class="row">
                            <div class="col-sm-12">
                                <table style="color: black"  id="idtable_pagos" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
                                    <thead>
                                        <tr role="row">
                                        <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 20%;"># Establecimiento</th>
                                        <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 20%;">Tipo Establecimiento</th>
                                        <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 5%;">Ubicación</th>
                                        <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 10%;">Inicio actividades</th>    
                                        <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 10%;">Reinicio actividades</th>    
                                        <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 10%;">Cierre actividades</th>    
                                        
                                        </tr>
                                    </thead>

                                    <tbody id="bodyestablecitable">
                  
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>`);
		$.each(data['detalle'],function(i,item){
			if(item[3]['valor']!=''){
						var numeroes=item[3]['valor'];
			}else{
				var numeroes='--------';
			}

			if(item[5]['valor']!=''){
						var tipo=item[5]['valor'];
			}else{
				var tipo='--------';
			}
			if(item[0]['valor']!=''){
						var calle=item[0]['valor'];
			}else{
				var calle="S/N";
			}
			if(item[1]['valor']!=''){
						var interseccion=item[1]['valor'];
			}else{
				var interseccion="S/N";
			}

			if(item[7]['valor']!=''){
						var inicioAc=item[7]['valor'];
			}else{
				var inicioAc="---------";
			}

			if(item[8]['valor']!=''){
						var reinicioAc=item[8]['valor'];
			}else{
				var reinicioAc="---------";
			}

			if(item[9]['valor']!=''){
						var cierreAc=item[9]['valor'];
			}else{
				var cierreAc="----------";
			}

			$('#bodyestablecitable').append(`<tr>
											<td>${numeroes}</td>
											<td>${tipo}</td>
											<td>Calle ${calle} Y ${interseccion}</td>
											<td>${inicioAc}</td>
											<td>${reinicioAc}</td>
											<td>${cierreAc}</td>
											</tr>`);
		});
		
	});
	;
}

function cargando(idpanel){
	$('#'+idpanel).html(`<div align="center" ><div   style="width: 10em;height:10em; color: #337ab7; border: 1.25em solid currentColor;
                                    border-top-color: currentcolor;
                                    border-top-style: solid;
                                    border-top-width: 1.25em;
                                    border-right-color: transparent;
                                    border-right-style: solid;
                                    border-right-width: 1.25em;
                                    border-bottom-color: currentcolor;
                                    border-bottom-style: solid;
                                    border-bottom-width: 1.25em;
                                    border-left-color: currentcolor;
                                    border-left-style: solid;
                                    border-left-width: 1.25em;
                                    border-image-source: initial;
                                    border-image-slice: initial;
                                    border-image-width: initial;
                                    border-image-outset: initial;
                                    border-image-repeat: initial;" 
                                     class="spinner-border m-5 spinerConsultas" role="status">
                                  <span style="border:5px solid" class="sr-only">Loading...</span>
                                </div></div>`);
}


