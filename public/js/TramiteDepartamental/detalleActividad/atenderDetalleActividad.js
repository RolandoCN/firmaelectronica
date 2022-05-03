

    // funcion para guardar un borrador del tramite que se está iniciando
    $("#frm_atenderDetalleTramite").submit(function(e){

        e.preventDefault();

        // (IMPORTANTE) quitamos  los documentos adjuntos que se cancelaron
        $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
        guardarDocumentoTermporal();

        //verificamos si hay destinos agregados
        var num_destinos_add = $("#div_conteDepEnviar div").length;
        if(num_destinos_add==0){
            alertNotificar("Falta agregar destinatarios", "default");
            return;
        }

        $(".frm_tramite").removeClass('firmacargada');
                
        var formulario = this; // obtenemos el formulacion
        var ruta  = $(formulario).attr('action');

        swal({
            title: "",
            text: "¿Está seguro que desea continuar?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si, continua!",
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

                        vistacargando(); // ocultamos la ventana de espera
                        retorno = requestData.responseJSON;
                        console.log(retorno);

                        // si es completado
                        alertNotificar(retorno.mensaje, retorno.status);
                        if(retorno.error==false){
                            vistacargando("M","Espere...");
                            window.location.href = `/detalleActividad/editarDetalleActividad?iddetalle_actividad=${retorno.ideditar}`;
                        }                   
                    },
                    error: function(error){
                        vistacargando(); // ocultamos la ventana de espera
                        alertNotificar('No se pudo realizar el registro, intentelo más tarde', 'error');                        
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 


    });

    $("#chek_editor_texto_atender").on('ifChecked', function(event){
        $("#cont_editor_documento").show();     
    });

    $("#chek_editor_texto_atender").on('ifUnchecked', function(event){
        $("#cont_editor_documento").hide();             
    });