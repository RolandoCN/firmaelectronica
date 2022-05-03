$('#frm_buscar').submit(function(e){
        e.preventDefault();
        $('#lista_doc').html('');
		$('#divbtnbuscar').html(`<button id="btnBuscars" disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#panelbotonesEmisiones').hide();
        $('#panelEmisiones').hide();
        $('#correoContribuyente').val('');
        $('#cedulacontribuyente').val('');
        $('#infoBusqueda').hide();
        $("#contet_emisiones_selec").html('');
		reseterarBtnSeleccion();

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/emisiones/emisionesLista',
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				
				if(data['error']==true){
					alertNotificar(data['detalle'], "error");
					
				}
				if(data['error']==false){
					if(data['detalle'].length>0){
                        if(data['detalle'][0]['gen01email']!=null){
                            $('#correoContribuyente').val(data['detalle'][0]['gen01email']);
                        }
                        cargartableemisiones(data);
                        $('#cedulacontribuyente').val(data['cedula']);
						$('#panelEmisiones').show(200); 
						$('#panelbotonesEmisiones').show(200);
					}else{
						alertNotificar('No existen emisiones para el contribuyente','info');
					}

				}

				$('#divbtnbuscar').html(`<button id="btnBuscars"  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				

				
		},
		error: function(e){
           $('#divbtnbuscar').html(`<button  id="btnBuscars" type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
		    //MOSTRAR INFORMACION DE BUSQUEDAS
		    // $('#infoBusqueda').html('');
    		// $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
      //               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
      //               </button>
      //               <strong>¡Atención!</strong> Ocurrió un error intente nuevamente.
      //             </div>`);
    		// $('#infoBusqueda').show(200);
    		// setTimeout(function() {
  	 		// $('#infoBusqueda').hide(200);
  	 		// },  3000);
  	 		alertNotificar('Ocurrió un error intente nuevamente', "error");
			return;
	    }
	});
});

function cargartableemisiones(data){
	$('#tb_listaEmisionesBody').html('');
	$("#TablaEmisiones").DataTable().destroy();
    $('#TablaEmisiones tbody').empty();
    contadorGenerado=0;
    $.each(data['detalle'], function(i, item){
    	if(item['generado']=='true'){
            contadorGenerado++;
    		var generado=`<td style=" text-align:center; vertical-align: middle;"  class="paddingTR">
	                        	<span style="color: #fff;  background-color: #28a745;" class="badge badge-success">${item['fechageneracion']}</span><br>
                                <div style="padding-top:10px"></div>
                                <a  type="button" onClick="verpdf('${item['nombredoc']}')" class="btn btn-info btn-xs"> <span class="fa fa-eye"></span> Ver</a>

                            </td>`;
            $('#lista_doc').append(`<input type="hidden" name="input_lista_doc[]" value='${item['nombredoc']}'>`);
    	}else{
    		var generado=`<td style=" text-align:center; vertical-align: middle;"  class="paddingTR">
	                        	<span class="badge badge-warning">No generado</span>
                            </td>`;

        }
        var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['recargo']))-parseFloat(item['descuento']);
    	$('#tb_listaEmisionesBody').append(`<tr role="row" class="odd">
	                        <td  width="1%" colspan="1">
	                            ${i+1}
	                        </td>
	                        <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            <input data-id="${item['emi01codi']}" id="cod_${item['emi01codi']}" value="${item['emi01codi']}" name="cod_emision[]"  style="width:20px;height:20px;;cursor: pointer;" type="checkbox">
	                        </td>
	                       <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
	                        	${item['emi01codi']}
	                        </td>
	                        <td style=" vertical-align: middle;"  class="paddingTR">
	                            ${item['nombre']}
	                        </td>
	                        <td style=" vertical-align: middle; "  class="paddingTR">
	                            ${item['impuesto']}
	                        </td>
	                        <td style="vertical-align: middle; text-align:center"  class="paddingTR">
	                        	${item['anio']} - ${item['mes']}
	                        </td>
	                        <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
	                            $${parseFloat(total).toFixed(2)}
	                        </td>
	                        ${generado}
	                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
	                        	<center>
                                    <button type="button" class="btn btn-sm btn-warning marginB0" onClick="detalleEmision(${item['valor']},${item['iva']},${item['coactiva']},${item['descuento']},${item['interes']},${item['recargo']})">
                                            <i class="fa fa-eye" >
                                                
                                            </i> Ver
                                        </button>
                                </center>
	                        </td>
	                        
	                    </tr>  `);
                    $(`#cod_${item['emi01codi']}`).click(function(){
                          if($(`#cod_${item['emi01codi']}`).prop('checked')){
                             $("#contet_emisiones_selec").append(`<input id="input_${item['emi01codi']}" type="hidden" name="list_cod_emisiones[]" value="${item['emi01codi']}">`);
                          }else{
                            $(`#input_${item['emi01codi']}`).remove();
                          }
                    });


    });
    if(contadorGenerado>0){
        $('#btnDesacargarReporte').css('display','block');
    }else{
        $('#btnDesacargarReporte').css('display','none');
    }
    cargar_estilos_tabla("TablaEmisiones",10);
   

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


function cargar_estilos_tabla(idtabla,pageLength){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "asc" ]],
        pageLength: pageLength,
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


function detalleEmision(subtotal,iva,coactiva,descuento,interes,recargo){
    $('#bodydetalle').html(`<tr align="center">
                                <td>
                        			$${parseFloat(subtotal).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(iva).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(coactiva).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(descuento).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(interes).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(recargo).toFixed(2)}
                        		</td>
                        	</tr>`);
	$('#modalDetalle').modal();

}

function seleccionarTodos(){
  cargar_estilos_tabla('TablaEmisiones',-1);
	var inputs=$('#tb_listaEmisionesBody').find('input');
	$.each(inputs,function(i,item){
    $("#contet_emisiones_selec").append(`<input id="input_${item.attributes[0].value}" type="hidden" name="list_cod_emisiones[]" value="${item.attributes[0].value}">`);
		$(`#${item.id}`).prop('checked',true);
	})
	$('#btnSeleccionar').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
	$('#btnSeleccionar').removeClass('btn-default');
	$('#btnSeleccionar').addClass('btn-danger');
	$('#btnSeleccionar').attr('onClick','deseleccionarTodos()');
  // cargar_estilos_tabla('TablaEmisiones',10);
}



function deseleccionarTodos(){
  cargar_estilos_tabla('TablaEmisiones',-1);
	var inputs=$('#tb_listaEmisionesBody').find('input');
  $("#contet_emisiones_selec").html('');
	$.each(inputs,function(i,item){
		$(`#${item.id}`).prop('checked',false);
	})
	reseterarBtnSeleccion();
  cargar_estilos_tabla('TablaEmisiones',10);

}

function reseterarBtnSeleccion(){
	$('#btnSeleccionar').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
	$('#btnSeleccionar').removeClass('btn-danger');
	$('#btnSeleccionar').addClass('btn-default');
	$('#btnSeleccionar').attr('onClick','seleccionarTodos()');
}

function firmarFacsimil(){
        $('#ckeckp_nofirma').prop('checked',true);
        $('#modal_firma_electronica').addClass('disabled_content');
        swal({
            title: '',
            text: 'Está seguro de generar los títulos de crédito',
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
                 $("#frm_firma_electronica_titulos").submit();

            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
            $('#modal_firma_electronica').removeClass('disabled_content');
        });
   
}

function metodofirmaElctronica(){
    $('#ckeckp_nofirma').prop('checked',false);
    firmarEmisiones();
}

function modalmetodo(){
      $("#titulo_firmar").html("");
      $('#informacion_certificado').hide();
      $("#content_check_sinfirma").hide();
      $('#ckeckp_nofirma').prop('checked',false);
      $('#frm_firma_electronica_titulos').show();
      $('#content_archivo_certificado').hide();
      $('#content_clave_certificado').hide();
      $("#catn_emisiones_generadas").hide();
      $("#procesing").hide();
      $('#archivo_certificado').val('');
      $('#text_archivo_certificado').val('');
      $('#input_clave_certificado').val('');
      $("#btn_modal_cerrar").attr("disabled", false);
      $('#content_tipo_firma').show();
      $('#btnFirmaElectronica').hide();
      var inputs=$('#contet_emisiones_selec').find('input');
        if(inputs.length==0){
          alertNotificar("Por favor seleccione las emisiones", "default"); return;
      }
       $("#modal_firma_electronica").modal("show"); 
}


function firmarEmisiones(){
  $("#content_check_sinfirma").hide();
  $('#ckeckp_nofirma').prop('checked',false);
  $('#frm_firma_electronica_titulos').show();
  $("#catn_emisiones_generadas").hide();
  $("#procesing").hide();
  $('#archivo_certificado').val('');
  $('#text_archivo_certificado').val('');
  $('#input_clave_certificado').val('');
  $("#btn_modal_cerrar").attr("disabled", false);
  $("#informacion_certificado").html("");
  var inputs=$('#contet_emisiones_selec').find('input');
    if(inputs.length==0){
      alertNotificar("Por favor seleccione las emisiones", "default"); return;
  }
  vistacargando('M','Espere..');
  $.get("/rolesPago/verificarConfigFirmado/", function(retorno){

    vistacargando();
    if(!retorno.error){ // si no hay error

        var config_firma = retorno.config_firma;

        // cargamos la configuracion de la firma electronica
        if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
            $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
        }else{
            $("#titulo_firmar").html("");
        }

        // verificiamos la vigencia del certificado
        vertificado_vigente = false;
        if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
            vertificado_vigente = true;
        }

        // cargamos el input para subir el certificado
        if(config_firma.archivo_certificado==true && vertificado_vigente==true){
            $("#content_archivo_certificado").hide();
        }else{
            $("#content_archivo_certificado").show();
        }

        // cargamos el input para la contraseña
        if(config_firma.clave_certificado==true && vertificado_vigente==true){
            $("#content_clave_certificado").hide();                        
        }else{
            $("#content_clave_certificado").show();
        }

        //cargamos la informacion del certificado
            if(config_firma.archivo_certificado==true){
                color_mensaje_certificado = "icon_success";
                mensaje_certificado = "Certificado vigente";
                icono_mensaje_certificado = "fa fa-check-square";
                if(config_firma.archivo_certificado==true && config_firma.dias_valido<=0){
                    color_mensaje_certificado = "icon_danger";
                    mensaje_certificado = "Certificado expirado";
                    icono_mensaje_certificado = "fa fa-times-circle";
                }else if(config_firma.archivo_certificado==true && config_firma.dias_valido <= config_firma.dias_notific_expira){
                    color_mensaje_certificado = "icon_warning";
                    mensaje_certificado = "Certificado casi expirado";
                    icono_mensaje_certificado = "fa fa-warning";
                }   
                
                $("#informacion_certificado").html(`
                    <div id="infoDepFlujGen_1" class="form-group infoDepFlujGen content_info_certificado" style="margin-bottom: 0px; margin-top: 16px;">
                        <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <div class="tile-stats" style="margin-bottom: 0px; border-color: #cccccc;">
                                <div class="icon ${color_mensaje_certificado}" style="font-size: 25px;"><i class="${icono_mensaje_certificado}"></i></div>
                                <div class="count ${color_mensaje_certificado}" style="font-size: 20px;">${mensaje_certificado}</div>                                    
                                <p>El certificado cargado es válido durante los siguientes <b>${config_firma.dias_valido} días</b>.</p>                                                                                
                            </div>
                            <hr style="margin-bottom: 2px;">                                        
                        </div>
                    </div>
                `);
                $('#valdatorfirma').val('S');
                
            }else{
                $('#valdatorfirma').val('N');
            }

        $("#input_clave_certificado").val("");
        $("#text_archivo_certificado").val("No seleccionado");

        //reiniciamos el icono de documento firmado
        $("#icono_estado_firma").html('<span class="fa fa-times-circle"></span>');
        $("#icono_estado_firma").parent().removeClass('btn_verde');
        $("#icono_estado_firma").parent().addClass('btn_rojo');
        $("#icono_estado_firma").parent().siblings('input').val("No seleccionado");

        $('#content_tipo_firma').hide();
        $('#informacion_certificado').show();
        $('#btnFirmaElectronica').show();
        
        //mostramos la modal de la firma electrónica
        $("#modal_firma_electronica").modal("show");                    
        
    }else{
        alertNotificar(retorno.mensaje, retorno.status);

    }
    $("#modal_firma_electronica").modal("show");   

    }).fail(function(){
        alertNotificar("No se pudo completar la acción", "error");

    });                 
}

// FUNCION PARA SELECCIONAR UN ARCHVO --------------

    $(".seleccionar_archivo").click(function(e){
        $(this).parent().siblings('input').val($(this).parent().prop('title'));
        this.value = null; // limpiamos el archivo
    });

    $(".seleccionar_archivo").change(function(e){

        if(this.files.length>0){ // si se selecciona un archivo

            //verificamos si es un archivo p12
            if(this.files[0].type != "application/x-pkcs12"){
                alertNotificar("El archivo del certificado debe ser formato .p12", "default");
                this.value = null;
                return;
            }            

            archivo=(this.files[0].name);
            $(this).parent().siblings('input').val(archivo);
        }else{
            return;
        }

    });

    // FUNCION PARA FIRMAR ELECTRONICAMENTE DOCUMENTO -------------------

        var cant_generados = 0;
        var total_generar = 0;  

        $("#frm_firma_electronica_titulos").submit(function(e){ 
            e.preventDefault();
            if(!$('#ckeckp_nofirma').prop('checked')){
                if($('#valdatorfirma').val()!='S'){
                    if($('#archivo_certificado').val()==''){
                        alertNotificar("Seleccione su archivo de firma electrónica", "default");
                        return;
                    }else{
                        if($('#input_clave_certificado').val()==''){
                            alertNotificar("Por favor ingrese la contraseña", "default");
                            return;
                        }
                    }
                }else{
                    if($('#input_clave_certificado').val()==''){
                        alertNotificar("Por favor ingrese la contraseña", "default");
                        return;
                    }
                }
            }
            $('#btn_modal_cerrar').prop('disabled',true);
            var FrmData = new FormData(this);
            $.ajaxSetup({
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            });
            $('#procesing').show();
            $('#frm_firma_electronica_titulos').hide();
            // vistacargando('M','Generando emisiones...'); // mostramos la ventana de espera

            $.ajax({
                url: "/emisiones/generar",
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                success: function(retorno){
                	if(retorno['error']==true){
                      $('#procesing').hide();
                      $('#frm_firma_electronica_titulos').show();
	                  alertNotificar(retorno.mensaje, "error");
	                    return;
                	}
                	if(retorno['error']==false){
                        alertNotificar(retorno.mensaje, "success");
                        $('#cedula').val(retorno['cedula']);
                        if($('#cedula').val()!=null){
                            $('#btnBuscars').click();
                        }
                		$('#procesing').hide();
	                	$('#cantGeneradas').html(retorno.cantidad_generados);
	                	$('#cantXgenerar').html(retorno.cantidad_generar);
	                	$('#catn_emisiones_generadas').show();
                        $('#btn_modal_cerrar').prop('disabled',false);

            		}

                    
                },
                error: function(error){
                    alertNotificar("Ocurrió un error intente nuevamente", "error");
                    $('#frm_firma_electronica_titulos').show();
                    $("#procesing").hide();
                }
            }); 
        });


    function verpdf(ruta){
         var iframe=$('#iframePdf');
         iframe.attr("src", "emisiones/visualizardoc/"+ruta);   
         $("#vinculo").attr("href", '/emisiones/descargarDoc/'+ruta);
         $("#documentopdf").modal("show");
     }

    $('#documentopdf').on('hidden.bs.modal', function (e) {
            var iframe=$('#iframePdf');
            iframe.attr("src", null);

    });
    $('#descargar').click(function(){
            $('#documentopdf').modal("hide");
    });


    $('#formReporte').submit(function(e){
        e.preventDefault();
		$('#btnDesacargarReporte').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Descargando Archivos`);  
        $('#btnDesacargarReporte').prop('disabled',true);
        $.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/emisiones/reporteGenerados',
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				
				if(data['error']==true){
                    alertNotificar(data['detalle'], "error");
                    $('#btnDesacargarReporte').html(`<span class="fa fa-download"></span> Descargar Títulos Generados`); 
                    $('#btnDesacargarReporte').prop('disabled',false); 
                   
					// return;
				}
				if(data['error']==false){
                    window.open("/emisiones/descargarRepor/"+data['nombredoc']);
                    // eliminarArchivoMerged(`${data['nombredoc']}`)
				}
                $('#btnDesacargarReporte').html(`<span class="fa fa-download"></span> Descargar Títulos Generados`); 
                $('#btnDesacargarReporte').prop('disabled',false); 
                
		},
		error: function(e){
            $('#btnDesacargarReporte').html(`<span class="fa fa-download"></span> Descargar Títulos Generados`); 
            $('#btnDesacargarReporte').prop('disabled',false); 
  	 		alertNotificar('Ocurrió un error intente nuevamente', "error");
			return;
	    }
	});
    });

    $('#cedula').on('input', function() {
       this.value = this.value.replace(/[^0-9]/g,'');
    });




    


