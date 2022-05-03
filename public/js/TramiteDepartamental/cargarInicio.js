

    function vistacargando(estado){
        mostarOcultarVentanaCarga(estado,'');
    }

    function vistacargando(estado, mensaje){
        mostarOcultarVentanaCarga(estado, mensaje);
    }

    function mostarOcultarVentanaCarga(estado, mensaje){
        //estado --> M:mostrar, otra letra: Ocultamos la ventana
        // mensaje --> el texto que se carga al mostrar la ventana de carga
        if(estado=='M' || estado=='m'){
            $('#modal_cargando_title').html(mensaje);
            $('#modal_cargando').show();
            $('body').css('overflow', 'hidden');
        }else{
            $('#modal_cargando_title').html('Cargando');
            $('#modal_cargando').hide();
            $('body').css('overflow', '');
        }
    }

    function mostrarAlerta(idequeta, mensaje, color){ // alerta que desaparece
        $(`#${idequeta}`).show(300);
        var contenido=`
            <div class="alert alert-${color} alert-dismissible fade in" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                </button>
                <strong><i class="fa fa-info-circle"></i> Información!  </strong> ${mensaje}
            </div>
        `;

        $(`#${idequeta}`).hide(); // ocultamos el contenedor de alerta
        $(`#${idequeta}`).html(contenido); // agregamos el html de la alerta
        $(`#${idequeta}`).show(300); // mostramos la alerta con una animación
    
        setTimeout(() => { // esperamos 4 segundos para ocultar la alerta
            $(`#${idequeta}`).hide(800); // ocultamos el mensaje de alerta
        }, 6000);
    }
    //============================================================================================


    function mostrarAlertaFija(idequeta, mensaje, color){ // alerta que no desaparece
        // $(`#${idequeta}`).show(300);
        var contenido=`
            <div class="alert alert-${color} alert-dismissible fade in" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                </button>
                <strong><i class="fa fa-info-circle"></i> Información!  </strong> ${mensaje}
            </div>
        `;

        $(`#${idequeta}`).hide(); // ocultamos el contenedor de alerta
        $(`#${idequeta}`).html(contenido); // agregamos el html de la alerta
        $(`#${idequeta}`).show(300); // mostramos la alerta con una animación
    
    }
    //============================================================================================


    // limpiamos la consola del navegador
    // porque las librerias imprimen informacion por consola
    $(document).ready(function () {
        setTimeout(function(){
        //    console.clear();
        }, 1000);
    });


    // FUNCION PARA MOSTRAR UNA ALERTA DE PNotify PERSONALIZADA
    function alertNotificar(texto, tipo){
        PNotify.removeAll();
        new PNotify({
            title: 'Mensaje de Información',
            text: texto,
            type: tipo,
            hide: true,
            delay: 4000,
            styling: 'bootstrap3',
            addclass: ''
        });
    }

    // CLASE PARA PONER EL ICONO DE CAMPO OBLIGATORIO
    $(document).ready(function(){
        var iconoObligatorio="*";
        // var iconoObligatorio = `<i class="fa fa-asterisk" style="font-size: 10px; font-weight: 50 !important;"></i>`;        
        $('.campo_obligatorio').each(function (i, item){
            var textoActual = $(item).html(); // obtenemos el texto que se le da por defecto al label
            $(item).html(`(${iconoObligatorio}) ${textoActual}`); // el icono de obligatorio con el texto del label
        });

    });

    // CLASE PARA AGREGAR AL HTML DE UN ELEMENTO EL SPINNER DE CARGANDO CON UN MENSAJE
    function addSpinner(texto, elemento){ // recive el id del elemento o clase por lo que hay que especificar el # o el .
        $(elemento).html(`<span class="spinner-border" role="status" aria-hidden="true"></span> ${texto}`);
    }
    // CLASE PARA QUITAR EL SPINNER Y AGREGAR TEXTO POR DEFECTO
    function removeSpinner(text, elemento){
        $(elemento).html(text);
    }



    // la funcion recive el id del div donde se quier cargar el mensaje
    function mensajeCarga(contenedor,mensaje){
        $(contenedor).hide();
        $(contenedor).html(`
        <div class="panel panel-success">
            <div class="panel-heading">                    
                <div class="row">
                    <blockquote class="blockquote text-center">
                        <div class="d-flex justify-content-center">
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">  <span class="sr-only">Loading...</span>  </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">  <span class="sr-only">Loading...</span>  </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">  <span class="sr-only">Loading...</span>  </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">  <span class="sr-only">Loading...</span>  </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">  <span class="sr-only">Loading...</span>  </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">  <span class="sr-only">Loading...</span>  </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">  <span class="sr-only">Loading...</span>  </div>
                        </div>
                        <p class="text-center">
                            <strong>
                            ${mensaje}
                            </strong>
                        </p>                
                    </blockquote>			                           
                </div>                    
            </div>
        </div>
        `);
        $(contenedor).show(200);
    }


    // funcion para agregar el tiempo maximo de espera para una peticion ajax
    $(document).ready(function () {
        var segundos = 10; // segundos de limite
        $.ajaxSetup({            
            timeout:(segundos*5000), // timpo limite de respuesta 
            error: function( jqXHR, textStatus, errorThrown ) {
             
                var mensaje="";
                if(jqXHR.status === 0){
                    mensaje=('Tiempo límite de respuesta superado. Por favor verifique su red.');
                }else if(jqXHR.status == 404){
                    mensaje=('Requested page not found [404]');
                }else if(jqXHR.status == 500){      
                    mensaje=('Internal Server Error [500].');      
                }else if(textStatus === 'parsererror'){      
                  alert('Requested JSON parse failed.');      
                }else if(textStatus === 'timeout'){      
                  mensaje="Error time out";      
                }else if(textStatus === 'abort'){      
                    mensaje=('Ajax request aborted.');      
                }else{      
                    mensaje=('Uncaught Error: ' + jqXHR.responseText);      
                }
                // alertNotificar(mensaje, "error");
            }            
        });
    });


    // VARIABLES DE PARAMETROS GENERALES
    var tamMaxDoc = 0; // tamaño maximo de megas para documentos adjuntos
    var arrFormatos = []; // formatos de documento permitidos
    var timeRefresh = 10; // segundos para rerefescar bandeja entrada

    $(document).ready(function () {
        var parGener = $("#inputJsonParaetrosGenerales").data('field-id');
        parGener.forEach(parametro => {
            if(parametro.codigo == "DOCMAX"){
                tamMaxDoc=parametro.valor;
                $(".mostrar_tamMaxDoc").html(tamMaxDoc);
            }
            if(parametro.codigo == "FORMDOC"){
                arrFormatos[`${parametro.valor}`]=true;
            }
            if(parametro.codigo == "TIMEREF"){
                timeRefresh=parametro.valor;
            }
        });
        $("#inputJsonParaetrosGenerales").remove();
    });


    // FUNCIÓN PARA VALIDAR QUE NO SE INGRESEN CARACTERES ESPECIALES
    var timeAct;

    $(".sinespecial").keypress(function(e){
        var key = e.key;
        regex = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s\-.]+$/;

        if (regex.test(key)){
            console.log("correcta");
        }else{
            
            e.preventDefault();
            var textoInfo = `<span style="color: #ee0707; font-size: 12px; font-style: italic; font-weight: 700; ">No se permite ingresar caracteres especiales</span>`;
            $(this).siblings(".sinespecialMsj").html(textoInfo);
            
            clearTimeout(timeAct);

            timeAct=setTimeout(() => {
                $(".sinespecialMsj").html("");
            }, 5000);
        }
    });


    // FUNCION PARA RETORNAR EL LENGUAJE DE LA TABLA DATETABLE
    function datatableLenguaje(data){

        var search = "Buscar Trámite";
        if(data.search){
            search = data.search;
        }

        var data = {
            "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                        '<option value="5">5</option>'+
                        '<option value="10">10</option>'+
                        '<option value="15">15</option>'+
                        '<option value="20">20</option>'+
                        '<option value="30">30</option>'+
                        '<option value="-1">Todos</option>'+
                        '</select> registros',
            "search": `<b><i class='fa fa-search'></i> ${search}: </b>`,
            "searchPlaceholder": data.placeholder,
            "zeroRecords": "No se encontraron registros coincidentes",
            "infoEmpty": "No hay registros para mostrar",
            "infoFiltered": " - filtrado de MAX registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            }
        };
        return data;
    }



    // ------------- FUNCIONES PARA CARGAR LA CAJA DE NOTIFICACIONES --------------

    function cargarNotificacionesTramite(){
        
        var spinner = `<span class="spinner-grow" style="font-size:8px; margin-right:3px;" role="status" aria-hidden="true"></span>`;

        $("#notifi_tramite_entrante").html(spinner+spinner+spinner);  
        $("#notifi_tramite_borrador").html(spinner+spinner+spinner); 
        $("#notifi_tramite_aprobar").html(spinner+spinner+spinner);  
        $("#notifi_tramite_revision").html(spinner+spinner+spinner);
        $("#notifi_informados").html(spinner+spinner+spinner);
        $("#notifi_cambio_documento").html(spinner+spinner+spinner);
        
        $.get("/gestionBandeja/cargarNotificacionBandejas", function(retorno){
            $("#notifi_tramite_entrante").html(0);  
            $("#notifi_tramite_borrador").html(0); 
            $("#notifi_tramite_aprobar").html(0);  
            $("#notifi_tramite_revision").html(0);
            $("#notifi_informados").html(0);
            $("#notifi_cambio_documento").html(0);
            if(retorno.error==false && retorno.resultado.contrato==true){

                if($("#widgets_content").length == 0){ return; } //no estamos en el inicio                
                $("#notifi_tramite_entrante").html(retorno.resultado.totalTramEntrada);  
                $("#notifi_tramite_borrador").html(retorno.resultado.totalTramElaboracion); 
                $("#notifi_tramite_aprobar").html(retorno.resultado.listaTramiteContrato);  
                $("#notifi_tramite_revision").html(retorno.resultado.totalTramRevision);
                $("#notifi_informados").html(retorno.resultado.totalTramInformados);
                // $("#notifi_cambio_documento").html(retorno.resultado.totalTramElaboracion);
                return;
            }


            if(!retorno.error){

                $("#notificacion_tramites").html(""); // limpiamos el cuadro de notificaciones
                var numNotificaciones = 0; // para almacenar el numero de notificaciones

                $.each(retorno.resultado.listaDestinos, function(des, destino){
                    
                    if(destino.tipo_envio == "P"){ // solo si son enviadas como 'PARA'
                        numNotificaciones++;
                        $("#notificacion_tramites").append(`
                            <li>
                                <a href="/gestionBandeja/abrirDetalleTramite/1/${destino.detalle_tramite.iddetalle_tramite_encrypt}">
                                    <span class="image"><i class="fa fa-envelope"></i></span>
                                    <span>
                                        <span><b>${destino.detalle_tramite.departamento_origen.nombre}: </span>
                                        <span class="time" style="position: inherit; color: #189a00;">${destino.detalle_tramite.fecha}</span>
                                    </span>
                                    <span class="message" style="text-transform: uppercase;">                                        
                                        ${destino.detalle_tramite.asunto}
                                    </span>
                                    <span id="info_camb_doc_${destino.detalle_tramite.iddetalle_tramite}" style="display:none;"><hr style="margin:5px 0px;"></span>
                                </a>
                            </li>   
                        `);                                
                    }

                });

                //cargamos los documentos cargados
                var aux_documento = []; // para contrar cuantas veces a sigo actualizado un documento
                $.each(retorno.resultado.listaDocCamb, function(des, docCamb){

                    var estTam = docCamb.documento.detalle_tramite.estado; // estado del detalle tramite del documento
                    if(estTam=="A" || estTam=="F"){
                        numNotificaciones++;                    
                        $("#notificacion_tramites").append(`
                            <li style="background-color: beige;" class="list_doc">
                                <a href="/alcanceDocumento/visualizarDocumento/${docCamb.idcambio_documento_encrypt}" target="_blank">
                                    <span class="image"><i class="fa fa-file-text"></i></span>
                                    <span>
                                        <span><b>${docCamb.departamento_cambia.nombre} </span>
                                        <span class="time" style="position: inherit; color: #189a00; font-style:normal;"> 
                                            <br>ACTUALIZÓ EL DOCUMENTO: ${docCamb.documento.codigoDocumento}
                                        </span>
                                    </span>
                                    <span class="message" style="text-transform: uppercase;">
                                        ${docCamb.documento.detalle_tramite.asunto}
                                    </span>
                                    </a>
                            </li>   
                        `);                           
                    }else{
           
                        var iddocumento = docCamb.iddocumento;
                        var iddetalle_tramite = docCamb.documento.detalle_tramite.iddetalle_tramite;

                        if(aux_documento[iddocumento]){

                            aux_documento[iddocumento] = aux_documento[iddocumento]+1;
                            $(`#doc_update_${iddocumento}`).html(`
                                <span>
                                    <i class="fa fa-file-pdf-o"></i> DOCUMENTO ${aux_documento[iddocumento]} VECES ACTUALIZADO:
                                </span> ${docCamb.documento.codigoDocumento}
                            `);
                  
                        }else{
                            aux_documento[iddocumento] = 1;
                            $('#info_camb_doc_'+iddetalle_tramite).append(`
                                <span id="doc_update_${iddocumento}" class="time" style="position: inherit; color: #189a00; display: list-item; font-style: normal; font-size: 11px;">
                                    <span>
                                        <i class="fa fa-file-pdf-o"></i> DOCUMENTO ACTUALIZADO:
                                    </span> ${docCamb.documento.codigoDocumento}                                                                           
                                </span>
                            `);
                            $('#info_camb_doc_'+iddetalle_tramite).show();
                        }                       

                    }

                });

                //cargamos el codigo html
                $("#numNotificaciones").html(numNotificaciones);
                $("#notificacion_tramites").append(`
                    <li>
                        <div class="text-center">
                        <a href="/gestionBandeja/entrada">
                            <strong>Ver todos los trámites</strong>
                            <i class="fa fa-angle-right"></i>
                        </a>
                        </div>
                    </li>
                `);

                if(numNotificaciones==0){
                    $("#notificacion_tramites").html("");
                    $("#numNotificaciones").hide();
                }else{
                    $("#numNotificaciones").show();
                }
            }

            // console.warn("Notificaciones cargadas");
            
            //CARTGAMOS LOS WIDGETS DE LA PANTALLA DE INICION SOLO SI ESQUE ESTAMOS EN EL INICIO

                if($("#widgets_content").length == 0){ return; } //no estamos en el inicio                

                $("#notifi_tramite_entrante").html(retorno.resultado.totalTramEntrada);  
                $("#notifi_tramite_borrador").html(retorno.resultado.totalTramBorrador); 
                $("#notifi_tramite_aprobar").html(retorno.resultado.totalTramAprobar);  
                $("#notifi_tramite_revision").html(retorno.resultado.totalTramRevision);
                $("#notifi_informados").html(retorno.resultado.totalTramInformados);
                $("#notifi_cambio_documento").html(retorno.resultado.totalCambDoc);

        }).fail(function(){
            $("#notifi_tramite_entrante").html(0);  
            $("#notifi_tramite_borrador").html(0); 
            $("#notifi_tramite_aprobar").html(0);  
            $("#notifi_tramite_revision").html(0);
            $("#notifi_informados").html(0);
            $("#notifi_cambio_documento").html(0);
        });

    

    }


    // fucion para cargar las notificaciones cada cierto tiempo
    $(document).ready(function () {        
        cargarNotificacionesTramite();
        return;
        var timeout = timeRefresh*1000; // convertimos a milisegundos
        setInterval(cargarNotificacionesTramite, timeout);
    });


    // ------------- FUNCIÓN PARA CARGAR UN SPINNER DE ESPERA ----------------------

    function spinnerCargando(contenedor,mensaje){
        generarHtmlSpinner(contenedor,mensaje,false,false, false);
    }

    function spinnerCargandoBorde(contenedor,mensaje,borde, color){
        generarHtmlSpinner(contenedor,mensaje,borde, color,false);
    }

    function getSpinnerCargando(mensaje){
        return generarHtmlSpinner(false,mensaje,false, false,true);
    }

    function generarHtmlSpinner(contenedor,mensaje,borde, color,retornar){
        $(`${contenedor}`).hide();

        var blockquote_style ="";
        if(borde==false){
            blockquote_style = " margin-bottom: 10px;";
        }

        var textHtml = (`         
            <div class="row">
                <blockquote class="blockquote text-center" style="border-left: 5px solid #fff; ${blockquote_style}">
                    <div class="d-flex justify-content-center">
                        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <p class="text-center">
                        <strong>
                        ${mensaje}
                        </strong>
                    </p>                
                </blockquote>			                           
            </div>                    
        `);

        if(borde==true){
            textHtml = (`
                <div class="panel panel-${color}">
                    <div class="panel-heading">
                        ${textHtml} 
                    </div>
                </div>
            `);
        }

        if(retornar==true){
            return textHtml;
        }

        $(`${contenedor}`).html(textHtml);
        $(`${contenedor}`).show(200);
    }

    $("#input_menu_buscar").keyup(function(e){
        
        var buscar = $(this).val();
        buscar = buscar.toLowerCase();  
        
        $(`.span_gestion`).parent().hide();
        $(`.span_menu`).parent().hide();

        if(buscar!=""){
          
            var menu = $(`.span_menu:contains('${buscar}')`);
            $(menu).parent().show();
            $(menu).parent().find('.span_gestion').parent().show();

            var gestion = $(`.span_gestion:contains('${buscar}')`);
            $(gestion).parent().show();
            $(gestion).parent().parent().parent().show();            

        }else{
            $(`.span_gestion`).parent().show();
            $(`.span_menu`).parent().show();
        }

    });
