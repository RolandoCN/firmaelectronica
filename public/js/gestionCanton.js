$(document).ready(function(){
    cargarContenidoTablas('datatablebuttons');
    cargarContenidoTablas('datatablecheckbox');
    cargarContenidoTablas('datatablefixedheader');
    
});
function cargarContenidoTablas(tabla) {
    $(`#${tabla}`).DataTable( {
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
            "infoFiltered": " - filtrado de MAX registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
        }
    }
} );
}



// ============================= GESTIONES DE PARROQUIAS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion parroquia
function canton_editar(idcanton){
    $.get("/gestionResidencia/canton/"+idcanton+"/edit", function (data) {
        console.log(data);
        $('#canton').val(data.resultado.detalleCanton);
         $('.option_canton_provincia').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#cmb_canton_provincia option[value="${data.resultado['idProvincia']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_canton_provincia").trigger("chosen:updated"); 
        
         $('#clave').val(data.resultado.codClave);
       
        
    });

    $('#method_Canton').val('PUT'); 
    $('#frm_Canton').prop('action',window.location.protocol+'//'+window.location.host+'/gestionResidencia/canton/'+idcanton);
    $('#btn_canton_provincia_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCanton').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_canton_provincia_cancelar').click(function(){
    $('#canton').val('');
    $('.option_canton_provincia').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_canton_provincia").trigger("chosen:updated"); // actualizamos el combo de zonas
    $('#clave').val('');    
    $('#method_Canton').val('POST'); 
    $('#frm_Canton').prop('action',window.location.protocol+'//'+window.location.host+'/gestionResidencia/canton/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


