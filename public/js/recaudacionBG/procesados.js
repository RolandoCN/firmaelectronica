$('#frm_pagos_procesados').submit(function(e){
    e.preventDefault();
    $('#panel_tabla').hide(200);
    vistacargando('M','Por favor espere..');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/recaudacionBG/lista_pagos',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            
            if(data['error']==true){
                alertNotificar(data['detalle'], "error");
                vistacargando();
                return;
            }
            $('#total_procesados').html(`Total: $${data['total']}`);
            $('#panel_tabla').show(200);
            cargartable(data);
            vistacargando();
        },
        error: function(e){
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            vistacargando();
        }
    });
});

function cargartable(data){
    $('#body_pagos_procesados').html('');
    $("#table_pagos_procesados").DataTable().destroy();
    $('#table_pagos_procesados tbody').empty();
    contadorGenerado=0;
    $.each(data['detalle'], function(i, item){
        $('#body_pagos_procesados').append(`<tr role="row" class="odd">
            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                ${item['idtransaccion']} 
            </td>
            <td style=" font-size:12px"  class="paddingTR">
                <b>Identificación:</b> ${item['oblcliente']}<br>
                <b>Nombre:</b> ${item['nombre']}
            </td>
            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                ${item['fecharecaudo']} 
            </td>
            <td style="text-align:right"  class="paddingTR">
               $${item['valorpagado']} 
            </td>
        </tr>  `);
    });



    cargar_estilos_tabla("table_pagos_procesados");

}

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