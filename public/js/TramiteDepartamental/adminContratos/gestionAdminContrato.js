
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
            file_picker_callback: function (callback, value, meta) {
                /* Provide file and text for the link dialog */
                if (meta.filetype === 'file') {
                callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                }

                /* Provide image and alt text for the image dialog */
                if (meta.filetype === 'image') {
                callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
                }

                /* Provide alternative source and posted for the media dialog */
                if (meta.filetype === 'media') {
                callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
                }
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


    function limpiarTodo(){

        // reiniciamos el contenido del editor de documento
        tinyMCE.activeEditor.setContent(`<p style="text-align: center; font-size: 13px;">
            <p style="font-size: 13px; text-align: left;">De mi consideración: <br><br><br><br><br><br>
            <span  style="margin-top: 100px;">Con sentimientos de distinguida consideración.</span> </p>`);

        // ------- limpiamos el contenido de la ventana principal ------------
            //limpiamos todos los PARA agregados en la venana principal
            $("#areaGeneralDepartamentoAgregados").addClass("hidden");
            $("#div_conteDepEnviar").html("");
            //limpiamos todos las COPIAS agregadas en la venana principal
            $("#areaGeneralDepartamentoCopias").addClass("hidden");
            $("#div_conteCopiaEnviar").html("");
            //limpiamos todos los INTERESADOS agregados en la venana principal
            $("#areaGeneralInteresadosAgregados").addClass("hidden");
            $("#div_conteInteresados").html("");
    
        // ---- limpiamos inputs y habilitar de deshabilitar conponentes ------
            $("#input_buscar").val("");

        // ---- mostramos la pestaña de informacion del trámite
            $("#a_informacion_tramite").click();

        // ---- limpiamos el los campos ------------
            $("#gt_asunto").val("");
            $("#gt_observaciones").val("");

        // ---- limpiamos los documentos adjuntos ----------
            $("#lista_documentos_adjuntos").html("");
            $("#cont_lista_documentos_adjuntos").hide();

        // ---- limpiamos la información de los tipo de documentos a adjuntar ----
            $("#num_documentos_req").hide();
            $("#num_documentos_req").html("");
            $("#documentos_requeridos").html("");
            $("#content_documentos_requeridos").hide();
    }


// ================= FUNCIONES PARA CREAR DOCUMENTOS TEMPORALES ===============================

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
                <input type="hidden" name="input_contenido_documento[]" value='${contenido}'>                
            </div>
            <input type="text" class="descripcion_documento desc_doc_${identificador_doc}" name="input_descripcion_documento[]" value="${descripcion_documento}">
            <input type="text" class="idtipo_documento" name="input_id_tipo_documento[]" value="${idtipo_documento_encrypt}">  
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
            url: `/adminContratos/vistaPreviaDocumento`,
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

// ================= /FUNCIONES PARA CREAR DOCUMENTOS TEMPORALES ===============================



// ================= FUNCIONES PARA LA BUSCAR Y AGREGAR UN DESTINATARIO =======================



    //function que busca un departamento, funcionario o interesado
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



    // funcion para abrir la modal para agregar interesados al tramite
    $("#btn_buscar_interesado").click(function(){
        $("#modal_buscar_agregar_interesado").modal();

        // cargamos en la modal los interesados agregados
        if(!$("#areaGeneralInteresadosAgregados").hasClass("hidden")){
            $("#div_conteInteresados_modal").html($("#div_conteInteresados").html());
            // quitamos los bordes y ocultamos el boton de borrar
            $("#div_conteInteresados_modal").find(".depEnviar_content").addClass("depEnviar_content_modal"); // agregar bordes
            $("#div_conteInteresados_modal").find(".depParaInteres_btn_quitar").removeClass("hidden"); // mostrar boton
            // mostramos en al ventar modal
            $("#areaGeneralInteresadosAgregados_modal").removeClass("hidden");
            $("#content_Interesado_modal").removeClass("hidden");

        }
    });



    //funcion para habilitar el boton de agregar interesado
    $("#gf_select_procedencia").change(function(){
        var procedencia = $("#gf_select_procedencia option:selected").data('field-id');
        if(procedencia == "INT"){ // la procedencia del trámite es interna
            $("#btn_buscar_interesado").hide(200);
        }else if(procedencia == "EXT"){ // la procedencia del trámite es externa
            if($("#btn_buscar_interesado").hasClass("hidden")){
                $("#btn_buscar_interesado").hide();
                $("#btn_buscar_interesado").removeClass("hidden");
            }
            $("#btn_buscar_interesado").show(200);
        }
    });



    //funcion para validar si el tipoTramite tiene un flujo definido
    $("#gf_select_tipo_tramite").change(function(e){
        var idTipoTramite = $("#gf_select_tipo_tramite").val();
    
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`/tramite/verificarFlujoTipoTramite/${idTipoTramite}`, function (resultado){
            console.clear();
            console.log(resultado);

            vistacargando(); // ocultamos la ventana de espera

            if(resultado.error){
                // error se modifica el codigo html
                vistacargando(); // ocultamos la ventana de espera
                alertNotificar("La petición no se pudo realizar", "error");
                return;
            }else if(!resultado.flujo){
                
                // alertNotificar("El tipo de trámite no tiene un flujo definido", "default"); return; //borrar solo este codigo
                
                // no tiene flujo definido o el que tiene definido no esta finalizado

                    // agregamos las opciones de agregar destino en la modal de buscarParaInteresados
                    $(".option_nointeresado").show(); // mostamos las opciones que no sean interesado
                    $("#option_interesado").prop("selected",false); // deleseleccionamos la opcion de interesado

                    // mostramos el boton para agregar  (Para, Copias) del departamento destino
                    if($("#btn_buscar_para_copia").hasClass("hidden")){
                        $("#btn_buscar_para_copia").hide();
                        $("#btn_buscar_para_copia").removeClass("hidden");
                    }
                    $("#btn_buscar_para_copia").show(200);
                    

                    // cambiamos el mensaje el input de busqueda
                    $("#input_buscar").attr("placeholder","Ingrese el nombre, cedula de un funcionario o información de un departamento");
                        
                // limpiamos el contenedor de departamentos agregados
                $("#areaGeneralDepartamentoAgregados").addClass("hidden");
                $("#div_conteDepEnviar").html("");
                
            }else{
                // si tiene un flujo bien definido (finalizado)
                
                // cargamos la informacion del departamento al que se va a enviar el tramite
                $.each(resultado.primerNodoFlujoTramite.flujo_hijo,function(index, flujo_destino){

                    if(flujo_destino.tipo_envio=="P"){// si es un destino para
                        $("#areaGeneralDepartamentoAgregados").removeClass("hidden");  //mostramos el contenedor de PARA
                        $("#div_conteDepEnviar").append(`
                            <div class=" depEnviar_content">                                                                                                                        
                                <h2 class="title">
                                    <i class="fa fa-cube iconoTittle"></i>
                                    <p>${flujo_destino.departamento_jefe.us001_tipofp[0].us001.name}
                                        <span class="labelInfoUser">/</span>
                                        <span class="labelInfoUser"><i class="fa fa-bookmark"></i> ${flujo_destino.departamento_jefe.nombre}</span>
                                    </p>                                            
                                </h2>       
                                <input type="hidden" name="input_depaEnviarPara[]" value="${flujo_destino.departamento_jefe.iddepartamento_encrypt}">
                            </div>                 
                        `);

                    }else{// si es un destino copia
                        $("#areaGeneralDepartamentoCopias").removeClass("hidden"); //mostramos el contenedor de COPIA
                        $("#div_conteCopiaEnviar").append(`
                            <div class=" depEnviar_content">                                                                                                                        
                                <h2 class="title">
                                    <i class="fa fa-cube iconoTittle"></i>
                                    <p>${flujo_destino.departamento_jefe.us001_tipofp[0].us001.name}
                                        <span class="labelInfoUser">/</span>
                                        <span class="labelInfoUser"><i class="fa fa-bookmark"></i> ${flujo_destino.departamento_jefe.nombre}</span>
                                    </p>                                            
                                </h2>       
                                <input type="hidden" name="input_depaEnviarCopia[]" value="${flujo_destino.departamento_jefe.iddepartamento_encrypt}">
                            </div>                 
                        `);
                    }

                });



                // quitamos las opciones de agregar destino en la modal de buscarParaInteresados
                    $(".option_nointeresado").hide(); // ocultamos las opciones que no sean interesado
                    $(".option_nointeresado").prop("selected",false);
                    $("#option_interesado").prop("selected",true); // seleccionamos por defecto la opcion de interesado                   
                    $("#btn_buscar_para_copia").hide(200);// ocultamos el boton para agregar (Para, Copias) del departamenento destino

            }

            $("#content_gestion_tramite").removeClass("disabled_content"); // habilitamos todas las opciones de iniciar un tramite
            $("#content_btnTramie").removeClass("disabled_content"); // habilitamos los botones
            $("#tramite_alerta_general").hide(200); // ocultamos las alerta (en caso que exista o no)
            $("#btn_subir_tramite").hide(); // ocultamos el boton de finalizar el trámite
            $("#content_select_tipo_tramite").addClass("disabled_content"); // desabilitamos el combo de selección de tipo de tramite
            $("#content_select_procedencia").addClass("disabled_content"); // desabilitamos el combo de selección de procedencia del tramite
            $("#content_select_prioridad").addClass("disabled_content"); // desabilitamos el combo de selección de prioridad

            // mostramos por unos segundos la informacion de la cabecera del documento
            if($("#alerta_info_cabe_pie").hasClass("hidden")){
                $("#alerta_info_cabe_pie").hide();
                $("#alerta_info_cabe_pie").removeClass("hidden");
            }
            $("#alerta_info_cabe_pie").show(400);
            setTimeout(function(){ 
                $("#alerta_info_cabe_pie").hide(400);
            },10000);

            // CARGAMOS EL COMBO DE LOS TIPOS DE DOCUMENTOS QUE DEBE O PUEDE GENERAR

            $(".cmb_tipo_documento").html(""); // limpiamos los option asignados
            $.each(resultado.listaTipoDocumentos, function(index, tipo_documento){
                $(".cmb_tipo_documento").append(`
                    <option value="${tipo_documento.idtipo_documento_encrypt}">${tipo_documento.descripcion}</option>
                `);

                if(resultado.flujo){ // solo si tiene flujo definido
                    //cargamos los tipo de documentos por adjuntar
                    $("#num_documentos_req").html(resultado.listaTipoDocumentos.length);
                    $("#num_documentos_req").show();

                    $("#content_documentos_requeridos").show();
                    $("#documentos_requeridos").append(`<code id="tipo_requerido_${tipo_documento.idtipo_documento_encrypt.substr(0, 40)}" class="doc_requeridos">${tipo_documento.descripcion}</code>`);
                }

            });
            $(".cmb_tipo_documento").trigger("chosen:updated"); // actualizamos el combo

        }).fail(function(){
            vistacargando(); // ocultamos la ventana de espera
        });
        
    });



    // FUNCION PARA BUSCAR UN DEPARTAMENTO O INTERESADO AL ESCRIBIR EN EL BUSCADOR 
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

        $.get('/adminContratos/buscarParaCopia/'+busqueda,function (resultado){

            // limpiamos el mensaje de buscando
            removeSpinner("Buscar:", "#label_buscar");

            if(resultado.error){
                // vistacargando(); // ocultamos la ventana de espera
                alertNotificar("Resultados no encontrados","default");
                $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
            }else{
                // si la consulta retorna con resultado nulo limpiamos la tabla
                if(resultado.resultado.length == 0){
                    // alertNotificar("Resultados no encontrados","default");
                    $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
                    // vistacargando(); // ocultamos la ventana de espera
                    return;
                }

                var tb_thead = "";
                var tb_tbody = "";

                
                //---------------- LLENAR TABLA DE RESULTADO DE BUSQUEDA ---------------------------
            
                        // agregamos la cabecera a la tabla
                        tb_thead=(`
                            <th>Nº</th>
                            <th>Departamento</th>
                            <th>Abreviación</th>
                            <th>Cédula</th>
                            <th>Funcionario Público</th>
                            <th>Tipo FP</th>
                            <th style="width: 145px;">Agregar Como</th>
                        `);

                        $("#tbody_resultado_busqueda").html(""); // limpiamos la tabla de resultados de busqueda
                    
                        $.each(resultado.resultado, function (index, departamento){  // rellenamos la tabla con los datos de los departamentos resultado

                            var disabled = "";
                            if(verificarInformacionAgregada(departamento.iddepartamento)){
                                disabled = "disabled";
                            }

                            us001_tipofp_jefe = null;
                            $.each(departamento.us001_tipofp, function (i, usfp){ 
                                if(usfp.jefe_departamento==1){
                                    us001_tipofp_jefe = usfp;
                                }
                            });

                            if(us001_tipofp_jefe!=null){
                                tb_tbody=tb_tbody+(`  
                                    <tr>
                                        <td scope="row">${(index+1)}</td>
                                        <td>${departamento.nombre}</td>
                                        <td>${departamento.abreviacion}</td>
                                        <td>${us001_tipofp_jefe.us001.cedula}</td>
                                        <td>${us001_tipofp_jefe.us001.name}</td>
                                        <td>${us001_tipofp_jefe.tipofp.descripcion}</td>
                                        <td id="td_btn_${departamento.iddepartamento}">
                                            <center>
                                                <button ${disabled} onclick="agregarDepartamentoComo('P', '${departamento.iddepartamento_encrypt}','${departamento.iddepartamento}')" class="btn btn-info btn-xs" type="button" style="width:45%; margin: 3px 0px 3px 0px;"><i class="fa fa-envelope-o"></i> Para</button>
                                                <button ${disabled} onclick="agregarDepartamentoComo('C', '${departamento.iddepartamento_encrypt}','${departamento.iddepartamento}')" class="btn btn-warning btn-xs" type="button" style="width:45%; margin: 3px 0px 3px 0px;"><i class="fa fa-copy"></i> Copia</button>                                     
                                            </center>
                                        </td>
                                    </tr>
                                `);
                            }


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
    function agregarDepartamentoComo(addComo, iddepartamento_encrypt,iddep){

        // desabilitamos los botones de agregar Para y Copia
        $("#td_btn_"+iddep).find("button").prop("disabled",true); // desabilitamos los dos botones

        // variable addComo -> C= copia , P= para
        var div_mostrar = ""; // para almancenar el id del contenedor de toda la lista de dep agregados en la modal
        var div_agregar = ""; // para almancenar el id de la lista de dep agregados en la modal
        var name_input = "";  // para almanenar el name de del input que almacena el id del departamento
        if(addComo=="C"){ // si se agrega una copia
            div_mostrar = "#areaGeneralDepartamentoCopias_modal";
            div_agregar = "#div_conteCopiaEnviar_modal";
            name_input = "input_depaEnviarCopia[]";
        }else if(addComo=="P"){ // si se agrega un para
            div_mostrar = "#areaGeneralDepartamentoAgregados_modal";
            div_agregar = "#div_conteDepEnviar_modal";
            name_input = "input_depaEnviarPara[]";
        }

        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`/tramite/buscarDepartamento/${iddepartamento_encrypt}`, function(resultado){

            $(div_agregar).append(`
                <div class="info_seleccionada_${iddep} depEnviar_content depEnviar_content_modal">                                                                                                                        
                    <h2 class="title">
                        <i class="fa fa-cube iconoTittle"></i>
                        <button type="button" onclick="borrarInformacionSeleccionada(this,${iddep},'${addComo}')" class="btn btn-danger btn-xs depParaInteres_btn_quitar">
                            <i class="fa fa-remove"></i> Borrar
                        </button> 
                        <p>${resultado.resultado.us001_tipofp[0].us001.name}
                            <span class="labelInfoUser">/</span>
                            <span class="labelInfoUser"><i class="fa fa-bookmark"></i> ${resultado.resultado.nombre}</span>
                        </p>                                            
                    </h2>       
                    <input type="hidden" name="${name_input}" value="${resultado.resultado.iddepartamento_encrypt}">
                </div>  
            `);

            $(div_mostrar).removeClass("hidden"); // mostramos el contenedor PARA COPIA seleccionado

            // cambiamos el incono de uso
            $("#td_btn_"+iddep).siblings(".td_uso").find("i").removeClass("fa-square-o"); // quitamos el icono no check
            $("#td_btn_"+iddep).siblings(".td_uso").find("i").addClass("fa-check-square-o"); // agregamos el icono check
            
            vistacargando(); // ocultamos la ventana de espera

        }).fail(function(){
            vistacargando(); // ocultamos la ventana de espera
        });
    }


    // funcion para agregar un interesado a la tabla de informacion seleccionada
    function agregarInteresadoComo(){
        // NOTA: la cedula que viene encriptada es para realizar la consulta, la otra es para acceder a los id de los td
        var buscarCedula = $("#input_buscar_interesado").val();
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`/tramite/buscarInteresado/${buscarCedula}`, function(resultado){

            if(resultado.error){
                alertNotificar("Interesado no encontrado", "default");
                vistacargando(); // ocultamos la ventana de espera
                return;
            }

            $("#div_conteInteresados_modal").append(`
                <div class="info_seleccionada_${resultado.resultado[0].valor} depEnviar_content depEnviar_content_modal">                                                                                                                        
                    <h2 class="title">
                        <i class="fa fa-cube iconoTittle"></i>
                        <button type="button" onclick="borrarInformacionSeleccionada(this,${resultado.resultado[0].valor},'I')" class="btn btn-danger btn-xs depParaInteres_btn_quitar">
                            <i class="fa fa-remove"></i> Borrar
                        </button> 
                        <p>${resultado.resultado[9].valor}
                            <span class="labelInfoUser">/</span>
                            <span class="labelInfoUser"><i class="fa fa-bookmark"></i> ${resultado.resultado[10].valor}</span>
                            <div style="width: 99%; display:none">
                                <span class="etiqueta">E-mail:</span>
                                <input type="text" name="input_interesado_email[]" placeholder="Ingrese el correo electronico del interesado" class="form-control email_int"></input>
                            </div>
                        </p>
                    </h2>
                    <input type="hidden" name="input_interesado[]" value="${resultado.resultado[11].valor}">
                </div>  
            `);

            // mostramos el contenedor de la lista de interesados seleccionados
            $("#areaGeneralInteresadosAgregados_modal").removeClass("hidden");
            $("#content_Interesado_modal").removeClass("hidden");

            vistacargando(); // ocultamos la ventana de espera
        }).fail(function(){
            vistacargando(); // ocultamos la ventana de espera
        });
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



    // ================= FUNCIONES BOTONES DE LA MODAL DE AGREGAR PARA COPIA =========================


    function modal_aceptar_agregarParaCopia(){

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



    // ================= /FUNCIONES BOTONES DE LA MODAL DE AGREGAR PARA COPIA =========================



    // ================= FUNCIONES BOTONES DE LA MODAL DE AGREGAR INTERESADOS =========================

    function modal_aceptar_agregarInteresado(){

        // SINCRONIZAR LA LISTA DE LOS INTERESADOS ------------------------------------------- 
            $("#div_conteInteresados").html($("#div_conteInteresados_modal").html());
            // quitamos los bordes y ocultamos el boton de borrar
            $("#div_conteInteresados").find(".depEnviar_content").removeClass("depEnviar_content_modal"); // quitar bordes
            $("#div_conteInteresados").find(".depParaInteres_btn_quitar").addClass("hidden"); // ocultar boton
            
            if($("#areaGeneralInteresadosAgregados_modal").hasClass("hidden")){
                $("#areaGeneralInteresadosAgregados").addClass("hidden"); // mostramos en al ventar principal
            }else{
                $("#areaGeneralInteresadosAgregados").removeClass("hidden"); // mostramos en al ventar principal
            }
            // limpiamos la información seleccionada en la modal
            $("#areaGeneralInteresadosAgregados_modal").addClass("hidden");
            $("#content_Interesado_modal").addClass("hidden");
            $("#div_conteInteresados_modal").html("");
        // /SINCRONIZAR LA LISTA DE LOS INTERESADOS ------------------------------------------- 
    
    }



    function modal_cancelar_agregarInteresado(){

        // INTERESADO: limpiamos la información seleccionada en la modal
        $("#areaGeneralInteresadosAgregados_modal").addClass("hidden");
        $("#content_Interesado_modal").addClass("hidden");
        $("#div_conteInteresados_modal").html("");     

    }


    // ================= /FUNCIONES BOTONES DE LA MODAL DE AGREGAR INTERESADOS =========================

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


// ================= /FUNCIONES PARA LA BUSCAR Y AGREGAR UN DESTINATARIO =======================

    //funcion para atender o enviar un informe de contrato
    $("#frm_atenderContratoTramite").submit(function(e){
        // (IMPORTANTE) quitamos  los documentos adjuntos que se cancelaron
        $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
        guardarDocumentoTermporal();
        e.preventDefault();
        
        //verificamos si hay destinos agregados
        var num_destinos_add = $("#div_conteDepEnviar div").length;
        if(num_destinos_add==0){
            alertNotificar("Falta agregar destinatarios", "default");
            return;
        }

        // if(!$(".frm_tramite").hasClass('firmacargada')){           
        //     abrirFormularioFirma();
        //     return;
        // }
        $(".frm_tramite").removeClass('firmacargada');

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
                var urlFrm = $(formulario).attr('action');
                vistacargando('M','Registrando...'); // mostramos la ventana de espera
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
                            limpiarTodo();         
                            vistacargando("M", "Espere...");                          
                            window.location.href = '/adminContratos/editarDetalleTramite?iddetalle_tramite='+retorno.iddetalle_tramite_encrypt;
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
                var tamArchivo = ((tamArchivo/1024)/1024);
                if(tamArchivo>tamMaxDoc){
                    alertNotificar(`Solo se permite adjuntar documentos con un tamaño máximo de ${tamMaxDoc}MB`, "error");
                    // eliminamos el documento oculto
                    $("#lista_documentos_adjuntos").find(".hidden_documento").remove();
                    return;
                }

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

    // funcion que visualiza un documento seleccionado
    // boton de la modal
    function agregarDocumento(){

        var id_documento_adjunto = $("#modal_id_documento_adjunto").val();
        var nameFile = $("#modal_nameFile").val();

        var codigo_docAdj = $("#modal_codigo_docAdj").val();
        var descripcion_docAdj = $("#modal_descripcion_docAdj").val();
        var idtipo_documento_encrypt = $("#cmb_tipo_documento_docAdj").val();

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
                <input type="hidden" name="input_id_tipo_documento_adjunto[]" value="${idtipo_documento_encrypt}" class="idtipo_documento_adj">
                <input type="hidden" name="input_codigo_documento_adjunto[]" value="${codigo_docAdj}">
                <input type="hidden" name="input_descripcion_documento_adjunto[]" value="${descripcion_docAdj}">
            `);

        // CARGAMOS TODA LA INFORMACIÓN DEL DOCUMENTO
            $("#"+id_documento_adjunto).find('.nameFile').html(`<b>${nameFile}</b>`)
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

// ======================= /FUNCIONES PARA ADJUNTAR DOCUMENTO ===================================



// ================= FUNCIONES PARA FIRAR UN DOCUMENTO ============================================

    //funcion para abrir la modal de firma electrónica
    function abrirFormularioFirma(){        
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
