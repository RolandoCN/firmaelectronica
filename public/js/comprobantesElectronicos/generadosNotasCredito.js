$('#frm_buscarAutNotas').submit(function(){

		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaRetencionesAutorizadas').hide();
		$('#panelInfor').hide();
		$('#ResultEmi').html('');
		
		
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/notasdeCreditosFecha',
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
				   $('#tablaRetencionesAutorizadas').show();

				    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);

					cargartablejs(data['detalle']);
					$('#panelInfor').html(`<div  class="x_content x_content_border_mobil">
												<center><p style="color:green; font-size:25px"><b>TOTAL AUTORIZADAS</b></p></center>
												<center><span class="badge badge-info" style="font-size:18px; background-color:#dc3545"><b> ${data['detalle'].length}</b></span></center>
					                        	<br><center><a target="_blank" type="button" class="btn btn-primary" href="/comprobantes/notasdeCreditosReporte/${$('#fechaIn').val()}/${$('#fechaFin').val()}"  ><i class="fa fa-download"></i> Descargar Reporte</a></center>

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
     $('#idtable_autorizadas').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[2,'desc']],

         columns:[
         {data: "nro_emision" },
         {data: "cedula_ruc" },
         {data: "tasa" },
         {data: "factura"},
         {data : "fecha_autorizacion_nc"},
         {data: "nro_autorizacion_nc" },
         {data: "nro_emision" },
         {data: "nro_emision" },
         ],
	     "rowCallback": function( row, detalle, index ){
	 
	      	$('td', row).eq(1).html(`
         		 			<b>Identificación:</b> ${detalle['cedula_ruc']} <br>
         		 			<b>Nombres:</b> ${detalle['nombres']} <br>
                            `);
	     
	        $('td', row).eq(6).html(`<center><a style="font-size:30px" target="_blank" href="/comprobantes/pdfGeneradoComprobanteNotas/${detalle['nro_autorizacion_nc']}"  >
                                            <i style="color:red" class="fa fa-file-pdf-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(7).html(`<center>
                                        <a style="font-size:30px" target="_blank" download href="/comprobantes/xmlGeneradoComprobanteNotas/${detalle['nro_autorizacion_nc']}"  >
                                                <i style="color:green" class="fa fa-file-code-o" aria-hidden="true"></i>
                                            </a>
                                    </center>`);
            $('td', row).eq(6).css('text-align','center');
            $('td', row).eq(6).css('vertical-align','middle');
            $('td', row).eq(7).css('text-align','center');
            $('td', row).eq(7).css('vertical-align','middle');
	          
	     } 
    })
}


$('#cedulaRuc').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});


