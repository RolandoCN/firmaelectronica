
    function verTramite(iddetalle_tramite, iddetalle_actividad){

        $("#listaTramites_entrada").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite); // reutilizada de otro jquery

        //cargamos la informacion del boton
        $("#btn_finalizados_revertir").attr('onclick',`revertirTramite('${iddetalle_tramite}', '${iddetalle_actividad}')`);
    }

    function cerrarDetalleTramite(){
        $("#listaTramites_entrada").show(200);
        $("#contet_ver_tramite").hide(200);
        $("#btn_finalizados_revertir").attr('onclick','');
    }


    // filtrar los tramies finalizados
    $(".cmb_filtrarTramite").change(function(e){
        filtrarTramiteAtendidoIniciado();
    });

    // funcion para filtrar los tramies finalizados
    function filtrarTramiteAtendidoIniciado(){

        vistacargando("M", "Buscando...");
        var iddepartamento = $("#cmb_departamento").val();
        var idtipo_tramite = $("#cmb_tipoTramite").val();

        vistacargando("M", "Filtrando...");
        $.get(`/gestionBandeja/filtrarFinalizado/${iddepartamento}/${idtipo_tramite}`, function(retorno){

         console.log(retorno);          
            
        // no cargamos la los tramites de entrada si la tabla está oculta
            if(!$("#listaTramites_entrada").is(":visible")){
                return;
            }

            // cargamos la imformacion del lenguaje
            var datatable = {
                placeholder: "Ejm: GADM-000-2020-N"
            }

            // cargamos los datos a la tabla
            
            var tablatramite = $('#tabla_tramites').DataTable({
                dom: ""
                +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                +"<rt>"
                +"<'row'<'form-inline'"
                +" <'col-sm-6 col-md-6 col-lg-6'l>"
                +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                "destroy":true,
                order: [[ 0, "desc" ]],
                pageLength: 10,
                sInfoFiltered:false,
                language: datatableLenguaje(datatable),
                data: retorno.resultado,
                columnDefs: [
                    {  className: "todo_mayus", targets: 0 },
                    {  className: "todo_mayus", targets: 1 },
                    {  className: "todo_mayus", targets: 2 },
                    {  className: "todo_mayus", targets: 3 },
                    {  className: "todo_mayus", targets: 4 },
                    {  className: "bg-warning", targets: 5 },                
                ],
                columns:[
                    { data: "fecha" },
                    { data: "tramite.codTramite" },
                    { data: "detalle_tramite_padre.departamento_origen.nombre" },
                    { data: "detalle_tramite_padre.asunto" },
                    { data: "observacion" },   
                    { data: "asunto" },                                         
                ],

                  "rowCallback": function( row, detalle_tramite, index ){                         
                    //cargamos el boton de ver detalle
                    $('td', row).eq(5).html(`<button type="button" onclick="verTramite('${detalle_tramite.iddetalle_tramite_encrypt}')" class="btn btn-sm btn-info" style="margin-bottom: 0;"><i class="fa fa-eye"></i> Ver Detalle</button>`);
                }
                                          
            });

            // quitamos la clase solo "bg-warning" y "todo_mayus" solo en la cabecera
            var columnas = $(tablatramite.table().header()).children('tr').find('th');
            $(columnas).removeClass('bg-warning');
            $(columnas).removeClass('todo_mayus');

            vistacargando();
            console.warn("Bandeja de finalizados actualizada");

        });

        vistacargando();   
    }

    //funcion para revertir el trámite
    function revertirTramite(iddetalle_tramite_encrypt, iddetalle_actividad_encrypt){

        if(iddetalle_actividad_encrypt==0){
            iddetalle_actividad_encrypt = "";
        }

        swal({
            title: "",
            text: "¿Está seguro que desea revertir el trámite?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si, revertir!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if(isConfirm){ // si dice que quiere eliminar
                vistacargando("M", "Espere...");
                $.get("/detalleTramite/revertirTramite/"+iddetalle_tramite_encrypt+"/"+iddetalle_actividad_encrypt, function(retorno){
                    
                    vistacargando();
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);
                    if(!retorno.error){
                        if(retorno.resultado.status=="success"){
                            filtrarTramiteAtendidoIniciado();
                            cerrarDetalleTramite();
                        }
                    }

                }).fail(function(){
                    vistacargando();
                    alertNotificar("No se pudo realizar la acción, por favor inténtelo más tarde", "error");
                });
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    }

    // $(document).ready(function () {
    //     var timeout = timeRefresh*1000; // convertimos a milisegundos
    //     setTimeout(() => {
    //         setInterval(filtrarTramiteAtendidoIniciado, timeout);
    //     }, (3000));
    // });
