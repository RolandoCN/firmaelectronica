
    
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
            order: [[ 0, "desc" ]],
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

    function verTramite(iddetalle_tramite, origin_proceso, permitir_reasignar, reasignado, iddetalle_tramite_borrador, btn,normalizado=null){
        
        $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado
        $("#listaTramites_entrada").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite); // reutilizada de otro jquery

        //cargamos en la vista general los botones atender y terminar
        var td_botones = $(btn).parent().siblings('.botones_para');
        $("#botones_para").html("");
        $.each(td_botones, function(index, td_boton){
            var boton =  $(td_boton).children();
            addBoton = "";
            if(index==0){

                //boton para atender el trámite
                if(normalizado!=null){
                    addBoton = ``;
                }else{
                    addBoton = `<a href="${boton.attr("href")}" class="btn btn-warning btn_regresar" ${tooltip_antender}><i class="fa fa-edit"></i> Atender</a>`;
                }
                //obtenemos el id del detalle_tramite
                iddetalle_tramite_encrypt = $(td_boton).attr('data-detalle');
                //boton para redireccionar un trámite (solo para los jefes del departamento)
                if(permitir_reasignar==1){
                    if(normalizado!=null){
                        addBoton =addBoton ;
                    }else{
                        addBoton = addBoton+`<a href="/detalleTramite/redireccionarTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" class="btn btn-primary btn_regresar" ${tooltip_reasignar}><i class="fa fa-share-square"></i> Reasignar</a>`;
                    }
                }
                //boton para asignar a funcionarios (proceso interno)   
                if(normalizado!=null){
                    addBoton =addBoton ;
                }else{
                    addBoton = addBoton+`<a href="/detalleActividad/delegarDetalleTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" class="btn btn-info btn_regresar" ${tooltip_delegar}><i class="fa fa-users"></i> Delegar</a>`;
                }
                //boton para devolver un trámite
                if(origin_proceso == 'E'){
                    if(normalizado!=null){
                        addBoton = addBoton+`<button class="btn btn-outline-danger btn_regresar" onclick="devolverTramite('${iddetalle_tramite}')" ${tooltip_devolver}><i class="fa fa-history"></i> Devolver</button>`;                    
                    }else{
                        addBoton = addBoton+`<button class="btn btn-outline-danger btn_regresar" onclick="devolverTramite('${iddetalle_tramite_encrypt}')" ${tooltip_devolver}><i class="fa fa-history"></i> Devolver</button>`;                    
                    }
                }else{
                    addBoton = addBoton+`<button class="btn btn-outline-danger btn_regresar" onclick="devolverTramiteInternoA('${iddetalle_tramite_borrador}')" ${tooltip_devolver}><i class="fa fa-history"></i> Devolver a</button>`;
                }
                // //boton para denegar un trámite
                // addBoton = addBoton+`<a href="/detalleTramite/denegarTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" class="btn btn-danger btn_regresar hidden" style="color: #fff"><i class="fa fa-thumbs-o-down"></i> Denegar</button>`;

            }else{
                addBoton = `<a href="${$(boton).attr("href")}" class="btn btn-success btn_regresar" style="color: #fff" ${tooltip_terminar}><i class="fa fa-thumbs-o-up"></i> Terminar</button>`;
            }
            $("#botones_para").append(addBoton);
            $('[data-toggle="tooltip"]').tooltip();

        });
    }

    function cerrarDetalleTramite(){
        $("#listaTramites_entrada").show(200);
        $("#contet_ver_tramite").hide(200);
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

    // filtrar los tramies de entrada por selección
    $(".cmb_filtrarTramite").change(function(e){
        filtratTramiteEntrada();
    });

    // funcion para filtrar los tramies de entrada
    function filtratTramiteEntrada(){
        vistacargando("M", "Buscando...");
        var iddepartamento = $("#cmb_departamento").val();
        var idtipo_tramite = $("#cmb_tipoTramite").val();
        vistacargando("M", "Filtrando...");
        $.get(`/gestionBandeja/filtrarEntrada/${iddepartamento}/${idtipo_tramite}`, function(retorno){
            vistacargando();         

            // no cargamos la los tramites de entrada si la tabla está oculta
            if(!$("#listaTramites_entrada").is(":visible")){
                return;
            }

            $("#tabla_tramites").DataTable().destroy();
            $('#tabla_tramites tbody').empty();

            if(retorno.listaTramite.length>0){
                $.each(retorno.listaTramite, function (i, destino) {
                    if(destino.detalle_tramite.tramite.prioridad.nivel==3 ){
                        var color='#f798a1ab'; 
                    }else if(destino.detalle_tramite.tramite.prioridad.nivel==2){ 
                        var color="#fff3cd"; 
                    }else{
                        var color='';
                    }

                    if(destino.fijar==1){
                        var nivel=destino.fijar+destino.detalle_tramite.tramite.prioridad.nivel+retorno['max_prioridad']+1;
                        var texto_fijar=`<center><span  style="color:#DED415;font-size:18px; cursor:pointer;" data-toggle="tooltip" data-placement="top" title="No fijar" class="fa fa-star fijado" onclick="fijar('${destino.iddestinoencrypt}','0','G')"></span></center>`;
                    }else{
                        var nivel=destino.fijar+destino.detalle_tramite.tramite.prioridad.nivel;
                        var texto_fijar=`<center><span style="color:#DED415;font-size:18px; cursor:pointer" data-toggle="tooltip" data-placement="top" title="Fijar" onclick="fijar('${destino.iddestinoencrypt}','1','G')" class="fa fa-star-o no_fijado"></span></center>`;

                    }

                    var mostrarTerminar = false;
                    var iddepaLog = $("#iddepaLog").val();

                    if(destino.detalle_tramite.flujo == null){ // flujo no definido
                    if(destino.tipo_envio == "P"){
                        mostrarTerminar = true;
                    }
                    }else{ // flujo definido

                        $.each(destino.detalle_tramite.flujo.flujo_hijo, function(fh, flujo_hijo){
                            if(flujo_hijo.iddepartamento == iddepaLog){
                                if(flujo_hijo.tipo_flujo == "G" && flujo_hijo.estado_finalizar == 1){
                                    mostrarTerminar = true;
                                }
                            }
                        });

                    }
                    var jefe_departamento = retorno.departamentoLogueado['jefe_departamento'];
                    var reasignado = destino.detalle_tramite.reasignado;
                     //botones solo permitidos para destinos 'PARA'
                     var btnpara='';
                     var btnparaclasss='';
                     var btnattr='';
                     var btnterminar='';
                     var btnterclass='';
                    
                     if(destino.tipo_envio =="P"){
                        btnpara=`<a href="/detalleTramite/atenderDetalleTramite?iddetalle_tramite=${destino.detalle_tramite.iddetalle_tramite_encrypt}" class="btn btn-sm btn-warning" style="margin-bottom: 0;"><i class="fa fa-edit"></i></a>`;
                        btnparaclasss='botones_para';
                        btnattr='destino.detalle_tramite.iddetalle_tramite_encrypt';
                        if(mostrarTerminar == true){ // boton terminar trámite
                            btnterminar=`<a href="/detalleTramite/terminarTramite?iddetalle_tramite=${destino.detalle_tramite.iddetalle_tramite_encrypt}" class="btn btn-sm btn-success" style="margin-bottom: 0;"><i class="fa fa-thumbs-o-up"></i></a>`;
                            btnterclass='botones_para';
                        }else{
                            btnterminar='<i class="fa fa-ban icon_stop"></i>';
                        }
                
                    }else{
                        btnpara='<i class="fa fa-ban icon_stop"></i>';
                        btnterminar='<i class="fa fa-ban icon_stop"></i>';
                    }

                    // var dias_transcurridos=destino.detalle_tramite.fecha;
                    // var fecha = new Date();
                    // var diasdif= fecha.getTime()-dias_transcurridos.getTime();
                    // var contdias = Math.round(diasdif/(1000*60*60*24));
                    // console.log(contdias);
                    if(destino.detalle_tramite.fechaApr!=null){
                        var fecha=destino.detalle_tramite.fechaApr;
                    }else{
                        var fecha=destino.detalle_tramite.fecha;
                    }
                    $('#tabla_tramites tbody').append(`
                        <tr style="background-color:${color}" role="row" class="odd">
                            <td class="todo_mayus ocultar">${nivel}</td>
                            <td class="todo_mayus">${texto_fijar}</td>
                            <td class="todo_mayus">${destino.detalle_tramite.tramite.prioridad.descripcion}</td>
                            <td class="todo_mayus">${destino.detalle_tramite.tramite.codTramite}</td>
                            <td class="todo_mayus">${fecha} <br><b style="color:red;font-size:10px">Han transcurrido ${destino.detalle_tramite.dias } días</b></td>
                            <td class="todo_mayus">${destino.detalle_tramite.departamento_origen.nombre}</td>
                            <td class="todo_mayus">${destino.detalle_tramite.asunto}</td>
                            <td class=""><button type="button" onclick="verTramite('${destino.detalle_tramite.iddetalle_tramite_encrypt}', 'E','${jefe_departamento}', '${reasignado}', '0',this)" class="btn btn-sm btn-info" style="margin-bottom: 0;"><i class="fa fa-eye"></i> Ver Detalle</button></td>
                            <td class="todo_mayus ocultar ${btnparaclasss}" data-detalle="${btnattr}" >${btnpara}</td>
                            <td class="todo_mayus ocultar ${btnparaclasss}">${btnterminar}</td>
                        </tr>
                    `);

                    
                });
                $(".fijado").mouseover(function(event){
                    $(this).removeClass("fa fa-star");
                    $(this).addClass("fa fa-star-o");
        
                 });
                 $(".fijado").mouseout(function(event){
                    $(this).removeClass("fa fa-star-o");
                    $(this).addClass("fa fa-star");
                 });
                 $(".no_fijado").mouseover(function(event){
                    $(this).removeClass("fa fa-star-o");
                    $(this).addClass("fa fa-star");
                 });
                 $(".no_fijado").mouseout(function(event){
                    $(this).removeClass("fa fa-star");
                    $(this).addClass("fa fa-star-o");
                 });
                $('[data-toggle="tooltip"]').tooltip();
                cargar_estilos_tabla();
                
                // // cargamos los datos a la tabla
                // var datatable = {
                //     placeholder: "Ejm: GADM-000-2020-N"
                // }
                // var tablatramite = $('#tabla_tramites').DataTable({
                //     dom: ""
                //     +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                //     +"<rt>"
                //     +"<'row'<'form-inline'"
                //     +" <'col-sm-6 col-md-6 col-lg-6'l>"
                //     +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                //     "destroy":true,
                  
                //     pageLength: 50,
                //     sInfoFiltered:false,
                //     language: datatableLenguaje(datatable),
                //     data: retorno.listaTramite,
                //     columnDefs: [
                //         {  className: "todo_mayus ", targets: 0 },
                //         {  className: "todo_mayus ", targets: 1 },
                //         {  className: " todo_mayus", targets: 2 },
                //         {  className: "todo_mayus", targets: 3 },
                //         {  className: "todo_mayus", targets: 4 },
                //         {  className: "todo_mayus", targets: 5 },
                //         {  className: "todo_mayus", targets: 6 },
                //         {  className: "bg-warning", targets: 7 },
                //         {  className: "ocultar", targets: 8 },
                //         {  className: "ocultar", targets: 9 }
                //     ],
                //     columns:[
                //         {data: "detalle_tramite.tramite.prioridad.nivel" },
                //         {data: "detalle_tramite.tramite.prioridad.nivel" },
                //         {data: "detalle_tramite.tramite.prioridad.descripcion" },
                //         {data: "detalle_tramite.tramite.codTramite" },
                //         {data: "detalle_tramite.tramite.fechaCreacion" },
                //         {data: "detalle_tramite.departamento_origen.nombre" },
                //         {data: "detalle_tramite.asunto" },
                //         {data: "detalle_tramite.departamento_origen.nombre" },
                //         {data: "detalle_tramite.departamento_origen.nombre" },
                //         {data: "detalle_tramite.departamento_origen.nombre" },
                //     ],
                //     "rowCallback": function( row, destino, index ){
                //         if(destino.detalle_tramite.tramite.prioridad.nivel==3 ){
                //              var color='#ff7d8a'; 
                //         }else if(destino.detalle_tramite.tramite.prioridad.nivel==2){ 
                //             var color="#fff3cd"; 
                //         }else{
                //             var color='';
                //         }
                //         if(destino.fijar==1){
                //             var nivel=destino.fijar+destino.detalle_tramite.tramite.prioridad.nivel+4;
                //             var texto_fijar=`<center><span  style="color:#DED415;font-size:18px; cursor:pointer;" data-toggle="tooltip" data-placement="top" title="No fijar" class="fa fa-star fijado" onclick="fijar('${destino.iddestino}','0')"></span></center>`;
                //         }else{
                //             var nivel=destino.fijar+destino.detalle_tramite.tramite.prioridad.nivel;
                //             var texto_fijar=`<center><span style="color:#DED415;font-size:18px; cursor:pointer" data-toggle="tooltip" data-placement="top" title="Fijar" onclick="fijar('${destino.iddestino}','1')" class="fa fa-star-o no_fijado"></span></center>`;

                //         }
                //         console.log(nivel);
                //         $('td', row).eq(0).html(`<center> ${nivel} </center>`);
                //         $('td', row).eq(0).css('display','none');
                //         $('td',row).eq(1).addClass('todo_mayus');
                //         $('td',row).eq(1).css('background-color',color);
                //         $('td',row).eq(1).html(texto_fijar);
                //         $('td',row).eq(2).addClass('todo_mayus');
                //         $('td',row).eq(2).css('background-color',color);
                //         $('td',row).eq(3).addClass('todo_mayus');
                //         $('td',row).eq(3).css('background-color',color);
                //         $('td',row).eq(4).addClass('todo_mayus');
                //         $('td',row).eq(4).css('background-color',color);
                //         $('td',row).eq(5).addClass('todo_mayus');
                //         $('td',row).eq(5).css('background-color',color);
                //         $('td',row).eq(6).addClass('todo_mayus');
                //         $('td',row).eq(6).css('background-color',color);
                //         $('td',row).eq(7).addClass('warning');
                //         $('td',row).eq(7).css('background-color',color);
                //         $('td',row).eq(8).addClass('ocultar');
                //         $('td',row).eq(8).css('background-color',color);
                //         $('td',row).eq(9).addClass('ocultar');
                //         $('td',row).eq(9).css('background-color',color);



                //         var mostrarTerminar = false;
                //         var iddepaLog = $("#iddepaLog").val();

                //         if(destino.detalle_tramite.flujo == null){ // flujo no definido
                //         if(destino.tipo_envio == "P"){
                //             mostrarTerminar = true;
                //         }
                //         }else{ // flujo definido

                //             $.each(destino.detalle_tramite.flujo.flujo_hijo, function(fh, flujo_hijo){
                //                 if(flujo_hijo.iddepartamento == iddepaLog){
                //                     if(flujo_hijo.tipo_flujo == "G" && flujo_hijo.estado_finalizar == 1){
                //                         mostrarTerminar = true;
                //                     }
                //                 }
                //             });

                //         }
            
                        // $('td', row).eq(0).html(`<center>${index+1}</center>`);// primer fila
                        // var jefe_departamento = retorno.departamentoLogueado['jefe_departamento'];
                        // var reasignado = destino.detalle_tramite.reasignado;
                        // $('td', row).eq(7).html(`<button type="button" onclick="verTramite('${destino.detalle_tramite.iddetalle_tramite_encrypt}', 'E','${jefe_departamento}', '${reasignado}', '0',this)" class="btn btn-sm btn-info" style="margin-bottom: 0;"><i class="fa fa-eye"></i> Ver Detalle</button>`);

                        // //botones solo permitidos para destinos 'PARA'
                        // if(destino.tipo_envio =="P"){
                        //     $('td', row).eq(8).html(`<a href="/detalleTramite/atenderDetalleTramite?iddetalle_tramite=${destino.detalle_tramite.iddetalle_tramite_encrypt}" class="btn btn-sm btn-warning" style="margin-bottom: 0;"><i class="fa fa-edit"></i></a>`);
                        //     $('td', row).eq(8).addClass('botones_para');
                        //     $('td', row).eq(8).attr('data-detalle', destino.detalle_tramite.iddetalle_tramite_encrypt); // para cargar el boton de "DEVOLVER" trámite

                        //     if(mostrarTerminar == true){ // boton terminar trámite
                        //         $('td', row).eq(9).html(`<a href="/detalleTramite/terminarTramite?iddetalle_tramite=${destino.detalle_tramite.iddetalle_tramite_encrypt}" class="btn btn-sm btn-success" style="margin-bottom: 0;"><i class="fa fa-thumbs-o-up"></i></a>`);                
                        //         $('td', row).eq(9).addClass('botones_para');                               
                        //     }else{
                        //         $('td', row).eq(9).html('<i class="fa fa-ban icon_stop"></i>');
                        //     }
                    
                        // }else{
                        //     $('td', row).eq(8).html('<i class="fa fa-ban icon_stop"></i>');
                        //     $('td', row).eq(9).html('<i class="fa fa-ban icon_stop"></i>');
                        // }


                //     },
                    
                //     order: [[ 0, "desc" ]],                            
                // });
                
                // // quitamos la clase solo "bg-warning" y "todo_mayus" solo en la cabecera
                // var columnas = $(tablatramite.table().header()).children('tr').find('th');
                // $(columnas).removeClass('bg-warning');
                // $(columnas).removeClass('todo_mayus');

            }else{
                $.each(retorno.listaDestinoInterno, function (i, destino_act) {
                    var detalle_tramite_padre = destino_act.detalle_actividad.detalle_tramite.detalle_tramite_padre;
                    if(detalle_tramite_padre.tramite.prioridad.nivel==3 ){
                        var color='#f798a1ab'; 
                    }else if(detalle_tramite_padre.tramite.prioridad.nivel==2){ 
                        var color="#fff3cd"; 
                    }else{
                        var color='';
                    }

                    if(destino_act.fijar==1){
                        var nivel=destino_act.fijar+detalle_tramite_padre.tramite.prioridad.nivel+retorno['max_prioridad']+1;
                        var texto_fijar=`<center><span  style="color:#DED415;font-size:18px; cursor:pointer;" data-toggle="tooltip" data-placement="top" title="No fijar" class="fa fa-star fijado" onclick="fijar('${destino_act.iddestino_act_encrypt}','0','I')"></span></center>`;
                    }else{
                        var nivel=destino_act.fijar+detalle_tramite_padre.tramite.prioridad.nivel;
                        var texto_fijar=`<center><span style="color:#DED415;font-size:18px; cursor:pointer" data-toggle="tooltip" data-placement="top" title="Fijar" onclick="fijar('${destino_act.iddestino_act_encrypt}','1','I')" class="fa fa-star-o no_fijado"></span></center>`;

                    }
                    $('#tabla_tramites tbody').append(`
                        <tr style="background-color:${color}" role="row" class="odd">
                            <td class="todo_mayus ocultar">${nivel}</td>
                            <td class="todo_mayus">${texto_fijar}</td>
                            <td class="todo_mayus">${detalle_tramite_padre.tramite.prioridad.descripcion}</td>
                            <td class="todo_mayus">${destino_act.detalle_actividad.detalle_tramite.tramite.codTramite}</td>
                            <td class="todo_mayus">${destino_act.detalle_actividad.fecha} <br><b style="color:red;font-size:10px">Han transcurrido ${destino_act.detalle_actividad.dias} días</b></td>
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
                            <td class="ocultar"></td>
                            <td class="ocultar"></td>
                        </tr>
                    `);
                });
                $(".fijado").mouseover(function(event){
                    $(this).removeClass("fa fa-star");
                    $(this).addClass("fa fa-star-o");
        
                 });
                 $(".fijado").mouseout(function(event){
                    $(this).removeClass("fa fa-star-o");
                    $(this).addClass("fa fa-star");
                 });
                 $(".no_fijado").mouseover(function(event){
                    $(this).removeClass("fa fa-star-o");
                    $(this).addClass("fa fa-star");
                 });
                 $(".no_fijado").mouseout(function(event){
                    $(this).removeClass("fa fa-star");
                    $(this).addClass("fa fa-star-o");
                 });
                $('[data-toggle="tooltip"]').tooltip();
                cargar_estilos_tabla();
            }
            
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


    // ================ FUNCIONES PARA PARA LOS TRÁMITES INTERNOS ====================================


        function verTramiteInterno(iddetalle_tramite_encrypt, iddetalle_actividad_encrypt, btn){            
            
            $("#botones_para").html("");
            $.get('/detalleActividad/getValidarDetalleActividad/'+iddetalle_actividad_encrypt, function(retorno){

                if(retorno.error){
                    alertNotificar(retorno.mensaje, retorno.status);
                }else{
                    $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado
                    $("#listaTramites_entrada").hide(200);
                    $("#contet_ver_tramite").show(200);
                    mostrarDetalleTramite(iddetalle_tramite_encrypt); // reutilizada de otro jquery                    

                    //boton para atender el trámite
                    addBoton = `<a href="/detalleActividad/atenderDetalleActividad?iddetalle_actividad=${iddetalle_actividad_encrypt}" class="btn btn-warning btn_regresar" ><i class="fa fa-edit"></i> Atender</a>`;
                    //boton para devolver un trámite
                    addBoton = addBoton+`<button class="btn btn-outline-danger btn_regresar" onclick="devolverTramiteInterno('${iddetalle_actividad_encrypt}')"><i class="fa fa-history"></i> Devolver</button>`;
                    //boton para terminar el tramite
                    // if(retorno.permitir_terminar==true){
                    //     addBoton = addBoton+`<a href="/detalleActividad/terminarTramiteInt?iddetalle_tramite=${iddetalle_tramite_encrypt}&iddestino_act=${retorno.destino_act_actual.iddestino_act_encrypt}" class="btn btn-success btn_regresar" ><i class="fa fa-thumbs-o-up"></i> Terminar</a>`; 
                    // }
                    addBoton = addBoton+`<a href="/detalleActividad/terminarTramiteInt?iddetalle_actividad=${iddetalle_actividad_encrypt}&iddestino_act=${retorno.destino_act_actual.iddestino_act_encrypt}" class="btn btn-success btn_regresar" ><i class="fa fa-thumbs-o-up"></i> Terminar</a>`;
                    //agregamos los botones        
                    $("#botones_para").html(addBoton);
                                    
                }
                
            }).fail(function(){
                alertNotificar("Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "error");
                vistacargando();
            });
            


        }

        function devolverTramiteInterno(iddetalle_actividad_encrypt){
            $("#modal_detalle_devolver").modal("show");
            $("#frm_devolverTramite").attr("action", `/detalleActividad/devolverActividad/${iddetalle_actividad_encrypt}`);
            $("#textarea_detalle_revision").val("");
        }

        function devolverTramiteInternoA(iddetalle_tramite_borrador_encrypt){

            vistacargando("M", "Espere...");
            $("#table_devolver_interno tbody").html("");
            $("#js_textarea_detalle_revision").val("");
            $.get('/detalleActividad/getDetallesEnvia/'+iddetalle_tramite_borrador_encrypt, function(retorno){
                
                vistacargando();
                console.log(retorno);

                $.each(retorno.lista_detalle_actividad, function(i, detalle_actividad){
                    $("#table_devolver_interno tbody").append(`
                        <tr>
                            <td style="padding: 4px;">
                                <div class="check_dias">
                                    <label class="" for="check_detact" style="user-select: none;">
                                        <input type="checkbox" name="check_iddetact[]" class="flat icheck" value="${detalle_actividad.iddetalle_actividad_encrypt}">
                                    </label>
                                </div>
                            </td>
                            <td style="padding: 4px 8px; text-align: left;">${detalle_actividad.us001_envia.name}</td>
                            <td style="padding: 4px 8px; text-align: left;">${detalle_actividad.asunto}</td>
                            <td style="padding: 4px 8px; text-align: left;">${detalle_actividad.fecha}</td>
                        </tr>
                    `);

                    $("#table_devolver_interno tbody").find('.icheck').iCheck({
                        checkboxClass: 'icheckbox_flat-green',
                        radioClass: 'iradio_flat-green'
                    });

                });
                $("#modal_js_devolver_interno").modal("show");

            }).fail(function(){
                vistacargando();
            });
        }


        $("#frm_js_devolver_interno").submit(function(e){
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
                success: function(retorno){                                      
                    vistacargando(); // ocultamos la ventana de espera 
                    alertNotificar(retorno.mensaje, retorno.status);
                    if(!retorno.error){                        
                        // refrescamos la tabla de trámites
                        // cerrarDetalleTramite();
                        // filtratTramiteEntrada();
                        // $("#modal_js_devolver_interno").modal("hide");
                        vistacargando("M", "Espere...");
                        window.location.href = "/gestionBandeja/entrada";
                    }                    
                    
                },
                error: function(error){
                    // alertNotificar(","error");
                    vistacargando(); // ocultamos la ventana de espera
                }
            }); 
        });


    // ================== FUNCIONES PARA LOS TRAMITES INICIADOS POR USUARIO INTERNO ====================

        function verTramiteInicioInterno(iddetalle_tramite_encrypt, btn){

            $(btn).tooltip("hide"); // ocultamos el tooltip del boton precionado
            $("#listaTramites_entrada").hide(200);
            $("#contet_ver_tramite").show(200);
            mostrarDetalleTramite(iddetalle_tramite_encrypt); // reutilizada de otro jquery

            $.get("/tramite/detalleTramite/"+iddetalle_tramite_encrypt, function(retorno){
                detalle_tramite = retorno.detalle_tramite;
                if(detalle_tramite.estado_inint=="E"){

                    //boton para atender el trámite
                    addBoton = `<a href="/detalleTramite/editarDetalleTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" class="btn btn-warning btn_regresar" ${tooltip_antender}><i class="fa fa-edit"></i> Atender</a>`;
                    //boton para devolver un trámite
                     addBoton = addBoton+`<button class="btn btn-outline-danger btn_regresar" onclick="devolverTramiteInternoA('${iddetalle_tramite_encrypt}')" ${tooltip_devolver}><i class="fa fa-history"></i> Devolver a</button>`;
                    //boton para asignar a funcionarios (proceso interno)   
                    addBoton = addBoton+`<a href="/detalleActividad/delegarDetalleTramite?iddetalle_tramite=${iddetalle_tramite_encrypt}" class="btn btn-info btn_regresar" ${tooltip_delegar}><i class="fa fa-users"></i> Delegar</a>`;
                    //boton para terminar el tramite
                    //  addBoton = addBoton+`<a href="/detalleActividad/terminarTramiteInt?iddetalle_actividad=${iddetalle_actividad_encrypt}&iddestino_act=${retorno.destino_act_actual.iddestino_act_encrypt}" class="btn btn-success btn_regresar" ><i class="fa fa-thumbs-o-up"></i> Terminar</a>`;
                     //agregamos los botones        
                     $("#botones_para").html(addBoton);

                }
            });

        }

        //PARA FIJAR UN TRAMITE PARA QUE APARESCA DE PRIMERO
        function fijar(idtramite,valor,parametro){
          
            if(valor==1){
                var tittle="¿Está seguro que desea fijar el trámite?";
            }else{
                var tittle="¿Está seguro que ya no desea fijar el trámite?";
            }
            swal({
                title: "",
                text: tittle,
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
                    vistacargando('m','Por favor espere...');
                        $.get("/gestionBandeja/fijarTramite/"+idtramite+'/'+valor+'/'+parametro, function(retorno){
                            if(retorno['error']==true){
                                alertNotificar(retorno['detalle'],'error');
                                vistacargando();
                                return;
                            }
                            location.reload();
                        }).fail(function(){
                            alertNotificar('Ocurrió un error intente nuevamente','error');
                            vistacargando();
                        });
                  }
                  sweetAlert.close();   // ocultamos la ventana de pregunta
              }); 
           
        }

        $(".fijado").mouseover(function(event){
            $(this).removeClass("fa fa-star");
            $(this).addClass("fa fa-star-o");

         });
         $(".fijado").mouseout(function(event){
            $(this).removeClass("fa fa-star-o");
            $(this).addClass("fa fa-star");
         });
         $(".no_fijado").mouseover(function(event){
            $(this).removeClass("fa fa-star-o");
            $(this).addClass("fa fa-star");
         });
         $(".no_fijado").mouseout(function(event){
            $(this).removeClass("fa fa-star");
            $(this).addClass("fa fa-star-o");
         });