$(document).ready(function() {
    $("#frm_parametrizacion_sercop").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
});

$('#cedula_sercop').on('input', function() {
    this.value = this.value.replace(/[^0-9]/g,'');
 });

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
    
    function cargar_estilos_tabla(idtabla){

        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 2, "desc" ]],
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
    
    
    function cargartablejs(){
        $('#tdbody_certificaciones').html('');
        $("#table_certificaciones").DataTable().destroy();
        $('#table_certificaciones tbody').empty();
        vistacargando('m','Obteniendo certificaciones....');
        $.get('/adminContratos/lista_certificaciones', function (data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }

            
            $.each(data['detalle'], function(i, item){
                if(item['documentosercop']!=null){
                    var documento=`<center>
                            <a onclick="verdocumento('${item['documentosercop']}')" data-toggle="tooltip" data-placement="top" data-original-title="Visualizar documento" type="button" class="btn btn-info btn-sm ">
                                <i class="fa fa-eye" >
                                </i> Ver
                            </a>
                        </center>`;
                }else{
                    var documento=`<b style="color:red">Sin Certificado</b>`
                }
                $('#tdbody_certificaciones').append(`<tr role="row" >
                    <td width="10%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                        ${item['cedula']}
                    </td>
                    <td width="50%"   class="paddingTR">
                        ${item['name']}
                    </td>
                    <td width="20%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                        ${item['fecha_certificacion']}
                    </td>
                    <td  style="text-align: center; vertical-align: middle;"  class="paddingTR">
                       ${documento}
                    </td>
                    <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                        <center>
                            <a onclick="editar_sercop('${item['idtd_certificiacion_sercop']}')" data-toggle="tooltip" data-placement="top" data-original-title="Editar registro" type="button" class="btn btn-primary btn-sm ">
                                <i class="fa fa-edit" >
                                </i> Editar
                            </a>
                        </center>
                    </td>
                </tr>  `);
            });
            cargar_estilos_tabla('table_certificaciones');
            $('[data-toggle="tooltip"]').tooltip(); 
            vistacargando();
        }).fail(function(){
            alertNotificar('Ocurrió un error intente nuevamente','error');
            vistacargando();
        })
     }

     function verdocumento(ruta){
        // var iframe=$('#iframePdf');
        $('#documentoiframe').html(`<iframe width="100%" height="500" frameborder="0"id="iframePdf"></iframe>`);
        $('#iframePdf').attr("src", "/buscarDocumento/certificacionesSercop/"+ruta);   
        $("#vinculo").attr("href", '/buscarDocumentoDownload/certificacionesSercop/'+ruta);
        $("#documentopdf").modal("show");
    }

    $(document).ready(function() {
    		cargartablejs();
	});


	$('#frm_parametrizacion_sercop').submit(function(e){
        vistacargando('m','Por favor espere...');
		e.preventDefault();
		   $.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});

		    var formdata=new FormData(this)
			$.ajax({
				type: "POST",
				url: '/adminContratos/guardar_sercop',
				data: formdata,
				contentType: false,
				cache: false,
				processData:false,
				success: function(data){ 
						if(data['error']==true){
							alertNotificar(data['detalle'],'error');
                            vistacargando();
							return;
						}
						if(data['error']==false){
                            alertNotificar(data['detalle'],'success');
							cargartablejs();
						}
                        limpiarcampos();

				}
			}).fail(function(){
                vistacargando();
                return;
            });
		
	});




    var cedulaAux='';
    $( "#cedula_sercop" ).blur(function() {
        if($('#cedula_sercop').val()==''){return;}
        if($('#cedula_sercop').val()==cedulaAux){return;}
        $('#nombres').val('Cargando...');
            $.get('/adminContratos/buscarUsuario/'+$('#cedula_sercop').val(), function(data){
                if(data['message']=='Server Error'){
                    $('#nombres').val('');
                    alertNotificar('Ocurrió un error intente nuevamente', "error");
                    cedulaAux='';
                    return;
                }
                if(data['validacion']==true){
                    $('#nombres').prop('readonly',false);
                    $('#nombres').val('');
                    alertNotificar(data['detalle'], "error");
                    cedulaAux='';
                    return;
                }
                if(data['error']==true){
                    $('#nombres').val('');
                    alertNotificar(data['detalle'], "error");
                    cedulaAux='';
                    return;
                }
                if(data['error']==false){
                    
                    $('#nombres').val(data['detalle'][9]['valor']);
                    cedulaAux=$('#cedula_sercop').val();
                }
            });
    });



function editar_sercop(id){
    limpiarcampos();
	vistacargando('m','Por favor espere...');
    $.get('/adminContratos/edit_sercop/'+id,function(data){
    	$('#cedula_sercop').val(data['detalle']['cedula']);
    	$('#nombres').val(data['detalle']['name']);
    	$('#fecha_certificacion').val(data['detalle']['fecha_certificacion']);
    	$('#idedit').val(id);
		vistacargando();
	}).fail(function(){
        alertNotificar('Ocurrió un error, intente nuevamente','error');
        vistacargando();
    });
}


function limpiarcampos(){
    $('#cedula_sercop').val('');
    $('#nombres').val('');
    $('#fecha_certificacion').val('');
    $('#idedit').val('');
    $('#archivo_sercop').val('');
}

	function actualizarobjPDN(id){
		if($('#descripcionObj').val()==''){
			$('#infor').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-danger alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> Complete todos los campos.
	                                </div>
	                            </div>
	                        </div>`);
							$('#infor').show('200');
							setTimeout(function(){
							   $('#infor').fadeOut()
							}, 4000)
							return;
		}
     	$('#btnActualizarObj').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Actualizando`);
		   $.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
		   
		
			$.ajax({
				type: "PUT",
				url: '/gestionObjetivosPoa/registro/'+id,
				data: { 
		            descripcionObj:$('#descripcionObj').val(),
		            fecha_inicio_Obj: $('#fecha_inicio_Obj').val(),
		            fecha_fin_Obj: $('#fecha_fin_Obj').val()
		        },

				success: function(data){ 
						if(data['error']==true){
							$('#infor').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> ${data['detalle']}
	                                </div>
	                            </div>
	                        </div>`);
							$('#infor').show('200');
							setTimeout(function(){
							   $('#infor').fadeOut()
							}, 4000)
							return;
						}
						if(data['error']==false){
							$('#botonesForm').html(`
                            <button type="submit" id="btnGuardarObj" class="btn btn-success"><span class="fa fa-save"></span>  Guardar</button>
                            
                            `);
                            limpiar();
							cargartablejs(data['objetivos']);
							$('#infor').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> ${data['detalle']}
	                                </div>
	                            </div>
                       		 </div>`);
							$('#infor').show('200');
							setTimeout(function(){
							   $('#infor').fadeOut()
							}, 4000)
						}
				}
			});
		
	}

	function limpiar(){
		$('#descripcionObj').val('');
    	$('#fecha_inicio_Obj').val('');
    	$('#fecha_fin_Obj').val('');
	}
	function cancelarObjPND(){
		limpiar();
		$('#btn_obj_cancelar').remove();
		$('#botonesForm').html(`
        <button type="submit" id="btnGuardarObj" class="btn btn-success"><span class="fa fa-save"></span>  Guardar</button>
        
        `);
	}


	function modalObjetivosPDOT(id){
		$('#btn_PDOT_cancelar').hide();
    	$('#btncerrarModal').show();
    	$('#btnguardarPDOT').show();
    	$('#btnActualizarPDOT').hide();

		limpiarPDOT();
		$('#modalobjetivosPDOT').modal();
		$('#idPND').val(id);

	}



	$('#formObjPDOT').submit(function(e){
		e.preventDefault();
     	$('#btnguardarPDOT').html(`<span class="spinner-border " role="status" aria-hidden="true"></span>Registrando`);
		   $.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});

		    var formdata=new FormData(this)
			$.ajax({
				type: "POST",
				url: '/gestionObjetivosPoa/regisPdot',
				data: formdata,
				contentType: false,
				cache: false,
				processData:false,
				success: function(data){ 
				
						if(data['error']==true){
							$('#infor').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> ${data['detalle']}
	                                </div>
	                            </div>
	                        </div>`);
							$('#infor').show('200');
							setTimeout(function(){
							   $('#infor').fadeOut()
							}, 4000)
							return;
						}
						if(data['error']==false){
							$('#btnguardarPDOT').html(`Registrar`);
							cargartablejs(data['objetivos']);
							$('#descripcion').val('');
							$('#infor').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> ${data['detalle']}
	                                </div>
	                            </div>
	                        </div>`);
							$('#infor').show('200');
							setTimeout(function(){
							   $('#infor').fadeOut()
							}, 4000)
							$('#modalobjetivosPDOT').modal('hide');
						}
				}
			});
		
	});


	function eliminarObjetivoPDOT(id){
		vistacargando('m','Eliminando...');
		$.ajaxSetup({
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					}
				});

		$.ajax({
			type: "DELETE",
			url: '/gestionObjetivosPoa/regisPdot/'+id,
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){ 
						

					if(data['error']==true){
						$('#infor').html(`<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
									<div class="col-md-6 col-sm-6 col-xs-12">
										<div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
											<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
											</button>
											<strong>Información: </strong> ${data['detalle']}
										</div>
									</div>
								</div>`);
								$('#infor').show('200');
								setTimeout(function(){
								$('#infor').fadeOut()
								}, 4000)
						return;
					}
					if(data['error']==false){
						
						cargartablejs(data['objetivos']);
						$('#infor').html(`<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
							<div class="col-md-6 col-sm-6 col-xs-12">
								<div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
									<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
									</button>
									<strong>Información: </strong> ${data['detalle']}
								</div>
							</div>
						</div>`);
						$('#infor').show('200');
						setTimeout(function(){
						$('#infor').fadeOut()
						}, 4000)
						vistacargando();
				}
			}
		}); 
}


function editarObjetivoPDOT(id){
	vistacargando('m','Por favor espere...');
    $.get('/gestionObjetivosPoa/regisPdot/'+id+'/edit',function(data){
    	$('#descripcion').val(data['detalle']['descripcion']);
    	$('#fechaInicio').val(data['detalle']['fechaInicio']);
    	$('#fechaFin').val(data['detalle']['fechaFin']);
		$('#cmb_competencia').val(data['detalle']['idpoa_competencia']);
		$('.option_competencia').prop('selected',false);
		$(`#cmb_competencia option[value="${data['detalle']['idpoa_competencia']}"]`).prop('selected',true);
		$("#cmb_competencia").trigger("chosen:updated");

		$('#infomodal').html('');
    	$('#btn_PDOT_cancelar').hide();
    	$('#btncerrarModal').hide();
    	$('#btnguardarPDOT').hide();
    	$('#btnActualizarPDOT').hide();
    	$('#botonesFormPDOT').html(`
                            <a  onclick="actualizarPDOT('${id}')" id="btnActualizarPDOT" class="btn btn-success "><span class="fa fa-save"></span>  Actualizar</a>
                            <a onclick="cancelarPDOT()" type="button" id="btn_PDOT_cancelar" class="btn btn-danger "><span class="fa fa-times"></span> Cancelar</a>`);
		});
    	$('#modalobjetivosPDOT').modal();
		vistacargando();
}


function actualizarPDOT(id){
		if($('#descripcion').val()==''){
			$('#infomodal').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-danger alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> Complete todos los campos.
	                                </div>
	                            </div>
	                        </div>`);
							$('#infomodal').show('200');
							setTimeout(function(){
							   $('#infomodal').fadeOut()
							}, 4000)
							return;
		}
     	$('#btnActualizarPDOT').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Actualizando`);
		   $.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
		   
		
			$.ajax({
				type: "PUT",
				url: '/gestionObjetivosPoa/regisPdot/'+id,
				data: { 
		            descripcion:$('#descripcion').val(),
					competencia:$('#cmb_competencia').val(),
		            fechaInicio: $('#fechaInicio').val(),
		            fechaFin: $('#fechaFin').val()
		        },

				success: function(data){ 
						if(data['error']==true){
							$('#infomodal').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> ${data['detalle']}
	                                </div>
	                            </div>
	                        </div>`);
							$('#infor').show('200');
							setTimeout(function(){
							   $('#infor').fadeOut()
							}, 4000)
     						$('#btnActualizarPDOT').html(` Actualizar`);

							return;
						}
						if(data['error']==false){
							// $('#botonesFormPDOT').html(`
       //                         <button type="submit" id="btnGuardarObj" class="btn btn-success"><span class="fa fa-save"></span>  Guardar</button>
       //                      `);
							cargartablejs(data['objetivos']);
							$('#infor').html(`<div class="form-group">
	                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_info_inspector"></label>
	                            <div class="col-md-6 col-sm-6 col-xs-12">
	                                <div class="alert alert-${data['estadoP']} alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
	                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                                    </button>
	                                    <strong>Información: </strong> ${data['detalle']}
	                                </div>
	                            </div>
                       		 </div>`);
							$('#infor').show('200');
							setTimeout(function(){
							   $('#infor').fadeOut()
							}, 4000)
							$('#modalobjetivosPDOT').modal('hide');
						}
				}
			});
		
}

	function limpiarPDOT(){
		$('#descripcion').val('');
		// $('#botonesFormPDOT').html(`
  //       	<button  type="button" class="btn btn-default" data-dismiss="modal"><span class="fa fa-times"> </span>  Cerrar</button>
  //           <button type="submit" id="btnguardarPDOT" class="btn btn-primary"><span class="fa fa-save ">  Registrar</span></button>
  //       `);

	}

	$(document).ready(function() {
        $("#frm_ObjPoa").keypress(function(e) {
            if (e.which == 13) {
                return false;
            }
        });
        $("#formObjPDOT").keypress(function(e) {
            if (e.which == 13) {
                return false;
            }
        });
    });

    function cancelarPDOT(){
		limpiarPDOT();
		$('#modalobjetivosPDOT').modal('hide');
	}



