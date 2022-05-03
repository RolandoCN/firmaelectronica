    
	function cargartablejs(data){
		$('#tbodyObj').html('');
     $('#tableObj').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[1,'asc']],

         columns:[
         {data: "descripcion"},
         {data: "fechaInicio" },
         {data: "idpoa_obj_pdn"},
         {data : "idpoa_obj_pdn"},
         ],
         "rowCallback": function( row, detalle, index ){
         	 $('td', row).eq(1).html(`
         		 			 ${detalle['fechaInicio']} - ${detalle['fechaFin']} 
                            `);
         	 if(detalle['objetivopdot'].length!=0){
         	 	$('td', row).eq(2).html('');
	         	 $.each( detalle['objetivopdot'], function(i,item) {
					  var competencia='Sin competencia';
						if(item['idpoa_competencia']!=null && item['idpoa_competencia']!=0){
							competencia=item['competencias']['descripcion'];
						}
						 $('td', row).eq(2).append(`<div  class="row">
	         		 			 <div class="col-md-9"><li>${item['descripcion']} [<b style="color:#239dea; font-size:10px">${competencia}</b>]</li></div> 
	         		 			 <div class="col-md-3"><button onclick="editarObjetivoPDOT('${item['idpoa_obj_pdot_encrypt']}')" class="fa fa-edit btn btn-xs btn-info"></button><button onclick="eliminarObjetivoPDOT(${item['idpoa_obj_pdot']})" class="fa fa-trash btn btn-xs btn-danger"></button></div></div>
	                            `);
				} );
	         }else{
	         	 $('td', row).eq(2).html(`
	         		 			 Sin Objetivos
	                            `);
	         }
         	
         	 $('td', row).eq(3).html(`<div align="center">
         	 				<button onclick="modalObjetivosPDOT('${detalle['idpoa_obj_pdn_encrypt']}')" class="btn btn-xs btn-warning"><span class="fa fa-plus"></span> Asignar PDOT</button><br> 
         		 			<button onclick="editarObjetivoPND('${detalle['idpoa_obj_pdn_encrypt']}')" class="btn btn-xs btn-info"><span class="fa fa-edit"></span> </button> 
         		 			<button onclick="eliminarObjetivoPND('${detalle['idpoa_obj_pdn_encrypt']}')" class="btn btn-xs btn-danger"><span class="fa fa-trash"></span> </button></div>
                            `);
         } 

    })
     }
    $(document).ready(function() {
    	$.get('/gestionObjetivosPoa/objetivosPDN',function(data){
			console.log(data);
    		cargartablejs(data['detalle']);

    	});
	});
	$('#frm_ObjPoa').submit(function(e){
		e.preventDefault();
     	$('#btnGuardarObj').html(`<span class="spinner-border " role="status" aria-hidden="true"></span>Registrando`);
		   $.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});

		    var formdata=new FormData(this)
			$.ajax({
				type: "POST",
				url: '/gestionObjetivosPoa/registro',
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
							$('#btnGuardarObj').html(`Guardar`);
							cargartablejs(data['objetivos']);
							$('#descripcionObj').val('');
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
		
	});






function eliminarObjetivoPND(id){
	vistacargando('m','Eliminando');
	$.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});

	$.ajax({
		type: "DELETE",
		url: '/gestionObjetivosPoa/registro/'+id,
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

function editarObjetivoPND(id){
	vistacargando('m','Por favor espere...');
    $.get('/gestionObjetivosPoa/registro/'+id+'/edit',function(data){
    	$('#descripcionObj').val(data['detalle']['descripcion']);
    	$('#fecha_inicio_Obj').val(data['detalle']['fechaInicio']);
    	$('#fecha_fin_Obj').val(data['detalle']['fechaFin']);
    	$('#botonesForm').html(`
                            <a  onclick="actualizarobjPDN('${id}')" id="btnActualizarObj" class="btn btn-success btnActualizarObjclass"><span class="fa fa-save"></span>  Actualizar</a>
                            <a onclick="cancelarObjPND()" type="button" id="btn_obj_cancelar" class="btn btn-danger "><span class="fa fa-times"></span> Cancelar</a>`);
    	$('#idedit').val(id);
		vistacargando();
	});
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



