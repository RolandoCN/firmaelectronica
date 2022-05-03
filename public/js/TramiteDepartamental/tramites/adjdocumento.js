

    // ======================= FUNCIONES PARA ADJUNTAR DOCUMENTO ===================================


    var contador = 1; // inicializamos un contador para concatenar con los id a generar
    var arhivo_seleccionado = null;
    
    function seleccionarNuevoDocumento(){

        var id_inputfile = "input_file_"+contador; // id de input file para seleccionar un archivo
        var id_documento_adjunto = "documento_adjunto_"+contador; // id del contenedos visual del archivo seleccionado
        contador++; // incrementamos el contados para que los id no se repitan

        
        // agregamos oculta la estructura del documento que en teoria se va a seleccionar
        $("#lista_documentos_adjuntos").append(`
            <div id="${id_documento_adjunto}" class="alert hidden_documento file_delete f_documento_adjunto fade in docActivo" style="margin-bottom: 5px;">
                <button type="button" class="btn btn-danger btn-sm btn_doc_creado" onclick="eliminarDocumentoAdjunto(this)"><i class="fa fa-trash"></i></button>
                <button type="button" onclick="visualizarDocumentoAdjunto(this)" class="btn btn-primary btn-sm btn_doc_creado btn_visualizar"><i class="fa fa-eye"></i></button>
                <strong><i class="icono_left fa fa-file-pdf-o"></i></strong> 
                <span class="nameFile"></span>

                <hr style="margin: 10px 0px 0px 0px; border-top: 1px solid #48aecd;">
                <div class="infoDoc" style="margin-top: 10px;"></div>
                <div class="infoDocEnviar">
                    <input type="file" id="${id_inputfile}" accept="application/pdf" class="nombreDocumento hidden" value="0">
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
            
            //verificamos si no es pdf
            if(tipoDocSalec!="pdf" && tipoDocSalec!="PDF"){
                $("#"+id_documento_adjunto).find('.btn_visualizar').remove();
            }

            // obtenemos el tamaño del documento 
                
                var tamArchivo = $(`#${id_inputfile}`)[0].files[0].size; // obtenemos el tamaño del archivo
                tamArchivo = ((tamArchivo/1024)/1024);
                tamArchivo = (Math.round( tamArchivo * 100 )/100);

                if(tamArchivo>tamMaxDoc){
                    alertNotificar(`Solo se permite adjuntar un total máximo de ${tamMaxDoc}MB`, "error");
                    // eliminamos el documento oculto
                    $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
                    return;
                }

                $("#tam_archivo_selec").val(tamArchivo);

            // visualizamos el documento
                if(tipoDocSalec=="pdf" || tipoDocSalec=="PDF"){
                    $('#VistaPreviaMesj').attr('hidden',true);
                    $('#VistaPreviaDoc').attr('hidden',false);
                    $('#VistaPreviaDoc').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
                    $('#sinVistaPrevia').hide();
                }else{ // no es un PDF
                    $('#VistaPreviaDoc').html("");
                    $('#VistaPreviaDoc').prop("hidden", true);
                    $('#sinVistaPrevia').show();
                }

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

    // funcion que sube un documento un documento
    function subirDocumento(){

        iddetalle_tramite = $("#adj_iddetalle_tramite").val();
        iddetalle_actividad = $("#adj_iddetalle_actividad").val();

        var codigo_docAdj = $("#modal_codigo_docAdj").val();
        var descripcion_docAdj = $("#modal_descripcion_docAdj").val();
        var idtipo_documento_encrypt = $("#cmb_tipo_documento_docAdj").val();

        // ---------------------------------------------------------------------------------
        if(descripcion_docAdj=="" || descripcion_docAdj==null){ // si no se ingresa el nombre del documento
            alertNotificar('Ingrese toda la información antes de agregar el documento','error');
            return;
        }

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var id_inputfile = "input_file_"+(contador-1); // id de input file para seleccionar un archivo
        var archivo_subir = $(`#${id_inputfile}`)[0].files[0];

        var FrmData = new FormData();
        FrmData.append('archivo', archivo_subir);
        FrmData.append('codigo', codigo_docAdj);
        FrmData.append('descripcion', descripcion_docAdj);
        FrmData.append('idtipo_documento', idtipo_documento_encrypt);
    
        FrmData.append('iddetalle_tramite', iddetalle_tramite);
        FrmData.append('iddetalle_actividad', iddetalle_actividad);

        vistacargando("M", "Subiendo...");
        $.ajax({
            url: `/detalleTramite/subirDocumentoDetalleTramite`,
            method: "POST",
            data: FrmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(retorno){
                // si es completado
                vistacargando();
                alertNotificar(retorno.mensaje, retorno.status);
                if(!retorno.error){
                    cargarDocumentosDetalleTramite();
                    $("#modalVistaPreviaDocumento").modal("hide");
                }
            },
            error: function(error){
                vistacargando();
                alertNotificar("No se pudo subir el documento, por favor intente más tarde.", "error");                    
            }
        });

    }

    // funcion que visualiza un documento seleccionado
    // boton de la modal
    function addDocumento(){

        var id_documento_adjunto = $("#modal_id_documento_adjunto").val();
        var nameFile = $("#modal_nameFile").val();

        var codigo_docAdj = $("#modal_codigo_docAdj").val();
        var descripcion_docAdj = $("#modal_descripcion_docAdj").val();
        var idtipo_documento_encrypt = $("#cmb_tipo_documento_docAdj").val();
        var tam_archivo_selec = $("#tam_archivo_selec").val();

        var descripcion_tipo_documento_adj = $(`#cmb_tipo_documento_docAdj option[value="${idtipo_documento_encrypt}"]`).html();

        // ---------------------------------------------------------------------------------
        if(descripcion_docAdj=="" || descripcion_docAdj==null){ // si no se ingresa el nombre del documento
            alertNotificar('Ingrese toda la información antes de agregar el documento','error');
            return;
        }

        if(idtipo_documento_encrypt==null && $("#idtipo_documento_editar").val()==0){
            alertNotificar("Ya no hay documentos por crear","default"); // verificamos que aya documentos
            cancelarDocumento();
            return;
        }
        
        // quitamos de la lista de documentos requeridos
            $("#tipo_requerido_"+idtipo_documento_encrypt.substr(0, 40)).hide();
            var num_tipo_requerido = $("#documentos_requeridos").children('code:visible').length;
            $("#num_documentos_req").html(num_tipo_requerido);
            if(num_tipo_requerido == 0){
                $("#content_documentos_requeridos").hide();
                $("#num_documentos_req").hide();
            }

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
                <input type="hidden" class="idtipo_documento_adj">
                <input type="hidden" value="${codigo_docAdj}">
                <input type="hidden" value="${descripcion_docAdj}">
            `);

        // CARGAMOS TODA LA INFORMACIÓN DEL DOCUMENTO
            $("#"+id_documento_adjunto).find('.nameFile').html(`<b><span style="color: #38a7c9; font-weight: 800;">${tam_archivo_selec} MB</span> ${nameFile}</b>`);
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
    function salirDocumento(){
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

    // funcion para eliminar la estrucutura de un documento (ED) adjuntado en la lista
    function eliminarDocumentoAdjunto(btn, iddocumento_encrypt){

        swal({
            title: "",
            text: "¿Está seguro que desea eliminar el documento adjunto?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, eliminar!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            if (isConfirm){ // si dice que quiere eliminar
                
                // eliminamos el documento ---------------------------------------

                    vistacargando("M", "Eliminando...");
                    $.get('/detalleTramite/delDocDetalleTramite/'+iddocumento_encrypt, function(retorno){

                        vistacargando();
                        alertNotificar(retorno.mensaje, retorno.status);
                        if(!retorno.error){
                            cargarDocumentosDetalleTramite();
                        }

                    }).fail(function(){
                        vistacargando();
                        alertNotificar("No se pudo realizar la solicitud, por favor inténtelo más tarde", "error");
                    });
                    
                // ------------------------------------------------------------------------------------


            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });

    }

    // funcion para cargar los documentos subidos al tramite
    $(document).ready(function(){
        cargarDocumentosDetalleTramite();
    });

    function cargarDocumentosDetalleTramite(){

        iddetalle_tramite = $("#adj_iddetalle_tramite").val();
        iddetalle_actividad = $("#adj_iddetalle_actividad").val();

        $("#lista_documentos_adjuntos").html(`<center style="padding: 0px 10px;">${getSpinnerCargando('Obteniendo Documentos')}</center>`);
        $("#cont_lista_documentos_adjuntos").show();

        $.get(`/detalleTramite/getDocDetalleTramite/${iddetalle_tramite}/${iddetalle_actividad}`, function(retorno){
            
            $("#lista_documentos_adjuntos").html("");
            $("#cont_lista_documentos_adjuntos").hide();

            $.each(retorno.lista_documentos, function (index, documento) { 

                if(documento.codigoDocumento=="" || documento.codigoDocumento==null){
                    var infoDoc = (`                    
                        <b class="separardor">DESCRIPCIÓN: </b> <span class="separador_i">${documento.descripcion}</span>
                        <b class="separardor">TIPO DOCUMENTO: </b> <span class="tipo_documento_adj">${documento.tipo_documento.descripcion}</span>
                    `);
                }else{
                    var infoDoc = (`
                        <b class="separardor">CÓDIGO:</b> <span class="separador_i">${documento.codigoDocumento}</span>
                        <b class="separardor">DESCRIPCIÓN: </b> <span class="separador_i">${documento.descripcion}</span>
                        <b class="separardor">TIPO DOCUMENTO: </b> <span class="tipo_documento_adj">${documento.tipo_documento.descripcion}</span>
                    `);
                }

                $("#lista_documentos_adjuntos").append(`
                    <div class="alert file_delete f_documento_adjunto fade in docActivo" style="margin-bottom: 5px;">
                        <button type="button" class="btn btn-danger btn-sm btn_doc_creado" onclick="eliminarDocumentoAdjunto(this, '${documento.iddocumento_encrypt}')"><i class="fa fa-trash"></i></button>
                        <a href="/tramite/obtenerDocumentoRedirect/${documento.iddocumento_encrypt}" target="_blank" class="btn btn-primary btn-sm btn_doc_creado btn_visualizar"><i class="fa fa-eye"></i></a>
                        <strong><i class="icono_left fa fa-file-pdf-o"></i></strong> 
                        <span class="nameFile">
                            <b>${documento.rutaDocumento}.${documento.extension}</b>
                        </span>
        
                        <hr style="margin: 10px 0px 0px 0px; border-top: 1px solid #48aecd;">
                        <div class="infoDoc" style="margin-top: 10px;">                        
                            ${infoDoc}
                        </div>
                        <div class="infoDocEnviar">
                            <input type="file" accept="application/pdf" class="nombreDocumento hidden" value="0">
                        </div>
                    </div>  
                `);
                $("#cont_lista_documentos_adjuntos").show();
            });

        }).fail(function(){
            $("#lista_documentos_adjuntos").html("");
            $("#cont_lista_documentos_adjuntos").hide();
        });
    }

    // ======================= /FUNCIONES PARA ADJUNTAR DOCUMENTO ===================================
