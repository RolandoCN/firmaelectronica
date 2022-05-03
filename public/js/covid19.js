
	$(".classCedula").keypress(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code==13){
			e.preventDefault();
			consultaCedula();
		}
	});

	$('#cedula').on('input', function() {
	   this.value = this.value.replace(/[^0-9]/g,'');
	});
	$('#celular').on('input', function() {
	   this.value = this.value.replace(/[^0-9]/g,'');
	});



	$('#frm_registro').submit(function(e){
		
		if($('#celular').val().length > 0 && $('#celular').val().length < 10 ){
			e.preventDefault();
			$('input[name="celular"]')[0].setCustomValidity("Ingrese el celular con 10 digitos");
			this.reportValidity();
		}else{
			$("#administradorRegistro").addClass("disableddiv");
			$("#btn_regisInfo").html('<span class="spinner-border " role="status" aria-hidden="true"></span> Registrando');
			$("#btn_regisInfo").prop('disabled', true);
		}
	});
	$('#celular').blur(function(e){
		$('input[name="celular"]')[0].setCustomValidity("");
	});


	function consultaCedula(){
		$('#botonesBuscar').html(`<div class=" col-sm-2 col-xs-12 "id="btnbuscar">
										<button disabled=true  type="button"  class="btn btn-primary btn-block"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>
									</div>
									<div class=" col-sm-1 col-xs-12 "id="btnbuscar">
										<button onclick="cancelaConsulta()" type="button"  id="btnBcedula" name="btnBcedula"  required="required" class="btn btn-block btn-danger col-md-2 col-xs-12"><i class="fa fa-times"></i>  </button>
									</div>`);  
		$.get('/covid19/dinardat/'+$('#cedula').val(), function (data) { 
			
			if(data['error']==false){
				$('#nombre').val(data['resultado'][9]['valor']);
				$('#nacionalidad').val('ECUATORIANA');
				$('#fechaNacimiento').val(convertDateFormat(data['resultado'][7]['valor']));
				bloqueardatosdinardat();
				$('#botonesBuscar').html(`<div class=" col-sm-2 col-xs-12 "id="btnbuscar">
										<button onclick="consultaCedula()" type="button"  id="btnBcedula" name="btnBcedula"  required="required" class="btn btn-block btn-info col-md-2 col-xs-12"><i class="fa fa-search"></i> Buscar</button>
									</div><div class=" col-sm-1 col-xs-12 "id="btnbuscar">
										<button onclick="cancelaConsulta()" type="button"  id="btnBcedula" name="btnBcedula"  required="required" class="btn btn-block btn-danger col-md-2 col-xs-12"><i class="fa fa-times"></i>  </button>
									</div>`);  
			}else{
				limpiardatosdinardat();
				//permitir registrar como extranjero
				$("#content_datos_extranjero").show(200);
				$('#cedula').val("");
			}
		}).fail(function(){
			cancelaConsulta();
		});

	}
	function cancelaConsulta(){
		$('#cedula').val('');
		limpiardatosdinardat();
	}
	function bloqueardatosdinardat(){

		$('#nombre').prop('readOnly',true);
		$('#nacionalidad').prop('readOnly',true);
		$('#fechaNacimiento').prop('readOnly',true);
	}

	function limpiardatosdinardat(){
		$('#nombre').prop('readOnly',false);
		$('#nacionalidad').prop('readOnly',false);
		$('#fechaNacimiento').prop('readOnly',false);
		$('#nombre').val('');
		$('#nacionalidad').val('');
		$('#fechaNacimiento').val('');
		$('#botonesBuscar').html(`<div class=" col-sm-2 col-xs-12 "id="btnbuscar">
										<button onclick="consultaCedula()" type="button"  id="btnBcedula" name="btnBcedula"  required="required" class="btn btn-block btn-info col-md-2 col-xs-12"><i class="fa fa-search"></i> Buscar</button>
									</div><div class=" col-sm-1 col-xs-12 "id="btnbuscar">
										<button onclick="cancelaConsulta()" type="button"  id="btnBcedula" name="btnBcedula"  required="required" class="btn btn-block btn-danger col-md-2 col-xs-12"><i class="fa fa-times"></i>  </button>
									</div>`);  
	}

	function convertDateFormat(string) {
	var info = string.split('/');
	return info[2] + '-' + info[1] + '-' + info[0];
	}

	$("#provincia").change(function() {

	cargarCantones('');

	});
	$("#selectsexo").change(function() {
		if($("#selectsexo").val()=='M'){
			$('#divembarazada').html('');
			$('#divsemanagesta').html('');
		}else if($("#selectsexo").val()=='F'){
			$('#divembarazada').html(`<div class="form-group " >
									<label class="control-label col-md-3 col-sm-3 col-xs-12" for="icon_gestione">Embarazada<span class="required">*</span>
									</label>
									<div class="col-md-6 col-sm-6 col-xs-12">
										<div class="chosen-select-conten">
											<select onchange="embarazada()" name="selecEmbarazada" id="selecEmbarazada" class="t form-control" tabindex="5">
											<option value="0">Seleccione..</option>
												<option value="Si">Si</option>
												<option value="No">No</option>
											</select>
										</div>
									</div>
								</div>
								
								`);
		}else{
			$('#divembarazada').html('');
				$('#divsemanagesta').html('');
		}

	});

	$("#selecPruebacovid").change(function() {
		if($("#selecPruebacovid").val()=='No'){
			$('#divfechaex').html('');
		}else if($("#selecPruebacovid").val()=='Si'){
			$('#divfechaex').html(`<div class="form-group ">
									<label class="control-label col-md-3 col-sm-3 col-xs-12" >Fecha Examen<span class="required">*</span>
									</label>
									<div class="col-md-6 col-sm-6 col-xs-12">
										<input type="date"  id="fechaExamen" name="fechaExamen"  required="required" class="form-control col-md-7 col-xs-12">
									</div>
								</div>`);
		}else{
			$('#divfechaex').html('');
		

		}

	});
	function embarazada() {
		if($("#selecEmbarazada").val()=='No'){
			$('#divsemanagesta').html('');
		}else if($("#selecEmbarazada").val()=='Si'){
			$('#divsemanagesta').html(` <div class="form-group" >
									<label class="control-label col-md-3 col-sm-3 col-xs-12" >Semanas Gestación<span class="required">*</span>
									</label>
									<div class="col-md-6 col-sm-6 col-xs-12">
										<input type="number"  id="semanaGesta" name="semanaGesta"  required="required" placeholder="Ejm. 6" class="form-control col-md-7 col-xs-12">
									</div>
								</div>`);
		}else{
			$('#divsemanagesta').html('');
		}

	}
	function cargarCantones()
	{
	// $('#ciudad').html('Cargando...');
	
	$.get('/covid19/getCantones/'+$('#provincia').val(), function (data) { //se consume el servicio para esto se agrego en el de los servicios un header 
		
		$('#canton').html('');
		
		if(data.status){
			data.datos.forEach(element => {
				
			if(element.detalleCanton=='CHONE' || element.detalleCanton=='Chone' || element.detalleCanton=='chone'){
				$('#canton').append(`<option selected="true" value="${element.idcanton}">${element.detalleCanton}</option>`);
			}else{
				$('#canton').append(`<option  value="${element.idcanton}">${element.detalleCanton}</option>`);
			}	
				$("#canton").prop("disabled",false); 
				$("#canton").trigger("chosen:updated"); 
			});
			cargarParroquias();
		}
	});
	}

	function cargarParroquias()
	{
		
	// $('#ciudad').html('Cargando...');
	
	$.get('/covid19/getParroquias/'+$('#canton').val(), function (data) { //se consume el servicio para esto se agrego en el de los servicios un header 
		
		$('#selectparroquiaP').html('');
		$("#selectparroquiaP").trigger("chosen:updated"); 
		if(data.status){
			$('#selectparroquiaP').append(`<option ></option>`);
			data.datos.forEach(element => {
				
				if(element.descripcion=='CHONE' || element.descripcion=='Chone' || element.descripcion=='chone'){
					$('#selectparroquiaP').append(`<option selected="true"  value="${element.idparroquia}">${element.descripcion}</option>`);
				
				}else{
					$('#selectparroquiaP').append(`<option value="${element.idparroquia}">${element.descripcion}</option>`);
				}
				$("#selectparroquiaP").prop("disabled",false); 
				$("#selectparroquiaP").trigger("chosen:updated"); 
			});
			cargarBarrios();
		}
	});
	}

	var barrioSelecionar = ""; // para saber que barrio dejar seleccionado despues de registrarlo

	function cargarBarrios(){

		$('#selectbarrio').html('');
		$("#selectbarrio").trigger("chosen:updated"); 

	$.get('/covid19/getBarrios/'+$('#selectparroquiaP').val(), function (data) { //se consume el servicio para esto se agrego en el de los servicios un header 
		
			if(data.status){
				$('#selectbarrio').append(`<option ></option>`);
					data.datos.forEach(element => {
					if(element.descripcion==barrioSelecionar){
						$('#selectbarrio').append(`<option selected="true"  value="${element.idbarrio}">${element.descripcion}</option>`);
					}else{
						$('#selectbarrio').append(`<option value="${element.idbarrio}">${element.descripcion}</option>`);
					}
					$("#selectbarrio").prop("disabled",false); 
					$("#selectbarrio").trigger("chosen:updated"); 
				});
			}
			barrioSelecionar="";
		});
	}


	function limpiar(){
		$('#panelResultado').hide();
		$('#ciudadano').html('');
		$('#nacionalidad').html('');
		$('#fecha_nacimiento').html('');
		$('#sexo').html('');
		$('#celular').html('');
		$('#residencia_idbarrio').html('');
		$('#direccion_exacta').html('');
		$('#embarazada').html('');
		$('#gestacion').html('');
		$('#fecha_inicio_sintomas').html('');
		$('#diagnostico_inicial').html('');
		$('#fecha_examen').html('');
		$('#botonRegistroPrueba').html('');
		$('#divbtnRegistro').hide();
	}


	$('#frmBuscar').submit(function(event){

			event.preventDefault();
			limpiar();
			$('#infoBusqueda').html('');
			$('#buscar').html(`<button disabled="true"  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
			
			$.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});

			$.ajax({
				type: "POST",
				url: '/covid19/consultasDatos',
				// data: e.serialize(),
				data: new FormData(this),
				contentType: false,
				cache: false,
				processData:false,
				success: function(data){
				
					if(data['error']==false && data['resultado']==null){
						$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
						$('#infoBusqueda').html('');
						$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
								</button>
								<strong>¡Atención!</strong> No existen registros.
							</div>`);
						$('#infoBusqueda').show(200);
						setTimeout(function() {
							$('#infoBusqueda').hide(200);
						},  5000);
						return;
					}
					if(data['error']==false){
						$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
						
						if(data['resultado']['sexo']=='MUJER'){
							$('#embarazada').html(data['resultado']['embarazada']);
							$('#divembarazada').show();
							if(data['resultado']['embarazada']=='SI'){
								$('#divgestacion').show();
								$('#gestacion').html(data['resultado']['semanas_gestacion']);
							}
						}
						$('#fechatencion').html(data['resultado']['fecha_atencion']);
						$('#ciudadano').html(data['resultado']['nombre_completo']);
						$('#nacionalidad').html(data['resultado']['nacionalidad']);
						$('#fecha_nacimiento').html(data['resultado']['fecha_nacimiento']);
						$('#sexo').html(data['resultado']['sexo']);
						$('#celular').html(data['resultado']['celular']); if($('#celular').html()==""){ $('#celular').html('No registrado'); }
						$('#residencia_idbarrio').html(`${data['resultado']['parroquiaciudadano']['canton']['provincia']['descripcion']} - ${data['resultado']['parroquiaciudadano']['canton']['detalleCanton']} - ${data['resultado']['parroquiaciudadano']['descripcion']}`);
						$('#direccion_exacta').html(data['resultado']['direccion_exacta']);
						$('#lugar_infeccion').html(data['resultado']['lugar_infeccion']);
						$('#fecha_inicio_sintomas').html(data['resultado']['fecha_inicio_sintomas']);
						$('#diagnostico_inicial').html(data['resultado']['diagnostico_inicial']);
						$('#fecha_examen').html(data['resultado']['fecha_examen']);
						if($('#tipo').val()=='PCOVID19'){						
							if(data['resultado']['estado']=='I'){  // solo esta registrado
								$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarPrueba(${data['resultado']['idprueba_covid19']}, 'R', this)" class="btn btn-warning btn-block "><i class="fa fa-check"></i> Confirmar Registro de Pueba Covid 19</button> <br>`);
								$("#registroprueba").html('No registrada');
							}else if(data['resultado']['estado']=='R'){  // prueba registrada
								$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarPrueba(${data['resultado']['idprueba_covid19']}, 'I', this)" class="btn btn-danger btn-block "><i class="fa fa-remove"></i> Eliminar Registro de Pueba Covid 19</button> <br>`);
								$("#registroprueba").html('<p  style="color: #009400; font-weight: 700;"> Registrada <i class="fa fa-check"></i></p>');
							}
						}else if($('#tipo').val()=='RCOVID19'){
							$("#resultado option:selected").prop("selected", false); // quitamos el resutado seleccionado
							if(data['resultado']['estado']=='R'){  // no esta registrado el resultado
								$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarResultado(${data['resultado']['idprueba_covid19']}, false, this)" class="btn btn-info btn-block "><i class="fa fa-check"></i> Guardar y Generar Ficha</button> <br>`);						
							}else if(data['resultado']['estado']=='F'){ // resultado registrado
								$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarResultado(${data['resultado']['idprueba_covid19']}, false, this)" class="btn btn-info btn-block "><i class="fa fa-check"></i> Actualizar y Generar Ficha</button> <br>`);
								$('#botonRegistroPrueba').append(`<button type="button" onclick="registrarResultado(${data['resultado']['idprueba_covid19']}, true, this)" class="btn btn-danger btn-block "><i class="fa fa-remove"></i> Eliminar Resultados</button> <br>`);													
								//seleccionamos el resultado registrado					
								var opcion_selecionada = $(`#resultado option[value='${data['resultado']['resultado']}']`);
								if(opcion_selecionada.length>0){
									$(opcion_selecionada).prop('selected', true);						
								}
							}
						}
						$('#panelResultado').show(200);
						$('#divbtnRegistro').show(200);
					}
					if(data['error']==true){
						$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
						$('#infoBusqueda').html('');
						$('#infoBusqueda').append(`<div style="background-color: #f8d7da; color: black" class="alert alert-dismissible fade in" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
								</button>
								<strong>¡Atención!</strong> ${data['detalle']}.
							</div>`);
						$('#infoBusqueda').show(200);
						setTimeout(function() {
						$('#infoBusqueda').hide(200);
						},  5000);
						return;
					}
				}, error: function(){
					$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
					$('#infoBusqueda').append(`<div  style="background-color: #f8d7da; color: black" class="alert alert-dismissible fade in" role="alert">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						</button>
						<strong>¡Atención!</strong> No se pudo completar la acción. Vuelva a intentarlo más tarde.
					</div>`);
					$('#infoBusqueda').show(200);
					setTimeout(function() {
						$('#infoBusqueda').hide(200);
					}, 5000);
					return;
				}
			});
	});

	function registrarPrueba(id, estado, btn){

		if(estado=="I"){
			opcion = confirm("¿Está seguro que quiere eliminar el registro de la prueba?");
			if(!opcion){ return; }
		}

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$('#infoBusqueda').html('');

		// control de timeoup en boton
			var texto_boton = $(btn).html();
			$(btn).html('<span class="spinner-border " role="status" aria-hidden="true"></span> Espere...');
			$(btn).prop('disabled', true);
		// --------------------------

		$.ajax({
			type: "PUT",
			url: '/covid19/registrarPrueba/'+id+'/'+estado,
			// data: e.serialize(),
			// data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){

				$('#infoBusqueda').append(`<div style="color: #fff;" class="alert alert-${data['status']} alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
					</button>
					<strong>¡Atención!</strong> ${data['detalle']}.
				</div>`);
				$('#infoBusqueda').show(200);
				
				if(data['error']==false){
					$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);				

					if(estado=='I'){  // se registró la prueba
						$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarPrueba(${id}, 'R', this)" class="btn btn-warning btn-block "><i class="fa fa-check"></i> Confirmar Registro de Pueba Covid 19</button> <br>`);
						$("#registroprueba").html('No registrada');
					}else if(estado=='R'){  // se eliminó la prueba
						$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarPrueba(${id}, 'I', this)" class="btn btn-danger btn-block "><i class="fa fa-remove"></i> Eliminar Registro de Pueba Covid 19</button> <br>`);
						$("#registroprueba").html('<p  style="color: #009400; font-weight: 700;"> Registrada <i class="fa fa-check"></i></p>');
					}
					return;
				}else{
					//ocurre un error controlado
					$(btn).html(texto_boton);
					$(btn).prop('disabled', false);
				}
				
			}, error: function(){
				//ocurre un error al realizar la petición
				$(btn).html(texto_boton);
				$(btn).prop('disabled', false);

				$('#infoBusqueda').append(`<div  style="background-color: #f8d7da;color: black" class="alert alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
					</button>
					<strong>¡Atención!</strong> No se pudo completar la acción. Vuelva a intentarlo más tarde.
				</div>`);
				$('#infoBusqueda').show(200);
				setTimeout(function() {
					$('#infoBusqueda').hide(200);
				}, 5000);
			}
		});
	}

	function registrarResultado(id, eliminar, btn){
		
		var resultado = $('#resultado').val();

		if(eliminar == true){
			opcion = confirm("¿Está seguro que quiere eliminar el resultado?");
			if(!opcion){ return; }
			resultado = "R";
		}

		$('#infoBusqueda').html('');

		// control de timeoup en botones
			var texto_boton = $(btn).html();
			$(btn).html('<span class="spinner-border " role="status" aria-hidden="true"></span> Espere...');
			$(btn).prop('disabled', true);
			var boton2 = $(btn).siblings('button');
			if(boton2.length>0){ $(boton2).prop('disabled', true); }
		// --------------------------

		$.ajax({
			type: "PUT",
			url: '/covid19/registrarResultado/'+id+'/'+resultado,
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){

				$('#infoBusqueda').append(`<div  style="color: #fff;" class="alert alert-${data['status']}  alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
					</button>
					<strong>¡Atención!</strong> ${data['detalle']}.
				</div>`);
				$('#infoBusqueda').show(200);

				if(data['error']==false){
					$('#buscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);					
					
					// limpiar();
					if(eliminar == false){
						window.location.href='/covid19/reporte/'+data['id'];
					}
					
					if(eliminar == true){  // se eliminó el resultado
						$("#resultado option:selected").prop("selected", false);
						$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarResultado(${id}, false, this)" class="btn btn-info btn-block "><i class="fa fa-check"></i> Guardar y Generar Ficha</button> <br>`);
					}else{ // se registro un resultado
						$('#botonRegistroPrueba').html(`<button type="button" onclick="registrarResultado(${id}, false, this)" class="btn btn-info btn-block "><i class="fa fa-check"></i> Actualizar y Generar Ficha</button> <br>`);
						$('#botonRegistroPrueba').append(`<button type="button" onclick="registrarResultado(${id}, true, this)" class="btn btn-danger btn-block "><i class="fa fa-remove"></i> Eliminar Resultados</button> <br>`);													
					}
					
					return;
				}else{
					//ocurre un error controlado
					$(btn).html(texto_boton);
					$(btn).prop('disabled', false);
					if(boton2.length>0){ $(boton2).prop('disabled', false); }
				}
				
			},
			error: function(){
				//ocurre un error al realizar la petición
				$(btn).html(texto_boton);
				$(btn).prop('disabled', false);
				if(boton2.length>0){ $(boton2).prop('disabled', false); }

				$('#infoBusqueda').append(`<div  style="background-color: #f8d7da;color: black" class="alert alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
					</button>
					<strong>¡Atención!</strong> No se pudo completar la acción. Vuelva a intentarlo más tarde.
				</div>`);
				$('#infoBusqueda').show(200);
				setTimeout(function() {
					$('#infoBusqueda').hide(200);
				}, 5000);
			}
		});
	}



// FUNCIONES PARA AGREGAR UN NUEVO BARRIO

	function modal_barrio(){

		if( $("#provincia").val()=="" || $("#canton").val()=="" || $("#selectparroquiaP").val()==""){
			alert("Seleccione la provincia el cantón y la parroquia");
			return;
		}

		var provincia = $("#provincia option:selected").html();
		var canton = $("#canton option:selected").html();
		var parroquia = $("#selectparroquiaP option:selected").html();

		$("#modal_registrar_barrio").modal("show");

		//cargamos la informacion seleccionada
		$("#span_provincia").html(provincia);
		$("#span_canton").html(canton);
		$("#span_parroquia").html(parroquia);
		$("#nuevo_barrio").val("");
		$("#modal_mensaje").html("");
		barrioSelecionar="";

	}


	$("#frm_registrarBarrio").submit(function(e){
		e.preventDefault();

		var idprovincia = $("#provincia").val();
		var idcanton = $("#canton").val();
		var idparroquia = $("#selectparroquiaP").val();

		if( idprovincia=="" || idcanton=="" || idparroquia==""){
			alert("Seleccione la provincia el cantón y la parroquia");
			return;
		}

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		var frmData = {
			idparroquia: idparroquia,
			nombre_barrio: $("#nuevo_barrio").val()
		}

		$.post("/covid19/registrarBarrio",frmData,
		function(data){
			
			if(data['error']==false){
				barrioSelecionar=frmData.nombre_barrio;
				cargarBarrios();
				$("#modal_registrar_barrio").modal("hide");
			}else{
				$("#modal_mensaje").html(`
					<div " class="alert alert-danger  alert-dismissible fade in" role="alert">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						</button>
						<strong>¡Atención!</strong> ${data['detalle']}
					</div>			
				`);
			}
	
		});
			
	});



	function cargarContenidoTablas(tabla) {
		$(`#${tabla}`).DataTable( {
			'order': [[1,'desc']],
			"language": {
				"lengthMenu": 'Mostrar <select class="form-control input-sm">'+
							'<option value="5">5</option>'+
							'<option value="10">10</option>'+
							'<option value="20">20</option>'+
							'<option value="30">30</option>'+
							'<option value="40">40</option>'+
							'<option value="-1">Todos</option>'+
							'</select> registros',
				"search": "Buscar:",
				"zeroRecords": "No se encontraron registros coincidentes",
				"infoEmpty": "No hay registros para mostrar",
				"infoFiltered": " - filtrado de MAX registros",
				"info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
				"paginate": {
					"previous": "Anterior",
					"next": "Siguiente"
			}
		}
		});
	}

