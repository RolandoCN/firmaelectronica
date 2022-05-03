$(document).ready(function(){
    $('#id_tablasecuencia').DataTable( {
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
//
//funcion para editar secuencias
function SecuenciaTramite_editar(idsecuencia){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestion/"+idsecuencia+"/edit", function (data) {
    //Mostramos los datos para editar
    //console.log(data);
    $('#anio').val(data.anio);
    $('#numero').val(data.numero);
    
    $('.TP_option').attr("selected", false);
    $(`#prioridad_secuencias option[value="${data.estado}"]`).attr("selected", true);
    $('#prioridad_secuencias_chosen').children('a').children('span').html($(`#prioridad_secuencias option[value="${data.idprioridad_tramite}"]`).html());

    
    
    vistacargando(); // ocultamos la ventana de espera
}).fail(function(){
    // si ocurre un error
    vistacargando(); // ocultamos la vista de carga
    alert('Se produjo un error al realizar la petición. Comuniquese el problema al departamento de tecnología');
});

    $('#method_secuenciatramite').val('PUT'); // decimo que sea un metodo put
    $('#id_frmSecuenciatramite').prop('action',window.location.protocol+'//'+window.location.host+'/secuenciastramite/gestion/'+idsecuencia);
    $('#btn_Secuenciacancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#adm').offset().top},400);
}

$('#btn_Secuenciacancelar').click(function(){
    $('#anio').val('');
    $('#numero').val('');
   
    $('.prioridad_secuencias').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#prioridad_secuencias").trigger("chosen:updated"); 
    
    $('#method_secuenciatramite').val('POST'); // decimo que sea un metodo put
    $('#id_frmSecuenciatramite').prop('action',window.location.protocol+'//'+window.location.host+'/secuenciastramite/gestion');
    $(this).addClass('hidden');
});

// function TipoDocumento_eliminar(btn){
//     if(confirm('¿Quiere eliminar el registro?')){
//         $(btn).parent('.frm_eliminar').submit();
//     }
// }

  function btn_eliminar_SecuenciaTramite(btn){
    if(confirm('¿Realmente desea eliminar el registro?')){
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
