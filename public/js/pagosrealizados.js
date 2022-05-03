$('#frm_buscarPagos').submit(function(){

		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaPagos').hide();
		$('#panelInfor').hide();
		$('#ResultEmi').html('');
		
		
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/pago/pagorealizado',
			// data: e.serialize(),
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			timeout: 50000, //50 segundos
			success: function(data){
				
				// return;
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
				if(data['detalle'].length==0){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				    //MOSTRAR INFORMACION DE BUSQUEDAS
				    $('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> No existen pagos realizados en esta fecha.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  3000);
					return;
				}
				if(data['error']==false){
					$('#tablaPagos').show();
				    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);

					cargartablejs(data['detalle']);
					
					$('#panelInfor').html(`<div  class="x_content x_content_border_mobil">
												<center><p style="color:green; font-size:25px"><b>TOTAL RECAUDADO</b></p></center>
												<center><p style="color:red; font-size:20px" ><b>$ ${data['total']}</b></p></center>
					                        	<center><a type="button" class="btn btn-primary" href="/pago/pdfPago/${$('#fechaIn').val()}/${$('#fechaFin').val()}/${$('#institucion').val()}"  ><i class="fa fa-download"></i> Descargar Reporte</a></center>
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

     $('#idtable_pagos').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[1,'asc']],

         columns:[
         {data: "identificacion"},
         {data: "fechaPago" },
         {data: "detalle"},
         {data : "institucion"},
         {data : "totalPago"},
         ],
         "rowCallback": function( row, detalle, index ){
         	 $('td', row).eq(4).html(`
         		 			$ ${detalle['totalPago']} 
                            `);
         	if(detalle['usuarioId']==0){
         		 $('td', row).eq(0).html(`
         		 			${detalle['identificacion']} 
                            `);
         	}else{
         		$('td', row).eq(0).html(`
         		 			<b>Identificación:</b> ${detalle['identificacion']} <br>
         		 			<b>Nombres:</b> ${detalle['user']['name']} <br>
                            `);
         	}
           
         } 

    })
}

function totalemisiones(cedula){
	 $.get("/comprobantes/totalemisionesCedula/"+cedula, function(data){
	 	cargartablejs(data['detalle']);
	 });	
}

$('#cedulaRuc').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});

