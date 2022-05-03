

    function aprobarTramite(iddetalle_tramite_encrypt){
        vistacargando("M","Espere...");
        $.get("/revisionTramite/verificarDocumentoFirmado/"+iddetalle_tramite_encrypt, function(retorno){
            vistacargando();
            $("#informacion_certificado").html("");

            if(!retorno.error){ // si no hay error
                // if(retorno.firma=="listo"){
                //     finalizarAprobacionTramite();
                // }else{
                    $("#modal_aprobar_tramite").modal("show");

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar").html("¿Está seguro que desea firmar el documento?");
                    }

                    // verificiamos la vigencia del certificado
                    vertificado_vigente = false;
                    if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
                        vertificado_vigente = true;
                    }

                    // cargamos el input para subir el certificado
                    if(config_firma.archivo_certificado==true && vertificado_vigente==true){
                        $("#content_archivo_certificado").hide();
                    }else{
                        $("#content_archivo_certificado").show();
                    }

                    // cargamos el input para la contraseña
                    if(config_firma.clave_certificado==true && vertificado_vigente==true){
                        $("#content_clave_certificado").hide();                        
                    }else{
                        $("#content_clave_certificado").show();
                    }

                    //cargamos la informacion del certificado
                        if(config_firma.archivo_certificado==true){
                            color_mensaje_certificado = "icon_success";
                            mensaje_certificado = "Certificado vigente";
                            icono_mensaje_certificado = "fa fa-check-square";
                            if(config_firma.archivo_certificado==true && config_firma.dias_valido<=0){
                                color_mensaje_certificado = "icon_danger";
                                mensaje_certificado = "Certificado expirado";
                                icono_mensaje_certificado = "fa fa-times-circle";
                            }else if(config_firma.archivo_certificado==true && config_firma.dias_valido <= config_firma.dias_notific_expira){
                                color_mensaje_certificado = "icon_warning";
                                mensaje_certificado = "Certificado casi expirado";
                                icono_mensaje_certificado = "fa fa-warning";
                            }   
                            
                            $("#informacion_certificado").html(`
                                <div id="infoDepFlujGen_1" class="form-group infoDepFlujGen content_info_certificado" style="margin-bottom: 0px; margin-top: 16px;">
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <div class="tile-stats" style="margin-bottom: 0px; border-color: #cccccc;">
                                            <div class="icon ${color_mensaje_certificado}" style="font-size: 25px;"><i class="${icono_mensaje_certificado}"></i></div>
                                            <div class="count ${color_mensaje_certificado}" style="font-size: 20px;">${mensaje_certificado}</div>                                    
                                            <p>El certificado cargado es válido durante los siguientes <b>${config_firma.dias_valido} días</b>.</p>                                                                                
                                        </div>
                                        <hr style="margin-bottom: 2px;">                                        
                                    </div>
                                </div>
                            `);
                            
                        }

                    $("#input_clave_certificado").val("");
                    $("#text_archivo_certificado").val("Seleccione el archivo .p12 de su firma electrónica");
                   
                    $("#text_subir_doc_manual").val("Seleccione el documento firmado y escaneado en formato pdf");

                    //reiniciamos el icono de documento firmado
                    $("#icono_estado_firma").html('<span class="fa fa-times-circle"></span>');
                    $("#icono_estado_firma").parent().removeClass('btn_verde');
                    $("#icono_estado_firma").parent().addClass('btn_rojo');
                    $("#icono_estado_firma").parent().siblings('input').val("No seleccionado");
                    // $("#btn_enviar_tramite").hide();

                // }
            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }
        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo completar la acción", "error");
        });
    }


    // funcion para aprobar por completo el tramite
    // function finalizarAprobacionTramite(){
    //     swal({
    //         title: "",
    //         text: "¿Está seguro que desea aprobar el trámite?",
    //         type: "info",
    //         showCancelButton: true,
    //         confirmButtonClass: "btn-primary",
    //         confirmButtonText: "Si, aprobarlo!",
    //         cancelButtonText: "No, cancela!",
    //         closeOnConfirm: false,
    //         closeOnCancel: false
    //     },
    //     function(isConfirm) {
    //         if(isConfirm){ // si dice que quiere eliminar
    //             enviar_tramite_destino();
    //         }
    //         sweetAlert.close();   // ocultamos la ventana de pregunta
    //     }); 
    // }


    // funcion para enviar el trámite con documento firmado a los departamentos destino
    function enviar_tramite_destino(){

        vistacargando("M", "Espere...");
        iddetalle_tramite_encrypt = $("#id_detalle_tramite_encrypt").val();
                
        $.get("/revisionTramite/aprobarDetalleTramite/"+iddetalle_tramite_encrypt, function(retorno){
            
            alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);
            if(!retorno.error){ // si no hay error
                window.location.href="/gestionBandeja/aprobarEnvio";
            }else{
                vistacargando();
            }

        }).fail(function(){
            vistacargando();
        });
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


    // funcion para realizar la firma electonica
    function firmaElectronica(){
        $('#modal_aprobar_tramite').modal('hide');
        setTimeout(() => {
            $('#modal_firma_electronica').modal('show');
        }, 500); //esperamos para evistar error de estilos
        
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
                $('#vista_doc_firmado').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
            }else{
                $('#vista_doc_firmado').html(``);

            }
        });
        $("#input_subirDocumento").click(function(e){
            $('#vista_doc_firmado').html(``);

        });
        // function modalArchivos(url){
        //     $('#vista_doc_firmado').html(`<iframe src="${url}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
        // }

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

    // -----------------------------------------------------------------------------------------


    // FUNCION PARA ENVIAR UN TRÁMITE A REVISIÓN

        $("#frm_enviaraRevision").submit(function(e){
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
                    retorno = requestData.responseJSON;
                    // si es completado
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

                    if(!retorno.error){
                        // ponemos el icono de firmado
                        window.location.href="/gestionBandeja/aprobarEnvio";
                    }else{
                        vistacargando(); // ocultamos la ventana de espera
                    }
                    
                },
                error: function(error){
                    // alertNotificar(","error");
                    vistacargando(); // ocultamos la ventana de espera
                }
            }); 
        });


    // FUNCION PARA FIRMAR ELECTRONICAMENTE DOCUMENTO -------------------
    
        $("#frm_firma_electronica").submit(function(e){
            e.preventDefault();

            var ruta = $(this).attr("action");
            var FrmData = new FormData(this);

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            vistacargando('M','Firmando Documento...'); // mostramos la ventana de espera

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

                    console.clear(); console.log(retorno);

                    // si es completado
                    if(!retorno.error){
                        // ponemos el icono de firmado
                        alertNotificar("Documento firmado con éxito", 'success'); 
                        vistacargando('M','Enviando trámite...'); // mostramos la ventana de espera              
                        enviar_tramite_destino();
                    }else{
                        alertNotificar("No se puedo firmar el documento. Verifique que la contraseña y el archivo que contiene el certificado sean correctos", 'error');
                    }
                    
                },
                error: function(error){
                    // alertNotificar(","error");
                    vistacargando(); // ocultamos la ventana de espera
                }
            }); 
        });


    // FUNCION PARA SELECCIONAR UN ARCHVO --------------

        $(".seleccionar_archivo").click(function(e){
            $(this).parent().siblings('input').val($(this).parent().prop('title'));           
            this.value = null; // limpiamos el archivo
        });

        $(".seleccionar_archivo").change(function(e){

            if(this.files.length>0){ // si se selecciona un archivo
                archivo=(this.files[0].name);
                if(this.files[0].type != "application/pdf" && this.files[0].type != "application/PDF"){
                    alertNotificar("Debe seleccionar un archivo pdf");
                    this.value = null;
                    return;
                }
                $(this).parent().siblings('input').val(archivo);
            }else{
                return;
            }

        });


    // FUNCION PARA SELECCIONAR UN ARCHVO P12--------------

        $(".seleccionar_archivo_p12").click(function(e){
            $(this).parent().siblings('input').val($(this).parent().prop('title'));
            this.value = null; // limpiamos el archivo
        });

        $(".seleccionar_archivo_p12").change(function(e){

            if(this.files.length>0){ // si se selecciona un archivo
                archivo=(this.files[0].name);
                if(this.files[0].type != "application/x-pkcs12"){
                    alertNotificar("Debe seleccionar un archivo .p12");
                    this.value = null;
                    return;
                }
                $(this).parent().siblings('input').val(archivo);
            }else{
                return;
            }

        });

