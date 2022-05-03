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
    "zeroRecords": "No se encontraron registros",
    "infoEmpty": "No hay registros para mostrar",
    "infoFiltered": " - filtrado de MAX registros",
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
    "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
    }
};

function cargar_estilos_tabla(idtabla,pagina=10){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "desc" ]],
        pageLength: pagina,
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

function cargartablesolicitud(data){
	$('#tb_listapagos').html('');
	$("#idtable_pagos").DataTable().destroy();
    $('#idtable_pagos tbody').empty();
    $.each(data['detalle'], function(i, item){
       
    	$('#tb_listapagos').append(`<tr role="row" class="odd">
	                        <td width="10%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
	                            ${item['fecha_pago']}
	                        </td>
	                       <td width="40%" style=" vertical-align: middle; text-align:left; font-size:12px"  class="paddingTR">
                               <b> Razón social: </b> ${item['nombres']} <br>
                               <b> Identificación: </b> ${item['identificacion']} <br>

	                        </td>
                            <td width="20%" style=" vertical-align: middle;"  class="paddingTR">
                                ${item['nro_pago']}
	                        </td>
	                        <td width="5%"  style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                $${item['valor_recaudado']}
	                        </td>
	                    </tr>  `);
    });
    $('#tablaPagos').show(200);
    cargar_estilos_tabla("idtable_pagos");
}
$('#frm_buscarPagos_pacifico').submit(function(e){
    e.preventDefault();
    vistacargando('M','Buscando información...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        url: '/bpacifico/listapagos',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;

            }
            cargartablesolicitud(data);
            $('#total_recaudado').html(`<b style="font-size:18px; color:green">Total: $${data['total']}</b>`);
            vistacargando();
        },
        error: function(e){
             alertNotificar('Ocurrio un error intente nuevamente','error');
            vistacargando();
        }
    });
});