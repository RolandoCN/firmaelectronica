$('#frm_buscar').submit(function(e){
	    e.preventDefault();
        vistacargando('m','Cargando información....');
		// $('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#panelInformacion').hide();
		$('#panelEstablecimientos').hide();
	
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/establecimiento/datosContribuyente',
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				if(data['error']==true){
					$('#infoBusqueda').html('');
                    alertNotificar(data['detalle'],'error');
                    vistacargando();
                    return;
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
						cargarTablaEstablecimientos(data['establecimientos']);
						$('#btnNuevoLocal').html(`<button onclick="registrarNuevoEstablecimiento('${data['detalle']['cedula']}')"  class="btn btn-primary btn-block" type="button" ><i class="fa fa-plus-square" style="margin-right: 8px;"></i> Nuevo Local</button>`);
						$('#cedula_usuario').val(data['detalle']['cedula']);
						$('#cedula_usuario_edit').val(data['detalle']['cedula']);
						$('#panelEstablecimientos').show(200);

					
					$('#panelInformacion').show(200);
					
				}
				// $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				
                vistacargando();
				
		},
		error: function(e){
            alertNotificar('Ocurrió un error intente nuevamente','error');
            vistacargando();
            return;
	        // if (e.statusText==='timeout'){
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



$('#cedulaRuc').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});



//REIGSTRO DE LOCALES

// ================ FUNCIONES DE LA VENTANA MODAL DE REGISTRO DE ESPABLECIMIENTOS ===================

    function registrarNuevoEstablecimiento(identificacion){
    	vistacargando('M','Cargando información');
        $('#body_listaPredios').html('');
        $("#tabla_lista_predio").DataTable().destroy();
        $('#tabla_lista_predio tbody').empty();
    
    	$.get('buscarPrediosUrbanoUsuario/'+identificacion,function(data){
    		if(data['error']==true){
    			alertNotificar('Ocurrió un error intente nuevamente','error');
                vistacargando();
    			return;
    		}
            
    		if(data['detalle'].length==0){
                console.log(data['detalle'].length);
                alertNotificar('El contribuyente no tiene predios registrados','info');
    			// $('#body_listaPredios').html(`<tr><td colspan=5 ><div style="color:black; background-color:#faebcc" class="alert alert-dismissible " role="alert" >
                //                         <strong>MENSAJE!</strong> <span id="mensaje_info_edit">El contribuyente no tiene predios registrados.</span>
                //                     </div></td></tr>`);
    			vistacargando();
                return;
    		}
    		$.each(data['detalle'],function(i,item){
    			$('#body_listaPredios').append(`<tr>
	                <td>${item.fic_clave}</td>
	                <td>${item.pro_nombres}</td>
	                <td>${item.direccion}</td>
	                <td>
	                    <center>
	                        <input class="ckeck_seleccionar hidden" name="clave_catastral[]" type="checkbox" value="${item.fic_clave}">
	                        <button class="btn_seleccionar deseleccionado btn_iconlg btn btn-warning btn-sm" type="button" data-toggle="tooltip" data-placement="top" data-original-title="Seleccionar el predio para registrar un nuevo local."> <i class="fa fa-check-square-o"></i></button>                                                                                                                        
	                    </center>
	                </td>
	                <td>
	                    <a data-toggle="tooltip" data-placement="top" data-original-title="Lista de actividades permitidas y condicionadas de su sector." href="reporteAct/${item.fic_clave}' " type="button" class="btn btn-sm btn-info btn_iconlg marginB0"><i class="fa fa-download"></i></a>
	                </td>
	            </tr>`);
    		});
    			vistacargando();
            cargar_estilos_tabla('tabla_lista_predio');
            $("#modal_nuevo_establecimiento").modal();
            $('[data-toggle="tooltip"]').tooltip();

    		
    	}).fail(function(){
            vistacargando();
            alertNotificar('Ocurrió un error intente nuevamente','error');
        });
        // cargamos la informacion del predio en la modal
        // $("#info_predio_modal").html($("#panel_"+clave_catastral).html());

            // deseleccionamos el segundo paso en el wizard
            $("#a_segundo_paso").addClass("disabled");
            $("#a_segundo_paso").removeClass("done");
            // deseleccionamos todos los predios
            $(".btn_seleccionar").removeClass("btn-success");
            $(".btn_seleccionar").addClass("btn-warning");
            $(".btn_seleccionar").html(`<i class="fa fa-thumb-tack"></i>`);
            $(".btn_seleccionar").removeClass("selected");


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
        order: [[ 0, "desc" ]],
        pageLength: 5,
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


    // funcion que selecciona un predio
    $("#body_listaPredios").delegate('.btn_seleccionar','click',function(){
    	
        //quitamos la información del boton
        $(".btn_seleccionar").tooltip("hide");

        //seleccionamos el segundo paso
       

        // deseleccionamos todos los botones de los predios
        $(".btn_seleccionar").removeClass("btn-success");
        $(".btn_seleccionar").addClass("btn-warning");
        $(".btn_seleccionar").html(`<i class="fa fa-thumb-tack"></i>`);
        $(".btn_seleccionar").removeClass("selected");
        // deseleccionamos todos los checkbox que contienen las claves catastrales
        $(".ckeck_seleccionar").attr("checked",false);

        // seleccionamos el boton del predio al que le damos click
        $(this).addClass("selected");
        $(this).removeClass("btn-warning");
        $(this).addClass("btn-success");
        $(this).html(`<i class="fa fa-check-square"></i>`);

        // checkeamos el check que contiene la clave catastral del predio que se selecciona
        $(this).siblings(".ckeck_seleccionar").prop("checked",true);

        // mostramos el fromulario de registro del establecimiento
        if($("#content_regEstablec").hasClass("hidden")){
            $("#content_regEstablec").hide();
            $("#content_regEstablec").removeClass("hidden");
        }
        $("#content_regEstablec").show(200);
        // mostramos el boton para registrar
        $("#btn_registrar_establec").show();
         
    });

    // funciones para controlar el checkbox de la modal si el usuario es el responsable del local
    $('#check_es_responsable_arrendatario').on('ifChecked', function(event){ // si se checkea
        // el propietario es el responsable del establecimiento
        $("#content_agregar_responsable").show(200);
    });

    $('#check_es_responsable_arrendatario').on('ifUnchecked', function(event){ // si se deschekea
        // el propietario no es el responsable del establecimiento
        $("#content_agregar_responsable").hide(200);
    });
    

    // funcion para consultar del registro civíl los datos del responsable
    function agregar_responsable(btn){
        var cedula_arrendatario = $("#cedula_responsable").val();
        if(cedula_arrendatario==""){
            return;
        }
        // cambiamos el boton a un estado bloqueado y de busqueda
        $(btn).html('<span class="spinner-border" role="status" aria-hidden="true"></span> Buscando...');
        $(btn).attr("disabled", true);

        $.get("/establecimiento/buscarResponsable/"+cedula_arrendatario, function(request){
            if(request.error==true){
            	alertNotificar(request.message,'error');
	            $("#nombre_arrendarario").val("");
	            $("#cedula_arrendarario_agregado").val("");
	            $("#check_buscar_arrendatario").hide();
	            $(btn).html('<i class="fa fa-search"></i> Buscar');
	            $(btn).attr("disabled", false);
	            return;   
            }
            if(request.sri==true){
                $("#nombre_arrendarario").val(request.resultado[1].valor);
            }else{
                $("#nombre_arrendarario").val(request.resultado[9].valor);
            }
            // agregamos la cedula en un campo oculto para que el usuario no lo cambie al registrar
            $("#cedula_arrendarario_agregado").val(cedula_arrendatario);
            $("#check_buscar_arrendatario").show();
            // regresamos el boton a su estado normal
            $(btn).html('<i class="fa fa-search"></i> Buscar');
            $(btn).attr("disabled", false);
        }).fail(function(error){
            // regresamos el boton a su estado normal
            alertNotificar('No se pudo encontrar los datos del arrendatario','error');
            $("#nombre_arrendarario").val("");
            $("#cedula_arrendarario_agregado").val("");
            $("#check_buscar_arrendatario").hide();
            $(btn).html('<i class="fa fa-search"></i> Buscar');
            $(btn).attr("disabled", false);            
        });
    }

    //funcion que borra los datos de un responsable agregado
    // function quitar_responsable_agregado(){
    //     $("#cedula_responsable").val("");
    //     $("#cedula_arrendarario_agregado").val("");
    //     $("#nombre_arrendarario").val("");
    // }

    // función que cancela un registro de un predio
    $("#modal_cencelar_registro").click(function(){
        $("#modal_nuevo_establecimiento").modal("hide");
        limpiarVentanaModal();
    });

    function mensajePrincipal(mensaje, status){
        $("#mensaleVentanaPrincipal").show();
        $("#mensaje_alert").addClass("alert-"+status);
        $("#mensaje_info").html(mensaje);
        $('html,body').animate({scrollTop:$('#div_generar_ventana').offset().top},400);
        // setTimeout(() => {
        //     $("#mensaleVentanaPrincipal").hide();
        //     $("#mensaje_alert").removeClass("alert-"+status);
        //     $("#mensaje_info").html("");
        // }, 4000);
    }

    // esta función limpia la mayoria de los campos de la modal
    function limpiarVentanaModal(){
        $("#a_primer_paso").click();
        $("#content_regEstablec").hide();
        $("#btn_registrar_establec").hide();
        
        //limpiamos los input de la modal
        $("#nombre_establecimiento").val("");
        $("#cedula_responsable").val("");
        $("#nombre_arrendarario").val("");
        $("#cedula_arrendarario_agregado").val("");
        $("#check_buscar_arrendatario").hide();
        $("#content_agregar_responsable").hide();
        $('#check_es_responsable_propietario').iCheck('check'); // por defecto el arrendatario es el propietario
        $("#contet_general").removeClass("disabled_content") // desbloqueamos la modal 
    }


    // funcion para validar el rango de dos fechas
    function validarRangoDeFechas(fechaInicio, fechaFin){
        if (Date.parse(fechaInicio) >= Date.parse(fechaFin)){
            return false;
        }else{
            return true;
        }
    }


    // funcion para registrar en  base de datos un nuevo establecimiento
    $("#frm_registrar_establecimiento").submit(function(e){
        e.preventDefault();
        vistacargando('m','Registrando por favor espere...');
        // damos animación de carga al boton de registrar
        // $("#btn_registrar_establec").html('<span class="spinner-border" role="status" aria-hidden="true"></span> Registrando...');
        // $("#btn_registrar_establec").attr("disabled", true);
        $("#contet_general").addClass("disabled_content");// bloqueamos la modal

        //validamos las que se seleccione un predio
        var predio_selec=$(".ckeck_seleccionar:checked").length; // obtenemos el numero de predios seleccionados
        if(predio_selec!=1){return;}
        
        var frmData = new FormData(this); // obtenemos el request del formulario
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });  

        $.ajax({
            url: '/establecimiento/registrar', // Url que se envia para la solicitud
            method: 'POST',             // Tipo de solicitud que se enviará, llamado como método
            data: frmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(requestData){  // Una función a ser llamada si la solicitud tiene éxito
                if(!requestData.error){
                    $("#modal_nuevo_establecimiento").modal("hide"); // ocultamos la modal
                    limpiarVentanaModal(); // limpiamos la informacion registrada en la modal
                    alertNotificar(requestData.resultado.mensaje,requestData.resultado.status); // mostramos un el mensaje en la ventana pricipal
                    cargarTablaEstablecimientos(requestData.resultado.listaEstablecimientos); // refrescamos la tabla de los establecimientos
                }else{
                    $("#modal_nuevo_establecimiento").modal("hide"); // ocultamos la modal
                    limpiarVentanaModal(); // limpiamos la informacion registrada en la modal
                    alertNotificar(requestData.resultado.mensaje,'error'); // mostramos un el mensaje en la ventana pricipal

                    // mensajePrincipal("Error al realizar el registro.","danger");
                }
                vistacargando();
            },complete: function(requestData){
                // regresamos a la normalidad el boton de registro
                // $("#btn_registrar_establec").html('<i class="fa fa-save"></i> Registrar');
                // $("#btn_registrar_establec").attr("disabled", false);
                $("#contet_general").removeClass("disabled_content") // desbloqueamos la modal
                vistacargando();
            },error: function(error){
                $("#modal_nuevo_establecimiento").modal("hide"); // ocultamos la modal
                limpiarVentanaModal(); // limpiamos la informacion registrada en la modal
                alertNotificar('Ocurrió un error intente nuevamente','error'); // mostramos un el mensaje en la ventana pricipal
                vistacargando();
                // mensajePrincipal("Error al realizar el registro","danger");
            }
        }); 
    });

// ================ /FUNCIONES DE LA VENTANA MODAL DE REGISTRO DE ESPABLECIMIENTOS ===================
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
//     |||||||
// ============================ FUNCIONES PARA LA VENTANA PRINCIPAL ======================================

    // funcion recibe una data con todos los establecimientos del usuario y lo carga en la tabla principal
    function cargarTablaEstablecimientos(lista_establecimientos){
    	

        // vaciamos la tabla de locales registrados
        $("#tb_lista_establecimientos").html("");
 
        $("#mensajeNoEstablecimientos").show();
        $("#content_listaEstablecimientos").hide(); 
        
        $.each(lista_establecimientos, function(p, predio){
            $.each(predio, function(e,establec){
                $("#mensajeNoEstablecimientos").hide();
                $("#content_listaEstablecimientos").show(); 
                var primer_td ="";
                if(e==0){
                    primer_td=`                    
                        <td rowspan="${predio.length}">                                                                    
                            <p  class="p_line_sm"><b>Propietario: </b><span style="color:black">${establec.usuario.name}</span></p>
                            <p class="p_line_sm"><b>Clave: </b><span style="color:black">${establec.clave_catastral}</span></p>
                            <p class="p_line_sm"><b>Dirección: </b><span style="color:black">${establec.direccion}</span></p>                                                                    
                        </td>        
                    `;
                }
                // obtenemos el nombre del establecimiento en el caso de que lo tenga
                var nombreEst = "<b>: </b>"+establec.nombre;
                if(establec.nombre=="" || establec.nombre==null){ nombreEst=""; }

                // obtenemos el nombre del arrendatario del establecimiento
                var nombreArrendatario = "";
                $.each(establec.establecimiento_responsable, function(re, arrendatario){
                    nombreArrendatario =`<p style="margin-bottom: 0px;"><span style="color:white" class="badge badge-secondary">${arrendatario.nombre_arrendatario}</span></p>`;
                });

                $("#tb_lista_establecimientos").append(`
                
                        <tr role="row" class="odd">     
                            ${primer_td}
                            <td>
                                <b>${establec.tipoestablecimiento.descripcion} ${(e+1)}</b>${nombreEst}
                                ${nombreArrendatario}
                            </td>
                            <td class="paddingTR">
                                <center> 
                                    <div class="row">
                                        <button type="button" onclick="editar_establecimiento('${establec.idestablecimiento_encrypt}')" class="btn btn-sm btn-primary btn_icon" data-toggle="tooltip" data-placement="top" title="Gestionar"><i class="fa fa-gear"></i></button>
                                        <button type="button" onclick="confirmarEliminarEstablecimiento('${establec.idestablecimiento_encrypt}',this)" class="btn btn-sm btn-danger btn_icon"data-toggle="tooltip" data-placement="top" title="Eliminar"><i class="fa fa-trash"></i></button>
                                    </div>                                                             
                                </center>
                            </td>
                        </tr> 
        
                `);
            });

        });
        $("#tb_lista_establecimientos").find('button').tooltip();
        
    }    

    function confirmarEliminarEstablecimiento(idestablecimiento, btn){
    	swal({
            title: "¿Está seguro que desea eliminar el local? ",
            text: "",
            type: "warning",
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
            	eliminar_establecimiento(idestablecimiento, btn)
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
            $('#btncerrar').prop('disabled',false);
			$('#btnXcerrar').prop('disabled',false);

        });
    }
    
    // funcion para eliminar (dar de baja) un establecimiento desde la tabla de la ventana principal
    function eliminar_establecimiento(idestablecimiento, btn){
        // $(btn).tooltip("hide");
        vistacargando('m','Eliminando.....');
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // ponemos la animacion de cargando en el boton
        // $(btn).html('<span class="spinner-border" role="status" aria-hidden="true"></span>');
        // $(btn).prop('disabled',true);
        $("#div_generar_ventana").addClass("disabled_content");// bloqueamos la ventana
    
        $.ajax({
            url: '/establecimiento/registrar/'+idestablecimiento,
            type: 'DELETE',
            success: function(requestData){ 
                if(!requestData.error){
                    cargarTablaEstablecimientos(requestData.resultado.listaEstablecimientos);
                    alertNotificar(requestData.resultado.mensaje,requestData.resultado.status); 
                    vistacargando();
                }else{
                    alertNotificar(requestData.resultado.mensaje,'error'); 
                    // $(btn).html(`<i class="fa fa-trash"></i>`);
        			// $(btn).prop('disabled',false);
                    vistacargando();
                    return;
                }
            },complete: function(){
                $("#div_generar_ventana").removeClass("disabled_content");// desbloqueamos la ventana
                vistacargando();
            }
        }).fail(function(){
            $("#div_generar_ventana").removeClass("disabled_content");// desbloqueamos la ventana
            alertNotificar('Ocurrió un error intente nuevamente');
            vistacargando();

            // $(btn).html(`<i class="fa fa-trash"></i>`);
        	// $(btn).prop('disabled',false);
        });
    }

    // la funcion recive el id del div donde se quier cargar el mensaje
    function mensajeCarga(contenedor,mensaje){
        $(`#${contenedor}`).html(`
        <div class="panel panel-success">
            <div class="panel-heading">                    
                <div class="row">
                    <blockquote class="blockquote text-center">
                        <div class="d-flex justify-content-center">
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <p class="text-center">
                            <strong>
                            ${mensaje}
                            </strong>
                        </p>                
                    </blockquote>			                           
                </div>                    
            </div>
        </div>
        `);
    }


// ============== FUNCIONES EDITAR LA INFORMACION SOBRE LOS ESTABLECIMIENTOS REGISTRADOS =================


    // FUNCIÓN PARA ABRIR LA MODAL PARA EDITAR UN ESTABLECIMIENTO
    function editar_establecimiento(idestablecimiento){ 
        
        limpiarModalEditarEstablecimiento(); // primero que todo limpiamos la modal
        $("#btn_nuevoArrendatario").show();
        $("#modal_editar_establecimiento").modal();
        $("#body_modal_editar").hide();
        mensajeCarga("mensajeCarga_edit","Obteniendo Información...");

        $.get(`/establecimiento/registrar/${idestablecimiento}/edit`, function(request){
            console.clear();
            $("#nombre_establecimiento_edit").val(request.resultado.nombre); // cargamos el conbre del departamento
            // cargamos la funcion en el parametro onblur con el id de establecimiento            
            $("#nombre_establecimiento_edit").attr("onblur",`actualizarNombreEstablecimiento('${request.resultado.idestablecimiento_encrypt}')`);
            // cargamos la funcion en el en evento change al cambiar de tipo de establecimiento
            $('#cmb_tipoEstablecimiento_edit').attr("onchange",`actualizarNombreEstablecimiento('${request.resultado.idestablecimiento_encrypt}')`);
            // seleccionamos el tipo de establecimiento en el combo
            $('.option_tipoEsta').prop("selected",false);
            $('#tipoEsta_'+request.resultado.idtipoEstablecimiento).prop("selected",true);
            // cargamos el id encryptado del establecimiento que estamos editando
            $("#input_idestablecimiento_edit").val(request.resultado.idestablecimiento_encrypt);
            // abilitamos el boton de agregar responsable
            $("#btn_nuevoArrendatario").prop("disabled",false);
            // abilitamos el contenido de la modal
            $("#body_modal_editar").show(200);

            //cargamos los datos del predio
            $("#td_predio_clave").html(request.resultado.clave_catastral);
            $("#td_predio_propietario").html(request.resultado.usuario.name);
            $("#td_predio_direccion").html(request.resultado.direccion);
        
            $.each(request.resultado.establecimiento_responsable, function(index, responsable){
                mostrarTablaResponsable(responsable);
            });
            $("#mensajeCarga_edit").html(""); // quitamos el mensaje de carga
        });
        
    }




    // funcion para cargar mostrar los datos del responsable en la modal de edición de establecimiento
    function mostrarTablaResponsable(responsable){
        $("#content_tabla_responsable").show();
        $("#tb_datos_responsable").html(`
            <tr>
                <th scope="row">${responsable.nombre_arrendatario}</th>
                <td>${responsable.cedula_arrendatario}</td>
                <td>${responsable.fecha_inicio}</td>
                <td class="td_sm">
                    <center>
                        <button class="btn btn-warning btn-sm" onclick="confirmarDardeBajaResponsable('${responsable.idestablecimiento_responsable_encrypt}',this)" type="button"><i class="fa fa-thumbs-down"></i> Dar de baja</button>
                    </center>
                </td>
            </tr>   
        `);
    }



     function confirmarDardeBajaResponsable(idresponsable, btn){
     	$('#modal_editar_establecimiento').addClass('disabled_content');
    	swal({
            title: "¿Está seguro que desea dar de baja al responsable del local? ",
            text: "",
            type: "warning",
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
            	darDeBajaResponsable(idresponsable, btn)
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
            $('#btncerrar').prop('disabled',false);
			$('#btnXcerrar').prop('disabled',false);
			$('#modal_editar_establecimiento').removeClass('disabled_content');
        });
    }

    // función para dar de baja a un responsable de un establecimiento
    function darDeBajaResponsable(idresponsable,btn){
        $(btn).prop("disabled",true);
        $(btn).html('<span class="spinner-border" role="status" aria-hidden="true"></span> Espere...');

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        $.ajax({
            url: '/establecimiento/responsable/'+idresponsable,
            type: 'DELETE',
            success: function(requestData){ 
                if(!requestData.error){
                    $("#content_tabla_responsable").hide(200);
                	cargarTablaEstablecimientos(requestData.resultado.listaEstablecimientos); // refrescamos la tabla de los establecimientos                    
                    alertNotificar(requestData.resultado.mensaje, requestData.resultado.status);
                	
                }else{
                	$(btn).html(`<i class="fa fa-thumbs-down"></i> Dar de baja`);
                    alertNotificar(requestData.resultado.mensaje, requestData.resultado.status);
                    $(btn).prop("disabled",false);
                }
            },error: function(){
                // si ocurre un error regresamos el boton a la normalidad
                $(btn).prop("disabled",false);
                $(btn).html('<i class="fa fa-thumbs-down"></i> Dar de baja');
                alertNotificar('Ocurrió un error intente nuevamente','error');
                $(btn).html(`<i class="fa fa-thumbs-down"></i> Dar de baja`);
                $(btn).prop("disabled",false);


            }
        });
    }




    // esta funcion solo actualiza el nombre de un establecimiento 
    function actualizarNombreEstablecimiento(idestablecimiento){
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        $.ajax({
            url: '/establecimiento/registrar/'+idestablecimiento,
            type: 'PUT',
            data:{
                nombre_establecimiento: $('#nombre_establecimiento_edit').val(),
                tipoEstablecimiento: $('#cmb_tipoEstablecimiento_edit').val()
            },
            success: function(request) {
                cargarTablaEstablecimientos(request.resultado.listaEstablecimientos);
            }
        });
    }
   



    // funcion que muetra el formulario para agregar un nuevo arrendatario
    $("#btn_nuevoArrendatario").click(function(){

        $("#content_agregar_responsable_edit").show(200);
        $(this).hide(200);   

    });

    //funcion para ocultar el formulario de nuevo arrengadario

    $("#btn_cancelarArrendatario").click(function(){

        $("#content_agregar_responsable_edit").hide(200);
        $("#btn_nuevoArrendatario").show(200);
        //limpiamos la informacion escrita en el formulario de registro de responsable
        $("#cedula_responsable_edit").val("");
        $("#cedula_arrendarario_agregado_edit").val("");
        $("#nombre_arrendarario_edit").val("");
        $("#check_buscar_arrendatario_edit").hide();

        //ocultamos los mensajes de la modal
        $("#mensaleVentana_edit").hide();
        $("#mensajeNoEncontrado_edit").hide();

    });






    // funtio que realiza la busqueda o validacion de la cedula del arrendatario que se desea agregar
    function agregar_responsable_edit(btn){
        var cedula_arrendatario = $("#cedula_responsable_edit").val();
        if(cedula_arrendatario==""){
            return;
        }
        // cambiamos el boton a un estado bloqueado y de busqueda
        $(btn).html('<span class="spinner-border" role="status" aria-hidden="true"></span> Buscando...');
        $(btn).attr("disabled", true);
        //ocultamos el mensaje de error en el caso que este visible
       

        $.get("/establecimiento/buscarResponsable/"+cedula_arrendatario, function(request){
        	if(request.error==true){
              alertNotificar(request.message,'error');
              $("#nombre_arrendarario_edit").val("");
              $("#check_buscar_arrendatario_edit").hide();
               $("#cedula_arrendarario_agregado_edit").val("");
              $(btn).html('<i class="fa fa-search"></i> Buscar');
              $(btn).attr("disabled", false);    
              return;
        	}

            if(request.sri==true){
                $("#nombre_arrendarario_edit").val(request.resultado[1].valor);
            }else{
                $("#nombre_arrendarario_edit").val(request.resultado[9].valor);
            }
            $("#check_buscar_arrendatario_edit").show();
            // agregamos la cedula en un campo oculto para que el usuario no lo cambie al registrar
            $("#cedula_arrendarario_agregado_edit").val(cedula_arrendatario);
            // regresamos el boton a su estado normal
            $(btn).html('<i class="fa fa-search"></i> Buscar');
            $(btn).attr("disabled", false);
        }).fail(function(error){
            // regresamos el boton a su estado normal
            // $("#mensajeNoEncontrado_edit").show(200);
            alertNotificar('Ocurrió un error intente nuevamente','error');
            $("#nombre_arrendarario_edit").val("");
            $("#check_buscar_arrendatario_edit").hide();
            $("#cedula_arrendarario_agregado_edit").val("");
           
            $(btn).html('<i class="fa fa-search"></i> Buscar');
            $(btn).attr("disabled", false);            
        });
    }



    // funcion o evento submit para registrar un nuevo arrengatario desde la modal de edición de establecimiento
    $("#frm_registrar_responsable_edit").submit(function(e){

        e.preventDefault(); // evitamos que el evento se ejecute

        // PRIMERO REALIZAMOS LAS VALIDACIONES
        // si no se a seleccionado una persona no se puede registrar
        if($("#cedula_arrendarario_agregado_edit").val()==""){
            alertNotificar("Tiene que buscar el responsable","warning");
            return;
        }

        //BLOQUEAMOS EL BOTON DE GUARDAR RESPONSABLE Y CANCELAR
        $("#btn_nuevoArrendatario").prop("disabled",true);
        // $("#btn_guardarNuevoResponsable").prop("disabled",true);
        // $("#btn_guardarNuevoResponsable").html('<span class="spinner-border" role="status" aria-hidden="true"></span> Guardando...');
        
        vistacargando('m','Por favor espere...');
        var frmData = new FormData(this); // obtenemos el request del formulario
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        }); 

        $.ajax({
            url: '/establecimiento/responsable', // Url que se envia para la solicitud
            method: 'POST',             // Tipo de solicitud que se enviará, llamado como método
            data: frmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(requestData){  // Una función a ser llamada si la solicitud tiene éxito
                console.log(requestData)
                if(!requestData.error){
                    $("#btn_cancelarArrendatario").click(); // cerramos el formulario de registro de responsable
                    alertNotificar(requestData.resultado.mensaje, requestData.resultado.status);
                    // mensajeModal_edit(requestData.resultado.mensaje, requestData.resultado.status);
                    mostrarTablaResponsable(requestData.resultado.responsable_nuevo); // refrescamos la tabla de responsable
                    cargarTablaEstablecimientos(requestData.resultado.listaEstablecimientos); // refrescamos la tabla de los establecimientos    
                    vistacargando();                
                }else{
                    alertNotificar(requestData.resultado.mensaje, requestData.resultado.status);
                    vistacargando();                

                    // mensajeModal_edit(requestData.resultado.mensaje, requestData.resultado.status);
                }
            },complete: function(requestData){
                //DESBLOQUEAMOS EL BOTON DE GUARDAR RESPONSABLE Y CANCELAR
                $("#btn_nuevoArrendatario").prop("disabled",false);
                // $("#btn_guardarNuevoResponsable").prop("disabled",false);
                // $("#btn_guardarNuevoResponsable").html('<i class="fa fa-save"></i> Guardar Responsable');        
                vistacargando();                
            },error: function(error){
                alertNotificar("Ocurrió un error intente nuevamente", "error");
                vistacargando();                

            }
        });


        
    });




    // función reinicia las etiquetas de la modal de edicion de establecimiento
    function limpiarModalEditarEstablecimiento(){
        $("#nombre_establecimiento_edit").val(""); // limpiamos el nombre del establecimiento
        $("#tb_datos_responsable").html("");  // limpiamos la tabla de responsables
        $("#content_tabla_responsable").hide(); // ocultamos dicha tabla
        $("#content_agregar_responsable_edit").hide(); // ocultamos el formulario de registrar nuevo responsable
        
        //limpiamos la informacion escrita en el formulario de registro de responsable
        $("#cedula_responsable_edit").val("");
        $("#cedula_arrendarario_agregado_edit").val("");
        $("#nombre_arrendarario_edit").val("");
        $("#check_buscar_arrendatario_edit").hide();

        //bloqueamos el boton de agregar nuevo propietario
        $("#btn_nuevoArrendatario").prop("disabled",true);

        // regresamos a la normalidad los botones de agregar nuevo responsable
        $("#content_agregar_responsable_edit").hide(200);

        // limpiamos el id del establecimiento que estamos editando
        $("#input_idestablecimiento_edit").val("");

        //ocultamos los mensajes de la modal
        $("#mensaleVentana_edit").hide();
        $("#mensajeNoEncontrado_edit").hide();
    }




    // funcion para mostrar un mensaje en la modal de edicion de establecimiento
    function mensajeModal_edit(mensaje, status){
        $("#mensaleVentana_edit").show(200);
        $("#mensaje_alert_edit").addClass("alert-"+status);
        $("#mensaje_info_edit").html(mensaje);
        setTimeout(() => {
            $("#mensaleVentana_edit").hide(200);
            $("#mensaje_alert_edit").removeClass("alert-"+status);
            $("#mensaje_info_edit").html("");
        }, 6000);
    }


    $("#frm_registrar_responsable_edit").keypress(function(e) {
        if (e.which == 13) {
        	$('#btnEditAddRes').click();
            return false;
        }
    });

    $("#frm_registrar_establecimiento").keypress(function(e) {
        if (e.which == 13) {
        	$('#btnAddRes').click();
            return false;
        }
    });





// ============== FUNCIONES PARA EDITAR LA INFORMACION SOBRE LOS ESTABLECIMIENTOS REGISTRADOS =================


