

    // funcion para visualizar un documento adjunto
    function visualizarDocumentoAdjunto_editar(iddocumento_encrypt){

        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $("#btn_descargar_documento_edit").attr("href", "/tramite/descargarDocumentoRedirect/"+iddocumento_encrypt);
        $("#btn_abriotrap_documento_edit").attr("href", "/tramite/obtenerDocumentoRedirect/"+iddocumento_encrypt);

        $.get(`/tramite/obtenerDocumento/${iddocumento_encrypt}`, function(documentob64){

            vistacargando(); // ocultamos la ventana de espera
            $('#content_visualizarDocumento').html(`<iframe src="data:application/pdf;base64,${documentob64}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
            $(".modal_visualizarDocumento").modal();                    

        }).fail(function(e){
            vistacargando(); // ocultamos la ventana de espera
        });

    }


    // funcion para editar un detalle de tramite
    $("#frm_editarDetalleTramite").submit(function(e){

        $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
        guardarDocumentoTermporal();

        e.preventDefault();

        var FrmData = new FormData(this);
        var ruta = $(this).attr('action');

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
                
                vistacargando('M','Guardando...'); // mostramos la ventana de espera

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
                            mostrarAlertaFija("tramite_alerta_general", "CÓDIGO DEL TRÁMITE: "+ retorno.resultado.codTramite, "success");
                            $('html,body').animate({scrollTop:$('.main_container').offset().top},400);
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
    function subirDetalleTramiteEdit(iddetalle_tramite_encrypt){

        swal({
            title: "",
            text: "Si no guardó se perderán los últimos cambios realizados ¿Está seguro que desea subir el trámite?",
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
                        window.location.href = $("#ruta_redirect_subir").val();
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


    // función para editar un detalle de trámite desde la bandeja de aprobacion del jefe
    $("#frm_editarDetalleTramiteJefe").submit(function(e){

        $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
        guardarDocumentoTermporal();

        e.preventDefault();

        var FrmData = new FormData(this);
        var ruta = $(this).attr('action');

        swal({
            title: "",
            text: "¿Está seguro que desea guardar los cambios?",
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
                
                vistacargando('M','Guardando...'); // mostramos la ventana de espera

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
                            vistacargando("M", "Espere...")
                            window.location.href = $("#ruta_redirect_subir").val();
                        }else{
                            vistacargando(); // ocultamos la ventana de espera
                        }
                        
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
