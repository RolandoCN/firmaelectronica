

    $("#frm_atenderTramiteAdmCont").submit(function(e){
        // (IMPORTANTE) quitamos  los documentos adjuntos que se cancelaron
        $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
        guardarDocumentoTermporal();
        
        e.preventDefault();

        var formulario = this; // obtenemos el formulacion
        var ruta = $(this).attr("action");

        swal({
            title: "",
            text: "¿Está seguro que desea guardar el trámite?",
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
                        vistacargando(); // ocultamos la ventana de espera
                        // si es completado
                        alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

                        if(!retorno.error){
                            vistacargando("M", "Espere...");
                            window.location.href = '/adminContratos/editarDetalleTramite?iddetalle_tramite='+retorno.resultado.iddetalle_tramite_encrypt;
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo realizar el registro, por favor inténtelo más tarde", "error");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 


    });