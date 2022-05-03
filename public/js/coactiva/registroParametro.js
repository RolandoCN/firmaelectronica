function param_editar(idcodigo){
    vistacargando('m','Espere por favor...');
    $.get("/gestionCoactiva/parametrizar/"+idcodigo+"/edit", function (data) {
        $('#descripcion').val(data.resultado.descripcion);
        $('#valor').val(data.resultado.valor);
        $('#valor2').val(data.resultado.valor2);
        $('#codigo').val(data.resultado.codigo);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
    

    $('#method_Parametro').val('PUT'); 
    $('#frm_Parametro').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/parametrizar/'+idcodigo);
    $('#btn_param_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorParametro').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_param_cancelar').click(function(){
    $('#codigo').val('');
    $('#valor').val('');
    $('#valor2').val('');
    $('#descripcion').val('');    
    $('#method_Parametro').val('POST'); 
    $('#frm_Parametro').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCoactiva/parametrizar/');
    $(this).addClass('hidden');
});

//ELIMINAR CODIGO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }

}