




// ============================= GESTIONES DE PARROQUIAS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion parroquia
function param_lina_fab_editar(idzona_parametrizacion_linea_fabrica){
    $.get("/gestionParametrosLineaFabrica/lineaFabrica/"+idzona_parametrizacion_linea_fabrica+"/edit", function (data) {
        console.log(data);
        
        $('#loteminimo').val(data.resultado.lote_minimo);
        $('#relacion_frente').val(data.resultado.relacion_frente_fondo);
        $('#frente_min').val(data.resultado.frente_minimo);
        $('#altura_maxima').val(data.resultado.altura_maxima);
        $('#num_pisos').val(data.resultado.numero_pisos);
        $('#cos').val(data.resultado.cos);
        $('#cus').val(data.resultado.cus);
        $('#observación').val(data.resultado.observacion);
        $('#frontal').val(data.resultado.frontal);
        $('#lateralderecho').val(data.resultado.lateral_derecho);
        $('#lateralizq').val(data.resultado.lateral_izquierdo);
        $('#posterior').val(data.resultado.posterior);

        $('.cmbtipo_agru').prop('selected',false);
        $(`#cmbtipo_agru option[value="${data.resultado['tipo_agrupamiento']}"]`).prop('selected',true);
        $("#cmbtipo_agru").trigger("chosen:updated");

        $('.option_lineafab_zona').prop('selected',false);  
        $(`#cmb_zona option[value="${data.resultado['idzona']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_zona").trigger("chosen:updated"); 
   
        
    });

    $('#method_Paramet_Linea_Fabr').val('PUT'); 
    $('#frm_Paramet_Linea_Fabr').prop('action',window.location.protocol+'//'+window.location.host+'/gestionParametrosLineaFabrica/lineaFabrica/'+idzona_parametrizacion_linea_fabrica);
    $('#btn_param_linea_fab_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorParamLinea').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_param_linea_fab_cancelar').click(function(){
     $('#loteminimo').val(''); 
     $('#relacion_frente').val(''); 
     $('#frente_min').val(''); 
     $('#altura_maxima').val(''); 
     $('#num_pisos').val(''); 
     $('#cos').val(''); 
     $('#cus').val(''); 
     $('#observación').val(''); 
     $('#frontal').val(''); 
     $('#lateralderecho').val(''); 
     $('#lateralizq').val(''); 
     $('#posterior').val(''); 


    $('.option_lineafab_zona').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_zona").trigger("chosen:updated"); // actualizamos el combo de zonas


    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $('.optionsolicitud3').prop('selected',false);
    $('.optionsolicitud4').prop('selected',false);
    $("#cmbtipo_agru").trigger("chosen:updated");


     
    $('#method_Paramet_Linea_Fabr').val('POST'); 
    $('#frm_Paramet_Linea_Fabr').prop('action',window.location.protocol+'//'+window.location.host+'/gestionParametrosLineaFabrica/lineaFabrica/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar_param_linea(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


