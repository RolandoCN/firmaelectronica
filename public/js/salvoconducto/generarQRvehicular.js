$('#frm_qrGenerar').submit(function(e){

		e.preventDefault();
		$('#infoBusqueda').hide();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Generando</button>`);  
	
		$('#panelInfor').hide();

		
		
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/salvoconducto/generarqrVehiculo',
			// data: e.serialize(),
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				console.log(data);
				
				
				if(data['error']==true){
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Generar</button>`);
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
					$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Generar</button>`);
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
				    $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Generar</button>`);
				    $('#panelInfor').html(` <img width="20%"  src="data:image/png;base64,${data['detalle']}"><br><a type="button" class="btn btn-warning btn-sm" href="data:application/pdf;base64,${data['pdf']['data']}" download="${data['name']}"><i class="fa fa-download"></i> Descargar</a>`);
					$('#panelInfor').show(200);


				}
		},
		error: function(e){
           $('#divbtnbuscar').html(`<button  id="btnBuscars" type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
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
  	 		alertNotificar('Ocurrió un error intente nuevamente', "error");
			return;
	    }
	});
});

