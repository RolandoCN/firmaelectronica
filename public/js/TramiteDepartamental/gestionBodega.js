$(document).ready(function(){
    $('#id_tablabodega').DataTable( {
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
function Bodega_editar(id_bodega){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestion/"+id_bodega+"/edit", function (data) {
    //Mostramos los datos para editar
    console.log(data);
    $('#id_nombre').val(data.nombre);
    $('#id_ubicacion').val(data.ubicacion);

    var tipo_general=data.tipo;

    if(tipo_general=='A'){
    $('#check_general').iCheck('uncheck');
    $('#check_area').iCheck('check');
    }
    else{
      $('#check_general').iCheck('check');
      $('#check_area').iCheck('uncheck');
    }

    $('.cmb_tipobodega').prop('selected',false); 
    $(`#cmb_tipobodega option[value="${data['tipo']}"]`).prop('selected',true); 
    $("#cmb_tipobodega").trigger("chosen:updated");

    $('.option_area').prop('selected',false); // deseleccioamos todas las zonas del combo
    $(`#cmb_area option[value="${data['iddepartamento']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
    $("#cmb_area").trigger("chosen:updated"); 
   
    
    vistacargando(); // ocultamos la ventana de espera
}).fail(function(){
    // si ocurre un error
    vistacargando(); // ocultamos la vista de carga
    alert('Se produjo un error al realizar la petición. Comuniquese el problema al departamento de tecnología');
});

    $('#method_bodega').val('PUT'); // decimo que sea un metodo put
    $('#id_frmbodega').prop('action',window.location.protocol+'//'+window.location.host+'/bodega/gestion/'+id_bodega);
    $('#btn_bodegacancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#adm').offset().top},400);
}

$('#btn_bodegacancelar').click(function(){
    $('#id_nombre').val('');
    $('#id_ubicacion').val('');

    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_tipobodega").trigger("chosen:updated");
    
    $('#check_area').iCheck('uncheck');
    $('#check_general').iCheck('uncheck');

    $('.option_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo de zonas
   
    $('#method_bodega').val('POST'); // decimo que sea un metodo put
    $('#id_frmbodega').prop('action',window.location.protocol+'//'+window.location.host+'/bodega/gestion');
    $(this).addClass('hidden');
});

// function TipoDocumento_eliminar(btn){
//     if(confirm('¿Quiere eliminar el registro?')){
//         $(btn).parent('.frm_eliminar').submit();
//     }
// }

  function btn_eliminar_bodega(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
 }

    $('#check_general').on('ifChecked', function(event){
    //alert("chequeado");
    $('#check_area').iCheck('uncheck');
    $("#conten_add_departamentos").html(""); // primero limpiamos la tabla
    $('#content_departamentos').addClass('hidden');

  });
    $('#check_area').on('ifChecked', function(event){
   // alert("chequeado");
    $('#check_general').iCheck('uncheck');
    if($('#content_departamentos').hasClass('hidden') || $('#content_departamentos').is(':hidden')){
                    // quidamos la clase hidden que oculta por defecto el contenedor de actividades
    $('#content_departamentos').removeClass('hidden');
    //coultamos y mostramos con animacion
    $('#content_departamentos').hide();
    $('#content_departamentos').show(200);}
    $('.option_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo de zonas

    });
    
    $('#check_area').on('ifUnchecked', function(event){
    $('.option_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo de zonas
    $("#conten_add_departamentos").html(""); // primero limpiamos la tabla
    $('#content_departamentos').addClass('hidden');
    });

