
// FUNCIONES PARA CARGAR LOS COMBOS DE LA VENTANA DE DEFINICION DE FLUJO


    // funcion para cargar los combos dependiendo el tipo de documento seleccinado
    function cargar_cmb_departamentos(cmb_tipo_tramite){
        var idTipoTram=$(cmb_tipo_tramite).val();

        //mostramos los botones finalizar y add doc y act
        $("#content_finalizar_add_cod_act").show(200);

        // abilitamos el radio para
        $("#enviar_para").iCheck('enable'); // abilitamos el radio para
        $("#enviar_copia").iCheck('enable'); // abilitamos el radio para
        $("#enviar_para").iCheck('check'); // chequeamos solo para que envie copias

        // // deselecionamos el boton unidad requiriente
        // $('#input_requiriente').iCheck("uncheck");
        // $('#input_requiriente').iCheck('enable');
        
        // validamos que por si no se selecciona un tipo de tramite
        if(idTipoTram==""){
            $("#id_flujo_padre").val(null);
            $("#btn_flujo_cancelar").hide(); // ocultamos el boton cancelar
            
            vistacargando(); // quitamos la ventana de espera
            return;
        }

        vistacargando('M','Espere...'); // mostramos la ventana de espera

        $.get(`/flujoDepartamento/filtrarFlujoYDepartamentosPorTipoTramite/${idTipoTram}`,function(resultado){
            
            vistacargando(); // quitamos la ventana de espera

            // verificamos si el departamento actual es de un perido activo
            if(resultado.listaTodosLosDepartamentos.length == 0){            
                $(".infoDepFlujGen").hide();
                $("#btn_flujo_cancelar").click();
                alertNotificar("El departamento actual no pertenece a un periodo activo", "default");
                return;
            }

            //mostramos el departamento inicion del flujo general
            $(".infoDepFlujGen").hide();
            $("#infoDepFlujGen_"+idTipoTram).show();

            // ocultamos la imagne icono de flujo
            $("#imagenInicioLogoFLujo").hide(200);

            if(resultado.nodosFlujo.length==0){ // agregar el primer nodo al flujo
                $("#id_flujo_padre").val(null); // nodo padre nulo
                 
                // mensaje de ingresar el primer nodo del flujo
                $("#contentAgregarNodoFlujo").show(200);
                $("#mensajeAgregarNodo").html(`<span id="mensajeAgregarNodo" class="label label-success" style="font-size: 85%;">Agregar el primer nodo al flujo</span>`);

                // solo abilitar el envio de para (no permitir enviarlo como copia)            
                $("#enviar_para").iCheck('enable'); // desabilitamos el radio para
                $("#enviar_copia").iCheck('disable'); // desabilitamos el radio para
                $("#enviar_para").iCheck('check'); // chequeamos solo para que envie copias

                // // abilitamos la unidad requiriten
                // $('#input_requiriente').iCheck('check');
                // $('#input_requiriente').iCheck('disable');

            }else{ // ya existe al menos un nodo en el flujo
                $("#contentAgregarNodoFlujo").hide(200);
            }
   
        

            //-------------------------------------------------------------------------------------------------
            // CARGAMOS EL COMBO DE DEPARTAMENTOS DESTINO CON TODOS LOS DEPARTAMENTOS ACTIVOS
            //-------------------------------------------------------------------------------------------------

            //cargamos el combo de departamentos destino
            var contenido_doc_destino = '<option class="gf_select_departamento_destino idperiodo_0" value="">Seleccione un departamento</option>';
            resultado.listaTodosLosDepartamentos.forEach(departamento => {
                contenido_doc_destino = contenido_doc_destino+`<option class="gf_select_departamento_destino" value="${departamento.iddepartamento}">${departamento.nombre}</option>`; 
            });

            // cargamos el combo con cada uno de los departamentos destino agregados en la variable contenido-doc_destino
            $("#conten_select_departamento_destino").html(`
                <div class="chosen-select-conten">
                    <select onchange="cargar_actividades_modal(this)" id="gf_select_departamento_destino" name="gf_select_departamento_destino" data-placeholder="Seleccione un departamento"  class="chosen-select form-control" tabindex="5">        
                        ${contenido_doc_destino}
                    </select>
                </div>                
            `);
            
            $('.chosen-select').chosen(); // CARGAMOS LOS ESTILOS DE LOS COMBOS

            //cargamos la lista de tipos de departamentos  en la ventana modal
            // cargar_tipos_documento_modal($("#gf_select_departamento_padre"));

            //mostramos el boton cancelar formulario principal
            $("#btn_flujo_cancelar").hide(); // ocultamos para dar animación
            $("#btn_flujo_cancelar").removeClass("hidden"); // quitamos clase que oculta por css
            $("#btn_flujo_cancelar").show(300); // mostramos con animación

            try{
                //Por ultimo cargamos el gráfico del flujo del tipo de trámite seleccionado holito
                dibujarGraficoFlujo(resultado.nodosFlujo);
                onWindowResize(); // hacemos que se refresque el diagrama                
            }catch(error){
                alertNotificar("Error al cargar el flujo del proceso", "error");
            }

        }).fail(function(){
            alert('No se pude ejecutar la peticion al servidor');
            vistacargando(); // quitamos la ventana de espera
        });

    }



    function cargar_actividades_modal(cmb_dep_destino){
        //obtenemos el id del departamento seleccionado
        var idDepartamentoDestino = $(cmb_dep_destino).val();

        //desabilitamos el boton de actividades
        $("#btn_modal_actividades").prop("disabled",true); // por defecto desabilitamos por si acaso no tenga actividades asignadas
        $("#text_btn_actividades").html(" Sin Actividades"); // texto del boton

        //validamos por si no se selecciona 
        if(idDepartamentoDestino==""){
            // no seleccioando
            vistacargando(); // quitamos la ventana de espera
            return;
        }

        // limpiamos las actividades agregadas
            $("#contenedor_activ").html("");
            $("#area_listaActividades").hide(300);
            $("#btn_modal_actividades").prop("disabled", true); // desactivamos el boton de add actividades

        // obtenemos el listado de actividades que realiza el departameto seleccionado
        vistacargando('M','Espere...'); // mostramos la ventana de espera

        $.get(`/flujoDepartamento/filtrarActividadesPorDepartamento/${idDepartamentoDestino}`,function(listaActividades){

            //ocultamos todas las actividades de la ventana modal
            $('.li_actividad').removeClass("hidden"); // quitamos la clase que oculta al inicio
            $('.li_actividad').hide(); // ocultamos con jquery

            $("#btn_modal_tipo_documentos").prop("disabled", false);// abilitamos el boton de agregar actividades

            // recorremos el listado de actividades para mostrar las que esten en el listado que retorna la consulta
            listaActividades.forEach(actividad => {
                //abilitamos el boton para abrir la modal
                $("#btn_modal_actividades").prop("disabled",false);
                $("#text_btn_actividades").html(" Agregar Actividades");
                //mostramos cada una de las actividades con id igual a cada uno de las que vienen en la consulta
                $(`#li_actividad_${actividad.idactividad}`).show();
            });
            
            vistacargando(); // quitamos la ventana de espera
        }).fail(function(){
            alert('No se pude ejecutar la peticion al servidor');
            vistacargando(); // quitamos la ventana de espera
        });

    }




    // boton que agregara los documentos seleccionados a la lista de de documentos requeridos
    $("#btn_agregar_tipo_documentos").click(function(){

        // recorremos todos los input que tengan la clase 'td_seleccionado' ya que son los checked de la modal
        $(".td_seleccionado").each(function(index, input){

            //preguntamos solo por los que estan seleccionados con el checked
            if( $(input).prop('checked')){
                //obtenemos el texto del tipo documento seleccionado
                var tipoDoc_text=$(input).parents(".label_doc_act_select").text();
                //obtenemos el id del tipo de documento seleccionado
                var idtipoDoc = $(input).val();

                //mostramos el contendor area de documentos requeridos
                $(".modal_addTipoDocumento").modal("hide"); //ocultamos la modal para ver la animación
                // $("#area_listaDocumentos").hide(); //ocultamos para dar animación de entrada
                // $("#area_listaDocumentos").removeClass("hidden"); //quidamos clase que oculta el div
                $("#area_listaDocumentos").show(250); //damos animación de entrada

                //agregamos el tipo de documento seleccionado al listado de documentos requeridos
                $("#contenedor_doc").append(`
                    <div class="alert f_documento fade in" style="margin-bottom: 5px;">
                        <button type="button" class="close" onclick="quitar_tipo_documento(this)"><span aria-hidden="true">×</span>
                        </button>
                        <strong><i class="fa fa-book"></i></strong> ${tipoDoc_text}
                        <input type="hidden" name="input_tipo_documento[]" value="${idtipoDoc}">
                    </div>
                `);

                //deseleccionamos el tipo de documento y quitamos el efecto de checkeado
                $(input).prop("checked", false);
                $(input).parent(".checked").removeClass("checked");
                //ocultamos el tipo de documento de la lista en la modal
                $(input).parents("li").hide();

            }
        });

        //ocultamos la modal
        $(".modal_addTipoDocumento").modal("hide");

    });




    //funcion para quitar un tipo de documento al dar a la X de cerrar
    function quitar_tipo_documento(boton){
        
        $(boton).parent().hide(200); // ocultamos el tipo de documento
        setTimeout(function(){ // esperamos unos segundos para dar animacion

            $(boton).parent().remove();
            // comprobamos si hay o no tipo de documentos agregados
            // preguntamos si no hay tipos de documentos "div"
            if($("#contenedor_doc").find('div').length==0){
                //ocultamos el contenedor de tipo de documentos
                $('#area_listaDocumentos').hide(200);
            }

            //mostramos en la modal el tipo de documento quitado
            var idTDeliminado=$(boton).siblings('input').val(); // id del tipo de documento quitado

            // mostramos en la modal el tipo de documento quitado
            $(`#li_tipo_doc_${idTDeliminado}`).show();

        }, 250);
        
    }



    // funcion que se ejecuta cuando se agrega las actividades seleccionadas
    $("#btn_agregar_actividades").click(function(){
        // recorremos todos los input que tengan la clase 'a_seleccionado' ya que son los checked de la modal
        $(".a_seleccionado").each(function(index, input){

            //preguntamos solo por los que estan seleccionados con el checked
            if( $(input).prop('checked')){
                //obtenemos el texto del tipo documento seleccionado
                var actiivdad_text=$(input).parents(".label_doc_act_select").text();
                //obtenemos el id de la actiivdad seleccionada
                var idactividad = $(input).val();

                //mostramos el contendor area de documentos requeridos
                $(".modal_addActividades").modal("hide"); //ocultamos la modal para ver la animación
                // $("#area_listaActividades").hide(); //ocultamos para dar animación de entrada
                // $("#area_listaActividades").removeClass("hidden"); //quidamos clase que oculta el div
                $("#area_listaActividades").show(250); //damos animación de entrada

                //agregamos la actividad seleccionada al listado de actividades a realizar
                $("#contenedor_activ").append(`
                    <div class="alert f_actividad fade in" style="margin-bottom: 5px;">
                        <button type="button" class="close" onclick="quitar_actividad(this)"><span aria-hidden="true">×</span>
                        </button>
                        <strong><i class="fa fa-tasks"></i></strong> ${actiivdad_text}
                        <input type="hidden" name="input_actividad[]" value="${idactividad}">
                    </div>
                `);

                //deseleccionamos la actividad y quitamos el efecto de checkeado
                $(input).prop("checked", false);
                $(input).parent(".checked").removeClass("checked");
                //ocultamos la actividad de la lista en la modal
                $(input).parents("li").hide();

            }
        });
    });




    $('#btn_eliminarFlujo').click(function(){
        if(confirm("Esta seguro que quiere eliminar el nodo del flujo")){
            $("#frm_flujo_eliminar").submit();
        }
    });



    // funcion para quitar las actividades agregadas
    function quitar_actividad(boton){
        $(boton).parent().hide(200); // ocultamos la actividad con una animacion
        setTimeout(function(){ // esperamos unos segundos para dar animacion

            $(boton).parent().remove();
            // comprobamos si hay o no actividades agregadas
            // preguntamos si no hay actividades "div"
            if($("#contenedor_activ").find('div').length==0){
                //ocultamos el contenedor de las actividades
                $('#area_listaActividades').hide(200);
            }

            //mostramos en la modal la actividad quitada
            var idAeliminado=$(boton).siblings('input').val(); // id de la actividad quitada

            // mostramos en la modal la actividad quitada
            $(`#li_actividad_${idAeliminado}`).show();

        }, 250);
    }




    // funcion para evaluar lo ingresado al input de tipo number
    $("#gf_hora_maxima").keypress(function(e){
        var letra_precionada=e.key; // obtenemos la letra precionada antes de que se agregue al input
       
        regex = /^[0-9]/;  // solo permitir numeros del o al 9
    
        if (!regex.test(letra_precionada)){
            // si no es un numero evitamos no se muestra la letra en el input
            e.preventDefault();
        }
    });




    //FUNCION QUE SE EJECUTA CUANDOS SE DA CLICK EN EL BOTON GESTIONAR DE UN NODO FLUJO
    function clickInfo(btn){

        // variables
        var idNodoFlujo=$(btn).attr("id");
        var flujoInfo=$(btn).attr("data-id");
        var flujoInfo = $.parseJSON(flujoInfo); // convertimos a el texto a json
        
        // mostramos la amimación de cargando en la modal
        $("#body_modal_gestion_nodo").hide();
        mensajeCarga("#mensajeCargandoActDoc", "Cargando...");

        // cargamos el nombre del departamento del nodo en el titulo de la ventana modal
        $("#modal_nombre_departamento").html(flujoInfo.nombreDepartamento);

        // agregamos el id del flujo para agregarle un nuevo nodo
        $("#btn_agregarNodo").val(idNodoFlujo);
        $("#btn_agregarNodo").attr("data-id", $(btn).attr("data-id"));
        // verificar si permitiremos crear nuevo nodo
        if(flujoInfo.tipo_envio=="P" && flujoInfo.estado_finalizar==0){ // esto es un para (permitimos crar nodo) y no es un nodo finalizado
            $("#btn_agregarNodo").show();
        }else{
            $("#btn_agregarNodo").hide();
        }                        

        // utilizamos la ruta para obtener los tipos de docuemtnos y las actividades agregadas al nodo del flujo
        $.get(`/flujoDepartamento/mostrarTipoDocActivDeNodoFlujo/${idNodoFlujo}`,function(resultado){

            $("#body_modal_gestion_nodo").show(200);
            $("#mensajeCargandoActDoc").hide(200);

            $("#contenedor_doc_mostrar").html("");
            resultado.listaTipoDocumentos.forEach(tipoDocuemto => {
                // agregamos cada tipo de documento
                $("#contenedor_doc_mostrar").append(`
                    <li> <strong><i class="fa fa-book"></i></strong> ${tipoDocuemto.descripcion} </li>
                `);
                // ocultamos el mensaje que no hay tipos de documentos
                $("#mostrar_listaTipoDocumentos_mensaje").addClass("hidden");
            });

            // preguntamos si no retorna ningun tipo de documento
            if(resultado.listaTipoDocumentos.length == 0){
                // si no retorna nada mostramos el mensaje
                $("#mostrar_listaTipoDocumentos_mensaje").removeClass("hidden");
            }

            $("#contenedor_act_mostrar").html("");
            resultado.listaActividades.forEach(actividad => {
                // agregamos cada activida 
                $("#contenedor_act_mostrar").append(`
                    <li><strong><i class="fa fa-tasks"></i></strong> ${actividad.descripcion} </li>
                `);

                // ocultamos el mensaje que no hay actividades
                $("#mostrar_listaActividades_mensaje").addClass("hidden");
                
            });
            // preguntamos si no retorna ninguna actividad
            if(resultado.listaActividades.length == 0){
                // si no retorna nada mostramos el mensaje
                $("#mostrar_listaActividades_mensaje").removeClass("hidden");
            }
            
           
        }).fail(function(){
            //La petición tardó mas de lo esperado
            $("#modal_mostarInfoNodoFLujo").modal("hide");
        });

        // cargamos la ruta al formulario de eliminar el nodo seleccionado
        $('#frm_flujo_eliminar').prop('action',window.location.protocol+'//'+window.location.host+'/flujoDepartamento/gestion/'+idNodoFlujo);


        // mostramos la ventana modal con la información
        $(".modal_mostarInfoNodoFLujo").modal();

    }




    // funcion que se ejecuta al dar al boton de cancelar en el formulario principal
    $("#btn_flujo_cancelar").click(function(){
        // deleccionamos todos los combos
            // -- combo de tipo de tramite --
            $(".gf_select_tipo_tramite").prop("selected", false);
            $("#gf_select_tipo_tramite").trigger("chosen:updated");

            // -- borrar id del flujo padre  y ocultamos el form de agregar nodo -- 
            $("#id_flujo_padre").val(null);
            $("#contentAgregarNodoFlujo").hide(200);
            $("#conten_select_tipo_tramite").removeClass("disabled_content");

            

            // -- combo de departamento destino --
            $("#conten_select_departamento_destino").html(`
                <div class="chosen-select-conten">
                    <select onchange="cargar_actividades_modal(this)" id="gf_select_departamento_destino" name="gf_select_departamento_destino" data-placeholder="Seleccione un departamento destino"  class="chosen-select form-control" tabindex="5">        
                        <option class="gf_select_departamento_destino idperiodo_0" value="">Seleccione un departamento destomo</option>
                    </select>
                </div>               
            `);
            $('.chosen-select').chosen(); // cargamos los estilos de los combos

        // desabilitamos los botones cancelar, tipo documento y actividades
            // los botones tipo documento y actividades se desactivan solos al cargar denuevo los combos
            $(this).hide(300); // boton cancelar

        // limpiamos los tipo de documentos agregados
            $("#contenedor_doc").html(""); // limpiamos los documentos agregadas
            $("#area_listaDocumentos").hide(300); // ocultamos el div area que contiene todo
            $("#btn_modal_tipo_documentos").prop("disabled", true); // desactivamos el boton de add documento

        // limpiamos las actividades agregadas
            $("#contenedor_activ").html("");
            $("#area_listaActividades").hide(300);
            $("#btn_modal_actividades").prop("disabled", true); // desactivamos el boton de add actividades

        // mostramos todos los tipo de docuentos en la modal
            $(".li_tipo_documento").show();

        // deseleccionamos el check finalizar flujo
            $("#input_flujo_finalizar").iCheck('uncheck');

        // limpiamos el grafico del flujo
            $("#contenedor_grafico_flujo").hide();

        // limpiamos el formulario de eliminar nodo
            $('#frm_flujo_eliminar').prop('action',"");

        // mostramos los botones funalizar y agregar doc y act
            $("#content_finalizar_add_cod_act").show(200);

        // abilitamos el radio para
            $("#enviar_para").iCheck('enable'); // abilitamos el radio para
            $("#enviar_copia").iCheck('enable'); // abilitamos el radio para
            $("#enviar_para").iCheck('check'); // chequeamos solo para que envie copias

        // mostramos la imagen icono de flujo
            $("#imagenInicioLogoFLujo").show();

        // oculatar la info del departamento inicio del flujo general
            $(".infoDepFlujGen").hide();

        // deseleciconamos el boton unidad requiriente
            // $('#input_requiriente').iCheck("uncheck");
            // $('#input_requiriente').iCheck('enable');
    });




    // FUNCION PARA AGREGAR UN NUEVO NODO 
    $("#btn_agregarNodo").click(function(){

        idNodoFlujo = $(this).val();
        var flujoInfo=$(this).attr("data-id");
        var flujoInfo = $.parseJSON(flujoInfo); // convertimos a el texto a json

        // LIMPIAMOS LOS DATOS ANTES SELECCIONADOS 

            // limpiamos los tipo de documentos agregados
                $("#contenedor_doc").html(""); 
                $("#area_listaDocumentos").hide(300); 
                $("#btn_modal_tipo_documentos").prop("disabled", true); 

            // limpiamos las actividades agregadas
                $("#contenedor_activ").html("");
                $("#area_listaActividades").hide(300);
                $("#btn_modal_actividades").prop("disabled", true);

            // mostramos todos los tipo de docuentos en la modal
                $(".li_tipo_documento").show();
            
            // deseleccionamos el check finalizar flujo
                $("#input_flujo_finalizar").iCheck('uncheck');


        //POR DEFECTO 
            //mostramos los botones finalizar y add doc y act
            $("#content_finalizar_add_cod_act").show(200);

            // habilitamos el radio para
            $("#enviar_para").iCheck('enable'); // habilitamos el radio para
            $("#enviar_copia").iCheck('enable'); // habilitamos el radio para
            $("#enviar_para").iCheck('check'); // chequeamos solo para que envie copias

            $("#mensajeAgregarNodo").html(`<span id="mensajeAgregarNodo" class="label label-primary" style="font-size: 85%;">Agregar un nuevo nodo al flujo</span>`);

        //RESTRICCION DE DEPARTAMENTO EN EL COMBO DE DEPARTAMENTO DESTINO
            $.get("/flujoDepartamento/filtratFlujosHijos/"+idNodoFlujo, function(resultado){

                // pero primero quitamos los deseleccionados de antiguas iteraciones
                $(`#gf_select_departamento_destino option`).show();
                $(`#gf_select_departamento_destino option`).prop("selected", false);
                // quitamos del combo el departamento del nodo seleccionado
                $(`#gf_select_departamento_destino option[value='${flujoInfo.iddepartamento}']`).hide(); // obtenemos el option del departamento seleccionado

                // quitamos los departamento hijo agregados
                // var paraExistente = false;
                resultado.listaFlujoHijos.forEach(flujoHijo => {
                    // si se encuentra un para ya existente no se permite agregar otro PARA
                    // if(flujoHijo.tipo_envio=="P"){
                    //     paraExistente=true;
                    // }
                    $(`#gf_select_departamento_destino option[value='${flujoHijo.iddepartamento}']`).hide(); // obtenemos el option del departamento seleccionado
                });

                $("#gf_select_departamento_destino").trigger("chosen:updated"); // actualizamos el combo

                // if(paraExistente == true){
                //     $("#content_finalizar_add_cod_act").hide(200);           
                //     $("#enviar_para").iCheck('disable'); // desabilitamos el radio para
                //     $("#enviar_copia").iCheck('check'); // chequeamos solo para que envie copias
                // }                

            });

            //MOSTRAR INTERFAZ PARA AGREGAR NUEVO NODO
            $("#id_flujo_padre").val(idNodoFlujo);
            $("#contentAgregarNodoFlujo").show(200);
            $("#conten_select_tipo_tramite").addClass("disabled_content");
            $('html,body').animate({scrollTop:$('.main_container').offset().top},400);    

    });
    

    // FUNCIONES AL DAR CLICK EN COPIA O PARA
    $("#enviar_para").on('ifChanged', function(e){
        var isChecked = e.currentTarget.checked;
        if(isChecked == true){ // se selecciona
            $("#content_finalizar_add_cod_act").show();
        }else{ // se deselecciona
            $("#content_finalizar_add_cod_act").hide();
        }
    });


    // FUNCIONA  PARA DAR ESTILOS AL FORMULARIO
    $(document).ready(function () {
        $("#f_contenedor_general").css({"min-height": ($(window).height()/1.3)+"px"});
    });