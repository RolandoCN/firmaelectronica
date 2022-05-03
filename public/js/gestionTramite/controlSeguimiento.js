
    var lenguajeTabla = {
        "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                    '<option value="5">5</option>'+
                    '<option value="10">10</option>'+
                    '<option value="20">20</option>'+
                    '<option value="30">30</option>'+
                    '<option value="40">40</option>'+
                    '<option value="-1">Todos</option>'+
                    '</select> registros',
        "search": "Buscar:",
        "searchPlaceholder": "Ingrese un criterio de busqueda",
        "zeroRecords": "No se encontraron registros coincidentes",
        "infoEmpty": "No hay registros para mostrar",
        "infoFiltered": " - filtrado de MAX registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        }
    };

    $(document).ready(function(){
        var idtabla = "table_tramites";
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 2, "desc" ]],
            pageLength: 10,
            sInfoFiltered:false,
            "language": lenguajeTabla
        });

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
    });


    //FUNCION PARA CARGAR LOS TIPO DE PROCESO EN FUNCIÓN AL SISTEMA SELECCIONADO
    $('#check_sistema').change(function(e){

        vistacargando("M", "Espere...");
        var sistema = $('#check_sistema').val();
        $("#cmb_tipoTramite").html("");
        $("#cmb_tipoTramite").trigger("chosen:updated");
        if(sistema=='D1'){
            $('#origendiv').hide(200);
        }else if(sistema=='D2'){
            $('#origendiv').show(200);
        }
        $.get('/gestionTramite/obtenerTipoProceso/'+sistema, function(retorno){

            vistacargando();
            var administrador = $("#input_ventana").val();

            $("#cmb_tipoTramite").html(`<option data-id="0" value="${retorno.default}">-- TODOS LOS TIPOS DE TRÁMITE --</option>`);
            var area_aux = "";
            var contenido = "";
            var listaTipoProceso = retorno.listaTipoProceso;
            $.each(listaTipoProceso, function (tp, tipoProceso) { 
                if(administrador==1){
                    if(tipoProceso['area']!=area_aux){                                                                                                                
                        if(area_aux!=""){ contenido=contenido+("</optgroup>"); } // cerramos el anterios grupo
                        area_aux=tipoProceso['area']; 
                        contenido=contenido+("<optgroup label='"+tipoProceso['area']+"'>"); //abrimos el nuevo grupo
                    }
                    contenido=contenido+("<option class='option' value='"+tipoProceso['codigotipoproceso_encrypt']+"'>"+tipoProceso['descripcion']+"</option>"); 

                    if((tp+1)==listaTipoProceso.length){ contenido=contenido+("</optgroup>"); } //cerramos el ultimo grupo de todos                                                                
                }else{
                    contenido=contenido+("<option class='option' value='"+tipoProceso['codigotipoproceso_encrypt']+"'>"+tipoProceso['descripcion']+"</option>"); 
                }
            });
            $("#cmb_tipoTramite").append(contenido);
            $("#cmb_tipoTramite").trigger("chosen:updated");

        }).fail(function(){
            vistacargando();
        });

    })

    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha").show(200);
    });

    $('#check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea
        $("#content_filtrar_fecha").hide(200);
    });


    //FUNCION PARA FILTRAR LOS TRÁMITES
    function filtrarTramites(){

        var check_filtrar_fecha = false;
        if($("#check_filtrar_fecha").is(':checked')){
            check_filtrar_fecha = true;
        }

        var FrmData = {
            cmb_tipoTramite: $("#cmb_tipoTramite").val(),
            check_filtrar_fecha: check_filtrar_fecha,
            fechaInicio: $("#fechaInicio").val(),
            fechaFin: $("#fechaFin").val(),
            estado_tramite: $(".estado_tramite:checked").val(),
            check_sistema: $("#check_sistema").val(),
            origen_sistema: $(".origen_cert:checked").val()
        }

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        vistacargando("M", "Espere...");

        $.ajax({
			url: '/gestionTramite/filtrarTramite',
			method: "POST",
            data: FrmData,
            type: "json",
			complete: function (request)
			{
                vistacargando();
                var retorno = request.responseJSON;
                console.clear(); console.log(retorno);

                if(retorno.error == true){
                    mostrarMensaje(retorno.mensaje,retorno.status,'mensaje_info');
                }else{

                    //cargamos le resumen de la búsqueda
                    $("#r_totales").html(retorno.lista_tramites.length);
                    $("#r_pendientes").html(retorno.pendientes);
                    $("#r_finalizados").html(retorno.finalizados);
                    $("#content_resultado").show(); console.log();

                    var idtabla = "table_tramites";
                    $(`#${idtabla}`).DataTable({
                        dom: ""
                        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                        +"<rt>"
                        +"<'row'<'form-inline'"
                        +" <'col-sm-6 col-md-6 col-lg-6'l>"
                        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                        "destroy":true,
                        order: [[ 1, "desc" ]],
                        pageLength: 5,
                        sInfoFiltered:false,
                        "language": lenguajeTabla,
                        data: retorno.lista_tramites,
                        columnDefs: [
                            {  className: "col_sm", targets: 0 },
                            {  className: "sorting", targets: 1 },
                            {  className: "sorting col_sm", targets: 2 },
                            {  className: "sorting col_sm", targets: 3 }
                        ],
                        columns:[
                            {data: "tramite.fechaCreacion" },
                            {data: "tramite.index" },
                            {data: "tramite", render : function (tramite, type, row){
                                // para que busque por todos estos criterios
                                return `${tramite.cedula} ${tramite.proceso} ${tramite.asunto} ${tramite.observacion} ${tramite.descripcionTramite} ${retorno['listaAreaResp'][tramite.codigoTramite]}`
                            }},
                            {data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, tramite, index ){

                            //columna de fecha
                                $('td', row).eq(0).addClass('center_vertical user_selec');
                                $('td', row).eq(0).html(`
                                    <span class="label label-warning" style="padding: 5px 7px;">${tramite['tramite']['fechaCreacion'].substr(0,10)}</span>
                                `);
                            var funcionario='';
                            //columna informacion general del trámite
                                var area_responsable = retorno['listaAreaResp'][tramite['tramite']['codigoTramite']];
                                if(area_responsable==null) {area_responsable=""; }
                                if(tramite['tramite']['origen_tramite']!=null){
                                    var origen_sistema=`<b><i class="fa fa-desktop"></i> Sistema:</b><b style="color:orange; font-weight:bold"> ${tramite['tramite']['origen_tramite']}</b><br>`;
                                    if(tramite['tramite']['usuario_genera']!=null){
                                         funcionario=`<b><i class="fa fa-user"></i> Funcionario:</b> ${tramite['tramite']['usuario_genera']}<br>`;
                                    }else{
                                        funcionario=`<b><i class="fa fa-user"></i> Funcionario:</b> ------ <br>`;
                                    }
                                }else{
                                    var origen_sistema='';
                                }
                                $('td', row).eq(1).addClass('center_vertical td_info_tramite');
                                $('td', row).eq(1).html(`
                                    <div style="min-width:300px;"></div>
                                    <!--<span class="cedula_contrib"><b><i class="fa fa-user"></i> Contribuyente:</b> ${tramite['tramite']['cedula']}<br></span>-->
                                    <b><i class="fa fa-tags"></i> Código:</b> ${tramite['tramite']['proceso']}<br>
                                    <b><i class="fa fa-exclamation-circle"></i> Asunto:</b> ${tramite['tramite']['asunto']}<br>
                                    ${origen_sistema}
                                    ${funcionario}
                                    <b><i class="fa fa-file-text"></i> Tipo Trámite:</b> <span style="color: #337ab7; font-weight: 800;">${tramite['tramite']['descripcionTramite']}</span><br>
                                    <b><i class="fa fa-users"></i> Área Responsable:</b> ${area_responsable} <br>
                                    <b><i class="fa fa-eye"></i> Observación:</b> ${tramite['tramite']['observacion']}
                                `);

                            //columna estado del trámite
                                var estado_tramite = "EN PROCESO";
                                var color_dias = "danger";
                                var mensaje_dias = "Han transcurrido";
                                if(tramite['tramite']['finalizado']==1){
                                    estado_tramite = "FINALIZADO";
                                    color_dias="success";
                                    mensaje_dias="Tardó un total de"
                                }
                                $('td', row).eq(2).addClass('center_vertical user_selec');
                                $('td', row).eq(2).html(`
                                    <b style="text-align: center; font-weight: 800; display: block;">${estado_tramite}</b>
                                    <span class="label2 label2-${color_dias}">${mensaje_dias} <br> ${tramite['dias_trans']} días</span>
                                `);

                            //columna de botones de acción
                                $('td', row).eq(3).addClass('center_vertical');
                                $('td', row).eq(3).html(`
                                    <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleTramite('${tramite['tramite']['proceso']}', '${tramite['tramite']['cedula']}', '${tramite['tramite']['idproceso']}', this,'${retorno.sistema}')" data-toggle="tooltip" data-placement="left" title="" data-original-title="Ver información del ciudadno y el historial de recorriodo de departamentos del trámite">
                                        <i class="fa fa-exclamation-circle"></i> Ver detalle
                                    </button>
                                    <button type="button" onclick="imprimirCodigo('${tramite['tramite']['proceso']}','${tramite['tramite']['cedula']}', this)" class="btn btn-success btn-sm btn-block" data-toggle="tooltip" data-placement="left" title="" data-original-title="Imprimir el código de recepción de documentos">
                                        <i class="fa fa-download"></i> Imprimir
                                    </button>
                                    <span class="obs_tramite" style="display:none"> ${tramite['tramite']['observacion']} </span>
                                `);
                                $('td', row).eq(3).find("button").tooltip();

                        }
                    });

                    // para posicionar el input del filtro
                    $(`#${idtabla}_filter`).css('float', 'left');
                    $(`#${idtabla}_filter`).children('label').css('width', '100%');
                    $(`#${idtabla}_filter`).parent().css('padding-left','0');
                    $(`#${idtabla}_wrapper`).css('margin-top','10px');
                    $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
                    //buscamos las columnas que deceamos que sean las mas angostas
                    $(`#${idtabla}`).find('.col_sm').css('width','10px');
                    // $(`#${idtabla}`).find('.col_lg').css('width','300px');

                }

			},error: function(){
                mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                vistacargando();
            }
	    });

    }

    //IMPRIME UN PDF CON UN DODIGO DE BARRA (se hace asi porque en las etiquetas a no targan lo tooltip text)
    function imprimirCodigo(codigoRastreo, cedula, btn){
        $(btn).tooltip('hide');
        window.location.href=`/gestionIniciarTramite/imprimir/${codigoRastreo}/${cedula}`;
    }


    //FUNCIÓN PARA CARGAR LOS DETALLES DE UN TRÁMITE
    function cargarDetalleTramite(codigoTramite, cedula, idproceso_encrypt, btn, sistema){

        $(btn).tooltip('hide');
        // var observacion = $(btn).siblings('.obs_tramite').html();
        $('#a_historial').click();

        //reiniciamos los datos del contribuyente

        vistacargando("M", "Espere..");

        $.get(`/gestionTramite/getDetalleTramite/${codigoTramite}/${cedula}/${idproceso_encrypt}/${sistema}`, function(retorno){
            
            vistacargando();
            if(retorno.error==true){
                mostrarMensaje(retorno['mensaje'],retorno['status'],'mensaje_info');
            }else{
                //cargamos mos la informacion del contribuyente

                    $("#informacion_tramite").html($(btn).parent().siblings('.td_info_tramite').html());
                    // $("#informacion_tramite").find('.cedula_contrib').remove();
                    // $("#info_observacion").html(observacion);

                    $("#codigo_tramite").html('DETALLE DEL TRÁMITE || '+codigoTramite);
                    if(retorno['contribuyente']!=null){
                        $("#info_nombre").html(retorno['contribuyente']['name']);                         
                        $("#info_cedula").html(retorno['contribuyente']['cedula']);
                        $("#info_direccion").html(retorno['contribuyente']['direccion']);
                        $("#info_email").html(retorno['contribuyente']['email']);
                        $("#info_celular").html(retorno['contribuyente']['celular']);
                        $("#info_telefono").html(retorno['contribuyente']['telefono']);
                    }else if(retorno['datos_dinardap'].length>0){
                        $("#info_cont_noregist").html('<b><i class="fa fa-exclamation-triangle"></i> Nota: <span> El contribuyente no está registrado en el sistema de <i class="fa fa-angle-double-left"></i> Servicios en línea <i class="fa fa-angle-double-right"></i></b></span><br>');
                        $("#info_nombre").html(retorno['datos_dinardap'][9]["valor"]);
                        $("#info_cedula").html(retorno['datos_dinardap'][0]["valor"]);
                        $("#info_direccion").html(" --");
                        $("#info_email").html(" --");
                        $("#info_celular").html(" --");
                        $("#info_telefono").html(" --");
                    }else if(retorno['datos_razonsocial'].length>0){
                        $("#info_cont_noregist").html('<b><i class="fa fa-exclamation-triangle"></i> Nota: <span> El contribuyente no está registrado en el sistema de <i class="fa fa-angle-double-left"></i> Servicios en línea <i class="fa fa-angle-double-right"></i></b></span><br>');
                        $("#info_nombre").html(retorno['datos_razonsocial'][1]["valor"]);
                        $("#info_cedula").html(retorno['datos_razonsocial'][0]["valor"]);
                        $("#info_direccion").html(" --");
                        $("#info_email").html(" --");
                        $("#info_celular").html(" --");
                        $("#info_telefono").html(" --");
                    }


                //cargamos el historial del trámite
                    cadena ="";
                    msg=retorno['detalle_tramite'];
                    $("#datosTabla").html("");

                    for( i = 0; i < msg.length; i++){

                        if(retorno.sistema=="D2"){
                            if(msg[i].estado=='T' || msg[i].estado == 'A' || msg[i].estado == 'F' ){
                            cadena = cadena + "<tr class='success'>";
                            }else{
                            cadena = cadena + "<tr class='danger'>";
                            }                            
                        }else{
                            if(msg[i].estado == 'ATENDIDO' || msg[i].estado == 'FINALIZADO' ){
                            cadena = cadena + "<tr class='success'>";
                            }else{
                            cadena = cadena + "<tr class='danger'>";
                            }
                        }

                        if (msg[i].fechaApr !== null && msg[i].fechaApr !== undefined) {
                        cadena = cadena + "<td>"+msg[i].fechaApr+"</td>";
                        }else{
                        cadena = cadena + "<td><center> - </center></td>";
                        }

                        if (msg[i].fechaAtiende !== null && msg[i].fechaAtiende !== undefined) {
                        cadena = cadena + "<td>"+msg[i].fechaAtiende+"</td>";
                        }else{
                        cadena = cadena + "<td> PENDIENTE </td>";
                        }

                        destino = "PENDIENTE";
                        if(msg[i].destino!=null){ destino = msg[i].destino; }
                        cadena = cadena + "<td>"+msg[i].origen+"</td>";
                        cadena = cadena + "<td>"+destino+"</td>";
                        cadena = cadena + "<td>"+msg[i].asunto+"</td>";

                        if (msg[i].final !== null && msg[i].final !== undefined) {
                        cadena = cadena + "<td>"+msg[i].final+"</td>";
                        }else{
                        cadena = cadena + "<td><center> - </center></td>";
                        }

                        if(retorno.sistema == "D2"){
                            var aux_estado = " -- "
                            switch (msg[i].estado) {
                                case "T": aux_estado = "ATENDIDO Y ENVIADO"; break;
                                case "A": aux_estado = "ATENDIDO"; break; 
                                case "F": aux_estado = "FINALIZADO"; break;
                            }
                            cadena = cadena + "<td>"+aux_estado+"</td>";
                        }else{
                            cadena = cadena + "<td>"+msg[i].estado+"</td>";
                        }
                        cadena = cadena  + "</tr>";

                    }

                    //CARGAMOS LOS DOCUMENTOS ADJUNTOS SI ES QUE EXISTEN
                    $("#tbody_documentos_adjuntos").html(`<tr><td colspan="6"> <center>No hay documentos </center> </td></tr>`);
                    if(retorno.documentos_adjuntos){                       
                        if(retorno.documentos_adjuntos.length>0){
                            $("#tbody_documentos_adjuntos").html("");
                            $.each(retorno.documentos_adjuntos, function(index, documento_adunto){                              
                                
                                console.log(retorno.sistema);
                                if(retorno.sistema=="D2"){

                                    var botones = "";

                                    botones = (`
                                        <a target="_blank" href="/buscarDocumentov2/${documento_adunto.rutaDocumento}.${documento_adunto.extension}" style="margin-bottom: 0px;" class="btn btn-info btn-sm"><i class="fa fa-eye"></i> Ver </a>
                                        <a target="_blank" href="/buscarDocumentoDownloadv2/${documento_adunto.rutaDocumento}.${documento_adunto.extension}" style="margin-bottom: 0px;" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Descargar</a>
                                    `);
                                    

                                    $("#tbody_documentos_adjuntos").append(`
                                        <tr>
                                            <td style="vertical-align: middle;">${documento_adunto.tipo_documento.descripcion}</td>
                                            <td style="vertical-align: middle;">${documento_adunto.descripcion}</td>
                                            <td style="vertical-align: middle;">${documento_adunto.rutaDocumento}.${documento_adunto.extension}</td>
                                            <td style="vertical-align: middle; display: flex;">
                                                ${botones}
                                            </td>
                                        </tr>
                                    `);

                                }else{

                                    var botones = "";
                                    if(documento_adunto.externo=="SI" || documento_adunto.externo=="Si" || documento_adunto.externo=="si"){ //documento subido desde enlinea o intranet
                                        botones = (`
                                            <a target="_blank" href="/buscarDocumento/diskTramiteCiudadano/${documento_adunto.rutaDocumento}" style="margin-bottom: 0px;" class="btn btn-info btn-sm"><i class="fa fa-eye"></i> Ver </a>
                                            <a target="_blank" href="/buscarDocumentoDownload/diskTramiteCiudadano/${documento_adunto.rutaDocumento}" style="margin-bottom: 0px;" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Descargar</a>                                
                                        `);
                                    }else{ //documento subido desde documental producción
                                        botones = (`
                                            <a target="_blank" href="/DocumentalBuscar/${idproceso_encrypt}/${documento_adunto.rutaDocumento}" style="margin-bottom: 0px;" class="btn btn-info btn-sm"><i class="fa fa-eye"></i> Ver </a>
                                            <a target="_blank" href="/DocumentalBuscarDownload/${idproceso_encrypt}/${documento_adunto.rutaDocumento}" style="margin-bottom: 0px;" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Descargar</a>                                
                                        `);
                                    }

                                    $("#tbody_documentos_adjuntos").append(`
                                        <tr>
                                            <td style="vertical-align: middle;">${documento_adunto.tipo}</td>
                                            <td style="vertical-align: middle;">${documento_adunto.descDocumento}</td>
                                            <td style="vertical-align: middle;">${documento_adunto.rutaDocumento}</td>
                                            <td style="vertical-align: middle; display: flex;">
                                                ${botones}
                                            </td>
                                        </tr>
                                    `);

                                }

                            });
                        }
                    }

                    //CARGAMOS LOS DOCUMENTOS SUBIDOS SI EL TRÁMITE ESTA FINALIZADO
                        $("#tbody_documentos").html(`<tr><td colspan="6"> <center>No hay documentos ingresados </center> </td></tr>`);
                        $("#alerta_sindocumentos").show();

                        if(retorno.tramite_ciudadano != null){
                            if(retorno.tramite_ciudadano.carga_documentos.length>0){

                            $("#tbody_documentos").html('');
                            $("#alerta_sindocumentos").hide();

                            $.each(retorno.tramite_ciudadano.carga_documentos, function(cd, documento){

                                var vigencia = `<span class="label label-danger estado_vigencia"><i class="fa fa-check-circle"></i> No Vigente</span>`;
                                var fecha_vigencia = "--";
                                if(documento.vigencia =="Si" || documento.vigencia=="SI" || documento.vigencia=="si"){
                                    vigencia = `<span class="label label-success estado_vigencia"><i class="fa fa-check-circle"></i> Vigente</span>`;
                                    fecha_vigencia = documento.fecha_vigencia;
                                }

                                $("#tbody_documentos").append(`
                                <tr>
                                    <td style="vertical-align: middle;">${documento.tipodocumentotramite.descripcion}</td>
                                    <td style="vertical-align: middle;">${documento.descripcion}</td>
                                    <td style="vertical-align: middle;">${documento.fecha_carga}</td>
                                    <td style="vertical-align: middle;"><center>${vigencia}</center></td>
                                    <td style="vertical-align: middle;">${fecha_vigencia}</td>
                                    <td style="vertical-align: middle; display: flex;">
                                        <a target="_blank" href="/buscarDocumento/diskDocumentosTramitesFinalizados/${documento.documento}" style="margin-bottom: 0px;" class="btn btn-info btn-sm"><i class="fa fa-eye"></i> Ver </a>
                                        <a target="_blank" href="/buscarDocumentoDownload/diskDocumentosTramitesFinalizados/${documento.documento}" style="margin-bottom: 0px;" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Descargar</a>
                                    </td>
                                </tr>
                                `);
                            });

                            }
                        }

                    //---------------------------------------------------------------


                    $("#datosTabla").html(cadena);

                    if(msg.length==0){
                        $("#datosTabla").html(`<tr><td colspan="7"><center>Sin resultados</center></td></tr>`);
                    }

                //mostramos la vista de detalle de trámite
                    $("#content_contSeg").hide(300);
                    $("#content_historial").show(300);
            }

        }).fail(function(){
            mostrarMensaje('Error al obtener el detalle del trámite, Inténtelo más tarde','danger','mensaje_info');
            vistacargando();
        });
    }

    //FUNCIÓN PARA SALIR DEL A VISTA DE DETALLE TRÁMITE
    function salirDetalleTramite(){
        $("#content_historial").hide(200);
        $("#content_contSeg").show(200);
        $(".info_cont").html(" --");
        $("#info_cont_noregist").html("");
        $("#datosTabla").html(`<tr><td colspan="7"><center>Sin resultados</center></td></tr>`);
    }


    //FUNCION PARA AGREGAR UN MENSAJE EN LA PANTALLA
    function mostrarMensaje(mensaje, status, idelement){
        var contenidoMensaje=`
            <div style="font-weight: 700;" class="alert alert-${status} alert-dismissible alert_sm" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>MENSAJE! </strong> <span> ${mensaje}</span>
            </div>
        `;
        $("#"+idelement).html(contenidoMensaje);
        $("#"+idelement).show(500);

        setTimeout(() => {
            $("#"+idelement).hide(500);
        }, 8000);
    }


    // función que se desencade al cambiar un combo de los tipo de trámite
    function seleccionarCombo(cmb){
        var option_sel= $(cmb).find('option:selected');
        var valor_sel=$(option_sel).attr('data-id');
        if(valor_sel==0){
            $(option_sel).prop('selected', false);
            $(cmb).find('.option').prop('selected', true);
            $(cmb).trigger("chosen:updated");
        }
    }