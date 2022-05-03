    
    var lenguajeTabla2 = {
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
        var idtabla = "ga_tabla_proyectos";
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
            "language": lenguajeTabla2
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

    });

    //FUNCIONES PARA EL FILTRO DE PROYECTOS -------------------------------------------------------

    function ga_mostrar_filtro_proyectos(){
        $("#content_filtro_proyecto").show(200);
        $("#btn_mostrar_filtro").hide();

        $(".check_etapa").iCheck('check');
        $(".check_estado").iCheck('check');
        $("#ga_check_filtrar_fecha").iCheck('uncheck');

        $(".cmb_filtro").find('option').prop('selected', false);
        $("#cmb_tipoProyecto").find('.option').prop('selected', true);
        $("#cmb_prioridad").find('.option').prop('selected', true);
        $(".cmb_filtro").trigger("chosen:updated");

    }

    function ga_cancelar_filtro(){
        $("#content_filtro_proyecto").hide(200);
        $("#btn_mostrar_filtro").show();
    }

    function ga_seleccionarCombo(cmb){
        var option_sel= $(cmb).find('option:selected');
        var valor_sel=$(option_sel).attr('data-id');
        if(valor_sel==0){
            $(option_sel).prop('selected', false);
            $(cmb).find('.option').prop('selected', true);
            $(cmb).trigger("chosen:updated");
        }
    }

    
    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#ga_check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha").show(200);
    });

    $('#ga_check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea
        $("#content_filtrar_fecha").hide(200);
    });

    function ga_filtrar_proyectos(){      

        PNotify.removeAll();
        
        //etapas seleccionadas
            var arr_etapas = $(".check_etapa:checked").map(function(){
                return this.value;
            }).get();

            if(arr_etapas.length==0){
                alertNotificar("Seleccione al menos una etapa", "default"); return;
            }

        //estados seleccionados
            // var arr_estado = $(".check_estado:checked").map(function(){
            //     return this.value;
            // }).get();

            // if(arr_estado.length==0){
            //     alertNotificar("Seleccione al menos un estado", "default"); return;
            // }

            // var check_atiempo = false;
            // var ckeck_fuetatiempo = false;
            // if($("#check_estado_at").is(':checked')){
            //     check_atiempo = true;
            // }
            // if($("#check_estado_ft").is(':checked')){
            //     ckeck_fuetatiempo = true;
            // }


        //fecha seleccionadas
            var check_filtrar_fecha = false;
            if($("#ga_check_filtrar_fecha").is(':checked')){
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
                check_filtrar_fecha: check_filtrar_fecha,
                cmb_campo_fecha: $("#cmb_campo_fecha").val(),
                fechaInicio: $("#fechaInicio").val(),
                fechaFin: $("#fechaFin").val(),
                arr_etapas: arr_etapas,
                // check_atiempo: check_atiempo,
                // ckeck_fuetatiempo: ckeck_fuetatiempo
            }

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        vistacargando("M", "Espere...");

        $.ajax({
			url: '/controlProyecto/filtroProyectoDepa',
			method: "POST",
            data: FrmData,
            type: "json",
			success: function (retorno)
			{
                vistacargando();                     

                if(retorno.error == true){
                    alertNotificar(retorno.mensaje,retorno.status);
                }else{

                    var idtabla = "ga_tabla_proyectos";
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
                        "language": lenguajeTabla2,
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
                            {data: "descripcion" }
                        ],
                        "rowCallback": function( row, proyecto, index ){            
                            
                            //columna 0
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
                                var html_estado = "";
                                // if(proyecto.entiempo == true || proyecto.etapa.codigo=="EJ"){
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
                                // }else{
                                //     html_estado = `<button type="button" class="btn btn-danger btn-xs btn_status">Fuera de tiempo</button>`;
                                // }
                                $('td', row).eq(5).html(html_estado);

                            //columna 6                   
                                $('td', row).eq(6).html(`                                                       
                                    <center>
                                        <span style="display: block; width: max-content; font-weight: bolder; color: #216cac;">
                                            <i class="fa fa-tag"></i> ${proyecto.actividades.length} Actividades
                                        </span> 
                                        <button onclick="ga_mostrar_gestion_actividades('${proyecto.idcon_proyecto_encrypt}')" class="btn btn-success btn-xs" style="margin: 0px;" data-toggle="tooltip" data-original-title="Gestionar actividades del proyecto" data-placement="top">
                                            <i class="fa fa-edit fa_sm"></i> 
                                        </button>
                                        <button onclick="mostrar_detalle_proyecto('${proyecto.idcon_proyecto_encrypt}')" data-toggle="tooltip" data-original-title="Detalle general del proyecto" data-placement="top" class="btn btn-primary btn-xs" style="margin-bottom: 0px;">
                                            <i class="fa fa-desktop fa_sm"></i> 
                                        </button>                                       
                                    </center>
                                `);
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


//==============================================================================================================//
//******************************** FUNCIONES PARA GESTIONAR LAS ACTIVIDADES ************************************//
//==============================================================================================================//

    function cerrar_gestion_actividades(){
        $("#content_agregar_activdad").hide();
        $("#content_general_proyecto").show(200);
    }


    function ga_mostrar_gestion_actividades(idcon_proyecto_encrypt){
    
        //mostramos la vista de detalle de proyecto
        $("#content_general_proyecto").hide();
        $("#content_agregar_activdad").show(200);
        $('[data-toggle="tooltip"]').tooltip();
        $("#input_id_proyecto").val(idcon_proyecto_encrypt);
        $(".infop").html("");

        vistacargando("M", "Espere...");

        $("#ga_tabla_actividades tbody").html(`
            <tr><td colspan="9"><center><h3 style="margin:40px; 0px;">Cargando Datos...</h3></center></td></tr>
        `);

        $.get(`/controlProyecto/actividad/${idcon_proyecto_encrypt}`, function(retorno){
            vistacargando();            
            if(!retorno.error){ //todo bien

                cargar_tabla_actividades(retorno.lista_actividades);
                //cargamos los departamentos
                $(".cmb_departamentos_act").html(`<option data-id="0" value="" disabled selected>-- Sin departamento --</option>`);
                $(".cmb_departamentos_act").trigger("chosen:updated");

                //cargamos el rango de fecha del proyecto

                $("#act_fecha_inicio").val(retorno.proyecto.fechaInicio);
                $("#act_fecha_inicio").attr("data-id",retorno.proyecto.fechaInicio);
                $("#act_fecha_fin").val(retorno.proyecto.fechaFin);
                $("#act_fecha_fin").attr("data-id",retorno.proyecto.fechaFin);

                $.each(retorno.lista_all_departamentos, function (i, departamento){
                    $("#cmb_dep_resp").append(`
                        <option value="${departamento.iddepartamento}">${departamento.nombre}</option>
                    `);
                    $("#cmb_dep_resp").trigger("chosen:updated");
                });

                $.each(retorno.lista_all_departamentos, function (i, departamento){
                    $("#cmb_dep_rec").append(`
                        <option value="${departamento.iddepartamento}">${departamento.nombre}</option>
                    `);
                    $("#cmb_dep_rec").trigger("chosen:updated");
                });

                //cargamos el detalle del proyecto
                var proy = retorno.proyecto;
                $("#infop_descripcion").html(proy.descripcion);
                $("#infop_codigo").html(proy.codigo);
                $("#infop_antecedente").html(proy.antecedente);
                $("#infop_fecha").html(proy.fechaInicio+" - "+proy.fechaFin);
                $("#infop_presupuesto").html("$"+proy.total);

            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo obtener las actividades, por favor intente más tarde.");
        });

    }


    //PARA UNA NUEVA ACTIVIDAD

    function nueva_actividad(){        
        limpiar_modal_nueva_activi();
        $("#content_info_actividad_padre").hide();
        $("#btn_sub_actividad").hide();
        $("#titulo_modal_actividad").html("Agregar Nueva Actividad");
        $("#method_actividad").val("POST");
        $("#modal_gestion_actividad").modal("show");
        $("#btn_guardar_act").html(`<span class="fa fa-save"></span>  <b>Guardar</b>`);
    }

    function editar_actividad(idcon_actividad_encrypt){
        limpiar_modal_nueva_activi();
        $("#titulo_modal_actividad").html("Actualizar Actividad");
        $("#method_actividad").val("PUT");
        $("#btn_guardar_act").html(`<span class="fa fa-save"></span>  <b>Actualizar</b>`);
        $("#input_id_actividad_edit").val(idcon_actividad_encrypt);

        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/actividad/${idcon_actividad_encrypt}/edit`, function(retorno){
            vistacargando();            
            if(!retorno.error){ //todo bien
                actividad = retorno.actividad;

                $("#act_codigo").val(actividad.codigoActividad);
                $("#act_descripcion").val(actividad.descripcion);
                $("#act_fecha_inicio").val(actividad.fechaInicio);
                $("#act_fecha_fin").val(actividad.fechaFin);
                $("#act_porcentaje",).val(actividad.porcentajeActividad);                

                $("#info_codigo").html(actividad.codigoActividad);
                $("#info_descripcion").html(actividad.descripcion);
                $("#info_fecha").html(actividad.fechaInicio+" - "+actividad.fechaFin);     
                $("#info_porcentaje",).html(actividad.porcentajeActividad+"%");           

                //seleccionamos los combos
                    $("#cmb_us_resp").html(`<option data-id="0" value="">-- Sin usuario --</option>`);
                    $("#cmb_us_resp").trigger("chosen:updated");
                    $.each(retorno.lista_usuarios, function (i, usuario){
                        var selected = "";                        
                        if(usuario.idus001==actividad.idus001_responsable){ selected = "selected"; }
                        $("#cmb_us_resp").append(`
                            <option value="${usuario.idus001}" ${selected}>${usuario.name}</option>
                        `);
                        $("#cmb_us_resp").trigger("chosen:updated");
                    });

                    $(`#cmb_dep_resp option[value=${actividad.iddepartamento_resposanble}]`).prop('selected', true);
                    $("#cmb_dep_resp").trigger("chosen:updated");

                    $(`#cmb_dep_rec option[value=${actividad.iddepartamentoReceptor}]`).prop('selected', true);
                    $("#cmb_dep_rec").trigger("chosen:updated");

                //----------------------------
                

                $("#content_info_actividad_padre").hide();
                $("#btn_sub_actividad").attr('onclick',`agregar_sub_actividad('${actividad.idcon_actividad_encrypt}')`);
                $("#btn_sub_actividad").show();
                $("#modal_gestion_actividad").modal("show"); 
                
                $("#btn_elim_actividad").attr('onclick',`eliminar_actividad('${actividad.idcon_actividad_encrypt}')`);
                $("#btn_elim_actividad").show();

                $("#hr_gestion").show();

            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo obtene la actividade, por favor intente más tarde.");
        });
       
    }

    function agregar_sub_actividad(idcon_actividad_pred){
        limpiar_modal_nueva_activi();
        $("#input_id_actividad_pred").val(idcon_actividad_pred);
        $("#content_info_actividad_padre").show(200);
        $("#btn_sub_actividad").hide();

        $("#titulo_modal_actividad").html("Agregar Nueva Sub Actividad");
        $("#method_actividad").val("POST");
        $("#btn_guardar_act").html(`<span class="fa fa-save"></span>  <b>Guardar Sub Actividad</b>`);
    }

    function eliminar_actividad(idcon_actividad_encrypt){
        swal({
            title: "",
            text: "¿Está seguro de quiere eliminar la actividad?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            cancelButtonClass: "btn-danger",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que si

                vistacargando("M",'Eliminando...');
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
            
                $.ajax({
                    type: "DELETE",
                    url: '/controlProyecto/actividad/'+idcon_actividad_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            cargar_tabla_actividades(retorno.lista_actividades);                           
                            $("#modal_gestion_actividad").modal("hide");
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo eliminar la actividad, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    }


    $("#frm_gestion_actividad").submit(function(event){
        event.preventDefault();
       
        var formulario = this; // obtenemos el formulacion

        swal({
            title: "",
            text: "¿Está seguro que desea continuar?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            cancelButtonClass: "btn-danger",
            confirmButtonText: "Si, Continuar",
            cancelButtonText: "No, Cancelar",
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
                var metodo = $("#method_actividad").val();
                var ruta = "";
                var idcon_actividad = $("#input_id_actividad_edit").val();
                if(metodo == "PUT"){
                    ruta = "/controlProyecto/actividad/"+idcon_actividad;
                }else{
                    ruta = "/controlProyecto/actividad";
                }

                FrmData = $("#frm_gestion_actividad").serialize();

                var btn_submit = $(formulario).find('[type=submit]');
                var txt_submit = $(btn_submit).html();
                $(formulario).addClass('disabled_content');
                $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);

                $.ajax({
                    url: ruta,
                    method: metodo,
                    data: FrmData,
                    dataType: 'json',
                    // contentType:false,
                    // cache:false,
                    // processData:false,
                    success: function(retorno){
                        // si es completado
                        $(formulario).removeClass('disabled_content');
                        $(btn_submit).html(txt_submit);
                        alertNotificar(retorno.mensaje, retorno.status);

                        if(!retorno.error){
                            cargar_tabla_actividades(retorno.lista_actividades);                           
                            $("#modal_gestion_actividad").modal("hide");
                        }
                    },
                    error: function(error){                        
                        $(formulario).removeClass('disabled_content');
                        $(btn_submit).html(txt_submit);
                        alertNotificar("No se pudo registrar la actividad, por favor intente más tarde.");                        
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });


    function limpiar_modal_nueva_activi() {
        $("#act_codigo").val("");
        $("#act_descripcion").val("");
        $("#act_fecha_inicio").val($("#act_fecha_inicio").attr('data-id'));
        $("#act_fecha_fin").val($("#act_fecha_fin").attr('data-id'));
        $("#act_porcentaje",).val("");       
        $(".cmb_departamentos_act option").prop("selected", false);
        $(".cmb_departamentos_act option[data-id=0]").prop("selected", true);
        $(".cmb_departamentos_act").trigger("chosen:updated");
        $("#cmb_us_resp option").remove();
        $("#cmb_us_resp").trigger("chosen:updated");

        $("#hr_gestion").hide();
        $("#input_id_actividad_pred").val("");
        $("#btn_elim_actividad").hide();
    }


    function cargar_tabla_actividades(lista_actividades){ 
        
        $("#ga_tabla_actividades tbody").html("");
        $.each(lista_actividades, function (i, actividad){

            var boton = "";
            var style = `padding-left: ${actividad.nivel}px;`;
            var clases_tr = "";
            var clases_label = "";
            var color_estado = "";

            switch (actividad.etapa.codigo) {
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

            if(actividad.sub_actividades.length>0){
                clases_label = "lbvermas";
                boton = `<button class="btn btn-warning btn-sm btn_act" id="btn_vermas_${actividad.idcon_actividad}" data-id="${actividad.idcon_actividad}"><i class="fa fa-plus"></i></button>`;
            }

            if(actividad.nivel>0){
                clases_tr = `sub_act sa_${actividad.idcon_actividadPredecesora}`;
            }

            var responsables = "";
            if(actividad.departamento_responsable!=null){
                responsables = (`
                    <ul class="list-inline" style="margin-bottom: 0px;">
                        <li><a class="pull-left border-aero icon_respon" data-toggle="tooltip" data-original-title="${actividad.departamento_responsable.nombre}"> <i class="fa fa-institution aero"></i></a></li>
                        <li><a class="pull-left border-aero icon_respon_user" data-toggle="tooltip" data-original-title="${actividad.usuario_responsable.name}"> <i class="fa fa-user aero"></i></a></li>
                    </ul>
                `);
            }

            var dep_receptor = "";
            if(actividad.departamento_receptor!=null){
                dep_receptor = (`
                    <ul class="list-inline" style="margin-bottom: 0px;">
                        <li><a class="pull-left border-aero icon_respon" data-toggle="tooltip" data-original-title="${actividad.departamento_receptor.nombre}"> <i class="fa fa-institution aero"></i></a></li>
                    </ul>
                `);
            }

            $("#ga_tabla_actividades tbody").append(`
                <tr class="${clases_tr}">
                    <td>
                        <span class="con_act" style="${style}">
                            ${boton} <label for="btn_vermas_${actividad.idcon_actividad}" class="${clases_label}">${actividad.descripcion}</label>
                        </span>                                            
                    </td>               
                    <td> ${actividad.fechaInicio} - ${actividad.fechaFin}</td>
                    <td> ${responsables} </td>
                    <td> ${dep_receptor} </td>
                    <td> ${actividad.porcentajeActividad}%</td>                
                    <td> <button type="button" class="btn btn-${color_estado} btn-xs btn_status">${actividad.etapa.descripcion}</button></td>                    
                    <td> 
                        <button class="btn btn-primary btn-xs" onclick="editar_actividad('${actividad.idcon_actividad_encrypt}')"><i class="fa fa-cog"></i> Gestionar</button>
                    </td>
                </tr>
            `);
            $('[data-toggle="tooltip"]').tooltip();
        });

        if(lista_actividades.length == 0){
            $("#ga_tabla_actividades tbody").html(`
                <tr><td colspan="9"><center><h3 style="margin:40px; 0px;">El proyecto no tiene actividades asignadas</h3></center></td></tr>
            `);
        }

    }


    function select_depa_responsable(cmb){

        var iddepartamento = $(cmb).val();
        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/getUsuarioDepartamento/${iddepartamento}`, function(retorno){
            vistacargando();            
            if(!retorno.error){ //todo bien
                //cargamos los departamentos
                $("#cmb_us_resp").html(`<option data-id="0" value="" selected>-- Sin usuario --</option>`);
                if(retorno.lista_usuarios.length>0){
                    $.each(retorno.lista_usuarios, function (i, usuario){
                        $("#cmb_us_resp").append(`
                            <option value="${usuario.idus001}">${usuario.name}</option>
                        `);
                        $("#cmb_us_resp").trigger("chosen:updated");
                    });
                }else{
                    $("#cmb_us_resp").trigger("chosen:updated");
                }

            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo obtener las actividades, por favor intente más tarde.");
        });

    }


    $("#ga_tabla_actividades").delegate(".btn_act", "click", function(){
        data_id = $(this).attr("data-id");
        if($(this).find('i').hasClass('fa-plus')){

            $(this).find('i').removeClass('fa-plus');
            $(this).find('i').addClass('fa-minus');

            // $(this).parents('tr').siblings('.sub_act').hide();
            $(this).parents('tr').siblings('.sa_'+data_id).show();
            // $(this).parents('tr').siblings('.sa_'+data_id).addClass("sa_show");
        }else{

            $(this).find('i').removeClass('fa-minus');
            $(this).find('i').addClass('fa-plus');
            $(this).parents('tr').siblings('.sa_'+data_id).hide();

            $.each($(this).parents('tr').siblings('.sa_'+data_id), function (i, element){ 
                if($(element).find('.btn_act').length==1){
                    if($(element).find('.btn_act').find('.fa').hasClass('fa-minus')){
                        $(element).find('.btn_act').click();
                    }
                }
            });

        }
        

    });

