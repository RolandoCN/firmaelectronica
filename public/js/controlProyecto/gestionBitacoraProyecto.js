

//FUNCIONES PARA EL FILTRO DE PROYECTOS -------------------------------------------------------

    function bp_mostrar_filtro_proyectos(){
        $("#content_filtro_proyecto").show(200);
        $("#btn_mostrar_filtro").hide();

        $(".check_etapa").iCheck('check');
        $(".check_estado").iCheck('check');
        $("#bp_check_filtrar_fecha").iCheck('uncheck');

        $(".cmb_filtro").find('option').prop('selected', false);
        $("#cmb_tipoProyecto").find('.option').prop('selected', true);
        $("#cmb_prioridad").find('.option').prop('selected', true);
        $(".cmb_filtro").trigger("chosen:updated");

    }

    function bp_cancelar_filtro(){
        $("#content_filtro_proyecto").hide(200);
        $("#btn_mostrar_filtro").show();
    }

    function bp_seleccionarCombo(cmb){
        var option_sel= $(cmb).find('option:selected');
        var valor_sel=$(option_sel).attr('data-id');
        if(valor_sel==0){
            $(option_sel).prop('selected', false);
            $(cmb).find('.option').prop('selected', true);
            $(cmb).trigger("chosen:updated");
        }
    }


    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#bp_check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha").show(200);
    });

    $('#bp_check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea
        $("#content_filtrar_fecha").hide(200);
    });

    function bp_filtrar_proyectos(){
       
        PNotify.removeAll();
        
        //etapas seleccionadas
            var arr_etapas = $(".check_etapa:checked").map(function(){
                return this.value;
            }).get();

            if(arr_etapas.length==0){
                alertNotificar("Seleccione al menos una etapa", "default"); return;
            }

        //fecha seleccionadas
            var check_filtrar_fecha = false;
            if($("#bp_check_filtrar_fecha").is(':checked')){
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

                    cargar_tabla_bitacora_proyecto(retorno.lista_proyectos);

                }

            },error: function(){
                alertNotificar('Error al realizar la solicitud, Inténtelo más tarde','error');
                vistacargando();
            }
        });



    }

    function cargar_tabla_bitacora_proyecto(lista_proyectos){
        
        $("#bp_tabla_proyectos_bitacora tbody").html("");
        $.each(lista_proyectos, function (i, proyecto){ 

            var icon_bit = `<center><i class="fa fa-asterisk"></i></center> `;
            if(proyecto.vitacoras_proyecto.length>0){
                icon_bit = (`
                    <span class="con_act">
                        <button class="btn btn-warning btn-sm btn_act" id="btnver_${proyecto.idcon_proyecto}" data-id="${proyecto.idcon_proyecto}"><i class="fa fa-eye"></i></button> 
                        <label class="lbvermas" for="btnver_${proyecto.idcon_proyecto}">Ver</label>
                    </span>
                `);
            }

            var depart_asig = "";
            $.each(proyecto.dep_responsable, function (index, dep_responsable){
                depart_asig = depart_asig+(`<li style="margin-right: 4px;"><a class="pull-left border-aero icon_respon" data-toggle="tooltip" data-original-title="${dep_responsable.departamento.nombre}"> <i class="fa fa-institution aero"></i></a></li>`);
            });

            var html_estado = "";            
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

            boton_solicitud = "";

            if(proyecto.reprogramar=="S"){
                boton_solicitud = (`
                    <button onclick="cancelar_solicitud_reprogramacion_pro('${proyecto.idcon_proyecto_encrypt}')" data-toggle="tooltip" 
                        data-original-title="Cancelar solicitud de reprogramación del proyecto" data-placement="top" class="btn btn-danger btn-xs" style="margin-bottom: 0px;">
                        <i class="fa fa-times fa_sm"></i>
                    </button>                
                `);

            }else{
                boton_solicitud = (`
                    <button onclick="solicitar_reprogramacion_pro('${proyecto.idcon_proyecto_encrypt}')" data-toggle="tooltip" 
                        data-original-title="Solicitar reprogramación del proyecto" data-placement="top" class="btn btn-warning btn-xs" style="margin-bottom: 0px;">
                        <i class="fa fa-refresh fa_sm"></i> 
                    </button>
                `);
            }

            $("#bp_tabla_proyectos_bitacora tbody").append(`
                <tr id="tdproyecto_${proyecto.idcon_proyecto}">
                    <td>${icon_bit}</td>
                    <td>
                        <a>${proyecto.descripcion}</a><br>
                        <small>Creado ${proyecto.fechaCreacion}</small>
                    </td>
                    <td>
                        <span style="display: flex; line-height: inherit;"><i class="fa fa-tag" style="color: green"></i>     <b style="padding: 0px 2px 0px 3px;">Tipo: </b>${proyecto['tipo_proyecto']['descripcion']}</span>
                        <span style="display: flex; line-height: inherit;"><i class="fa fa-clone" style="color: orange"></i>  <b style="padding: 0px 2px 0px 3px;">Prioridad: </b>${proyecto['prioridad']['descripcion']}</span>
                        <span style="display: flex; line-height: inherit;"><i class="fa fa-group" style="color: #061079"></i> <b style="padding: 0px 2px 0px 3px;">Componente: </b> ${proyecto['componente']['descripcion']}</span>
                    </td>
                    <td>
                        <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Del: </b> <span style="width: max-content; line-height: inherit;">${proyecto.fechaInicio}</span></span>
                        <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Al: </b>  <span style="width: max-content; line-height: inherit;">${proyecto.fechaFin}</span></span>    
                    </td>
                    <td><ul class="list-inline">${depart_asig}</ul></td>
                    <td>${html_estado}</td>
                    <td>
                        <center>
                            <button onclick="bp_gestion_bitacora_proyecto('${proyecto.idcon_proyecto_encrypt}')" class="btn btn-success btn-xs" style="margin: 0px;" data-toggle="tooltip" data-original-title="Gestionar Bitácora del Proyecto" data-placement="top">
                                <i class="fa fa-comments-o fa_sm"></i> 
                            </button>
                            <button onclick="bp_update_etapa_proyecto('${proyecto.idcon_proyecto_encrypt}')" class="btn btn-info btn-xs" style="margin: 0px;" data-toggle="tooltip" data-original-title="Gestionar Información del Proyecto" data-placement="top">
                                <i class="fa fa-edit fa_sm"></i> 
                            </button>
                            <button onclick="mostrar_detalle_proyecto('${proyecto.idcon_proyecto_encrypt}')" data-toggle="tooltip" data-original-title="Detalle general del proyecto" data-placement="top" class="btn btn-primary btn-xs" style="margin-bottom: 0px;">
                                <i class="fa fa-desktop fa_sm"></i> 
                            </button>
                            ${boton_solicitud}
                        </center>
                    </td>
                </tr>
            `);

            $.each(proyecto.vitacoras_proyecto, function (i2, bitacora){

                var boton = "";
                if(bitacora.evidencia!=null && bitacora.evidencia != ""){
                    boton = (`
                        <a href="/controlProyecto/bitacoraProyecto/descargarEvidencia/${bitacora.idcon_vitacora_proyecto_encrypt}" target="_blank" data-toggle="tooltip" data-placement="right" data-original-title="Agregado por: ${bitacora.us001_agrega.name}">
                            <i class="fa fa-paperclip" style="display: initial;"></i> <span style="text-decoration: underline; line-height: inherit;"> ${bitacora.descripcion} - ${bitacora.evidencia}</span> <br>
                            <span class="date_vitacora" style="line-height: inherit;">${bitacora.fecha_reg_letra}</span>
                        </a><br>              
                    `);
                }else{
                    boton = (`
                        <a target="_blank" data-toggle="tooltip" data-placement="right" data-original-title="Agregado por: ${bitacora.us001_agrega.name}" style="cursor: help;">
                            <i class="fa fa-comments-o" style="display: initial;"></i> <span style="line-height: inherit;"> ${bitacora.descripcion}</span> <br>
                            <span class="date_vitacora" style="line-height: inherit;">${bitacora.fecha_reg_letra}</span>
                        </a><br>
                    `);
                }

                $(`#tdproyecto_${proyecto.idcon_proyecto}`).after(`
                    <tr class="bitacora bitacora_${proyecto.idcon_proyecto}">
                        <td colspan="1"></td>
                        <td colspan="6">
                            ${boton}
                        </td>
                    </tr>
                `);
            });

            $('[data-toggle="tooltip"]').tooltip();

        });

    }



//---------------------------------------------------------------------------------------------------------//
//*********************** FUNCIONES PARA LA GESTION DE BITACORAS ******************************************//
//---------------------------------------------------------------------------------------------------------//


    function bp_gestion_bitacora_proyecto(idcon_proyecto_encrypt){
                
        $(".textob_conten").html("");
        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/bitacoraProyecto/${idcon_proyecto_encrypt}`, function(retorno){
            vistacargando();
            if(!retorno.error){                
                
                //cargamos los datos de la actividad y proyecto
                $("#infob_proyecto").html(retorno.proyecto.descripcion);
                $("#infob_fecha_proyecto").html(retorno.proyecto.fechaInicio+" - "+retorno.proyecto.fechaFin);

                //cargamos los datos formulario
                    $("#input_id_proyecto").val(retorno.proyecto.idcon_proyecto_encrypt);
                    $("#bp_descripcion").val("");
                    var btn = $("#bp_evidencia");
                    $(btn).parent().siblings('input').val($(btn).parent().prop('title'));
                    $(btn).val(null); // limpiamos el archivo                   
                    $(`#bp_etapa[data-id=et_${retorno.proyecto.idcon_etapa}]`).prop('selected', true);
                
                //cargamos la tabla de bitacoras
                $("#bp_tabla_vitacoras_usuario tbody").html(`
                    <tr><td colspan="4"><center><h3 style="margin:40px; 0px;">Cargando Datos...</h3></center></td></tr>
                `);

                $("#modal_gestion_bitacora_pro").modal("show");

                setTimeout(() => {
                    cargar_tabla_bitacorasPro(retorno.lista_bitacoras);
                }, 500);

            }else{
                vistacargando();
                alertNotificar(retorno.mensaje, retorno.status);
            }
        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo realizar la petición, por favor intete más tarde.");
        });
        
    }

    function cargar_tabla_bitacorasPro(lista_bitacoras){

        var idtabla = "bp_tabla_vitacoras_usuario";
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "asc" ]],
            pageLength: 5,
            sInfoFiltered:false,
            "language": lenguajeTabla,
            data: lista_bitacoras,
            columnDefs: [
                { className: "", targets: 0 },
                { className: "", targets: 1 },
                { className: "", targets: 2 },
                { className: "", targets: 3 },
            ],
            columns:[
                {data: "descripcion" },
                {data: "fechaRegistro" },
                {data: "evidencia", render : function (item, type, bitacora){
                    if(bitacora.evidencia==null || bitacora.evidencia==""){
                        return `Sin Evidencia`;
                    }
                    return `<a href="/controlProyecto/bitacoraProyecto/descargarEvidencia/${bitacora.idcon_vitacora_proyecto_encrypt}" target="_blank">${bitacora.evidencia}</a>`;
                }},
                {data: "descripcion", render : function (item, type, bitacora){
                    return `<button class="btn btn-danger btn-xs" onclick="eliminar_bitacora_proyecto('${bitacora.idcon_vitacora_proyecto_encrypt}')" style="margin:0px;">
                                <i class="fa fa-trash"></i> Eliminar
                           </button>`;
                }}
            ],
            "rowCallback": function( row, proyecto, index ){
                // $('td', row).eq(0).html(index+1);                
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

    $("#frm_gestion_bitacora_proy").submit(function(event){
        
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
                var btn_submit = $(formulario).find('[type=submit]');
                var txt_submit = $(btn_submit).html();
                $(formulario).addClass('disabled_content');
                $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);
                
                $.ajax({
                    url: `/controlProyecto/bitacoraProyecto`,
                    method: "POST",
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    success: function(retorno){
                        // si es completado                    
                        $(formulario).removeClass('disabled_content');
                        $(btn_submit).html(txt_submit);
                        alertNotificar(retorno.mensaje, retorno.status);

                        if(!retorno.error){                                                      
                            
                            cargar_tabla_bitacora_proyecto(retorno.lista_proyectos);
                            cargar_tabla_bitacorasPro(retorno.lista_bitacoras);

                            //limpiamos el formulario                 
                            $("#bp_descripcion").val("");
                            var btn = $("#bp_evidencia");
                            $(btn).parent().siblings('input').val($(btn).parent().prop('title'));
                            $(btn).val(null); // limpiamos el archivo

                        }
                    },
                    error: function(error){                    
                        $(formulario).removeClass('disabled_content');
                        $(btn_submit).html(txt_submit);
                        alertNotificar("No se pudo registrar la bitácora, por favor intente más tarde.");                        
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });


    
    function eliminar_bitacora_proyecto(idcon_vitacora_proyecto_encrypt){
        
        swal({
            title: "",
            text: "¿Está seguro de eliminar la bitácora?",
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
                    url: '/controlProyecto/bitacoraProyecto/'+idcon_vitacora_proyecto_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            cargar_tabla_bitacora_proyecto(retorno.lista_proyectos);
                            cargar_tabla_bitacorasPro(retorno.lista_bitacoras);
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo eliminar la bitácora, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
        
    }

    
    $("#bp_tabla_proyectos_bitacora").delegate(".btn_act", "click", function(){ console.clear();
        data_id = $(this).attr("data-id");        
        if($(this).find('i').hasClass('fa-eye')){
            
            $(this).parents('tr').siblings('.bitacora').hide();            
            $("#bp_tabla_proyectos_bitacora").find('.fa-minus').addClass('fa-eye');
            $("#bp_tabla_proyectos_bitacora").find('.fa-minus').removeClass('fa-minus');

            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-minus');
            $(this).parents('tr').siblings('.bitacora_'+data_id).show(200);
        }else{
            $(this).find('i').removeClass('fa-minus');
            $(this).find('i').addClass('fa-eye');
            $(this).parents('tr').siblings('.bitacora_'+data_id).hide();
        }
    });

    
    //FUNCIONES PARA ACTUALIZAR EL ESTADO DEL PROYECTO
        function bp_update_etapa_proyecto(idcon_proyecto_encrypt){

            $(".textob_conten").html("");
            vistacargando("M", "Espere...");
            $.get(`/controlProyecto/bitacoraProyecto/${idcon_proyecto_encrypt}`, function(retorno){
                vistacargando();
                if(!retorno.error){                
                    
                    //cargamos los datos de la actividad y proyecto
                    $("#infob_proyecto2").html(retorno.proyecto.descripcion);
                    $("#infob_fecha_proyecto2").html(retorno.proyecto.fechaInicio+" - "+retorno.proyecto.fechaFin);

                    //cargamos los datos formulario
                        $("#input_id_proyecto2").val(retorno.proyecto.idcon_proyecto_encrypt);                         
                        $(`#bp_etapa option[data-id=et_${retorno.proyecto.idcon_etapa}]`).prop('selected', true);
                        $("#modal_update_pro").modal("show");

                }else{
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);
                }
            }).fail(function(){
                vistacargando();
                alertNotificar("No se pudo realizar la petición, por favor intete más tarde.");
            });
        }

        $("#frm_update_proy").submit(function(event){
        
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
                    var btn_submit = $(formulario).find('[type=submit]');
                    var txt_submit = $(btn_submit).html();
                    $(formulario).addClass('disabled_content');
                    $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);
                    
                    $.ajax({
                        url: `/controlProyecto/updateProyecto`,
                        method: "POST",
                        data: FrmData,
                        dataType: 'json',
                        contentType:false,
                        cache:false,
                        processData:false,
                        success: function(retorno){
                            // si es completado                    
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar(retorno.mensaje, retorno.status);
    
                            if(!retorno.error){                                                      
                                
                                cargar_tabla_bitacora_proyecto(retorno.lista_proyectos);
                                if(retorno.ocultar == true){
                                    $("#modal_update_pro").modal("hide");
                                }
    
                            }
                        },
                        error: function(error){                    
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar("No se pudo registrar la bitácora, por favor intente más tarde.");                        
                        }
                    }); 
    
                }
    
                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 
    
        });
    



    // FUNCION PARA SELECCIONAR UN ARCHVO --------------

        $("#bp_evidencia").click(function(e){
            $(this).parent().siblings('input').val($(this).parent().prop('title'));
            this.value = null; // limpiamos el archivo
        });

        $("#bp_evidencia").change(function(e){

            if(this.files.length>0){ // si se selecciona un archivo
                archivo=(this.files[0].name);
                $(this).parent().siblings('input').val(archivo);
            }else{
                return;
            }

        });



//---------------------------------------------------------------------------------------------------------//
//*********************** FUNCIONES PARA REPROGRAMACIÓN DE PROYECTO ***************************************//
//---------------------------------------------------------------------------------------------------------//

    function solicitar_reprogramacion_pro(idcon_proyecto_encrypt){

        $(".textob_conten").html("");
        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/bitacoraProyecto/${idcon_proyecto_encrypt}`, function(retorno){
            vistacargando();
            if(!retorno.error){                
                
                //cargamos los datos de la actividad y proyecto
                $("#infob_proyecto3").html(retorno.proyecto.descripcion);
                $("#infob_fecha_proyecto3").html(retorno.proyecto.fechaInicio+" - "+retorno.proyecto.fechaFin);

                //cargamos los datos formulario
                    $("#input_id_proyecto3").val(retorno.proyecto.idcon_proyecto_encrypt);                         
                    $("#bt_fecha_fin").val(retorno.proyecto.fechaFin);
                    $("#modal_reprogramar_pro").modal("show");

            }else{
                vistacargando();
                alertNotificar(retorno.mensaje, retorno.status);
            }
        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo realizar la petición, por favor intete más tarde.");
        });
    }

    $("#frm_reprogramar_proy").submit(function(event){
            
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
                var btn_submit = $(formulario).find('[type=submit]');
                var txt_submit = $(btn_submit).html();
                $(formulario).addClass('disabled_content');
                $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);
                
                $.ajax({
                    url: `/controlProyecto/solcitarReprogramarPro`,
                    method: "POST",
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    success: function(retorno){
                        // si es completado
                        $(formulario).removeClass('disabled_content');
                        $(btn_submit).html(txt_submit);

                        alertNotificar(retorno.mensaje, retorno.status);                            
                        if(!retorno.error){                                                      
                            
                            cargar_tabla_bitacora_proyecto(retorno.lista_proyectos);
                            $("#modal_reprogramar_pro").modal("hide");           

                        }
                    },
                    error: function(error){
                        $(formulario).removeClass('disabled_content');
                        $(btn_submit).html(txt_submit);
                        alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");                    
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });

    
    function cancelar_solicitud_reprogramacion_pro(idcon_proyecto_encrypt){

        swal({
            title: "",
            text: "¿Está seguro que desea cancelar la solicitud?",
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
            if (isConfirm) {

                vistacargando("M","Espere...");
                $.get('/controlProyecto/cancelarSolicitudReprogramacionPro/'+idcon_proyecto_encrypt,function(retorno){
                    
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);                            

                    if(!retorno.error){                                                      
                        cargar_tabla_bitacora_proyecto(retorno.lista_proyectos);
                    }

                }).fail(function(){
                    alertNotificar("No se pudo realizar la solicitud, por favor intente más tarde.");     
                });        

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
            $('[data-toggle="tooltip"]').tooltip("hide");
        }); 
    }