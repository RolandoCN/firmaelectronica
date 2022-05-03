

    $("#frm_updateTramiteAdmCont").submit(function(e){
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
                        console.log('hola');
                        $('#btn_descargad_doc').html(`<p > <a data-toggle="tooltip" data-placement="right" title="Recuerde que antes de dar clic en firmar y enviar debe guardar los cambios en el boton guardar." id="btn_descargar_documento_firmar" href="/tramite/descargarDocumentoRedirect/${retorno.resultado.docprincipal.iddocumento_encrypt}" class="btn btn-info btn-sm" ><i class="fa fa-download"></i> Descargar documento</a></p>`);
                        alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

                        if(!retorno.error){
                            
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

    function metodofirma(){
        $("#modal_aprobar_tramite").modal("show");
    }
    // funcion para mostrar la columna de botones para subir documentos firmados
    function firmarManual(){
        $("#modal_aprobar_tramite").modal("hide");
        setTimeout(() => {
            $('#modal_subir_documento_firmado').modal('show');    
        }, 500); //esperamos para evistar error de estilos
        $('#text_subir_doc_manual').val('');
        $('#input_subirDocumento').val('');
        $("#modal_aprobar_tramite").modal("hide");
        $('#btn_vista_doc').html('');
        $('#vista_doc_firmado').html('');
    }

    function firmarEnviarDetalleTramite(){
        $("#modal_aprobar_tramite").modal("hide");
        // (IMPORTANTE) quitamos  los documentos adjuntos que se cancelaron
        $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
        guardarDocumentoTermporal();
        
        //verificamos si hay destinos agregados
        var num_destinos_add = $("#div_conteDepEnviar div").length;
        if(num_destinos_add==0){
            alertNotificar("Falta agregar destinatarios", "default");
            return;
        }

        if(!$(".frm_tramite").hasClass('firmacargada')){           
            abrirFormularioFirma();
            return;
        }
        $(".frm_tramite").removeClass('firmacargada');

        var formulario = $('#frm_updateTramiteAdmCont')[0];
        var FrmData = new FormData(formulario);

        swal({
            title: "",
            text: "¿Está seguro que desea continuar?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Firmar y Enviar!",
            cancelButtonText: "Cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm) {
            if (isConfirm) { // si dice que quiere eliminar

                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                
                var urlFrm = `/adminContratos/firmarEnviarDetalleTramite`;

                vistacargando('M','Firmando y enviando...'); // mostramos la ventana de espera
                $.ajax({
                    url: urlFrm,
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    complete: function(requestData){
                        vistacargando(); // ocultamos la ventana de espera
                        retorno = requestData.responseJSON;
                        // si es completado
                        alertNotificar(retorno.mensaje, retorno.status);

                        if(!retorno.error){
                            vistacargando("Espere...");             
                            window.location.href="/adminContratos/enElaboracion";
                        }                        
                    },
                    error: function(error){
                        alertNotificar("No se pudo realizar el registro, por favor intentelo mas tarde","error");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 
    }

    function firmarYenviarEdit(){
        $("#modal_firma_electronica").modal("hide");       
        $(".frm_tramite").addClass('firmacargada');
        firmarEnviarDetalleTramite();
    }

    
    // METODOS PARA SUBIR UN DOCUMENTO FIRMADO -----------------------------------------------

        // evento del input file de subir documento firmado
        $(".input_subirDocumento").change(function(e){
            
            var formulario = $(this).parents(".form_subirDocumento");
            if(e.target.files.length>0){
            // obtenemos y mostramos el nombre del documento seleccionado
                var nombreDocSelc = $(this)[0].files[0].name;

            // validamos la extencion del documeto
                var tipoDocSalec = nombreDocSelc.split('.').pop(); // obtenemos la extención del documento
                if(arrFormatos[`${tipoDocSalec}`] != true){
                    alertNotificar(`El formato del documento .${tipoDocSalec} no está permitido`, "error");
                    return;
                }

            // obtenemos el tamaño del documento 
                var tamArchivo = $(this)[0].files[0].size; // obtenemos el tamaño del archivo
                var tamArchivo = ((tamArchivo/1024)/1024);
                if(tamArchivo>tamMaxDoc){
                    alertNotificar(`Solo se permite adjuntar documentos con un tamaño máximo de ${tamMaxDoc}MB`, "error");
                    return;
                }
                $('#text_subir_doc_manual').val(nombreDocSelc);
                $('#vista_doc_firmado').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
            }
        });

        $("#input_subirDocumento").click(function(e){
            $('#vista_doc_firmado').html(``);

        });

        $(".form_subirDocumento").submit(function(e){
            e.preventDefault();

            var ruta = $(this).attr("action");
            var FrmData = new FormData(this);
    

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            vistacargando('M','Subiendo...'); // mostramos la ventana de espera

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
                    // si es completado
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

                    if(!retorno.error){
                        // ponemos el icono de firmado
                        // $("#icono_estado_firma").html('<span class="fa fa-check-circle"></span>');
                        // $("#icono_estado_firma").parent().removeClass('btn_rojo');
                        // $("#icono_estado_firma").parent().addClass('btn_verde');
                        // $("#btn_enviar_tramite").show(200);
                        enviar_tramite_destino();
                    }

                },
                error: function(error){
                    // alertNotificar(","error");
                    vistacargando(); // ocultamos la ventana de espera
                }
            }); 
        });

        // funcion para enviar el trámite con documento firmado a los departamentos destino
        function enviar_tramite_destino(){

            vistacargando("M", "Espere...");
            iddetalle_tramite_encrypt = $("#input_iddetalle_tramite_atender").val();
                    
            $.get("/adminContratos/EnviarDetalleTramiteFirmado/"+iddetalle_tramite_encrypt, function(retorno){
                
                alertNotificar(retorno.mensaje, retorno.status);
                if(!retorno.error){ // si no hay error
                    window.location.href="/adminContratos/enElaboracion";
                }else{
                    vistacargando();
                }

            }).fail(function(){
                vistacargando();
            });
        }
    // -----------------------------------------------------------------------------------------
