
    $(document).ready(function(){

        // CARGAR CARACTERITICAS DEL EDITOR DE TEXTO TINYMCE (EDITOR DE TEXTO)
        tinymce.init({
            selector: 'textarea#full-featured-non-premium',
            language: 'es',
            plugins: 'preview fullpage paste importcss searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars',
            imagetools_cors_hosts: ['picsum.photos'],
            menubar: 'file edit view insert format tools table help',
            toolbar: 'undo redo | preview | bold italic underline strikethrough | fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak charmap | fullscreen save print | insertfile image media template link anchor codesample | ltr rtl',
            toolbar_sticky: true,
            autosave_interval: "30s",
            autosave_prefix: "{path}{query}-{id}-",
            autosave_restore_when_empty: false,
            autosave_retention: "2m",
            image_advtab: true,
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '/EditorTextoTinymce/css/codepen.min.css'
            ],
            link_list: [
                { title: 'My page 1', value: 'http://www.tinymce.com' },
                { title: 'My page 2', value: 'http://www.moxiecode.com' }
            ],
            image_list: [
                { title: 'My page 1', value: 'http://www.tinymce.com' },
                { title: 'My page 2', value: 'http://www.moxiecode.com' }
            ],
            image_class_list: [
                { title: 'None', value: '' },
                { title: 'Some class', value: 'class-name' }
            ],
            importcss_append: true,
            height: 400,
            file_picker_callback: function (cb, value, meta) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
            
                /*
                  Note: In modern browsers input[type="file"] is functional without
                  even adding it to the DOM, but that might not be the case in some older
                  or quirky browsers like IE, so you might want to add it to the DOM
                  just in case, and visually hide it. And do not forget do remove it
                  once you do not need it anymore.
                */
            
                input.onchange = function () {
                  var file = this.files[0];
            
                  var reader = new FileReader();
                  reader.onload = function () {
                    /*
                      Note: Now we need to register the blob in TinyMCEs image blob
                      registry. In the next release this part hopefully won't be
                      necessary, as we are looking to handle it internally.
                    */
                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
            
                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), { title: file.name });
                  };
                  reader.readAsDataURL(file);
                };
            
                input.click();
            },
            templates: [
                { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
                { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
            ],
            template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
            template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
            height: 600,
            image_caption: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_noneditable_class: "mceNonEditable",
            toolbar_drawer: 'sliding',
            contextmenu: "link image imagetools table",
            init_instance_callback: function (editor) {
                editor.on('BeforeExecCommand', function (e) {
                    if (e.command == "mcePreview") {                     
                        e.preventDefault();
                        cargar_vista_previa_documento();
                    }
                });
            }
        });

        // /CARGAR CARACTERITICAS DEL EDITOR DE TEXTO TINYMCE (EDITOR DE TEXTO)

    });





// ================= FUNCIONES PARA LA BUSCAR Y AGREGAR UN DESTINATARIO =======================

    //function que busca un funcionario o interesado
    $("#btn_buscar_para_copia").click(function(){
        $("#modal_buscar_agregar_para_copia").modal();
    
        // cargamos en la modal los departamentos destino
        if(!$("#areaGeneralDepartamentoAgregados").hasClass("hidden")){
            $("#div_conteDepEnviar_modal").html($("#div_conteDepEnviar").html());
            // agregamos los bordes y ocultamos el boton de borrar
            $("#div_conteDepEnviar_modal").find(".depEnviar_content").addClass("depEnviar_content_modal"); // agregar bordes
            $("#div_conteDepEnviar_modal").find(".depParaInteres_btn_quitar").removeClass("hidden"); // mostrar boton
            // mostramos en al ventar modal
            $("#areaGeneralDepartamentoAgregados_modal").removeClass("hidden");
        }

        if(!$("#areaGeneralDepartamentoCopias").hasClass("hidden")){
            $("#div_conteCopiaEnviar_modal").html($("#div_conteCopiaEnviar").html());
            // quitamos los bordes y ocultamos el boton de borrar
            $("#div_conteCopiaEnviar_modal").find(".depEnviar_content").addClass("depEnviar_content_modal"); // agregar bordes
            $("#div_conteCopiaEnviar_modal").find(".depParaInteres_btn_quitar").removeClass("hidden"); // mostrar boton
            // mostramos en al ventar modal
            $("#areaGeneralDepartamentoCopias_modal").removeClass("hidden");
        }

        // limpiamos los resultados de una busqueda
        $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div> `);
        // limpiamos el input de busqueda
        $("#input_buscar").val("");

    });


    //FUNCION PARA BUSCAR UN DEPARTAMENTO O INTERESADO AL ESCRIBIR EN EL BUSCADOR 
    $("#input_buscar").keyup(function(e){
        if(e.keyCode==13){ //solo si se da enter
            buscarParaOCopia();
        }
    });

    var time = null;
    $("#input_buscar").keyup(function(e){
        clearTimeout(time);
        time = setTimeout(function(){
            buscarParaOCopia();
        }, 400);
    });

    
    function buscarParaOCopia(){
       
        var busqueda = $("#input_buscar").val();
        //validamos que la busqueda no este vacia
        if(busqueda==""){return;}

        addSpinner("Buscando...", "#label_buscar"); // ponemos el mensaje de cargando
        // para saber el detalle actividad que se esta editando
        var iddetalle_act = $("#buscar_iddetalle_act").val();
        var lugar = $('#buscar_lugar').val();

        $.get(`/detalleActividad/buscarFuncionario/${busqueda}/${iddetalle_act}/${lugar}`,function (retorno){
            
            console.log(retorno);
            // limpiamos el mensaje de buscando
            removeSpinner("Buscar:", "#label_buscar");

            if(retorno.error){
                $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
            }else{
                // si la consulta retorna con resultado nulo limpiamos la tabla
                if(retorno.lista_actus_us001.length == 0){                    
                    $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);                    
                    return;
                }

                var tb_thead = "";
                var tb_tbody = "";

                
                //---------------- LLENAR TABLA DE RESULTADO DE BUSQUEDA ---------------------------
            
                        // agregamos la cabecera a la tabla
                        tb_thead=(`
                            <th>Nº</th>
                            <th>Actividad</th>                 
                            <th>Cédula</th>
                            <th>Funcionario Público</th>                   
                            <th style="width: 145px;">Agregar Como</th>
                        `);

                        $("#tbody_resultado_busqueda").html(""); // limpiamos la tabla de resultados de busqueda
                    
                        $.each(retorno.lista_actus_us001, function (index, act_us001){  // rellenamos la tabla con los datos de los departamentos resultado
                            
                            var disabled = "";
                            if(verificarInformacionAgregada(act_us001.idactividad_us001)){
                                disabled = "disabled";
                            }
                           
                            nombre_usuario = act_us001.us001.name;
                            if(act_us001.us001.nombre_documental != null && act_us001.us001.nombre_documental!=""){
                                nombre_usuario = act_us001.us001.nombre_documental;
                            }
                            //si es secretaria o jefe le quitamos la opcion de enviar como copia
                            var boton_copia =  (`<button ${disabled} onclick="agregarFuncionarioComo('C', '${act_us001.idactividad_us001_encrypt}','${act_us001.idactividad_us001}', '${act_us001.actividad.descripcion}', '${nombre_usuario}')" class="btn btn-warning btn-xs" type="button" style="width:45%; margin: 3px 0px 3px 0px;"><i class="fa fa-copy"></i> Copia</button>`);
                            if(act_us001.actividad.principal == 1){ boton_copia = ""; }

                            tb_tbody=tb_tbody+(`  
                                <tr>
                                    <td scope="row">${(index+1)}</td>
                                    <td>${act_us001.actividad.descripcion}</td>
                                    <td>${act_us001.us001.cedula}</td>
                                    <td>${nombre_usuario}</td>
                                    <td id="td_btn_${act_us001.idactividad_us001}">
                                        <center>
                                            <button ${disabled} onclick="agregarFuncionarioComo('P', '${act_us001.idactividad_us001_encrypt}','${act_us001.idactividad_us001}', '${act_us001.actividad.descripcion}', '${nombre_usuario}')" class="btn btn-info btn-xs" type="button" style="width:45%; margin: 3px 0px 3px 0px;"><i class="fa fa-envelope-o"></i> Para</button>
                                            ${boton_copia}
                                        </center>
                                    </td>
                                </tr>
                            `);                            

                        });
            

                //---------------- /LLENAR TABLA SI SE BUSCA FUNCIONARIO PUBLICO ---------------------------


                // cargamos con jquery la tabla completa para que se carguen los estilos
                $("#div_tabla_resutado_busqueda").html(`
                    <table class="table table-bordered table-td-sm table-td-center-vertical">
                        <thead id="thead_resultado_busqueda">
                            ${tb_thead}
                        </thead>
                        <tbody id="tbody_resultado_busqueda">
                        ${tb_tbody}
                        </tbody>
                    </table>
                `);

            }
            // vistacargando(); // ocultamos la ventana de espera
        }).fail(function(){
            alertNotificar("Error al ejecutar la petición","error");
            $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
            removeSpinner("Buscar:", "#label_buscar"); // limpiamos el mensaje de buscando
        });
    }


    // funcion para agregar departamentos a la tabla de informacio seleccionada
    function agregarFuncionarioComo(addComo, idactividad_us001_encrypt, idact_us001, actividad, nombre_fun){

        // VERIFICAMOS SI EL CHECK DE RESPONSABLE DE TRAMITE ESTA SELECCIONADO ------------

            if($('#chek_responsable_principal').is(':checked') && addComo=='P'){
                var num_destinos = $('#div_conteDepEnviar_modal').find('.depEnviar_content').length;
                if(num_destinos>0){
                    alertNotificar('Solo puede agregar un responsable al trámite', 'default');
                    return;
                }
            }

        // desabilitamos los botones de agregar Para y Copia
        $("#td_btn_"+idact_us001).find("button").prop("disabled",true); // desabilitamos los dos botones

        // variable addComo -> C= copia , P= para
        var div_mostrar = ""; // para almancenar el id del contenedor de toda la lista de dep agregados en la modal
        var div_agregar = ""; // para almancenar el id de la lista de dep agregados en la modal
        var name_input = "";  // para almanenar el name de del input que almacena el id del departamento
        if(addComo=="C"){ // si se agrega una copia
            div_mostrar = "#areaGeneralDepartamentoCopias_modal";
            div_agregar = "#div_conteCopiaEnviar_modal";
            name_input = "input_actUs001EnviarCopia[]";
        }else if(addComo=="P"){ // si se agrega un para
            div_mostrar = "#areaGeneralDepartamentoAgregados_modal";
            div_agregar = "#div_conteDepEnviar_modal";
            name_input = "input_actUs001EnviarPara[]";
        }

        $(div_agregar).append(`
            <div class="info_seleccionada_${idact_us001} depEnviar_content depEnviar_content_modal">                                                                                                                        
                <h2 class="title">
                    <i class="fa fa-cube iconoTittle"></i>
                    <button type="button" onclick="borrarInformacionSeleccionada(this,${idact_us001},'${addComo}')" class="btn btn-danger btn-xs depParaInteres_btn_quitar">
                        <i class="fa fa-remove"></i> Borrar
                    </button> 
                    <p>${nombre_fun}
                        <span class="labelInfoUser">/</span>
                        <span class="labelInfoUser"><i class="fa fa-bookmark"></i> ${actividad}</span>
                    </p>                                            
                </h2>       
                <input type="hidden" name="${name_input}" value="${idactividad_us001_encrypt}">
            </div>  
        `);

        $(div_mostrar).removeClass("hidden"); // mostramos el contenedor PARA COPIA seleccionado

        // cambiamos el incono de uso
        $("#td_btn_"+idact_us001).siblings(".td_uso").find("i").removeClass("fa-square-o"); // quitamos el icono no check
        $("#td_btn_"+idact_us001).siblings(".td_uso").find("i").addClass("fa-check-square-o"); // agregamos el icono check

    }

    // función para quitar un departamento o interesado de la lista de información seleccionada
    function borrarInformacionSeleccionada(btn_borrar,idinformacion,tipo){
        // NOTA: el parametro tipo recive ===>  (P: para)  (C: copia)  (I: interesado)
            
        var borrar = $(btn_borrar).parents(".depEnviar_content"); // obtenemos el departamento o interesado a quitar de la lista
        $(borrar).hide(200);// primero lo ocultamos con jquery
        $(borrar).removeClass("depEnviar_content")// le quitamos la clase para decir que se va a borrar
        setTimeout(() => { // esperamos uno segundos a que se borre
            $(borrar).remove(); // ya oculto lo borramos del todo
            // validamos si hay mas en su lista
            if(tipo=="P"){ // si se borró de la lista de para
                existen = $("#div_conteDepEnviar_modal").find(".depEnviar_content").length;
                if(existen<=0){$("#areaGeneralDepartamentoAgregados_modal").addClass("hidden");}
            }else if(tipo=="C"){ // si se borró de la lista de copias
                existen = $("#div_conteCopiaEnviar_modal").find(".depEnviar_content").length;
                if(existen<=0){$("#areaGeneralDepartamentoCopias_modal").addClass("hidden");}
            }else{ // si se borró de la lista de interesados
                existen = $("#div_conteInteresados_modal").find(".depEnviar_content").length;
                if(existen<=0){
                    $("#areaGeneralInteresadosAgregados_modal").addClass("hidden");
                    $("#content_Interesado_modal").addClass("hidden");
                }
            }

            // habilitamos el boton del interesado o departamento borrado
            $("#td_btn_"+idinformacion).find("button").prop("disabled",false);
            // // cambiamos el icono de uso a un icono de deschequeado
            // $("#td_btn_"+idinformacion).siblings(".td_uso").find("i").removeClass("fa-check-square-o"); // quitamos el icono no check
            // $("#td_btn_"+idinformacion).siblings(".td_uso").find("i").addClass("fa-square-o"); // agregamos el icono check

        }, 259);
        
        
    }

    // funcion para verificar si un departamento esta agregado o no en la informacio seleccionada
    function verificarInformacionAgregada(idinformacion){
        // idinformacion = puede ser un id de departamento o cedula de un interesado
        var encontrado = 0;
        // buscamos el departamento en las listas de la modal
        encontrado = $("#div_conteDepEnviar_modal").find(".info_seleccionada_"+idinformacion).length; // buscamos en los departamentos PARA
        encontrado=encontrado+ $("#div_conteCopiaEnviar_modal").find(".info_seleccionada_"+idinformacion).length; // buscamos en los departamentos COPIA
        encontrado=encontrado+ $("#div_conteInteresados_modal").find(".info_seleccionada_"+idinformacion).length; // buscamos en los Interesados agregados
        if(encontrado>0){
            return true;
        }else{
            return false;
        }
    }


    function modal_aceptar_agregarParaCopia(){

        // VERIFICAMOS SI EL CHECK DE RESPONSABLE DE TRAMITE ESTA SELECCIONADO ------------

            if($('#chek_responsable_principal').is(':checked')){
                var num_destinos = $('#div_conteDepEnviar_modal').find('.depEnviar_content').length;
                if(num_destinos>1){
                    alertNotificar('Solo puede agregar un responsable al trámite', 'default');
                    modal_cancelar_agregarParaCopia();
                    return;
                }
            }

        // SINCRONIZAR LA LISTA DE LOS PARA -----------------------------------------------

            $("#div_conteDepEnviar").html($("#div_conteDepEnviar_modal").html());
            // quitamos los bordes y ocultamos el boton de borrar
            $("#div_conteDepEnviar").find(".depEnviar_content").removeClass("depEnviar_content_modal"); // quitar bordes
            $("#div_conteDepEnviar").find(".depParaInteres_btn_quitar").addClass("hidden"); // ocultar boton

            if($("#areaGeneralDepartamentoAgregados_modal").hasClass("hidden")){
                $("#areaGeneralDepartamentoAgregados").addClass("hidden"); // ocultamos en la ventana principal
            }else{
                $("#areaGeneralDepartamentoAgregados").removeClass("hidden"); // mostramos en al ventar principal
            }
            // limpiamos la información seleccionada en la modal
            $("#areaGeneralDepartamentoAgregados_modal").addClass("hidden");
            $("#div_conteDepEnviar_modal").html("");

        // /SINCRONIZAR LA LISTA DE LOS PARA -----------------------------------------------


        // SINCRONIZAR LA LISTA DE LOS COPIAS -----------------------------------------------    
        
            $("#div_conteCopiaEnviar").html($("#div_conteCopiaEnviar_modal").html());
            // quitamos los bordes y ocultamos el boton de borrar
            $("#div_conteCopiaEnviar").find(".depEnviar_content").removeClass("depEnviar_content_modal"); // quitar bordes
            $("#div_conteCopiaEnviar").find(".depParaInteres_btn_quitar").addClass("hidden"); // ocultar boton
            
            if($("#areaGeneralDepartamentoCopias_modal").hasClass("hidden")){
                $("#areaGeneralDepartamentoCopias").addClass("hidden"); // ocultamos en la ventana principal
            }else{
                $("#areaGeneralDepartamentoCopias").removeClass("hidden");  // mostramos en al ventar principal              
            }
            // limpiamos la información seleccionada en la modal
            $("#areaGeneralDepartamentoCopias_modal").addClass("hidden");
            $("#div_conteCopiaEnviar_modal").html("");
        
        // /SINCRONIZAR LA LISTA DE LOS COPIAS -----------------------------------------------  

        // limpiamos los resultados de una busqueda
        $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
        
    }


    function modal_cancelar_agregarParaCopia(){

        // PARA: limpiamos la información seleccionada en la modal
        $("#areaGeneralDepartamentoAgregados_modal").addClass("hidden");
        $("#div_conteDepEnviar_modal").html("");

        // COPIA: limpiamos la información seleccionada en la modal
        $("#areaGeneralDepartamentoCopias_modal").addClass("hidden");
        $("#div_conteCopiaEnviar_modal").html("");
  
        // limpiamos los resultados de una busqueda
        $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
    }







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
                <button type="button" onclick="visualizarDocumentoAdjunto(this)" class="btn btn-primary btn-sm btn_doc_creado btn_visualizar"><i class="fa fa-eye"></i></button>
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
            
            //verificamos si no es pdf
            if(tipoDocSalec!="pdf" && tipoDocSalec!="PDF"){
                $("#"+id_documento_adjunto).find('.btn_visualizar').remove();
            }

            // obtenemos el tamaño del documento 
                var tamArchivo = $(`#${id_inputfile}`)[0].files[0].size; // obtenemos el tamaño del archivo
                tamArchivo = ((tamArchivo/1024)/1024);
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

    // funcion que cargar la informacion del documento seleccionado (boton "Agregar Documento" de la modal)
    var contador_megas = 0;
    function agregarDocumento(){

        var id_documento_adjunto = $("#modal_id_documento_adjunto").val();
        var nameFile = $("#modal_nameFile").val();

        var codigo_docAdj = $("#modal_codigo_docAdj").val();
        var descripcion_docAdj = $("#modal_descripcion_docAdj").val();
        var idtipo_documento_encrypt = $("#cmb_tipo_documento_docAdj").val();
        var tam_archivo_selec = $("#tam_archivo_selec").val();
        contador_megas = parseFloat(contador_megas)+parseFloat(tam_archivo_selec);
        contador_megas = Math.round( contador_megas * 100 )/100;
        if(contador_megas>=(tamMaxDoc-1)){ 
            $("#content_maxmegas").removeClass("label-success");
            $("#content_maxmegas").addClass("label-danger");
        }
        $("#megas_subidas").html(contador_megas);

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

        // quitamos el tipo de documento de la lista
            // $(`.cmb_tipo_documento option[value="${idtipo_documento_encrypt}"]`).remove(); // quitamos la opton del tipo de documento creado
            // $(".cmb_tipo_documento").trigger("chosen:updated"); // actualizamos el combo
        
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
            text: "¿Está seguro que desea quitar el documento adjunto?",
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
                        $("#content_maxmegas").addClass("label-success");
                    }
                    $("#megas_subidas").html(contador_megas);
                    
                    // agregamos al combo de tipo de documento el tipo del documento eliminado
                    // $(".cmb_tipo_documento").append(`
                    //     <option value="${idtipo_documento}">${descripcion_tipo_documento}</option>
                    // `);
                    // $(".cmb_tipo_documento").trigger("chosen:updated"); // actualizamos el combo

                    //mostramos en la lista de documentos requeridos (solo si existen)
                        var num_tipo_requerido = $("#documentos_requeridos").children('code').length;
                        if(num_tipo_requerido>0){ //flujo definido
                            $("#tipo_requerido_"+idtipo_documento.substr(0, 40)).show();
                            $("#content_documentos_requeridos").show();
                            num_tipo_requerido = $("#documentos_requeridos").children('code:visible').length;
                            $("#num_documentos_req").html(num_tipo_requerido);
                            $("#num_documentos_req").show();
                        }

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






// ================= FUNCIONES PARA CREAR DOCUMENTOS TEMPORALES ===============================

    $("#chek_editor_texto").on('ifChecked', function(event){
        $("#cont_editor_documento").show();
        $("#btn_guardar_borrador").html(`<i class="fa fa-send"></i> Firmar y Enviar`);       
    });

    $("#chek_editor_texto").on('ifUnchecked', function(event){
        $("#cont_editor_documento").hide();
        $("#btn_guardar_borrador").html(`<i class="fa fa-send"></i> Enviar`);       
    });

    //function que se ejecuta para obtener el contenido del editor de texto 
    function guardarDocumentoTermporal(){

        var contenido = tinymce.activeEditor.getContent(); // obtener el contenido creado por el editor de texto
        // var contenido_text = tinymce.get("full-featured-non-premium").getContent({format: "text"});
        // contenido_text = untag(contenido_text);
        
        // remplazamos las comillas simples
        contenido = contenido.replace("'", "&#39;");

        var idtipo_documento_encrypt = $("#cmb_tipo_documento").val(); // obtenemos el id del tipo de documento seleciconado en el combo
        var nombreTipoDocumento = $("#cmb_tipo_documento option:selected").html(); // obtenemos el html del tipo de documento seleccionado en el combo
        var descripcion_documento = "DOCUMENTO PRINCIPAL"; // obtenemos la descripcion que el usuario le da al documento

        // var descripcion_documento = $("#descripcion_documento").val(); // obtenemos la descripcion que el usuario le da al documento
        
        if(idtipo_documento_encrypt==null){
            alertNotificar("Ya no hay documentos por crear","default");
            return;
        }
        
        // validamos que se ingrese bien la información
        if(nombreTipoDocumento=="" || descripcion_documento==""){
            alertNotificar("Ingrese todos los datos del documento","default"); 
            return;
        }
            

        // agregamos la informacion del doc creado a la lista
        var identificador_doc = idtipo_documento_encrypt.substr(0,20); // generar un id al documento
        $("#lista_documentos_creados").html(`          
            <div class="contenido_guardado contenido_${identificador_doc}" style="display:none;">
                <input type="hidden" name="input_contenido_documento" value='${contenido}'>                
            </div>
            <input type="text" class="descripcion_documento desc_doc_${identificador_doc}" name="input_descripcion_documento" value="${descripcion_documento}">
            <input type="text" class="idtipo_documento" name="input_id_tipo_documento" value="${idtipo_documento_encrypt}">  
        `);
                        
    }

    function cargar_vista_previa_documento(){

        guardarDocumentoTermporal(); //generamos la data

        var formulario = $(".frm_tramite");
        if(formulario.length==0){
            console.log("No se pudo encontrar el formulario");
            return;
        }

        //verificamos que se cargue lo necesario
        var para_agregados = $("#div_conteDepEnviar div").length;
        if(para_agregados == 0 && $("#gt_asunto").val()==""){
            alertNotificar("Debe agregar al menos un destino como PARA y el ASUNTO"); return;
        }else if(para_agregados == 0){
            alertNotificar("Debe agregar al menos un destino como PARA"); return;            
        }else if($("#gt_asunto").val()==""){
            alertNotificar("Debe ingresar el ASUNTO"); return;        
        }

        formulario = formulario[0];
        var FrmData = new FormData(formulario);

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        vistacargando("M", "Espere...");

        $.ajax({
            url: `/detalleActividad/vistaPreviaDocumento`,
            method: "POST",
            data: FrmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(retorno){
                // si es completado
                vistacargando();

                if(retorno.error){
                alertNotificar(retorno.mensaje, retorno.status);
                }else{
                    $("#content_visPreviaDocGenerado").html(`<iframe src="data:application/pdf;base64,${retorno.docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 450px;"></iframe>`);
                    $("#modal_visPreviaDocGenerado").modal("show");
                }

            },
            error: function(error){
                vistacargando();
                alertNotificar("No se pudo realizar la petición, por favor intente más tarde.", "error");                    
            }
        });


    }

    function configurar_formato_documento(){
        $("#modal_formatoDocumento").modal("show");
    }

    $('#ocultar_depara').on('ifChecked', function(event){
        $("#opciones_para").hide(150);
    });

    $('#ocultar_depara').on('ifUnchecked', function(event){
        $("#opciones_para").show(150);
    });




// ================= FUNCIONES PARA FIRAR UN DOCUMENTO ============================================

    function metodofirma(){
        $("#modal_aprobar_tramite").modal("show");

        // $("#modal_firma_electronica").modal("show");
    }

    function firmaelectronica(){
        $("#modal_aprobar_tramite").modal("hide");
        $("#modal_firma_electronica").modal("show");
    }

    // funcion 1 para seleccionar un archivo
    $(".seleccionar_archivo_p12").click(function(e){
        $(this).parent().siblings('input').val($(this).parent().prop('title'));
        this.value = null; // limpiamos el archivo
    });

    // funcion 2 para seleccionar un archivo
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

    function firmarYenviar(){
        $("#modal_firma_electronica").modal("hide");
        $(".frm_tramite").addClass('firmacargada');
        $(".frm_tramite").submit();
    }




// ================= FUNCIONES PARA REGISTRAR LA DELEGACIÓN DEL TRÁMITE ===========================

    // funcion para guardar un borrador del tramite que se está iniciando
    $("#frm_delegarDetalleTramite").submit(function(e){

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

        if(!$(".frm_tramite").hasClass('firmacargada')){
            if($("#chek_editor_texto").is(':checked')){
                $("#modal_firma_electronica").modal("show");
                return;
            }
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

                        vistacargando(); // ocultamos la ventana de espera
                        retorno = requestData.responseJSON;
                        console.log(retorno);

                        // si es completado
                        alertNotificar(retorno.mensaje, retorno.status);
                        if(!retorno.error){
                            vistacargando("M","Espere...");
                            
                            window.location.href = `/gestionBandeja/entrada`;
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


