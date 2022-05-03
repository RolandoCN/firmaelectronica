$(document).ready(function(){
    $('#id_tablaprioridadtramite').DataTable( {
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
//consul
//funcion para editar la información de prioridad de un tramite
function PrioridadTramite_editar(idprioridad_tramite){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestion/"+idprioridad_tramite+"/edit", function (data) {
    //Mostramos los datos para editar
    // console.log(data);
    $('#id_descripcion').val(data.descripcion);
    $('#id_codigo').val(data.codigo);
    $('#id_nivel').val(data.nivel);
   
    
    vistacargando(); // ocultamos la ventana de espera
}).fail(function(){
    // si ocurre un error
    vistacargando(); // ocultamos la vista de carga
    alert('Se produjo un error al realizar la petición. Comuniquese el problema al departamento de tecnología');
});

    $('#method_prioridadtramite').val('PUT'); // decimo que sea un metodo put
    $('#id_frmprioridadtramite').prop('action',window.location.protocol+'//'+window.location.host+'/prioridadtramite/gestion/'+idprioridad_tramite);
    $('#btn_prioridadtramitecancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#adm').offset().top},400);
}

$('#btn_prioridadtramitecancelar').click(function(){
    $('#id_descripcion').val('');
    $('#id_codigo').val('');
   
    $('#method_prioridadtramite').val('POST'); // decimo que sea un metodo put
    $('#id_frmprioridadtramite').prop('action',window.location.protocol+'//'+window.location.host+'/prioridadtramite/gestion');
    $(this).addClass('hidden');
});

// function TipoDocumento_eliminar(btn){
//     if(confirm('¿Quiere eliminar el registro?')){
//         $(btn).parent('.frm_eliminar').submit();
//     }
// }

  function btn_eliminar_prioridadtramite(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
 }



// function PrioridadTramite_eliminar(idprioridad_tramite){
//     if(!confirm("Esta seguro que quiere eliminar la información")){
//         return;
//     }
//     $.ajaxSetup({
//         headers: {
//             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//         }
//     });

//     $.ajax({
//         url: '/prioridadtramite/gestion/'+idprioridad_tramite,
//         type: 'DELETE',
//     });
//     location.reload();
// }
