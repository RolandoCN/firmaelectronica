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

// $('#cmbTipo').on('change', function() {
//   //alert( this.value );
//    //$('cmb_certRecom_actividad').removeAttr('disabled');
//   if($("#cmbTipo").val() == "Especifica"){
//       alert("Especifica");
//         $("#cmb_certRecom_actividad").disabled=true;
//       }else{
//         $('#cmb_certRecom_actividad').prop('disabled', false);
//         $('#cmb_certRecom_actividad').prop('disabled', 'disabled');
//         alert("Global");
//       }


//    $("cmb_certRecom_actividad").prop('disabled', 'disabled');
//   // if(this.value=='Especifica')
//   // {
//   //   alert("SSds");
//   //    $('#cmb_certRecom_actividad').removeAttr('disabled');
//   // }
  
// });



// ============================= GESTIONES DE CERTIFICADO RECOMENDACIONES =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion parroquia
function certRecom_editar(idcertRecomendaciones){
    $.get("/gestionCertificadoRecomendacion/certificadoRecomendacion/"+idcertRecomendaciones+"/edit", function (data) {
        console.log(data);
        $('#especificacion').val(data.resultado.descripcionEspec);

        $('.option_certRecom_certificado').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#cmb_certRecom_certificado option[value="${data.resultado['idlistaCertificados']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_certRecom_certificado").trigger("chosen:updated"); 

         $("#cmb_certRecom_actividad").prop('disabled', false);
        $('.option_certRecom_actividad').prop('selected',false); // deseleccioamos todas las zonas del combo
        $(`#cmb_certRecom_actividad option[value="${data.resultado['idactividades']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_certRecom_actividad").trigger("chosen:updated"); 

        $('.cmbTipo').prop('selected',false); 
        $(`#cmbTipo option[value="${data.resultado['TipoEspecificaciones']}"]`).prop('selected',true); 
        $("#cmbTipo").trigger("chosen:updated"); 
        
        
       
        
    });

    $('#method_CertRecom').val('PUT'); 
    $('#frm_CertRecom').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCertificadoRecomendacion/certificadoRecomendacion/'+idcertRecomendaciones);
    $('#btn_certifRecomendacion_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorCertRec').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_certifRecomendacion_cancelar').click(function(){
    $('#especificacion').val('');
    $('.option_certRecom_actividad').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_certRecom_actividad").trigger("chosen:updated"); // actualizamos el combo de zonas
    
    $('.option_certRecom_certificado').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_certRecom_certificado").trigger("chosen:updated"); // actualizamos el combo de zonas

    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbSolicitud").trigger("chosen:updated");

    $('#method_CertRecom').val('POST'); 
    $('#frm_CertRecom').prop('action',window.location.protocol+'//'+window.location.host+'/gestionCertificadoRecomendacion/certificadoRecomendacion/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar_cert(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion Requisitos con el tipo de funcionario


