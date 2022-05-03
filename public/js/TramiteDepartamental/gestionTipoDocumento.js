
    $(document).ready(function(){
        cargarContenidoTablas('id_tablatipodocumento');
    });

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

    function cargarContenidoTablas(idtabla) {

        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "asc" ]],
            pageLength: 20,
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
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
        $(`#${idtabla}`).find('.resp').css('width','150px');  
        $(`#${idtabla}`).find('.flex').css('display','flex');   
        $('[data-toggle="tooltip"]').tooltip();
    }


//
//Gestion Tipo Documento
//
function TipoDocumento_editar(idtipodocumento){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestion/"+idtipodocumento+"/edit", function (data) {
    //Mostramos los datos para editar
    // console.log(data);
    $('#id_descripcion').val(data.descripcion);
    $('#id_abreviacion').val(data.abreviacion);
    $('#id_estructura').val(data.estructura);
    $('#id_secuencia').val(data.secuencia);
    $('#id_prioridad').val(data.prioridad);
    $('#id_orden').val(data.orden);
    if(data.institucion=='EP'){
        $('#input_aguas').iCheck('check');
    }else{
        $('#input_aguas').iCheck('uncheck');
    }
    
    vistacargando(); // ocultamos la ventana de espera
}).fail(function(){
    // si ocurre un error
    vistacargando(); // ocultamos la vista de carga
    alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
});

    $('#method_tipodocumento').val('PUT'); // decimo que sea un metodo put
    $('#id_frmtipodocumento').prop('action',window.location.protocol+'//'+window.location.host+'/tipodocumento/gestion/'+idtipodocumento);
    $('#btn_tipodocumentocancelar').removeClass('hidden');

    // $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}

$('#btn_tipodocumentocancelar').click(function(){
    $('#id_descripcion').val('');
    $('#id_abreviacion').val('');
    $('#id_estructura').val('');
    $('#id_secuencia').val('');

    $('#method_tipodocumento').val('POST'); // decimo que sea un metodo put
    $('#id_frmtipodocumento').prop('action',window.location.protocol+'//'+window.location.host+'/tipodocumento/gestion');
    $(this).addClass('hidden');
});

// function TipoDocumento_eliminar(btn){
//     if(confirm('¿Quiere eliminar el registro?')){
//         $(btn).parent('.frm_eliminar').submit();
//     }
// }


function TipoDocumento_eliminar(idtipo_documento){
    if(!confirm("Esta seguro que quiere eliminar el Tipo de Tramite")){
        return;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        url: '/tipodocumento/gestion/'+idtipo_documento,
        type: 'DELETE',
    });
    location.reload();
}
