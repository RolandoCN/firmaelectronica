//variables globales para registrar el pac y controlar las actividades ingresadas

var idpac='';
var ctrChex=1;
var crtPac=0;
var presupuesto=0; 
var calcular=0;
var idproyectoPac='';
var idpresupuesto='';
var idtiporegimen='';
var url=window.location.protocol+'//'+window.location.host;

function asignaridDepartamento(id){
	$('#buttonGenerarReporte').hide();
	$('#buttonGenerarReporte').html(`<a type="button" class="btn btn-warning" href="/gestionProyectoPoa/consolidadoArea/${id}/Consolidado/${$('#anio').val()}"><span class="fa fa-download"></span> Descargar Reporte</a>`)
	$('#buttonGenerarReporte').show(200);

	$('#buttonfiltrodep').hide();
	$('#buttonfiltrodep').html(`<a type="button" class="btn btn-info" href="/gestionProyectoPoa/consolidadoPacanio/${$('#anio').val()}/${id}"><span class="fa fa-search"></span> Realizar filtro</a>`)
	$('#buttonfiltrodep').show(200);
	
}

function asignaridDepartamentoAnio(id){
	$('#buttonGenerarReporte').hide();
	$('#buttonGenerarReporte').html(`<a type="button" class="btn btn-warning" href="/gestionProyectoPoa/consolidadoArea/''/Aprobacion/${id}"><span class="fa fa-download"></span> Descargar Reporte</a>`)
	$('#buttonGenerarReporte').show(200);
}


//funcion para obtener las actividades del proyecto seleccionado
	function obtenerActividades() {
		 
		crtPac=1;
		var  id= $('#idproyectoPac').val();
		$('#anioPac').val(''); 
		$('#accordion').html("");
		$.get("/gestionProyectoPoa/actividadesPac/"+id, function (data) {
		 	
		 	$('#anioPac').val(data['anio']);
		 	var txtdefaulPac=` <div class="panel" style="vertical-align:middle;">
                                 <p  >Sin actividades..</p>
                            </div>`;
		 	//se recorren las actividades
		 	$.each(data.actividades,function(i,item){

		 	 	//se recorren los presupuesto de las actividades que viene siendo la partida
		 	 	var arrayPartida='';

		 	 	if(item['presupuesto']!='[]'){
		 	 		var iter=1;
		 	 		$.each(item['presupuesto'],function(j,value){
		 	 			var crtPartida='';		
		 	 			var encodedData = window.btoa(item['actividad']); // encode a string
		 	 			
		 	 			arrayPartida=`${arrayPartida}
		 	 							<tr  ${crtPartida} >
		 	 								<th width="4px">${iter}</th>
			 	                            <th>${value['descripcion_partida']}</th>
			 	                            <td width="20px">${value['partida']}</td>
			 	                           	<td width="10px" style="vertical-align:middle;"> <button  onclick="modalPac('${(value['total_contratacion']/data['iva']).toFixed(3)}','${encodedData}','${item['idproyecto_encrypt']}','${value['idpoa_presupuesto_encrypt']}','${value['partida']}','${value['descripcion_partida']}','${data['anio']}')" type="button" class="btn btn-primary btn-xs"><i class="fa fa-pencil"> Realizar</button></td>
		 	                        	</tr>
		 	 						`;
		 	 			iter++;
		 	 		});
		 	 	}
		 	 	 
		 	 	
 			 	$('#accordion').append(`
 			 		<div class="panel">
 	                  <a class="panel-heading collapsed bg-info" role="tab" id="heading${i}" data-toggle="collapse" data-parent="#accordion" href="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
 	                    <h4 class="panel-title">${i+1} ${item.actividad} </h4>
 	                  </a>
 	                  <div id="collapse${i}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading${i}">
 	                    <div class="panel-body">
	 	                    <table class="table table-bordered">
	 	                        <tbody>
		 	                        ${arrayPartida}
	 	                        </tbody>
	 	                    </table>
 	                    </div>
 	                  </div>
 	                </div>
 			 	`);

		 	});
		 	
		 	if(data.actividades.length==0){
		 		$('#accordion').html(txtdefaulPac);
		 	}

		 	
		});
	}
 

//evento para cargar datos a la modal pac registro
 	function mostrasPacModal(idp) {
 		crtPac=0;
 		limpiarFormPac();
		vistacargando('M','Cargando datos');
		idpac=idp;
		getCuatrimestre();
		//solicitamos consulta del pac seleccionado
			$.get("/gestionProyectoPoa/pac/"+idp+"/edit", function (data) {
				calcular=1;
				document.getElementById('btn_PAC').disabled=false;
				$('#namePac').html("");
				if(data!=null){
					
					$('#namePac').html(`<p class=""><i class="fa fa-adjust"> </i> <b>${data.consulta.anio} ${data.consulta.presupuesto[0].plan_contratacion[0].actividad} | ${data.consulta.presupuesto[0].partida} ${data.consulta.presupuesto[0].descripcion_partida} </b></p>`);
					mostrarDatosModalPac(data);
				}
				
			});    
	 	$('#modalPac').modal('show');
	 	vistacargando();
 	}

//funcion para abrir la modal para el registro pac
	function modalPac(presupu,nombre,idp,idpartida,partida,des_partida,anio) {
		 // var arra = presupuesto.currentTarget.obj;
		nombre = window.atob(nombre); // decode the string
		calcular=0;
		presupuesto=0;
		presupuesto=presupu;
	 	$('#namePac').html("");
	 	$("#resultadoCategoria").html("");
	 	$('#namePac').html(`<p class=""><i class="fa fa-adjust"> </i> <b>${anio} ${nombre} | ${partida} ${des_partida} </b></p>`);
	 	//se guarda el pac con datos de entrada
	     	var FrmData = {//se crea la data del pac inicial
			    idpoa_presupuesto: idpartida,// se refiere a la partida presupuestaria
			    idproyecto: idp,
			    anio: anio,
			};
	 	ingresarPac(FrmData);
	 	limpiarFormPac();
	 	$('#detalle_producto').val(nombre);
	 	
	 	// $('#costo_unitario').attr('max',`${presupuesto}`);
	 	$('#modalPac').modal('show');
	 
	} 

	//chekear y deschekera BID
		$('.radioFondo').on('ifChecked', function(event){
		     $(this).addClass('fondoBID_seleccionado');
		     activarInputPac();
		});
		    $('.radioFondo').on('ifUnchecked', function(event){
		    $(this).removeClass();
		     activarInputPac();
		});

	//radios de ingreso de PAC
		//radio  tipo_producto
			$('.tipo_producto').on('ifChecked', function(event){
			     $(this).addClass('tipo_producto_seleccionado');
			    	tipodeproducto();
			});
			    $('.tipo_producto').on('ifUnchecked', function(event){
			    $(this).removeClass();
			    // tipodeproducto();
			});
		//catalogo_electronico
	$('#catalogo_electronico1').on('ifChecked', function(event){
			    $(this).addClass('catalogo_electronico_seleccionado');
				$('.option_idprocedimiento_contratacion').prop('selected',false); 
				$(`#idprocedimiento_contratacion option[value="1"]`).prop('selected',true); 
				$('#idprocedimiento_contratacion').prop('disabled', true);
				$('#idprocedimiento_contratacion').trigger("chosen:updated");
				$('.catalogo_electronico_seleccionado').val('SI');

			// setTimeout(function() {
			// 	valicarCatalogoelectronico();
			//   },  2000);
			
			
	});
		$('#catalogo_electronico2').on('ifChecked', function(event){
			$('.option_idprocedimiento_contratacion').prop('selected',false); 
			$('#idprocedimiento_contratacion').prop('disabled', false);
			$('#idprocedimiento_contratacion').trigger("chosen:updated");
			$('.catalogo_electronico_seleccionado').val('NO');

				
		$(this).removeClass();
	});

		function valicarCatalogoelectronico() {
			  idtiporegimen = document.getElementById("idtiporegimen").value;
			if($('.catalogo_electronico_seleccionado').val()=='SI'){
				//cargar catalogos seleccionado

					// if(calcular==0){
					  
					 	getProcedimiento(idtiporegimen,1);	
					// }
					
			}else{
				
				// if(calcular==0){
				    $('#idprocedimiento_contratacion').prop('disabled', false).trigger("liszt:updated");
				    $("#idprocedimiento_contratacion").trigger("chosen:updated");
				// }
				
			}
			
				 // getProcedimiento(0,0);
			
		} 

   //activar input de los valores
    function activarInputPac() {
	   	if($('.fondoBID_seleccionado').val()=='SI'){
	   		//habilitamos input 
	   		$('.operacionBID').removeClass('hide');
	   		$('.proyectoBID').removeClass('hide'); 
	   		 document.getElementById("codigo_bid").required = true;
	   		 document.getElementById("codigo_proyecto_bid").required = true;
	   		
	   	}else{
	   		//desabilitamos input 
	   		$('.proyectoBID').addClass('hide');
	   		$('.operacionBID').addClass('hide');
	   		 document.getElementById("codigo_bid").required = false;
	   		 document.getElementById("codigo_proyecto_bid").required = false;
	   	}
	   
    }

 //funcion para guardar el pac
    function ingresarPac(FrmData){ 
        // if(confirm('¿Quiere eliminar el registro?')){
              vistacargando('M','Espere por favor');
              
              $.ajaxSetup({
                  headers: {
                      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                  }
              });

              $.ajax({
                  url:'/gestionProyectoPoa/pac', // Url que se envia para la solicitud
                  method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
                  dataType: 'json',
				  data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
				  success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
                  {
	                   alertEvaluacionPac(requestData.sms,requestData.estado);
	                   vistacargando();
                       if(requestData.estado=='success'){
                       		idpac=requestData.idpac;
                       		 presupuesto=presupuesto-requestData.totalPre;
                       		if(presupuesto<=0){
                       			document.getElementById('btn_PAC').disabled=true;
                       		}else{
                       			document.getElementById('btn_PAC').disabled=false;
                       		}
                       		 $('#costo_total').attr('max',`${presupuesto}`);
                       		
                       		getCuatrimestre();
                       		// cargarTablePac();
                       }

                  }, error:function (requestData) {
                     vistacargando();
                    console.log('Error no se puedo completar la acción');
                  }
              });
        // }
    }

//evento para limpiar pac desde btn canselar

$("#btn_pac_cancelar").click(function(e){
	limpiarFormPac();
	
});

 //limpiar select en el form PAC registro
 	function limpiarFormPac() {
 		ctrChex=1;
 		
    	$("#idcategoria_cpc").val(" "); // actualizamos el combo
    	 $('#txtidcategoria_cpc').val(""); 
    	$('.option_idtipo_contratacion').prop('selected',false);  
    	$("#idtipo_contratacion").trigger("chosen:updated"); 

    	$('.option_idunidad_medida').prop('selected',false);  
    	$("#idunidad_medida").trigger("chosen:updated"); 

    	$('.option_idprocedimiento_contratacion').prop('selected',false);  
    	$("#idprocedimiento_contratacion").trigger("chosen:updated"); 

    	$('.option_idtiporegimen').prop('selected',false);  
    	$("#idtiporegimen").trigger("chosen:updated"); 

    	$('.option_idtipo_presupuesto').prop('selected',false);  
    	$("#idtipo_presupuesto").trigger("chosen:updated"); 

    	//tipo de producto
    	$('.tipo_producto').removeClass("tipo_producto_seleccionado");
    	$('#tipo_producto1').iCheck('check');
    	$('#tipo_producto1').addClass('tipo_producto_seleccionado');

    	//cuatrimestre
    	  $('.cuatrimestre').iCheck('uncheck');

    	//radios fondo_bid
    	$('.radioFondo').removeClass("fondoBID_seleccionado");
    	$('#fondo_bid1').iCheck('check');
    	$('#fondo_bid1').addClass('fondoBID_seleccionado');
    	$('.operacionBID').removeClass("hide");
    	
    	//radios catalogos electronicos
    	$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
    	$('#catalogo_electronico1').iCheck('check');
    	$('#catalogo_electronico1').addClass('catalogo_electronico_seleccionado');

    	$('.operacionBID').removeClass('hide');
	   	$('.proyectoBID').removeClass('hide'); 
	   	
	   	document.getElementById("codigo_bid").required = true;
	   	document.getElementById("codigo_proyecto_bid").required = true;
	   	document.getElementById("frm_pac").reset();
	   	$('#tipo_producto3').iCheck('enable');

	   	ctrChex=0;


	 }
	 

//evento para actualizar el pac
	//Gestion Guardar incidencias
	$("#frm_pac").on("submit", function(e){
			e.preventDefault();
		//validacion a los select no se por que no reconocen el requieredd

			// if($("#idprocedimiento_contratacion").is(':checked')){
			// 	check_filtrar_fecha = true;
			// }
		
		
			if($('#idcategoria_cpc').val()==""){
				alertEvaluacionPac('Seleccione categoría','error');
	 	 		return 0;
	 	 	}
	 	 	if($('#idtipo_contratacion').val()==""){
	 	 		alertEvaluacionPac('Seleccione tipo de compra','error');
	 	 		return 0;
	 	 	}
	 	 	if($('#idunidad_medida').val()==""){
	 	 		alertEvaluacionPac('Seleccione Unidad','error');
	 	 		return 0;
	 	 	}
			if($('.catalogo_electronico_seleccionado').val()=='NO'){
				if($('#idprocedimiento_contratacion').val()==""){
					alertEvaluacionPac('Seleccione Procedimiento sugerido','error');
					return 0;
				}	
			}
	 	 	
	 	 	if($('#idtiporegimen').val()==""){
	 	 		alertEvaluacionPac('Seleccione Tipo de régimen','error');
	 	 		return 0;
	 	 	}
	 	 	if($('#idtipo_presupuesto').val()==""){
	 	 		alertEvaluacionPac('Seleccione Tipo de presupuesto','error');
	 	 		return 0;
	 	 	}
	 	 	
	 	 	if(calcular==0){
	 	 		if( parseInt(presupuesto)<=0){
	 	 			presupuesto=0;
	 	 			alertEvaluacionPac('Lo sentimos, ya no hay presupuesto para esta partida presupuestaria. ','error');
	 	 			return 0;
	 	 		}
				  console.log(presupuesto);
	 	 		//validar que el presupuesto no se sobre pase
	 	 		if( $('#costo_total').val() >= presupuesto &&  $('#costo_total').val() != presupuesto){
	 	 			
	 	 			alertEvaluacionPac('Lo sentimos, ya no hay presupuesto para esta partida presupuestaria. ','error');
	 	 			return 0;
	 	 		}
	 	 	}
		 	 	
	 	 	
    	actualizarPac();
 	});

//actualizar PAC
 	 function actualizarPac(){

      	  // vistacargando('M','Espere por favor');
	      $.ajaxSetup({
	          headers: {
	              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	          }
	      });
	       	var FrmData = {//se crea la data del pac inicial
			      		    idcategoria_cpc: $('#idcategoria_cpc').val(),// se refiere a la partida presupuestaria
			      		    idtipo_contratacion: $('#idtipo_contratacion').val(),
			      		    detalle_producto: $('#detalle_producto').val(),
			      		    cantidad_anual:$('#cantidad_anual').val(),
			      		    idunidad_medida:$('#idunidad_medida').val(),
			      		    costo_unitario:$('#costo_unitario').val(),
			      		    tipo_producto:$('.tipo_producto_seleccionado').val(),
			      		    catalogo_electronico:$('.catalogo_electronico_seleccionado').val(),
			      		    idprocedimiento_contratacion:$('#idprocedimiento_contratacion').val(),
			      		    fondo_bid:$('.fondoBID_seleccionado').val(),
			      		    codigo_bid:$('#codigo_bid').val(),
			      		    codigo_proyecto_bid:$('#codigo_proyecto_bid').val(),
			      		    idtiporegimen:$('#idtiporegimen').val(),
			      		    idtipo_presupuesto:$('#idtipo_presupuesto').val()
	  		};

	      $.ajax({
	          url:'/gestionProyectoPoa/pac/'+idpac, // Url que se envia para la solicitud
	          method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
	          dataType: 'json',
			  data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
			  success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
	          {
	               alertEvaluacionPac(requestData.sms,requestData.estado);
	               if(requestData.estado=='success'){
	               		idpac=requestData.idpac;
	               		if(crtPac==1){
	               			obtenerActividades();
	               		}
	               		cargarTablePac();
	               		limpiarFormPac();
	               		calcular==0;

	               }
	                  
	               	$('#modalPac').modal('hide');
	          }, error:function (requestData) {
	             vistacargando();

	            console.log('Error no se puedo completar la acción');
	          }
	      });
        
    }
//eliminar pac
	function btn_eliminar_pac(idp){
	    if(confirm('¿Quiere eliminar el registro?')){
	    	vistacargando('M','Espere por favor');
              
            $.ajaxSetup({
                  headers: {
                      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                  }
            });

            $.ajax({
                  url:'/gestionProyectoPoa/pac/'+idp, // Url que se envia para la solicitud
                  method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
                  dataType: 'json',
				  success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
                  {
	                  	cargarTablePac();
	                   
                        if(requestData.estado=='info'){
                       		
                       		
	               			obtenerActividades();
	               			
                        }
                        alertEvaluacionPac(requestData.sms,requestData.estado);
                  }, error:function (requestData) {
                     vistacargando();
                    console.log('Error no se puedo completar la acción');
                  }
            });
	    		
	    }
	}

//actualizar tabla de proyectos pac
function cargarTablePac() {
	 	$.get("/gestionProyectoPoa/getPac", function (data) {
		 	
		 	
	 		$("#datatablePac").DataTable().destroy();
	 		$('#datatablePac tbody').empty();
	 		$.each(data, function (i, item) {

	 			//definiendo etiqueta para los estado del pac
	 			if(item['estado_revision']=='R'){var bgColor='bg-danger';}
	 			if(item['estado_revision']=='P'){var bgColor='bg-info';}
	 			if(item['estado_revision']=='C'){var bgColor='bg-warning';}
	 			if(item['estado_revision']=='A'){var bgColor='bg-success';}

	 			//condisiones de las acciones del pac
	 			var option=' ';
	 			if(item['estado_revision']=='P'){
	 				option=` <a  class="btn btn-default btn-lg" disabled>
                                <i class="fa fa-eye"></i> En revisión  
                            </a>`;
	 			   
	 			}else if(item['estado_revision']=='A'){
	 				option=`<a  class="btn btn-default btn-lg" style="vertical-align: middle;" disabled>
                                <i class="fa fa-check"></i> Aprobado 
                            </a>
	 						`;
	 				
	 			}else if(item['estado_revision']=='C'){
	 				option=`
	 						<a onclick="mostrasPacModal('${item['idplan_anual_compras_encrypt']}')" class="btn btn-block btn-warning btn-xs">
	 				    		 <i class="fa fa-eye"></i>  Corregir  
	 						</a>
			 				<a  href="${url}/gestionProyectoPoa/pac/'${item.idplan_anual_compras_encrypt}" onclick="vistacargando('M','Espere por favor');" class="btn btn-block btn-primary btn-xs">
			 				     <i class="fa fa-folder"></i> Enviar 
							 </a>
							<a  onclick="confirmarPac('${item['idplan_anual_compras_encrypt'] }','pac')"   class="btn btn-block btn-danger btn-xs">
								 <i class="fa fa-trash-o"></i> Eliminar  
							</a>
	 						`;
	 				
	 			}else if(item['estado_revision']=='R'){
	 				option=` <a  class="btn btn-default btn-lg" disabled>
                                <i class="fa fa-thumbs-down"></i> Reprobado 
                            </a>`;
	 				
	 			}else{
	 				option=`
	 						<a onclick="mostrasPacModal('${item['idplan_anual_compras_encrypt']}')" class="btn btn-block btn-info btn-xs">
						         <i class="fa fa-pencil"></i>  Editar
				 		    </a>
 						    <a  onclick="confirmarPac('${item['idplan_anual_compras_encrypt'] }','pac')"   class="btn btn-block btn-danger btn-xs">
 						         <i class="fa fa-trash-o"></i> Eliminar  
 						    </a>
 						    <a  href="${url}/gestionProyectoPoa/pac/'${item['idplan_anual_compras_encrypt']})" onclick="vistacargando('M','Espere por favor');" class="btn btn-block btn-primary btn-xs">
 						  	  <i class="fa fa-folder"></i> Enviar 
							 </a>
							 
	 				`;
	 				 
	 			}
	 			   
	 			//validaciones de campo para la tabla pac
		 			var tipo_plan_contratacion='';
		 			if(item['tipo_plan_contratacion'].length!=0){
		 				var tipo_plan_contratacion= item['tipo_plan_contratacion'][0]['descripcion'];
		 			}
					var procedimiento_sugerido='';
		 			if(item['procedimiento_sugerido'].length!=0){
		 				 procedimiento_sugerido= item['procedimiento_sugerido'][0]['descripcion'];
		 			}
		 			var categoria_cpc='';
		 			if(item['categoria_cpc'].length!=0){
		 				var categoria_cpc= `<b class="blue">${item['categoria_cpc'][0]['codigo']}</b> <br> ${item['categoria_cpc'][0]['descripcion'].substr(0,60)}...`;
		 			}
	 		    $('#datatablePac tbody').append(`
	 		        <tr class="${bgColor}">
	 		            <td>${i+1}</td>
	 		            <td>${item['anio']}</td>
	 		            <td>${item['presupuesto'][0]['partida']}</td>
	 		            <td>${ tipo_plan_contratacion }</td>
	 		            <td>${categoria_cpc}</td>
	 		            <td>${item['detalle_producto']} </td>      
	 		            <td>${item['cantidad_anual']} ${item['unida_medida'][0]['cod']}</td>
	 		            <td>$ ${item['costo_unitario']}</td>
	 		            <td>$ ${item['costo_unitario']*item['cantidad_anual']}</td>
	 		            <td>${procedimiento_sugerido}</td>
	 		            <td>${item['tipo_presupuesto'][0]['descripcion']}</td>
	 		          
	 		            
	 		            <td>
	 		               ${option}  	
	 		            </td>
	 		        </tr>
	 		    `);

	 		});
	 		cargar_estilos_tabla("datatablePac",10);
	 		// $("#datatablePac").DataTable();
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
        order: [[ 1, "desc" ]],
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



// funcion para mostrar datos en la modal PAC
	function mostrarDatosModalPac(data) {
		try {
				// getProcedimiento('',0);//cargar procedimiento sugerido

				var iva=data.iva;
				var totalPresupuesto=data.totalPresupuesto;
				var data=data.consulta;

				idtiporegimen=data.idtiporegimen;
				

				presupuesto=(data.presupuesto[0].total_contratacion/iva)-(totalPresupuesto);
				idproyectoPac=data.idproyecto;
				idpresupuesto=data.idpoa_presupuesto;
	            // $('#costo_unitario').attr('max',`${presupuesto.toFixed(2)}`); 
	            $('#costo_total').attr('max',`${presupuesto.toFixed(2)}`); 
	            $('#costo_total').val((data.costo_unitario*data.cantidad_anual).toFixed(2)); 
	            $('#txtidcategoria_cpc').val(data.categoria_cpc[0]['codigo']); 
    			$("#idcategoria_cpc").val(data.idcategoria_cpc); 
    			$('.option_idtipo_contratacion').prop('selected',false);
    			$(`#idtipo_contratacion option[value="${data.idtipo_contratacion}"]`).prop('selected',true);
    			$("#idtipo_contratacion").trigger("chosen:updated"); 

    			$('.option_idunidad_medida').prop('selected',false); 
    			$(`#idunidad_medida option[value="${data.idunidad_medida}"]`).prop('selected',true);
    			$("#idunidad_medida").trigger("chosen:updated"); 

    			

    			$('.option_idtiporegimen').prop('selected',false);  
    			$(`#idtiporegimen option[value="${data.idtiporegimen}"]`).prop('selected',true);
    			$("#idtiporegimen").trigger("chosen:updated"); 

    			$('.option_idtipo_presupuesto').prop('selected',false); 
    			$(`#idtipo_presupuesto option[value="${data.idtipo_presupuesto}"]`).prop('selected',true);
    			$("#idtipo_presupuesto").trigger("chosen:updated"); 

    			
    			$('#detalle_producto').val(data.detalle_producto);
    			$('#cantidad_anual').val(data.cantidad_anual);
    			$('#costo_unitario').val((data.costo_unitario).toFixed(2));

				//radio tipo de producto
					var checkTP='';
					$('.tipo_producto').iCheck('uncheck');
					$('.tipo_producto').removeClass("tipo_producto_seleccionado");

					if(data.tipo_producto=='NORMALIZADO'){
						checkTP='#tipo_producto1';
					}else if(data.tipo_producto=='NO NORMALIZADO'){
						checkTP='#tipo_producto2';
					}else if(data.tipo_producto=='NO APLICA'){
						checkTP='#tipo_producto3';
					}
		
					$(`${checkTP}`).iCheck('check');
					$(`${checkTP}`).iCheck('enable');
					$(`${checkTP}`).addClass('tipo_producto_seleccionado');

				//radios catalogos electronicos
					var checkCAT='';
					$('.catalogo_electronico').iCheck('uncheck');
					$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
					console.log(data.catalogo_electronico);
					if(data.catalogo_electronico=='SI'){
						checkCAT='#catalogo_electronico1';
					}else if(data.catalogo_electronico=='NO'){
						checkCAT='#catalogo_electronico2';
					}

			    	$(`${checkCAT}`).iCheck('check');
			    	$(`${checkCAT}`).iCheck('enable');
			    	$(`${checkCAT}`).addClass('catalogo_electronico_seleccionado');

			    //radios Fondos BID
					var checkFB='';
					$('.radioFondo').iCheck('uncheck');
					$('.radioFondo').removeClass("fondoBID_seleccionado");
					if(data.fondo_bid=='SI'){

						checkFB='#fondo_bid1';

	   					$('.operacionBID').removeClass('hide');
	   					$('.proyectoBID').removeClass('hide'); 
	   					 document.getElementById("codigo_bid").required = true;
	   					 document.getElementById("codigo_proyecto_bid").required = true;

	   					$('#codigo_bid').val(data.codigo_bid);
	   					$('#codigo_proyecto_bid').val(data.codigo_proyecto_bid);
	   					
					}else if(data.fondo_bid=='NO'){
						checkFB='#fondo_bid2';
	   					$('.proyectoBID').addClass('hide');
	   					$('.operacionBID').addClass('hide');
	   					 document.getElementById("codigo_bid").required = false;
	   					 document.getElementById("codigo_proyecto_bid").required = false;
					}

			    	$(`${checkFB}`).iCheck('check');
			    	$(`${checkFB}`).iCheck('enable');
			    	$(`${checkFB}`).addClass('fondoBID_seleccionado');
			    	// console.log(checkCAT);

			    	$('.option_idprocedimiento_contratacion').prop('selected',false); 
			    	$(`#idprocedimiento_contratacion option[value="${data.idprocedimiento_contratacion}"]`).prop('selected',true); 
			    	$("#idprocedimiento_contratacion").trigger("chosen:updated"); 
			    	vistacargando();

	         } catch(err) {
	            alert('No se pudo mostrar datos del Pac..');
	            console.log(err);
	            vistacargando();
	     }
	}

//funcion para enviar y aprovar pac
	function confirmarPac(id,redirec,estadoPac=0) {
		if(estadoPac==0){
			if(confirm('¿Estás seguro que deseas ejecutar la acción. ?')){
			vistacargando('M','Por favor espere...');
			$.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
			$.ajax({
				url:'/gestionProyectoPoa/pac/'+id, // Url que se envia para la solicitud
				method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
				dataType: 'json',
				success: function(data)   // Una función a ser llamada si la solicitud tiene éxito
				{
					if(data['error']==false){
						alertEvaluacionPac('La acción fue realizada con exito.','success');
						location.href =`${url}/gestionProyectoPoa/${redirec}`;
					
				}else{
						alertEvaluacionPac('Algo ha salido mal, lo sentimos. Error:'.data.sms,'error');
						vistacargando();
				}
					
				}, error:function (requestData) {
					vistacargando();
					console.log('Error no se puedo completar la acción');
				}
			});
			}
		}
		if(estadoPac!=0){
			if(confirm('Estás seguro que deseas ejecutar la acción. ?')){
			
				vistacargando('M','Por favor espere...');
				$.get("/gestionProyectoPoa/estadoPac/"+id+"/"+estadoPac, function (data) {
					if(data.estado!='error'){
						 alertEvaluacionPac('La acción fue realizada con exito.','success');
						 location.href =`${url}/gestionProyectoPoa/${redirec}`;
						
					}else{
						 alertEvaluacionPac('Algo ha salido mal, lo sentimos. Error:'.data.sms,'error');
						 vistacargando();
					}
					
				}).fail(function(error){
					 alertEvaluacionPac('Algo ha salido mal, lo sentimos. Error:'.data.sms,'error');
					 vistacargando();
				}); 
			}
		}
	}	


//funcion para buscar categoria
	function getcategoriaSelect() {
		$(".idcategoria_cpc").addClass("bad");
		if($('#txtidcategoria_cpc').val().length>=3){
				$('#idcategoria_cpc').val('');
			    if($('#txtidcategoria_cpc').val()!=""){
			        $.get('/gestionProyectoPoa/getCategorias/'+$('#txtidcategoria_cpc').val(), function (data){
			          $("#resultadoCategoria").html("");
			           $.each(data, function(i, item) {
			             var nombre='';
			             
			             $('#resultadoCategoria').append(`
			                <ul class="nav nav-pills nav-stacked">
			                  <li onclick="obtenerCPC('${item.descripcion}','${item.codigo}','${item.idcategoria_cpc}')" class="text-left" >
			                    <a><i class="fa fa-barcode text-blue"></i>
			                     <b  class="blue"> ${item.codigo}</b>: <span>${item.descripcion} </span>  
			                    </a>
			                  </li>
			                </ul>
			             `);
			           });
			        }).fail(function(error){
			            alert("Error al ejecutar la petición");
			        });
			    }else{
			      $("#resultadoCategoria").html("");
			      $('#txtidcategoria_cpc').val("")
			    }
		}else{
			 $("#resultadoCategoria").html("");
		}
 
	}
//funcion para obtener el cpc seleccionado
function obtenerCPC(des_cpc,codigo,idcpc) {
	$(".idcategoria_cpc").removeClass("bad");
	
	  $('#idcategoria_cpc').val(idcpc);
      $("#txtidcategoria_cpc").val(codigo);
      $("#resultadoCategoria").html("");
}
//funcion para traer los procedimiento por tipo de regimen
	function getProcedimiento(regimen,num) {
		if(regimen=='' ){
			
			regimen=0;
		}
		$.get("/gestionProyectoPoa/regimenProcedimiento/"+regimen, function (data) {
			
			$('.option_idprocedimiento_contratacion').prop('selected',false);  
			$("#idprocedimiento_contratacion").html(` <option value=""></option>`);
    		$("#idprocedimiento_contratacion").trigger("chosen:updated"); 
    		var pro=null;
			$.each(data, function (i, item) {
			 
				if(item.procedimiento!=null){
					console.log(item.procedimiento['descripcion']);

					if(item.procedimiento['descripcion']=='Catalogo Electronico'){
					 pro=item.procedimiento['idprocedimiento_contratacion'];
					}

					$('#idprocedimiento_contratacion').append(
						` <option class="option_idprocedimiento_contratacion"  value="${item.procedimiento['idprocedimiento_contratacion']}"> ${item.procedimiento['descripcion']} </option>`
					);
				}
				

				
			});  
			 
			if(num==1){
				if(pro){ 
					 $('.option_idprocedimiento_contratacion').prop('selected',false); 
					 $(`#idprocedimiento_contratacion option[value="${pro}"]`).prop('selected',true); 
					 $('#idprocedimiento_contratacion').prop('disabled', true).trigger("liszt:updated");
				}	

			}else{  $('#idprocedimiento_contratacion').prop('disabled', false).trigger("liszt:updated");}
			 
			$("#idprocedimiento_contratacion").trigger("chosen:updated");
		});
	}
//funcion para controlar mejor el ingreso 
	function validarControles() {

		var combo = document.getElementById("idtiporegimen");
		 idtiporegimen = document.getElementById("idtiporegimen").value;
		var tipoRegimenTxt = combo.options[combo.selectedIndex].text;

		$('.tipo_producto').removeClass("tipo_producto_seleccionado");
		$('#tipo_producto1').iCheck('disable');
		$('#tipo_producto2').iCheck('disable');
		$('#tipo_producto3').iCheck('disable');

		$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
		$('#catalogo_electronico1').iCheck('disable');
		$('#catalogo_electronico2').iCheck('disable');
		$('#catalogo_electronico3').iCheck('disable');

		if(tipoRegimenTxt=="NO APLICA" ){
			//get tipo de proceso
			  getProcedimiento(0,0);
			//tipode producto
			$('.tipo_producto').removeClass("tipo_producto_seleccionado");
			$('.tipo_producto').iCheck('disable');
    		$('#tipo_producto3').iCheck('check');
    		$('#tipo_producto3').iCheck('enable');
    		$('#tipo_producto3').addClass('tipo_producto_seleccionado');

    		// catalogo electronico
    		$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
			$('.catalogo_electronico').iCheck('disable');
    		$('#catalogo_electronico2').iCheck('check');
    		$('#catalogo_electronico2').iCheck('enable');
    		$('#catalogo_electronico2').addClass('tipo_producto_seleccionado');

		}else if(tipoRegimenTxt=="ESPECIAL"){
			//get tipo de proceso
			  getProcedimiento(idtiporegimen,0);
			//tipode producto
			$('.tipo_producto').removeClass("tipo_producto_seleccionado");
			$('.tipo_producto').iCheck('disable');
    		$('#tipo_producto3').iCheck('check');
    		$('#tipo_producto3').iCheck('enable');
    		$('#tipo_producto3').addClass('tipo_producto_seleccionado');

    		// catalogo electronico
    		$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
			$('.catalogo_electronico').iCheck('disable');
    		$('#catalogo_electronico2').iCheck('check');
    		$('#catalogo_electronico2').iCheck('enable');
    		$('#catalogo_electronico2').addClass('tipo_producto_seleccionado');
		}else if(tipoRegimenTxt=="COMUN"){
			//get tipo de proceso
			  getProcedimiento(idtiporegimen,0);

			//tipode producto
			$('.tipo_producto').removeClass("tipo_producto_seleccionado");
			$('.tipo_producto').iCheck('enable');
			$('#tipo_producto3').iCheck('disable');
    		$('#tipo_producto1').iCheck('check');
    		$('#tipo_producto1').iCheck('enable');
    		$('#tipo_producto2').iCheck('enable');
    		$('#tipo_producto1').addClass('tipo_producto_seleccionado');

    		// catalogo electronico
    		$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
			$('.catalogo_electronico').iCheck('disable');
			$('#catalogo_electronico1').iCheck('enable');
    		$('#catalogo_electronico1').iCheck('check');
    		
    		$('#catalogo_electronico2').iCheck('enable');
    		$('#catalogo_electronico1').addClass('catalogo_electronico_seleccionado');
    		
    		if($('.catalogo_electronico_seleccionado').val()=='SI'){
    			//cargar catalogos seleccionado
    			var comboId = document.getElementById("idtiporegimen").value;
    			 getProcedimiento(idtiporegimen,1);	
    			
    		}else{
    			//cargar select 
    			
    			 idtiporegimen = document.getElementById("idtiporegimen").value;
    			 getProcedimiento(idtiporegimen,0);
    		}
		}
	}
// funcion para controlar el tipo catalogo electronico
	function tipodeproducto(){

		var tipoRe=$('.tipo_producto_seleccionado').val();
		
		if(tipoRe=='NORMALIZADO'){
			$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
			$('#catalogo_electronico1').iCheck('enable');
			$('#catalogo_electronico2').iCheck('enable');
			$('#catalogo_electronico1').iCheck('check');
			$('#catalogo_electronico1').addClass('tipo_producto_seleccionado');
		}else if(tipoRe=='NO NORMALIZADO'){
			$('.catalogo_electronico').removeClass("catalogo_electronico_seleccionado");
			$('#catalogo_electronico2').iCheck('enable');
			$('#catalogo_electronico2').iCheck('check');
			$('#catalogo_electronico2').addClass('tipo_producto_seleccionado');
		}else if(tipoRe=='NO APLICA'){
			$('#catalogo_electronico1').iCheck('disable');
			$('#catalogo_electronico2').iCheck('disable');
		}
	}
//gention Cuatrimestr
 //funcion para agrear cuatrimestre al pac
	function ingresarCuatrimestre(FrmData){     
        $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
	    });

	    $.ajax({
	          url:'/gestionProyectoPoa/cuatrimestre', // Url que se envia para la solicitud
	          method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
	          dataType: 'json',
	          data: FrmData, 
	          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
	          {
	             alertEvaluacionPac(requestData.sms,requestData.estado);
	           
	          }, error:function (requestData) {
	            alertEvaluacionPac('Algo ha salido mal','error');
	            // console.log('Error no se puedo completar la acción');
	          }
	    });
	}

	//funcion para actualizar cuatrimestre al pac
	function eliminarCuatrimestre(FrmData){
       
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
		            url:'/gestionProyectoPoa/deleteCuatrimestre', 
		            method: 'POST',             
		            dataType: 'json',
		            data: FrmData, 
		            success: function(requestData)   
		            {
		                alertEvaluacionPac(requestData.sms,requestData.estado);
		               
		            }, error:function (requestData) {
		                alertEvaluacionPac('Algo ha salido mal','error');
		               
		            }
        });
	}
//funcion para traer todas los cuatrimestre de un pac
	function getCuatrimestre() {
        $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
	    });

	    $.ajax({
	          url:'/gestionProyectoPoa/cuatrimestre/'+idpac, // Url que se envia para la solicitud
	          method: 'GET',              // Tipo de solicitud que se enviará, llamado como método
	          dataType: 'json',
	       
	          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
	          {
	          		
	           		checkCuatrimestre(requestData);
	          }, error:function (requestData) {
	            alertEvaluacionPac('Algo ha salido mal ','error');
	            // console.log('Error no se puedo completar la acción');
	          }
	    });
	}

//chekear los cuatrimestre del pac
	function checkCuatrimestre(data) {
		ctrChex=1;
		$('.cuatrimestre').iCheck('uncheck');
		$.each(data['listaCuatri'], function(i, item) {
		     
			$.each(data['pac_cuat'], function(j, value) {
			    if(item.idcuatrimestre==value.idcuatrimestre){
			      ctrChex=1;
			      $(`#${item.idcuatrimestre}_name`).iCheck('check');
			       	ctrChex=1;
			     }
				
			});
		});

		ctrChex=0;
	}
//gestion para controlar los check

	$('.cuatrimestre').on('ifChecked', function(event){
		var FrmData = {
		    idcuatrimestre: $(this).val(),
		    idplan_anual_compras:idpac,
		};

		if(ctrChex==0){
			ingresarCuatrimestre(FrmData);
		}
		
		
	}); 

	$('.cuatrimestre').on('ifUnchecked', function(event){
		
		var FrmData = {
		    idcuatrimestre: $(this).val(),
		    idplan_anual_compras:idpac,
		};

		if(ctrChex==0){
			eliminarCuatrimestre(FrmData);
		}
		
	});



//funcion para las alertas y notificaciones, cuando marcamos un cuatrimestre
	function alertEvaluacionPac(msm,estado) {
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


	  // try {
	  //      coche.getMatricula();
	  // } catch(err) {
	  //     alert('El objeto coche no existe');
	  // }
//evento para informar sobre el presupuesto de la partida
$('#costo_unitario').keyup(function (e) {
	
	if(calcular==0){
		if(presupuesto<=0){
		 alertEvaluacionPac('El presupuesto para esta partida esta agotado..','error');
		 $('#costo_unitario').val("");
		 $('#costo_unitario').val("");
		}
	}
	  	
	
});
  
$('#cantidad_anual').keyup(function (e) {

	var cotoU=$('#costo_unitario').val();
	var cantidadA=$('#cantidad_anual').val();
	var total=cotoU*cantidadA;
	$('#costo_total').val(total);

	if(calcular==1){

		$.get("/gestionProyectoPoa/presupuestoPac/"+total+"/"+idproyectoPac+"/"+idpresupuesto+"/"+idpac, function (data) {
			
			var calculoPre=data.presupuestoPac-data.total;
		
			if(calculoPre<=0){
				calculoPre=0;
			}
			 $('#costo_total').attr('max',`${calculoPre.toFixed(2)}`); 
			
		});
	}
	
});

$('#costo_unitario').keyup(function (e) {
	
	var cotoU=$('#costo_unitario').val();
	var cantidadA=$('#cantidad_anual').val();
	var total=cotoU*cantidadA;
	$('#costo_total').val(total);

	if(calcular==1){
		$.get("/gestionProyectoPoa/presupuestoPac/"+total+"/"+idproyectoPac+"/"+idpresupuesto+"/"+idpac, function (data) {
			
			var calculoPre=data.presupuestoPac-data.total;
		
			if(calculoPre<=0){
				calculoPre=0;
			}
			 $('#costo_total').attr('max',`${calculoPre.toFixed(2)}`); 
			
		});
	}
	
});


