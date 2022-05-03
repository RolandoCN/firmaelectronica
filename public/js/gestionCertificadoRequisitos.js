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

// ============================= GESTIONES DE CERTIFICADO - REQUISITOS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion certificado
function certificado_editar(idlistaCertificados){
    $.get("gestionCertificado/"+idlistaCertificados+"/edit", function (data) {
        console.log(data);
        $('#nombre_certificado').val(data.resultado.descripcion);
        $('#cod_certificado').val(data.resultado.certificado_cod);
        $('.cmbArea').prop('selected',false); 
        $(`#cmbArea option[value="${data.resultado['iddepartamento']}"]`).prop('selected',true); 
        $("#cmbArea").trigger("chosen:updated"); 
        $('#diasVigencia').val(data.resultado.diasVigencia);
        $('.cmbSolicitud').prop('selected',false); 
        $(`#cmbSolicitud option[value="${data.resultado['solicitud']}"]`).prop('selected',true); 
        $("#cmbSolicitud").trigger("chosen:updated");
        $('.cmbNotifica').prop('selected',false); 
        $(`#cmbNotifica option[value="${data.resultado['notificado']}"]`).prop('selected',true); 
        $("#cmbNotifica").trigger("chosen:updated");  
    });

    $('#method_certificado').val('PUT'); 
    $('#frm_certificado').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCertificado/'+idlistaCertificados);
    $('#btn_certificadoCancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCerticadoRequisitos').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_certificadoCancelar').click(function(){
    $('#nombre_certificado').val('');
    $('#cod_certificado').val('');
    $('#diasVigencia').val('');
    $('.optionDepartamento').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbArea").trigger("chosen:updated");
    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbSolicitud").trigger("chosen:updated");
    $('.optionnotifica1').prop('selected',false);
    $('.optionnotifica2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbNotifica").trigger("chosen:updated");
    $('#method_certificado').val('POST'); 
    $('#frm_certificado').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCertificado');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario
function requisito_editar(idrequisitos){
    $.get("gestionRequisitos/"+idrequisitos+"/edit", function (data) {

        $('#nombre_requisito').val(data.descripcion);
        //$('#tipoPersona').val(data.descripcion);
       // $('#formato').val(data.formato);
        

        $('.tipoPersona').prop('selected',false); 
        $(`#tipoPersona option[value="${data.tipoPersona}"]`).prop('selected',true); 
        $("#tipoPersona").trigger("chosen:updated");

        $('#codigo').val(data.cod);
        $('#detalle').val(data.detalle);
        


        $('.Seleccionar_tipoFP').attr("selected", false); // quitamos el selected a los seleccionados anteriormente
        $(`#Seleccionar_tipoFP option[value="${data.idtipoFP}"]`).attr("selected", true);
        $('#Seleccionar_tipoFP_chosen').children('a').children('span').html($(`#Seleccionar_tipoFP option[value="${data.idtipoFP}"]`).html());
    });

    $('#method_requisitos').val('PUT'); 
    $('#frm_requisitos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionRequisitos/'+idrequisitos);
    $('#btn_RequisitosCancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCerticadoRequisitos').offset().top},400);
}

$('#btn_RequisitosCancelar').click(function(){
    $('#nombre_requisito').val('');
    //$('#tipoPersona').val('');
    $('.optiontipo1').prop('selected',false);
    $('.optiontipo2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#tipoPersona").trigger("chosen:updated");

    $('#codigo').val('');
    $('#detalle').val('');
    $('#formato').val('');
    $('.Seleccionar_tipoFP').attr("selected", false); 
    $('#Seleccionar_tipoFP_chosen').children('a').children('span').html('Seleccione un Tipo de Funcionario');

    $('#method_requisitos').val('POST'); 
    $('#frm_requisitos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionRequisitos/');
    $(this).addClass('hidden');
});


//Gestion CERTIFICADO - REQUISITOS

// function AsignarCertificadoRequisitos_editar(idcertificados_requisitos){
//     $.get("gestionCertificadoRequisito/"+idcertificados_requisitos+"/edit", function (data) {

   
//         $('.opcion_certificado').attr("selected", false);
//         $(`#Asignacion_certificado option[value="${data.idlistaCertificado}"]`).attr("selected", true);
//         $('#Asignacion_certificado_chosen').children('a').children('span').html($(`#Asignacion_certificado option[value="${data.idlistacertificado}"]`).html());

//         $('.opcion_requisito').attr("selected", false);
//         $(`#Asignacion_requisito option[value="${data.idrequisitos}"]`).attr("selected", true);
//         $('#Asignacion_requisito_chosen').children('a').children('span').html($(`#Asignacion_requisito option[value="${data.idrequisitos}"]`).html());
        
//         $('.opcion_certificado2').attr("selected", false);
//         $(`#Asignacion_certificado2 option[value="${data.idlistaCertificado}"]`).attr("selected", true);
//         $('#Asignacion_certificado2_chosen').children('a').children('span').html($(`#Asignacion_certificado2 option[value="${data.idlistacertificado}"]`).html());

//          $('.cmbInterno').prop('selected',false); 
//         $(`#cmbInterno option[value="${data.interno}"]`).prop('selected',true); 
//         $("#cmbInterno").trigger("chosen:updated"); 
//     });

//     $('#method_asignarCertificadoRequisito').val('PUT');
//     $('#frm_asignarCertificadoRequisito').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCertificadoRequisito/'+idcertificados_requisitos);
//     $('#btn_gestionCertificadoRequisitoCancelar').removeClass('hidden');

//     $('html,body').animate({scrollTop:$('#administradorCerticadoRequisitos').offset().top},400);
// }

 function AsignarCertificadoRequisitos_editar(idcertificados_requisitos){
    $.get("gestionCertificadoRequisito/"+idcertificados_requisitos+"/edit", function (data) {
    
        console.log(data);
       
               
        $('.opcion_certificado').prop('selected',false);
        $(`#Asignacion_certificado option[value="${data.idlistacertificado}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#Asignacion_certificado").trigger("chosen:updated"); 
        
        $('.opcion_requisito').prop('selected',false);
        $(`#Asignacion_requisito option[value="${data.idrequisitos}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#Asignacion_requisito").trigger("chosen:updated"); 

        
        
        $('.opcion_certificados').prop('selected',false);
        $("#Asignacion_certificados").prop('disabled', false);
        $(`#Asignacion_certificados option[value="${data.idcertificado}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#Asignacion_certificados").trigger("chosen:updated"); 

        $('.cmbInterno').prop('selected',false); 
        $(`#cmbInterno option[value="${data.interno}"]`).prop('selected',true); 
        $("#cmbInterno").trigger("chosen:updated");

        $('.cmbObligatorio').prop('selected',false); 
        $(`#cmbObligatorio option[value="${data.obligado}"]`).prop('selected',true); 
        $("#cmbObligatorio").trigger("chosen:updated");




    
        

});

    $('#method_asignarCertificadoRequisito').val('PUT');
    $('#frm_asignarCertificadoRequisito').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCertificadoRequisito/'+idcertificados_requisitos);
    $('#btn_gestionCertificadoRequisitoCancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCerticadoRequisitos').offset().top},400);
}

$('#btn_gestionCertificadoRequisitoCancelar').click(function(){
    $('.opcion_certificado').attr("selected", false);
    $('#Asignacion_certificado_chosen').children('a').children('span').html('Seleccione un tipo de usuario');
    $('.opcion_certificados').attr("selected", false);
    $('#Asignacion_certificados_chosen').children('a').children('span').html('Seleccione un tipo de usuario');

    $('.opcion_requisito').attr("selected", false);
    $('#Asignacion_requisito_chosen').children('a').children('span').html('Seleccione una gestión');

    $('.optiontipo1').prop('selected',false);
    $('.optiontipo2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbInterno").trigger("chosen:updated");

     $('.optiontipo1').prop('selected',false);
    $('.optiontipo2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbObligatorio").trigger("chosen:updated");

    $('#method_asignarCertificadoRequisito').val('POST'); 
    //$.get("gestionCertificadoRequisito/"+idcertificados_requisitos+"/edit", function (data) {
    $('#frm_asignarCertificadoRequisito').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCertificadoRequisito');
    $(this).addClass('hidden');
   // });

});
//es para pasar el nombre del archivo seleccionado en el input del formato del requisito
$('#formato').change(function(e){
    archivo="Seleccione un archivo";
    if(this.files.length>0){ // si se selecciona un archivo
        archivo=(this.files[0].name);
        $('#nombreFormatoSeleccionado').val(archivo);
 
    }
});
