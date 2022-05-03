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
function tipodocumento_editar(idtipo_documento_poa){
    $.get("/gestionTipoDocumentosPoa/documentos/"+idtipo_documento_poa+"/edit", function (data) {
        console.log(data);
        $('#descripcion').val(data.resultado.descripcion);
        
       
        
    });

    $('#method_tipoDocumentos').val('PUT'); 
    $('#frm_tipoDocumento').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoDocumentosPoa/documentos/'+idtipo_documento_poa);
    $('#btn_tipodoc_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorTipoDocumentos').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_tipodoc_cancelar').click(function(){
    $('#descripcion').val('');
     
    $('#method_tipoDocumentos').val('POST'); 
    $('#frm_tipoDocumento').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoDocumentosPoa/documentos/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


