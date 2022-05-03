




// ============================= GESTIONES DE PARROQUIAS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion parroquia
function requisitoTipoProceso_editar(idrequisitoTipoProceso){
    $.get("/gestionRequisitoTipoProceso/requisitoTipoProceso/"+idrequisitoTipoProceso+"/edit", function (data) {
        console.log(data);
        
        $('#descRequisito').val(data.resultado.descripcion);
        $('#extensionD').val(data.resultado.extension);
        $('#maximoarchivosD').val(data.resultado.maximo_archivos);


        $('.option_listaPro').prop('selected',false);  
        $(`#cmb_requisitoTipoPro option[value="${data.resultado['idtipoProceso']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_requisitoTipoPro").trigger("chosen:updated");

         $('.cmbObligatorio').prop('selected',false);  
        $(`#cmbObligatorio option[value="${data.resultado['obligatorio']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmbObligatorio").trigger("chosen:updated"); 
 

        $('#clave').val(data.resultado.codClave);

       
        
    });

    $('#method_RequisTipoProc').val('PUT'); 
    $('#frm_RequisTipoProc').prop('action',window.location.protocol+'//'+window.location.host+'/gestionRequisitoTipoProceso/requisitoTipoProceso/'+idrequisitoTipoProceso);
    $('#btn_RequisitoTP_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorRequisTipoProc').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_RequisitoTP_cancelar').click(function(){
    $('#descRequisito').val('');
    $('#extensionD').val('');
    $('#maximoarchivosD').val('');

    $('.option_listaPro').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_requisitoTipoPro").trigger("chosen:updated"); // actualizamos el combo de zonas

    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbObligatorio").trigger("chosen:updated");

      
    $('#method_RequisTipoProc').val('POST'); 
    $('#frm_RequisTipoProc').prop('action',window.location.protocol+'//'+window.location.host+'/gestionRequisitoTipoProceso/requisitoTipoProceso/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar_RequisitoTipoProceso(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


