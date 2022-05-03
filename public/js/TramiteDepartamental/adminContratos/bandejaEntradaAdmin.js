
    $(document).ready(function () {
        cargar_tabla_entrada();
    });

    function cargar_tabla_entrada(){
          
        $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});
         
        var datatable = {
            placeholder: "Ejm: GADM-000-2020-N"
        }

        $("#tabla_tramites").DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            pageLength: 10,
            "language": datatableLenguaje(datatable),
        });

    }

        //TOOLTIPS PARA LOS BOTONES ATENDER JEFE O SECRETARIA
        var tooltip_antender = `data-toggle="tooltip" data-placement="top" title="Botón para atender el támite realizando 
                un documento (MEMO, OFICIO, etc) 
                y enviarlo a uno o varios departamentos."`;
        var tooltip_reasignar = `data-toggle="tooltip" data-placement="top" title="Botón para enviar el trámite a otro departamento 
                sin la necesidad de crear o adjuntar documentos."`;
        var tooltip_delegar = `data-toggle="tooltip" data-placement="top" title="Botón para enviar el trámite a uno o varios funcionarios dentro del departamento.
                NOTA: Opcionalmente puede crear y adjuntar documentos."`;
        var tooltip_devolver = `data-toggle="tooltip" data-placement="top" title="Botón para devolver el trámite al departamento o la persona que lo envía.
                NOTA: Tiene que ingresar una descripción respecto a los cambios a realizar."`;
        var tooltip_terminar = `data-toggle="tooltip" data-placement="top" title="Botón para terminar el trámite.
                NOTA: Tiene que ingresar una descripción 
                y opcionalmente puede adjuntar documentos."`;

    function verTramite(iddetalle_tramite_encrypt ,btn){
        // alert('hola');
        $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado
        $("#listaTramites_entrada").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite_encrypt); // reutilizada de otro jquery

        //cargamos en la vista general los botones atender y terminar        
        $("#botones_para").html("");

        //boton para atender el trámite
        addBoton = `<a href="/adminContratos/atenderDetalleTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" ${tooltip_antender} class="btn btn-warning btn_regresar" ><i class="fa fa-edit"></i> Atender</a>`;
        //boton para reasignar un tramie
        addBoton = addBoton+`<a href="/adminContratos/redireccionarTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" ${tooltip_reasignar} class="btn btn-primary btn_regresar"><i class="fa fa-share-square"></i> Reasignar</a>`;
        //boton para devolver un trámite
        addBoton = addBoton+`<button class="btn btn-outline-danger btn_regresar" onclick="devolverTramite('${iddetalle_tramite_encrypt}')" ${tooltip_devolver}><i class="fa fa-history"></i> Devolver</button>`;
        //boton para terminar un proceso
        addBoton = addBoton+`<a href="/adminContratos/terminarTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" ${tooltip_terminar} class="btn btn-success btn_regresar" style="color: #fff"><i class="fa fa-thumbs-o-up"></i> Terminar</button>`;
    
        $("#botones_para").append(addBoton);
        $('[data-toggle="tooltip"]').tooltip();
   
    }

    function cerrarDetalleTramite(){
        $("#listaTramites_entrada").show(200);
        $("#contet_ver_tramite").hide(200);
    }

    //evento que se desencadena al seleccionar un elemento de un combo
    $(".cmb_filtrarTramite").change(function(e){
        filtratTramiteEntrada();
    });

    //funcion para filtrar los tramites de entrada
    function filtratTramiteEntrada(){
        vistacargando("M", "Buscando...");
        var iddepartamento = $("#cmb_departamento").val();
        var idtipo_tramite = $("#cmb_tipoTramite").val();
        vistacargando("M", "Filtrando...");
        $.get(`/adminContratos/filtrarEntrada/${iddepartamento}/${idtipo_tramite}`, function(retorno){

            // no cargamos la los tramites de entrada si la tabla está oculta
            if(!$("#listaTramites_entrada").is(":visible")){
                return;
            }

            $("#tabla_tramites").DataTable().destroy();
            $('#tabla_tramites tbody').empty();

            $.each(retorno.resultado, function(i, detalle_tramite){
                $('#tabla_tramites tbody').append(`
                    <tr role="row" class="odd">
                        <td class="sorting_1 todo_mayus"><center> ${detalle_tramite.tramite.prioridad.descripcion} </center></td>
                        <td class="todo_mayus">${detalle_tramite.tramite.codTramite}</td>
                        <td class="todo_mayus">${detalle_tramite.tramite.fechaCreacion}</td>
                        <td class="todo_mayus">${detalle_tramite.departamento_origen.nombre}</td>
                        <td class="todo_mayus">${detalle_tramite.asunto}</td>
                        <td width="5%" class="bg-warning">
                            <button type="button" id="btn_detalle_${detalle_tramite.iddetalle_tramite}" onclick="verTramite('${detalle_tramite.iddetalle_tramite_encrypt}',this)" class="btn btn-sm btn-info" style="margin-bottom: 0;"><i class="fa fa-eye"></i> Ver Detalle</button>
                        </td>
                    </tr>
                `);
            });

            cargar_tabla_entrada();
            vistacargando();
            console.warn("Bandeja de entrada actualizada");

        });

        vistacargando();   
    }

    // funciones para devolver un trámite
    function devolverTramite(iddetalle_tramite_encrypt){
        $("#modal_detalle_devolver").modal("show");
        $("#frm_devolverTramite").attr("action", `/detalleTramite/devolverTramite/${iddetalle_tramite_encrypt}`);
        $("#textarea_detalle_revision").val("");
    }

    $("#frm_devolverTramite").submit(function(e){
        e.preventDefault();

        var ruta = $(this).attr("action");
        var FrmData = new FormData(this);

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        vistacargando('M','Devolviendo...'); // mostramos la ventana de espera

        $.ajax({
            url: ruta,
            method: 'POST',
            data: FrmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            complete: function(requestData){
                retorno = requestData.responseJSON;
                // si es completado
                alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);

                if(!retorno.error){
                    // refrescamos la tabla de trámites
                    cerrarDetalleTramite();
                    filtratTramiteEntrada();
                    $("#modal_detalle_devolver").modal("hide");
                }

                vistacargando(); // ocultamos la ventana de espera 
                
            },
            error: function(error){
                // alertNotificar(","error");
                vistacargando(); // ocultamos la ventana de espera
            }
        }); 
    });