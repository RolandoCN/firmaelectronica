$('#frm_buscarEmision').submit(function(){

		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#tablaEmisiones').hide();
		$('#panelInfor').hide();
		$('#ResultEmi').html('');
		$('#infoBusqueda').hide();
		
		
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/emisionesporCedulaR',
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
         order: [[5,'desc']],

         columns:[
         {data: "nro_asiento" },
         {data: "ruc" },
         {data: "factura" },
         {data: "f_emision"},
         {data : "descripcion"},
         {data: "periodo"},
         {data: "codigo_nombre"},
         
         {data: "nro_asiento" },
         ],
         "rowCallback": function( row, detalle, index ){
         	$('td', row).eq(1).css('font-size','11px')
         	$('td', row).eq(4).css('font-size','11px')

         	$('td', row).eq(1).html(`<b >Cédula o Ruc:</b> ${detalle['ruc']}<br><b>Nombres:</b> ${detalle['razonsocial']}`);
            $('td', row).eq(7).html(`<center>
							<form >
								<div id="btn_${detalle['nro_asiento']}_${detalle['factura']}">
                                 <button  type="button" onclick="submitIngreso('${detalle['nro_asiento']}','${detalle['factura']}','${detalle['ruc']}')" class="btn btn-sm btn-success marginB0"><i class="fa fa-file-text"></i> Generar</button>
                            	</div>
                            </form>
                            </center>`);
         
         } 

    })
}

function submitIngreso(asiento,factura,parametro){
		$('#btn_'+asiento+'_'+factura).html(`<button disabled=true  type="button"  class="btn btn-success"><span class="spinner-border " role="status" aria-hidden="true"></span> Generando</button>`);  
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/comprobantes/ingresarRetencion/'+asiento+'/'+factura+'/'+parametro,
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
				   $('#btn_'+asiento+'_'+factura).html(`<button  type="button" onclick="submitIngreso('${asiento}','${factura}','${parametro}')" class="btn btn-sm btn-success marginB0"><i class="fa fa-file-text"></i> Generar</button>`);

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
		  	 			$('#btn_'+asiento+'_'+factura).html(`<i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i>`);
		  	 		}else{
				     $('#btn_'+asiento+'_'+factura).html(`<button  type="button" onclick="submitIngreso('${asiento}','${factura}','${parametro}')" class="btn btn-sm btn-success marginB0"><i class="fa fa-file-text"></i> Generar</button>`);
		  	 		}

					return;
				}
			}
		});
	
}

function totalemisiones(cedula){
	 $.get("/comprobantes/totalemisionesCedulaR/"+cedula, function(data){
	 	if(data['vacio']==true){
 			return;
 		}
	 	cargartablejs(data['detalle']);
	 });	
}
$('#cedulaRuc').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});


