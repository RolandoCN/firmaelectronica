



 
    $( "#cedulasolicitante" ).blur(function() {
       // alert( "hjsdhsd" );
       var cedulasolicitante = $("#cedulasolicitante").val();
       console.log('d1: '+cedulasolicitante);
       $.get('/gestionPropiedad/buscarUsuario/'+cedulasolicitante, function(data){
            console.log(data[9].valor);
           // $('#nombresolicitante').val()=data[9].valor;
           $('#nombresolicitante').val(data[9].valor);

      }).fail(function(){
                
        $.iaoAlert({msg: "Cedula del solicitante no encontrada",
            type: "error",
            mode: "dark",})
        $('#cedulasolicitante').val('');
        $('#cedulasolicitante').focus();
        $('#nombresolicitante').val('');


    });



  });


  $( "#cedulapropietario" ).blur(function() {
       // alert( "hjsdhsd" );
       var cedulapropietario = $("#cedulapropietario").val();
       console.log('d1: '+cedulapropietario);
       $.get('/gestionPropiedad/buscarUsuario/'+cedulapropietario, function(data){
            console.log(data[9].valor);
           // $('#nombresolicitante').val()=data[9].valor;
           $('#nombrepropietario').val(data[9].valor);

            // if(data[9].valor=='')
            // {
            //   alert("dsdsd");
            // }
        
    }).fail(function(){
      //$('#cedulapropietario').selected();
         
    $.iaoAlert({msg: "Cedula del propietario no encontrada",
            type: "error",
            mode: "dark",})
    $('#cedulapropietario').val('');
    $('#cedulapropietario').focus();
    $('#nombrepropietario').val('');
    });



      //alert("We");
    });

  
function vermodal(idsolicitudVentanilla){
    $.get("/gestionPropiedad/solicitud/"+idsolicitudVentanilla+"/show", function (data) {
        console.log(data);
        
    });

    
}

   ///FUNCIONES PARA EDITAR LOS REGISTROS 
///Gestion sollicitud_ventanilla
function solicitudes_editar(idsolicitudVentanilla){
  vistacargando('M','Espere');
    $.get("/gestionPropiedad/solicitud/"+idsolicitudVentanilla+"/edit", function (data) {
        console.log(data);

        $('#cedulasolicitante').val(data.resultado.cedulaSolicitante);
        $('#cedulapropietario').val(data.resultado.cedulaPropietario);
        $('#nombresolicitante').val(data.datoPersona[9].valor);
        $('#nombrepropietario').val(data.datoPersonaPropietario[9].valor);
    

        $('.option_solicitud_certificado').prop('selected',false); //
         $(`#cmb_solicitud_certificado option[value="${data.resultado['idlistaCertificados']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_solicitud_certificado").trigger("chosen:updated");

         $('.option_solicitud_institucion').prop('selected',false); //
         $(`#cmb_solicitud_institucion option[value="${data.resultado['idinstitucion']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmb_solicitud_institucion").trigger("chosen:updated"); 
 

        $('.option_solicitud1').prop('selected',false); //
        $('.option_solicitud2').prop('selected',false); //
         $(`#cmbSolicitante option[value="${data.resultado['tipoSolicitante']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
        $("#cmbSolicitante").trigger("chosen:updated"); 
        
        $('#proposito').val(data.resultado.proposito);
        vistacargando();
        
    }).fail(function(){
      vistacargando();
    });

    $('#method_Solicitud').val('PUT'); 
    $('#frm_Solicitud').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPropiedad/solicitud/'+idsolicitudVentanilla);
    $('#btn_solicitud_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorSolicitud').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_solicitud_cancelar').click(function(){
    $('#cedulasolicitante').val('');
    $('#cedulapropietario').val('');
    $('#nombresolicitante').val('');
    $('#nombrepropietario').val('');

    // $('.option_solicitud_certificado').prop('selected',false); // deseleccionamos las zonas seleccionadas
    // $("#cmb_solicitud_institucion").trigger("chosen:updated"); // actualizamos el combo de zonas
    
    $('.optionsolicitud1').prop('selected',false);
    $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
    $("#cmbSolicitante").trigger("chosen:updated");
    
     $('.option_solicitud_certificado').prop('selected',false); //
     $("#cmb_solicitud_certificado").trigger("chosen:updated"); 

     $('.option_solicitud_institucion').prop('selected',false); //
     $("#cmb_solicitud_institucion").trigger("chosen:updated"); 
     $('#proposito').val('');

    $('#method_Solicitud').val('POST'); 
    $('#frm_Solicitud').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPropiedad/solicitud/');
    $(this).addClass('hidden');
});
    
        
  function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}
