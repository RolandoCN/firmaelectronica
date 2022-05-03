
    var disco = "disksServidorSFTPdocumentos"; // de momento es este

    // funcion para cargar los detalles de un tramite (recive el id del tramite encyptado)
    function mostrarDetalleTramite(iddetalle_tramite){

        // ------ por defecto ocultamos la pestaña Información documento
      
            $("#a_datos_generales").click();
            $("#tab_informacion_documento").hide();

        //------- limpiamos la información --------------------
            $("#codigo_tramite").html("GADMC-000000-00-0");
            $("#info_fecha_documento").html("-");
            $("#info_tipo_documento").html("-");
            $("#info_asunto").html("-");
            $("#info_observacion").html("-");
            $("#info_codigo_documento").html("-");
            $("#info_de").html("-");
            $("#info_estado_documento").html("-");
            $("#info_para").html("-");
            $("#info_copia").html("-");
        //-------------------------------------------------------

        $("#info_vista_previa_documento").html(""); //limpiamos la vistra previa del documento
        $("#tab_asociar_tramite").hide(); // ocultamos por defecto la pestaña de trámites asociados     

        vistacargando("M", "Espere...");
        
        $.get("/tramite/detalleTramite/"+iddetalle_tramite, function(retorno){
            
            vistacargando();

            if(retorno.detalle_tramite.idflujo==null){
                if(retorno.detalle_tramite.estado!="D" && retorno.detalle_tramite.estado!="F"){
                    $("#tab_asociar_tramite").show(); // si no tiene un flujo definido mostramos la pestaña de trámites asociados 
                }
            }

            //cargamos la ruta del boton descargar todos los documentos
            $("#btn_descargar_todos_documentos").attr("href", `/tramite/descargarDocumentos/${iddetalle_tramite}/${retorno.tramite.idtramite_encrypt}`);
            $("#reporte_observaciones").attr("href", `/detalleTramite/reporteobservaciones/${retorno.tramite.idtramite_encrypt}`);
            if(!retorno.error){ // todo bien (success)

                cargarInformacionDocumento(retorno.detalle_tramite);

                var tramite = retorno.tramite;

                // ---- creamos los mensajes de los estados del tramite
                    var procedencia = "Interno";
                    if( tramite.procedencia == "EXT"){ procedencia = "Externo"; }

                    var resolucion = "TRÁMITE NO HA FINALIZADO AÚN";
                    if(tramite.finalizado==1){
                        resolucion = "TRÁMITE FINALIZADO";
                        // switch (tramite.estadoTramite) {
                        //     case "A":
                        //         resolucion = "TRÁMITE APROBADO";
                        //         break;
                        //     case "R":
                        //         resolucion = "TRÁMITE RECHAZADO";
                        //         break;
                        // }
                    }

                // ----- cargamos los detalles generales del tramite
                    $("#codigo_tramite").html(tramite.codTramite);
                    $("#dt_procedencia").html(procedencia);
                    $("#dt_codigoTramite").html(tramite.codTramite);
                    $("#dt_asunto").html(tramite.asunto);
                    $("#dt_tipo_tramite").html(tramite.tipo_tramite.descripcion);
                    $("#dt_origin").html(tramite.departamento_genera.nombre);
                    $("#dt_observacion").html(tramite.observacion);
                    $("#dt_resolucion").html(resolucion);
                    
                    $(".dt_info_final").hide(); // por defecto debe estar oculto
                    $("#dt_conclusion").html(""); //para agregar las concluciones
                    $("#dt_archivos_fisico").html("-");

                // ----- cargamos la ruta fisica de los archivos de trámite
                    if(tramite.gestion_archivo.length==0){
                        $("#dt_archivos_fisico").html("RUTA NO REGISTRADA");
                    }else{
                        tramite.gestion_archivo.forEach(archivo => {
                            $("#dt_archivos_fisico").html(`
                                
                                <b><i class="fa fa-archive"></i> BODEGA: </b> ${archivo.seccion.sector.bodega.nombre}<br>
                                <b><i class="fa fa-navicon"></i> SECTOR: </b> ${archivo.seccion.sector.descripcion}<br>
                                <b><i class="fa fa-outdent"></i> SECCIÓN: </b> ${archivo.seccion.descripcion}<br>
                                <b><i class="fa fa-suitcase"></i> CARPETA: </b> ${archivo.folder}
                                
                            `);
                        });
                    }
                
                // ----- cargamos los el recorrido de departamentos -------------------
                    $("#ht_codigoTramite").html(tramite.codTramite);
                    $("#timeline").html("");
                    $("#tbody_todos_documentos_tramite").html(""); // solo si hay documentos limpiamos

                // ------ cargamos el evento del boton para asociar trámites
                    $("#btn_asociar_tramite").attr('onclick', `modal_asociar_tramite('${iddetalle_tramite}')`);

                // ------ cargamos el organigrama del historial de tramites -------------
                    cargarOrganigramaHistoriaTramites(iddetalle_tramite);
                
                // ------ cargamos el listado de trámites asociados ---------------------
                    mostrarTramitesAsociados(iddetalle_tramite);

                //LIMPIAMOS LA MODAL DE ASOCIAR TRAMITE (lo hacemos desde aqui para evitar errores)

                    $(".tabla_asociados").find('tbody').html("");
                    var datatable = $(".tabla_asociados").DataTable({
                        dom: "<'row' <'form-inline'>> <rt> <'row'<'form-inline'  <'col-sm-6 col-md-6 col-lg-6'l> <'col-sm-6 col-md-6 col-lg-6'p>>>",
                        "destroy":true,
                        order: [[ 0, "desc" ]],
                        pageLength: 3,
                        "language": { url: '/json/datatables/spanish.json' }
                    });
                    datatable.clear();
                    $("#buscartramiteasociar").val("");


            }else{
                $("#info_vista_previa_documento").html(`
                    <h2 class="codDoc_asociado" style="margin-bottom: 20px; margin-top: 20px;"> 
                        <center><i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO CARGAR EL DOCUMENTO </center>
                    </h2>
                `);
            }

        }).fail(function(){
            vistacargando();
            $("#info_vista_previa_documento").html(`
                <h2 class="codDoc_asociado" style="margin-bottom: 20px; margin-top: 20px;"> 
                    <center><i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO CARGAR EL DOCUMENTO </center>
                </h2>
            `);
        });
    }

    function modalObservacionRevisionHistorial(iddetalle_tramite){
        var obs='';
        vistacargando('m','Cargando observaciones....')
        $.get("/detalleTramite/obtenerObservacionRevision/"+iddetalle_tramite, function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }
            if(data['det_revision']==true){
                obs=`<p align="center">${data['detalle']}</p>`;
                $('#detalleObsRevHis').html(obs);
                vistacargando();
                $('#modalObservacionRevision').modal();
                return;
            }
            if(data['detalle'].length>0){
                $.each(data['detalle'],function(i,item){
                    obs=obs+`<p align="left"> <b><li> ${item['created_at']} </b> | ${item['usuario']['name']} <br> <span style="padding-left:30px">${item['descripcion']}</span></li></p><br>`
                })
            }else{
                obs='<p align="center">No hay observación</p>';
            }
            $('#detalleObsRevHis').html(obs);
            vistacargando();
            $('#modalObservacionRevision').modal();
        }).fail(function(){
            alertNotificar('Inconvenientes al obtener observaciones, intente nuevamente','error');
            vistacargando();
        });
    
    }

    function modalObservacionRevisionHistorialActividad(iddetalle_actividad){
        var obs='';
        vistacargando('m','Cargando observaciones....')
        $.get("/detalleActividad/obtenerObservacionRevision/"+iddetalle_actividad, function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }
            if(data['det_revision']==true){
                obs=`<p align="center">${data['detalle']}</p>`;
                $('#detalleObsRevHis').html(obs);
                vistacargando();
                $('#modalObservacionRevision').modal();
                return;
            }
            if(data['detalle'].length>0){
                $.each(data['detalle'],function(i,item){
                    obs=obs+`<p align="left"> <b><li> ${item['created_at']} </b> | ${item['usuario']['name']} <br> <span style="padding-left:30px">${item['descripcion']}</span></li></p><br>`
                })
            }else{
                obs='<p align="center">No hay observación</p>';
            }
            $('#detalleObsRevHis').html(obs);
            vistacargando();
            $('#modalObservacionRevision').modal();
        }).fail(function(){
            alertNotificar('Inconvenientes al obtener observaciones, intente nuevamente','error');
            vistacargando();
        });
    }

    //función para cargar el organigrama de todo el recorrido del trámite
    function cargarOrganigramaHistoriaTramites(iddetalle_tramite){

        $("#tbody_todos_documentos_tramite").html(`<tr> <td colspan="8" style="padding-left: 15px;"><center>${getSpinnerCargando('Cargando Información...')}</center></td></tr>`);
        $("#flujo_proceso").html(`<center style="padding: 0px 10px;">${getSpinnerCargando('Cargando Información...')}</center>`);

        $.get("/tramite/getAllDetalleTramiteAsociados/"+iddetalle_tramite, function(retorno){
            
            $("#flujo_proceso").html('');

            if(retorno.error){

                $("#flujo_proceso").html(`<center>
                    <h2 class="codDoc_asociado" style="margin-bottom: 20px;"> 
                        <i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO OBTENER EL HISTORIAL DE TRÁMITES 
                    </h2>
                </center>`);

                $("#tbody_todos_documentos_tramite").html(`<tr> <td colspan="8"><center><i style="font-size: 16px; margin-right: 5px;" class="fa fa-frown-o"></i> No se pudo cargar los documentos</center></td></tr>`);

                return;
            }

            var listaDetallesTramite = retorno.listaDetalles;
        
            var dataOrganigrama = [];
            var contarDocumentos = 0; // para contar cuandos documentos se agregaron a la tabla

            //reiniciar table
            $("#tbody_todos_documentos_tramite").html("");
            $("#table_documentos_detalle").DataTable().destroy();
            $('#table_documentos_detalle tbody').empty();

            //regiatramos la cabecera del flujo
            var cabecera = (`
                <div class="content_nodo flujo_sm" style="display: contents;">
                    <div class="content_title_detalle" style="background: #0045ab; text-align: center;"><b>TRÁMITE</b></div>
                    <div class="content_info_detalle">                                   
                        <b>${$("#codigo_tramite").html()}</b>          
                    </div>
                </div>
                
            `);
            dataOrganigrama.push(
                [{'v':`inicio_0`, 'f':cabecera}, '', ''],
            );
            
            $.each(listaDetallesTramite, function(dt, detalle_tramite){

                // creamos el mensaje del estado del detalle_tramite
                    var estado_detalle_tramite = "";
                    var title_color = "";
                    if(detalle_tramite.aprobado==0){
                        estado_detalle_tramite = "EN ELABORACIÓN";
                        if(detalle_tramite.estado == "T"){
                            estado_detalle_tramite = "POR APROBAR";
                        }else if(detalle_tramite.estado == "R"){
                            estado_detalle_tramite = "EN REVISIÓN";
                        }
                    }else{ // si ya lo aprobo el jefe
                        switch (detalle_tramite.estado) {
                            case "T":
                                estado_detalle_tramite = "ATENDIDO Y ENVIADO";
                                title_color = "background: #00ab8a;"; //verde
                                break;
                            case "A":
                                estado_detalle_tramite = "ATENDIDO";
                                title_color = "background: #00ab8a;"; //verde
                                break;
                            case "F":
                                estado_detalle_tramite = "FINALIZADO";
                                title_color = "background: #0045ab;"; //azul
                                //cargamos la conclusion
                                $(".dt_info_final").show();
                                $("#dt_conclusion").append(`<span style="font-weight: 800;">(${detalle_tramite.departamento_origen.nombre}) <i class="fa fa-arrow-right"></i> </span> ${detalle_tramite.observacion}<br>`);
                                break;
                            case "D":
                                estado_detalle_tramite = "DENEGADO";
                                title_color = "background: #d43f3a;"; //rojo
                                //cargamos la conclusion
                                $(".dt_info_final").show();
                                $("#dt_conclusion").append(`<span style="font-weight: 800;">(${detalle_tramite.departamento_origen.nombre}) <i class="fa fa-arrow-right"></i> </span> ${detalle_tramite.observacion}<br>`);
                                break;
                        }                                
                    }

                    var boton_flujointerno = "";
                    var boton_obs_revision='';
                    if(detalle_tramite.observacion != "" && detalle_tramite.observacion != null){
                        boton_flujointerno = (`
                            <button type="button" onclick="mostrarObservacionDetalle(this)" class="btn btn-xs btn-default" style="padding: 2px 8px; margin-left: 5px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observación ">
                                <i class="fa fa-eye"></i>
                            </button>
                            <span class="obs_nodo" style="display:none;">${detalle_tramite.observacion}</span>
                        `);                        
                    }
                    if(detalle_tramite.detRevision != "" && detalle_tramite.detRevision != null){
                        boton_obs_revision = (`
                            <button type="button" onclick="modalObservacionRevisionHistorial('${detalle_tramite.iddetalle_tramite_encrypt}')" class="btn btn-xs btn-danger" style="padding: 2px 8px; margin-left: 5px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observación revisión ">
                                <i class="fa fa-eye"></i>
                            </button>
                        `);                        
                    }

                    if(detalle_tramite.proceso_interno==1){
                        boton_flujointerno = boton_flujointerno+(`
                            <button type="button" onclick="verFlujoInterno('${detalle_tramite.iddetalle_tramite_encrypt}')" class="btn btn-xs btn-warning" style="padding: 2px 8px; margin-left: 5px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Flujo Interno ">
                                <i class="fa fa-sitemap"></i>
                            </button>
                        `);
                    }

                    var orden_iteracion = ""; //por defecto nada
                    if(detalle_tramite.nueva_iteracion == 1){ // nueva iteración del administador de contratos
                        orden_iteracion = `<span class="badge bg-blanco">${detalle_tramite.orden_iteracion}</span>`;
                    }

                    var btn_ver_documento = "";
                    if(detalle_tramite.documento.length>0){
                        btn_ver_documento = (`
                            <button type="button" onclick="detalle_tramite_documentos('${detalle_tramite.iddetalle_tramite_encrypt}')" class="btn btn-xs btn-info" style="padding: 2px 8px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Documentos ">
                                <i class="fa fa-file-pdf-o"></i>
                            </button>
                        `);
                    }
                    var fecha_nodo=detalle_tramite.fecha;
                    if(detalle_tramite.fechaApr!=null){
                        fecha_nodo=detalle_tramite.fechaApr;
                    }
                    var contenido = (`
                        <div class="content_nodo flujo_sm">
                            <div class="content_title_detalle" style="${title_color}"><b> ${orden_iteracion} ${detalle_tramite.departamento_origen.nombre}</b></div>
                            <div class="content_info_detalle">
                    
                                <p class="info_detalle asunto_sm" style="text-align: left;">
                                    <b><i class="fa fa-calendar"></i> ${fecha_nodo}</b>

                                    <br>
                                    <i class="fa fa-question-circle info_input" style="color: #607f9a; font-size: 16px; float:left; margin-right: 5px;" data-toggle="tooltip" data-placement="right" data-html="true" title='<b>Asunto:</b> ${detalle_tramite.asunto}'></i>
                                    <b>Asunto:</b> ${detalle_tramite.asunto}                            

                                    <br>
                                    <b>Estado: </b> ${estado_detalle_tramite} 
                                </p>                    
                                ${btn_ver_documento}
                                ${boton_flujointerno}
                                ${boton_obs_revision}
                            </div>
                        </div>
                        
                    `);

                    if((detalle_tramite.nivelAtencion == 1 || detalle_tramite.estado_inint != "N") || detalle_tramite.nueva_iteracion == 1){ // nueva iteración del administador de contratos
                        dataOrganigrama.push(
                            [{'v':`${detalle_tramite.iddetalle_tramite}`, 'f':contenido}, `inicio_0`, ''],
                        );
                    }else{
                        dataOrganigrama.push(
                            [{'v':`${detalle_tramite.iddetalle_tramite}`, 'f':contenido}, `${detalle_tramite.iddetalle_tramite_padre}`, ''],
                        );
                    }

                    if(detalle_tramite.aprobado == 1){ // solo si el tramite se envió
                        $.each(detalle_tramite.destino, function(des, destino){
                            if(destino.detalle_tramite_atendido == null){ // destino no atendido (no tiene un td_detalle_tramite registrado)

                                var mensaje = "ENVIADO PARA ATENDER";
                                var title = ""
                                var title_color = "background: #d68814;";  
                                var estado = "NO ATENDIDO";                  
                                if(destino.tipo_envio == "C"){
                                    mensaje = "ENVIADO COMO COPIA";
                                    title = `<br><b style="> <i class="fa fa-angle-double-right"></i> Copia <i class="fa fa-copy"></i></b>`;
                                    estado  = "NO LEÍDO";
                                    title_color = "background: #3296ef;#3296ef";
                                    if(destino.estado=="A"){ estado = "LEÍDO"; }
                                }

                                var contenido2 = (`
                                    <div class="content_nodo flujo_sm">
                                        <div class="content_title_detalle" style="${title_color}">${destino.departamento.nombre}</div>
                                        <div class="content_info_detalle">
                                
                                            <p class="info_detalle" style="text-align: left;">
                                                <b><i class="fa fa-calendar"></i> ${fecha_nodo}</b>
                                                <br>
                                                ${mensaje}  ${title}
                                                <br>
                                                <b>Estado: </b> ${estado} 
                                            </p>                                                                                                            
                                        </div>                                            
                                    </div>

                                `);

                                dataOrganigrama.push(
                                    [{'v':`destino_${destino.iddestino}`, 'f':contenido2}, `${detalle_tramite.iddetalle_tramite}`, ''],
                                );
                                
                            }
                        });
                    }

                //CARGAMOS LOS DOCUMENTOS DEL TRÁMITE

                $.each(detalle_tramite.documento, function (d, documento) {
                    
                    contarDocumentos++;

                    //verificamos por si es un documento que no se puede previsualizar

                        var boton_documento = `<center style="margin-right: 5px; width:100%;"><span style="font-size: 25px; color: #52616f;"><i class="fa fa-lock"></i></span></center>`;
                        var usuario_permitido = true;

                        if(documento.privado == 1){
                            usuario_permitido = false;
                            if(retorno.es_jefe==1 && retorno.cod_depa_logueado == detalle_tramite.iddepartamento_origen){
                                usuario_permitido = true;
                            }else{
                                if(documento.usuario_asignado.length>0){
                                    usuario_permitido = true;
                                }
                            }
                        }

                    //cargamos los botones en la tabla

                        if(usuario_permitido==true){
                            boton_documento =`<button class="btn btn-info btn-sm btn_icon_lg" onclick="vista_previa_documento('${documento.iddocumento_encrypt}','TD')" data-toggle="tooltip" data-placement="top" data-original-title="Visualizar Documento" style="margin-bottom: 0px;">
                                                    <i class="fa fa-eye"></i>
                                                </button>`;

                            if(documento.extension != "pdf" && documento.extension!="PDF"){
                                boton_documento = `<a class="btn btn-info btn-sm btn_icon_lg" href="/tramite/buscarDocumento/${documento.iddocumento_encrypt}" target="_blank" data-toggle="tooltip" data-placement="top" data-original-title="Descargar Documento" style="margin-bottom: 0px;">
                                                    <i class="fa fa-download"></i>
                                                </a>`;
                            }
                        }

                    //verificar y agregar boton para solicitar el alcance del documento ----------------------

                        var alcance_documento = "";
                        if(retorno.cambio_documento == true || retorno.cambio_documento_usuario==true){

                            if(documento.cambiodoc_pendiente.length == 0){ // el alcance de este documento no esta solicitado
                                alcance_documento =   `<button class="btn btn-warning btn-sm btn_icon_lg btn_tooltip" onclick="soliticarAlcanceDocumento('${documento.iddocumento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Solicitar alcance del documento" style="margin-bottom: 0px;">
                                                                <i class="fa fa-refresh"></i>
                                                            </button>`;                                
                            }else{
                                
                                $.each(documento.cambiodoc_pendiente, function(index, cambiodoc){                        
                                    if(cambiodoc.estado=="C"){
                                        alcance_documento =   `<button class="btn btn-danger btn-sm btn_icon_lg btn_tooltip" onclick="cancelarSoliticarAlcanceDocumento('${documento.iddocumento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Cancelar la solicitud de alcance del documento" style="margin-bottom: 0px;">
                                                                        <i class="fa fa-times"></i>
                                                                    </button>`;
                                    }else{
                                        alcance_documento = `<i class="fa fa-question-circle info_input btn_tooltip" data-toggle="tooltip" data-placement="top" data-original-title="La solicitud de alcance del documento esta siento atendida en el departamento involucrado."></i>`;
                                    }
                                }); 
                            }
                        
                        }


                    //verificamos y agregamos el boton para privaciada de documento --------------------

                        var boton_privadicad = "";
                        if(retorno.es_jefe==1 && retorno.cod_depa_logueado == detalle_tramite.iddepartamento_origen){

                            boton_privadicad = (`
                                    <button class="btn btn-dark btn-sm btn_icon_lg btn_tooltip" onclick="gestionarPrivacidadDocumento('${documento.iddocumento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Gestionar la privacidad del documento" style="margin-bottom: 0px;">
                                            <i class="fa fa-unlock-alt"></i>
                                    </button>
                            `);
                        }

                    //----------------------------------------------------------------------------------

                    //ponemos el color para diferenciar si es un documento principal o un adjunto
                    var colorFila = 'bg-warning';
                    var nivelDoc = '<span class="label lable_estado label-danger">Adjunto</span>';
                    var doc_icono = `<svg style="font-size: 20px;" class="bi bi-arrow-return-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.146 5.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 9l-2.647-2.646a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3 2.5a.5.5 0 00-.5.5v4A2.5 2.5 0 005 9.5h8.5a.5.5 0 000-1H5A1.5 1.5 0 013.5 7V3a.5.5 0 00-.5-.5z" clip-rule="evenodd"/></svg>`;

                    if(documento.tipo_creacion=="E" && (documento.iddetalle_actividad==null || documento.carga_responsable==1)){
                        colorFila = 'bg-success';
                        nivelDoc = '<span class="label lable_estado label-success">Principal</span>';
                        doc_icono = `<svg style="font-size: 18px;" class="bi bi-chevron-double-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L9.293 8 3.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L13.293 8 7.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/></svg>`;
                    }
                    
                    var codigoDocumentoItem = documento.codigoDocumento;
                    if(codigoDocumentoItem==null){ codigoDocumentoItem = ""; }

                    $("#tbody_todos_documentos_tramite").append(`
                        <tr class="${colorFila}">
                            <td>${doc_icono}</td>
                            <td>${detalle_tramite.departamento_origen.nombre}</td>
                            <td>${documento.tipo_documento.descripcion}</td>
                            <td>${documento.fechaCarga}</td>
                            <td>${codigoDocumentoItem}</td>
                            <td>${documento.descripcion}</td>
                            <td>${nivelDoc}</td>
                            <td style="display: flex;">
                                ${boton_documento} 
                                <span id="btn_solicitar_${documento.iddocumento_encrypt.substr(0, 40)}">${alcance_documento}</span>
                                ${boton_privadicad}
                            </td>
                        </tr>
                    `);

                });

                $("#tbody_todos_documentos_tramite").find(".btn_tooltip").tooltip();

            });

            if(contarDocumentos == 0){ // si no se agregan documentos                
                $("#tbody_todos_documentos_tramite").html(`<tr> <td colspan="8"><center>No hay documentos</center></td></tr>`);
            }
            
            
            //codigo para cargar el organigrama
            setTimeout(() => { // esperamos a que la libreria cargue
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Manager');
                data.addColumn('string', 'ToolTip');
                data.addRows(dataOrganigrama);

                // Create the chart.
                var chart = new google.visualization.OrgChart(document.getElementById('flujo_proceso'));
                // Dibuje el gráfico, estableciendo la opción allowHtml en true para la información sobre herramientas
                chart.draw(data, {'allowHtml':true});
                $('[data-toggle="tooltip"]').tooltip();
                if($("#historial").is(':visible')){                   
                    ajutarContenidoOrganigrama("#flujo_proceso");
                }                
            }, 200);            
            cargar_estilos_tabla_detalle();

        }).fail(function(){

            $("#flujo_proceso").html(`<center>
                <h2 class="codDoc_asociado" style="margin-bottom: 20px;"> 
                    <i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO OBTENER EL HISTORIAL DE TRÁMITES 
                </h2>
            </center>`);

            $("#tbody_todos_documentos_tramite").html(`<tr> <td colspan="8"><center><i style="font-size: 16px; margin-right: 5px;" class="fa fa-frown-o"></i> No se pudo cargar los documentos</center></td></tr>`);

        });

    }

    //funcion para mostrar la observacion de un detalle_tramite o detalle_actividad
    function mostrarObservacionDetalle(btn){
        var obs = $(btn).siblings(".obs_nodo").html();
        $("#obs_nodo_flujo").html(obs);
        $("#modalObservacionFlujo").modal("show");
    }

    //funcion para visualizar el flujo interno de un departamento
    function verFlujoInterno(iddetalle_tramite_encrypt){

        vistacargando("M", "Espere...");
        $.get(`/detalleActividad/getFlujoInterno/`+iddetalle_tramite_encrypt, function(retorno){
            
            vistacargando();            
            if(retorno.error){
                alertNotificar(retorno.mensaje, retorno.status);
            }else{
                
                //obtenemos el detalle del trámite
                detalle_tramite = retorno.detalle_tramite;

                //cargamos el titulo de la ventana modal
                $("#titulo_modal_flujo_interno").html(`<i class="fa fa-sitemap"></i> FLUJO INTERNO: `+retorno.detalle_tramite.departamento_origen.nombre);

                //agregamos el primero nodo del flujo (el departamento del detalle_tramite)
                var dataOrganigrama = [];
                // var estado_detalle_tramite = "";
                // var title_color = "";
                // if(detalle_tramite.aprobado==0){
                //     estado_detalle_tramite = "EN ELABORACIÓN"; 
                // }else{ // si ya lo aprobo el jefe
                //     switch (detalle_tramite.estado) {
                //         case "T":
                //             estado_detalle_tramite = "EN PROCESO";
                //             title_color = "background: #00ab8a;"; //verde
                //             break;
                //         case "A":
                //             estado_detalle_tramite = "ATENDIDO";
                //             title_color = "background: #00ab8a;"; //verde
                //             break;
                //         case "F":
                //             estado_detalle_tramite = "FINALIZADO";
                //             title_color = "background: #0045ab;"; //azul
                //             //cargamos la conclusion
                //             $(".dt_info_final").show();
                //             $("#dt_conclusion").append(`<span style="font-weight: 800;">(${detalle_tramite.departamento_origen.nombre}) <i class="fa fa-arrow-right"></i> </span> ${detalle_tramite.observacion}<br>`);
                //             break;
                //         case "D":
                //             estado_detalle_tramite = "DENEGADO";
                //             title_color = "background: #d43f3a;"; //rojo
                //             //cargamos la conclusion
                //             $(".dt_info_final").show();
                //             $("#dt_conclusion").append(`<span style="font-weight: 800;">(${detalle_tramite.departamento_origen.nombre}) <i class="fa fa-arrow-right"></i> </span> ${detalle_tramite.observacion}<br>`);
                //             break;
                //     }                                
                // }

                var contenido = (`
                    <div class="content_nodo flujo_sm">
                        <div class="content_title_detalle" style="background: #0045ab;"><b>${detalle_tramite.departamento_origen.nombre}</b></div>
                        <div class="content_info_detalle">                
                            <p class="info_detalle asunto_sm" style="text-align: center;">
                                <b><i class="fa fa-calendar"></i> ${detalle_tramite.fecha}</b>
                                <br>                                
                                INICIO DE PROCESO INTERNO                                                            
                            </p>
                
                        </div>
                    </div>                    
                `);

                dataOrganigrama.push(
                    [{'v':`detalle_tramite_${detalle_tramite.iddetalle_tramite}`, 'f':contenido}, '', '1'],
                );

                $.each(retorno.lista_detalle_actividad, function(i, detalle_actividad){

                    var estado_detalle_actividad = "";
                    var title_color = "";
                    if(detalle_actividad.aprobado==0){
                        estado_detalle_actividad = "EN ELABORACIÓN"; 
                    }else{ // si ya lo aprobo el jefe
                        switch (detalle_actividad.estado) {
                            case "B":
                                estado_detalle_actividad = "EN ELABORACIÓN";                                
                                break;
                            case "P":
                                estado_detalle_actividad = "ATENDIDO Y ENVIADO";
                                title_color = "background: #00ab8a;"; //verde
                                break;
                            case "A":
                                estado_detalle_actividad = "ATENDIDO";
                                title_color = "background: #00ab8a;"; //verde
                                break;
                            case "R":
                                estado_detalle_actividad = "EN REVISIÓN";
                                title_color = "background: #f0ad4e;"; //amarillo
                                break;
                            case "F":
                                estado_detalle_actividad = "ATENDIDO";
                                title_color = "background: #0045ab;"; //azul                            
                                break;
                            case "FF":
                                estado_detalle_actividad = "FINALIZADO";
                                title_color = "background: #0045ab;"; //azul                            
                                break;
                        }                          
                    }

                    var orden_iteracion = ""; //por defecto nada
                    if(detalle_actividad.nivelAtencion == 1){ // nueva iteración del administador de contratos
                        orden_iteracion = `<span class="badge bg-blanco">${detalle_actividad.orden_iteracion}</span>`;
                    }

                    var boton_obs = "";
                    var boton_obs_revision = "";
                    if(detalle_actividad.observacion != "" && detalle_actividad.observacion != null){
                        boton_obs = (`
                            <button type="button" onclick="mostrarObservacionDetalle(this)" class="btn btn-xs btn-default" style="padding: 2px 8px; margin-left: 5px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observación ">
                                <i class="fa fa-eye"></i>
                            </button>
                            <span class="obs_nodo" style="display:none;">${detalle_actividad.observacion}</span>    
                        `);
                    }

                    if(detalle_actividad.detRevision != "" && detalle_actividad.detRevision != null){
                        boton_obs_revision = (`
                            <button type="button" onclick="modalObservacionRevisionHistorialActividad('${detalle_actividad.iddetalle_actividad_encrypt}')" class="btn btn-xs btn-danger" style="padding: 2px 8px; margin-left: 5px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observación revisión ">
                                <i class="fa fa-eye"></i>
                            </button>
                        `);                        
                    }
                    

                    var contenido = (`
                        <div class="content_nodo flujo_sm">
                            <div class="content_title_detalle" style="${title_color}"><b>${orden_iteracion} ${detalle_actividad.us001_envia.name}</b></div>
                            <div class="content_info_detalle">                
                                <p class="info_detalle asunto_sm" style="text-align: left;">
                                    <b><i class="fa fa-calendar"></i> ${detalle_actividad.fecha}</b>
                                    <br>
                                    <i class="fa fa-question-circle info_input" style="color: #607f9a; font-size: 16px; float:left; margin-right: 5px;" data-toggle="tooltip" data-placement="right" title="" data-original-title='${detalle_actividad.asunto}'></i>
                                    ${detalle_actividad.asunto}
                                    <br>
                                    <b>Estado: </b> ${estado_detalle_actividad} 
                                </p>                                                   
                                ${boton_obs}
                                ${boton_obs_revision}
                            </div>
                        </div>                    
                    `);

                    if(detalle_actividad.iddetalle_actividad_padre==null){
                        dataOrganigrama.push(
                            [{'v':`${detalle_actividad.iddetalle_actividad}`, 'f':contenido}, `detalle_tramite_${detalle_tramite.iddetalle_tramite}`, ''],
                        );
                    }else{
                        dataOrganigrama.push(
                            [{'v':`${detalle_actividad.iddetalle_actividad}`, 'f':contenido}, `${detalle_actividad.iddetalle_actividad_padre}`, ''],
                        ); 
                    }

                    //cargamos los destino
                    $.each(detalle_actividad.destino_act, function(da, destino_act){
                        if(destino_act.estado == "P" || (destino_act.estado == "A" && destino_act.tipo_envio=="C")){ // ahún no esta atendido

                            var mensaje = "ENVIADO PARA ATENDER";
                            var title = ""
                            var title_color = "background: #d68814;";  
                            var estado = "NO ATENDIDO";
                            var espacios = "<br>";            
                            if(destino_act.tipo_envio == "C"){
                                mensaje = "ENVIADO COMO COPIA";
                                title = `<br><b style="> <i class="fa fa-angle-double-right"></i> Copia <i class="fa fa-copy"></i></b>`;
                                estado  = "NO LEÍDO";
                                title_color = "background: #3296ef;";
                                if(destino_act.estado=="A"){ estado = "LEÍDO"; }
                            }
                            
                            // if(destino_act.estado == "F"){
                            //     title_color = "background: #0045ab;";
                            //     estado = "FINALIZADO";
                            //     mensaje = "";
                            //     espacios = "";
                            // }

                            var contenido2 = (`
                                <div class="content_nodo flujo_sm">
                                    <div class="content_title_detalle" style="${title_color}">${destino_act.actividad_us001.us001.name}</div>
                                    <div class="content_info_detalle">
                            
                                        <p class="info_detalle" style="text-align: left;">
                                            <b><i class="fa fa-calendar"></i> ${detalle_actividad.fecha}</b>
                                            <br>
                                            ${mensaje}  ${title}
                                            ${espacios}
                                            <b>Estado: </b> ${estado} 
                                        </p>                                                                                                            
                                    </div>                                            
                                </div>

                            `);

                            dataOrganigrama.push(
                                [{'v':`destino_${destino_act.iddestino_act}`, 'f':contenido2}, `${detalle_actividad.iddetalle_actividad}`, ''],
                            );
                            
                        }
                    });

                });

                //cargamos el organigrama
                setTimeout(() => { // esperamos a que la libreria cargue
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Name');
                    data.addColumn('string', 'Manager');
                    data.addColumn('string', 'ToolTip');
                    data.addRows(dataOrganigrama);

                    // Create the chart.
                    var chart = new google.visualization.OrgChart(document.getElementById('flujo_proceso_interno'));
                    // Dibuje el gráfico, estableciendo la opción allowHtml en true para la información sobre herramientas
                    chart.draw(data, {'allowHtml':true});
                    $('[data-toggle="tooltip"]').tooltip();
                    ajutarContenidoOrganigrama("#flujo_proceso_interno");
                }, 200);     


                $("#modal_flujo_interno").modal("show");
            }

        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo obtener la información, por favor intetelo más tarde");
        });

    }

    //función que se ejecuta al abrir la pestaña de ver historial
    $("#historial_tramite").click(function(){
        ajutarContenidoOrganigrama("#flujo_proceso");        
    });

    //funcion que se ejecuta el cambiar de tamaño la ventana
    $(window).resize(function(){
        if($("#flujo_proceso").is(":visible")){ // ajustamos solo cuando es visible el organigrama
            ajutarContenidoOrganigrama("#flujo_proceso");
        }
    });

    //funciona para ajustarl el alto de los nodos del diagrama
    function ajutarContenidoOrganigrama(iddiagrama){

        setTimeout(() => { //esperamos que se cargue el diagrama
            var nodos_diagrama = $(`${iddiagrama}`).find('.google-visualization-orgchart-node');
            $.each(nodos_diagrama, function(index, nodo){
                var content_nodo = $(nodo).children('.content_nodo');
                var height_nodo = $(nodo).height();
                $(content_nodo).css({'height': height_nodo+"px", 'padding': '0'});
            });
        }, 200);

    }


    //funcion para cargar la iformacion del documento principal
    function cargarInformacionDocumento(detalle_tramite){

        //verificamos si es un proceso reasignado
        if(detalle_tramite.reasignado==1){
            detalle_tramite = detalle_tramite.detalle_tramite_padre;
        }

        //verificamos si es un detalle finalizado o no
        if(detalle_tramite.estado=="F" || detalle_tramite.tramite.finalizado==1){
            $("#a_datos_generales").click();
            $("#tab_informacion_documento").hide();
        }
        
        detalle_tramite.documento.forEach(documento => {

            if(documento.tipo_creacion=="E" && (documento.iddetalle_actividad==null || documento.carga_responsable==1)){ //documento principal

                //ejecuta un funciona si existe el document principal (si la funciona no esta definida no pasa nada)
                if(typeof existeDocumentoPrincipal !== 'undefined'){                   
                    existeDocumentoPrincipal();
                }

                //mostramos la pestaña solo si existe el documento
                if(detalle_tramite.estado!="F" && detalle_tramite.tramite.finalizado!=1){
                    setTimeout(() => {
                        $("#tab_informacion_documento").show();  
                        $("#tab_informacion_documento").click();  
                    }, 100);
                }
                
                //detectamos el estado del documento
                var estado_documento = "EN TRÁMITE";
                if(documento.estado == "B"){ estado_documento="EN BORRADOR"; }
                
                //obtenemos los destino para y copia
                var para = ""; var copia = "";
                detalle_tramite.destino.forEach(destino => {
                    var nombre_jefe_destino = "";
                    if(destino.departamento.admin_contrato==1){
                        nombre_jefe_destino = "Administrador de Contrato";
                    }else{
                        us001_destino = destino.departamento.jefe_departamento[0].us001;
                        nombre_jefe_destino = us001_destino.name;
                        if(us001_destino.nombre_documental!=null && us001_destino.nombre_documental!=""){
                            nombre_jefe_destino = us001_destino.nombre_documental;
                        }
                    }
                    if (destino.tipo_envio =="P") {
                        para = para+`<li> <i class="fa fa-user"></i> ${nombre_jefe_destino}  /  <i class="fa fa-bookmark"></i> ${destino.departamento.nombre} </li>`;
                    }else{
                        copia = copia+`<li> <i class="fa fa-user"></i> ${nombre_jefe_destino}  /  <i class="fa fa-bookmark"></i> ${destino.departamento.nombre} </li>`;
                    }
                });

                var departamento_origen = "";
                if(detalle_tramite.departamento_origen!=null){
                    departamento_origen = ' / <i class="fa fa-bookmark"></i> '+detalle_tramite.departamento_origen.nombre;
                }

                //cargamos toda la informacion
                $("#info_fecha_documento").html(documento.fechaCarga);
                $("#info_tipo_documento").html(documento.tipo_documento.descripcion);
                $("#info_asunto").html(detalle_tramite.asunto);
                $("#info_observacion").html(detalle_tramite.observacion);
                $("#info_codigo_documento").html(documento.codigoDocumento);
                $("#info_de").html(documento.us001_de.name+departamento_origen);
                $("#info_estado_documento").html(estado_documento);                
                $("#info_para").html(`<ul style="margin-bottom: 0px; padding-left: 20px;">${para}</ul>`);
                $("#info_copia").html(`<ul style="margin-bottom: 0px; padding-left: 20px;">${copia}</ul>`);


                //cargamos el documento
                spinnerCargando("#info_vista_previa_documento", "Obteniendo Documento");                
                $.get(`/tramite/obtenerDocumento/${documento.iddocumento_encrypt}`, function(docB64){                   
                    if(docB64!=""){
                        var encabezado = '<hr style="margin: 10px 0px;"><p style="font-weight: 700; font-size: 18px;"><i class="fa fa-desktop"></i> Vista previa del documento</p>';
                        $("#info_vista_previa_documento").html(encabezado+" "+`<iframe id="iframe_document" name="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 800px;"></iframe>`);    
                    }else{
                        $("#info_vista_previa_documento").html(`
                            <h2 class="codDoc_asociado" style="margin-bottom: 20px; margin-top: 20px;"> 
                                <center><i class="fa fa-lock" style= "font-size: 22px;"></i> NO TIENES PERMISO PARA VISUALIZAR EL DOCUMENTO </center>
                            </h2>
                        `);
                    }
                }).fail(function(){
                    $("#info_vista_previa_documento").html(`
                        <h2 class="codDoc_asociado" style="margin-bottom: 20px;  margin-top: 20px;"> 
                            <center><i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO CARGAR EL DOCUMENTO </center>
                        </h2>
                    `);
                });
                return;
                
            }
        });
    }

    //funcion para ver los documentos de un nodo en el organigrama
    function detalle_tramite_documentos(iddetalle_tramite){
        
        $("#content_visualizarDocumento_depa").html("");
        $("#modal_detalle_tramite_documentos").modal("show");
        var num_col = $("#tbody_detalle_tramite_documentos").siblings('thead').find('th').length;

        $("#tbody_detalle_tramite_documentos").html(`<tr> <td colspan="${num_col}" style="padding-left: 15px;"><center>${getSpinnerCargando('Cargando Información...')}</center></td></tr>`);
        
        $.get('/detalleTramite/obtenerDocumentos/'+iddetalle_tramite, function(retorno){

            $("#tbody_detalle_tramite_documentos").html(`<tr> <td colspan="${num_col}" ><center>No hay documentos</center></td></tr>`);

            if(!retorno.error){ // consulta exitos
                
                var detalle_tramite = retorno.resultado;

                if(detalle_tramite.documento.length>0) {
                    $("#tbody_detalle_tramite_documentos").html(""); // solo si hay documentos limpiamos
                }

                $.each(detalle_tramite.documento, function (d, documento){

                    
                    //verificamos por si es un documento que no se puede previsualizar

                        var boton_documento = `<center style="margin-right: 5px; width:100%;"><span style="font-size: 25px; color: #52616f;"><i class="fa fa-lock"></i></span></center>`;
                        var usuario_permitido = true;

                        if(documento.privado == 1){
                            usuario_permitido = false;
                            if(retorno.es_jefe==1 && retorno.cod_depa_logueado == detalle_tramite.iddepartamento_origen){
                                usuario_permitido = true;
                            }else{
                                if(documento.usuario_asignado.length>0){
                                    usuario_permitido = true;
                                }
                            }
                        }

                    //verificamos por si es un documento que no se puede previsualizar

                        if(usuario_permitido==true){

                            alcance_documento='';
                            if(retorno.cambio_documento_usuario==true){
                                if(documento.cambiodoc_pendiente.length == 0){ // el alcance de este documento no esta solicitado
                                    alcance_documento =   `<button class="btn btn-warning btn-sm btn_icon_lg" onclick="soliticarAlcanceDocumento('${documento.iddocumento_encrypt}', this)"data-toggle="tooltip" data-placement="top" data-original-title="Solicitar alcance de documento.">
                                        <i class="fa fa-refresh"></i>
                                    </button>`;               
                                }else{
                                    
                                    $.each(documento.cambiodoc_pendiente, function(index, cambiodoc){                        
                                        if(cambiodoc.estado=="C"){
                                            alcance_documento =   `<button class="btn btn-danger btn-sm btn_icon_lg " onclick="cancelarSoliticarAlcanceDocumento('${documento.iddocumento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Cancelar solicitud de alcance">
                                                                            <i class="fa fa-times"></i>
                                                                        </button>`;
                                        }else{
                                            alcance_documento = `<i class="fa fa-question-circle info_input " data-toggle="tooltip" data-placement="top" data-original-title="La solicitud de alcance del documento esta siendo atendida en el departamento involucrado."></i>`;
                                        }
                                    }); 
                                }
                            }
                            boton_documento =`  <button class="btn btn-info btn-sm btn_icon_lg" onclick="vista_previa_documento('${documento.iddocumento_encrypt}','DP')"data-toggle="tooltip" data-placement="top" data-original-title="Visualizar documento.">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                                <a class="btn btn-success btn-sm btn_icon_lg" href="/tramite/descargarDocumentoRedirect/${documento.iddocumento_encrypt}" data-toggle="tooltip" data-placement="top" data-original-title="Descargar documento" target="_blank">
                                                    <i class="fa fa-download"></i>
                                                </a>
                                                <a class="btn btn-primary btn-sm btn_icon_lg" href="/tramite/obtenerDocumentoRedirect/${documento.iddocumento_encrypt}" data-toggle="tooltip" data-placement="top" data-original-title="Abrir documento en otra pestaña" target="_blank">
                                                    <i class="fa fa-share"></i>
                                                </a>
                                                ${alcance_documento}
                                                `;

                            if(documento.extension != "pdf" && documento.extension!="PDF"){
                                boton_documento = `<a class="btn btn-info btn-sm btn-block" href="/tramite/buscarDocumento/${documento.iddocumento_encrypt}" data-toggle="tooltip" data-placement="top" data-original-title="Descargar documento" target="_blank">
                                                    <i class="fa fa-download"></i> Descargar
                                                </a>
                                                ${alcance_documento}`;
                            }
                        }

                    //ponemos el color para diferenciar si es un documento principal o un adjunto
                    var colorFila = 'bg-warning';
                    var nivelDoc = '<span class="label lable_estado label-danger">Adjunto</span>';
                    if(documento.tipo_creacion=="E" && (documento.iddetalle_actividad==null || documento.carga_responsable==1)){
                        colorFila = 'bg-success';
                        nivelDoc = '<span class="label lable_estado label-success">Principal</span>';
                    }

                    
                    $("#tbody_detalle_tramite_documentos").append(`
                        <tr class="${colorFila}">
                            <td>${documento.tipo_documento.descripcion}</td>
                            <td>${documento.fechaCarga}</td>
                            <td>${documento.codigoDocumento}</td>
                            <td>${documento.descripcion}</td>
                            <td>${nivelDoc}</td>
                            <td style="display: flex;">${boton_documento}</td>
                        </tr>
                    `);    
                    $('[data-toggle="tooltip"]').tooltip();                 
                });

            }else{
                alertNotificar("No se pudo realizar la petición", "error");
            }
        });
    }

    //funcion para visualizar un documento 
    function vista_previa_documento(iddocumento_encrypt, donde){
        
        if(donde == "TD"){  vistacargando("M", "Espere..."); }
        else{ spinnerCargando("#content_visualizarDocumento_depa", "Obteniendo Documento"); }
        var mensaje_privacidad = `
            <h2 class="codDoc_asociado" style="margin-bottom: 20px; margin-top: 20px;"> 
                <center><i class="fa fa-lock" style= "font-size: 22px;"></i> NO TIENES PERMISO PARA VISUALIZAR EL DOCUMENTO </center>
            </h2>
        `;

        $("#btn_descargar_documento").attr("href", "/tramite/descargarDocumentoRedirect/"+iddocumento_encrypt);
        $("#btn_abriotrap_documento").attr("href", "/tramite/obtenerDocumentoRedirect/"+iddocumento_encrypt);

        $.get(`/tramite/obtenerDocumento/${iddocumento_encrypt}`, function(docB64){
            vistacargando();
            if(donde == "TD"){
                $("#modal_vista_previa_documento").modal("show");
                if(docB64 != ""){
                    $("#content_visualizarDocumento").html(`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 450px;"></iframe>`);
                }else{
                    $("#content_visualizarDocumento").html(mensaje_privacidad);
                }
            }else if(donde=="DP"){
                if(docB64 != ""){
                    var encabezado = '<hr style="margin: 10px 0px;"><p style="font-weight: 700;"><i class="fa fa-desktop"></i> Vista previa del documento</p>';
                    $("#content_visualizarDocumento_depa").html(encabezado+" "+`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 350px;"></iframe>`);
                }else{
                    $("#content_visualizarDocumento_depa").html(mensaje_privacidad);
                }
            }
        }).fail(function(){
            vistacargando();
            $("#content_visualizarDocumento_depa").html(`
                <h2 class="codDoc_asociado" style="margin-bottom: 20px;"> 
                    <center><i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO CARGAR EL DOCUMENTO </center>
                </h2>
            `);
        });
    }



    // FUNCIONES PARA ASOCIAR DOCUMENTOS -----------------------------------------------------

        function mostrarTramitesAsociados(iddetalle_tramite){

            spinnerCargando("#content_historial_asociados", "Obteniendo Historial");

            $.get("/detalleTramite/getHistorialAsociados/"+iddetalle_tramite, function(retorno){

                if(retorno.error){ // si ocurre un error al obtener el historia de asociados
                    $("#content_historial_asociados").html(`<center>
                        <h2 class="codDoc_asociado" style="margin-bottom: 20px;"> 
                            <i class="fa fa-meh-o" style= "font-size: 22px;"></i> NO SE PUDO OBTENER LA LISTA DE ASOCIACIONES DEL TRÁMITE 
                        </h2>
                    </center>`);
                    return;
                }

                // si todo se obtiene correctamene cargamos la información el en pantalla

                $("#content_historial_asociados").html(`<h2 class="codDoc_asociado">LA LISTA DE ASOCIACIONES DEL TRÁMITE </h2>`);

                $.each(retorno.resultado, function (index, detalle_tramite){

                    var clase_actual = ""; // para almacenar la clase que contiene el estilo con bordes verdes
                    var texto_actual = ""; // para almacenar el html con mensaje de actual                    

                    if(detalle_tramite.iddetalle_tramite == retorno.iddetale_tramite_actual){
                        clase_actual = "content_asociado_actual";
                        texto_actual = '<span class="instancia">(Actual) <i class="fa fa-hand-o-right"></i><span class="span_space">|</span></span> ';
                    }

                    if(index==0){ // agregamos el primero a la lista

                        var style_solo = "padding-bottom:0px;"; // para agregarle un padding bootom su solo viene un nodo
                        if(retorno.resultado.length==1){ style_solo = "padding-bottom:10px;"; }

                        $("#content_historial_asociados").append(`
                            <ul class="list-unstyled timeline">
                                <li class="list-unstyled-li">
                                    <div class="block" style="margin-bottom:10px; ${style_solo}">
                                        
                                        <h2 class="title">                
                                            <p>
                                                <div class="content_asociado ${clase_actual}">
                                                    ${texto_actual}  
                                                    <i class="fa fa-file-pdf-o iconoTittle"></i> ${detalle_tramite.tramite.codTramite}
                                                    <span class="span_space">|</span>
                                                    <span style="font-weight: 600;"><i class="fa fa-calendar"></i> ${detalle_tramite.fecha}</span>
                                                    <span class="span_space">|</span>
                                                    <span><i class="fa fa-file-text-o"></i> ${detalle_tramite.asunto}</span>
                                                </div>  
                                            </p>                                            
                                        </h2>
                                        <div id="nodos_hijos_de_${detalle_tramite.iddetalle_tramite}"></div>
                                    </div>
                                </li>
                            </ul>
                        `);

                    }else{ // si no es el primero agregamos el resto de nodos como secundarios

                        if(detalle_tramite.iddetalle_tramite_padre != null && detalle_tramite.iddetalle_tramite_padre !=""){ //todos deben tener un iddetalle_tramite_padre

                            // agregamos como nodo interno (hijo o hermano de otro nodo)
                            $(`#nodos_hijos_de_${detalle_tramite.iddetalle_tramite_padre}`).append(`
                                <ul class="list-unstyled timeline">
                                    <li class="list-unstyled-li list-interno">
                                        <div class="block">
                                            
                                            <h2 class="title">                
                                                <p>
                                                    <div class="content_asociado ${clase_actual}">
                                                        ${texto_actual}                                       
                                                        <i class="fa fa-file-pdf-o iconoTittle"></i> ${detalle_tramite.tramite.codTramite}
                                                        <span class="span_space">|</span>
                                                        <span style="font-weight: 600;"><i class="fa fa-calendar"></i> ${detalle_tramite.fecha}</span>
                                                        <span class="span_space">|</span>
                                                        <span><i class="fa fa-file-text-o"></i> ${detalle_tramite.asunto}</span>
                                                    </div>  
                                                </p>                                            
                                            </h2>
                                            <div id="nodos_hijos_de_${detalle_tramite.iddetalle_tramite}"></div>                                                                                                                                                                                             
                            
                                        </div>
                                    </li>
                                </ul>
                            `);                          
                        }

                    }

                });
                
            }).fail(function(){
                $("#content_historial_asociados").html(`<center>
                    <h2 class="codDoc_asociado" style="margin-bottom: 20px;"> 
                        <i class="fa fa-meh-o" style= "font-size: 22px;"></i> NO SE PUDO OBTENER LA LISTA DE ASOCIACIONES DEL TRÁMITE 
                    </h2>
                </center>`);
            });

        }

        $("#buscartramiteasociar").keyup(function(event){
            if (event.keyCode === 13) {
                $('#btn_buscarTramAsociar').click();
            }
        });

        function modal_asociar_tramite(iddetalle_tramite){

            //mostramos la ventana modal
            $('#modal_asociar_tramite').modal('show');
            $('#btn_buscarTramAsociar').attr('onclick', `buscarDetalleTramite('${iddetalle_tramite}')`); // cargamos el evento del boton bucar tramite de la modal

            //obtenemos el ancetecedente y los consecuentes del trámite
            vistacargando("M", "Espere...");
            $.get("/detalleTramite/getAntecedenteConsecuentes/"+iddetalle_tramite, function(retorno){
                vistacargando();
                if(retorno.error){
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);
                    return; // no abrimos la la modal
                }else{
                    cargarTablasAntecedenteConsecuentes(retorno.resultado.antecedente, retorno.resultado.listaConsecuentes, iddetalle_tramite);
                }
            }).fail(function() {
                vistacargando();
            });

        }

        function cargarTablasAntecedenteConsecuentes(antecedente, listaConsecuentes, iddetalle_tramite){

            // cargamos el antecedente (solo si esque existe)
            if(antecedente!=null && antecedente !=""){
                $("#tbody_tabla_modal_antecedente").html(`
                    <tr>
                        <td class="todo_mayus">${antecedente.tramite.codTramite}</td>
                        <td class="todo_mayus">${antecedente.fecha}</td>
                        <td class="todo_mayus">${antecedente.asunto}</td>
                        <td><button onclick="eliminarAsociacion('${iddetalle_tramite}', '${antecedente.iddetalle_tramite_encrypt}', 'A')" class="btn btn_elimasoc btn-sm btn-danger"><i class="fa fa-chain-broken"></i> Quitar</button></td>
                    </tr>
                `);
            }else{
                $("#tbody_tabla_modal_antecedente").html(`<tr><td colspan="4"><center>No se encontraron registros coincidentes</center></td></tr>`);
            }

            // cargamos los el listado de trámites consecuentes (solo si esque existen)

            $('#tabla_modal_consecuentes').DataTable({
                dom: "<'row' <'form-inline'>> <rt> <'row'<'form-inline'  <'col-sm-6 col-md-6 col-lg-6'l> <'col-sm-6 col-md-6 col-lg-6'p>>>",
                destroy:true,
                order: [[ 0, "desc" ]],
                pageLength: 3,
                sInfoFiltered:false,
                data: listaConsecuentes,
                language: datatableLenguaje({ placeholder: "Ejm: GADM-000-2020-N" }),
                columnDefs: [
                    {  className: "todo_mayus", targets: 0 },
                    {  className: "todo_mayus", targets: 1 },
                    {  className: "todo_mayus", targets: 2 },
                    {  className: "todo_mayus", targets: 3 },
                ],
                columns:[
                    { data: "tramite.codTramite" },
                    { data: "fecha" },
                    { data: "asunto" },
                    { data: "asunto" }, //valor por defecto                     
                ],

                "rowCallback": function( row, detalle_tramite_cons, index ){
                    //cargamos el boton de ver detalle
                    $('td', row).eq(3).html(`<button onclick="eliminarAsociacion('${iddetalle_tramite}', '${detalle_tramite_cons.iddetalle_tramite_encrypt}', 'C')" class="btn btn_elimasoc btn-sm btn-danger"><i class="fa fa-chain-broken"></i> Quitar</button>`);
                }
                                            
            });
        }

        function buscarDetalleTramite(iddetalle_tramite){

            var busqueda = $("#buscartramiteasociar").val();
            if(busqueda=="" || busqueda==null){ return; }

            vistacargando("M","Buscando...");
            $.get(`/detalleTramite/buscarTramiteAsociar/${iddetalle_tramite}/${busqueda}`, function(retorno){

                vistacargando();
                if(retorno.error){
                   alertNotificar(retorno.resultado.mensaje, "error");
                }else{
                    cargarTablaBusquedaTramitesAsociar(retorno.resultado.listaDetallesTramite, iddetalle_tramite);
                }

            }).fail(function(){
                alertNotificar("Error al realizar la petición", "error");
                vistacargando();  
            });

        }

        function cargarTablaBusquedaTramitesAsociar(listaDetallesTramite, iddetalle_tramite){

            // cargamos la imformacion del lenguaje
            var datatable = {
                placeholder: "Ejm: GADM-000-2020-N"
            }

            // cargamos los datos a la tabla
            
            var tablatramite = $('#tabla_buscar_tramite').DataTable({
                dom: ""
                +"<'row' <'form-inline'>>"
                +"<rt>"
                +"<'row'<'form-inline'"
                +" <'col-sm-6 col-md-6 col-lg-6'l>"
                +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                "destroy":true,
                order: [[ 0, "desc" ]],
                pageLength: 10,
                sInfoFiltered:false,
                language: datatableLenguaje(datatable),
                data: listaDetallesTramite,
                columnDefs: [
                    {  className: "todo_mayus", targets: 0 },
                    {  className: "todo_mayus", targets: 1 },
                    {  className: "todo_mayus", targets: 2 },
                    {  className: "todo_mayus", targets: 3 },
                    {  className: "bg-warning", targets: 4 },                
                    {  className: "bg-warning", targets: 5 },
                ],
                columns:[
                    { data: "tramite.codTramite" },
                    { data: "fecha" },
                    { data: "asunto"},
                    { data: "asunto" }, //valor por defecto
                    { data: "asunto" }, //valor por defecto 
                    { data: "asunto" }, //valor por defecto                      
                ],

                  "rowCallback": function( row, detalle_tramite, index ){  
                      
                    //cargamos los departamento destino
                    var destinos = "";
                    var tipo_envio = "";
                    $.each(detalle_tramite.destino, function(index, destino){
                        if(destino.tipo_envio == "C"){ // enviado como copia
                            tipo_envio = `
                                <b style="padding-left: 5px; color: #e60000;"> 
                                    <i style="font-size: 16px;" class="fa fa-angle-double-right"></i> 
                                    <span style="text-transform: none; color: #e60000;">Copia</span> 
                                    <i style="font-size: 16px;" class="fa fa-copy"></i>
                                </b>`;
                        }
                        destinos += `<li>${destino.departamento.nombre} ${tipo_envio}</li>`;
                    });

                    $('td', row).eq(3).html(`<ul style="margin-bottom: 0px; padding-left: 20px;">${destinos}</ul>`);
 
                    //cargamos el boton de ver detalle
                    $('td', row).eq(4).html(`<button type="button" onclick="asociarTramite('${iddetalle_tramite}','${detalle_tramite.iddetalle_tramite_encrypt}', 'A', this)" class="btn btn-sm btn-info btn_icon" data-toggle="tooltip" data-placement="top" title="Asociar como Antecedente" style="margin-bottom: 0;"> <i class="fa fa-sign-in"></i> <i class="fa fa-file-pdf-o"></i> </button>`);
                    $('td', row).eq(5).html(`<button type="button" onclick="asociarTramite('${iddetalle_tramite}','${detalle_tramite.iddetalle_tramite_encrypt}', 'C', this)" class="btn btn-sm btn-info btn_icon" data-toggle="tooltip" data-placement="top" title="Asociar como Consecuente" style="margin-bottom: 0;"> <i class="fa fa-file-pdf-o"></i> <i class="fa fa-sign-out"></i> </button>`);

                    $('td', row).eq(4).find('button').tooltip();
                    $('td', row).eq(5).find('button').tooltip();

                }
                                          
            });

            // quitamos la clase solo "bg-warning" y "todo_mayus" solo en la cabecera
            var columnas = $(tablatramite.table().header()).children('tr').find('th');
            $(columnas).removeClass('bg-warning');
            $(columnas).removeClass('todo_mayus');

        }

        function asociarTramite(iddetalle_tramite, iddetalle_tramite_asociar, tipo_asociacion, btn){

            //NOTA: tipo_asociacion solo puede venir
            // A = agregar como antecedente del trámite actual
            // C = agregar como consecuente del trámite actual

            $(btn).tooltip('hide');
    

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            vistacargando('M','Registrando...'); // mostramos la ventana de espera

            var FrmData = {
                idetalle_tramite: iddetalle_tramite,
                iddetalle_tramite_asociar: iddetalle_tramite_asociar,
                tipo_asociacion: tipo_asociacion
            };

            $.ajax({
                url: '/detalleTramite/asociarTramite',
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                complete: function(requestData){
                    vistacargando(); // ocultamos la ventana de espera
                    retorno = requestData.responseJSON;
                    // si es completado con exito
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

                    if(!retorno.error){
                        //cargamos los antecesores y consecuentes del detalle tramite actual
                        cargarTablasAntecedenteConsecuentes(retorno.resultado.antecedente, retorno.resultado.listaConsecuentes, iddetalle_tramite);
                        //cargamos el historial de asociados
                        mostrarTramitesAsociados(iddetalle_tramite);
                        //cargamos el organigrama del flujo de tramite
                        cargarOrganigramaHistoriaTramites(iddetalle_tramite);
                    }
                },
                error: function(error){
                    vistacargando(); // ocultamos la ventana de espera
                }
            }); 

        }

        function eliminarAsociacion(iddetalle_tramite, iddetalle_tramite_asociado, tipo_asociacion){
            swal({
                title: "",
                text: "¿Está seguro que desea quitar la asociación?",
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

                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    
                    vistacargando('M','Espere...'); // mostramos la ventana de espera
        
                    var FrmData = {
                        idetalle_tramite: iddetalle_tramite,
                        iddetalle_tramite_asociado: iddetalle_tramite_asociado,
                        tipo_asociacion: tipo_asociacion
                    };
        
                    $.ajax({
                        url: '/detalleTramite/eliminarAsociacion',
                        method: 'POST',
                        data: FrmData,
                        dataType: 'json',
                        complete: function(requestData){
                            vistacargando(); // ocultamos la ventana de espera
                            retorno = requestData.responseJSON;
                            console.log(retorno);
                            // si es completado con exito
                            alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);
        
                            if(!retorno.error){
                                // actualizamos la tabla de antecedente y consecuentes
                                cargarTablasAntecedenteConsecuentes(retorno.resultado.antecedente, retorno.resultado.listaConsecuentes, iddetalle_tramite);
                                //cargamos el historial de asociados
                                mostrarTramitesAsociados(iddetalle_tramite);
                                //cargamos el organigrama del flujo de tramite
                                cargarOrganigramaHistoriaTramites(iddetalle_tramite);
                            }
                        },
                        error: function(error){
                            vistacargando(); // ocultamos la ventana de espera
                        }
                    }); 

                }
                sweetAlert.close();   // ocultamos la ventana de pregunta
            });
        }


    
    // FUNCIONES PARA SOLICITAR CAMBIO DE DOCUMENTO --------------------------------------------------
        
        //fucnion para presapar la modal para registrar la solicitud del cambio de documento
        function soliticarAlcanceDocumento(iddocumento_encrypt, btn){

            $(btn).tooltip('hide');

            $("#textarea_observacion_cambio").val("");
            $("#frm_cambiar_documento").attr("action", `/alcanceDocumento/registrarCambio/${iddocumento_encrypt}`);
            $("#iddocumento_encypt_cambdocu").val(iddocumento_encrypt);
            $("#modal_cambio_documento").modal("show");

        }

        //funcion que registra la solicitud del cambio de documento
        $("#frm_cambiar_documento").submit(function(e){

            e.preventDefault(); 
            
            var formulario = this;
            var ruta = $(this).attr("action");
            var iddocumento_encrypt = $("#iddocumento_encypt_cambdocu").val();
    
            swal({
                title: "",
                text: "¿Está seguro que desea registrar la solicitar de alcance del documento?",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: "btn-primary",
                confirmButtonText: "Si, solicitar!",
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
                    
                    var FrmData = new FormData(formulario);

                    vistacargando('M','Espere...');
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
    
                            if(!retorno.error){ //todo correcto
                                $("#modal_cambio_documento").modal("hide");

                                //cambiamos el boton
                                $(`#btn_solicitar_${iddocumento_encrypt.substr(0, 40)}`).html(`                                    
                                    <button  class="btn btn-danger btn-sm btn_icon_lg btn_tooltip" onclick="cancelarSoliticarAlcanceDocumento('${iddocumento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Cancelar la solicitud de cambio del documento" style="margin-bottom: 0px;">
                                        <i class="fa fa-times"></i>
                                    </button>
                                `);

                                $("#tbody_todos_documentos_tramite").find(".btn_tooltip").tooltip();

                            }
        
                        },
                        error: function(error){
                            vistacargando();
                            alertNotificar("Error al realizar la petición, Inténtelo mas tarde", "error");
                        }
                    }); 
    
                }
    
                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 
    
    
        });


        //funcion para cancelar una solicitud de cambio de documento
        function cancelarSoliticarAlcanceDocumento(iddocumento_encrypt, btn){

            $(btn).tooltip('hide');
            
            swal({
                title: "",
                text: "¿Está seguro que desea cancelar la solicitud de alcance del documento?",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: "btn-primary",
                confirmButtonText: "Si, cancelar!",
                cancelButtonText: "No, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){            
                if(isConfirm){ // si dice que quiere eliminar
    
                    vistacargando("M", "Espere...");
                    $.get("/alcanceDocumento/cancelarCambio/"+iddocumento_encrypt, function(retorno){
                        
                        vistacargando();
                        alertNotificar(retorno.mensaje, retorno.status);
                        if(!retorno.error){ //todo correcto
                            //cambiamos el boton
                            $(`#btn_solicitar_${iddocumento_encrypt.substr(0, 40)}`).html(`                                    
                                <button class="btn btn-warning btn-sm btn_icon_lg btn_tooltip" onclick="soliticarAlcanceDocumento('${iddocumento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Solicitar cambio de documento" style="margin-bottom: 0px;">
                                    <i class="fa fa-refresh"></i>
                                </button>
                            `);

                            $("#tbody_todos_documentos_tramite").find(".btn_tooltip").tooltip();
                        }

                    }).fail(function(){
                        vistacargando();
                        alertNotificar("Error al realizar la petición, Inténtelo mas tarde", "error");
                    });
                }
                sweetAlert.close();   // ocultamos la ventana de pregunta
                $(btn).tooltip('hide');
            }); 
        }


    // FUNCIONES PARA GESTIONAR LA PRIVACIAD DE UN DOCUMENTO ------------------------------------------

        function gestionarPrivacidadDocumento(iddocumento_encrypt, btn){

            $(btn).tooltip('hide');
            $("#btn_agregar_usuario").show();
            $(".chosen-container-multi").css("width", "100%");
            $("#provacidad_cont_addus").hide();
            $("#input_iddocumento_encrypt").val(iddocumento_encrypt);

            vistacargando("M","Espere...");
            $.get("/privacidadDocumento/consultar/"+iddocumento_encrypt, function(retorno){
                
                vistacargando();
                
                if(!retorno.error){ //todo bien

                    $("#priv_habilitar").addClass("noactualizar");

                    if(retorno.privado==1){
                        $("#priv_habilitar").iCheck('check');
                        $("#priv_deshabilitar").iCheck('uncheck');
                    }else{
                        $("#priv_deshabilitar").iCheck('check');
                        $("#priv_habilitar").iCheck('uncheck');
                    }

                    $("#priv_habilitar").removeClass("noactualizar");
                    
                    //cargamos el combo de los usuarios
                    $("#privacidad_cmbusuario").html("");
                    $.each(retorno.lista_usuarios, function(index, usuario){
                        $("#privacidad_cmbusuario").append(`<option value="${usuario.idus001_encrypt}">${usuario.name}</option>`);               
                    });
                    $("#privacidad_cmbusuario").trigger("chosen:updated");

                    //cargamos la tabla de los usuarios agregados
                    cargar_tabla_usuarios_asignados(retorno.lista_privacidad);
                    
                    $("#modal_gestion_privacidad").modal("show");
                }else{ //retorno con error
                    alertNotificar(retorno.mensaje, retorno.status);
                }

            }).fail(function(){
                vistacargando();
                alertNotificar("Error al intentar obtener la información, por favor intentelo mas tarde", "error");
            });        

        }

        function cargar_tabla_usuarios_asignados(lista_privacidad){

            $("#tbody_usuarios_permitidos").html("");
            $.each(lista_privacidad, function(index, privacidad_documento){
                $("#tbody_usuarios_permitidos").append(`
                    <tr>
                        <td>${index+1}</td>
                        <td style="vertical-align: middle">${privacidad_documento.us001.name}</td>
                        <th style="vertical-align: middle">${privacidad_documento.fecha_fin}</th>  
                        <td style="display: flex;">
                            <button class="btn btn-danger btn-sm" onclick="quitar_privacidad_documento('${privacidad_documento.idprivacidad_documento_encrypt}')" style="margin-bottom: 0px;">
                                <i class="fa fa-trash"></i> Quitar
                            </button>
                        </td>
                    </tr>
                `);
            });

            if(lista_privacidad.length ==0){
                $("#tbody_usuarios_permitidos").html(`
                    <tr>
                        <td colspan="4">
                            <center>No hay usuarios agregados</center>
                        </td>
                    </tr> 
                `);
            }

        }

        function agregarUsuarioPermitir(){

            //deseleccionar los usuarios
            $("#privacidad_cmbusuario option").prop("selected", false);
            $("#privacidad_cmbusuario").trigger("chosen:updated");

            //reiniciamos la fecha de input
            var fecha = $("#privacidad_fechafin").attr('date-aux');
            $("#privacidad_fechafin").val(fecha);

            $("#btn_agregar_usuario").hide(200);
            $("#provacidad_cont_addus").show(200);
        }

        function cancelarUsuarioPermitir(){
            $("#btn_agregar_usuario").show(200);
            $("#provacidad_cont_addus").hide(200);
        }

        $("#priv_habilitar").on('ifChanged', function(e){

            if($("#priv_habilitar").hasClass('noactualizar')){ return; }

            var isChecked = e.currentTarget.checked;
            var estado = 0;
            if(isChecked == true){ // se selecciona (habilitar)
                estado = 1;   
            }

            iddocumento_encrypt = $("#input_iddocumento_encrypt").val();

            vistacargando("M", "Espere...");
            $.get(`/privacidadDocumento/actualizar/${iddocumento_encrypt}/${estado}`, function(retorno){

                vistacargando();
                alertNotificar(retorno.mensaje, retorno.status);

            }).fail(function(){
                vistacargando();
                alertNotificar("Error al intentar actualizar la provacidad del documento, por favor intentelo mas tarde", "error");
            });

        });

        $("#frm_asignar_usuario").submit(function(e){

            e.preventDefault();
            var FrmData = new FormData(this);
            var ruta = $(this).attr('action');

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            vistacargando('M','Asignando...'); // mostramos la ventana de espera

            $.ajax({
                url: ruta,
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                complete:function(){
                    vistacargando();
                },
                success: function(retorno){
                    
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);
                    if(!retorno.error){ //todo exitoso
                        cargar_tabla_usuarios_asignados(retorno.lista_privacidad);
                        cancelarUsuarioPermitir();
                    }
                    
                },
                error: function(error){
                    alertNotificar("Error al intentar asignar el usuario, por favor intentemo mas tarde","error");
                    vistacargando(); // ocultamos la ventana de espera
                }
            }); 

        });

        function quitar_privacidad_documento(idprivacidad_documento_encrypt){
            
            swal({
                title: "",
                text: "¿Está seguro que desea quitar de la lista el usuario?",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Si, quitar!",
                cancelButtonText: "No, cancela!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if(isConfirm){ // si dice que quiere eliminar
                    
                    vistacargando("M", "Espere...");
                    $.get("/privacidadDocumento/quitar/"+idprivacidad_documento_encrypt, function(retorno){
                        vistacargando();

                        alertNotificar(retorno.mensaje, retorno.status);
                        if(!retorno.error){ //todo exitoso
                            cargar_tabla_usuarios_asignados(retorno.lista_privacidad);                   
                        }

                    }).fail(function(){
                        vistacargando();
                        alertNotificar("Erro al intentar quitar el usuario, por favor intentelo mas tarde", "error");
                    });

                }
                sweetAlert.close();   // ocultamos la ventana de pregunta
            });

        }


        function cargar_estilos_tabla_detalle(){

            $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});         
            var datatable = {
                placeholder: "Ingrese criterio de búsqueda"
            }
    
            $("#table_documentos_detalle").DataTable({
                dom: ""
                +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                +"<rt>"
                +"<'row'<'form-inline'"
                +" <'col-sm-6 col-md-6 col-lg-6'l>"
                +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                pageLength: -1,
                order: [[ 3, "asc" ]],
                "language": datatableLenguaje_detalle(datatable),
            });
        }

    // FUNCION PARA RETORNAR EL LENGUAJE DE LA TABLA DATETABLE
    function datatableLenguaje_detalle(data){
        var search = "Buscar Documento";
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







