$(document).ready(function () {
        cargar_estilos_tabla('tableVehiculos');
        $('#tbodyVehiculos').html(`<tr><td align="center" colspan="7"><span class="spinner-border " role="status" aria-hidden="true"></span> Cargando Información</td></tr>`); 
        cargarListaVehiculo();
        cargarContenidoTablasGenerados('tablaSalvoconductoGenerados');

});

function cargarContenidoTablasGenerados(tabla) {
    $(`#${tabla}`).DataTable( {
    	'order': [[1,'desc']],
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
    $('[data-toggle="tooltip"]').tooltip();
    
}

    function cargarListaVehiculo(){
        $.get('/salvoconducto/listaVehiculos',function(data){
            cargartableVehiculos(data);
        });
    }

    
    // $(document).ready(function () {
    //     $(`#tableVehiculos`).DataTable({
    //         pageLength: 10,
    //         order: [[0,'desc']],
    //         "language": lenguajeTabla
    //     });
    //     cargar_estilos_tabla('tableVehiculos');

    //     $.get('/salvoconducto/listaVehiculos',function(data){
    //         cargartableVehiculos(data);
    //     });
    // });



$('#frm_Vehiculo').submit(function(e){
        e.preventDefault();
        $('#btnGuardar').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Registrando Vehiculo`); 
        $('#btnGuardar').prop('disabled',true); 
        
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: '/salvoconducto/vehiculos',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            success: function(data){
                
                if(data['error']==true){
                    $('#btnGuardar').prop('disabled',false); 
                    $('#btnGuardar').html(`<span class="fa fa-save"></span> <b>Registrar Vehículo</b>`); 
                    alertNotificar(data['detalle'], "error");
                    return;
                }
                if(data['error']==false){
                    cargarListaVehiculo();
                    alertNotificar(data['detalle'],'success');
                }
                $('#btnGuardar').prop('disabled',false); 
                $('#btnGuardar').html(`<span class="fa fa-save"></span> <b>Registrar Vehículo</b>`); 
                limpiarcampos();

                
        },
        error: function(e){
            $('#btnGuardar').prop('disabled',false); 
            $('#btnGuardar').html(`<span class="fa fa-save"></span> <b>Registrar Vehículo</b>`); 
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            return;
        }
    });
});

function cargartableVehiculos(data){
	$('#tbodyVehiculos').html('');
	$("#tableVehiculos").DataTable().destroy();
    $('#tableVehiculos tbody').empty();
    $.each(data['detalle'], function(i, item){
        if(item['placa']!=null){var placa=item['placa']; }else{var placa='--';}
        if(item['numero']!=null){var numero=item['numero']; }else{var numero='--';}
        if(item['color']!=null){var color=item['color']; }else{var color='--';}
        if(item['modelo']!=null){var modelo=item['modelo']; }else{var modelo='--';}
        if(item['marca']!=null){var marca=item['marca']; }else{var marca='--';}
        if(item['servicio']!=null){var servicio=item['servicio']; }else{var servicio='--';}
        if(item['tipo']!=null){var tipo=item['tipo']; }else{var tipo='--';}

    	$('#tbodyVehiculos').append(`<tr role="row" class="odd">
	                       <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
	                        	${placa}
	                        </td>
	                        <td style=" vertical-align: middle;"  class="paddingTR">
	                            ${numero}
                            </td>
                            <td style=" vertical-align: middle;"  class="paddingTR">
	                            ${tipo}
	                        </td>
	                        <td style=" vertical-align: middle; "  class="paddingTR">
	                            ${marca}
	                        </td>
	                        <td style="vertical-align: middle; text-align:center"  class="paddingTR">
	                        	${servicio}
                            </td>
                            <td style="vertical-align: middle; text-align:center"  class="paddingTR">
                                ${modelo}
                            </td>
                            <td style="vertical-align: middle; text-align:center"  class="paddingTR">
                                ${color}
                            </td>
	                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                <center>
                                    <button type="button" class="btn btn-sm btn-danger marginB0" onClick="eliminacionVehiculo(${item['idsalvoconducto_vehiculo']})">
                                            <i class="fa fa-trash" ></i> 
                                    </button>
                                </center>
	                        </td>
	                        
	                    </tr>  `);
    });
    cargar_estilos_tabla('tableVehiculos');
}


function eliminacionVehiculo(id){
        swal({
            title: "",
            text: "¿Está seguro de eliminar este vehículo?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-sm btn-info",
            cancelButtonClass: "btn-sm btn-danger",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que si
                acccioneliminarVehiculo(id);
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
}

function acccioneliminarVehiculo(id){
    vistacargando("M",'Eliminando Vehículo');
    $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

    $.ajax({
        type: "DELETE",
        url: '/salvoconducto/vehiculos/'+id,
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){ 
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                return;
            }
            if(data['error']==false){
                cargarListaVehiculo();
            }
            vistacargando();
        }
    }); 
}

function limpiarcampos(){
    $('#placa').val('');
    $('#modelo').val('');
    $('#marca').val('');
    $('#servicio').val('');
    $('#numero').val('');
    $('#color').val('');
}


