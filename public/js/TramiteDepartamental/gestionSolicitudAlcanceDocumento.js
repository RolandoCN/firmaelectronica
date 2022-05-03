
    //funcion para mostrar la ventana para cambiar el documento
    function vista_cambiar_documento(idcambio_documento_encrypt, btn){

        //mostramos la vista
        $(btn).tooltip("hide");
        vistacargando("M", "Espere...");

        $.get(`/alcanceDocumento/${idcambio_documento_encrypt}/edit`, function(retorno){

            vistacargando();
            console.log(retorno.cambio_documento.documento.descripcion);
            if(!retorno.error){ //todo bien
                $("#btn_detalle_tramite").attr('onclick', `verTramite('${retorno.cambio_documento.documento.detalle_tramite.iddetalle_tramite_encrypt}', this)`);
                $("#cont_cambio_documento").hide(200);
                $("#contet_vista_cambiar_documento").show(200);
                $("#cambDoc_codigo_documento").html(retorno.cambio_documento.documento.codigoDocumento);
                $("#cambDoc_fecha_solicitud").html(retorno.cambio_documento.fecha_solicitud);         
                $("#cambDoc_observacion").html(retorno.cambio_documento.observacion);
                if(retorno.cambio_documento.documento.descripcion=="DOCUMENTO PRINCIPAL"){
                    $("#nombre_documento_cambiado").val(retorno.cambio_documento.documento.descripcion);
                    $("#nombre_documento_cambiado").prop('disabled',true);
                }else{
                    $("#nombre_documento_cambiado").val(retorno.cambio_documento.documento.descripcion);
                    $("#nombre_documento_cambiado").prop('disabled',false);
                }

                //cargamos el documento guardado (solo si existe)
                if(retorno.documento_b64 != null){                    
                    $("#documento_cambiado").parent().siblings('input').val(retorno.cambio_documento.ruta_documento);
                    if(retorno.extension=="pdf" || retorno.extension=="PDF"){
                        $('#vista_documento_cambiado').html(`<iframe src="data:application/pdf;base64,${retorno.documento_b64}" type="application/pdf" style="width:100%; height: 800px;" frameborder="0"></iframe>`);
                        if(retorno.cambio_documento.documento.descripcion!="DOCUMENTO PRINCIPAL"){
                            $("#nombre_documento_cambiado").val(retorno.cambio_documento.nombredocumento);
                            $("#nombre_documento_cambiado").prop('disabled',false);
                        }
                        $("#icono_documento_cambiado").hide();

                    }
                }


                //cargamos el boton para aprobar el cambio (solo si es jefe de departamento)            
                if(retorno.esJefe == true){
                    $("#content_btn_aprobar_camb_doc").html(`
                        <button type="button" onclick="aprobarSolicitudAlcanceDocumento('${retorno.cambio_documento.idcambio_documento_encrypt}')" class="btn btn-success btn_regresar" style="color: #fff;">
                            <i class="fa fa-thumbs-up"></i> Aprobar Solicitud
                        </button>
                    `);
                }

                //mostramos el boton de aprobar (solo si ya hay un documento subido)
                if(retorno.documento_b64 != null){
                    $("#content_btn_aprobar_camb_doc").show();
                }

                //cargamos rutas de formularios
                $("#frm_camb_doc_guardar").attr('action', '/alcanceDocumento/guardarDocumento/'+idcambio_documento_encrypt);

            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){
            vistacargando();
            alertNotificar("Error al realizar la petición, Inténtelo mas tarde", "error");
        });

    }

    //funcion para cerrar la vista de cambio de documento
    function cancelarVistaCargarDocumento(){

        //ocultamos vista carga documento
        $("#cont_cambio_documento").show(200);
        $("#contet_vista_cambiar_documento").hide(200);
        $("#btn_detalle_tramite").attr('onclick', '');
        $("#title_codigo_documento").html("GADMCH-DEPA-0000-00-DOC");
        $("#btn_guardar_camb_doc").hide();

        //limpiamos informacion formulario subir documento
        $("#cambDoc_fecha_solicitud").html("-");
        $("#cambDoc_observacion").html("-");
        $("#icono_documento_cambiado").show();
        $("#vista_documento_cambiado").html("");

        //limpiar documento seleccionado
        $("#documento_cambiado").parent().siblings('input').val($("#documento_cambiado").parent().prop('title'));
        $("#documento_cambiado").value = null; // limpiamos el archivo

        //ocultamos vista detalle general del trámite
        $("#content_detalle_general_tramite").hide(200);

        //borramos los action de los formularios
        $("#frm_camb_doc_guardar").attr('action', '');

        //recargamos la tabla de solicitudes
        recargarTablaSolicitudes("CS");

        //limpiamos el boton de aprobar cambio de documento
        $("#content_btn_aprobar_camb_doc").html("");
        $("#content_btn_aprobar_camb_doc").hide();

    }

//--------------------- DETALLE TRAMITE----------------------------------

    //funcion para visualizar el detalle de un trámite
    function verTramite(iddetalle_tramite,btn){

        $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado    
        $("#contet_vista_cambiar_documento").hide(200);
        $("#content_detalle_general_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite); // reutilizada de otro jquery

    }

    //vista para cerrar la ventana de detalle general de trámite
    function cerrarDetalleTramite(){
        $("#contet_vista_cambiar_documento").show(200);
        $("#content_detalle_general_tramite").hide(200);
    }


//----------------- GUARDAR Y APROBAR UN DOCUMENTO -------------------------

    //evento para ejecutar el submit del formulario para guardar el documento
    $("#btn_guardar_camb_doc").click(function(e){
        $("#frm_camb_doc_guardar").submit();
    });

    //evento de formulario para enviar un post y guardar el documento
    $("#frm_camb_doc_guardar").submit(function(e){
        
        e.preventDefault(); 
            
        var formulario = this;
        var ruta = $(this).attr("action");
       
        swal({
            title: "",
            text: "¿Está seguro que desea guardar el documento?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si, guardar!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            
            if(isConfirm){ // si dice que quiere eliminar

                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                
                var FrmData = new FormData(formulario);

                vistacargando('M','Espere...');
                $.ajax({
                    url: ruta,
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    complete: function(requestData){
                        vistacargando(); // ocultamos la ventana de espera
                        retorno = requestData.responseJSON;

                        // si es completado
                        alertNotificar(retorno.mensaje, retorno.status);

                        if(!retorno.error){ //todo correcto
                            //mostramos el boton de aprobar cambio (solo hay boton su es el jefe del departamento)
                            $("#content_btn_aprobar_camb_doc").show();
                            //ocultamos el boton de guardado
                            $("#btn_guardar_camb_doc").hide();
                        }
    
                    },
                    error: function(error){
                        vistacargando();
                        alertNotificar("Error al realizar la petición, Inténtelo mas tarde", "error");
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        });

    });


    //función que aprueba el cambio de un documento
    function aprobarSolicitudAlcanceDocumento(idcambio_documento_encrypt){

        swal({
            title: "",
            text: "¿Está seguro que desea aprobar el envio del nuevo documento subido?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si, aprobar!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            
            if(isConfirm){ // si dice que quiere eliminar

                vistacargando("M", "Espere...");
                $.get("/alcanceDocumento/aprobarCambio/"+idcambio_documento_encrypt, function(retorno){

                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);

                    if(!retorno.error){ //todo bien               
                        //cerrar el la ventana y recargar la tabla
                        cancelarVistaCargarDocumento();
                    }

                }).fail(function(){
                    vistacargando();
                    alertNotificar("Error al realizar la petición, Inténtelo mas tarde", "error");
                });

            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });

    }

//--------------------------------------------------------------------------

    //funcion para visualizar un documento 
    function vista_previa_documento(iddocumento_encrypt, btn){

        $(btn).tooltip('hide');
        var disco = "disksServidorSFTPdocumentos";

        vistacargando("M", "Espere...");
        $.get(`/tramite/obtenerDocumento/${iddocumento_encrypt}`, function(docB64){

            vistacargando();
            $("#cambDoc_modal_vista_previa_documento").modal("show");
            $("#cambDoc_content_visualizarDocumento").html(`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 450px;"></iframe>`);

        }).fail(function(){
            vistacargando();
        });
    }

    // función para vaciar el documento seleccionado
    $(".seleccionar_archivo").click(function(e){
        $(this).parent().siblings('input').val($(this).parent().prop('title'));
        this.value = null; // limpiamos el archivo

        //limpiamos la vista previa del documento
        $("#icono_documento_cambiado").show();
        $("#vista_documento_cambiado").html("");

        //ocultamos el boton de guardado
        $("#btn_guardar_camb_doc").hide();

        //ocultamos el boton de aprobar cambio
        $("#content_btn_aprobar_camb_doc").hide();
  

    });

    // función para seleccionar un documento
    $(".seleccionar_archivo").change(function(e){

        if(this.files.length>0){ // si se selecciona un archivo
            archivo=(this.files[0].name);
            $(this).parent().siblings('input').val(archivo);
            var tipoDocSalec = archivo.split('.').pop(); // obtenemos la extención del documento

            //mostramos una vista previa del documento selecccionado
            if(tipoDocSalec=="pdf" || tipoDocSalec=="PDF"){
                $('#vista_documento_cambiado').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 800px;" frameborder="0"></iframe>`);
                $("#icono_documento_cambiado").hide();
            }

            //mostramos el boton de guardado
            $("#btn_guardar_camb_doc").show();

        }else{
            return;
        }

    });

    //función para filtrar la solicitudes por estado
    function filtrar_solicitud(cmb){
        var estado = $(cmb).val();
        recargarTablaSolicitudes(estado);
    }

    //funcion para cargar la tabla de solicitudes de cambio de documento
    function recargarTablaSolicitudes(estado){

        vistacargando("M", "Actualizando lista de solititudes...")
        $.get("/alcanceDocumento/filtrarPorEstado/"+estado, function(retorno){

            vistacargando();
            if(!retorno.error){ //todo bien
                
                var datatable = {
                    placeholder: "Ejm: GADM-DEP-0000-00-000",
                    search: "Buscar Documento",
                }

                $('#tabla_cambio_documento').DataTable({
                    dom: ""
                    +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                    +"<rt>"
                    +"<'row'<'form-inline'"
                    +" <'col-sm-6 col-md-6 col-lg-6'l>"
                    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                    pageLength: 10,
                    order: [[ 0, "desc" ]],
                    "language": datatableLenguaje(datatable),
                    "destroy":true,
                    sInfoFiltered:false,
                    data: retorno.lista_cambio_documento,
                    columnDefs: [
                        { className: "todo_mayus", targets: 0 },
                        { className: "todo_mayus", targets: 1 },
                        { className: "todo_mayus", targets: 2 },
                        { className: "todo_mayus", targets: 3 }                                             
                    ],
                    columns:[
                        {data: "fecha_solicitud" },
                        {data: "documento.codigoDocumento" },
                        {data: "departamento_solicita.nombre"},
                        {data: "documento.detalle_tramite.asunto"},
                        {data: "estado"},
                        {data: "estado"}
                    ],
                    "rowCallback": function( row, cambDoc, index ){
                        
                        if(cambDoc.estado == "C"){ 
                            $('td', row).addClass('bg-warning');
                            $('td', row).eq(4).html(`<span class="label lable_estado label-warning">Pendiente</span>`);
                        }else{ 
                            $('td', row).addClass('bg-success');
                            $('td', row).eq(4).html(`<span class="label lable_estado label-success">Subido</span>`);
                        }
                        
                        $('td', row).eq(5).html(`<button type="button" class="btn btn-sm btn-success" onclick="vista_cambiar_documento('${cambDoc.idcambio_documento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Gestionar el documento" style="margin-bottom: 0px;"><i class="fa fa-edit"></i> Gestionar</button>`);
                        $('td', row).eq(5).append(`<button type="button" class="btn btn-sm btn-info btn_icon_lg" onclick="vista_previa_documento('${cambDoc.documento.iddocumento_encrypt}', this)" data-toggle="tooltip" data-placement="top" data-original-title="Vista previa del documento que se solicitó el alcance" style="margin-bottom: 0px;"><i class="fa fa-eye"></i></button>`);
                       
                    } 
                });

                $("#tabla_cambio_documento tbody").find('button').tooltip();

                //cargamos el combo para filtrar por estado

                var option_selected=[];
                option_selected["CS"]="";
                option_selected["C"]="";
                option_selected["S"]="";
                option_selected[`${estado}`]="selected";

                $(`#${idtabla}_filter`).parent().after(`
                    <div class="col-sm-6 inputsearch">
                        <div class="dataTables_filter" style="float: left;">
                            <label style="width: 100%;">
                                Estado Firma: 
                                <select onchange="filtrar_solicitud(this)" class="form-control input-sm" style="width: 100%; margin-left: 1px; display: inline-block;">
                                    <option value="CS" ${option_selected["CS"]}>Todos</option>
                                    <option value="C"  ${option_selected["C"]}>Documentos no cargados (Pendiente)</option>
                                    <option value="S"  ${option_selected["S"]}>Documentos cargados (Subido)</option>
                                </select>
                            </label>
                        </div>
                    </div>
                `);

                
            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){
            vistacargando();
            alertNotificar("Error al realizar la petición, Inténtelo mas tarde", "error");
        });
    }

