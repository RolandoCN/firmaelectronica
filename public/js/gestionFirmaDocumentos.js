
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
        var idtabla = "tabla_documentos";
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

    });

    
    // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
        $('#tabla_documentos').on( 'draw.dt', function () {
            setTimeout(function() {
                $('#tabla_documentos').find('input').iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
                });   
            }, 200);
        });


    // FUNCIÓN PARA CARGAR ESTILOS DE LA TABLA
        function estilosTabla(idtabla, selected){

            var option_selected=[];
            option_selected["T"]="";
            option_selected["P"]="";
            option_selected["F"]="";
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
            $(`#${idtabla}_filter`).parent().after(`
                <div class="col-sm-6 inputsearch">
                    <div class="dataTables_filter" style="float: left;">
                        <label style="width: 100%;">
                            Estado Firma: 
                            <select id="cmb_filtrar_estado_firma" onchange="filtrarDocumentos()" class="form-control input-sm" style="width: 100%; margin-left: 1px; display: inline-block;">
                                <option value="T" ${option_selected["T"]}>Todos</option>
                                <option value="P" ${option_selected["P"]}>Documentos no firmados</option>
                                <option value="F" ${option_selected["F"]}>Documentos firmados</option>
                            </select>
                        </label>
                    </div>
                </div>
            `);
        }


    // FUNCIÓN PARA COMPROBAR LA CONFIGURACIÓN DE LA FIRMA ELECTRÓNICA
        function firmaElectronica(){

            //verficamos si hay documentos seleccionados
                var doc_selec_aux = $("#tbody_documentos").find(".check_documento:checked");
                if(doc_selec_aux.length==0){
                    alertNotificar("Primero seleccione un documento", "default"); return;
                }

            vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
            $.get("/gestionDocumentos/verificarConfigFirmado/", function(retorno){
                
                vistacargando();
                $("#informacion_certificado").html("");

                if(!retorno.error){ // si no hay error

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar").html("¿Está seguro que desea firmar el documento?");
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

        $("#frm_firma_electronica_documento").submit(function(e){ 
            
            e.preventDefault();
            
            //obtenemos los input seleccionados
                var doc_selec_aux = $("#tbody_documentos").find(".check_documento:checked");
                if(doc_selec_aux.length==0){
                    alertNotificar("Primero seleccione un documento", "default"); return;
                }
                $("#contet_docu_selec").html(""); //quitamos los antiguos
                $.each(doc_selec_aux, function(index, documento){
                    $("#contet_docu_selec").append(`<input type="hidden" name="list_documento_manuales[]" value="${$(documento).val()}">`);
                })
            //-------------------------------------------

            var FrmData = new FormData(this);
            $.ajaxSetup({
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            });
            
            vistacargando('M','Firmando Documentos...'); // mostramos la ventana de espera

            $.ajax({
                url: "/gestionDocumentos/procesarDocumentosFirmar",
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                complete: function(requestData){

                    vistacargando(); // ocultamos la ventana de espera
                    retorno = requestData.responseJSON;                                            
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status); 

                    // si es completado
                    if(!retorno.error){
                        $("#modal_firma_electronica").modal("hide");
                        filtrarDocumentos(); //recargamos la tabla                                           
                    }
                    
                },
                error: function(error){
                    vistacargando(); // ocultamos la ventana de espera
                    alertNotificar("Error el intentar firmar los documenmtos", "error");                    
                }
            }); 
        });



    // FUNCIÓN PARA FILTRAR LOS CODUMENTOS POR ESTADO DE FIRMA
        function filtrarDocumentos(){

            var filtro = $("#cmb_filtrar_estado_firma").val();
            vistacargando("M","Espere...");

            $.get("/gestionDocumentos/obtenerDocumentos/"+filtro, function(retorno){
                vistacargando();
                
                var idtabla = "tabla_documentos";
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
                    data: retorno.lista_documentos,
                    columnDefs: [
                        {  className: "sorting_desc col_sm", targets: 0 },
                        {  className: "sorting_desc", targets: 1 },
                        {  className: "sorting_desc", targets: 2 },
                        {  className: "sorting_desc", targets: 3 },
                        {  className: "sorting_desc", targets: 4 }
                    ],
                    columns:[
                        {data: "firmado", render : function (campo, type, documento_manuales){ 
                            var retornar = "";
                            if(documento_manuales.firmado==1){
                                retornar = `<span class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Firmado</span>`;
                            }else{
                                retornar = `
                                <label for="ckeckfirm_${documento_manuales.codigo_rastreo}" style="min-width: 90px !important; margin-bottom: 0px;">
                                    <input id="ckeckfirm_${documento_manuales.codigo_rastreo}" type="checkbox" class="flat check_documento" value="${documento_manuales.iddocumento_manuales_encrypt}"><span style="padding-top: 5px;"> Firmar</span>
                                </label>`;
                            }
                            return `<center style="user-select: none;">${retornar}</center>`;
                        }},
                        {data: "tipodocumentomanual.descripcion" },
                        {data: "fecha_de_creacion" },
                        {data: "usercreate.name" },
                        {data: "ruta", render : function (campo, type, documento_manuales){                    
                            if(documento_manuales.ruta!=''){
                                return `<td class="vert_center"><a target="_blank" class="a_ruta_docu" href="/buscarDocumento/diskFormatoValidacionDocumento/${documento_manuales.ruta}"><i class="fa fa-eye"></i> ${documento_manuales.ruta}</a></td>`;
                            }else{
                                return `<td class="vert_center">Sin ruta</td>`;
                            }   
                        }}
                    ],
                    "rowCallback": function( row, tramite, index ){    
                        //columna de fecha
                        $('td', row).eq(0).addClass('vert_center');
                        $('td', row).eq(1).addClass('vert_center');
                        $('td', row).eq(2).addClass('vert_center');
                        $('td', row).eq(3).addClass('vert_center');
                        $('td', row).eq(4).addClass('vert_center');
                    }
                });

                $('input').iCheck({
                    checkboxClass: 'icheckbox_flat-green'
                });

                estilosTabla(idtabla, filtro);

            }).fail(function(){
                
                alertNotificar("Error obtener la información", "error");  
                vistacargando();

            });
        }


    //FUNCIÓN QUE SE EJECUTA AL SELECCIONAR UNA FILA (DOCUMENTOS)
        $('#tbody_documentos').delegate('.check_documento','ifChecked', function(event){
            $(this).parents('tr').addClass("fila_selec");
        });

        $('#tbody_documentos').delegate('.check_documento','ifUnchecked', function(event){
            $(this).parents('tr').removeClass("fila_selec");
        });
    


    // FUNCION PARA SELECCIONAR UN ARCHVO --------------

        $(".seleccionar_archivo").click(function(e){
            $(this).parent().siblings('input').val($(this).parent().prop('title'));
            this.value = null; // limpiamos el archivo
        });

        $(".seleccionar_archivo").change(function(e){

            if(this.files.length>0){ // si se selecciona un archivo
                archivo=(this.files[0].name);
                $(this).parent().siblings('input').val(archivo);
            }else{
                return;
            }

        });

