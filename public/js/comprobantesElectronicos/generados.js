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
			url: '/comprobantes/listacomprobantes',
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
         	if(detalle['rubro']!=null){
          		$('td', row).eq(1).html(`<p><b>TASA:</b> ${detalle['rubro']} <br> <br> <b>PERIODO:</b> ${detalle['periodo']} `);
          	}else{
          		$('td', row).eq(1).html(``);
          	}
            var estado;
            if(detalle['estado']=='INGRESADO'){
            	estado=`<span style="background-color:#007bff;" class="badge badge-primary">${detalle['estado']}</span>`
        	}else if(detalle['estado']=='ENVIADO'){
            	estado=`<span style="background-color:#ffc107;" class="badge badge-warning">${detalle['estado']}</span>`
        	}else if(detalle['estado']=='AUTORIZADO'){
            	estado=`<span style="background-color:#28a745;" class="badge badge-success">${detalle['estado']}</span>`
        	}
         
            $('td', row).eq(5).html(estado);
            $('td', row).eq(5).css('text-align','center');
            $('td', row).eq(5).css('vertical-align','middle');
            if(detalle['estado']=='AUTORIZADO'){
            $('td', row).eq(6).html(`<center><a style="font-size:30px" target="_blank" href="/comprobantes/pdfGeneradoComprobante/${detalle['claveAcceso']}"  >
                                            <i style="color:red" class="fa fa-file-pdf-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(7).html(`<center>
                                        <a style="font-size:30px" target="_blank" download href="/comprobantes/xmlGeneradoComprobante/${detalle['claveAcceso']}"  >
                                                <i style="color:green" class="fa fa-file-code-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(6).css('text-align','center');
            $('td', row).eq(6).css('vertical-align','middle');
            $('td', row).eq(7).css('text-align','center');
            $('td', row).eq(7).css('vertical-align','middle');
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


 $("#idtable_autorizadas").DataTable( {
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
        "infoFiltered": " - filtrado de _MAX_ registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        }
    }
});


 //MODULO FACTURAS TOTAL AUTORIZADAS
 $('#frm_buscarAutorizadas').submit(function(){
		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaFacturasAutorizadas').hide();
		$('#panelInfor').hide();
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/facEmitidasFecha',
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
		                    <strong>¡Atención!</strong> No existen facturas autorizadas en esta fecha.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  3000);
					return;
				}
				if(data['error']==false){
					$('#tablaFacturasAutorizadas').show();
				    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					cargartablejsFecha(data['detalle']);
					if(data['estadotasa']==true){
						var btnReporte=`<center><a target="_blank" type="button" class="btn btn-primary" href="/comprobantes/reporteAutorizadas/${$('#fechaIn').val()}/${$('#fechaFin').val()}/${data['codtasa']}"  ><i class="fa fa-download"></i> Descargar Reporte</a></center>`;
					}else{
						var btnReporte=`<center><a target="_blank" type="button" class="btn btn-primary" href="/comprobantes/reporteAutorizadas/${$('#fechaIn').val()}/${$('#fechaFin').val()}/report"  ><i class="fa fa-download"></i> Descargar Reporte</a></center>`;
					}	
					$('#panelInfor').html(`<div  class="x_content x_content_border_mobil">
												<center><p style="color:green; font-size:25px"><b>TOTAL</b></p></center>
												<center><span class="badge badge-info" style="font-size:18px; background-color:#dc3545"><b> ${data['detalle'].length}</b></span></center>
					                        	<br>${btnReporte}

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
         {data: "fecha_emision"},
         {data: "cedula_ruc"},
         {data: "tasa" },
         {data: "anio"},
         {data : "mes"},
         {data : "fecha_autorizacion"},
         {data : "nro_autorizacion"},
         {data : "anio"},
         {data : "anio"},
         ],
         "rowCallback": function( row, detalle, index ){
         	$('td', row).eq(1).html(`
         		 			<b>Identificación:</b> ${detalle['cedula_ruc']} <br>
         		 			<b>Nombres:</b> ${detalle['nombres']} <br>
                            `);
         	$('td', row).eq(7).html(`<center><a style="font-size:30px" target="_blank" href="/comprobantes/pdfGeneradoComprobante/${detalle['nro_autorizacion']}"  >
                                            <i style="color:red" class="fa fa-file-pdf-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(8).html(`<center>
                                        <a style="font-size:30px" target="_blank" download href="/comprobantes/xmlGeneradoComprobante/${detalle['nro_autorizacion']}"  >
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



 //MODULO FACTURAS DE MAS EN SRI
 $('#frm_buscarfactMas').submit(function(){
		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaExcfact').hide();
		$('#panelInfor').hide();
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/buscarfacturaCabilo',
			data: new FormData(this),
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
					return;
				}
				if(data['detalle']==null){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				    //MOSTRAR INFORMACION DE BUSQUEDAS
				    $('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #fff3cd;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong>   No existen excedentes de facturas en el SRI. <b><i style="color: green; font-size:20px" class="fa fa-smile-o" aria-hidden="true"></i></b>
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  3000);
					return;
				}
				if(data['error']==false){
					$('#tablaExcfact').show();
				    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					cargartablejsExcede(data['detalle']);
					
					$('#panelInfor').html(`<div  class="x_content x_content_border_mobil">
												<center><p style="color:green; font-size:25px"><b>TOTAL</b></p></center>
												<center><span class="badge badge-info" style="font-size:18px; background-color:#dc3545"><b> ${data['detalle'].length}</b></span></center>
	                    				</div>`);
					$('#panelInfor').show(200);

				}

				
		},
	});
});

function cargartablejsExcede(data){

     $('#idtable_Excede').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[5,'desc']],

         columns:[
         {data: "idemision"},
         {data: "fechaEmisionIn"},
         {data: "identificacion"},
         {data: "periodo"},
         {data : "fechaAutorizacion"},
         {data : "numeroautorizacion"},
         {data : "idemision"},
         {data : "idemision"},
         {data : "idcomprobanteselectronicos"},
         ],
         "rowCallback": function( row, detalle, index ){
         	$('td', row).eq(2).html(`
         		 			<b>Identificación:</b> ${detalle['identificacion']} <br>
         		 			<b>Nombres:</b> ${detalle['razonSocial']} <br>
                            `);
         	$('td', row).eq(6).html(`<center>
							<form >
								<div id="btn_${detalle['idcomprobanteselectronicos']}">
                                 <button  type="button" onclick="confirmarAnulacionfactura('${detalle['idcomprobanteselectronicos']}')" class="btn btn-sm btn-warning marginB0"><i class="fa fa-file-text"></i> Anular</button>
                            	</div>
                            </form>
                            </center>`);
         	$('td', row).eq(7).html(`<center><a style="font-size:30px" target="_blank" href="/comprobantes/pdfGeneradoComprobante/${detalle['numeroautorizacion']}"  >
                                            <i style="color:red" class="fa fa-file-pdf-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(8).html(`<center>
                                        <a style="font-size:30px" target="_blank" download href="/comprobantes/xmlGeneradoComprobante/${detalle['numeroautorizacion']}"  >
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

function  confirmarAnulacionfactura(id){
    swal({
            title: "",
            text: "¿Está seguro que desea anular esta factura, recuerde que antes de hacer este procedimiento debió anular la factura en el SRI?",
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
            	anularfactura(id);
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    
}


function anularfactura(id){
		$('#btn_'+id).html(`<button disabled=true  type="button"  class="btn btn-warning"><span class="spinner-border " role="status" aria-hidden="true"></span> Anulando</button>`);  
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type: "PUT",
			url: '/comprobantes/anularfactura/'+id,
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
				   $('#btn_'+id).html(`<button  type="button" onclick="confirmarAnulacionfactura('${id}')" class="btn btn-sm btn-warning marginB0"><i class="fa fa-file-text"></i> Anular</button>`);
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
				     $('#btn_'+id).html(`<button  type="button" onclick="confirmarAnulacionfactura('${id}')" class="btn btn-sm btn-warning marginB0"><i class="fa fa-file-text"></i> Anular</button>`);
		  	 		}
					return;
				}
			}
		});
	
}


    // EVENTOS PARA LAS TASAS MUNICIPALES
    $('#check_tasa').on('ifChecked', function(event){ // si se checkea
        $("#div_tasa_Municipal").show(200);
    });

    $('#check_tasa').on('ifUnchecked', function(event){ // si se deschekea
        $("#div_tasa_Municipal").hide(200);
    });


function modalJson(json){
	$('#vistaJson').html(json);
	$('#modalJson').modal();
}


function  confirmarAnulacion(id){
    swal({
            title: "",
            text: "¿Está seguro que desea anular esta emisión, recuerde que antes de hacer este procedimiento debió realizar las respectivas correcciones?",
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
			url: '/comprobantes/anularEmision/'+id,
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
