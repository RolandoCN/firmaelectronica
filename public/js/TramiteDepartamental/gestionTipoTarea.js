$(document).ready(function(){
    $('#id_tablatipotarea').DataTable( {
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
//Gestion Tipo Tarea
//
function TipoTarea_editar(idtipotarea){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestion/"+idtipotarea+"/edit", function (data) {
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

    $('#method_tipotarea').val('PUT'); // decimo que sea un metodo put
    $('#id_frmtipotarea').prop('action',window.location.protocol+'//'+window.location.host+'/tipotarea/gestion/'+idtipotarea);
    $('#btn_tipotareacancelar').removeClass('hidden');

    // $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}

$('#btn_tipotareacancelar').click(function(){
    $('#id_descripcion').val('');

    $('.TP_option').attr("selected", false); 
    $('#id_estado_chosen').children('a').children('span').html('Seleccione un departamento');

    $('#method_tipotarea').val('POST'); // decimo que sea un metodo put
    $('#id_frmtipotarea').prop('action',window.location.protocol+'//'+window.location.host+'/tipotarea/gestion');
    $(this).addClass('hidden');
});