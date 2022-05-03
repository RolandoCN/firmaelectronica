




// ============================= GESTIONES DE PARROQUIAS =================================
//FUNCIONES PARA EDITAR LOS REGISTROS
// Gestion parroquia
function consDep_editar(idpoa_DepConsolidado){
    $.get("/poaConsolidacionDepartamento/consolidacion/"+idpoa_DepConsolidado+"/edit", function (data) {
        console.log(data);


        $('.option_depPadre').prop('selected',false);
        $(`#cmb_depPadre option[value="${data.resultado['iddepartamentopadre']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
        $("#cmb_depPadre option").trigger("chosen:updated");

        $('.option_depHijo').prop('selected',false);
        $(`#cmb_depHijo option[value="${data.resultado['iddepartamentohijo']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
        $("#cmb_depHijo").trigger("chosen:updated");

        $('.cmbEstado').prop('selected',false);
        $(`#cmbEstado option[value="${data.resultado['estado']}"]`).prop('selected',true);
        $("#cmbEstado").trigger("chosen:updated");





    });

    $('#method_ConsDep').val('PUT');
    $('#frm_Cons_Dep').prop('action',window.location.protocol+'//'+window.location.host+'/poaConsolidacionDepartamento/consolidacion/'+idpoa_DepConsolidado);
    $('#btn_ConsDep_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorConsDep').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_ConsDep_cancelar').click(function(){

    $('.option_depPadre').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_depPadre").trigger("chosen:updated"); // actualizamos el combo de zonas

    $('.option_depHijo').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_depHijo").trigger("chosen:updated"); // actualizamos el combo de zonas

    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbEstado").trigger("chosen:updated");

    $('#method_ConsDep').val('POST');
    $('#frm_Cons_Dep').prop('action',window.location.protocol+'//'+window.location.host+'/poaConsolidacionDepartamento/consolidacion/');
    $(this).addClass('hidden');
});

//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

 //funcion para cuando se da clic o elije una opcion del combo certificado ascociado(Asignacion_certificados)
    $('#cmb_depHijo').on('change', function() {


    //compara si ambos certificados son iguales
    if($("#cmb_depHijo").val() == $("#cmb_depPadre").val()){
    // si lo son muestra un sms
       $.iaoAlert({msg: "Departamento repetido, elija otro",
            type: "error",
            mode: "dark",})
       $('.option_depHijo').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmb_depHijo").trigger("chosen:updated"); // actualizamos el combo de zonas

    }

     else{
     var dato=$('#cmb_depHijo').val();

     $.get('/poaConsolidacionDepartamento/consolidacion/'+dato, function(data){
       console.log(data);
       if(data.resultado=="")
       {
        //alert("nulo");
       }
       else{
          $.iaoAlert({msg: "Departamento supervisado ya registrado, elija otro",
            type: "error",
            mode: "dark",})
       $('.option_depHijo').prop('selected',false); // deseleccionamos las zonas seleccionadas
       $("#cmb_depHijo").trigger("chosen:updated"); // actualizamos el combo de zonas

       }


     }).fail(function(){


    });

    }



 });


//Gestion Requisitos con el tipo de funcionario


