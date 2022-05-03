

    $(document).ready(function () {

        $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});
        
        $("#tabla_tramites").DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            pageLength: 10,
            "language": {
                "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                            '<option value="5">5</option>'+
                            '<option value="10">10</option>'+
                            '<option value="15">15</option>'+
                            '<option value="20">20</option>'+
                            '<option value="30">30</option>'+
                            '<option value="-1">Todos</option>'+
                            '</select> registros',
                "search": "<b><i class='fa fa-search'></i> Buscar: </b>",
                "searchPlaceholder": "Ejm: GADM-000-2020-N",
                "zeroRecords": "No se encontraron registros coincidentes",
                "infoEmpty": "No hay registros para mostrar",
                "infoFiltered": " - filtrado de MAX registros",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente"
                }
            }
        });

    });

    function verTramite(iddetalle_tramite, idtramite){
        
        $("#listaTramites_entrada").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite); // reutilizada de otro jquery

        //cargamos la información de los botones
        $("#btn_buscar_imprimir").prop('href', '/tramite/comprobanteTramite/'+idtramite);

    }

    function cerrarDetalleTramite(){
        $("#listaTramites_entrada").show(200);
        $("#contet_ver_tramite").hide(200);

        //limpiamos la información de los botones
        $("#btn_buscar_imprimir").prop('href', '');
    }

    $("#buscartramite").keyup(function(event){
        if (event.keyCode === 13) {
            filtrarTramite();
        }
    });


    // function filtrarTramite(){

    //     var busqueda = $("#buscartramite").val();
    //     if(busqueda==""){ return; }

    //     vistacargando("M", "Buscando...");
    //     $.get("/tramite/buscarTramiteFiltrar/"+busqueda, function(retorno){
    //         vistacargando();
    //         if(retorno.error){
    //            alertNotificar(retorno.resultado.mensaje, "error");
    //         }else{
    //             cargarTablaBusqueda(retorno.resultado.listaDetallesTramite);
    //         }
    //     }).fail(function(){
    //         alertNotificar("Error al realizar la petición", "error");
    //         vistacargando();  
    //     });
    // }


    $("#frm_buscar_tramite").submit(function(event){
            
        event.preventDefault();
        if($('#buscar_info').val()==''){
            alertNotificar('Por favor ingrese el criterio de búsqueda','warning');
            return;
        }
        var formulario = this; // obtenemos el formulacion

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
            url: `/tramite/buscarTramiteFiltrar`,
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

                vistacargando();
                if(retorno.error){
                   alertNotificar(retorno.resultado.mensaje, "error");
                }else{
                    cargarTablaBusqueda(retorno.resultado.listaDetallesTramite);
                }

            },
            error: function(error){
                $(formulario).removeClass('disabled_content');
                $(btn_submit).html(txt_submit);
                alertNotificar("No se pudo realizar la petición, por favor intente más tarde.", "error");                    
            }
        });

    });



    function cargarTablaBusqueda(listaDetallesTramite){


        
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
                data: listaDetallesTramite,
                columnDefs: [
                    {  className: "todo_mayus", targets: 0 },
                    {  className: "todo_mayus", targets: 1 },
                    {  className: "todo_mayus", targets: 2 },
                    {  className: "todo_mayus", targets: 3 },
                    {  className: "todo_mayus", targets: 4 },
                    {  className: "todo_mayus", targets: 5 },                
                    {  className: "bg-warning", targets: 6 },
                ],
                columns:[
                    { data: "asunto" }, //valor por defecto 
                    { data: "asunto", render : function (data, type, detalle) {                         
                        if(detalle.iddetalle_tramite_padre == null){ return detalle.departamento_origen.nombre; }
                        else{ return detalle.detalle_tramite_padre.departamento_origen.nombre; }
                    } 

                    },
                    { data: "fecha" },
                    { data: "tramite.codTramite" },
                    { data: "asunto" }, //valor por defecto
                    { data: "asunto" },   
                    { data: "asunto" },                                           
                ],

                  "rowCallback": function( row, detalle_tramite, index ){  
                      
                    //cargamos el índice de la columna
                    $('td', row).eq(0).html(`<center>${index+1}</center>`);

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

                    $('td', row).eq(4).html(`<ul style="margin-bottom: 0px; padding-left: 20px;">${destinos}</ul>`);
                        
                    //cargamos el boton de ver detalle
                    $('td', row).eq(6).html(`<button type="button" onclick="verTramite('${detalle_tramite.iddetalle_tramite_encrypt}', '${detalle_tramite.tramite.idtramite_encrypt}')" class="btn btn-sm btn-info" style="margin-bottom: 0;"><i class="fa fa-eye"></i> Ver Detalle</button>`);

                }
                                          
            });

            // quitamos la clase solo "bg-warning" y "todo_mayus" solo en la cabecera
            var columnas = $(tablatramite.table().header()).children('tr').find('th');
            $(columnas.eq(0)).css({'width':'1px'});
            $(columnas).removeClass('bg-warning');
            $(columnas).removeClass('todo_mayus');

            console.warn("Tabla de trámites actualizada");


    }
    
