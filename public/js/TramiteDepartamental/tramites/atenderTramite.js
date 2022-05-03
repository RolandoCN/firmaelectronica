// funcion para guardar un borrador del tramite que se está iniciando
$("#frm_atenderDetalleTramite").submit(function(e){
    // (IMPORTANTE) quitamos  los documentos adjuntos que se cancelaron
    $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
    guardarDocumentoTermporal();
    
    e.preventDefault();

    var formulario = this; // obtenemos el formulacion
    var ruta = $(this).attr("action");

    swal({
        title: "",
        text: "¿Está seguro que desea registrar el trámite?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si, guardalo!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que quiere eliminar

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            var FrmData = new FormData(formulario);
            vistacargando('M','Registrando...'); // mostramos la ventana de espera
            $.ajax({
                url: ruta,
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                complete: function(requestData){
                    retorno = requestData.responseJSON;
                    // si es completado
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

                    if(!retorno.error){
                        // mostrarAlertaFija("tramite_alerta_general", "CÓDIGO DEL TRÁMITE: "+ retorno.resultado.codTramite, "success");
                        $('html,body').animate({scrollTop:$('.main_container').offset().top},400);
                        limpiarTodo();
                        // mostramos el boton de finalizar trámite
                        $("#btn_subir_tramite").show(200);
                        $("#btn_subir_tramite").attr("onclick", `subirDetalleTramiteAtender('${retorno.resultado.iddetalle_tramite_encrypt}')`);
                    }
                    vistacargando(); // ocultamos la ventana de espera
                },
                error: function(error){
                    // alertNotificar(","error");
                    vistacargando(); // ocultamos la ventana de espera
                }
            }); 

        }

        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 


});



    // funcion para enviar el trámite a la bandeja del jefe
    function subirDetalleTramiteAtender(iddetalle_tramite_encrypt){

        swal({
            title: "",
            text: "Si no guardó se perderán los últimos cambios realizados ¿Está seguro que desea subir el trámite atendido?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si, subirlo!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que quiere eliminar
                
                vistacargando("M", "Subiendo...");
                
                $.get("/detalleTramite/subirDetalleTramite/"+iddetalle_tramite_encrypt, function(retorno){
                    
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);
                    if(!retorno.error){ // si no hay error
                        window.location.href ="/gestionBandeja/entrada";
                    }else{
                        vistacargando();
                    }

                }).fail(function(){
                    vistacargando();
                });
            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 
    }