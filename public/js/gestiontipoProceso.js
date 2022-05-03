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
//FUNCIONES PARA EDITAR LOS REGISTROS ------///////////////
// Gestion parroquia
function det_TP_editar(idtipoProceso){
    vistacargando("M", "Espere...");
    $.get("/gestionTipoProceso/tipoProceso/"+idtipoProceso+"/edit", function (data) {

        vistacargando();

        $('.option_detalleTP_area').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#cmb_detalle_areaTP option[value="${data.resultado['codigoAreaDestino']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
        $("#cmb_detalle_areaTP").trigger("chosen:updated");

        $('.option_departamento').prop('selected',false); // deseleccioamos todos los departamentos
        $(`#cmb_detalle_departamento option[value="${data.resultado['iddepartamento']}"]`).prop('selected',true); // seleccionamos el departamentos
        $("#cmb_detalle_departamento").trigger("chosen:updated");

        $('.option_detalle_tipoproceso').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#cmb_detalletipoprocesoTP option[value="${data.resultado['codigoTipoProceso']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
        $("#cmb_detalletipoprocesoTP").trigger("chosen:updated");

        $('#detalleTP').val(data.resultado.descripcion);
        $('#detalle').val(data.resultado.detalle);
        $('#nombrearea').val(data.resultado.area);
        $('#guia').val(data.resultado.guia);

        //deseleccionamos los check
        $(".check_rqs").iCheck('uncheck');
        if(data.resultado.mostrar_enlinea==1){ $("#check_enlinea").iCheck('check'); }
        if(data.resultado.mostrar_intranet==1){ $("#check_intranet").iCheck('check'); }
        if(data.resultado.validar_especie_enlinea==1){ $("#check_en_val_espe").iCheck('check'); }
        if(data.resultado.validar_especie_intranet==1){ $("#check_in_val_espe").iCheck('check'); }
        //radio de seleccion validar deudas
        if(data.resultado.validar_deuda=='1'){
            $('#validar_deuda1').iCheck('check');
            $('#validar_deuda2').iCheck('uncheck');
        }
        if(data.resultado.validar_deuda=='0'){
            $('#validar_deuda2').iCheck('check');
            $('#validar_deuda1').iCheck('uncheck');
        }
        if(data.resultado.validar_especie=='1'){
            $('#validar_especie_si').iCheck('check');
            $('#validar_especie_no').iCheck('uncheck');
        }else{
            $('#validar_especie_si').iCheck('uncheck');
            $('#validar_especie_no').iCheck('check');
        }

    }).fail(function(){
        vistacargando();
    });

    $('#method_TipoProceso').val('PUT');
    $('#frm_TP').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoProceso/tipoProceso/'+idtipoProceso);
    $('#btn_TP_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorTP').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_TP_cancelar').click(function(){

    $('#detalleTP').val('');
    $('#detalle').val('');
    $('#guia').val('');
    $(".check_rqs").iCheck('uncheck');

    $('.option_detalleTP_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_detalle_areaTP").trigger("chosen:updated"); // actualizamos el combo de zonas #option_detalle_tipoproceso


    $('.option_detalle_tipoproceso').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_detalletipoprocesoTP").trigger("chosen:updated"); // actualizamos el combo de zonas

    $('#method_TipoProceso').val('POST');
    $('#frm_TP').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoProceso/tipoProceso/');
    $(this).addClass('hidden');

    $('#validar_deuda2').iCheck('check');
    $('#validar_deuda1').iCheck('uncheck');

});




//ELIMINAR CERTIFICADO
function btn_eliminar_TP(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


