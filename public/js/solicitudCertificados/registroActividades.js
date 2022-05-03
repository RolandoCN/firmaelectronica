$('#frm_buscar').submit(function(e){
	    e.preventDefault();
		vistacargando('m','Cargando información..');
		// $('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#panelInformacion').hide();
		$('#panelEstablecimientos').hide();
		$('#panelEstablecimientosAtc').hide();

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/establecimiento/datosContribuyenteAtc',
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				
				if(data['error']==true){
					// $('#infoBusqueda').html('');
		    		// $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		            //         <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		            //         </button>
		            //         <strong>¡Atención!</strong> ${data['detalle']}
		            //       </div>`);
		    		// $('#infoBusqueda').show(200);
					alertNotificar(data['detalle'], "error");
					vistacargando();
					return;
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

                    `);
					cargartableLocales(data['listaLocales'],$('#cedula').val());
					// $('#btnNuevoLocal').html(`<button onclick="registrarNuevoEstablecimiento(${data['detalle']['cedula']})"  class="btn btn-primary btn-block" type="button" ><i class="fa fa-plus-square" style="margin-right: 8px;"></i> Nuevo Local</button>`);
					// $('#cedula_usuario').val(data['detalle']['cedula']);
					// $('#cedula_usuario_edit').val(data['detalle']['cedula']);
					// $('#panelEstablecimientos').show(200);
					$('#panelEstablecimientosAtc').show(200);
					$('#panelInformacion').show(200);
				}
				// $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				vistacargando();

				
		},
		error: function(e){
			alertNotificar('Ocurrió un error intente nuevamente','error');
			vistacargando();
	        // if (statusText==='timeout'){
	        //   $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			//     //MOSTRAR INFORMACION DE BUSQUEDAS
			//     $('#infoBusqueda').html('');
	    	// 	$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	        //             <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	        //             </button>
	        //             <strong>¡Atención!</strong> Tiempo de espera agotado intente nuevamente.
	        //           </div>`);
	    	// 	$('#infoBusqueda').show(200);
	    	// 	setTimeout(function() {
	  	 	// 	$('#infoBusqueda').hide(200);
	  	 	// 	},  3000);
			// 	return;
	        // }
	        // else{
	        //    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			//     //MOSTRAR INFORMACION DE BUSQUEDAS
			//     $('#infoBusqueda').html('');
	    	// 	$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	        //             <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	        //             </button>
	        //             <strong>¡Atención!</strong> Ocurrió un error intente nuevamente.
	        //           </div>`);
	    	// 	$('#infoBusqueda').show(200);
	    	// 	setTimeout(function() {
	  	 	// 	$('#infoBusqueda').hide(200);
	  	 	// 	},  3000);
			// 	return;
	        // }
	    }
	});
});


function cargartableLocales(data,cedula){
	$('#tb_listaLocalesBody').html('');
	$("#TablaEstablecimientosAtc").DataTable().destroy();
    $('#TablaEstablecimientosAtc tbody').empty();

    if(data['detalle'].length==0){
		$('#tb_listaLocalesBody').html(`<tr><td colspan=4><div style="color:black; background-color:#faebcc" class="alert alert-dismissible " role="alert" >
                                        <strong>MENSAJE!</strong> <span id="mensaje_info_edit">El contribuyente no tiene locales registrados clic <a href="registraR/${cedula}">Aquí</a>.</span>
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
	                           <div  style="display:none;"  id="${item['idestablecimiento_responsable']}_TD" class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
	                                <span class="sr-only">Loading...</span>
	                            </div>
	                        	<div id="idactividad_${item['idestablecimiento_responsable']}"
	                        </td>
	                        <td style="text-align: center; vertical-align: middle;"   class="paddingTR">
	                            <center>
	                                <button data-toggle="tooltip" data-placement="top" data-original-title="Asignar actividades a su establecimiento." type="button" class="btn btn-sm btn-success marginB0" onclick="ModalActividad('${item['establecimiento']['clave_catastral']}','${item['idestablecimiento_responsable_encrypt']}','${item['idestablecimiento_responsable']}','${item['establecimiento']['nombre']}','${item['establecimiento']['direccion']}','${item['nombreComercial']}','${item['area']}','${item['aforo']}')"><i class="fa fa-plus"></i> Agregar</button>
	                                <a data-toggle="tooltip" data-placement="top" data-original-title="Lista de actividades permitidas y condicionadas de su sector." href="/establecimiento/reporteAct/${item['establecimiento']['clave_catastral']}" type="button" class="btn btn-sm btn-warning marginB0"><i class="fa fa-download"></i> Descargar</a>
	                            </center>
	                         
	                        </td>
	                    </tr>  `);

    	
	    	$.each(item['establecimiento_actividades'], function(i, itemAct){
	    		$(`#idactividad_${item['idestablecimiento_responsable']}`).append(`<p><span style="color: green" class="fa fa-asterisk"></span>  ${itemAct['actividades']['Descripcion']}</p>`);
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



//FUNCION PARA ABRIR EL MODAL DE ACTIVIDADES PARA LA SOLICITUD DE CERTIFICADO DE USO DE SUELO
function ModalActividad(clave_C,idEstablecimiento,idEsAct,nombre,direccion,nombreComercial,area,aforo){
	$('#InforEstablecimiento').html(`<b><span class="fa fa-bank"></span> ${nombre}</b> | ${direccion}`);
	$("#cargando").show();
	$('#actividadesC').html('');
	$('#input_buscar_activ').val('');
	$('#idEstablecimiento').val(idEstablecimiento);
	$('#establecimiento').val('');
	$('#nombreComercial').val('');
	$('#area').val('');
	$('#aforo').val('');
	$('#clavecatastral').val(clave_C);
	$('#idEstablecimiento_Actividad').val(idEsAct); //ID ESTABLECIMIENTO PARA CREAR LOS ID DE LOS TD SIN ECNRYPTAR
	// cargamos la funcion en el parametro onblur con el id de establecimientoresponsable           
    $("#nombreComercial").attr("onblur",`actualizarNombreComercial('${idEstablecimiento}')`);
    $("#area").attr("onblur",`actualizarNombreComercial('${idEstablecimiento}')`);
    $("#aforo").attr("onblur",`actualizarNombreComercial('${idEstablecimiento}')`);
	$.get('/establecimiento/actividadadesClaveC/'+clave_C+'/'+idEstablecimiento, function(data){ 
		$('#nombreComercial').val(data['establecimiento']['nombreComercial']);
		$('#area').val(data['establecimiento']['area']);
		$('#aforo').val(data['establecimiento']['aforo']);
	    var color;
		var check;
		if(data.error==true){
			$('#actividadesC').append(`<div align="center" class="alert alert-warning" role="alert">
										  <b>${data.Mensaje}</b>
										</div>`);
			$("#cargando").hide();	
			$('#'+idEsAct+'_TD').remove();
			return;
		}



		if(data['Actividades'] != null ){

			// $('#idsector').val(data['Actividades'].sector.idsectorencrypt);
			$.each(data['Actividades'],function(i,item){	
			
				// if(item['Descripcion'] == "Prohibido"){
				// 	var prohibido="prohibited";
				// }else{
				// 	var prohibido="";
				// }
				aux=false;
				//ACTIVIDADES QUE ESTAN SELECCIONADAS

				$.each(data['ActividadesEsta'],function(i,itemEstablecimiento){
					if(item.idactividades==itemEstablecimiento.idactividades){
						aux=true;
					}
				});

				if(aux==true){
					color='#d4edda';
					check='checked';
				}else{
					color='#f3f3f3';
					check='';
				}

				var detalle_actividad = "";
				if(item.Detalle!=null){
					detalle_actividad= 	`<label for="${item.idactividades+'_Actividad'}" style="margin:0px 0px 0px 25px; font-weight: 100; font-size: 11px; color: #3e3e3e; display: block;">${item.Detalle}</label>`;
				}

				$('#actividadesC').append(`<li data-id="${item.Descripcion} ${item.Detalle}" id="${item.idactividades+'_lista'}" style="background:${color}; margin-right:10px;">
												<p>
													<span style="float:left; margin-right:5px;">
														<input id="${item.idactividades+'_Actividad'}" name="${item.idactividades}"   ${check} name="chekActividad[]"  type="checkbox" value="${item.idactividades}" class="flat"> 
													</span>
													<label for="${item.idactividades+'_Actividad'}" style="margin: 0px; display: contents; float:right;">${item.Descripcion}</label><br>												
													${detalle_actividad}												
												</p>
											</li>`);
		          
				// $(`#${item.idactividades}_Actividad`).iCheck({
				//                 checkboxClass: 'icheckbox_flat-green',
				//                 radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
				//           });
			});	
		}else{
			$('#actividadesC').append(`<div align="center" class="alert alert-warning" role="alert">
										  <b>No se encuentran actividades disponibles para su sector por favor comuniquese a enlinea@chone.gob.ec</b>
										</div>`);
			
		}
		$('#actividadesC').find('input').iCheck({
		                checkboxClass: 'icheckbox_flat-green',
		                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
		});
		$("#cargando").hide();	
	});
	$('#modal_ActividadesUsoSuelo').modal();

}
 
$("#actividadesC").delegate("input", "ifChecked", function(e){
		GuardarActividadestablecimiento($(this),'AG');
});

$("#actividadesC").delegate("input", "ifUnchecked", function(e){
//     //SI NO ESTA CHEKEADO LO ELIMINA
//     var valor = $(this).val();
		GuardarActividadestablecimiento($(this),'DEL');

});

//GUARDAR LAS ACTIVIDADES EN LOS ESTABLECIMIENTOS
function GuardarActividadestablecimiento(idActividad,estado){
	var result=0;
	var FrmData = {
		'idactividades' : idActividad.val(),
        "idEstablecimientoResponsable" : $('#idEstablecimiento').val(),
        'estado' : estado,
        'clavecatastral': $('#clavecatastral').val(),
	}
	
	$.ajaxSetup({
			headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
	});
	$.ajax({
			url: '/establecimiento/registroAct', 
			method: "POST", 
			data: FrmData,               
			success: function (data)   
			{

				if(data['error']==false){
		
					 $('.'+idActividad.attr('name')+'_Lista').prop('style','background-color:red');
					 
				}else{

					$('#infoProhibited').html('');
		    		$('#infoProhibited').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['Mensaje']}.
		                  </div>`);
		    		$('#infoProhibited').show(200);
		    		setTimeout(function() {
		  	 			$('#infoProhibited').hide(200);
					},  5000);
					
					if(estado=="DEL"){//si se intenta eliminar se vuelve a chequear
						$('#'+idActividad.attr('id')).prop('checked',true);
						$('#'+idActividad.attr('id')).iCheck('destroy');
						$('#'+idActividad.attr('id')).iCheck({
							checkboxClass: 'icheckbox_flat-green',
							radioClass: 'iradio_flat-green'
						});
						return;
					}

		  	 		// $('#'+idActividad+'_Actividad').prop('checked',false);
		  	 			$('#'+idActividad.attr('id')).prop('checked',false);
			    			$('#'+idActividad.attr('id')).iCheck('destroy');
				    		$('#'+idActividad.attr('id')).iCheck({
				                checkboxClass: 'icheckbox_flat-green',
				                radioClass: 'iradio_flat-green' 
				            });
							    		

				}
				
			}
	});

}

//PARA CARGAR LAS ACTIVIDADES EN EL TD DE LA TABLA DEL ESTABLECIMIENTO
function ActividadesIdEstablecimiento(){


	$('#'+$('#idEstablecimiento_Actividad').val()+'_TD').show();
	$.get('/establecimiento/actividadesPorEstablecimiento/'+$('#idEstablecimiento').val(), function(data){
		if(data.length ==0){
			$('#'+$('#idEstablecimiento_Actividad').val()+'_Actividad').html('');
			$('#'+$('#idEstablecimiento_Actividad').val()+'_Actividad').append(`<div style="display:none;"  id="${$('#idEstablecimiento_Actividad').val()+'_TD'}" class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                                                            <span class="sr-only">Loading...</span>
                                                        </div>`);
		}else{
			$('#'+data[0].idestablecimiento_responsable+'_Actividad').html('');
			$('#'+data[0].idestablecimiento_responsable+'_Actividad').append(`<div style="display:none;"  id="${data[0].idestablecimiento_responsable+'_TD'}" class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                                                            <span class="sr-only">Loading...</span>
                                                        </div>`);
			
			$.each(data,function(i,item){
				$('#'+item.idestablecimiento_responsable+'_Actividad').append(`
					<p><span style="color:green" class="fa fa-asterisk"></span>  ${item['actividades'].Descripcion}</p>`);
			});
		}
	});
}

// esta funcion solo actualiza el nombre comercial de un establecimiento 
function actualizarNombreComercial(idestablecimientoResponsable,input){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    var data='';
    var value='';
    var nombreComercial;
    var area;
    var aforo;
	// if(input=='NC'){
	// 	nombreComercial=$('#nombreComercial').val();
	// }else if(input=='AR'){
	// 	area=$('#area').val()
	// }else if(input == 'AF'){
	// 	aforo=$('#aforo').val()
	// }
    $.ajax({
        url: '/establecimiento/responsable/'+idestablecimientoResponsable,
        type: 'PUT',
        data:{
            nombreComercial: $('#nombreComercial').val(),
            area:$('#area').val(),
            aforo:$('#aforo').val()
        },
        success: function(request) {
        	console.log(request);
        	if(request['validator']==true){
        		$('#mensajeError').html('');
	    		$('#mensajeError').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Verifique los datos ingresados, no cumplen con el formato requerido.
	                  </div>`);
	    		$('#mensajeError').show(200);
	    		setTimeout(function() {
	  	 		$('#mensajeError').hide(200);
	  	 		},  3000);
	  	 		return;
        	}

        	var nombreComercial='';
        	var areaE='';
        	var aforoE='';

        	if(request['resultado']['establecimiento']['nombreComercial']!=null){
        		nombreComercial=request['resultado']['establecimiento']['nombreComercial'];
        	}
        	if(request['resultado']['establecimiento']['area']!=null){
        		areaE=request['resultado']['establecimiento']['area']+' metros cuadrados';
        	}
        	if(request['resultado']['establecimiento']['aforo']!=null){
        		aforoE=request['resultado']['establecimiento']['aforo'];
        	}
        	$('#'+request['resultado']['establecimientoResponsable']+'_Comercial').html('');
            $('#'+request['resultado']['establecimientoResponsable']+'_Comercial').html(`<b>Nombre comercial:</b> ${nombreComercial}<br>
            																			<b>Área: </b>${areaE} <br>
            																			<b>Aforo:</b> ${aforoE}`);
        },
        error:function(){
        	    $('#mensajeError').html('');
	    		$('#mensajeError').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Ocurrió un error inténtelo más tarde.
	                  </div>`);
	    		$('#mensajeError').show(200);
	    		setTimeout(function() {
	  	 		$('#mensajeError').hide(200);
	  	 		},  3000);
	  	 		return;
        }
    });
}
   
// FUNCION PARA FILTRAR LAS ACTIVIDADES EN LA VENTANA MODAL
$('#input_buscar_activ').keyup(function(){
	$('#actividadesC li').each(function(i, li){
		var actividad = $(li).attr("data-id").toUpperCase();
		var busqueda = $('#input_buscar_activ').val().toUpperCase();
        if(actividad.indexOf(busqueda)>-1){
            $(li).show();
        }else{
            $(li).hide();
        }
	});
});






