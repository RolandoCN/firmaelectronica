	$(document).ready(function(){
	    cargarContenidoTablas('TablaCertificados');
	});
	function cargarContenidoTablas(tabla) {
	    $(`#${tabla}`).DataTable( {
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
	} );
	}

  	function showModal(idcertificado,parametro) {
  		var aux;
  		cargando();
    	$('#inforMensaje').html('');
    	$('#valRe').val('');
        $.get('/certificados/requisitosCerti/'+idcertificado+'/'+parametro, function (data) { 
        	if(data['error']==false){
	        	$('#bodyPermisoF').html('');	
	        	$.each(data['detalle'],function(i,val){
	        		//VALIDAR LOS QUE YA FUERON SUBIDOS
	        		aux=false;
	        		$.each(data['subidos'],function(i1,val1){
	        			if(val1!=null){
		        			if(val['idrequisitos']==val1['idrequisitos']){
		        				aux =true;
							}
						}
	        		});
	        		if(aux==true){
    					if(val['obligado']=='Si'){
			        		var obligado=`<b style="color:red">*</b>`;
			        	}else if(val['obligado']=='No'){
			        		var obligado='';
			        	}
			        	var observacion=(`<td align="center" ">
			        						<i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i>
			        					  </td>
			        					  <td align="center" ">
			        						<a  target="_blank" type="button" class="btn btn-primary btn-xs" href="/buscarDocumento/certificadosRequisitos/${data['subidos'][i]['documento']}"><span class="fa fa-eye"></span> Ver</a>
			        					  </td>`);
						 $('#bodyPermisoF').append(`<tr style="color:black">
					        <td " ><center>${val['requisitos']['descripcion']} ${obligado}</center></td>
					        ${observacion};
						</tr>`);
	        		}else{
	        				var observacion=`<td align="center" class="tdEstado_${val['requisitos']['idrequisitos']}">Adjuntar Documento PDF</td>
				  				<td align="center" >
				  					<form class="submitForm" enctype="multipart/form-data" class="form-horizontal">
					  					<div class="row">
								  			<div class="col-md-9 col-sm-9 col-xs-12">
								  			<input type="hidden" name='idrequisitos' value="${val['requisitos']['idrequisitos']}">
								  			<input type="hidden" name='idemision' value="${parametro}">
									            <div class="inputfile input-prepend input-group sinmargenbutton">
									                <label style="padding:0px 12px;"  title="Agregar un documento" class=" control-label btn btn-primary btn-upload add-on input-group-addon" for="formato_${val['requisitos']['idrequisitos']}">
									                    <input  onchange="selecccionDoc(this,${val['requisitos']['idrequisitos']})" id="formato_${val['requisitos']['idrequisitos']}" name="formato" class="sr-only file_selec_certificado" type="file" accept="application/pdf" >
									                    <span title="" class="docs-tooltip" data-toggle="tooltip" data-original-title="Agregar un documento">
									                    <span class="fa fa-upload"></span>
									                    </span>
									                </label> 
									               <input  id="nombreFormatoSeleccionado_${val['requisitos']['idrequisitos']}" name="nombreFormatoSeleccionado_${val['requisitos']['idrequisitos']}" class="form-control" type="text" placeholder="Seleccionar archivo">
									            </div>  
									        </div>
								  			<div align="center" class="btndiv col-md-3 col-sm-3 col-xs-12">
								  				<button value="${val['requisitos']['idrequisitos']}"   type="submit" class="btn btn-success" ><span class="fa fa-save"></span></button>
								  			</div>
									    </div>
								    </form>
								</td> `;
				        		if(val['obligado']=='Si'){
					        		var obligado=`<b style="color:red">*</b>`;
					        	}else if(val['obligado']=='No'){
					        		var obligado='';
					        	}
				        		$('#bodyPermisoF').append(`<tr style="color:black">
								        <td " ><center>${val['requisitos']['descripcion']} ${obligado}</center></td>
								        ${observacion};
								</tr>`);
				  }      		
		        });

	   			$('#nota').html(`<div class="col-md-12 col-sm-12 col-xs-12">
                              Todos los campos marcados con ( <b style="color:red">*</b> ) son obligatorios.
                            </div>`);
			}else if(data['error']==true){
				$('#btnSolicitud').html('');
				$('#nota').html('');
		   	 	$('#bodyPermisoF').html('');
		   		$('#bodyPermisoF').html(`<tr>
	   							<td colspan=3>
			   							<div align="center" style="font-size: 19px" class="alert alert-warning" role="alert">
										  <b>Error!</b> inténtelo más tarde.
										</div>
								</td>
								</tr>`
								);
			}
        });
   		 
        $("#parametro").val(parametro);
		$('#modal_Solicitud_PF').modal('show');
  	}


    function mensajeAlertas(etiqueta,color,mensaje){
    	$('#'+etiqueta).html('');
		$('#'+etiqueta).append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
				</button>
				<strong>¡Atención!</strong>${mensaje}
			</div>`);
		$('#'+etiqueta).show(200);
		setTimeout(function() {
		$('#'+etiqueta).hide(200);
		},  5000);
    }

    $('#bodyPermisoF').delegate('.submitForm','submit',function(e){
    	e.preventDefault();

		var idrequisito=($(this).find('button').val());
		var button= $(this).find('button');
		var input= $(this);
		var btndiv= $(this).find('.btndiv');
		var tamservidor=2;

		if($('#formato_'+idrequisito)[0].files.length==0){
			mensajeAlertas('inforMensaje','#f8d7da',` Adjuntar documento PDF.`);
	        return;
		}

    	var tamArchivo = $(`#formato_`+idrequisito)[0].files[0].size; 
        tamArchivo = ((tamArchivo/1024)/1024);

        if(tamArchivo>tamservidor){
			mensajeAlertas('inforMensaje','#f8d7da',` No se puede subir un archivo que supere los ${tamservidor} MB.`);
	        return;
    	}

    	$(this).find('button').html('<span class="spinner-border " role="status" aria-hidden="true"></span>');
		$(this).find('button').prop('disabled',true);
        
    	$.ajaxSetup({
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					}
				});

		$.ajax({
			type: "POST",
			url: '/certificados/emisionRequisito',
			// data: e.serialize(),
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){				
				if(data['cumple']==false){
					mensajeAlertas('inforMensaje','#f8d7da',`${data['detalle']}`);
					button.prop('disabled',false);
					button.html(`<span  class="fa fa-save" ></span>`);
				}else if(data['cumple']==true){
					btndiv.html('');
					button.prop('disabled',false);
					button.html(`<span  class="fa fa-save" ></span>`);
					input.html(`<a  target="_blank" type="button" class="btn btn-primary btn-xs" href="/buscarDocumento/certificadosRequisitos/${data['document']}"><span class="fa fa-eye"></span> Ver</a>`);
					$('.tdEstado_'+idrequisito).html('<i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i>');
					
				}
			}
		});       

	});


    //es para pasar el nombre del archivo seleccionado en el input del formato del requisito
	function selecccionDoc(input,id){
		archivo="Seleccione un archivo";
		if(input.files.length>0){ // si se selecciona un archivo
			archivo=(input.files[0].name);
			$('#nombreFormatoSeleccionado_'+id).val(archivo);
		}
	}

	function cargando(){
   		$('#btnSolicitud').html('');
   		$('#nota').html('');
   	 	$('#bodyPermisoF').html('');
   		$('#bodyPermisoF').html(`<tr>
   							<td colspan=3>
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
															¡Obteniendo requisitos!
															</strong>
														</p>
											</blockquote>										
										</div>        
						        	</div>
								</div>
							</td>
		</tr>`);
       					
    }

