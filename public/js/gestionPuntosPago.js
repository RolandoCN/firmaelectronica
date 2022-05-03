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
function puntospago_editar(idpuntospago){
    $.get("/gestionPuntosPago/puntosPago/"+idpuntospago+"/edit", function (data) {
        console.log(data);
        $('#institucion').val(data.resultado.descripcion);
        $('#direccion').val(data.resultado.direccion);
       
        
    });

    $('#method_PuntosPago').val('PUT'); 
    $('#frm_PuntosPago').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPuntosPago/puntosPago/'+idpuntospago);
    $('#btn_puntospago_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorPuntosPago').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_puntospago_cancelar').click(function(){
    $('#institucion').val('');
    $('#direccion').val('');    
    $('#method_PuntosPago').val('POST'); 
    $('#frm_PuntosPago').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPuntosPago/puntosPago/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


