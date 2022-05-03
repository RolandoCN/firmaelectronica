$(document).ready(function(){
    cargarContenidoTablas('tablaComprobantes');
});

function cargarContenidoTablas(tabla) {
    $(`#${tabla}`).DataTable( {
    	order: [[0,'desc']],
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
$('#frm_buscarEmision').submit(function(){

		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaEmisiones').hide();
		$('#panelInfor').hide();
		$('#ResultEmi').html('');
		
		
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/listacomprobantesR',
			// data: e.serialize(),
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			timeout: 50000, //50 segundos
			success: function(data){
				console.log(data);

				
				if(data['error']==true){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		// setTimeout(function() {
		  	 		// $('#infoBusqueda').hide(200);
		  	 		// },  3000);
					return;
				}
				if(data['vacio']==true){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				    //MOSTRAR INFORMACION DE BUSQUEDAS
				    $('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #cce5ff;color: black" class="alert  alert-dismissible fade in" role="alert">
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
				if(data['error']==false){
				   $('#tablaEmisiones').show();

				    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);

					cargartablejs(data['detalle']);
					$('#panelInfor').html(`<div  class="x_content x_content_border_mobil">
												<center><p style="color:black"><b>DATOS DEL CONTRIBUYENTE</b></p></center>
					                        <div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">
						                        <div class="form-group" style="color: black">
											            <b>Identificación:</b> ${data['detalle'][0]['identificacion']}<br>
														<b>Razón Social:</b> ${data['detalle'][0]['razonSocial']}<br>
						                        </div>
					                        </div>
	                    				</div>`);
					$('#panelInfor').show(200);

				}	
		},
		error: function(e){
	        if (e.statusText==='timeout'){
	          $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			    //MOSTRAR INFORMACION DE BUSQUEDAS
			    $('#infoBusqueda').html('');
	    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Tiempo de espera agotado intente nuevamente.
	                  </div>`);
	    		$('#infoBusqueda').show(200);
	    		setTimeout(function() {
	  	 		$('#infoBusqueda').hide(200);
	  	 		},  3000);
				return;
	        }
	        else{
	           $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			    //MOSTRAR INFORMACION DE BUSQUEDAS
			    $('#infoBusqueda').html('');
	    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Ocurrió un error intente nuevamente.
	                  </div>`);
	    		$('#infoBusqueda').show(200);
	    		setTimeout(function() {
	  	 		$('#infoBusqueda').hide(200);
	  	 		},  3000);
				return;
	        }
	    }
	});
});




function cargartablejs(data){
     $('#idtable_emisiones').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[2,'desc']],

         columns:[
         {data: "idemision" },
         {data: "periodo" },
         // {data: "claveAcceso"},
         {data : "fechaIngreso"},
         {data: "fechaEnvio"},
         {data: "fechaAutorizacion" },
         // {data: "numeroautorizacion" },
         {data: "estado" },
         {data: "idemision" },
         {data: "idemision" },
         ],
         "rowCallback": function( row, detalle, index ){
             $('td', row).eq(5).prop('align','center');
      
            var estado;
            if(detalle['estado']=='INGRESADO'){
            	estado=`<span style="background-color:#007bff" class="badge badge-primary">${detalle['estado']}</span>`
        	}else if(detalle['estado']=='ENVIADO'){
            	estado=`<span style="background-color:#ffc107" class="badge badge-warning">${detalle['estado']}</span>`
        	}else if(detalle['estado']=='AUTORIZADO'){
            	estado=`<span style="background-color:#28a745" class="badge badge-success">${detalle['estado']}</span>`
        	}
         
            $('td', row).eq(5).html(estado);
            $('td', row).eq(5).css('text-align','center');
            $('td', row).eq(5).css('vertical-align','middle');
            if(detalle['estado']=='AUTORIZADO'){
	            $('td', row).eq(6).html(`<center><a style="font-size:30px" target="_blank" href="/comprobantes/pdfGeneradoComprobanteR/${detalle['claveAcceso']}"  >
	                                             <i style="color:red" class="fa fa-file-pdf-o" aria-hidden="true"></i>
	                                            </a>
	                                    </center>`);
	            $('td', row).eq(7).html(`<center>
	                                        <a style="font-size:30px" target="_blank" download href="/comprobantes/xmlGeneradoComprobanteR/${detalle['claveAcceso']}"  >
	                                                <i style="color:green" class="fa fa-file-code-o" aria-hidden="true"></i>
	                                            </a>
	                                    </center>`);
             }else{
          		$('td', row).eq(6).html(``);
          		$('td', row).eq(7).html(``);
          	}
              
         } 

    })
}


$('#cedulaRuc').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});



//MODULO FACTURAS TOTAL AUTORIZADAS
 $('#frm_buscarAutorizadasRetenciones').submit(function(){
		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaRetencionesAutorizadas').hide();
		$('#panelInfor').hide();
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/retencionesAutoFecha',
			// data: e.serialize(),
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			timeout: 50000, //50 segundos
			success: function(data){
				if(data['error']==true){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
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
				if(data['detalle'].length==0){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				    //MOSTRAR INFORMACION DE BUSQUEDAS
				    $('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> No existen retenciones autorizadas en esta fecha.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  3000);
					return;
				}
				if(data['error']==false){
					$('#tablaRetencionesAutorizadas').show();
				    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					cargartablejsFecha(data['detalle']);
					
					$('#panelInfor').html(`<div  class="x_content x_content_border_mobil">
												<center><p style="color:green; font-size:25px"><b>TOTAL AUTORIZADAS</b></p></center>
												<center><span class="badge badge-info" style="font-size:18px; background-color:#dc3545"><b> ${data['detalle'].length}</b></span></center>
					                        	<br><center><a target="_blank" type="button" class="btn btn-primary" href="/comprobantes/reporteRetencion/${$('#fechaIn').val()}/${$('#fechaFin').val()}"  ><i class="fa fa-download"></i> Descargar Reporte</a></center>

	                    				</div>`);
					$('#panelInfor').show(200);

				}

				
		},
		error: function(e){
	        if (e.statusText==='timeout'){
	          $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			    //MOSTRAR INFORMACION DE BUSQUEDAS
			    $('#infoBusqueda').html('');
	    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Tiempo de espera agotado intente nuevamente.
	                  </div>`);
	    		$('#infoBusqueda').show(200);
	    		setTimeout(function() {
	  	 		$('#infoBusqueda').hide(200);
	  	 		},  3000);
				return;
	        }
	        else{
	           $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
			    //MOSTRAR INFORMACION DE BUSQUEDAS
			    $('#infoBusqueda').html('');
	    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
	                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
	                    </button>
	                    <strong>¡Atención!</strong> Ocurrió un error intente nuevamente.
	                  </div>`);
	    		$('#infoBusqueda').show(200);
	    		setTimeout(function() {
	  	 		$('#infoBusqueda').hide(200);
	  	 		},  3000);
				return;
	        }
	    }
	});
});

//tabla de facturas autorizadas por fecha
function cargartablejsFecha(data){
     $('#idtable_autorizadas').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[5,'desc']],

         columns:[
         {data: "referencia"},
         {data: "ruc"},
         {data: "f_emision"},
         {data: "factura" },
         {data: "periodo"},
         {data : "fecha_autorizacion"},
         {data : "nro_autorizacion"},
         {data : "referencia"},
         {data : "referencia"},
         ],
         "rowCallback": function( row, detalle, index ){
         	$('td', row).eq(1).html(`
         		 			<b>Identificación:</b> ${detalle['ruc']} <br>
         		 			<b>Nombres:</b> ${detalle['razonsocial']} <br>
                            `);
         	$('td', row).eq(7).html(`<center><a style="font-size:30px" target="_blank" href="/comprobantes/pdfGeneradoComprobanteR/${detalle['nro_autorizacion']}"  >
                                            <i style="color:red" class="fa fa-file-pdf-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(8).html(`<center>
                                        <a style="font-size:30px" target="_blank" download href="/comprobantes/xmlGeneradoComprobanteR/${detalle['nro_autorizacion']}"  >
                                                <i style="color:green" class="fa fa-file-code-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(7).css('text-align','center');
            $('td', row).eq(7).css('vertical-align','middle');
            $('td', row).eq(8).css('text-align','center');
            $('td', row).eq(8).css('vertical-align','middle');
         } 

    })
}


function modalJson(json){
	$('#vistaJson').html(json);
	$('#modalJson').modal();
}


function  confirmarAnulacion(id){
    swal({
            title: "",
            text: "¿Está seguro que desea anular esta retención?, recuerde que antes de hacer este procedimiento debió realizar las respectivas correcciones",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-sm btn-info",
            cancelButtonClass: "btn-sm btn-danger",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que si
            	anularEmision(id);
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    
}

function anularEmision(id){
		$('#btn_'+id).html(`<button disabled=true  type="button"  class="btn btn-warning"><span class="spinner-border " role="status" aria-hidden="true"></span> Anulando</button>`);  
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "PUT",
			url: '/comprobantes/anularEmisionRetencion/'+id,
			// data: e.serialize(),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				
				if(data['error']==true){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  5000);
				   $('#btn_'+id).html(`<button  type="button" onclick="confirmarAnulacion('${id}')" class="btn btn-sm btn-warning "><i class="fa fa-file-text"></i> Anular</button>`);

					return;
				}
				if(data['error']==false){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #d4edda;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  5000);
		  	 		if(data['estado']=='success'){
		  	 			$('#btn_'+id).html(`<i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i>`);
		  	 		}else{
				     $('#btn_'+id).html(`<button  type="button" onclick="confirmarAnulacion('${id}')" class="btn btn-sm btn-warning "><i class="fa fa-file-text"></i> Anular</button>`);
		  	 		}

					return;
				}
			}
		});
	
}



