function cod_editar(idcodigo){
    vistacargando('m','Espere por favor...');
    $.get("/gestionCoactiva/parametrizarCodigoTributario/"+idcodigo+"/edit", function (data) {
        $('#articulo').val(data.resultado.articulo);
        $('#descripcion').val(data.resultado.descripcion);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
    

    $('#method_Codigo').val('PUT'); 
    $('#frm_Codigo').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/parametrizarCodigoTributario/'+idcodigo);
    $('#btn_cod_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCodigoTri').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_cod_cancelar').click(function(){
    $('#articulo').val('');
    $('#descripcion').val('');    
    $('#method_Codigo').val('POST'); 
    $('#frm_Codigo').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/parametrizarCodigoTributario/');
    $(this).addClass('hidden');
});

//ELIMINAR CODIGO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }

}