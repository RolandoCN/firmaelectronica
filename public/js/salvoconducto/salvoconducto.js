$('#frm_buscarEmision').submit(function(){

		event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Generando</button>`);  
	
		$('#panelInfor').hide();

		
		
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/salvoconducto/generarqr',
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
				    $('#panelInfor').html(` <img width="20%"  src="data:image/png;base64,${data['detalle']}"><br><a type="button" class="btn btn-warning btn-sm" href="data:image/png;base64,${data['detalle']}" download="${data['name']}"><i class="fa fa-download"></i> Descargar</a>`);
					$('#panelInfor').show(200);


				}

				
		}
	});
});

$('#temporal').on('ifChecked', function(event){
    // $('#divfechavigencia').html(`<label class="control-label col-md-3 col-sm-3 col-xs-12" >Fecha Vigencia <span class="required">*</span>
    //                         </label>
    //                         <div class="col-md-6 col-sm-6 col-xs-12">
    //                             <input type="date"  id="fechaV" name="fechaV"  required="required" class="form-control col-md-7 col-xs-12">
    //                         </div>`);
    $('#divfechavigencia').show(200);
    		
});
$('#permanente').on('ifChecked', function(event){
    $('#divfechavigencia').hide(200);
    // $('#divfechavigencia').html(``);
});

$(document).ready(function () {
  $('input#cedulaRuc')
    .keypress(function (event) {
    	 // El código del carácter 0 es 48
    // El código del carácter 9 es 57
      if (event.which < 48 || event.which > 57 || this.value.length === 10) {
        return false;
      }
    });
});


function cargarContenidoTablas(tabla) {
    $(`#${tabla}`).DataTable( {
    	'order': [[1,'asc']],
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
