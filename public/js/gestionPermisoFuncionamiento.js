
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
        var idtabla = "table_solicidudes";
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 2, "desc" ]],
            pageLength: 5,
            sInfoFiltered:false,
            "language": lenguajeTabla
        });

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
    });


    // FUNCIÓN QUE MARCA COMO LEIDO UNA SOLICITUD

    function marcar_como_revisada(idemision_certificado, btn){
        vistacargando("M", "Espere...");
        $(btn).attr('disabled', true);
        $(btn).tooltip("hide");

        $.get('/permFuncionamieniento/marcarRevisado/'+idemision_certificado, function(retorno){
            console.clear(); console.log(retorno);
            vistacargando();
            $(btn).attr('disabled', false);
            mostrarMensaje(retorno.mensaje, retorno.status, "mensajeAlerta");

            if(retorno.error){
                return;
            }else{

                var idtabla = "table_solicidudes";
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
                    "language": lenguajeTabla,
                    data: retorno.listasolicutudes,
                    columnDefs: [
                        {  className: "col_sm", targets: 0 },
                        {  className: "sorting", targets: 1 },
                        {  className: "sorting", targets: 2 },
                        {  className: "sorting col_sm", targets: 3 }
                    ],
                    columns:[
                        {data: "codRastreo" },
                        {data: "codRastreo" },
                        {data: "codRastreo" },
                        {data: "codRastreo" }
                    ],
                    "rowCallback": function( row, em_cer, index ){
                        
                        //columna de fecha
                        $('td', row).eq(0).addClass('center_vertical');
                        $('td', row).eq(0).html(`<span class="label label-warning">${em_cer['fechaSolicitud'].substr(0,10)} <br> ${em_cer['fechaSolicitud'].substr(11,18)}</span>`);

                        //columna info predio
                        $('td', row).eq(1).addClass('center_vertical');
                        $('td', row).eq(1).html(`
                            <b><i class="fa fa-credit-card"></i> Cédula:</b> ${em_cer['us001']['cedula']}<br>
                            <b><i class="fa fa-user"></i> Propietario:</b> ${em_cer['us001']['name']}<br>
                            <b><i class="fa fa-phone-square"></i> Teléfono:</b> ${em_cer['us001']['telefono']}<br>
                            <b><i class="fa fa-envelope"></i> E-mail:</b> ${em_cer['us001']['email']}<br>
                            <b><i class="fa fa-key"></i> Clave:</b> ${em_cer['establecimientoresponsable']['establecimiento']['clave_catastral']}<br>
                            <b><i class="fa fa-map-marker"></i> Dirección:</b> ${em_cer['establecimientoresponsable']['establecimiento']['direccion']}<br>
                            <b><i class="fa fa-shopping-cart"></i> Nombre comercial:</b>
                            <span class="badge badge-warning">
                                ${em_cer['establecimientoresponsable']['nombreComercial']}
                            </span>
                        `);

                        //columna info solitucud
                        var listaActividades = "";
                        $.each(em_cer['establecimientoresponsable']['establecimiento_actividades'],function(index, esta_activ){
                            listaActividades = listaActividades+`<p style="margin: 0px 0px 2px 8px;"><span style="color:#0d6dbf;" class="fa fa-arrow-right"></span> ${esta_activ['actividades']['Descripcion']}</p> `;
                        }); 
                        if(em_cer['establecimientoresponsable']['establecimiento_actividades']['length']==0){
                            listaActividades =  `<p style="margin: 0px 0px 2px 8px;"><span style="color:#dc2127;" class="fa fa-exclamation-triangle"></span> Sin actividades </p>`;
                        }      
                        
                        var costo = 0;
                        if(em_cer['emision']!=null){
                            costo = em_cer['emision']['costo'];
                        }
                        if(costo==null || costo == ""){ costo = 0; }

                        $('td', row).eq(2).addClass('center_vertical');
                        $('td', row).eq(2).html(`
                            <b>Solicitud de:</b> ${em_cer['lista_certificados']['descripcion']}<br>
                            <b>Valor de pago:</b> ${'$'+costo}<br>
                            <b>Actividades a realizar</b>
                            ${listaActividades}
                        `);

                        if(em_cer['turno'].length>0){
                            $('td', row).eq(2).append(`
                                <b>Datos de la inspección</b>
                                <p style="margin: 0px 0px 2px 8px;"><b>Fecha:</b> ${em_cer['turno'][0]['agenda']['fechaAgenda']}</p>
                                <p style="margin: 0px 0px 2px 8px;"><b>Hora:</b> ${em_cer['turno'][0]['horaInicio']+' - '+em_cer['turno'][0]['horaFin']}</p>
                                <p style="margin: 0px 0px 2px 8px;"><b>Técnico asignado:</b> ${em_cer['turno'][0]['agenda']['inspector']['usuarios']['name']}</p>
                            `);

                            //calculamos los dias transcurrios de la revision -----------------------

                                var fecha_agenda = em_cer['turno'][0]['agenda']['fechaAgenda'];

                                Date.prototype.yyyymmdd = function() {
                                    var yyyy = this.getFullYear().toString();
                                    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
                                    var dd  = this.getDate().toString();
                                    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
                                };                                
                                var fecha_actual = new Date();
                                fecha_actual = fecha_actual.yyyymmdd();                            

                                var mensaje = "";
                                if(Date.parse(fecha_actual) <= Date.parse(fecha_agenda)){ //ahún no a pasado la revisión
                                    var date_1 = new Date(fecha_actual);
                                    var date_2 = new Date(fecha_agenda);

                                    var day_as_milliseconds = 86400000;
                                    var diff_in_millisenconds = date_2 - date_1;
                                    var dias = diff_in_millisenconds / day_as_milliseconds;
                            
                                    if(dias == 0){ mensaje = "Hoy es el día de inspección"; }
                                    else if(dias==1){ mensaje = `Falta ${dias} día para la inspección`; }
                                    else{ mensaje = `Faltan ${dias} días para la inspección`; }
                                    

                                }else{ //ya paso la fecha de la revisión
                                    var date_1 = new Date(fecha_agenda);
                                    var date_2 = new Date(fecha_actual);

                                    var day_as_milliseconds = 86400000;
                                    var diff_in_millisenconds = date_2 - date_1;
                                    var dias = diff_in_millisenconds / day_as_milliseconds;

                                    if(dias == 0){ mensaje = "Hoy es el día de inspección"; }
                                    else if(dias==1){ mensaje = `Ha transcurrido ${dias} día`; }
                                    else{ mensaje = `Han transcurrido ${dias} días`; }

                                }

                                $('td', row).eq(2).append(`<p class="badge bg-blue" style="margin: 0px 0px 2px 8px;">${mensaje}</p>`);

                            //--------------------------------------------------------------------------

                        }

                        //columna boton
                        $('td', row).eq(3).addClass('center_vertical');
                        $('td', row).eq(3).html(`
                            <button class="btn btn-success btn-block" onclick="marcar_como_revisada('${em_cer['id_encrypt']}', this)"  data-toggle="tooltip" data-placement="left" title="La solicitud desaparecerá de este listado (marcar como leído)">
                                <i class="fa fa-thumbs-up"></i> Revisado
                            </button>
                            <button class="btn btn-info btn-sm btn-block" onclick="ver_actividad('${em_cer['id_encrypt']}', this)" data-toggle="tooltip" data-placement="left" title="Ver información relacionada con la actividad comercial del contribuyente"> 
                                <i class="fa fa-exclamation-circle"></i> Información
                            </button>
                        `);

                        $('td', row).eq(3).find("button").tooltip();

                    }                                
                });                
            }


            // para posicionar el input del filtro
            $(`#${idtabla}_filter`).css('float', 'left');
            $(`#${idtabla}_filter`).children('label').css('width', '100%');
            $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
             //buscamos las columnas que deceamos que sean las mas angostas
            $(`#${idtabla}`).find('.col_sm').css('width','10px');


        }).fail(function(){
            vistacargando();
            $(btn).attr('disabled', false);
            mostrarMensaje("Error al realizar la petición", "danger", "mensajeAlerta");
        });

    }


    // FUNCIÓN PARA VISUALIZAR LA ACTIVIDAD COMERCIAL DE UNA PERSONA
    function ver_actividad(idemision_certificado, btn){
        $(btn).tooltip("hide");
        $("#modal_actividad_comercial").modal("show");

        $("#panel_loanding").show();
        $("#modal_content_informacion").hide();
        $(".actividad_info").html("");
        $("#panel_error").hide();
        $("#panel_notiene_activdad").hide();

        $.get('/permFuncionamieniento/activida_economica/'+idemision_certificado, function(retorno){

            console.clear(); console.log(retorno);

            if(retorno.error){
                $("#panel_loanding").hide();
                $("#modal_content_informacion").hide();
                $("#panel_error").show(200);
            }else{ // todo bien

                if(!retorno.tiene_actividad){
                    $("#panel_loanding").hide();
                    $("#panel_notiene_activdad").show(200);
                    return;
                }

                //cargamos toda la información del request

                $("#razonSocialRuc").html(retorno['datos_razon_social'][0]['valor']);
                $("#razonSocialNombre").html(retorno['datos_razon_social'][1]['valor']);

                $("#activEstablec").html(retorno['activ_com_actividad'][1]['valor']);
                $("#actEcoPrin").html(retorno['activ_com_actividad'][0]['valor']);
                var repre_legal = retorno['activ_com_actividad'][3]['valor'];
                if(repre_legal == ""){ repre_legal = "NO DISPONIBLE"; }
                $("#nombreRepreLegal").html(repre_legal);

                $("#estadoContribuyente").html(retorno['activ_com_datos'][0]['valor']);
                $("#fechaActualizacion").html(retorno['activ_com_datos'][3]['valor']);

                var li_actividades = "";
                $.each(retorno['activ_com_actividades'], function(index, item_actividad){
                    li_actividades=li_actividades+`<li>${item_actividad}</li>`;
                });
                $("#ul_actividades_adicionales").html(li_actividades);

                $("#panel_loanding").hide();
                $("#modal_content_informacion").show(200);

            }



        }).fail(function(){
            $("#panel_loanding").hide();
            $("#modal_content_informacion").hide();
            $("#panel_error").show(200);
        });

    }



    function mostrarMensaje(mensaje, status, idelement){
        var contenidoMensaje=`
            <div style="font-weight: 700;" class="alert alert-${status} alert-dismissible alert_sm" role="alert">
                <strong>MENSAJE! </strong> <span> ${mensaje}</span>
            </div>
        `;
        $("#"+idelement).html(contenidoMensaje);
        $("#"+idelement).show(200);
        
        setTimeout(() => {
            $("#"+idelement).hide(200);
        }, 8000);
    }

