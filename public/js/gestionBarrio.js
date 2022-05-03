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



// ============================= GESTIONES DE BARRIOS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion barrios
function barrio_editar(idbarrio){
    $.get("/gestionBarrio/barrio/"+idbarrio+"/edit", function (data) {
        console.log(data);
        $('#barrio').val(data.resultado.descripcion);
        $('.option_parroquia').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#parroquia option[value="${data.resultado['idparroquia']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#parroquia").trigger("chosen:updated"); 
        $('#coordenadax').val(data.resultado.x);
        $('#coordenaday').val(data.resultado.y);
        
        
       
        
    });

    $('#method_Barrio').val('PUT'); 
    $('#frm_Barrio').prop('action',window.location.protocol+'//'+window.location.host+'/gestionBarrio/barrio/'+idbarrio);
    $('#btn_barrio_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorBarrio').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_barrio_cancelar').click(function(){
    $('#barrio').val('');
    $('.option_parroquia').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#parroquia").trigger("chosen:updated"); // actualizamos el combo de parroquias
    $('#coordenadax').val('');  
    $('#coordenaday').val('');   
    $('#method_Barrio').val('POST'); 
    $('#frm_Barrio').prop('action',window.location.protocol+'//'+window.location.host+'/gestionBarrio/barrio/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


