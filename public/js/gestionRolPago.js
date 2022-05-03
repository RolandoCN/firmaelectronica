
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
        var idtabla = "tabla_periodo_regimen";
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

       estilosTabla(idtabla, "P");

       filtrarTabla();

    });


    // FUNCIÓN PARA CARGAR ESTILOS DE LA TABLA
        function estilosTabla(idtabla, selected){

            var option_selected=[];
            option_selected["T"]="";
            option_selected["P"]="";
            option_selected["C"]="";
            option_selected[`${selected}`]="selected";


            // para posicionar el input del filtro
            $(`#${idtabla}_filter`).css('float','left');
            $(`#${idtabla}_filter`).children('label').css('width', '100%');
            // $(`#${idtabla}_filter`).parent().css('padding-left','0');
            $(`#${idtabla}_wrapper`).css('margin-top','10px');
            $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
            //buscamos las columnas que deceamos que sean las mas angostas
            $(`#${idtabla}`).find('.col_sm').css('width','10px');
            //agregar un boton al lado de la barra de busqueda
            // $(`#${idtabla}_filter`).parent().after(`
            //     <div class="col-sm-6 inputsearch">
            //         <div class="dataTables_filter" style="float: left;">
            //             <label style="width: 100%;">
            //                 Estado Firma: 
            //                 <select id="cmb_filtrar_estado_roles" onchange="filtrarTabla()" class="form-control input-sm" style="width: 100%; margin-left: 1px; display: inline-block;">
            //                     <option value="T" ${option_selected["T"]}>Todos</option>
            //                     <option value="P" ${option_selected["P"]}>Pendientes</option>
            //                     <option value="F" ${option_selected["C"]}>Completados</option>
            //                 </select>
            //             </label>
            //         </div>
            //     </div>
            // `);
        }

    
    // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#tabla_periodo_regimen').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#tabla_periodo_regimen').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });


    //FUNCION PARA FISTRAR LA TABLA DE PERIODOS REGIMEN

        function filtrarTabla(){

            var filtro = $("#cmb_filtrar_estado_roles").val();            
            var num_col = $("#tabla_periodo_regimen thead tr th").length; //obtenemos el numero de columnas de la tabla
            $("#tabla_periodo_regimen tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);

            $.get("/rolesPago/getDetallePeriodo", function(retorno){
                // vistacargando();
                
                var index = 0;

                var idtabla = "tabla_periodo_regimen";
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
                    data: retorno.listaPeriodos,
                    columnDefs: [
                        {  className: "sorting_desc", targets: 0 },
                        {  className: "sorting_desc", targets: 1 },
                        {  className: "sorting_desc", targets: 2 },
                        {  className: "sorting_desc", targets: 3 },
                    ],
                    columns:[
                        {data: "periodo_regimen", render : function (campo, type, periodo){ 
                            index++;
                            return `<center style="user-select: none;">${index}</center>`;
                        }},
                        {data: "periodo_regimen", render : function (campo, type, periodo){ 
                            var retornar = "";
                            if(periodo.num_generados >= periodo.total_generar && periodo.total_generar!=0 ){
                                retornar = `<span style="min-width: 90px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Completado</span>`;
                            }else{
                                retornar = (`
                                    <label for="ckeckper_${index}" style="min-width: 90px !important; margin-bottom: 0px;">
                                        <input id="ckeckper_${index}" type="checkbox" class="flat check_documento" value="${periodo.trol02codi_encrypt}">
                                        <span style="padding-top: 5px;"> Generar</span>
                                    </label>
                                `);
                            }
                            return `<center style="user-select: none;">${retornar}</center>`;
                        }},
                        {data: "periodo_regimen" },
                        {data: "periodo_regimen", render : function (campo, type, periodo){                         
                            return `<center>${periodo.num_generados} generados de ${periodo.total_generar}</center>`;
                        }},
                    ],
                    "rowCallback": function( row, periodo, index ){    
                        //columna de fecha
                        $('td', row).eq(0).addClass('vert_center');
                        $('td', row).eq(1).addClass('vert_center');
                        $('td', row).eq(2).addClass('vert_center');
                        $('td', row).eq(3).addClass('vert_center');

                        $('td', row).eq(2).addClass('periodoinfo_'+periodo.trol02codi);
                    }
                });

                $('input').iCheck({
                    checkboxClass: 'icheckbox_flat-green'
                });

                estilosTabla(idtabla, filtro);

            }).fail(function(){
                
                alertNotificar("Error obtener la información", "error");
                $("#tabla_periodo_regimen tbody").html(`<tr><td colspan="${num_col}"><center>Ningún dato disponible en esta tabla</center></td></tr>`);  
                // vistacargando();

            });
        }


    // FUNCIÓN PARA COMPROBAR LA CONFIGURACIÓN DE LA FIRMA ELECTRÓNICA
    
        function firmarRolesPago(){

            $("#content_check_sinfirma").show();
            $("#ckeckp_nofirma").iCheck('uncheck');
            $("#cont_generando_roles").hide();
            $("#cont_roles_generados").hide();
            $("#cont_roles_no_generados").hide();
            $("#frm_firma_electronica_rolespago").show();
            $("#info_periodo_genrando").html("");
            $(".info_num_generados").html("");
            $("#btn_modal_cerrar").attr("disabled", false);

            // cargamos el porcentaje
            $("#porcentajeBar").attr("style", "width:0%");
            $("#porcentajeBar").html("0%");

            //verficamos si hay documentos seleccionados
                var per_selec_aux = $("#tbody_periodos").find(".check_documento:checked");
                if(per_selec_aux.length==0){
                    alertNotificar("Primero seleccione un periodo", "default"); return;
                }

            vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
            $.get("/rolesPago/verificarConfigFirmado/", function(retorno){
                vistacargando();
                $("#informacion_certificado").html("");

                if(!retorno.error){ // si no hay error

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar").html("");
                        // $("#titulo_firmar").html("¿Está seguro que desea generar y firmar los roles de pago?");
                    }

                    // verificiamos la vigencia del certificado
                    vertificado_vigente = false;
                    if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
                        vertificado_vigente = true;
                    }

                    // cargamos el input para subir el certificado
                    if(config_firma.archivo_certificado==true && vertificado_vigente==true){
                        $("#content_archivo_certificado").hide();
                    }else{
                        $("#content_archivo_certificado").show();
                    }

                    // cargamos el input para la contraseña
                    if(config_firma.clave_certificado==true && vertificado_vigente==true){
                        $("#content_clave_certificado").hide();                        
                    }else{
                        $("#content_clave_certificado").show();
                    }

                    //cargamos la informacion del certificado
                        if(config_firma.archivo_certificado==true){
                            color_mensaje_certificado = "icon_success";
                            mensaje_certificado = "Certificado vigente";
                            icono_mensaje_certificado = "fa fa-check-square";
                            if(config_firma.archivo_certificado==true && config_firma.dias_valido<=0){
                                color_mensaje_certificado = "icon_danger";
                                mensaje_certificado = "Certificado expirado";
                                icono_mensaje_certificado = "fa fa-times-circle";
                            }else if(config_firma.archivo_certificado==true && config_firma.dias_valido <= config_firma.dias_notific_expira){
                                color_mensaje_certificado = "icon_warning";
                                mensaje_certificado = "Certificado casi expirado";
                                icono_mensaje_certificado = "fa fa-warning";
                            }   
                            
                            $("#informacion_certificado").html(`
                                <div id="infoDepFlujGen_1" class="form-group infoDepFlujGen content_info_certificado" style="margin-bottom: 0px; margin-top: 16px;">
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <div class="tile-stats" style="margin-bottom: 0px; border-color: #cccccc;">
                                            <div class="icon ${color_mensaje_certificado}" style="font-size: 25px;"><i class="${icono_mensaje_certificado}"></i></div>
                                            <div class="count ${color_mensaje_certificado}" style="font-size: 20px;">${mensaje_certificado}</div>                                    
                                            <p>El certificado cargado es válido durante los siguientes <b>${config_firma.dias_valido} días</b>.</p>                                                                                
                                        </div>
                                        <hr style="margin-bottom: 2px;">                                        
                                    </div>
                                </div>
                            `);
                            
                        }

                    $("#input_clave_certificado").val("");
                    $("#text_archivo_certificado").val("No seleccionado");

                    //reiniciamos el icono de documento firmado
                    $("#icono_estado_firma").html('<span class="fa fa-times-circle"></span>');
                    $("#icono_estado_firma").parent().removeClass('btn_verde');
                    $("#icono_estado_firma").parent().addClass('btn_rojo');
                    $("#icono_estado_firma").parent().siblings('input').val("No seleccionado");
                    $("#btn_enviar_tramite").hide();

                    //mostramos la modal de la firma electrónica
                    $("#modal_firma_electronica").modal("show");                    
                    
                }else{
                    alertNotificar(retorno.mensaje, retorno.status);

                }
            }).fail(function(){
               
                vistacargando(); 
                alertNotificar("No se pudo completar la acción", "error");

            });
        
        }


    // FUNCION PARA FIRMAR ELECTRONICAMENTE DOCUMENTO -------------------

        var cant_generados = 0;
        var cant_iteraciones = 0;
        var total_generar = 0;  

        $("#frm_firma_electronica_rolespago").submit(function(e){ 
                
            e.preventDefault();
            
            //obtenemos los input seleccionados
                var per_selec_aux = $("#tbody_periodos").find(".check_documento:checked");
                if(per_selec_aux.length==0){
                    alertNotificar("Primero seleccione un periodo", "default"); return;
                }
                $("#contet_periodo_selec").html(""); //quitamos los antiguos
                $.each(per_selec_aux, function(index, periodo){
                    $("#contet_periodo_selec").append(`<input type="hidden" name="list_cod_periodo[]" value="${$(periodo).val()}">`);
                })
            //-------------------------------------------

            var FrmData = new FormData(this);
            // FrmData.append("zzzz","zxxxx0");
            $.ajaxSetup({
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            });
            
            vistacargando('M','Obteniendo Empleados...'); // mostramos la ventana de espera

            $.ajax({
                url: "/rolesPago/getRoles",
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                success: function(retorno){

                    vistacargando(); // ocultamos la ventana de espera                                                           

                    //obtenemos los codigos de periodo seleccionados
                    periodo_cod = 0;                    
                    lista_periodo_gen = [];
                    $.each(retorno.lista_empleados, function(index, item){
                        periodo_cod = index;
                        lista_periodo_gen.push(index);
                        return false;
                    });

                    //calculamos el total a generar
                    total_generar = 0;
                    $.each(retorno.lista_empleados, function(index, item){
                        total_generar = total_generar+item.length
                    });
      
                    $("#cont_generando_roles").show();
                    $("#cont_roles_generados").hide();
                    $("#cont_roles_no_generados").hide();
                    $("#frm_firma_electronica_rolespago").hide();
                    $("#info_periodo_genrando").html("");
                    $(".info_num_generados").html("");
                    $("#btn_modal_cerrar").attr("disabled", true);
                    $("#msj_gen_verif").html("Generando Roles de Pago");

                    // cargamos el porcentaje
                    $("#porcentajeBar").attr("style", "width:0%");
                    $("#porcentajeBar").html("0%");

                    cant_generados = 0;
                    cant_iteraciones = 0;
                    FrmData.append("data_lote",null);            
                    if(!retorno.error){                        
                        generarPorLotes(retorno.lista_empleados, 10, periodo_cod, lista_periodo_gen, 0, FrmData);
                    }
                    
                },
                error: function(error){
                    vistacargando(); // ocultamos la ventana de espera
                    alertNotificar("Error al obtener la información de los roles de pago", "error");
                    
                    $("#cont_generando_roles").hide();
                    $("#cont_roles_generados").hide();
                    $("#cont_roles_no_generados").hide();
                    $("#frm_firma_electronica_rolespago").show();
                    $("#info_periodo_genrando").html("");
                    $(".info_num_generados").html("");
                    $("#btn_modal_cerrar").attr("disabled", false);

                    // cargamos el porcentaje
                    $("#porcentajeBar").attr("style", "width:0%");
                    $("#porcentajeBar").html("0%");
                    
                }
            }); 
        });


    //FUNCION PARA ENVIAR POR LOTES LA DATA 

        function generarPorLotes(data, cantidad, periodo_cod, lista_periodo_gen, empleado_index, FrmData){

            $("#info_periodo_genrando").html($('.periodoinfo_'+periodo_cod).html());
            $(".info_num_generados").html(cant_generados);

            if(cant_generados==0){
                $("#msj_gen_verif").html("Verificando Roles de Pago Generados");
            }else{
                $("#msj_gen_verif").html("Generando Roles de Pago");
            }

            // cargamos el porcentaje     
            var porcentaje = (cant_iteraciones*100)/total_generar;
            porcentaje = parseInt(porcentaje);
            if(porcentaje>100){ porcentaje = 100; }         
            $("#porcentajeBar").attr("style", "width:"+porcentaje+"%");
            $("#porcentajeBar").html(porcentaje+"%");

            var data_lote = {
                data: data,
                cantidad: cantidad,
                periodo_cod: periodo_cod,
                lista_periodo_gen: lista_periodo_gen,
                empleado_index: empleado_index
            }

            FrmData.set("data_lote",JSON.stringify(data_lote));

            $.ajax({
                url: "/rolesPago/generarFirmar",
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                success: function(retorno){
                                                                                                     
                    if(!retorno.error){
                        if(!retorno.completado){
                            cant_generados = cant_generados+retorno.cant_generados;
                            cant_iteraciones = cant_iteraciones+retorno.cant_iteraciones;
                            generarPorLotes(data, retorno.cantidad, retorno.periodo_cod, retorno.lista_periodo_gen,retorno.empleado_index, FrmData);                            
                        }else{

                            $("#cont_generando_roles").hide();
                            $("#cont_roles_generados").show();
                            $("#cont_roles_no_generados").hide();
                            $("#frm_firma_electronica_rolespago").hide();
                            $("#info_periodo_genrando").html("");
                            $(".info_num_generados").html(cant_generados);
                            $("#btn_modal_cerrar").attr("disabled", false);

                            // cargamos el porcentaje                           
                            var porcentaje = (cant_iteraciones*100)/total_generar;
                            porcentaje = parseInt(porcentaje);
                            if(porcentaje>100){ porcentaje = 100; }                  
                            $("#porcentajeBar").attr("style", "width:"+porcentaje+"%");
                            $("#porcentajeBar").html(porcentaje+"%");

                            filtrarTabla();

                        }
                    }else{

                        alertNotificar(retorno.mensaje, retorno.status);
                        cant_generados = cant_generados+retorno.cant_generados;

                        $("#cont_generando_roles").hide();
                        $("#cont_roles_generados").hide();
                        $("#cont_roles_no_generados").show();
                        $("#frm_firma_electronica_rolespago").hide();
                        $("#info_periodo_genrando").html("");
                        $(".info_num_generados").html(cant_generados);
                        $("#btn_modal_cerrar").attr("disabled", false);

                        // cargamos el porcentaje
                        $("#porcentajeBar").attr("style", "width:0%");
                        $("#porcentajeBar").html("0%");

                        filtrarTabla();

                    }              
                    
                },
                error: function(error){
                    
                    alertNotificar("Error el intentar genera los roles de pago. Por favor, inténtelo más tarde.", "error");

                    $("#cont_generando_roles").hide();
                    $("#cont_roles_generados").hide();
                    $("#cont_roles_no_generados").hide();
                    $("#frm_firma_electronica_rolespago").show();
                    $("#info_periodo_genrando").html("");
                    $(".info_num_generados").html("");
                    $("#btn_modal_cerrar").attr("disabled", false);

                    // cargamos el porcentaje
                    $("#porcentajeBar").attr("style", "width:0%");
                    $("#porcentajeBar").html("0%");       

                }
            });

        }


//FUNCIÓN QUE SE EJECUTA AL SELECCIONAR UNA FILA (DOCUMENTOS)
    $('#tbody_periodos').delegate('.check_documento','ifChecked', function(event){
        $(this).parents('tr').addClass("fila_selec");
    });

    $('#tbody_periodos').delegate('.check_documento','ifUnchecked', function(event){
        $(this).parents('tr').removeClass("fila_selec");
    });



// FUNCION PARA SELECCIONAR UN ARCHVO --------------

    $(".seleccionar_archivo").click(function(e){
        $(this).parent().siblings('input').val($(this).parent().prop('title'));
        this.value = null; // limpiamos el archivo
    });

    $(".seleccionar_archivo").change(function(e){

        if(this.files.length>0){ // si se selecciona un archivo

            //verificamos si es un archivo p12
            if(this.files[0].type != "application/x-pkcs12"){
                alertNotificar("El archivo del certificado debe ser formato .p12", "default");
                this.value = null;
                return;
            }            

            archivo=(this.files[0].name);
            $(this).parent().siblings('input').val(archivo);
        }else{
            return;
        }

    });