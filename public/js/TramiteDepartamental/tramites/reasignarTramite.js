
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


    $("#input_buscar").keyup(function(e){
        if(e.keyCode==13){ //solo si se da enter
            buscarParaOCopia();
        };       
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
        //comprobamos si estamos atendiendo un trámite
        var iddetalle_tramite_atender = $("#input_iddetalle_tramite_atender");

        if($(iddetalle_tramite_atender).length>0){
            iddetalle_tramite_atender = "/"+$(iddetalle_tramite_atender).val();
        }else{
            iddetalle_tramite_atender = "";
            var iddetalle_tramite_atender = $("#input_iddetalle_tramite_redirec");
            if($(iddetalle_tramite_atender).length>0){
                iddetalle_tramite_atender = "/"+$(iddetalle_tramite_atender).val();
            }else{
                iddetalle_tramite_atender = "";
            }
        }
        //validamos que la busqueda no este vacia
        if(busqueda==""){return;}

        addSpinner("Buscando...", "#label_buscar"); // ponemos el mensaje de cargando

        $.get('/tramite/buscarParaCopia/'+busqueda+iddetalle_tramite_atender,function (resultado){

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
                            <th>Cédula</th>
                            <th>Funcionario Público</th>   
                            <th>Cargo</th>                       
                            <th style="width: 145px;">Agregar Como</th>
                        `);

                        $("#tbody_resultado_busqueda").html(""); // limpiamos la tabla de resultados de busqueda
                    
                        $.each(resultado.resultado, function (index, departamento){  // rellenamos la tabla con los datos de los departamentos resultado

                            var disabled = "";
                            if(verificarInformacionAgregada(departamento.iddepartamento)){
                                disabled = "disabled";
                            }

                            us001_jefe = null;
                            us001_tipofp = null;

                            if(departamento.admin_contrato==1){
                                us001_jefe = departamento.us001_admincontrato;
                                us001_tipofp ={descripcion: "Administrador de contratos"};
                                if(departamento.us001_admincontrato.us001_tpofp_admin_contrato.length>0){
                                    tipofp.cargo=departamento.us001_admincontrato.us001_tpofp_admin_contrato[0]['cargo'];
                                }else{
                                    tipofp.cargo=null;
                                }
                            }else{
                                $.each(departamento.us001_tipofp, function (i, usfp){ 
                                    if(usfp.jefe_departamento==1){
                                        us001_jefe = usfp.us001;
                                        us001_tipofp = usfp.tipofp;
                                        tipofp=usfp;
                                    }
                                });                                
                            }


                            if(us001_jefe!=null){
                                nombre_jefe = us001_jefe.name;
                                if(tipofp.cargo!=null){
                                    cargo_jefe=tipofp.cargo;
                                }else{
                                    cargo_jefe='';
                                }
                                if(us001_jefe.nombre_documental!=null && us001_jefe.nombre_documental!=""){
                                    nombre_jefe = us001_jefe.nombre_documental;
                                }
                                tb_tbody=tb_tbody+(`  
                                    <tr>
                                        <td scope="row">${(index+1)}</td>
                                        <td>${departamento.nombre}</td>
                                        <td>${us001_jefe.cedula}</td>
                                        <td>${nombre_jefe}</td>      
                                        <td>${cargo_jefe}</td>                         
                                        <td id="td_btn_${departamento.iddepartamento}">
                                            <center>
                                                <button ${disabled} onclick="agregarDepartamentoComo('${departamento.iddepartamento_encrypt}','${departamento.iddepartamento}', '${iddetalle_tramite_atender}')" class="btn btn-info btn-xs" type="button" style="width:45%; margin: 3px 0px 3px 0px;"><i class="fa fa-envelope-o"></i> Para</button>
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
    function agregarmidepartamento(){
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`/tramite/destino_mi_departamento`, function(resultado){
            // variable addComo -> C= copia , P= para
            var div_mostrar = ""; // para almancenar el id del contenedor de toda la lista de dep agregados en la modal
            var div_agregar = ""; // para almancenar el id de la lista de dep agregados en la modal
            var name_input = "";  // para almanenar el name de del input que almacena el id del departamento
            div_mostrar = "#areaGeneralDepartamentoAgregados_modal";
            div_agregar = "#div_conteDepEnviar_modal";
            name_input = "input_depaEnviarPara[]";
            // $(div_agregar).html('');
            usuario = resultado['detalle']['jefe_departamento'][0]['us001'];
            nombre_jefe = usuario.name;
                // if(verificarInformacionAgregada(item['departamento']['iddepartamento'])){
                //     disabled = "disabled";
                // }
                $('.info_seleccionada_'+resultado['detalle']['iddepartamento']).remove();
                $(div_agregar).append(`
                    <div class="info_seleccionada_${resultado['detalle']['iddepartamento']} depEnviar_content depEnviar_content_modal">                                                                                                                        
                        <h2 class="title">
                            <i class="fa fa-cube iconoTittle"></i>
                           
                            <p>${nombre_jefe}
                                <span class="labelInfoUser">/</span>
                                <span class="labelInfoUser"><i class="fa fa-bookmark"></i> ${resultado['detalle'].nombre}</span>
                            </p>                                            
                        </h2>       
                        <input type="hidden" name="${name_input}" value="${resultado['detalle'].iddepartamento_encrypt}">
                    </div>  
                `);
                $('#control_midep').val(resultado['detalle']['iddepartamento']);
                $(div_mostrar).removeClass("hidden"); // mostramos el contenedor PARA COPIA seleccionado
                // // cambiamos el incono de uso
                // $("#td_btn_"+ item['departamento']['iddepartamento']).siblings(".td_uso").find("i").removeClass("fa-square-o"); // quitamos el icono no check
                // $("#td_btn_"+ item['departamento']['iddepartamento']).siblings(".td_uso").find("i").addClass("fa-check-square-o"); // agregamos el icono check
           vistacargando();

        }).fail(function(){
            vistacargando(); // ocultamos la ventana de espera
        });
    }
    // funcion para agregar departamentos a la tabla de informacio seleccionada
    function agregarDepartamentoComo(iddepartamento_encrypt,iddep, iddetalle_tramite_atender){

        // desabilitamos los botones de agregar Para y Copia
        $("#td_btn_"+iddep).find("button").prop("disabled",true); // desabilitamos los dos botones

        var div_mostrar = "#areaGeneralDepartamentoAgregados_modal"; // para almancenar el id del contenedor de toda la lista de dep agregados en la modal
        var div_agregar = "#div_conteDepEnviar_modal"; // para almancenar el id de la lista de dep agregados en la modal
        var name_input = "input_depaEnviarPara[]"; // para almanenar el name de del input que almacena el id del departamento

        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`/tramite/buscarDepartamento/${iddepartamento_encrypt+iddetalle_tramite_atender}`, function(resultado){

            if(resultado.resultado.admin_contrato==1){
                usuario = resultado.resultado.us001_admincontrato;
            }else{
                usuario = resultado.resultado.us001_tipofp[0].us001;
            }

            $(div_agregar).append(`
                <div class="info_seleccionada_${iddep} depEnviar_content depEnviar_content_modal">                                                                                                                        
                    <h2 class="title">
                        <i class="fa fa-cube iconoTittle"></i>
                        <button type="button" onclick="borrarInformacionSeleccionada(this,${iddep})" class="btn btn-danger btn-xs depParaInteres_btn_quitar">
                            <i class="fa fa-remove"></i> Borrar
                        </button> 
                        <p>${usuario.name}
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

    // función para quitar un departamento o interesado de la lista de información seleccionada
    function borrarInformacionSeleccionada(btn_borrar,idinformacion){
     
        var borrar = $(btn_borrar).parents(".depEnviar_content"); // obtenemos el departamento o interesado a quitar de la lista
        $(borrar).hide(200);// primero lo ocultamos con jquery
        $(borrar).removeClass("depEnviar_content")// le quitamos la clase para decir que se va a borrar
        setTimeout(() => { // esperamos uno segundos a que se borre
            $(borrar).remove(); // ya oculto lo borramos del todo
            // validamos si hay mas en su lista
            existen = $("#div_conteDepEnviar_modal").find(".depEnviar_content").length;
            if(existen<=0){$("#areaGeneralDepartamentoAgregados_modal").addClass("hidden");}
            // habilitamos el boton del interesado o departamento borrado
            $("#td_btn_"+idinformacion).find("button").prop("disabled",false);

        }, 259);
        
    }

    // metodo para redireccionar el proceso
    $("#frm_redireccionarDetalleTramite").submit(function(e){

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
                            window.location.href = "/gestionBandeja/entrada";
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

    // funcion que visualiza un documento seleccionado
    // boton de la modal
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

    function agregardepartamentolista(id){
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`/tramite/lista_destinos/${id}`, function(resultado){
            // variable addComo -> C= copia , P= para
            var div_mostrar = ""; // para almancenar el id del contenedor de toda la lista de dep agregados en la modal
            var div_agregar = ""; // para almancenar el id de la lista de dep agregados en la modal
            var name_input = "";  // para almanenar el name de del input que almacena el id del departamento
            div_mostrar = "#areaGeneralDepartamentoAgregados_modal";
                div_agregar = "#div_conteDepEnviar_modal";
                name_input = "input_depaEnviarPara[]";
                $(div_agregar).html('');
           $.each(resultado['detalle'],function(i,item){
                usuario = item['departamento']['jefe_departamento'][0]['us001'];
                nombre_jefe = usuario.name;
                $(div_agregar).append(`
                    <div class="info_seleccionada_${item['departamento']['iddepartamento']} depEnviar_content depEnviar_content_modal">                                                                                                                        
                        <h2 class="title">
                            <i class="fa fa-cube iconoTittle"></i>
                            <button type="button" onclick="borrarInformacionSeleccionada(this,${item['departamento']['iddepartamento']},'P')" class="btn btn-danger btn-xs depParaInteres_btn_quitar">
                                <i class="fa fa-remove"></i> Borrar
                            </button> 
                            <p>${nombre_jefe}
                                <span class="labelInfoUser">/</span>
                                <span class="labelInfoUser"><i class="fa fa-bookmark"></i> ${item['departamento'].nombre}</span>
                            </p>                                            
                        </h2>       
                        <input type="hidden" name="${name_input}" value="${item['departamento'].iddepartamento_encrypt}">
                    </div>  
                `);

                $(div_mostrar).removeClass("hidden"); // mostramos el contenedor PARA COPIA seleccionado

                // // cambiamos el incono de uso
                // $("#td_btn_"+ item['departamento']['iddepartamento']).siblings(".td_uso").find("i").removeClass("fa-square-o"); // quitamos el icono no check
                // $("#td_btn_"+ item['departamento']['iddepartamento']).siblings(".td_uso").find("i").addClass("fa-check-square-o"); // agregamos el icono check
           });
           vistacargando();

        }).fail(function(){
            vistacargando(); // ocultamos la ventana de espera
        });
    }

// ======================= /FUNCIONES PARA ADJUNTAR DOCUMENTO ===================================