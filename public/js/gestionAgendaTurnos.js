

    // funcion para abrir la modal de turno por el id de turno
    function abrirTurnoPorId(idturno){
 
        $("#calendario").find(".turno_"+idturno).click();
    }
    
    //función para cargar el calendario por el departamentos seleccionado
    $("#cmb_select_departamento").change(function(e){
        var idinspector = $("#cmb_select_departamento").val();
        vistacargando("M","Espere..."); // mostramos la ventana de carga
        $.get("/gestionAgenda/agenda/"+idinspector, function (request){
            console.log(request);
            cargarCalendarioAgenda(request.resultado, "refresh");
            vistacargando(); // ocultamos la ventana de carga
        }).fail(function(error){
            vistacargando(); // ocultamos la ventana de carga
        });
    });


    // funcion para obtener el titulo o el color de un evento para el calendario
    function obtenerTituloColor(estado, tipo){
        title = ""; // para almacenar el titulo del evento
        color = ""; // para almacenar el color del evento

        switch(estado) {
            case "A":
                title = "ASIGNADO"; color = "#3a87ad"; break; // azul tipo Info
            case "RA":
                title = "REASIGNADO"; color = "#005cbf"; break;   
            case "RP":
                title = "REPROGRAMADO"; color = "#005cbf"; break;               
            case "L":
                title = "LIBRE"; color = "#d39e00"; break;
            case "AT":
                title = "ATENDIDO"; color = "#28a745";  break;
            case "D":
                title = "DISPONIBLE"; color = "#d39e00"; break;
        }

        switch(tipo) {
        case "T":
            return title; break;               
        case "C":
            return color; break;               
        }
    }


    
    // esta función recive la estructura de una agenda con sus respectivos turnos
    // la funcion carga de cero la agenda, o la actualiza
    function cargarCalendarioAgenda(data,action){
        var eventosArray = []; // arreglo para almacenar todos y cada uno de los eventos  para cargar en el calendario

        $.each(data, function(a, agenda){
            $.each(agenda.turno, function(t, turno) {
                eventosArray.push(
                    {
                        id:turno.idturno,
                        title: `[${agenda.inspector.departamento.abreviacion}] `+obtenerTituloColor(`${turno.estado}`,'T'),
                        start: `${agenda.fechaAgenda} ${turno.horaInicio}`,
                        end: `${agenda.fechaAgenda} ${turno.horaFin}`,
                        color: obtenerTituloColor(`${turno.estado}`,'C'),
                        editable: false,
                        className:"turno_"+turno.idturno
                    }
                );
            });
        });

        switch (action) {
            case "refresh": // en este caso solo se recarga el calendario
                $('#calendario').fullCalendar('removeEvents'); // limpiamos todos los eventos asignados
                $('#calendario').fullCalendar('addEventSource', eventosArray); // agregamos los nuevos eventos
                $('#calendario').fullCalendar('refetchEvents'); // refrescamos el calendario
                break;
        
            default: // por defecto se carga desde cero el calendario
                $('#calendario').fullCalendar({
                    header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay,listMonth'
                    },
                    defaultView:'agendaWeek',
                    locale: 'es',
                    events: eventosArray,
                    eventClick:function(calEvent, jsEvent, view){
                        // evento al dar click en un evento registrado
                        clickTarea(calEvent, jsEvent, view);
                    },dayClick: function(date, jsEvent, view) {
                    // evento al dar click sobre un dia sin eventos
                    console.log(date); // esto si que funciona xd
                    },
                    eventLimit: true,
                    editable: true,
                    selectable: true,
                    selectMirror: true,
                    
                });
            break;
        }

    }



    // funcion que se ejecuta al dar click en un turno
    function clickTarea(calEvent, jsEvent, view){
        $(`#vista_doc`).hide(200);
        $(`#archivo_personal`).val('');
        var idturno = calEvent.id; // obtenemos el id del turno seleccionado
        $("#input_idturno_select").val(idturno); // asignamos a una etiqueta el id del turno seleccionado

        // reiniciamos los componentes de la modal --------
        $("#atender_obsevacion").val("");
        $("#div_atender_nuevoTurno").hide();
        $(".optEstAtender").prop('selected',false);
        
        // DATOS DEL TURNO --------------------------
            $("#detalle_turno").hide();
            $("#p_detalle_turno").html("");
            $("#datos_persona").hide();
            $("#p_nombre_persona").html("");
            $("#p_email_persona").html("");
            $("#p_celular_persona").html("");
            $("#contet_masdetalle").hide();
        // ------------------------------------------

        $("#cmb_estado_atencion").trigger("chosen:updated"); // actualizamos el combo

        $("#reprogram_obsevacion").val("");
        $("#content_cmb_reprogram_inspector").hide();

        $("#reasig_obsevacion").val("");   
        $("#check_reasignar").iCheck('uncheck');

        $("#mensajeEnModal").hide();
        $("#atender-tab").click();
        
        //titulo de la modal
            $("#info_title").html(" "+calEvent.title);
            $("#info_date").html(" "+calEvent.start._i+" -- "+calEvent.end._i);
        //-------------------------------------------------

        $("#asignar_detalle").val(""); // limpiamos el text area de detalle de turno disponible

        vistacargando("M","Espere...");
        $.get(`/gestionAgenda/agenda/${idturno}/edit`, function (request){
           
            $("#cmd_emision_sinagendar").html("<option></option>"); //limpiamos el combo de emisiones no agendas
            $("#content_info_emision_sinagendar").html(""); // limpiamos toda la informacion de dichas agendas

            console.log(request);
            $("#li_atender").show();
            if(!request.error){
                if(request.resultado.ocultar_atender==true){
                    $("#li_atender").hide();
                }
            }

            if(request.resultado.turno.estado == "D"){
                $("#content_asigTurno").show();// mostramos el frm de agregar turno en turno disponible
                $("#content_RepReasAten").hide(); // ocultamos el frm de reprogramar reasignar y atender turno
                
                //cargamos el combo de emisiones no agendadas (solo si existen alguna)
                $("#content_cmd_emision_sinagendar").hide();
                if(request.resultado.emision_pendiente.length>0){
                    $("#content_check_emision_sinagendar").show();
                    $("#content_check_emision_sinagendar").iCheck('uncheck');
                    $.each(request.resultado.emision_pendiente, function(index, em_cer){
                        $("#cmd_emision_sinagendar").append(`
                            <optgroup label="Solicitud de ${em_cer.lista_certificados.descripcion} - Fecha: ${em_cer.fechaSolicitud}">
                                <option data-id="${em_cer.id}" value="${em_cer.id_encrypt}">Cédula: ${em_cer.us001.cedula} - Nombre: ${em_cer.us001.name}</option>
                            <optgroup>
                        `);
                        //cargamos la información de las emisiones
                        var lista_actividades = "";
                        $.each(em_cer.establecimientoresponsable.establecimiento_actividades, function(index, estab_actv){
                            lista_actividades+=`<li>${estab_actv.actividades.Descripcion}</li>`;
                        });

                        $("#content_info_emision_sinagendar").append(`
                            <div id="inforEmcer_${em_cer.id}" class="form-group inforEmcer" style="display:none; margin: 10px 0px;">
                                <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>
                                <div class="col-md-10 col-sm-10 col-xs-12">
                                    <div class="tile-stats" style="margin-bottom: 0px; padding-top: 5px; border-color: #cccccc;">                                            
                                        <div class="count" style="font-size: 18px !important;">Información del establecimiento</div>
                                    
                                        <div style="margin-left: 10px;">
                                            <b>Propietario:</b> ${em_cer.us001.name}<br>
                                            <b>Fecha Solicitud:</b> ${em_cer.fechaSolicitud}<br>
                                            <b>Dirección:</b> ${em_cer.establecimientoresponsable.establecimiento.direccion}<br>
                                            <b>Nombre Comercial:</b> ${em_cer.establecimientoresponsable.nombreComercial}<br>
                                            <div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 0px;">
                                                <p for="" style="float: left; margin: 0px 10px 0px 0px;"><b style="font-size: 13px;">Actividades a realizar</b></p>
                                                <hr style="margin-top: 10px; margin-bottom: 10px; ">
                                            </div>
                                            <ul style="padding-left: 25px; margin: 0;">${lista_actividades}</ul>

                                        </div>
                                        
                                    </div>                                                                                                                    
                                </div>
                            </div>
                        `);
                    });
                    $("#cmd_emision_sinagendar").trigger("chosen:updated");
                }else{
                    $("#content_check_emision_sinagendar").hide();    
                }

            }else{
                $("#content_asigTurno").hide(); // ocultamos el frm de agregar turno en turno disponible
                $("#content_RepReasAten").show(); // mostramos el frm de reprogramar reasignar y atender turno
            }
            
            // cargamos el combo de inspectores del misma area 
            $(".cmb_inspector").html(""); // limpiamos el combo de inspectores
            $.each(request.resultado.listaInspectores, function(i, inspector){
                $(".cmb_inspector").append(`
                    <option value="${inspector.idinspector}">${inspector.usuarios.name}</option>
                `);
                $(".cmb_inspector").trigger("chosen:updated"); // actualizamos el combo
            });
            
            // cargamos la información en la modal ------------------------------------------------------------
            $("#input_fechaAgenda").val(request.resultado.turno.agenda.fechaAgenda); // fecha de la agenda seleccionada
            $("#input_HoraInicio").val(request.resultado.turno.horaInicio); // hora de inicio del turno
            $("#input_HoraFin").val(request.resultado.turno.horaFin); // hora de inicio del turno
            if(request.resultado.turno.detalle != null){
                $("#detalle_turno").show();
                $("#btn_masdetalle").show();
                $("#p_detalle_turno").html(request.resultado.turno.detalle);
            }
            if(request.resultado.turno.usuario != null){
                $("#datos_persona").show();
                $("#p_nombre_persona").html(request.resultado.turno.usuario.name);
                $("#p_cedula_persona").html(request.resultado.turno.usuario.cedula);
                $("#p_email_persona").html(request.resultado.turno.usuario.email);
                $("#p_celular_persona").html(request.resultado.turno.usuario.celular);
            }
            if(request.resultado.emision_atender!=null){
                var esta_responsable = request.resultado.emision_atender.establecimientoresponsable;
                $("#p_clave").html(esta_responsable.establecimiento.clave_catastral);
                $("#p_direccion").html(esta_responsable.establecimiento.direccion);
                $("#p_nombre_estab").html(esta_responsable.nombreComercial);
                $("#p_area_estab").html(esta_responsable.area);
                $("#p_aforo_estab").html(esta_responsable.aforo);
                $("#p_act_realizar").html("");
                $.each(esta_responsable.establecimiento_actividades, function (i1, item_estab_act) { 
                    $("#p_act_realizar").append(`<p style="margin: 0px 0px 2px 15px;"><span class="fa fa-arrow-right"></span> ${item_estab_act.actividades.Descripcion}</p>`);
                });
            }
            //-------------------------------------------------------------------------------------------------

            // campos de fecha y hora de la sección de atende -------------------------------------------------
            $("#atender_nueva_fecha").val(request.resultado.turno.agenda.fechaAgenda); // fecha de la nueva agenda seleccionada
            $("#atender_nueva_horaInicio").val(request.resultado.turno.horaInicio); // hora de inicio del nuevo turno
            $("#atender_nueva_horaFin").val(request.resultado.turno.horaFin); // hora de inicio del nuevo turno
            // ------------------------------------------------------------------------------------------------

            // cargarmos la informacion de los requisitos adjuntados por el ciudadano  ------------------------
            $("#cont_listaRequisitosAdjuntos").hide();
            $("#listaRequisitosAdjuntos").html("");
            $("#requisitos_body").removeClass("in");
            $.each(request.resultado.emision_requisitos, function(i, documento){
                $("#listaRequisitosAdjuntos").append(`
                    <div class="alert f_documento_adjunto fade in docActivo active_documento" style="margin-bottom: 5px !important; margin-top:0px !important;">                                                               
                        <a type="button" href="/buscarDocumento/certificadosRequisitos/${documento.documento}" target="_blank" class="btn btn-primary btn-sm btn_doc_creado"><i class="fa fa-eye"></i></a>
                        <strong><i class="icono_left fa fa-file-pdf-o"></i></strong> 
                        <span id="nombreDocSel_2">${documento.requisitos.descripcion}</span>                             
                    </div>
                `);
                $("#cont_listaRequisitosAdjuntos").show();
            });          
            // ------------------------------------------------------------------------------------------------

            $("#modal_reasignacion_turno").modal("show"); // recien aquí mostramos la modal
            vistacargando();

        }).fail(function(error){
            vistacargando();
        });
    }


    // función que se ejecuta se selecciona una emision no asignada
    $("#cmd_emision_sinagendar").change(function(e){
        $("#content_info_emision_sinagendar").find('.inforEmcer').hide();
        $("#content_info_emision_sinagendar").show();
        var inforEmcer = $("#cmd_emision_sinagendar option:selected").attr('data-id');
        $("#inforEmcer_"+inforEmcer).show(200);
    });



    // // funcion para recargar el calendario
    // function recargarCalendario(){
    //     $.get(`/gestionAgenda/agenda/12/edit`, function (request){       
    //         cargarCalendarioAgenda(request,"refresh"); 
    //     });
    // }

    $("#btn_masdetalle").click(function(e){
        $(this).hide();
        $("#contet_masdetalle").show(200);
    });

    $("#btn_menosdetalle").click(function(e){
        $("#btn_masdetalle").show();
        $("#contet_masdetalle").hide(200);
    });


    function mensajePrincipalCalendario(mensaje, status){
        $("#mensajeVentanaPrincipal").show();
        $("#mensaje_alert").addClass("alert-"+status);
        $("#mensaje_info").html(mensaje);
        $('html,body').animate({scrollTop:$('#div_inicio_pagina').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
        setTimeout(() => {
            $("#mensajeVentanaPrincipal").hide(200);
            $("#mensaje_alert").removeClass("alert-"+status);
            $("#mensaje_info").html("");
        }, 6000);
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




// ==================== FUNCIONES PARA REASIGNAR UN TURNO ===========================


    // función para reasignar un turno a otro inspector
    $("#frm_reasignar_inspector").submit(function(e){
        e.preventDefault();
        var idturno = $("#input_idturno_select").val(); // obtenemos el id del turno que se selecciona
        var frmData = new FormData(this);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        vistacargando("M","Reasignado..."); // mostramos la ventana de carga
        $.ajax({
            url: '/gestionAgenda/reasignar/'+idturno,
            type: 'POST',
            data:frmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(request) {
                console.log(request);
                if(!request.error){
                    if(request.resultado.lleno){
                        mostrarMensaje(request.resultado.mensaje, "warning","mensajeEnModal");
                    }else{
                        cargarCalendarioAgenda(request.resultado.listaAgenda, "refresh");
                        mensajePrincipalCalendario("Reasignación exitosa", "success");                                                
                        $("#modal_reasignacion_turno").modal("hide"); // recien aquí mostramos la modal
                    }
                }else{
                    mostrarMensaje("No se pudo ejecutar la petición", "warning","mensajeEnModal");  
                }
            },complete: function(){
                vistacargando(); // ocultamos la ventana de carga                
            }
        });
    
    });




    $("#frm_reprogramar_turno").submit(function(e){
        e.preventDefault();
        var idturno = $("#input_idturno_select").val(); // obtenemos el id del turno que se selecciona
        var frmData = new FormData(this);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        vistacargando("M","Reprogramando..."); // mostramos la ventana de carga
        $.ajax({
            url: '/gestionAgenda/reprogramar/'+idturno,
            type: 'POST',
            data:frmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(request) {
                console.log(request);
                if(!request.error){
                    if(request.resultado.lleno){
                        mostrarMensaje(request.resultado.mensaje, "warning","mensajeEnModal");
                    }else{
                        cargarCalendarioAgenda(request.resultado.listaAgenda, "refresh");
                        mensajePrincipalCalendario("Reasignación exitosa", "success");   
                        $("#modal_reasignacion_turno").modal("hide"); // recien aquí mostramos la modal                                             
                    }
                }else{
                    mostrarMensaje("No se pudo ejecutar la petición", "warning","mensajeEnModal");                                           
                }

            },complete: function(){
                vistacargando(); // ocultamos la ventana de carga                
            }
        });
    
    });




    $('#check_reasignar').on('ifChecked', function(event){ // si se checkea
        $("#content_cmb_reprogram_inspector").show(200);
    });

    $('#check_reasignar').on('ifUnchecked', function(event){ // si se deschekea
        $("#content_cmb_reprogram_inspector").hide(200);
    });

// ==================== /FUNCIONES PARA REASIGNAR UN TURNO ===========================










// ==================== FUNCIONES PARA LA ATENCIÓN DE UNA TURNO ===========================

    $("#cmb_estado_atencion").change(function(e){
        var option_select = $("#cmb_estado_atencion option:selected");
        if($(option_select).hasClass("condicionado")){
            $("#div_atender_nuevoTurno").show(200);
            $('#div_personalizado').hide(200);
        }else if($(option_select).hasClass("default")){
            $("#div_atender_nuevoTurno").hide(200);
            $('#div_personalizado').show(200);
        }else{
            $("#div_atender_nuevoTurno").hide(200);
            $('#div_personalizado').hide(200);

        }
    });

    //PARA SUBIR UN DOC PERSONALIZADO

    $('#Si_perso').on('ifChecked', function(event){
        $('#divfechavigencia').show(200);
        $('#id_certificado_doc').show(200);
                
    });
    $('#No_perso').on('ifChecked', function(event){
        $('#divfechavigencia').hide(200);
        $('#id_certificado_doc').hide(200);
        $(`#vista_doc`).hide(200);
        $(`#archivo_personal`).val('');

    });

    function modalArchivos(url){
        $('#VistaPrevia').html(`<iframe src="${url}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
        $('#modalDocumentos').modal();
    }

    $(`#archivo_personal`).change(function(e){
        if(e.target.files.length>0){ 
            $(`#vista_doc`).hide();
              var tipoDoc=e.target.files[0].type;
              if(tipoDoc!="application/pdf"){
                  $(`#vista_doc`).hide();
                  $(`#archivo_personal`).val('');
                  alertNotificar('Solo permite subir documentos en formato PDF','error');
                  return;
              }else{
                archivo=(e.target.files[0].name);
                $(`#vista_doc`).html(`<label class="control-label col-md-2 col-sm-2 col-xs-12" > 
                    </label> 
                    <div class="col-md-10 col-sm-10 col-xs-12">
                <a id="btnVerDoc${e.target.title}" data-toggle="tooltip" data-placement="top" title="Ver Documento" onclick="modalArchivos('${URL.createObjectURL(e.target.files[0])}')" class="btn btn-sm  btn-info"><i class="fa fa-eye"></i> Visualizar Documento</a>
                </div>`);
                $(`#vista_doc`).show(350);
                $(`#btnVerDoc${e.target.title}`).tooltip({position: "top"});
              }
        }else{
            $(`#vista_doc`).hide();
        }
    });

    $("#frm_atender_turno").submit(function(e){
        e.preventDefault();
        var idturno = $("#input_idturno_select").val(); // obtenemos el id del turno que se selecciona
        var frmData = new FormData(this);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        vistacargando("M","Guardando..."); // mostramos la ventana de carga
        $.ajax({
            url: '/gestionAgenda/atender/'+idturno,
            type: 'POST',
            data:frmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(request) {
                console.log(request);
                if(!request.error){
                    if(request.resultado.lleno){
                        mostrarMensaje(request.resultado.mensaje, "warning","mensajeEnModal");
                    }else{
                        cargarCalendarioAgenda(request.resultado.listaAgenda, "refresh");
                        mensajePrincipalCalendario("Actualización exitosa", "success");   
                        $("#modal_reasignacion_turno").modal("hide"); // recien aquí mostramos la modal                                             
                    }
                }else{
                    mostrarMensaje("No se pudo ejecutar la petición", "warning","mensajeEnModal");                                           
                }

            },complete: function(){
                vistacargando(); // ocultamos la ventana de carga                
            }
        });

    });



// ==================== /FUNCIONES PARA LA ATENCIÓN DE UNA TURNO  ===========================




// ==================== FUNCIONES PARA LA ASIGNAR UN TURNO DISPONIBLE  ===========================
// ESPERO QUE SUBAN ESTOS CAMBIOS XD
    $("#frm_asignar_turno").submit(function(e){
        e.preventDefault();
        var idturno = $("#input_idturno_select").val(); // obtenemos el id del turno que se selecciona
        var frmData = new FormData(this);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        vistacargando("M","Asignando..."); // mostramos la ventana de carga
        $.ajax({
            url: '/gestionAgenda/asignar/'+idturno,
            type: 'POST',
            data:frmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(request) {
                console.log(request);
                if(!request.error){
                    if(request.resultado.lleno){
                        mostrarMensaje(request.resultado.mensaje, "warning","mensajeEnModal");
                    }else{
                        cargarCalendarioAgenda(request.resultado.listaAgenda, "refresh");
                        mensajePrincipalCalendario("Asignación exitosa", "success");   
                        $("#modal_reasignacion_turno").modal("hide"); // recien aquí mostramos la modal                                             
                    }
                }else{
                    mostrarMensaje("No se pudo ejecutar la petición", "warning","mensajeEnModal");                                           
                }

            },complete: function(){
                vistacargando(); // ocultamos la ventana de carga                
            }
        });

    });
// ==================== /FUNCIONES PARA LA ASIGNAR UN TURNO DISPONIBLE  ===========================



$('#check_emision_sinagendar').on('ifChecked', function(event){ // si se checkea
    $("#content_cmd_emision_sinagendar").show(200);
    $("#content_info_emision_sinagendar").show();
});

$('#check_emision_sinagendar').on('ifUnchecked', function(event){ // si se deschekea
    $("#content_cmd_emision_sinagendar").hide(200);
    $("#content_info_emision_sinagendar").hide();
});