




// ============================= GESTIONES DE PARROQUIAS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion parroquia
function parroquia_editar(idparroquia){
    $.get("/gestionResidencia/parroquia/"+idparroquia+"/edit", function (data) {
        console.log(data);
        
        $('#parroquia').val(data.resultado.descripcion);
        $('.option_parroquia_canton').prop('selected',false);  
        $(`#cmb_parroquia_canton option[value="${data.resultado['idcanton']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_parroquia_canton").trigger("chosen:updated"); 
        $('#clave').val(data.resultado.codClave);

       
        
    });

    $('#method_Parroquia').val('PUT'); 
    $('#frm_Parroquia').prop('action',window.location.protocol+'//'+window.location.host+'/gestionResidencia/parroquia/'+idparroquia);
    $('#btn_parroquia_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorParroquia').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_parroquia_cancelar').click(function(){
    $('#parroquia').val('');
    $('.option_parroquia_canton').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_parroquia_canton").trigger("chosen:updated"); // actualizamos el combo de zonas
    $('#clave').val('');    
    $('#method_Parroquia').val('POST'); 
    $('#frm_Parroquia').prop('action',window.location.protocol+'//'+window.location.host+'/gestionResidencia/parroquia/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


