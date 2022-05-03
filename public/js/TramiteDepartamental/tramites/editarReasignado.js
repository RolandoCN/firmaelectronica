
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

    // metodo para redireccionar el proceso
    $("#frm_editRedireccionarDetalleTramite").submit(function(e){

        e.preventDefault();
        var formulario = this; // obtenemos el formulacion

        swal({
            title: "",
            text: "¿Está seguro que desea continuar?",
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
                var ruta = $(formulario).attr('action');
                vistacargando('M','Registrando...'); // mostramos la ventana de espera

                $.ajax({
                    url: ruta,
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    success: function(retorno){
                        vistacargando();
                        // si es completado
                        alertNotificar(retorno.mensaje, retorno.status);
                        if(!retorno.error){
                            vistacargando("M", "Espere...");
                            window.location.href = "/gestionBandeja/enRevision";
                        }                       
                    },
                    error: function(){
                        vistacargando(); // ocultamos la ventana de espera
                        alertNotificar('Se produjo un error. Inténtalo de nuevo más tarde.');                        
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 


    });

