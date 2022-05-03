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



// ============================= GESTIONES DE CERTIFICADO - REQUISITOS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS
// Gestion certificado
function editar_institucion(idinstitucion){
    $.get("/gestionInstitucion/institucion/"+idinstitucion+"/edit", function (data) {
        console.log(data);
        $('#codigo').val(data.resultado.idinstitucion);
        $('#institucion').val(data.resultado.detalle);
        $('#email').val(data.resultado.correo);
        $('#celular').val(data.resultado.celular);
        $('.cmbEstado').prop('selected',false);
        $(`#cmbEstado option[value="${data.resultado['estado']}"]`).prop('selected',true);
        $("#cmbEstado").trigger("chosen:updated");

    });

    $('#method_institucion').val('PUT');
    $('#frm_institucion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionInstitucion/institucion/'+idinstitucion);
    $('#btn_inst_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCerticadoRequisitos').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_inst_cancelar').click(function(){
    $('#codigo').val('');
    $('#institucion').val('');
    $('#email').val('');
    $('#celular').val('');

    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
     $('.optionsolicitud3').prop('selected',false);
    $("#cmbEstado").trigger("chosen:updated");
    $('#method_institucion').val('POST');
    $('#frm_institucion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionInstitucion/institucion/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


