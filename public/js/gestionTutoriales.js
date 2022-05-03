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
function tutorial_editar(idtutorial){
    $.get("/gestionTutoriales/registro/"+idtutorial+"/edit", function (data) {
        console.log(data);
        $('#titulo').val(data.resultado.titulo);
        $('#descripcion').val(data.resultado.descripcion);
        $('#url').val(data.resultado.url);
       
        
    });

    $('#method_Tutoriales').val('PUT'); 
    $('#frm_Tutoriales').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTutoriales/registro/'+idtutorial);
    $('#btn_tutoriales_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorTutoriales').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_tutoriales_cancelar').click(function(){
    $('#titulo').val('');
    $('#descripcion').val('');
    $('#url').val('');     
    $('#method_Tutoriales').val('POST'); 
    $('#frm_Tutoriales').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTutoriales/registro/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


