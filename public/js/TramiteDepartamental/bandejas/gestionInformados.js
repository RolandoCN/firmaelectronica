    
    $(document).ready(function () {
        cargar_estilos_tabla();
    });

    function cargar_estilos_tabla(){

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

    function verTramite(iddetalle_tramite,btn){
        $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado
        $("#listaTramites_entrada").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite); // reutilizada de otro jquery

        $("#botones_para").html("");
        addBoton = "";
        $("#botones_para").append(addBoton);

    }

    function cerrarDetalleTramite(){
        $("#listaTramites_entrada").show(200);
        $("#contet_ver_tramite").hide(200);
    }

    // funciones para devolver un trámite


    // filtrar los tramies de entrada por selección
    $(".cmb_filtrarTramite").change(function(e){
        filtratTramiteEntrada();
    });

    // funcion para filtrar los tramies de entrada
    function filtratTramiteEntrada(){
    
        vistacargando("M", "Buscando...");
        var iddepartamento = $("#cmb_departamento").val();
        var idtipo_tramite = $("#cmb_tipoTramite").val();
        var estado_leido = $("#cmb_estado_leido").val();
        vistacargando("M", "Filtrando...");
        $.get(`/gestionBandeja/filtrarInformados/${iddepartamento}/${idtipo_tramite}/${estado_leido}`, function(retorno){
            vistacargando();

            // no cargamos la los tramites de entrada si la tabla está oculta
            if(!$("#listaTramites_entrada").is(":visible")){
                return;
            }

            // cargamos la imformacion del lenguaje
            var datatable = {
                placeholder: "Ejm: GADM-000-2020-N"
            }

            // cargamos los datos a la tabla
            
            $("#tabla_tramites").DataTable().destroy();
            $('#tabla_tramites tbody').empty();

            if(retorno.listaTramite.length>0){
                $.each(retorno.listaTramite, function (i, destino) { 
                    $('#tabla_tramites tbody').append(`
                        <tr role="row" class="odd">
                            <td class="sorting_1 todo_mayus"><center> ${destino.detalle_tramite.tramite.prioridad.descripcion} </center></td>
                            <td class="todo_mayus">${destino.detalle_tramite.tramite.codTramite}</td>
                            <td class="todo_mayus">${destino.detalle_tramite.tramite.fechaCreacion}</td>
                            <td class="todo_mayus">${destino.detalle_tramite.departamento_origen.nombre}</td>
                            <td class="todo_mayus">${destino.detalle_tramite.asunto}</td>
                            <td width="5%" class="bg-warning">
                            <button type="button" id="btn_detalle_${destino.detalle_tramite.iddetalle_tramite}" onclick="verTramite('${destino.detalle_tramite.iddetalle_tramite_encrypt}',this)" class="btn btn-sm btn-info" style="margin-bottom: 0;"><i class="fa fa-eye"></i> Ver Detalle</button>
                            </td>   
                        </tr>
                    `);
                });
            }else{
                $.each(retorno.listaDestinoInterno, function (i, destino_act) {
                    var detalle_tramite_padre = destino_act.detalle_actividad.detalle_tramite.detalle_tramite_padre;
                    if(detalle_tramite_padre==null){
                        detalle_tramite_padre = destino_act.detalle_actividad.detalle_tramite;
                    }      
                    $('#tabla_tramites tbody').append(`
                        <tr role="row" class="odd">
                            <td class="todo_mayus">NORMAL</td>
                            <td class="todo_mayus">${destino_act.detalle_actividad.detalle_tramite.tramite.codTramite}</td>
                            <td class="todo_mayus">${destino_act.detalle_actividad.fecha}</td>
                            <td class="todo_mayus">${destino_act.detalle_actividad.us001_envia.name}</td>
                            <td class="todo_mayus">${destino_act.detalle_actividad.asunto}</td>
                            <td class="bg-warning">
                            <button type="button" 
                                id="btn_detalle_${detalle_tramite_padre.iddetalle_tramite}" 
                                onclick="verTramiteInterno('${detalle_tramite_padre.iddetalle_tramite_encrypt}', '${destino_act.detalle_actividad.iddetalle_actividad_encrypt}',this)" 
                                class="btn btn-sm btn-info" style="margin-bottom: 0;">
                                    <i class="fa fa-eye"></i> Ver Detalle
                            </button>
                            </td>
                        </tr>
                    `);
                });
            }

            cargar_estilos_tabla();
            
            console.warn("Bandeja de entrada actualizada");

        });

        vistacargando();   
    }

    $(document).ready(function () {
        // var timeout = timeRefresh*1000; // convertimos a milisegundos
        // setTimeout(() => {
        //     setInterval(filtratTramiteEntrada, timeout);
        // }, (3000));
    });


    //FUNCIONES PARA VER EL DETALLE DE UN TRÁMITE INTERNO
    function verTramiteInterno(iddetalle_tramite_encrypt, iddetalle_actividad_encrypt, btn){

        $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado
        $("#listaTramites_entrada").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite_encrypt); // reutilizada de otro jquery
        $("#botones_para").html("");
        addBoton = "";       
        $("#botones_para").append(addBoton);

        //marcamos como leido
        $.get(`/gestionBandeja/marcarLeidoDestinoInt/${iddetalle_actividad_encrypt}`);

    }

