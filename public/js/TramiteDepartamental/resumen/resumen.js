$('#frm_buscartramites').submit(function(e){

    e.preventDefault();
    vistacargando('m','Por favor espere...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/tramite/consultatramites_usuarios',
        // data: e.serialize(),
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        timeout: 50000, //50 segundos
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'danger');
                vistacargando();
                return;
            }
            if(data['error']==false){
                cargartable(data);
                vistacargando();
            }	
    },
    error: function(e){
    }
});
});

function cargartable(data){
    $('#bodyresumentramites').html('');
    $("#table_resumentramites").DataTable().destroy();
    $('#table_resumentramites tbody').empty();
    $.each(data['detalle'], function(i, item){

        $('#bodyresumentramites').append(`<tr role="row" class="bg-warning">
            <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                ${i+1}
            </td>
            <td width="10%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                ${item['codTramite']}
            </td>
            <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                ${item['fechaCreacion']}
            </td>
            <td width="50%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                ${item['asunto']}
            </td>
            <td width="10%"  style="text-align: center; vertical-align: middle;"  class="paddingTR">
                <center>
                    <a onclick="descargardocumentos('${item['idtramite_encrypt']}')"  data-toggle="tooltip" data-placement="top" data-original-title="Descargar todos los documentos" type="button" class="btn btn-info btn-sm btn_icon_lg">
                        <i class="fa fa-download" >
                        </i> Descargar
                    </a>
                </center>
            </td>
        </tr>  `);
    });
    $('[data-toggle="tooltip"]').tooltip(); 
    $('#div_resumen').show();;
    cargar_estilos_tabla('table_resumentramites');
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
    "zeroRecords": "No se encontraron registros",
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
        order: [[ 1, "desc" ]],
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

function descargardocumentos(idtramite){
    swal({
        title: "",
        text: "¿Este proceso puede tardar varios minutos, debe esperar a que el documento se descargue",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            location.href = "/tramite/decargartodosdoc/"+idtramite;
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}