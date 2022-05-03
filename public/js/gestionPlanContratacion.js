//evento que se ejecuta al recargar la pagina
$(document).ready(function(){ completar(); })
	function completar() {
		if($('#idcompletar').val()!=""){
			modalProyecto($('#idcompletar').val());
		}
	}
//Gestion plan de contratacion
	//abrir modal Completar
	function modalProyecto(idp) {
		mostrar_proyecto_fechas(idp);
		cargarMeta(idp);
		$('#idproyectopoa').val(idp);
		$('#idproyectopoa_id').val(idp);
		$('#recurso_municipal').addClass('recurso_seleccionada');
		$('#recurso_municipal').iCheck('check');
		$('#recurso_externo2').iCheck('check');
		$('#modalProyectoPoa').modal('show');
		cargartablaPlan(idp);
		cargarMetasevaluacion(idp);
		cargartablaMedio(idp);
		cargartablaDestinoPresupuesto(idp);
		cargacombometa(idp);
		limpiarCampos();
		limpiarCamposMedioV();
		limpiarCamposPlan();

		$('#conten_add_documento').html('');

	}

	function mostrar_proyecto_fechas(idp){
		$('#porcentaje_trimestral').html('');
	     $.get("/gestionProyectoPoa/proyecto_view/"+idp, function (resultado) {
			$('#id_evaluacion_poa').html(`<option  value=""></option>`);
			$.each(resultado['evaluacion_poa'],function(i,item){
				$('#porcentaje_trimestral').append(`
					<div class="col-md-2 col-sm-2 col-xs-12">
						<input type="text" maxlength="3" id="trimestre${item['numero']}"  placeholder="Trimestre ${item['numero']}" required="required" onchange="" class="form-control col-md-7 col-xs-12">
					</div>
				`);
				$(`#trimestre${item['numero']}`).on('input', function() {
					this.value = this.value.replace(/[^0-9]/g,'');
				 });			
			});
			
			// $.each(resultado['evaluacion_poa'],function(i,item){
			// 	$('#id_evaluacion_poa').append(`<option class="option_evaluacion" value="${item['idevaluacion_poa']}">Trimestre ${item['numero']}</option>`);
			// 	$("#id_evaluacion_poa").prop("disabled",false); 
			// 	$("#id_evaluacion_poa").trigger("chosen:updated"); 
			// })


	     	//validamos si requiere ingrezar planificacion
	     	$('#home-tabctr').addClass('active');

	     	$('#contact-tabctr').removeClass('active');
	     	$('#verificacion-tabctr').removeClass('active');
	     	$('#profile-tabctr').removeClass('active');
	     	$('#profile-tabctr').removeClass('active');
	     	$('.ctr_destino_quitar').removeClass('active');


	     	$('#home').addClass('active in');
	     	$('#profile').removeClass('active in');
	     	$('#contact').removeClass('active in');
	     	$('#destino').removeClass('active in');
	     	$('#verificacion').removeClass('active in');
	     	
	     	
	     	if(resultado.resultado_view[0].tiene_contratacion=='1'){
	     		//requiere contratacion
	     		$('#profile-tab').removeClass('hide');
	     		$('#destino-tab').removeClass('hide');
	     		$('#profile-tab').html(` <span class="fa fa-suitcase"></span> Plan de contratación`);
	     		$('.crt_recursoExterno').removeClass('hide');
	     		$('.txtLavelTipoPlan').html(`Seleccione tipo de compra`);
	     		$('.crtRI').removeClass('hide');
	   		   
	     	}else if(resultado.resultado_view[0].tiene_contratacion=='2'){
	     		//otros gastos
	     		$('#profile-tab').removeClass('hide');
	     		$('#profile-tab').html(` <span class="fa fa-suitcase"></span> Otros gastos`);
	     		$('#destino-tab').addClass('hide');
	     		$('.txtLavelTipoPlan').html(`Tipo de gasto`);
	     		$('.crt_recursoExterno').addClass('hide');
	     		$('.crtRI').addClass('hide');
	     		

	     	}else{
	     		//no requiere contratacion
	     		$('#profile-tab').addClass('hide');
	     		$('#destino-tab').addClass('hide');
	     		$('#profile-tab').html(` <span class="fa fa-suitcase"></span>Plan de contratación`);
	     		$('.txtLavelTipoPlan').html(`Seleccione tipo de plan`);
	     		$('.crtRI').removeClass('hide');
	     	}

	     	$('#ffinP').val(resultado.resultado_view[0].fecha_fin);
	        $('#name_proyect').html(`
	        		<h5class="title" style="text-transform: uppercase;">
						<a><i class="fa fa-folder-o"></i> ${resultado.resultado_view[0].nombre}</a>
	        		</h5>
	        		<div class="byline" style="margin-left:20px;">
	        			<span>   <i class="fa fa-calendar-o"></i>   ${resultado.resultado_view[0].fecha_inicio}</span> - <a>${resultado.resultado_view[0].fecha_fin}</a>
	        		</div>
	       	`);
	     });
	}

	//eventos para capturar volores
	//evento cancelar
	$('#btn_plan_cancelar').click(function (event) {
		// $('#method_plan').val('POST');
		$('#btn_plan_cancelar').addClass('hidden');
		$('.btn_plan').removeClass('hidden');
		$('#actividad').attr('onchange','');
		$('#idtipo_contratacion').attr('onchange','');

		idpresupuesto=0;
		limpiarCamposPlan();
	});
	//valor_municipal valor_externo
	$('#valor_municipal').keyup(function (event) {
		sumarRecursos();
	});
	$('#valor_externo').keyup(function (event) {
		sumarRecursos();
	});
	//funcion para sumar los recursos
	var suma= parseInt(0); var num1=0; var num2=0;
	function sumarRecursos() {
		 num1= parseFloat($('#valor_municipal').val());
		 num2= parseFloat($('#valor_externo').val());
		suma=num1+num2;
		$('#recurso_solicitado').val(suma);

	}
  //chekear y deschekera recurso municipal
  //
   $('#recurso_municipal2').on('ifChecked', function(event){
    	 document.getElementById("valor_municipal").disabled = true;
   });
  $('.recurso_municipal').on('ifChecked', function(event){
     	$(this).addClass('recurso_seleccionada');
    	 activarInput();
  });
   $('.recurso_municipal').on('ifUnchecked', function(event){
     $(this).removeClass();
      document.getElementById("valor_municipal").disabled = false;
     	activarInput();
  });

   //chekear y deschekera recurso Externo
  $('.recurso_externo').on('ifChecked', function(event){
     $(this).addClass('recurso_seleccionada_externo');
     activarInput();
  });
   $('.recurso_externo').on('ifUnchecked', function(event){
     $(this).removeClass();
     activarInput();
  });


   //activar input de los valores
   function activarInput() {
	   	if($('.recurso_seleccionada').val()==1){
	   		//habilitamos input internos
	   		$('#valorMunicipal').removeClass('hide');
	   	}else{
	   		//desabilitamos input internos
	   		$('#valorMunicipal').addClass('hide');
	   		//borramos datos ingresado en el input
	   		$('#recurso_solicitado').val($('#valor_externo').val());
   		     $('#valor_municipal').val("0");
	   	}
	   	if($('.recurso_seleccionada_externo').val()==1){
	   		//habilitamos input externo
	   		$('#valorMunicipalExterno').removeClass('hide');
	   		$('#selectInstitucion').removeClass('hide');
	   		$('#selectModalidad').removeClass('hide');
	   	}else{
	   		//desabilitamos input externo
	   		$('#valorMunicipalExterno').addClass('hide');
	   		$('#selectInstitucion').addClass('hide');
	   		$('#selectModalidad').addClass('hide');
	   		//borramos datos ingresado
	   		 $('.option_idinstitucion').prop('selected',false);
   		     $("#idinstitucion").trigger("chosen:updated");
   		     $('#modalidad_externa').val("");
   		     $('#recurso_solicitado').val($('#valor_municipal').val());
   		     $('#valor_externo').val("0");
	   	}

   }
  //ENVIAR PLAN CONTRATACION
	$("#frm_plan").on("submit", function(e){
		e.preventDefault();
		if($('#method_plan').val()=='POST'){
			guardarPlanContratacion();
		}
	});
	//buscar planContratacion
	var crtPartida=0;
	function buscarPlanContratador(id){
	
		vistacargando('m','Cargando...');
		var idenvalucion=[];
		$.get("/gestionPlanContratacionPoa/planContratacion/"+id+'/edit', function (data) {
				if(data['resultado']['poacontratacion'].length>0){
					$('#porcentaje_trimestral').html('');
					$.each(data.resultado.poacontratacion, function (k, contratacion) {
						console.log(contratacion);
						$('#porcentaje_trimestral').append(`
							<div class="col-md-2 col-sm-2 col-xs-12">
								<input value="${contratacion['porcentaje']}" onchange="actualizar_porcentaje('${contratacion['idpoa_contratacaion_evaluacion']}','trimestre${contratacion['evaluacionpoa']['numero']}','${contratacion['idplan_contratacion']}')" type="text" id="trimestre${contratacion['evaluacionpoa']['numero']}"  placeholder="Trimestre ${contratacion['evaluacionpoa']['numero']}" required="required" onchange="" class="form-control col-md-7 col-xs-12">
							</div>
						`);
						$(`#trimestre${contratacion['evaluacionpoa']['numero']}`).on('input', function() {
							this.value = this.value.replace(/[^0-9]/g,'');
						 });	
					});
								
					// $('#btn_guardar_trimestres').html(`<button class="btn btn-sm btn-primary" onclick="guardar_porcentajes_trimestral('${data['resultado']['idplan_contratacion_encrypt']}',${idenvalucion})" ><i class="fa fa-save"></i></button>`)
				}
				// else{
				// 	alertNotificar('Este proyecto no tiene porcentaje trimestral porque no es del periodo actual, por favor comunicarse con administradores de sistema','error');
				// 	vistacargando();
				// 	return;
				// }
				 crtPartida=1;
				 plan=[];
				 $('#addpartidaPanel').addClass('hidden');
				 $('#btn_plan_cancelar').removeClass('hidden')
				 $('.btn_plan').addClass('hidden');
				 $('#actividad').attr('onchange','actualizarPlanContratacion()');
				 $('#idtipo_contratacion').attr('onchange','actualizarPlanContratacion()');
				 $('#listaPartidas').html('');
				 $('#idplanContrat').val(id);
				 $('#actividad').val(data.resultado.actividad);
				 $('.option_idtipoPlan').prop('selected',false);
				 $(`#idtipo_contratacion option[value="${data.resultado.idtipo_contratacion}"]`).prop('selected',true);
			     $("#idtipo_contratacion").trigger("chosen:updated");
				
				

				 $.each(data.resultado.presupuesto, function (j, presup) {
				  	$('#listaPartidas').append(`
										<div class="col-md-12 col-sm-12 col-xs-12 form-group has-feedback div_p">
						                    <li><a ><i class="fa fa-clipboard"></i> ${presup.partida}: ${presup.descripcion_partida}</a>
							                    <a class="close-link navbar-right right red " onclick="eliminarPartidaSelectDB('${presup.idpoa_presupuesto_encrypt}',this);"><i class="fa fa-trash fa-danger right"></i></a>
							               		<a class="close-link navbar-right right blue" onclick="actualizarPartidaSelect('${presup.idpoa_presupuesto_encrypt}',this);"><i class="fa fa-edit fa-primary"></i></a>
						               		</li>
						                </div>
				  	`);
				  	$('#addpartidas').html(` <span class="fa fa-save"></span> Guardar información`);
				  });
				  vistacargando();
		}).fail(function(error){
            alert("Error al ejecutar la petición");
        });
	}

	function actualizar_porcentaje(id,trimestre,idplan) {
		var valor=$('#'+trimestre).val();
		var sumaporcentaje=parseFloat($('#trimestre1').val())+parseFloat($('#trimestre2').val())+parseFloat($('#trimestre3').val())+parseFloat($('#trimestre4').val());
		if(sumaporcentaje>100){
			alertNotificar('Por favor ingrese correctamente el porcentaje trimestral','error');
			return;
		}
		$.get("/gestionProyectoPoa/actualizar_porcentaje/"+id+'/'+valor+'/'+idplan, function (data) {
			console.log(data);
			if(data['error']==true){
				alertNotificar(data['detalle'],'error');
				return;
			}
			alertNotificar(data['detalle'],'success');
		});
	}

	//eliminar Plan Contratacion
	function eliminarPlan(id) {
		if(confirm('¿Quiere eliminar el registro?')){
			$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
			});
			$.ajax({
			    url:'/gestionPlanContratacionPoa/planContratacion/'+id, // Url que se envia para la solicitud
			    method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
			    dataType: 'json',
			    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
			    {

			    	$('#msmPlan').html(`
							<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
							<div class="col-md-8 col-sm-6 col-xs-12">
							    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
							        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
							        </button>
							        <strong>Información: </strong> ${requestData.mensaje}
							    </div>
							</div>
			    		`);
			    	obtenerListProyectoPoa();
			    	cargartablaPlan($('#idproyectopoa').val());
			    }, error:function (requestData) {
			    	console.log('Error no se puedo completar la acción');
			    }
			});
    	}
	}
	//Guardar plan de contratacion
	function guardarPlanContratacion() {
		var sumatrimestre=parseFloat($('#trimestre1').val())+parseFloat($('#trimestre2').val())+parseFloat($('#trimestre3').val())+parseFloat($('#trimestre4').val());
		$('#msmPlan').html('');
		if(sumatrimestre!=100){
			$('#msmPlan').html(`
				<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
				<div class="col-md-8 col-sm-6 col-xs-12">
					<div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						</button>
						<strong>Información: </strong> Por favor distribuya correctamente el porcentaje trimestral
					</div>
				</div>
			`);
			return;
		}
		vistacargando('m','Por favor espere...');
		$.ajaxSetup({
		    headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
		var FrmData = {
		    idproyecto: $('#idproyectopoa').val(),
		    actividad: $('#actividad').val(),
		    idtipo_contratacion: $('#idtipo_contratacion').val(),
		    trimestre1: $('#trimestre1').val(),
		    trimestre2: $('#trimestre2').val(),
		    trimestre3: $('#trimestre3').val(),
		    trimestre4: $('#trimestre4').val(),
			idperiodo:	$('#idperiodo_trimestral').val(),
		    array:plan
		};
		// console.log(FrmData); return;
		$.ajax({
		    url:'/gestionPlanContratacionPoa/planContratacion', // Url que se envia para la solicitud
		    method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		    data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		    dataType: 'json',
		    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		    {
				if(requestData['estadoP']=='danger'){
					$('#msmPlan').html(`
						<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
						<div class="col-md-8 col-sm-6 col-xs-12">
						    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
						        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						        </button>
						        <strong>Información: </strong> ${requestData.mensaje}
						    </div>
						</div>
		    		`);
					vistacargando();
					return;
				}
		    	 obtenerListProyectoPoa();
		    	$('#msmPlan').html(`
						<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
						<div class="col-md-8 col-sm-6 col-xs-12">
						    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
						        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						        </button>
						        <strong>Información: </strong> ${requestData.mensaje}
						    </div>
						</div>
		    		`);
		    	limpiarCamposPlan();
		    	control=1;
		    	cargartablaPlan($('#idproyectopoa').val());
		    	plan=[];
		    }, error:function (requestData) {
		    	console.log(requestData);
		    }
		    });

	}
	//actualizar plar de contratacion
	function actualizarPlanContratacion() {
		$.ajaxSetup({
		    headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
		var FrmData = {
		    idproyecto: $('#idproyectopoa').val(),
		    actividad: $('#actividad').val(),
		    idtipo_contratacion: $('#idtipo_contratacion').val(),
		};
		$.ajax({
		    url:'/gestionPlanContratacionPoa/planContratacion/'+$('#idplanContrat').val(), // Url que se envia para la solicitud
		    method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
		    data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		    dataType: 'json',
		    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		    {

		    	$('#msmPlan').html(`
						<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
						<div class="col-md-8 col-sm-6 col-xs-12">
						    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
						        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						        </button>
						        <strong>Información: </strong> ${requestData.mensaje}
						    </div>
						</div>
		    		`);

		    	cargartablaPlan($('#idproyectopoa').val());
		    	plan=[];
		    }, error:function (requestData) {
		    	console.log(requestData);
		    }
		    });
	}
	//funcion para limpiar campos del for plan
	function limpiarCamposPlan() {
		crtPartida=0;
		$('#addpartidas').html(` <span class="fa fa-save"></span> Guardar información financiera`);
		$('.btn_plan').removeClass('hidden');
		$('#addpartidaPanel').addClass("hidden");
		$('#listaPartidas').html("");
		$('#actividad').val("");
		$('.option_idtipoPlan').prop('selected',false);
		$("#idtipo_contratacion").trigger("chosen:updated");
		$('.option_partida').prop('selected',false); // deseleccionamos las zonas seleccionadas
	    $("#partida").trigger("chosen:updated"); // actualizamos el combo
		$('#valor_municipal').val("0")
		$('#valor_externo').val("0")
		$('.option_idinstitucion').prop('selected',false);
		$("#idinstitucion").trigger("chosen:updated");
		$('#modalidad_externa').val("");
		$('#recurso_solicitado').val("");
		//interno
		$('.recurso_municipal').removeClass("recurso_seleccionada");
		$('#valorMunicipal').removeClass('hide');
		$('#recurso_municipal').iCheck('check');
		$('#recurso_municipal').addClass('recurso_seleccionada');
		//externo
		$('.recurso_externo').removeClass("recurso_seleccionada_externo");
		$('#valorMunicipalExterno').addClass('hide');
		$('#selectInstitucion').addClass('hide');
		$('#selectModalidad').addClass('hide');
		$('#recurso_externo2').iCheck('check');
		// $('#btn_plan_cancelar').addClass("hidden");

	}
//obtener data para llenara lista de plan de contratacion
	function cargartablaPlan(id) {
		 $.get("/gestionPlanContratacionPoa/planContratacion/"+id+'/', function (resultado) {
		 	$('#tablaPlancontra').html("");
		 	 $.each(resultado,function(i,item){

		 	 	var presupuesto='';
		 	 	$.each(item.presupuesto,function(j,p){
		 	 			presupuesto=presupuesto+`
		 	 						<tr>
		 	 							<td>${p.partida}</td>
										<td> $ ${new Intl.NumberFormat(["ban", "id"]).format(p.valor_municipal)} </td>
										<td>$ ${new Intl.NumberFormat(["ban", "id"]).format(p.valor_externo)} </td>
										<td class="bg-success">$ ${	new Intl.NumberFormat(["ban", "id"]).format(p.recurso_solicitado)} </td>
		 	 						</tr>
		 	 			`;
		 	 	});
				var trimestre='';
				if(item['poacontratacion'].length>0){
					$.each(item['poacontratacion'],function(i,itemcontr){
						trimestre=trimestre+(`<p> Trimestre ${itemcontr['evaluacionpoa']['numero']}: ${itemcontr['porcentaje']}%</p>`);
					});
				}

		 	 	$('#tablaPlancontra').append(
		 	 	`<tr>
			 	 	<td>${i+1} </td>
			 	 	<td style="vertical-align: inherit;text-align: center;"> ${item.actividad} </td>
	                <td style="vertical-align: inherit;text-align: center;">${item.tipo_plan_contratacion[0].descripcion} </td>
					<td style="vertical-align: inherit;text-align: center;"> ${trimestre}</td>
	                <td>
						<table class="table">
							 <thead>
							 	<th>Clasificador</th>
							 	<th>Recursos municipales</th>
							 	<th>Recursos externos</th>
							 	<th>Total contratación</th>
							 </thead>
							 <tbody>
							 	${presupuesto}
							 </tbody>
						</table>
	                 </td>

               		<td style="vertical-align: inherit;">
						<button type="button" onclick="buscarPlanContratador('${item.idplan_contratacion_encrypt}')" class="btn btn-xs btn-info btn-icon btn-block" data-toggle="tooltip" dataplacement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
				   		<button type="button" onclick="eliminarPlan('${item.idplan_contratacion_encrypt}')" class="btn btn-xs btn-danger btn-icon btn-block" data-toggle="tooltip" dataplacement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
                   </td>
                   </tr>`);
                    institucion='';
		 	 });
			  vistacargando();
		 });
	}

//funciones para Programacion trimestral
function cargarMetasevaluacion(id) {
$('#tableMetasEvaluacion').html('');
$('#porcentaje_trimestral').html('');
$.get("/gestionMetaEvaluacionPoa/metaEvaluacion/"+id+'/', function (data) {
	console.log(data);
	var fila='';
	var coluFila=[];
    var con=0;
    var ctr='';
    var ctr2='';
	 $.each(data, function (i, item) {
		 $('#idperiodo_trimestral').val(item.meta_evaluacion[0]['evaluacion'][0]['idperiodo']);

	 	$.each(item.meta_evaluacion, function (j, eva) {
 		    if(eva.evaluacion[0]['fecha_inicio']<= item.proyecto.fecha_fin){
 		   		ctr='';
 		   	}else{ctr="disabled";}
	 		if(j!=0){
			
	 			coluFila[j]=`<tr>
				 	
					<td  width="30%" class="">Trimestre ${eva.evaluacion[0]['numero']}</td>
				 	<td class="" id="td${eva.idmeta_evaluacion}" ><input ${ctr} onchange="actualizarValor('${eva.idmeta_evaluacion}',${item.idmeta},${eva.idmeta_evaluacion})" type="text"  class="form-control " aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 0%" id="${eva.idmeta_evaluacion}" value="${eva.procentaje}" > </td> </tr>
	 	        `;

				
	 		}
			
	
		
	 	    con=con+1;
	 	});
	 	if(item.meta_evaluacion[0]['evaluacion'][0]['fecha_inicio']<= item.proyecto.fecha_fin){
	 	 	ctr2='';
	 	}else{ctr2="disabled";}
	 	fila=`
			<tr >
                <td rowspan="${con}">${item.descripcion}</td>
                <td >Trimestre ${item.meta_evaluacion[0]['evaluacion'][0]['numero']}</td>
				<td class="" id="td${item.meta_evaluacion[0]['idmeta_evaluacion']}"><input ${ctr2} type="text"  onchange="actualizarValor('${item.meta_evaluacion[0]['idmeta_evaluacion']}',${item.idmeta},${item.meta_evaluacion[0]['idmeta_evaluacion']})"  class="form-control " placeholder=" 0%" name=" value="0" id="${item.meta_evaluacion[0]['idmeta_evaluacion']}" value="${item.meta_evaluacion[0]['procentaje']}" > </td> </tr>
            </tr>
             ${coluFila}
	 	`;
	 	con=0;
	 	coluFila=[];
	 	$('#tableMetasEvaluacion').append(fila);
	 	fila='';
	 });
 });
}
function actualizarValor(id,meta,este) {
	// console.log(este); return;
	$('#msmPlanMeta').html("");
	var valor=$('#'+id).val();
	$('#td'+este).attr('class','');
	$.get("/gestionMetaEvaluacionPoa/updatemetaEvaluacion/"+id+'/'+valor+'/'+meta+'/'+$('#ffinP').val(), function (data) {
		if (data[0]=='success') {
			$('#td'+este).addClass('bg-success');
			   window.setInterval(`$('#td'+${este}).removeClass('bg-success')`,3000);
			   alertEvaluacionPoa('Valor guardado.','success');
		}else if(data[0]=='danger'){
			$('#td'+este).addClass('bg-danger');
			$('#'+id).val(valor);
			window.setInterval(`$('#td'+${este}).removeClass('bg-danger')`,3000);
			alertEvaluacionPoa('Valoración no permitida.','error');
		}else if(data[0]=='warning'){
			$('#td'+este).addClass('bg-danger');
			$('#'+id).val(valor);
			alertEvaluacionPoa('Valoración no permitida.','error');
		}
	});
}

//funcion para mostrar alerta en evaluacion del POA
function alertEvaluacionPoa(msm,estado) {
	new PNotify({
	    title: 'Mensaje de Información',
	    text: `${msm}`,
	    type: `${estado}`,
	    hide: true,
	    delay: 2000,
	    styling: 'bootstrap3',
	    addclass: ''
	});
}
//logica para seleccionar partida///////////////////////////////////
//mostrar sub-lista de partidas
	$('#idpartida').click(function () {
		if($('#idpartida').val()==""){
			$('#subListaPartida').removeClass('hidden');
		}else{
			$('#subListaPartida').addClass('hidden');
		}
	});
	var desPartida='';
	function selectPartida(numPartida,des) {
		desPartida='';
		$('#idpartida').val(numPartida);
		$('#subListaPartida').addClass('hidden');
		desPartida=des;
	}

	$('#idpartida').dblclick(function () {
	  	if($('#idpartida').val()!=""){
	  		$('#subListaPartida').removeClass('hidden');
	  	}else{
	  		$('#subListaPartida').addClass('hidden');
	  	}
	});
// fin de logica para seleccionar partida///////////////////////////////////

	$('#canselarpartidas').click(function () {
		$('#addpartidaPanel').addClass('hidden');
		$('.btn_plan').removeClass('hidden');
		limpiarPartida();
	});
	//intentando crear esa lista
	var plan=[];
	$('#addpartidas').click(function () {
		if($('#idpartida').val()!=""){
			//se creara el array
			    $('.btn_plan').removeClass('hide');
				var array={
					'partida':$('#idpartida').val(),
					'recurso_municipal': $('.recurso_seleccionada').val(),
					'valor_municipal':$('#valor_municipal').val(),
					'recurso_externo':$('.recurso_seleccionada_externo').val(),
					'valor_externo': $('#valor_externo').val(),
					'idinstitucion': $('#idinstitucion').val(),
					'modalidad_externa': $('#modalidad_externa').val(),
					'recurso_solicitado': $('#recurso_solicitado').val(),
					'descripcion_partida':desPartida,
				}
				plan.push(array);
				if(crtPartida==1){
					addPartidaPresupuesto(array);

				}else if(crtPartida==2){
					apdatePartidaPresupuesto(array);
				}else{
						$('#listaPartidas').append(`
								<div class="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
					                <li><a ><i class="fa fa-clipboard"></i> ${$('#idpartida').val()}: ${desPartida}</a>
					                	<a class="close-link navbar-right right text-red red" onclick="eliminarPartidaSelect('${array}',this);"><i class="fa fa-close fa-danger"></i></a>
					 				</li>
					            </div>
						`);
				}

				$('#addpartidaPanel').addClass('hidden');
				limpiarPartida();
				desPartida='';
		}else{
			new PNotify({
			    title: 'Mensaje de Información',
			    text: `Para continuar debes seleccionar un clasificador presupuestario`,
			    type: `error`,
			    hide: true,
			    delay: 3000,
			    styling: 'bootstrap3',
			    addclass: ''
			});
		}

	});
	$('#insertPartida').click(function () {
		$('#addpartidaPanel').removeClass('hidden');
		$('.btn_plan').addClass('hide');
	});

	function limpiarPartida() {
			crtPartida=0;
		    $("#idpartida").val("");
			$('#valor_municipal').val("0")
			$('#valor_externo').val("0")
			$('.option_idinstitucion').prop('selected',false);
			$("#idinstitucion").trigger("chosen:updated");
			$('#modalidad_externa').val("");
			$('#recurso_solicitado').val("");
			//interno
			$('.recurso_municipal').removeClass("recurso_seleccionada");
			$('#valorMunicipal').removeClass('hide');
			$('#recurso_municipal').iCheck('check');
			$('#recurso_municipal').addClass('recurso_seleccionada');
			//externo
			$('.recurso_externo').removeClass("recurso_seleccionada_externo");
			$('#valorMunicipalExterno').addClass('hide');
			$('#selectInstitucion').addClass('hide');
			$('#selectModalidad').addClass('hide');
			$('#recurso_externo2').iCheck('check');
			$('.btn_plan').removeClass('hide');
	}
	//funcion para quitar la partida no deseada
	function eliminarPartidaSelect(data,este) {

		$(este).parents('li').remove();
		plan.pop(data);

	}
	//eliminar partida del presupuesto
	function eliminarPartidaSelectDB(id, este) {
		if(confirm('¿Esta seguro que quiere eliminar el registro?')){
			$.get("/gestionPlanContratacionPoa/deletePresupuesto/"+id, function (data) {
				if(data.estadoP=='success'){
					$(este).parents('li').remove();
					$(este).parents('.div_p').remove();
					cargartablaPlan($('#idproyectopoa').val());
				}
			}).fail(function(error){
            	alert("Error al ejecutar la petición");
        	});
		}
	}
	//actualizar partida
	var idpresupuesto;
	function actualizarPartidaSelect(id, este) {
		$.get("/gestionPlanContratacionPoa/presupuesto/"+id+'/edit', function (data) {
			 crtPartida=2;
			 idpresupuesto=data.resultado.idpoa_presupuesto;
			$('#idpartida').val(data.resultado.partida);
			desPartida=data.resultado.descripcion_partida;
			if(data.resultado.recurso_municipal==1){
					$('#recurso_municipal').addClass('recurso_seleccionada');
					$('#recurso_municipal').removeClass('hide');
	  		        $('#valor_municipal').val(data.resultado.valor_municipal);
	  				$('#recurso_municipal').iCheck('check');
			}else if(data.resultado.recurso_municipal==0){
			  		$('#recurso_municipal2').addClass('recurso_seleccionada');
					$('#recurso_municipal2').addClass('hide');
	  		        $('#valor_municipal').val(data.resultado.valor_municipal);
	  				$('#recurso_municipal2').iCheck('check');
			}
			if (data.resultado.recurso_externo==1) {
			  	$('#valorMunicipalExterno').removeClass('hide');
			  	$('#selectInstitucion').removeClass('hide');
			  	$('#selectModalidad').removeClass('hide');
			  	$('#recurso_externo1').addClass('recurso_seleccionada_externo');
			  	$('#recurso_externo1').iCheck('check');

				$('.option_idinstitucion').prop('selected',false);
				$(`#idinstitucion option[value="${data.resultado.idinstitucion}"]`).prop('selected',true);
				$("#idinstitucion").trigger("chosen:updated");
				$('#modalidad_externa').val(data.resultado.modalidad_externa);
				$('#valor_externo').val(data.resultado.valor_externo);
			}else if(data.resultado.recurso_externo==0){
			  	$('#valorMunicipalExterno').addClass('hide');
			  	$('#selectInstitucion').addClass('hide');
			  	$('#selectModalidad').addClass('hide');
			  	$('#recurso_externo2').addClass('recurso_seleccionada_externo');
			  	$('#recurso_externo2').iCheck('check');
			  	$('#valor_externo').val(data.resultado.valor_externo);
			}
			  $('#recurso_solicitado').val(data.resultado.recurso_solicitado);
			  $('#btn_plan_cancelar').removeClass('hidden');
			  $('#method_plan').val('PUT');
			  $('.btn_plan').addClass('hide');
			$('#addpartidaPanel').removeClass('hidden');

		}).fail(function(error){
        	alert("Error al ejecutar la petición");
    	});
	}
	//guardar_presupuesto al plan
	function addPartidaPresupuesto(data) {
		$.ajaxSetup({
		    headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
		var FrmData = {
		    idplan_contratacion: $('#idplanContrat').val(),
		    array:plan
		};

		$.ajax({
		    url:'/gestionPlanContratacionPoa/presupuesto', // Url que se envia para la solicitud
		    method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		    data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		    dataType: 'json',
		    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		    {
		    	 obtenerListProyectoPoa();
		    	  refrescarPartidas($('#idplanContrat').val());
		    	$('#msmPlan').html(`
						<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
						<div class="col-md-8 col-sm-6 col-xs-12">
						    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
						        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						        </button>
						        <strong>Información: </strong> ${requestData.mensaje}
						    </div>
						</div>
		    		`);

		    	limpiarPartida();
		    	control=1;
		    	cargartablaPlan($('#idproyectopoa').val());
		    	plan=[];
		    }, error:function (requestData) {

		    }
		    });
	}

	//Actualizar presupuesto
	function apdatePartidaPresupuesto(data) {
		$.ajaxSetup({
		    headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
		var FrmData = {
		    idplan_contratacion: $('#idplanContrat').val(),
		    array:plan
		};

		$.ajax({
		    url:'/gestionPlanContratacionPoa/presupuesto/'+idpresupuesto, // Url que se envia para la solicitud
		    method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
		    data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		    dataType: 'json',
		    success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		    {
		    	crtPartida=1;
		    	idpresupuesto=0;
		    	control=1;
		    	 obtenerListProyectoPoa();
		  //   	$('#listaPartidas').append(`
				// 			<div class="col-md-12 col-sm-12 col-xs-12 form-group has-feedback div_p">
				//                 <li>
				//                 	<a><i class="fa fa-clipboard"></i> ${requestData.pre.partida}: ${requestData.pre.descripcion_partida}</a> <a class="close-link navbar-right right text-red red" onclick="eliminarPartidaSelectDB('${requestData.pre.idpoa_presupuesto_encrypt}',this);"><i class="fa fa-trash fa-danger"></i></a>
				//                		<a class="close-link navbar-right right blue" onclick="actualizarPartidaSelect('${requestData.pre.idpoa_presupuesto_encrypt}',this);"><i class="fa fa-edit fa-primary"></i></a>
				//                	 </li>
				//             </div>
				// `);
				refrescarPartidas($('#idplanContrat').val());
		    	$('#msmPlan').html(`
						<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
						<div class="col-md-8 col-sm-6 col-xs-12">
						    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
						        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
						        </button>
						        <strong>Información: </strong> ${requestData.mensaje}
						    </div>
						</div>
		    	`);

		    	limpiarPartida();
		    	cargartablaPlan($('#idproyectopoa').val());
		    	plan=[];
		    }, error:function (requestData) {

		    }
		});
	}

	//funcion para recargar las partidas
	function refrescarPartidas(id) {
		$.get("/gestionPlanContratacionPoa/presupuesto/"+id, function (data) {
			$('#listaPartidas').html("");

			 $.each(data, function (j, presup) {
			  	$('#listaPartidas').append(`
					<div class="col-md-12 col-sm-12 col-xs-12 form-group has-feedback div_p">
	                    <li><a ><i class="fa fa-clipboard"></i> ${presup.partida}: ${presup.descripcion_partida}</a>
		                    <a class="close-link navbar-right right red " onclick="eliminarPartidaSelectDB('${presup.idpoa_presupuesto_encrypt}',this);"><i class="fa fa-trash fa-danger right"></i></a>
		               		<a class="close-link navbar-right right blue" onclick="actualizarPartidaSelect('${presup.idpoa_presupuesto_encrypt}',this);"><i class="fa fa-edit fa-primary"></i></a>
	               		</li>
	                </div>
			  	`);
			});
		});
	}
var  control=0;
	//evento para recargar la tabla de proyectos
	$("#modalProyectoPoa").on("hidden.bs.modal", function () {

       	repetir= window.clearInterval(repetir);
	    if(control==1){
	    	vistacargando('M','Actualizando..');
	    	window.location.reload();
	   		control=0;
	  }
	});


