$(document).ready(function() {
    $("#frm_editarDetalleActividad").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
});
    // funcion para visualizar un documento adjunto
    function visualizarDocumentoAdjunto_editar(iddocumento_encrypt){

        vistacargando('M','Espere...'); // mostramos la ventana de espera

        $.get(`/tramite/obtenerDocumento/${iddocumento_encrypt}`, function(documentob64){

            $('#content_visualizarDocumento').html(`<iframe src="data:application/pdf;base64,${documentob64}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
            $(".modal_visualizarDocumento").modal();        
            vistacargando(); // ocultamos la ventana de espera

        }).fail(function(e){
            vistacargando(); // ocultamos la ventana de espera
        });

    }


    
    function guardar(){
        $('#control_guardar').val(1);
        $("#frm_editarDetalleActividad").submit();
    }

    function subirfirmado(){
        $('#control_guardar').val(2);
        $("#frm_editarDetalleActividad").submit();
    }

  
    // funcion para guardar un borrador del tramite que se está iniciando
    $("#frm_editarDetalleActividad").submit(function(e){
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
        if($("#responsable_principal").val()==0 &&  $('#control_guardar').val()==0 ){ //si es responsable no tiene que firnar el documento
            if(!$(".frm_tramite").hasClass('firmacargada')){
                if($("#chek_editor_texto").is(':checked')){
                    metodofirma();
                    return;
                }
            }
            $(".frm_tramite").removeClass('firmacargada');
        }
        var formulario = this; // obtenemos el formulacion
        var ruta  = $(formulario).attr('action');
        if($('#control_guardar').val()==2){
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            var FrmData = new FormData(formulario);
            vistacargando('M','Enviando...'); // mostramos la ventana de espera
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
                    alertNotificar(retorno.mensaje, retorno.status);
                    if(retorno.error==false){
                        vistacargando("M","Espere...");
                        window.location.href = `/gestionBandeja/enRevision`;
                    }                        
                },
                error: function(error){
                    vistacargando(); // ocultamos la ventana de espera
                    alertNotificar('No se pudo realizar el registro, intentelo más tarde', 'error');                        
                }
            }); 
        }else{
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
                    if($('#control_guardar').val()!=1){

                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        
                        var FrmData = new FormData(formulario);
                        vistacargando('M','Enviando...'); // mostramos la ventana de espera
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
                                alertNotificar(retorno.mensaje, retorno.status);
                                if(retorno.error==false){
                                    vistacargando("M","Espere...");
                                    window.location.href = `/gestionBandeja/enRevision`;
                                }                        
                            },
                            error: function(error){
                                vistacargando(); // ocultamos la ventana de espera
                                alertNotificar('No se pudo realizar el registro, intentelo más tarde', 'error');                        
                            }
                        }); 

                    }else{
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
                            
                                if(retorno.error==false){
                                    // si es completado
                                    alertNotificar(retorno.mensaje, retorno.status);
                                    $('#modal_formatoDocumento').html('');
                                    vistacargando();
                                    window.location.href=`/detalleActividad/editarDetalleActividad?iddetalle_actividad=${$('#iddetalleactividadencrypt').val()}`;
                                } else{
                                    vistacargando(); // ocultamos la ventana de espera
                                }     

                            },
                            error: function(error){
                                vistacargando(); // ocultamos la ventana de espera
                                alertNotificar('No se pudo realizar el registro, intentelo más tarde', 'error');                        
                            }
                        }); 
                    }
                }

                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 
        }




    });

  
    // funcion para mostrar la columna de botones para subir documentos firmados
    function firmarManual(){
        vistacargando('m','Por favor espere....');
        $('#text_subir_doc_manual').val('');
        $('#input_subirDocumento').val('');
        $("#modal_aprobar_tramite").modal("hide");
        $('#btn_vista_doc').html('');
        $('#vista_doc_firmado').html('');
        setTimeout(() => {
            $('#modal_subir_documento_firmado').modal('show');  
            vistacargando();  
        }, 500); //esperamos para evistar error de estilos
    }

    // $("#form_subir_documento_firmado").prop('action',"/revisionTramite/subirDocumentoFirmado/"+iddetalle_tramite);


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

     // METODOS PARA SUBIR UN DOCUMENTO FIRMADO -----------------------------------------------

        // evento del input file de subir documento firmado
        $(".input_subirDocumento").change(function(e){
            
            var formulario = $(this).parents(".form_subirDocumento");

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
                $('#btn_vista_doc').html(`<a id="btnVerDoc${e.target.title}" data-toggle="tooltip" data-placement="top" title="Ver Documento" onclick="modalArchivos('${URL.createObjectURL(e.target.files[0])}')" class="btn  btn-info"><i class="fa fa-eye"></i></a>`);
                $('[data-toggle="tooltip"]').tooltip();
        });

        function modalArchivos(url){
            $('#vista_doc_firmado').html(`<iframe src="${url}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
        }

        // $(".form_subirDocumento").submit(function(e){
        //     e.preventDefault();
        //     var ruta = $(this).attr("action");
        //     var FrmData = new FormData(this);
    

        //     $.ajaxSetup({
        //         headers: {
        //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        //         }
        //     });
            
        //     vistacargando('M','Subiendo...'); // mostramos la ventana de espera

        //     $.ajax({
        //         url: ruta,
        //         method: 'POST',
        //         data: FrmData,
        //         dataType: 'json',
        //         contentType:false,
        //         cache:false,
        //         processData:false,
        //         complete: function(requestData){
        //             console.log(requestData);
        //             vistacargando(); // ocultamos la ventana de espera
        //             retorno = requestData.responseJSON;
        //             // si es completado
        //             alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

        //             if(!retorno.error){
        //                 // ponemos el icono de firmado
        //                 // $("#icono_estado_firma").html('<span class="fa fa-check-circle"></span>');
        //                 // $("#icono_estado_firma").parent().removeClass('btn_rojo');
        //                 // $("#icono_estado_firma").parent().addClass('btn_verde');
        //                 // $("#btn_enviar_tramite").show(200);
        //                 $('#control_guardar').val(2);
        //                 // $("#frm_editarDetalleActividad").attr('action',`/detalleActividad/registrarAtencion/${id}`);
        //                 // action="{{url('detalleActividad/updateDetalleActividad/'.$detalle_actividad->iddetalle_actividad_encrypt)}}"
        //                 $("#frm_editarDetalleActividad").submit();
        //                 // enviar_tramite_destino();
        //             }

        //         },
        //         error: function(error){
        //             // alertNotificar(","error");
        //             vistacargando(); // ocultamos la ventana de espera
        //         }
        //     }); 
        // });


    // -----------------------------------------------------------------------------------------
