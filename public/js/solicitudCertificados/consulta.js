$('#frm_buscar').submit(function(){
	    event.preventDefault();
		$('#divbtnbuscar').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  
		$('#panelInformacion').hide(200);
		$('#panelPendientes').hide(200);
		$('#panelGenerados').hide(200);
		$('#panelOrdenes').hide(200);

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/solicitudCertificado/consultaemisiones',
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				if(data['error']==true){
					
					alertNotificar(data['detalle'], "error");
				
				}
				if(data['error']==false){
					if(data['detalle']['nombre']!=''){
						var razonsocial=data['detalle']['nombre'];
					}else{
						var razonsocial='--------';
					}
					if(data['detalle']['ciu']!=''){
						var ciu=data['detalle']['ciu'];
					}else{
						var ciu='--------';
					}
					if(data['detalle']['direccion']!=''){
						var direccion=data['detalle']['direccion'];
					}else{
						var direccion='--------';
					}


						$('#bodyInformacionCont').html(`
		                    <div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Razon Social: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${razonsocial}</p>
		                            <input id="razonsocialInput" type="hidden" value="${razonsocial}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >CIU: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${ciu}</p>
		                            <input  type="hidden" value="${ciu}">
		                        </div>
		                    </div>
		                    <div class="form-group">
		                        <label class="control-label col-md-3 col-sm-4 col-xs-12" >Dirección: 
		                        </label>
		                        <div class="col-md-9 col-sm-9 col-xs-12">
		                            <p >${direccion}</p>
		                            <input  type="hidden" value="${direccion}">
		                        </div>
		                    </div>
		                     

	                    `);
	                    cargartableGenerados(data['Generados']);
	                    cargartablePendientes(data['Pendientes']);
	                    cargartableOrdenes(data['Ordenes'],razonsocial);

	                    
						// $('#panelEstablecimientosAtc').show(200);
					
					$('#panelInformacion').show(200);
					$('#panelPendientes').show(200);
					$('#panelGenerados').show(200);
					$('#panelOrdenes').show(200);


				}
				$('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);
				

				
		},
		error: function(e){
	           $('#divbtnbuscar').html(`<button  type="submit" class="btn btn-primary"><span class="fa fa-search"></span> Buscar</button>`);

	  	 		alertNotificar('Ocurrió un error intente nuevamente', "error");
				return;
	    }
	});
});


function cargartableGenerados(data){
	$('#tb_listaGeneradosBody').html('');
	$("#TablaGenerados").DataTable().destroy();
    $('#TablaGenerados tbody').empty();
    if(data.length==0){
		$('#tb_listaGeneradosBody').html(`<tr><td colspan=7><div style="color:black; background-color:#faebcc" class="alert alert-dismissible " role="alert" >
                                        <strong>MENSAJE!</strong> <span id="mensaje_info_edit">El contribuyente no tiene certificados generados.</span>
                                    </tr></td></div>`);
		$('#tb_listaGeneradosBody').show(200);
		return;
	}
    $.each(data, function(i, item){

    	if(item['emision']!=null){
    		var emision=item['emision']['idEmision'];
    	}else{
    		var emision='';
    	}


    	if(item['fechaAprobacion']!=null){
    		var fechaAprobacion=item['fechaAprobacion'];
    	}else{
    		var fechaAprobacion='';
    	}
    	$('#tb_listaGeneradosBody').append(`<tr role="row" class="odd">
	                        <td  colspan="1">
	                            ${i+1}
	                        </td>
	                        <td>
	                        	${emision}
	                        </td>
	                        <td style="font-size: 12px" >
	                            ${item['fechaSolicitud']}
	                        </td>
	                         <td style="font-size: 12px" >
	                            ${fechaAprobacion}
	                        </td>
	                        <td>
	                        	${item['vigencia']}
	                        </td>
	                        <td>
	                        	${item['lista_certificados']['descripcion']}
	                        </td>
	                    

	                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                <center>
                                    <a type="button" class="btn btn-sm btn-success " target="_blank" href="/solicitudCertificado/buscarDocumento/${item['codRastreo']}">
                                            <i class="fa fa-download" >
                                                
                                            </i> Descargar
                                        </a>
                                </center>
                            </td>
	                    </tr>  `);

    	
	    	

    });
    cargar_estilos_tabla("TablaGenerados");
   

}

function cargartableOrdenes(data,razonsocial){
	$('#tb_listaOrdenesBody').html('');
	$("#TablaOrdenes").DataTable().destroy();
    $('#TablaOrdenes tbody').empty();
    if(data.length==0){
		$('#tb_listaOrdenesBody').html(`<tr><td colspan=7><div style="color:black; background-color:#faebcc" class="alert alert-dismissible " role="alert" >
                                        <strong>MENSAJE!</strong> <span id="mensaje_info_edit">El contribuyente no tiene ordenes de pagos pendientes.</span>
                                    </tr></td></div>`);
		$('#tb_listaOrdenesBody').show(200);
		return;
	}
    $.each(data, function(i, item){

    	if(item['emision']!=null){
    		var emision=item['emision']['idEmision'];
    	}else{
    		var emision='';
    	}
    	$('#tb_listaOrdenesBody').append(`<tr role="row" class="odd">
	                        <td  colspan="1">
	                            ${i+1}
	                        </td>
	                        <td style="font-size: 12px" >
	                            ${item['emi01codi']}
	                        </td>
	                        <td>
	                        	${item['anio']}
	                        </td>
	                        <td>
	                        	${item['fecha_emision']}
	                        </td>
	                        <td>
	                        	${item['fecha_maxima_pago']}
	                        </td>
	                        <td>
	                        	${item['valor']}
	                        </td>

	                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                <center>
                                    <a type="button" class="btn btn-sm btn-success " target="_blank" href="/solicitudCertificado/ordenPDF/${item['idEncrypt']}/${razonsocial}">
                                            <i class="fa fa-download" >
                                                
                                            </i> Descargar
                                        </a>
                                </center>
                            </td>
	                    </tr>  `);
    });
    cargar_estilos_tabla("TablaOrdenes");
}


function cargartablePendientes(data){
	$('#tb_listaPendientesBody').html('');
	$("#TablaPendientes").DataTable().destroy();
    $('#TablaPendientes tbody').empty();
    if(data.length==0){
		$('#tb_listaPendientesBody').html(`<tr><td colspan=5><div style="color:black; background-color:#faebcc" class="alert alert-dismissible " role="alert" >
                                        <strong>MENSAJE!</strong> <span id="mensaje_info_edit">El contribuyente no tiene certificados pendientes.</span>
                                    </tr></td></div>`);
		$('#tb_listaPendientesBody').show(200);
		return;
	}
    $.each(data, function(i, item){
    	if(item['emision']!=null){
    		var emision=item['emision']['idEmision'];
    	}else{
    		var emision='';
    	}
    	if(item['turno'].length>0){                             
           var informacionAdicional=`<p>Se ha generado un turno para inspecci&oacute;n con el siguiente detalle: </p>
          
            <table>
                 <tr>
                    <td><strong>Establecimiento: </strong></td>
                    <td id="fecha">${item['establecimientoresponsable']['nombreComercial']}</td>
                </tr>
                <tr>
                    <td><strong>Fecha: </strong></td>
                    <td id="fecha">${item['turno'][0]['agenda']['fechaAgenda']}</td>
                </tr>
                <tr>
                    <td><strong>Hora: </strong></td>
                    <td id="hora">${item['turno'][0]['horaInicio']} -${item['turno'][0]['horaFin']}</td>
                </tr>

                <tr>
                    <td><strong>Técnico asignado: </strong></td>
                    <td id="tecnico">
                    	${item['turno'][0]['agenda']['inspector']['persona']['name']}
                    </td>
                </tr>
                <tr>
                    <td><strong>Número contacto: </strong></td>
                    <td id="numeroContacto">
                    	${item['turno'][0]['agenda']['inspector']['persona']['telefono']}
                    </td>
                </tr>
            </table>`
        }else{
        	var informacionAdicional='';
        }
    	$('#tb_listaPendientesBody').append(`<tr role="row" class="odd">
	                        <td  colspan="1">
	                            ${i+1}
	                        </td>
	                        <td style="font-size: 12px" >
	                            ${emision}
	                        </td>
	                        <td style="font-size: 12px" >
	                            ${item['fechaSolicitud']}
	                        </td>
	                        <td>
	                        	${item['lista_certificados']['descripcion']}
	                        </td>
	                        <td>
	                        	${informacionAdicional}
	                        </td>
	                    </tr>  `);
    });
    cargar_estilos_tabla("TablaPendientes");
   

}




//ESTILOS DE TABLA

    var lenguajeTabla = {
        "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                    '<option value="5">5</option>'+
                    '<option value="10">10</option>'+
                    '<option value="20">20</option>'+
                    '<option value="30">30</option>'+
                    '<option value="40">40</option>'+
                    '<option value="-1">Todos</option>'+
                    '</select> registros',
        "search": "Buscar:",
        "searchPlaceholder": "Ingrese un criterio de busqueda",
        "zeroRecords": "No se encontraron registros coincidentes",
        "infoEmpty": "No hay registros para mostrar",
        "infoFiltered": " - filtrado de MAX registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        }
    };


function cargar_estilos_tabla(idtabla){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "asc" ]],
        pageLength: 10,
        sInfoFiltered:false,
        "language": lenguajeTabla
    });

    // para posicionar el input del filtro
    $(`#${idtabla}_filter`).css('float', 'left');
    $(`#${idtabla}_filter`).children('label').css('width', '100%');
    $(`#${idtabla}_filter`).parent().css('padding-left','0');
    $(`#${idtabla}_wrapper`).css('margin-top','10px');
    $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
    $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
    //buscamos las columnas que deceamos que sean las mas angostas
    $(`#${idtabla}`).find('.col_sm').css('width','1px');
    $(`#${idtabla}`).find('.resp').css('width','150px');  
    $(`#${idtabla}`).find('.flex').css('display','flex');   
    $(`#${idtabla}`).find('.tdPersonal').css('width','50px');  
    $('[data-toggle="tooltip"]').tooltip();
    
}





$('#cedula').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});












 






