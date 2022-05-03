
// ======================= FUNCIONES PARA REGISTRAR LA TEMINACIÓN ==============================

        // funcion para editar un detalle de tramite
        $("#frm_registrarTerminacion").submit(function(e){

            $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
    
            // return;
            e.preventDefault();
    
            var FrmData = new FormData(this);
            var ruta = $(this).attr('action');
    
            swal({
                title: "",
                text: "¿Está seguro que desea finalizar el trámite?",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: "btn-primary",
                confirmButtonText: "Si, guardalo!",
                cancelButtonText: "No, cancela!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if(isConfirm){ // si dice que quiere eliminar
    
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
                            console.log(retorno);
                            // si es completado
                            alertNotificar(retorno.mensaje, retorno.status);
    
                            if(!retorno.error){
                                alertNotificar(retorno.mensaje,"success");
                                window.location.href = "/gestionBandeja/entrada";
                            }else{
                                vistacargando(); // ocultamos la ventana de espera
                            }
                            
                        },
                        error: function(error){
                            alertNotificar("Error al intentar terminar el trámite","error");
                            vistacargando(); // ocultamos la ventana de espera
                        }
                    }); 
    
                }
    
                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 
    
        });


// ======================= FUNCIONES PARA ADJUNTAR DOCUMENTO ===================================


    var contador = 1; // inicializamos un contador para concatenar con los id a generar

    function adjuntarNuevoDocumento(){

        var id_inputfile = "input_file_"+contador; // id de input file para seleccionar un archivo
        var id_documento_adjunto = "documento_adjunto_"+contador; // id del contenedos visual del archivo seleccionado
        contador++; // incrementamos el contados para que los id no se repitan

        
        // agregamos oculta la estructura del documento que en teoria se va a seleccionar
        $("#lista_documentos_adjuntos").append(`
            <div id="${id_documento_adjunto}" class="alert hidden_documento file_delete f_documento_adjunto fade in docActivo" style="margin-bottom: 5px;">
                <button type="button" class="btn btn-danger btn-sm btn_doc_creado" onclick="quitarDocumentoAdjunto(this)"><i class="fa fa-trash"></i></button>
                <button type="button" onclick="visualizarDocumentoAdjunto(this)" class="btn btn-primary btn-sm btn_doc_creado"><i class="fa fa-eye"></i></button>
                <strong><i class="icono_left fa fa-file-pdf-o"></i></strong> 
                <span class="nameFile"></span>

                <hr style="margin: 10px 0px 0px 0px; border-top: 1px solid #48aecd;">
                <div class="infoDoc" style="margin-top: 10px;"></div>
                <div class="infoDocEnviar">
                    <input type="file" id="${id_inputfile}" accept="application/pdf" class="nombreDocumento hidden" name="file_documento_adjunto[]" value="0">
                </div>
            </div>  
        `);

        $(`#${id_inputfile}`).click(); // le damos click al input file agregado para que el usuario seleccione un archivo
        
        // mostramos la estructura del documento solo si se selecciona uno
        // si no se selecciona la estructura del documento queda oculto en la lista
        // Nota: un input vacio no da problemas ya que no llega al controlador porque por el request solo se van los input file que tiene un archivo seleccionado
        $(`#${id_inputfile}`).change(function(e){


            // obtenemos y mostramos el nombre del documento seleccionado
            var nombreDocSelc = $(`#${id_inputfile}`)[0].files[0].name;

            // validamos la extencion del documeto
                var tipoDocSalec = nombreDocSelc.split('.').pop(); // obtenemos la extención del documento
                if(arrFormatos[`${tipoDocSalec}`] != true){
                    alertNotificar(`El formato del documento .${tipoDocSalec} no esta permitido`, "error");
                    // eliminamos el documento oculto
                    $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
                    return;
                
                }

            // obtenemos el tamaño del documento 
                var tamArchivo = $(`#${id_inputfile}`)[0].files[0].size; // obtenemos el tamaño del archivo
                var tamArchivo = ((tamArchivo/1024)/1024);

                tamArchivo = (Math.round( tamArchivo * 100 )/100);
                contador_megas_aux = parseFloat(contador_megas)+parseFloat(tamArchivo); // calculamos tamaño total de documentos
                contador_megas_aux = Math.round( contador_megas_aux * 100 )/100;

                if((tamArchivo>tamMaxDoc) || (contador_megas_aux>tamMaxDoc)){
                    alertNotificar(`Solo se permite adjuntar un total máximo de ${tamMaxDoc}MB`, "error");
                    // eliminamos el documento oculto
                    $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
                    return;
                }

                $("#tam_archivo_selec").val(tamArchivo);

            // visualizamos el documento
                $('#VistaPreviaMesj').attr('hidden',true);
                $('#VistaPreviaDoc').attr('hidden',false);
                $('#VistaPreviaDoc').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);

            // limpiamos los input de la modal
                $("#modal_codigo_docAdj").val("");
                $("#modal_descripcion_docAdj").val("");

            // vista previa del documento
            $("#modalVistaPreviaDocumento").modal("show");

            $("#modal_id_documento_adjunto").val(id_documento_adjunto);
            $("#modal_nameFile").val(nombreDocSelc);

            $("#modal_nombreDocumentoSeleccionado").html(nombreDocSelc); // mostramos el nombre del documento en la modal

        });

    }

    // funcion que visualiza un documento seleccionado
    // boton de la modal
    var contador_megas = 0; //variable global
    function agregarDocumento(){

        var id_documento_adjunto = $("#modal_id_documento_adjunto").val();
        var nameFile = $("#modal_nameFile").val();

        var codigo_docAdj = $("#modal_codigo_docAdj").val();
        var descripcion_docAdj = $("#modal_descripcion_docAdj").val();
        var idtipo_documento_encrypt = $("#cmb_tipo_documento_docAdj").val();

        var descripcion_tipo_documento_adj = $(`#cmb_tipo_documento_docAdj option[value="${idtipo_documento_encrypt}"]`).html();
        
        var tam_archivo_selec = $("#tam_archivo_selec").val();
        contador_megas = parseFloat(contador_megas)+parseFloat(tam_archivo_selec);
        contador_megas = Math.round( contador_megas * 100 )/100;
        if(contador_megas>=(tamMaxDoc-1)){ 
            $("#content_maxmegas").removeClass("label-default");
            $("#content_maxmegas").addClass("label-danger");
        }
        $("#megas_subidas").html(contador_megas);

        // ---------------------------------------------------------------------------------
        if(descripcion_docAdj=="" || descripcion_docAdj==null){ // si no se ingresa el nombre del documento
            alertNotificar('Ingrese toda la información antes de agregar el documento','error');
            return;
        }

        if(idtipo_documento_encrypt==null){
            alertNotificar("Ya no hay documentos por crear","default"); // verificamos que aya documentos
            cancelarDocumento();
            return;
        }

        // quitamos el tipo de documento de la lista
            // $(`.cmb_tipo_documento option[value="${idtipo_documento_encrypt}"]`).remove(); // quitamos la opton del tipo de documento creado
            // $(".cmb_tipo_documento").trigger("chosen:updated"); // actualizamos el combo

        // para mostrar en la vista
            if(codigo_docAdj=="" || codigo_docAdj==null){
                var infoDoc = (`                    
                    <b class="separardor">DESCRIPCIÓN: </b> <span class="separador_i">${descripcion_docAdj}</span>
                    <b class="separardor">TIPO DOCUMENTO: </b> <span class="tipo_documento_adj">${descripcion_tipo_documento_adj}</span>
                `);
            }else{
                var infoDoc = (`
                    <b class="separardor">CÓDIGO:</b> <span class="separador_i">${codigo_docAdj}</span>
                    <b class="separardor">DESCRIPCIÓN: </b> <span class="separador_i">${descripcion_docAdj}</span>
                    <b class="separardor">TIPO DOCUMENTO: </b> <span class="tipo_documento_adj">${descripcion_tipo_documento_adj}</span>
                `);
            }

        // para enviar por el request
            var infoDocEnviar = (`
                <input type="hidden" class="tam_archivo_selec" value="${tam_archivo_selec}">
                <input type="hidden" name="input_id_tipo_documento_adjunto[]" value="${idtipo_documento_encrypt}" class="idtipo_documento_adj">
                <input type="hidden" name="input_codigo_documento_adjunto[]" value="${codigo_docAdj}">
                <input type="hidden" name="input_descripcion_documento_adjunto[]" value="${descripcion_docAdj}">
            `);

        // CARGAMOS TODA LA INFORMACIÓN DEL DOCUMENTO
            $("#"+id_documento_adjunto).find('.nameFile').html(`<b><span style="color: #38a7c9; font-weight: 800;">${tam_archivo_selec} MB</span> ${nameFile}</b>`)
            $("#"+id_documento_adjunto).find('.infoDoc').html(infoDoc);
            $("#"+id_documento_adjunto).find('.infoDocEnviar').append(infoDocEnviar); // con append para no borrar el input file

        // mostramos la estructura del documento seleccionado con toda su información
            $(`#${id_documento_adjunto}`).removeClass("hidden_documento");
            $(`#${id_documento_adjunto}`).removeClass("file_delete"); // quitamos la clase para que no se borre al realizar el submit
            $(`#${id_documento_adjunto}`).addClass("active_documento"); // clase para compar si hay documentos en la lista (si no hay ocultamos la lista)
        
        // mostramos la lista de documentos adjuntos
            $("#cont_lista_documentos_adjuntos").show(200);
            $("#modal_id_documento_adjunto").val(""); // limpiamos en input de ingreso de nombre del documento 
            $("#modal_nameFile").val("");
        
        // ocultamos la modal
            $("#modalVistaPreviaDocumento").modal("hide");

    }

    // funcion para no agregar el documento seleccionado
    function cancelarDocumento(){
        var id_documento_adjunto = $("#modal_id_documento_adjunto").val();
        $(`#${id_documento_adjunto}`).remove();
        $("#modalVistaPreviaDocumento").modal("hide");
    }

    // función que desplega una modal para visualizar el documento
    function visualizarDocumentoAdjunto(btn){
        var input = $(btn).parent().find(".nombreDocumento"); // obtenemos el input file que contiene el archivo seleccionado
        $('#content_visualizarDocumento').html(`<iframe src="${URL.createObjectURL($(input)[0].files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
        $(".modal_visualizarDocumento").modal();
    }


    // fucion para eliminar la estrucutura de un documento (ED) adjuntado en la lista
    function quitarDocumentoAdjunto(btn){

        swal({
            title: "",
            text: "¿Está seguro que desea quitr el documento adjunto?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, quitarlo!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            if (isConfirm){ // si dice que quiere eliminar
            
                var borrar = $(btn).parent(); // obtenemos el div que vamos a quitar
                $(borrar).removeClass("active_documento"); // quitamos la clase que confirma que el documento esta visible
                $(borrar).hide(200);// ocultamos la ED que se va a eliminar

                // agregamos el tipo de tramite a los combos ---------------------------------------

                    var idtipo_documento = $(borrar).find(".idtipo_documento_adj").val();
                    var descripcion_tipo_documento = $(borrar).find(".tipo_documento_adj").html();
                    var tam_archivo_selec = $(borrar).find(".tam_archivo_selec");
                    if($(tam_archivo_selec).length==0){
                       tam_archivo_selec = 0;
                    }else{
                       tam_archivo_selec = $(tam_archivo_selec).val();
                    }

                    contador_megas = parseFloat(contador_megas)-parseFloat(tam_archivo_selec);
                    contador_megas = Math.round( contador_megas * 100 )/100;
                    if(contador_megas<=(tamMaxDoc-1)){ 
                        $("#content_maxmegas").removeClass("label-danger");
                        $("#content_maxmegas").addClass("label-default");
                    }
                    $("#megas_subidas").html(contador_megas);

                    // agregamos al combo de tipo de documento el tipo del documento eliminado
                    // $(".cmb_tipo_documento").append(`
                    //     <option value="${idtipo_documento}">${descripcion_tipo_documento}</option>
                    // `);
                    // $(".cmb_tipo_documento").trigger("chosen:updated"); // actualizamos el combo

                // ------------------------------------------------------------------------------------

                // esperamos que termine la animacion para borrar dicha ED
                setTimeout(function(){ 
                    $(borrar).remove(); // borramos el html de la ED
                    // buscamos cuantas ED estan en la lista
                    var numDocAdj = $("#lista_documentos_adjuntos").find(".active_documento").length;
        
                    if(numDocAdj<=0){ // si no hay ninguna ED ejecutamos
                        $("#cont_lista_documentos_adjuntos").hide(200);// ocultar el contenedor de la lista de documentos adjuntos
                    }
                }, 250);


            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });

    }

    // evento para quitar los documentos adjuntos que se cancelaron
    $("#btn_guardar_borrador").click(function(){
        //quitamos  los documentos adjuntos que se cancelaron
        $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
    });

// ======================= /FUNCIONES PARA ADJUNTAR DOCUMENTO ===================================