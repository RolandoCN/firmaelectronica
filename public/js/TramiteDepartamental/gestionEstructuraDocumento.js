$(document).ready(function(){
    $('#id_tablaestructuradocumento').DataTable( {
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
               "infoFiltered": " - filtrado de _MAX_ registros",
               "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
               "paginate": {
                   "previous": "Anterior",
                   "next": "Siguiente"
           }
       }
} );
});


//
//Gestion Estructura Documento
//
function TipoTarea_editar(idestructuradocumento){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestion/"+idestructuradocumento+"/edit", function (data) {
        //Mostramos los datos para editar
        $('#id_descripcion').val(data.descripcion);

        $('.TP_option').attr("selected", false);
        $(`#id_estado option[value="${data.estado}"]`).attr("selected", true);
        $('#id_estado_chosen').children('a').children('span').html($(`#id_estado option[value="${data.estado}"]`).html());

        vistacargando(); // ocultamos la ventana de espera
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_estructuradocumento').val('PUT'); // decimo que sea un metodo put
    $('#id_estructuradocumento').prop('action',window.location.protocol+'//'+window.location.host+'/estructuradocumento/gestion/'+idestructuradocumento);
    $('#btn_tipotareacancelar').removeClass('hidden');

    // $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}

$('#btn_estructuradocumentocancelar').click(function(){
    $('#id_anio').val('');
    $('#id_secuencia').val('');
    $('#id_anio').val('');

    $('.TP_option').attr("selected", false); 
    $('#TP_tipodocumento').children('a').children('span').html('Seleccione un departamento');

    $('#method_tipotarea').val('POST'); // decimo que sea un metodo put
    $('#id_frmtipotarea').prop('action',window.location.protocol+'//'+window.location.host+'/tipotarea/gestion');
    $(this).addClass('hidden');
});

function modalNuevoAnio(){
    $('#modal_NuevoAnio').modal('show');
}

// $('#frm_NuevoAnio').on('submit', function(e){
//     $('#modal_NuevoAnio').modal('hide');
//         vistacargando('M','Espere...'); // mostramos la ventana de espera
//         e.preventDefault();

//         $.ajaxSetup({
//         headers: {
//             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//                 }
//         });

//         $.ajax({
//             url: '/estructuradocumento/AnioNuevo', // Url que se envia para la solicitud esta en el web php es la ruta
//             method: "POST",             // Tipo de solicitud que se enviará, llamado como método
//             dataType:'json',
//             data: new FormData(this),
//             contentType:false,
//             cache:false,
//             processData:false, 
//             // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
//             success: function(request) {
//                 vistacargando(); // ocultamos la vista de carga
                
//                 new PNotify({
//                     title: 'Mensaje de Información',
//                     text: request.mensaje,
//                     type: request.status,
//                     hide: true,
//                     delay: 2000,
//                     styling: 'bootstrap3',
//                     addclass: ''
//                 });
//                 // recargamos la tabla de periodos
//                 // location.reload();
//             },
//             error: function(request) {
//                 vistacargando(); // ocultamos la vista de carga
                
//                 new PNotify({
//                     title: 'Mensaje de Información',
//                     text: request.mensaje,
//                     type: request.status,
//                     hide: true,
//                     delay: 2000,
//                     styling: 'bootstrap3',
//                     addclass: ''
//                 });
//                 // recargamos la tabla de periodos
//             }
//         }); 
//     });

function codigoDocEditar(idestructuradocumento){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("/estructuradocumento/gestion/"+idestructuradocumento+"/edit", function (data) {
        //Mostramos los datos para editar
        $('#id_anio').val(data.detalle['anio']);
        $('#id_secuencia').val(data.detalle['secuencia']);
        $('.TP_option').prop('selected',false); 
        
        $(`#TP_tipodocumento option[value="${data.detalle['idtipo_documento']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#TP_tipodocumento").trigger("chosen:updated"); 

        $('.TP_optionDe').prop('selected',false); 
        $(`#TP_departamento option[value="${data.detalle['iddepartamento']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#TP_departamento").trigger("chosen:updated"); 

        vistacargando(); // ocultamos la ventana de espera

    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_estructuradocumento').val('PUT'); // decimo que sea un metodo put
    $('#id_frmestructuradocumento').prop('action',window.location.protocol+'//'+window.location.host+'/estructuradocumento/gestion/'+idestructuradocumento);
    // $('#btn_estructuracancelar').html(`<button type="button"  onclick="modalNuevoAnio()" class="btn btn-success"><i class="fa fa-arrow-up"></i> Actualizar</button>
    //   `);
    $('#btn_modalNuevoAnio').addClass('hidden');
    $('#btnCancelarFormato').removeClass('hidden'); // mostramos el boton cancelar
    $('html,body').animate({scrollTop:$('#administradorEstuctura').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btnCancelarFormato').click(function(){
    $('#id_anio').val('');
    $('#id_secuencia').val('');

    $('.TP_option').prop('selected',false); 
    $("#TP_tipodocumento").trigger("chosen:updated"); 

    $('.TP_optionDe').prop('selected',false); 
    $("#TP_departamento").trigger("chosen:updated"); 

    $('#btn_modalNuevoAnio').removeClass('hidden');
    $('#btnCancelarFormato').addClass('hidden');

    $('#method_estructuradocumento').val('POST'); 
    $('#id_frmestructuradocumento').prop('action',window.location.protocol+'//'+window.location.host+'/estructuradocumento/gestion/');
});

function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

