

    function ra_gestion_revision_activida(idcon_actividad_encrypt){

        $(".textob_conten").html("");
        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/actividad/${idcon_actividad_encrypt}/edit`, function(retorno){
            vistacargando();
            if(!retorno.error){                
                
                $("#input_id_actividad").val(retorno.actividad.idcon_actividad_encrypt);
                //cargamos los datos de la actividad y proyecto
                $("#infob_proyecto").html(retorno.actividad.proyecto.descripcion);
                $("#infob_fecha_proyecto").html(retorno.actividad.proyecto.fechaInicio+" - "+retorno.actividad.proyecto.fechaFin);
                $("#infob_activiad").html(retorno.actividad.descripcion);
                $("#infob_fecha_activiad").html(retorno.actividad.fechaInicio+" - "+retorno.actividad.fechaFin);
                $("#infob_responsable").html(retorno.actividad.usuario_responsable.name);
                $("#infob_dep_resp").html(retorno.actividad.departamento_responsable.nombre);

                //cargamos los datos formulario
                    $("#ra_observacion").val(retorno.actividad.observacion);
                    $(`#ra_estado option[data-id=er_${retorno.actividad.idcon_estado_revision}]`).prop('selected', true);
                    $("#modal_revision_act").modal("show");

            }else{
                vistacargando();
                alertNotificar(retorno.mensaje, retorno.status);
            }
        }).fail(function(){
            vistacargando();
            alertNotificar("No se pudo realizar la petición, por favor intete más tarde.");
        });
    }

    $("#frm_revision_act").submit(function(event){
            
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
                    url: `/controlProyecto/updateRevision`,
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
                            
                            cargar_tabla_actividades_revision(retorno.lista_actividades);
                            // if(retorno.ocultar){
                            //     $("#modal_update_actividad").modal("hide");
                            // }

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


    function cargar_tabla_actividades_revision(lista_actividades){

        $("#ga_tabla_actividades_revision tbody").html("");
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

            var responsables = "";
            if(actividad.departamento_receptor != null){
                responsables = (`
                    <ul class="list-inline" style="margin-bottom: 0px;">
                        <li><a class="pull-left border-aero icon_respon" data-toggle="tooltip" data-original-title="${actividad.departamento_responsable.nombre}"> <i class="fa fa-institution aero"></i></a></li>
                        <li><a class="pull-left border-aero icon_respon_user" data-toggle="tooltip" data-original-title="${actividad.usuario_responsable.name}"> <i class="fa fa-user aero"></i></a></li>
                    </ul>
                `);
            }

            color_estado = "danger";
            estado_descripcion = "Pendiente";
            if(actividad.estado_revision!=null){
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
                estado_descripcion = actividad.estado_revision.descripcion;
            }

            $("#ga_tabla_actividades_revision tbody").append(`
                <tr id="actividad_${actividad.idcon_actividad}">
                    <td>${icon_bit}</td>
                    <td>
                        <a>${actividad.descripcion}</a><br>
                        <small><b>Proyecto:</b> ${actividad.proyecto.descripcion}</small>
                    </td>
                    <td>${actividad.codigoActividad}</td> 
                    <td>${actividad.fechaInicio} - ${actividad.fechaFin}</td>
                    <td>${responsables}</td>
                    <td>${actividad.porcentajeActividad}%</td> 
                    <td>${actividad.porcentajeAvance}%</td>
                    <td><button type="button" class="btn btn-${color_estado} btn-xs btn_status">${estado_descripcion}</button> </td>
                    <td>
                        <center>
                            <button onclick="ra_gestion_revision_activida('${actividad.idcon_actividad_encrypt}')" class="btn btn-info btn-xs" style="margin: 0px;" data-toggle="tooltip" data-original-title="Actualizar revisión de la actividad" data-placement="top">
                                <i class="fa fa-edit fa_sm"></i> 
                            </button>
                            <button onclick="mostrar_detalle_proyecto('${actividad.idcon_proyecto_encrypt}')" data-toggle="tooltip" data-original-title="Detalle general del proyecto" data-placement="top" class="btn btn-primary btn-xs" style="margin-bottom: 0px;">
                                <i class="fa fa-desktop fa_sm"></i> 
                            </button>
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

    $("#ga_tabla_actividades_revision").delegate(".btn_act", "click", function(){
        data_id = $(this).attr("data-id");        
        if($(this).find('i').hasClass('fa-eye')){
            
            $(this).parents('tr').siblings('.bitacora').hide();            
            $("#ga_tabla_actividades_revision").find('.fa-minus').addClass('fa-eye');
            $("#ga_tabla_actividades_revision").find('.fa-minus').removeClass('fa-minus');

            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-minus');
            $(this).parents('tr').siblings('.bitacora_'+data_id).show(200);
        }else{
            $(this).find('i').removeClass('fa-minus');
            $(this).find('i').addClass('fa-eye');
            $(this).parents('tr').siblings('.bitacora_'+data_id).hide();
        }
    });