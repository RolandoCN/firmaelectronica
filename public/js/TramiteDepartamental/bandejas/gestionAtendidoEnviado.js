
    function verTramite(iddetalle_tramite,btn){
        $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado
        $("#listaTramites_entrada").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite); // reutilizada de otro jquery

        //cargamos los botones
        $("#botones_para").html("");
        
        $.get("/tramite/detalleTramite/"+iddetalle_tramite, function(retorno){          
            console.log(retorno);
            if(retorno.puede_recuperar == true){
                $("#botones_para").append(`<button type="button" onclick="recuperarTramite('${iddetalle_tramite}')" class="btn btn-warning btn_regresar" style="color: #fff"><i class="fa fa-edit"></i> Recuperar</button>`);
            }else if(retorno.puede_recuperar_act == true){
                $("#botones_para").append(`<button type="button" onclick="recuperarActividad('${retorno.detalle_actividad.iddetalle_actividad_encrypt}')" class="btn btn-warning btn_regresar" style="color: #fff"><i class="fa fa-edit"></i> Recuperar</button>`);
            }
        }).fail(function(){          
            //alertNotificar("No se pudo obtener la información, por favor intentelo mas tarde", "danger");
        });

        
        //cargamos en la vista general los botones atender y terminar
        // var td_botones = $(btn).parent().siblings('.botones_para');
        // $("#botones_para").html("");
        // $.each(td_botones, function(index, td_boton){
        //     alert("funciona");
        //     var boton =  $(td_boton).children();
        //     addBoton = "";
        //     if(index==0){
        //         addBoton = `<a href="${boton.attr("href")}" class="btn btn-warning btn_regresar" ><i class="fa fa-edit"></i> Atender</a>`;
        //     }else{
        //         addBoton = `<button type="button" class="btn btn-success btn_regresar" style="color: #fff"><i class="fa fa-thumbs-o-up"></i> Terminar</button>`;
        //     }
        //     $("#botones_para").append(addBoton);

        // });
    }

    function cerrarDetalleTramite(){
        $("#listaTramites_entrada").show(200);
        $("#contet_ver_tramite").hide(200);
    }


    // filtrar los tramies de entrada por selección
    $(".cmb_filtrarTramite").change(function(e){
        filtrarTramiteAtendidoEnviado();
    });

    // funcion para filtrar los tramies de entrada
    function filtrarTramiteAtendidoEnviado(){
        vistacargando("M", "Buscando...");
        var iddepartamento = $("#cmb_departamento").val();
        var idtipo_tramite = $("#cmb_tipoTramite").val();
        var nivelAtencion = $("#cmb_inicio_atendido").val();

        $.get(`/gestionBandeja/filtrarAtendidoEnviado/${iddepartamento}/${idtipo_tramite}/${nivelAtencion}`, function(retorno){

            console.log(retorno)

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
                    {  className: "todo_mayus", targets: 5 },                                   
                ],
                columns:[
                    { data: "fecha" },
                    { data: "tramite.codTramite" },
                    { data: "departamento_origen.nombre" },
                    { data: "asunto" },
                    { data: "asunto" }, //dato default
                    { data: "asunto" }, //dato default
                    { data: "asunto" }, //dato default                
                ],

                "rowCallback": function( row, detalle_tramite, index ){  

                    //cargamos los departamento destino

                        var destinos = "";
                        var tipo_envio = "";
                        $.each(detalle_tramite.destino, function(index, destino){
                            if(destino.tipo_envio == "C"){ // enviado como copia
                                tipo_envio = `
                                    <b style="padding-left: 5px; color: #e60000;"> 
                                        <i style="font-size: 16px;" class="fa fa-angle-double-right"></i> 
                                        <span style="text-transform: none;">Copia</span> 
                                        <i style="font-size: 16px;" class="fa fa-copy"></i>
                                    </b>`;
                            }
                            destinos += `<li>${destino.departamento.nombre} ${tipo_envio}</li>`;
                        });

                        $('td', row).eq(2).html(`<ul style="margin-bottom: 0px; padding-left: 20px;">${destinos}</ul>`);
                    
                    //verificamos los estados y la procedencia
                    
                        var atiendeEnvia = "<i><b><center style='text-transform: none;'>Enviado</center></b></i>";
                        var colorFila = "";
                        var estado = "";
                        if(detalle_tramite.nivelAtencion > 1){ // es atendido
                            atiendeEnvia = "<i><b><center style='text-transform: none;'>Atendido</center></b></i>"; 
                            colorFila = "bg-warning";
                            if(detalle_tramite.aprobado == 1){ 
                                if(detalle_tramite.estado=="D"){ estado = '<span class="label lable_estado label-danger">Denegado</span>'; }
                                else{ estado = '<span class="label lable_estado label-success">Aprobado</span>'; }
                            }else{ 
                                estado = '<span class="label lable_estado label-danger">Pendiente</span>'; 
                            }
                            
                        }else{ // es enviado (iniciado desde el departamento)
                            if(detalle_tramite.aprobado==1){ // verificamos si esta enviado
                                if(detalle_tramite.tramite.finalizado == 1){ estado = '<span class="label lable_estado label-primary">Finalizado</span>'; }
                                else{ estado = '<span class="label lable_estado label-success">Aprobado</span>'; }                                
                            }else{
                                estado = '<span class="label lable_estado label-danger">Pendiente</span>';
                            }

                        }

                        $('td', row).eq(4).html(atiendeEnvia);
                        $('td', row).eq(5).html(estado);
                        $('td', row).addClass(colorFila);

                    //cargamos el boton de ver detalle

                    $('td', row).eq(6).html(`<button type="button" onclick="verTramite('${detalle_tramite.iddetalle_tramite_encrypt}',this)" class="btn btn-sm btn-info btn_icon" data-toggle="tooltip" data-placement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-eye"></i></button>`);               
                    $('td', row).eq(6).find('button').tooltip();
                }     

                                          
            });

            // quitamos la clase solo "bg-warning" y "todo_mayus" solo en la cabecera
            var columnas = $(tablatramite.table().header()).children('tr').find('th');
            $(columnas).removeClass('bg-warning');
            $(columnas).removeClass('todo_mayus');

            vistacargando();
            console.warn("Bandeja actualizada");

        }).fail(function(){
            vistacargando();   
        });

    }


    // función para traer un trámite de vuelta al departamento actual
    function recuperarTramite(iddetalle_tramite){
        swal({
            title: "",
            text: "¿Está seguro que desea recuperar el trámite?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-warning",
            confirmButtonText: "Si, recuperar!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            
            if(isConfirm){ // si dice que quiere eliminar
                vistacargando("M","Espere...");
                $.get("/detalleTramite/recuperarTramite/"+iddetalle_tramite, function(retorno){
                    vistacargando();
                    alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);
                    if(!retorno.error){
                        vistacargando("M","Espere...");
                        window.location.href="/gestionBandeja/atendidosEnviados";
                    }
                }).fail(function(){
                    vistacargando();
                });
            }
    
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });         
    }

    // funcion para recuperar un tramite interno
    function recuperarActividad(iddetalle_actividad){
        swal({
            title: "",
            text: "¿Está seguro que desea recuperar el trámite?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-warning",
            confirmButtonText: "Si, recuperar!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            
            if(isConfirm){ // si dice que quiere eliminar
                vistacargando("M","Espere...");
                $.get("/detalleActividad/recuperarDetalleActividad/"+iddetalle_actividad, function(retorno){
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);
                    if(!retorno.error){
                        vistacargando("M","Espere...");
                        window.location.href="/gestionBandeja/atendidosEnviados";
                    }
                }).fail(function(){
                    vistacargando();
                });
            }
    
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });  
    }

    // $(document).ready(function () {
    //     var timeout = timeRefresh*1000; // convertimos a milisegundos
    //     setTimeout(() => {
    //         setInterval(filtrarTramiteAtendidoEnviado, timeout);
    //     }, (3000));
    // });