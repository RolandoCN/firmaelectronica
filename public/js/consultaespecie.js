$('#frm_buscar').submit(function(e){
    e.preventDefault();
    vistacargando('m','Por favor espere...');
    $('#panel_registros').hide();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/especie/obtener',
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
            if(data['error']==false){
                cargartable(data);
                $('#panel_registros').show();
                vistacargando();
            }
    },
    error: function(e){
        vistacargando();
        alertNotificar('Ocurrió un error intente nuevamente', "error");
        return;
    }
});
});

function cargartable(data){
$('#tb_lista_tramites_tipo').html('');
$("#tabla_tipo_tramites").DataTable().destroy();
$('#tabla_tipo_tramites tbody').empty();

$.each(data['detalle'], function(i, item){
    var tramite='-----------';
    if(item['tramite']!=null){
        tramite=item['tramite']['codTramite'];
    }
    $('#tb_lista_tramites_tipo').append(`<tr role="row" class="odd">
                        <td  width="1%" colspan="1">
                            ${item['emision']['usuario']['name']}
                        </td>
                        <td  width="1%" colspan="1">
                            ${item['tipo_proceso']['descripcion']}
                        </td>
                        <td  width="1%" colspan="1">
                            ${tramite}
                        </td>
                        <td  width="1%" colspan="1">
                            ${item['fecha_registro']}
                        </td>
                        <td  width="1%" colspan="1">
                        ${item['usuario_registro']['name']}
                        </td>
                        
                    </tr>  `);
});
cargar_estilos_tabla("tabla_tipo_tramites",10);


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


function cargar_estilos_tabla(idtabla,pageLength){

$(`#${idtabla}`).DataTable({
    dom: ""
    +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
    +"<rt>"
    +"<'row'<'form-inline'"
    +" <'col-sm-6 col-md-6 col-lg-6'l>"
    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
    "destroy":true,
    order: [[ 0, "asc" ]],
    pageLength: pageLength,
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
