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
			url: '/comprobantes/emisionesporCedula',
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
						                        		<b>Ciu:</b> ${data['detalle'][0]['ciu']}<br>
											            <b>Identificación:</b> ${data['detalle'][0]['identificacion']}<br>
														<b>Nombre:</b> ${data['detalle'][0]['nombre']}<br>
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

function submitIngreso(emision){
		$('#btn_'+emision).html(`<button disabled=true  type="button"  class="btn btn-success"><span class="spinner-border " role="status" aria-hidden="true"></span> Facturando</button>`);  
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/ingresarFactura/'+emision,
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
				   $('#btn_'+emision).html(`<button  type="button" onclick="submitIngreso(${emision})" class="btn btn-sm btn-success marginB0"><i class="fa fa-file-text"></i> Facturar</button>`);

					return;
				}
				if(data['error']==false){
						totalemisiones(data['cedula']);
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
					$('#infoBusqueda').html('');
		    		$('#infoBusqueda').append(`<div style="background-color: #d4edda;color: black" class="alert  alert-dismissible fade in" role="alert">
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
		                    </button>
		                    <strong>¡Atención!</strong> ${data['detalle']}.
		                  </div>`);
		    		$('#infoBusqueda').show(200);
		    		setTimeout(function() {
		  	 		$('#infoBusqueda').hide(200);
		  	 		},  5000);
		  	 		if(data['estado']=='AUTORIZADO'){
		  	 			$('#btn_'+emision).html(`<i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i>`);
		  	 		}else{
				     $('#btn_'+emision).html(`<button  type="button" onclick="submitIngreso(${emision})" class="btn btn-sm btn-success marginB0"><i class="fa fa-file-text"></i> Facturar</button>`);
		  	 		}

					return;
				}

			},
			error: function(e){
		           $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
						$('#infoBusqueda').html('');
			    		$('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
			                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
			                    </button>
			                    <strong>¡Atención!</strong> Ocurrió un  error inténtelo nuevamente.
			                  </div>`);
			    		$('#infoBusqueda').show(200);
					    $('#btn_'+emision).html(`<button  type="button" onclick="submitIngreso(${emision})" class="btn btn-sm btn-success marginB0"><i class="fa fa-file-text"></i> Facturar</button>`);
						return;
			}
		});
	
}


function cargartablejs(data){
     $('#idtable_emisiones').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[1,'asc']],

         columns:[
         {data: "emision" },
         {data: "fecha_emision"},
         {data : "tasa"},
         {data: "anio"},
         {data: "mes" },
         {data: "total" },
         {data: "emision" },
         ],
         "rowCallback": function( row, detalle, index ){
            $('td', row).eq(6).html(`<center>
							<form >
								<div id="btn_${detalle['emision']}">
                                 <button  type="button" onclick="submitIngreso(${detalle['emision']})" class="btn btn-sm btn-success marginB0"><i class="fa fa-file-text"></i> Facturar</button>
                            	</div>
                            </form>
                            </center>`);
         } 
    })
}
function defaultabla() {
    $(`#idtable_emisiones`).DataTable( {
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

function totalemisiones(cedula){
	 $.get("/comprobantes/totalemisionesCedula/"+cedula, function(data){
	 		if(data['vacio']==true){
	 			return;
	 		}
	 		cargartablejs(data['detalle']);
	 });	
}

$('#cedulaRuc').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});

