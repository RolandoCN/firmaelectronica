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



//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


function tipodoc_editar(idtipodocumento_m){
    $.get("/gestionCargaDocumentos/tipoDocumentos/"+idtipodocumento_m+"/edit", function (data) {
        console.log(data);
        $('#descripcion').val(data.resultado.descripcion);
      // $('#formato').val(data.resultado.ruta);
             
});

    $('#method_TipoDoc').val('PUT'); 
    $('#frm_TipoDoc').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCargaDocumentos/tipoDocumentos/'+idtipodocumento_m);
    $('#btn_tipodoc_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorTipoDocumentos').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_tipodoc_cancelar').click(function(){
     $('#descripcion').val('');
    
    $('#frm_TipoDoc').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCargaDocumentos/tipoDocumento/');
    $(this).addClass('hidden');
});

//es para pasar el nombre del archivo seleccionado en el input del formato del requisito.
$('#formato').change(function(e){
    archivo="Seleccione un archivo";
    if(this.files.length>0){ // si se selecciona un archivo
        archivo=(this.files[0].name);
        $('#nombreFormatoSeleccionado').val(archivo);
 
    }
});


