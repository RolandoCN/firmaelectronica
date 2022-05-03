

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
        var idtabla = "tabla_proyectos";
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "asc" ]],
            pageLength: 10,
            sInfoFiltered:false,
            "language": lenguajeTabla
        });

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
        $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
        $(`#${idtabla}`).find('.resp').css('width','150px');  
        $(`#${idtabla}`).find('.flex').css('display','flex');   
        $('[data-toggle="tooltip"]').tooltip();

        // alertNotificar("tu mensaje", "error");
    });


//FUNCIONES PARA EL FILTRO DE PROYECTOS -------------------------------------------------------

    function filtrar_proyectos(){
        $("#content_filtro_proyecto").show(200);
        $("#btn_mostrar_filtro").hide();

        $(".check_etapa").iCheck('check');
        $(".check_estado").iCheck('check');
        $("#check_filtrar_fecha").iCheck('uncheck');

        $(".cmb_filtro").find('option').prop('selected', false);
        $("#cmb_tipoProyecto").find('.option').prop('selected', true);
        $("#cmb_prioridad").find('.option').prop('selected', true);
        $(".cmb_filtro").trigger("chosen:updated");

    }

    function cancelar_filtro(){
        $("#content_filtro_proyecto").hide(200);
        $("#btn_mostrar_filtro").show();
    }

    function seleccionarCombo(cmb){
        var option_sel= $(cmb).find('option:selected');
        var valor_sel=$(option_sel).attr('data-id');
        if(valor_sel==0){
            $(option_sel).prop('selected', false);
            $(cmb).find('.option').prop('selected', true);
            $(cmb).trigger("chosen:updated");
        }
    }

    
    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha").show(200);
    });

    $('#check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea
        $("#content_filtrar_fecha").hide(200);
    });

    function filtrarProyectos(){

        PNotify.removeAll();
        
        //etapas seleccionadas
            var arr_etapas = $(".check_etapa:checked").map(function(){
                return this.value;
            }).get();

            if(arr_etapas.length==0){
                alertNotificar("Seleccione al menos una etapa", "default"); return;
            }

        //estados seleccionados
            var arr_estado = $(".check_estado:checked").map(function(){
                return this.value;
            }).get();

            if(arr_estado.length==0){
                alertNotificar("Seleccione al menos un estado", "default"); return;
            }

            var check_atiempo = false;
            var ckeck_fuetatiempo = false;
            if($("#check_estado_at").is(':checked')){
                check_atiempo = true;
            }
            if($("#check_estado_ft").is(':checked')){
                ckeck_fuetatiempo = true;
            }


        //fecha seleccionadas
            var check_filtrar_fecha = false;
            if($("#check_filtrar_fecha").is(':checked')){
                check_filtrar_fecha = true;

                //verificamos que se seleccione el rango de fecha
                if($("#fechaInicio").val()=="" || $("#fechaFin").val()==""){
                    alertNotificar("Seleccione un rango de fechas para realizar el filtro de los proyectos", "default"); return;
                }
            }

        //preparamos el request 
            var FrmData = {
                cmb_tipoProyecto: $("#cmb_tipoProyecto").val(),
                cmb_prioridad: $("#cmb_prioridad").val(),
                cmb_departamento: $("#cmb_departamento").val(),
                check_filtrar_fecha: check_filtrar_fecha,
                cmb_campo_fecha: $("#cmb_campo_fecha").val(),
                fechaInicio: $("#fechaInicio").val(),
                fechaFin: $("#fechaFin").val(),
                arr_etapas: arr_etapas,
                check_atiempo: check_atiempo,
                ckeck_fuetatiempo: ckeck_fuetatiempo
            }

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        vistacargando("M", "Espere...");

        $.ajax({
			url: '/controlProyecto/filtroAvanzado',
			method: "POST",
            data: FrmData,
            type: "json",
			success: function (retorno)
			{
                vistacargando();                     

                if(retorno.error == true){
                    alertNotificar(retorno.mensaje,retorno.status);
                }else{

                    var idtabla = "tabla_proyectos";
                    $(`#${idtabla}`).DataTable({
                        dom: ""
                        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                        +"<rt>"
                        +"<'row'<'form-inline'"
                        +" <'col-sm-6 col-md-6 col-lg-6'l>"
                        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                        "destroy":true,
                        order: [[ 0, "asc" ]],
                        pageLength: 10,
                        sInfoFiltered:false,
                        "language": lenguajeTabla,
                        data: retorno.lista_proyectos,
                        columnDefs: [
                            { className: "resp", targets: 3 },
                            { className: "col_sm", targets: 5 },
                            { className: "col_sm", targets: 6 }
                        ],
                        columns:[
                            {data: "idcon_proyecto" },
                            {data: "descripcion", render : function (item, type, proyecto){                       
                                return `${proyecto.fechaCreacion} ${proyecto.descripcion}`;
                            }},
                            {data: "descripcion" },
                            {data: "descripcion" },
                            {data: "descripcion" },
                            {data: "descripcion" },
                            {data: "descripcion" },
                            {data: "descripcion" }
                        ],
                        "rowCallback": function( row, proyecto, index ){                            

                            $('td', row).eq(0).html(index+1);                           
                            //columna 1
                                $('td', row).eq(1).html(`
                                    <a>${proyecto.descripcion}</a><br>
                                    <small>Creado ${proyecto.fechaCreacion}</small>
                                `);
                            //columna 2
                                $('td', row).eq(2).html(`
                                    <span style="display: flex; line-height: inherit;"><i class="fa fa-tag" style="color: green"></i>     <b style="padding: 0px 2px 0px 3px;">Tipo: </b>${proyecto['tipo_proyecto']['descripcion']}</span>
                                    <span style="display: flex; line-height: inherit;"><i class="fa fa-clone" style="color: orange"></i>  <b style="padding: 0px 2px 0px 3px;">Prioridad: </b>${proyecto['prioridad']['descripcion']}</span>
                                    <span style="display: flex; line-height: inherit;"><i class="fa fa-group" style="color: #061079"></i> <b style="padding: 0px 2px 0px 3px;">Componente: </b> ${proyecto['componente']['descripcion']}</span>
                                `);
                            //columna 3
                            
                                $('td', row).eq(3).html(`
                                    <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Del: </b> <span style="width: max-content; line-height: inherit;">${proyecto.fechaInicio}</span></span>
                                    <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Al: </b>  <span style="width: max-content; line-height: inherit;">${proyecto.fechaFin}</span></span>
                                `);
                            //columna 4
                                var depart_asig = "";
                                $.each(proyecto.dep_responsable, function (index, dep_responsable){
                                    depart_asig = depart_asig+(`<li style="margin-right: 4px;"><a class="pull-left border-aero icon_respon" data-toggle="tooltip" data-original-title="${dep_responsable.departamento.nombre}"> <i class="fa fa-institution aero"></i></a></li>`);
                                });                                                        
                                $('td', row).eq(4).html(`<ul class="list-inline">${depart_asig}</ul>`);
                            //columna 5
                                porcentaje = 0;
                                $.each(proyecto.actividades, function (ac, activ){
                                    aux_porcentaje = (activ.porcentajeActividad/100)*activ.porcentajeAvance;
                                    if(aux_porcentaje > activ.porcentajeActividad){ aux_porcentaje = activ.porcentajeActividad; }
                                    porcentaje = porcentaje+aux_porcentaje;
                                });
                                if(porcentaje > 100){ porcentaje=100; }

                                $('td', row).eq(5).html(`
                                    <div class="progress progress_sm" style="margin-bottom: 3px;">
                                        <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="${porcentaje}" aria-valuenow="${porcentaje}" style="width: ${porcentaje}%;"></div>
                                    </div>
                                    <small>${Math.round(porcentaje)}% Completado</small>
                                `);
                            //columna 6
                                var html_estado = "";
                                if(proyecto.entiempo == true || proyecto.etapa.codigo=="EJ"){
                                    switch (proyecto.etapa.codigo) {
                                        case 'EJ':
                                            color_estado = "success"; break;
                                        case 'PD':
                                            color_estado = 'danger';  break;
                                        case 'EE':
                                            color_estado = 'info'; break;
                                        case 'PE':
                                            color_estado = 'warning'; break;
                                        default:
                                            color_estado = "warning"; break;
                                    }
                                    html_estado = `<button type="button" class="btn btn-${color_estado} btn-xs btn_status">${proyecto.etapa.descripcion}</button>`;
                                }else{
                                    html_estado = `<button type="button" class="btn btn-danger btn-xs btn_status">Fuera de tiempo</button>`;
                                }

                                $('td', row).eq(6).html(html_estado);

                            //columna 7
                                // $('td', row).eq(7).addClass('flex');
                                $('td', row).eq(7).html(`<button onclick="mostrar_detalle_proyecto('${proyecto.idcon_proyecto_encrypt}')" class="btn btn-primary btn-xs" style="margin-bottom: 0px;"><i class="fa fa-desktop"></i> Detalle </button>`);

                        }
                    });            

                    // para posicionar el input del filtro
                    $(`#${idtabla}_filter`).css('float', 'left');
                    $(`#${idtabla}_filter`).children('label').css('width', '100%');
                    $(`#${idtabla}_filter`).parent().css('padding-left','0');
                    $(`#${idtabla}_wrapper`).css('margin-top','10px');
                    $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
                    $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
                    //buscamos las columnas que deceamos que sean las mas angostas
                    $(`#${idtabla}`).find('.col_sm').css('width','10px');
                    $(`#${idtabla}`).find('.resp').css('width','150px');  
                    $(`#${idtabla}`).find('.flex').css('display','flex');   
                    $('[data-toggle="tooltip"]').tooltip();
                    $(`#${idtabla}`).find(".progress").progressbar();
                    $(`#${idtabla}`).find(".progress-bar").progressbar();               


                }

			},error: function(){
                alertNotificar('Error al realizar la solicitud, Inténtelo más tarde','error');
                vistacargando();
            }
	    });



    }


// FUNCIONES PARA MOSTRAR EL DETALLE GENERAL DEL PROYECTO

    function mostrar_detalle_proyecto(idcon_proyecto_encrypt){

        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/getProyecto/${idcon_proyecto_encrypt}`, function(retorno){
            vistacargando();
            if(!retorno.error){

                var proyecto = retorno.proyecto;

                //cargamos la información básica
                $("#pd_descripcion").html(proyecto.descripcion);
                $("#pd_antecedente").html(proyecto.antecedente);
                $("#pd_tipoproyecto").html(proyecto.tipo_proyecto.descripcion);
                $("#pd_prioridad").html(proyecto.prioridad.descripcion);
                $("#pd_componente").html(proyecto.componente.descripcion);
                $("#pd_etapa").html(proyecto.etapa.descripcion);

                $(".pd_presupuesto").html(proyecto.total);
                $(".pd_cant_asignados").html(retorno.cant_asignados);
                $(".pd_duracion").html(retorno.duracion+" dias");

                //cargamos las actividades con sus respectivas vitacoras
                $("#pd_lista_actividades").html("");
                if(proyecto.actividades.length==0){ $("#content_actividades").hide(); }

                $.each(proyecto.actividades, function (index, actividad) {

                    $("#content_actividades").show();
                    //obtenemos el nombre del reponsable
                        var reponsable = "Sin Responsable";
                        if(actividad.us001_responsable!=null){
                            reponsable = actividad.us001_responsable.name;
                        }
                    //generamos el html de las vitacoras
                        var lista_vitacoras = "";                
                        $.each(actividad.vitacoras_actividad, function (index2, vitacora){

                            if(vitacora.evidencia!=null && vitacora.evidencia != ""){
                                lista_vitacoras = lista_vitacoras+(`
                                    <a href="/controlProyecto/bitacoraActividad/descargarEvidencia/${vitacora.idcon_vitacora_actividad_encrypt}" target="_blank" data-toggle="tooltip" data-placement="right" data-original-title="Agregado por: ${vitacora.us001_agrega.name}">
                                        <i class="fa fa-paperclip" style="display: initial;"></i> <span style="text-decoration: underline;">${vitacora.descripcion} - ${vitacora.evidencia}</span> <br>
                                        <span class="date_vitacora">${vitacora.fecha_reg_letra}</span>
                                    </a><br>
                                `);
                            }else{
                                lista_vitacoras = lista_vitacoras+(`
                                    <a target="_blank" data-toggle="tooltip" data-placement="right" data-original-title="Agregado por: ${vitacora.us001_agrega.name}" style="cursor: help; color: #1f849c;">
                                        <i class="fa fa-comments-o" style="display: initial;"></i> <span style="text-decoration: underline;">${vitacora.descripcion}</span> <br>
                                        <span class="date_vitacora">${vitacora.fecha_reg_letra}</span>
                                    </a><br>
                                `);
                            }
                        });

                        let meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];                     

                        var fecha_in = actividad.fechaInicio.split("-");
                        var anio_in = fecha_in[0];
                        var mes_in = meses[parseInt(fecha_in[1]-1)];
                        var dia_in = fecha_in[2];
        

                        var fecha_f= actividad.fechaFin.split("-");
                        var anio_f = fecha_f[0];
                        var mes_f = meses[parseInt(fecha_f[1]-1)];
                        var dia_f = fecha_f[2];
        
                        var estilo_hija = "";
                        var color_pricipal = "color: #3fa2b9;";
                        var icono_actividad = `<a class="pull-left border-aero icon_act"> <i class="fa fa-tags aero"></i></a>`; // actividad principal
                        if(actividad.idcon_actividadPredecesora!=null && actividad.idcon_actividadPredecesora!=""){ // solo para las actividades hijas  
                            icono_actividad = (`
                                    <a class="pull-left border-aero">
                                        <svg style="font-size: 30px;" class="bi bi-arrow-return-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.146 5.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 9l-2.647-2.646a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3 2.5a.5.5 0 00-.5.5v4A2.5 2.5 0 005 9.5h8.5a.5.5 0 000-1H5A1.5 1.5 0 013.5 7V3a.5.5 0 00-.5-.5z" clip-rule="evenodd"/></svg>
                                    </a>
                                `);
                            estilo_hija = "margin-left: 15px; margin-bottom: 0px; padding-bottom: 0px;";
                            color_pricipal = "";
                        }

                        //verificamos el estado de la revision de la actividad
                            estado_revision = "";
                            if(actividad.etapa.codigo=="EJ" && actividad.estado_revision!=null){      
                                
                                color_estado = "danger";                                                             
                                switch (actividad.estado_revision.codigo) {
                                    case 'PR':
                                        color_estado = 'warning';  break;
                                    case 'ER':
                                        color_estado = 'info'; break;
                                    case 'RA':
                                        color_estado = "success"; break;
                                    case 'RR':                                                            
                                        color_estado = 'danger'; break;
                                    default:
                                        color_estado = "warning"; break;
                                }                                                             
                                estado_revision = `<button style="padding:0px 5px; margin:0px; border:0px;" type="button" class="btn btn-${color_estado} btn-xs btn_status">Estado: ${actividad.estado_revision.descripcion}</button>`;                
                            }
                        //--------------------------------------------------------------------------------------

                    //cargamos el html de las actividades
                    
                        var html_actividad = (`
                        <li style="border-bottom: 0px; ${estilo_hija}">                                
                            ${icono_actividad}
                            <div class="message_date">
                                <h3 class="date text-info" style="font-size:18px;">${dia_f}</h3>
                                <p class="month" style="margin-bottom:0px;">${mes_f}</p>
                                <p class="month" style="font-size:10px; margin-bottom:0px;">${anio_f}</p>
                            </div>                            
                            <div class="message_date" style="margin: 0px 10px;">
                                <h3 class="date text-info"> - </h3>
                            </div>
                            <div class="message_date">
                                <h3 class="date text-info" style="font-size:18px;">${dia_in}</h3>
                                <p class="month" style="margin-bottom:0px;">${mes_in}</p>
                                <p class="month" style="font-size:10px; margin-bottom:0px;">${anio_in}</p>
                            </div>
                            <div class="message_wrapper">
                                <h4 class="heading" style="${color_pricipal}">${actividad.descripcion}</h4>
                                ${estado_revision}
                                <h4 class="message" style="margin-bottom: 15px; text-transform: capitalize; font-size: 14px;">
                                    <i class="fa fa-user"></i> ${reponsable.toLowerCase()}
                                </h4>                                
                                <p class="url">
                                    <span class="fs1 text-info" aria-hidden="true" data-icon=""></span>
                                    ${lista_vitacoras}
                                </p>
                            </div>
                            <hr style="margin: 0px 0px 7px 0px; border-top: 1px dotted #e6e6e6;">

                            <ul id="act_hija_${actividad.idcon_actividad}" class="list-unstyled project_files"> 
                            </ul>
                        </li>
                    `);

                    if(actividad.idcon_actividadPredecesora!=null && actividad.idcon_actividadPredecesora!=""){ // es una actividad hija
                        $(`#act_hija_${actividad.idcon_actividadPredecesora}`).append(html_actividad);
                    }else{
                        $("#pd_lista_actividades").append(html_actividad);
                    }
                    
                });
                    
                //cargamos el html de las vitacoras del proyecto
                    $("#pd_archivos_proyecto").html("");
                    if(proyecto.vitacoras_proyecto.length==0){ $("#content_archivos_proy").hide(); }            
                    $.each(proyecto.vitacoras_proyecto, function (indexvp, vitacora_pro) {
                        
                        $("#content_archivos_proy").show();
                        //no mover los espacios porque influye en como se muestra el tooltip
                        var tooltip_text = (`Agregado por: ${vitacora_pro.us001_agrega.name}                
                            el ${vitacora_pro.fecha_reg_letra}                   
                            `);

                        if(vitacora_pro.evidencia!=null && vitacora_pro.evidencia!=""){
                            $("#pd_archivos_proyecto").append(`
                                <li>
                                    <span class="tooltip_aline">                                        
                                        <a href="/controlProyecto/bitacoraProyecto/descargarEvidencia/${vitacora_pro.idcon_vitacora_proyecto_encrypt}" target="_blank" data-toggle="tooltip" data-placement="top" data-original-title="${tooltip_text}">
                                            ${vitacora_pro.descripcion}<br>
                                            <span style="text-decoration: underline;">
                                                <i class="fa fa-file-text-o"></i> ${vitacora_pro.evidencia}
                                            </span>
                                        </a>
                                        <hr style="margin: 8px 0px;">
                                    </span>
                                </li>                            
                            `);
                        }else{
                            $("#pd_archivos_proyecto").append(`
                                <li>
                                    <span class="tooltip_aline">                                        
                                        <a data-toggle="tooltip" data-placement="top" data-original-title="${tooltip_text}" style="cursor: help;">
                                            <i class="fa fa-comments-o"></i> ${vitacora_pro.descripcion}<br>
                                        </a>
                                        <hr style="margin: 8px 0px;">
                                    </span>
                                </li>                            
                            `);
                        }


                    });

                //mostramos la vista de detalle de proyecto
                    $("#content_general_proyecto").hide();
                    $("#content_detalle_proyecto").show(200);
                    $('[data-toggle="tooltip"]').tooltip();
                    
                    array_actividades_proyecto = proyecto.actividades;
                    $("#dg_pastel_barra option[value=B]").prop("selected", true);
                    $("#dg_pastel_barra option[value=P]").prop("selected", false);
                    $("#tab_diagraba_participacion").click();

                    spinnerCargando("#grafico_detalle_proyecto", "Cargando...");
                    setTimeout(() => {
                        cargar_grafico_actividad_usuarios(retorno.participantes);
                    }, 500);

            }else{ // error
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo obtener el proyecto, por favor intentelo mas tarde.", "error");
        });
    }

    function cerrar_detalle_proyecto(){
        $("#content_detalle_proyecto").hide();
        $("#content_general_proyecto").show(200);
    }


    $('[data-toggle="tooltip"]').click(function(){
        $('[data-toggle="tooltip"]').tooltip('hide');
    });

//---------------------------------------------------------------------------------------------



//=================================================================================================
//****************************** GRÁFICOS ESTADISTICOS ********************************************
//=================================================================================================

   
    //variable para las graficas
    var theme2 = {
        color: [
            '#0e68a7', '#d10609', '#ff7f12', '#179517',
            '#980597', '#68a90b', '#04787b', '#16a3ef'
        ],


        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: {color: '#408829'},
                emphasis: {color: '#408829'}
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };

    var array_lista_participantes = [];

    // funciona para cargar el grafico de tiempo medio de trámites
    function cargar_grafico_actividad_usuarios(lista_participantes){
        
        array_lista_participantes = lista_participantes;
        
        $("#grafico_detalle_proyecto").html("");
        var echartBar = echarts.init(document.getElementById('grafico_detalle_proyecto'), theme2);
        var data_category = [];
        var data_value = [];

        //creamos la data para enviarla al grafico
        $.each(lista_participantes, function (index, participante){ 
            var num_part = 0;
            num_part = num_part+participante.vitacoras_proyecto.length;
            num_part = num_part+participante.vitacoras_actividad.length;
            data_value.push(num_part);
            data_category.push(participante.name);
        });

        //cargamos la grafica
        echartBar.setOption({
            title: {
                text: 'Contribuciones de responsables del proyecto',
                subtext: ''
            },
            tooltip: { trigger: 'axis' },
            legend: { x: 'center', y: 'bottom',  data: [`Contribuciones`] },
            toolbox: { show: true },
            calculable: false,
            xAxis: [{ type: 'category', data: data_category }],
            yAxis: [{ type: 'value' }],
            series: [{
                name: `Contribuciones`,
                type: 'bar',
                data: data_value,
                markPoint: { data: [{ type: 'max', name: 'Mayorres Contribuciones' }, { type: 'min', name: 'Menores Contribuciones' }] },
                markLine: { data: [{ type: 'average', name: 'Media de contribuciones' }] }
            }]
            });  
       
    }

    function cambiar_grafico_contrib(){
        var option = $("#dg_pastel_barra").val();
        switch (option) {
            case "B":
                cargar_grafico_actividad_usuarios(array_lista_participantes);
                break;
            case "P":
                cargar_grafico_pastel_actividad_usuarios(array_lista_participantes);
                break;
        }
    }

    // // funcion para cargar el grafico de cantidad de tramites generados
    function cargar_grafico_pastel_actividad_usuarios(lista_participantes){

        $("#grafico_detalle_proyecto").html("");
        var echartPie = echarts.init(document.getElementById('grafico_detalle_proyecto'), theme2);

        var dataGrafica = [];

        $.each(lista_participantes, function (index, participante){ 
            var num_part = 0;
            num_part = num_part+participante.vitacoras_proyecto.length;
            num_part = num_part+participante.vitacoras_actividad.length;

            dataGrafica.push({
                value: num_part,
                name: participante.name
            });

        });
        
        //cargamos la grafica
        echartPie.setOption({
            tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
            legend: { x: 'center', y: 'top', data: ['Izquierda', 'Derecha'] },
            calculable: true,
            series: [{
                name: 'Distribución de Atención de Procesos',
                type: 'pie',
                radius: '55%',
                center: ['50%', '48%'],
                data: dataGrafica
            }]
        });

    } 


//=================================================================================================
//****************************** DIAGRAMA DE GANTT ************************************************
//=================================================================================================

    var array_actividades_proyecto = [];

    $("#tab_diagrama_gantt").click(function(){
       
        if($("#diagrama_gantt:visible").length==0){

            if(array_actividades_proyecto.length==0){
                $("#content_mostrar_por").hide();
                $("#diagrama_gantt_proyecto").html(`
                    <h2 class="codDoc_asociado" style="margin-bottom: 20px;  margin-top: 20px;"> 
                        <center><i class="fa fa-frown-o" style= "font-size: 22px;"></i> EL PROYECTO NO TIENE ACTIVIDADES ASIGNADAS </center>
                    </h2>
                `);
                return;
            }

            $("#content_mostrar_por").show();
            spinnerCargando("#diagrama_gantt_proyecto", "Cargando...");
            setTimeout(() => {    
                $("#diagrama_gantt_proyecto").html("");       
                cargar_diagrama_gantt();            
            }, 500);
        }

    });

    function cargar_diagrama_gantt() {
                
        var tasks = [];
        $.each(array_actividades_proyecto, function (index, actividad){

            if(actividad.idcon_actividadPredecesora == null){
                tasks.push({
                    start: actividad.fechaInicio,
                    end: actividad.fechaFin,
                    name: actividad.descripcion,
                    id: "act_"+actividad.idcon_actividad,
                    progress: actividad.porcentajeAvance,
                    custom_class: 'progress-success',
                    actividad: actividad
                });
            }else{
                tasks.push({
                    start: actividad.fechaInicio,
                    end: actividad.fechaFin,
                    name: actividad.descripcion,
                    id: "act_"+actividad.idcon_actividad,
                    progress: actividad.porcentajeAvance,
                    dependencies: "act_"+actividad.idcon_actividadPredecesora,
                    custom_class: 'progress-success',
                    actividad: actividad
                });
            }

        });

        var mostrar_por = $("#dg_mostrar_por").val();

        var gantt = new Gantt('#diagrama_gantt_proyecto', tasks, {
            header_height: 50,
            view_mode: mostrar_por,
            language: 'es',
            // view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
            custom_popup_html: function(task) {					
            const end_date = task.end;
            var estado_revision = "";
            actividad = task.actividad;           
            if(actividad.etapa.codigo=="EJ" && actividad.estado_revision!=null){                
                estado_revision = actividad.estado_revision.descripcion;
                estado_revision = `<p style="margin: 2px 0px;">Estado: ${estado_revision}</p>`;                
            }
            return `
                <div class="details-container">
                    <p style="margin: 2px 0px;"><b>${task.name}</b></p>
                    <p style="margin: 2px 0px;">Fecha finalización ${end_date}</p>
                    <p style="margin: 2px 0px;">${task.progress}% completado!</p>
                    ${estado_revision}
                    <!--<button class="btn btn-info btn-xs"><i class="fa fa-eye"></i> Ver Mas</button>-->
                </div>
            `;
            }
        });

        $('.bar-wrapper').click(function (e) {            
            e.stopPropagation();    
        });
        
        $('.popup-wrapper').click(function (e) {            
            e.stopPropagation();    
        });
        
        $('body').on('click', function(e){
            $(".popup-wrapper").hide();
        })

    };


