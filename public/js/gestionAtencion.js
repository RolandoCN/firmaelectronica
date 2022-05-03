



 
    $( "#cedulasolicitante" ).blur(function() {
       // alert( "hjsdhsd" );
       var cedulasolicitante = $("#cedulasolicitante").val();
       console.log('d1: '+cedulasolicitante);
       $.get('/gestionPropiedad/buscarUsuario/'+cedulasolicitante, function(data){
            console.log(data[9].valor);
           // $('#nombresolicitante').val()=data[9].valor;
           $('#nombresolicitante').val(data[9].valor);

      }).fail(function(){
        $.iaoAlert({msg: "Dark Theme",
            type: "notification",
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

        }).fail(function(){
          $.iaoAlert({msg: "Cedula del propietario no encontrada",
            type: "error",
            mode: "dark",});
          $('#cedulapropietario').val('');
          $('#cedulapropietario').focus();
          $('#nombrepropietario').val('');
           
        });

  });
   ///FUNCIONES PARA EDITAR LOS REGISTROS 
///Gestion sollicitud_ventanilla

function vermodal1(idsolicitudVentanilla){
     vistacargando('M','Espere');
  //$('#solicitar').attr("disabled", true);
    $.get("/gestionPropiedad/solicitud/"+idsolicitudVentanilla+"/edit", function (data) {
        console.log(data);
        $('#cel').html(data.resultado.cedulaSolicitante);
        $('#fregistro').html(data.resultado.fechaRegistro);
        $('#tsolicitante').html(data.resultado.tipoSolicitante);
        $('#inst').html(data.resultado.proposito);
        $('#institucion').html(data.resultado.institucion.detalle);
        $('#cedulap').html(data.resultado.cedulaPropietario);
         $('#estadop').html(data.resultado.estado);
         $('#nsolicitante').html(data.datoPersona[9].valor);
         
       $('#DetalleSolicitud').modal("show");
       vistacargando();

         

         


        
        
    }).fail(function(){
      vistacargando();
    });

   // $('#method_Solicitud').val('POST'); 
    //$('#frm_Atencion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPropiedad/solicitud/'+idsolicitudVentanilla);
    //$('#btn_solicitud_cancelar').removeClass('hidden');

   // $('html,body').animate({scrollTop:$('#administradorSolicitud').offset().top},400);
}






function atencion_obtener(idsolicitudVentanilla){

  //$('#solicitar').attr("disabled", true);
    $.get("/gestionPropiedad/solicitud/"+idsolicitudVentanilla+"/edit", function (data) {
        console.log(data);

        $('#idsolicitudVentanillatext').val(data.resultado.idsolicitudVentanilla);
        $('#cedulasolicitante').val(data.resultado.cedulaSolicitante);
        $('#cedulapropietario').val(data.resultado.cedulaPropietario);
    

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

        $('#file_documento_adjunto').val(data.resultado.ruta);
        
        
    });

   // $('#method_Solicitud').val('POST'); 
    //$('#frm_Atencion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPropiedad/solicitud/'+idsolicitudVentanilla);
    //$('#btn_solicitud_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorSolicitud').offset().top},400);
}


//////////////////////////////////////////////////////////////

function documentos_editar(idsolicitudVentanilla){
    $.get("/gestionPropiedad/atencion/"+idsolicitudVentanilla+"/edit", function (data) {
        console.log(data);
        $('#idsolicitudVentanillatext').val(data.resultado.idsolicitudVentanilla);
         $('#cedulasolicitante').val(data.resultado['cedulaSolicitante']);
         //$('#documento').val(data.resultado.ruta);
          //$( "input:file" ).val(data.resultado.ruta);

          // var a=$('#documento')[0].files[0];
          // data.resultado.ruta=a;
     console.log(data.resultado.documento);
     //$('#datatable').attr("disabled", true);
      $.each(data.resultado.documento,function(i,item){
                 console.log(item.ruta);
        var a=item.ruta;
       //   $('#content_visualizarDocumento').val(item.ruta);
       // $('#content_visualizarDocumento').html(`<iframe src="${URL.createObjectURL($(input)[0].files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
       //  $(".modal_visualizarDocumento").modal();
      //   alert(a)
      // var id_inputfile = "input_file_"+item; // id de input file para seleccionar un archivo
      //   var id_documento_adjunto = "documento_adjunto_"+item; // id del contenedos visual del archivo seleccionado
      //   var id_nombroDoc_seleccionado = "a"+item; ;
         //$('input:file').val(item.ruta);
         $('input[type=file]').val(item.ruta);


            });

    adjuntarNuevoDocumento();
    });

    $('#method_Atencion').val('PUT'); 
    $('#frm_Atencion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPropiedad/atencion/'+idsolicitudVentanilla);
    $('#btn_documento_cancelar').removeClass('hidden');
    $('#add').addClass('hidden');
    $("#documento").click(function (e) {
    $('#add').addClass('hidden');
   });

    $('html,body').animate({scrollTop:$('#administradorSolicitud').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_documento_cancelar').click(function(){
    $('#cedulasolicitante').val('');
    $('#idsolicitudVentanilla').val('');
    $('#documento').val('');

    

    $('#method_Atencion').val('POST'); 
    $('#frm_Atencion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionPropiedad/atencion/');
    $(this).addClass('hidden');
});














////////////////////////////////////////////////////////////////


    
        
  function btn_elimina_doc(btn){
    if(confirm('¿Quiere eliminar el registrojhkjhs?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}
// ======================= FUNCIONES PARA ADJUNTAR DOCUMENTO ===================================
 var contador = 1; // inicializamos un contador para concatenar con los id a generar

    function reemplazarNuevoDocumento(){

        // mostramos con jquery el contenedor de la lista de documentos adjuntos
        // if($("#cont_lista_documentos_adjuntos").hasClass("hidden")){
        //     $("#cont_lista_documentos_adjuntos").hide();
        //     $("#cont_lista_documentos_adjuntos").removeClass("hidden");
        // }

       
        var id_inputfile = "input_file_"+contador; // id de input file para seleccionar un archivo
        var id_documento_adjunto = "documento_adjunto_"+contador; // id del contenedos visual del archivo seleccionado
        var id_nombroDoc_seleccionado = "nombreDocSel_"+contador; // id de span donde se mostrara el nombre del documento seleccionado
        contador++; // incrementamos el contados para que los id no se repitan

        // agregamos oculta la estructura del documento que en teoria se va a seleccionar
        $("#lista_documentos_adjuntos").append(`
            <div id="${id_documento_adjunto}" class="alert hidden_documento f_documento_adjunto fade in docActivo" style="margin-bottom: 5px;">
                <button type="button" class="btn btn-danger btn-sm btn_doc_creado" onclick="quitarDocumentoAdjunto(this)"><i class="fa fa-trash"></i></button>
                <button type="button" onclick="visualizarDocumentoAdjunto(this)" class="btn btn-primary btn-sm btn_doc_creado"><i class="fa fa-eye"></i></button>
                <strong><i class="icono_left fa fa-file-pdf-o"></i></strong> 
                    <span id="${id_nombroDoc_seleccionado}"></span>     
                <input type="file" id="${id_inputfile}" accept="application/pdf" class="nombreDocumento hidden" name="file_documento_adjunto[]" value="0">
            </div>  
        `);

        $(`#${id_inputfile}`).click(); // le damos click al input file agregado para que el usuario seleccione un archivo
        
        // mostramos la estructura del documento solo si se selecciona uno
        // si no se selecciona la estructura del documento queda oculto en la lista
        // Nota: un input vacio no da problemas ya que no llega al controlador porque por el request solo se van los input file que tiene un archivo seleccionado
        $(`#${id_inputfile}`).change(function(){
            // primero validamos que solo se ingrese documentos pdf
            var tipoDocSalec=$(`#${id_inputfile}`)[0].files[0].type; // obtenemos el tipo de documento seleccionado
            if(tipoDocSalec != "application/pdf"){
                alertNotificar("Solo se permite adjuntar documentos pdf", "error");
                return;
            }
            // mostramos la estructura del documento seleccionado con toda su información
            $(`#${id_documento_adjunto}`).removeClass("hidden_documento");
            $(`#${id_documento_adjunto}`).addClass("active_documento"); // clase para compar si hay documentos en la lista (si no hay ocultamos la lista)
            // obtenemos y mostramos el nombre del documento seleccionado
            var nombreDocSelc = $(`#${id_inputfile}`)[0].files[0].name;
            $(`#${id_nombroDoc_seleccionado}`).html(nombreDocSelc);
            // mostramos la lista de documentos adjuntos
            $("#cont_lista_documentos_adjuntos").show(200);       
        });

    }

   









////////////////////////////////////////////////////


    var contador = 1; // inicializamos un contador para concatenar con los id a generar

    function adjuntarNuevoDocumento(){

        // mostramos con jquery el contenedor de la lista de documentos adjuntos
        // if($("#cont_lista_documentos_adjuntos").hasClass("hidden")){
        //     $("#cont_lista_documentos_adjuntos").hide();
        //     $("#cont_lista_documentos_adjuntos").removeClass("hidden");
        // }

        var id_inputfile = "input_file_"+contador; // id de input file para seleccionar un archivo
        var id_documento_adjunto = "documento_adjunto_"+contador; // id del contenedos visual del archivo seleccionado
        var id_nombroDoc_seleccionado = "nombreDocSel_"+contador; // id de span donde se mostrara el nombre del documento seleccionado
        contador++; // incrementamos el contados para que los id no se repitan

        // agregamos oculta la estructura del documento que en teoria se va a seleccionar
        $("#lista_documentos_adjuntos").append(`
            <div id="${id_documento_adjunto}" class="alert hidden_documento f_documento_adjunto fade in docActivo" style="margin-bottom: 5px;">
                <button type="button" class="btn btn-danger btn-sm btn_doc_creado" onclick="quitarDocumentoAdjunto(this)"><i class="fa fa-trash"></i></button>
                <button type="button" onclick="visualizarDocumentoAdjunto(this)" class="btn btn-primary btn-sm btn_doc_creado"><i class="fa fa-eye"></i></button>
                <strong><i class="icono_left fa fa-file-pdf-o"></i></strong> 
                    <span id="${id_nombroDoc_seleccionado}"></span>     
                <input type="file" id="${id_inputfile}" accept="application/pdf" class="nombreDocumento hidden" name="file_documento_adjunto[]" value="0">
            </div>  
        `);

        $(`#${id_inputfile}`).click(); // le damos click al input file agregado para que el usuario seleccione un archivo
        
        // mostramos la estructura del documento solo si se selecciona uno
        // si no se selecciona la estructura del documento queda oculto en la lista
        // Nota: un input vacio no da problemas ya que no llega al controlador porque por el request solo se van los input file que tiene un archivo seleccionado
        $(`#${id_inputfile}`).change(function(){
            // primero validamos que solo se ingrese documentos pdf
            var tipoDocSalec=$(`#${id_inputfile}`)[0].files[0].type; // obtenemos el tipo de documento seleccionado
            if(tipoDocSalec != "application/pdf"){
                alertNotificar("Solo se permite adjuntar documentos pdf", "error");
                return;
            }
            // mostramos la estructura del documento seleccionado con toda su información
            $(`#${id_documento_adjunto}`).removeClass("hidden_documento");
            $(`#${id_documento_adjunto}`).addClass("active_documento"); // clase para compar si hay documentos en la lista (si no hay ocultamos la lista)
            // obtenemos y mostramos el nombre del documento seleccionado
            var nombreDocSelc = $(`#${id_inputfile}`)[0].files[0].name;
            $(`#${id_nombroDoc_seleccionado}`).html(nombreDocSelc);
            // mostramos la lista de documentos adjuntos
            $("#cont_lista_documentos_adjuntos").show(200);       
        });

    }

    function visualizarDocumentoAdjunto(btn){
        var input = $(btn).siblings("input"); // obtenemos el input file que contiene el archivo seleccionado
        $('#content_visualizarDocumento').html(`<iframe src="${URL.createObjectURL($(input)[0].files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
        $(".modal_visualizarDocumento").modal();
    }


    // fucion para eliminar la estrucutura de un documento (ED) adjuntado en la lista
    function quitarDocumentoAdjunto(btn){
        var borrar = $(btn).parent(); // obtenemos el div que vamos a quitar
        $(borrar).removeClass("active_documento");// quitamos la clase que confirma que el documento esta visible
        $(borrar).hide(200);// ocultamos la ED que se va a eliminar

        // esperamos que termine la animacion para borrar dicha ED
        setTimeout(function(){ 
            $(borrar).remove(); // borramos el html de la ED
            // buscamos cuantas ED estan en la lista
            var numDocAdj = $("#lista_documentos_adjuntos").find(".active_documento").length;
            console.log(numDocAdj);
            if(numDocAdj<=0){ // si no hay ninguna ED ejecutamos
                $("#cont_lista_documentos_adjuntos").hide(200);// ocultar el contenedor de la lista de documentos adjuntos
            }
        }, 250); 
    }