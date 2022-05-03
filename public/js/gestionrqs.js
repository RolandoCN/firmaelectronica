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
function rqs_editar(idcatalogoRqs){
    $.get("/gestionReclamosQuejasSugerencias/rqs/"+idcatalogoRqs+"/edit", function (data) {
        console.log(data);
        //$('#canton').val(data.resultado.detalleCanton);
        $('.option_rqs_tiporqs').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#cmb_rqs_tiporqs option[value="${data.resultado['idtipoRqs']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_rqs_tiporqs").trigger("chosen:updated"); 

        $('.option_rqs_departamento').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#cmb_rqs_departamento option[value="${data.resultado['iddepartamento']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_rqs_departamento").trigger("chosen:updated"); 
        
         $('#detalle').val(data.resultado.detalle);
       
        
    });

    $('#method_rqs').val('PUT'); 
    $('#frm_rqs').prop('action',window.location.protocol+'//'+window.location.host+'/gestionReclamosQuejasSugerencias/rqs/'+idcatalogoRqs);
    $('#btn_rqs_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCanton').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_rqs_cancelar').click(function(){
    $('#detalle').val('');
    $('.option_rqs_departamento').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_rqs_departamento").trigger("chosen:updated"); // actualizamos el combo de zonas
    $('.option_rqs_tiporqs').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_rqs_tiporqs").trigger("chosen:updated"); // actualizamos el combo de zonas
    
    $('#method_rqs').val('POST'); 
    $('#frm_rqs').prop('action',window.location.protocol+'//'+window.location.host+'/gestionReclamosQuejasSugerencias/rqs/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


