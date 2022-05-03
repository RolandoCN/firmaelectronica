    //============================ ESTILOS PARA VENTANA DE CARGA ================================

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

    // FUNCION PARA MOSTRAR UNA ALERTA DE PNotify PERSONALIZADA
    function alertNotificar(texto, tipo){
        PNotify.removeAll()
        new PNotify({
            title: 'Mensaje de Información',
            text: texto,
            type: tipo,
            hide: true,
            delay: 7000,
            styling: 'bootstrap3',
            addclass: '',
            icono:'info'
        });
    }


    //============================= PARA CARGAR LAS NOTIFICACIONES DE LAS INSPECCIONES NO ASIGNADAS ================================

    $(document).ready(function(){
        // cargarNotificaciones();
    });

    function cargarNotificaciones(){
        $.get('/gestionAgenda/cargarNotificaciones', function(retorno){
            // console.clear();
            // $("#numero_notific").html("");
            // $("#ul_notificaciones").html("");
            if(retorno.error==false){
                var numero_notific = retorno.lista_pendientes.length;
                if(numero_notific>0){
                    $("#numero_notific").html(`<span class="badge bg-red">${numero_notific}</span>`);
                }

                $.each(retorno.lista_pendientes, function(index, emision_certificado){
                    $("#ul_notificaciones").append(`
                        <li style="padding:10px 2px;">
                            <a>
                                <span class="image"><i class="fa fa-exclamation-triangle"></i></span>
                                <span>
                                    <span><b>INSPECCIÓN NO AGENDADA</b></span>
                                    <br><span class="time" style="position: inherit; color: #e74c3c;">${emision_certificado['fechaSolicitud']}</span>
                                </span>
                                <span class="message"><b>SOLICITUD: </b> ${emision_certificado['lista_certificados']['descripcion']}</span>
                                <hr style="margin: 4px 0px; border-top: 1px solid #d8d8d8;">
                                <span class="message"><b>CÉDULA: </b> ${emision_certificado['us001']['cedula']}</span>
                                <span class="message"><b>NOMBRE: </b> ${emision_certificado['us001']['name']}</span>
                            </a>
                        </li>     
                    `);
                });
            }
        });
    }



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
        console.log(buscar);
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