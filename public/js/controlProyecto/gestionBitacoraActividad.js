

    function rb_gestionar_bitacora(idcon_actividad_encrypt){
        
        $(".textob_conten").html("");
        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/bitacoraActividad/${idcon_actividad_encrypt}`, function(retorno){
            vistacargando();
            if(!retorno.error){                
                
                //cargamos los datos de la actividad y proyecto
                $("#infob_proyecto").html(retorno.actividad.proyecto.descripcion);
                $("#infob_fecha_proyecto").html(retorno.actividad.proyecto.fechaInicio+" - "+retorno.actividad.proyecto.fechaFin);
                $("#infob_activiad").html(retorno.actividad.descripcion);
                $("#infob_fecha_activiad").html(retorno.actividad.fechaInicio+" - "+retorno.actividad.fechaFin);

                //cargamos los datos formulario
                    $("#input_id_actividad").val(retorno.actividad.idcon_actividad_encrypt);
                    $("#bt_descripcion").val("");
                    var btn = $("#bt_evidencia");
                    $(btn).parent().siblings('input').val($(btn).parent().prop('title'));
                    $(btn).val(null); // limpiamos el archivo
                
                //cargamos la tabla de bitacoras
                $("#gb_tabla_vitacoras_usuario tbody").html(`
                    <tr><td colspan="4"><center><h3 style="margin:40px; 0px;">Cargando Datos...</h3></center></td></tr>
                `);

                $("#modal_gestion_bitacora").modal("show");

                setTimeout(() => {
                    cargar_tabla_bitacoras(retorno.lista_bitacoras);
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


    $("#frm_gestion_bitacora").submit(function(event){
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
                    url: `/controlProyecto/bitacoraActividad`,
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
                            
                            cargar_tabla_bitacora_actividades(retorno.lista_actividades);
                            cargar_tabla_bitacoras(retorno.lista_bitacoras);

                            //limpiamos el formulario                 
                            $("#bt_descripcion").val("");
                            var btn = $("#bt_evidencia");
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


    function eliminar_bitacora_actividad(idcon_vitacora_actividad_encrypt){
        
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
                    url: '/controlProyecto/bitacoraActividad/'+idcon_vitacora_actividad_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            cargar_tabla_bitacora_actividades(retorno.lista_actividades);
                            cargar_tabla_bitacoras(retorno.lista_bitacoras);
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

    function cargar_tabla_bitacoras(lista_bitacoras){

        var idtabla = "gb_tabla_vitacoras_usuario";
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 1, "asc" ]],
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
                    return `<a href="/controlProyecto/bitacoraActividad/descargarEvidencia/${bitacora.idcon_vitacora_actividad_encrypt}" target="_blank">${bitacora.evidencia}</a>`;
                }},
                {data: "descripcion", render : function (item, type, bitacora){
                    return `<button class="btn btn-danger btn-xs" onclick="eliminar_bitacora_actividad('${bitacora.idcon_vitacora_actividad_encrypt}')" style="margin:0px;">
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


    function cargar_tabla_bitacora_actividades(lista_actividades){

        $("#ga_tabla_actividades_bitacora tbody").html("");
        $.each(lista_actividades, function (i, actividad){
            
            var icon_bit = `<center><i class="fa fa-asterisk"></i></center> `;
            if(actividad.vitacoras_actividad.length>0){
                icon_bit = (`
                    <span class="con_act">
                        <button class="btn btn-warning btn-sm btn_act" id="btnver_${actividad.idcon_actividad}" data-id="${actividad.idcon_actividad}"><i class="fa fa-eye"></i></button> 
                        <label class="lbvermas" for="btnver_${actividad.idcon_actividad}">Ver</label>
                    </span>
                `);
            }

            var dep_receptor = "";
            if(actividad.departamento_receptor != null){
                dep_receptor = (`
                    <ul class="list-inline" style="margin-bottom: 0px;">
                        <li><a class="pull-left border-aero icon_respon" data-toggle="tooltip" data-original-title="${actividad.departamento_receptor.nombre}"> <i class="fa fa-institution aero"></i></a></li>
                    </ul>
                `);
            }

            color_estado = "";
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

            boton_solicitud = "";
            if(actividad.reprogramar=="S"){
                boton_solicitud = (`
                    <button onclick="cancelar_solicitar_reprogramacion('${actividad.idcon_actividad_encrypt}')" data-toggle="tooltip" 
                        data-original-title="Cancelar solicitud de reprogramación de la actividad" data-placement="top" class="btn btn-danger btn-xs" style="margin-bottom: 0px;">
                        <i class="fa fa-times fa_sm"></i>
                    </button>
                `);
            }else{
                boton_solicitud = (`
                    <button onclick="solicitar_reprogramacion_actividad('${actividad.idcon_actividad_encrypt}')" data-toggle="tooltip" 
                        data-original-title="Solicitar reprogramación de la actividad" data-placement="top" class="btn btn-warning btn-xs" style="margin-bottom: 0px;">
                        <i class="fa fa-refresh fa_sm"></i> 
                    </button>
                `);
            }

            $("#ga_tabla_actividades_bitacora tbody").append(`
                <tr id="actividad_${actividad.idcon_actividad}">
                    <td>${icon_bit}</td>
                    <td>
                        <a>${actividad.descripcion}</a><br>
                        <small><b>Proyecto:</b> ${actividad.proyecto.descripcion}</small>
                    </td>
                    <td>${actividad.codigoActividad}</td> 
                    <td>
                        <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Del: </b> <span style="width: max-content; line-height: inherit;">${actividad.fechaInicio}</span></span>
                        <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Al: </b>  <span style="width: max-content; line-height: inherit;">${actividad.fechaFin}</span></span>    
                    </td>
                    <td>${dep_receptor}</td>
                    <td>${actividad.porcentajeActividad}%</td> 
                    <td>${actividad.porcentajeAvance}%</td>
                    <td><button type="button" class="btn btn-${color_estado} btn-xs btn_status">${actividad.etapa.descripcion}</button> </td>
                    <td>
                        <center>
                            <button onclick="rb_gestionar_bitacora('${actividad.idcon_actividad_encrypt}')" class="btn btn-success btn-xs" style="margin: 0px;" data-toggle="tooltip" data-original-title="Gestionar bitácora de la actividad" data-placement="top">
                                <i class="fa fa-comments-o fa_sm"></i> 
                            </button>
                            <button onclick="rb_gestionar_progreso_actividad('${actividad.idcon_actividad_encrypt}')" class="btn btn-info btn-xs" style="margin: 0px;" data-toggle="tooltip" data-original-title="Gestionar progreso de la actividad" data-placement="top">
                                <i class="fa fa-edit fa_sm"></i> 
                            </button>
                            <button onclick="mostrar_detalle_proyecto('${actividad.idcon_proyecto_encrypt}')" data-toggle="tooltip" data-original-title="Detalle general del proyecto" data-placement="top" class="btn btn-primary btn-xs" style="margin-bottom: 0px;">
                                <i class="fa fa-desktop fa_sm"></i> 
                            </button>
                            ${boton_solicitud}
                        </center>
                    </td>
                </tr>
            `);

            $.each(actividad.vitacoras_actividad, function (i2, bitacora){ 

                var boton = "";
                if(bitacora.evidencia!=null && bitacora.evidencia != ""){
                    boton = (`
                        <a href="/controlProyecto/bitacoraActividad/descargarEvidencia/${bitacora.idcon_vitacora_actividad_encrypt}" target="_blank" data-toggle="tooltip" data-placement="right" data-original-title="Agregado por: ${bitacora.us001_agrega.name}">
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

                $(`#actividad_${actividad.idcon_actividad}`).after(`
                    <tr class="bitacora bitacora_${actividad.idcon_actividad}">
                        <td colspan="1"></td>
                        <td colspan="8">
                            ${boton}
                        </td>
                    </tr>
                `);
            });

            $('[data-toggle="tooltip"]').tooltip();

        });

    }

    $("#ga_tabla_actividades_bitacora").delegate(".btn_act", "click", function(){
        data_id = $(this).attr("data-id");        
        if($(this).find('i').hasClass('fa-eye')){
            
            $(this).parents('tr').siblings('.bitacora').hide();            
            $("#ga_tabla_actividades_bitacora").find('.fa-minus').addClass('fa-eye');
            $("#ga_tabla_actividades_bitacora").find('.fa-minus').removeClass('fa-minus');

            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-minus');
            $(this).parents('tr').siblings('.bitacora_'+data_id).show(200);
        }else{
            $(this).find('i').removeClass('fa-minus');
            $(this).find('i').addClass('fa-eye');
            $(this).parents('tr').siblings('.bitacora_'+data_id).hide();
        }
    });


    //FUNCIONES PARA ACTUALIZAR EL PROGRESO DE LA ACTIVIDAD

        function rb_gestionar_progreso_actividad(idcon_actividad_encrypt){

            $(".textob_conten").html("");
            vistacargando("M", "Espere...");
            $.get(`/controlProyecto/bitacoraActividad/${idcon_actividad_encrypt}`, function(retorno){
                vistacargando();
                if(!retorno.error){                
                    
                    $("#input_id_actividad2").val(retorno.actividad.idcon_actividad_encrypt);
                    //cargamos los datos de la actividad y proyecto
                    $("#infob_proyecto2").html(retorno.actividad.proyecto.descripcion);
                    $("#infob_fecha_proyecto2").html(retorno.actividad.proyecto.fechaInicio+" - "+retorno.actividad.proyecto.fechaFin);
                    $("#infob_activiad2").html(retorno.actividad.descripcion);
                    $("#infob_fecha_activiad2").html(retorno.actividad.fechaInicio+" - "+retorno.actividad.fechaFin);

                    //cargamos los datos formulario

                        $("#bt_porcentajeA").val(retorno.actividad.porcentajeAvance);
                        $(`#bt_etapa option[data-id=et_${retorno.actividad.idcon_etapa}]`).prop('selected', true);
                        $("#modal_update_actividad").modal("show");

                }else{
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);
                }
            }).fail(function(){
                vistacargando();
                alertNotificar("No se pudo realizar la petición, por favor intete más tarde.");
            });
        }

        $("#frm_update_actividad").submit(function(event){
            
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
                        url: `/controlProyecto/progresoActividadUpdate`,
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
                                
                                cargar_tabla_bitacora_actividades(retorno.lista_actividades);
                                if(retorno.ocultar){
                                    $("#modal_update_actividad").modal("hide");
                                }
    
                            }
                        },
                        error: function(error){
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar("No se pudo actualizar el registro, por favor intente más tarde.");                    
                        }
                    }); 
    
                }
    
                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 
    
        });

    //FUNCIONES PARA REPROGRAMAR UNA ACTIVDAD ----------

        function solicitar_reprogramacion_actividad(idcon_actividad_encrypt){

            $(".textob_conten").html("");
            vistacargando("M", "Espere...");
            $.get(`/controlProyecto/bitacoraActividad/${idcon_actividad_encrypt}`, function(retorno){
                vistacargando();
                if(!retorno.error){                
                    
                    $("#input_id_actividad3").val(retorno.actividad.idcon_actividad_encrypt);
                    //cargamos los datos de la actividad y proyecto
                    $("#infob_proyecto3").html(retorno.actividad.proyecto.descripcion);
                    $("#infob_fecha_proyecto3").html(retorno.actividad.proyecto.fechaInicio+" - "+retorno.actividad.proyecto.fechaFin);
                    $("#infob_activiad3").html(retorno.actividad.descripcion);
                    $("#infob_fecha_activiad3").html(retorno.actividad.fechaInicio+" - "+retorno.actividad.fechaFin);

                    //cargamos los datos formulario

                        $("#bt_fecha_fin").val(retorno.actividad.fechaFin);                       
                        $("#modal_reprogramar_actividad").modal("show");

                }else{
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);
                }
            }).fail(function(){
                vistacargando();
                alertNotificar("No se pudo realizar la petición, por favor intete más tarde.");
            });

        }

        $("#frm_reprogramar_actividad").submit(function(event){
            
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
                        url: `/controlProyecto/solcitarReprogramarActiviad`,
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
                                
                                cargar_tabla_bitacora_actividades(retorno.lista_actividades);            
                                $("#modal_reprogramar_actividad").modal("hide");           
    
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

        function cancelar_solicitar_reprogramacion(idcon_actividad_encrypt){

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
                    $.get('/controlProyecto/cancelarSolicitudReprogramacionActividad/'+idcon_actividad_encrypt,function(retorno){
                        
                        vistacargando();
                        alertNotificar(retorno.mensaje, retorno.status);                            

                        if(!retorno.error){                                                      
                            cargar_tabla_bitacora_actividades(retorno.lista_actividades);
                        }

                    }).fail(function(){
                        alertNotificar("No se pudo realizar la solicitud, por favor intente más tarde.");     
                    });        
    
                }
    
                sweetAlert.close();   // ocultamos la ventana de pregunta
                $('[data-toggle="tooltip"]').tooltip("hide");
            }); 
        }

    // FUNCION PARA SELECCIONAR UN ARCHVO --------------

        $("#bt_evidencia").click(function(e){
            $(this).parent().siblings('input').val($(this).parent().prop('title'));
            this.value = null; // limpiamos el archivo
        });

        $("#bt_evidencia").change(function(e){

            if(this.files.length>0){ // si se selecciona un archivo
                archivo=(this.files[0].name);
                $(this).parent().siblings('input').val(archivo);
            }else{
                return;
            }

        });