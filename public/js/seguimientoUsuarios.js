
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
        var idtabla = "table_usuarios";
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

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
    });


        //FUNCION PARA FILTRAR LOS TRÁMITES
        function filtrar_usuarios(){
           
            var FrmData = {
                origen_user: $(".origen_user:checked").val()
            }
    
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
    
            vistacargando("M", "Espere...");
            $("#mensaje_info").hide(100);
    
            $.ajax({
                url: '/seguimientoUsuario/filtrarUsuario',
                method: "POST",
                data: FrmData,
                type: "json",
                success: function (retorno)
                {
                    vistacargando();
    
                    if(retorno.error == true){
                        mostrarMensaje(retorno.mensaje,retorno.status,'mensaje_info');
                    }else{
    
                        //cargamos le resumen de la búsqueda
                        $("#r_totales").html(retorno.lista_usuarios.length);
                        $("#content_resultado").show();
    
                        var idtabla = "table_usuarios";
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
                            data: retorno.lista_usuarios,
                            columnDefs: [
                                { className: "col_sm", targets: 0 },
                                { className: "sorting", targets: 1 },
                                { className: "sorting", targets: 2 },
                                { className: "sorting", targets: 3 },
                                { className: "sorting", targets: 4 }
                            ],
                            columns:[                                                              
                                {data: "cedula", render : function (item, type, row){
                                    var color = "success";
                                    var text = "ENLINEA";
                                    $.each(row.us001_tipo_usuario, function (i, us_tipo){                                         
                                        if(us_tipo.tipo_usuario.tipo == "FP" || us_tipo.tipo_usuario.tipo == "ADFP"){
                                            console.log(row);
                                            color = "info";
                                            text = "INTRANET";
                                        }
                                    });
                                    return `<center><span class="badge badge-${color}">${text}</span></center>`;
                                }},
                                {data: "cedula" },
                                {data: "name" },
                                {data: "email" },
                                {data: "created_at" }

                            ],
                            "rowCallback": function( row, em_cer, index ){
                                
                            }
                        });
    
                        // para posicionar el input del filtro
                        $(`#${idtabla}_filter`).css('float', 'left');
                        $(`#${idtabla}_filter`).children('label').css('width', '100%');
                        $(`#${idtabla}_filter`).parent().css('padding-left','0');
                        $(`#${idtabla}_wrapper`).css('margin-top','10px');
                        $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
                        //buscamos las columnas que deceamos que sean las mas angostas
                        $(`#${idtabla}`).find('.col_sm').css('width','1px');
                        // $(`#${idtabla}`).find('.col_lg').css('width','300px');
    
                    }
    
                },error: function(){
                    mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                    vistacargando();
                }
            });
    
        }

    
    //FUNCION PARA AGREGAR UN MENSAJE EN LA PANTALLA
    function mostrarMensaje(mensaje, status, idelement){
        var contenidoMensaje=`
            <div style="font-weight: 700;" class="alert alert-${status} alert-dismissible alert_sm" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>MENSAJE! </strong> <span> ${mensaje}</span>
            </div>
        `;
        $("#"+idelement).html(contenidoMensaje);
        $("#"+idelement).show(500);

        setTimeout(() => {
            $("#"+idelement).hide(500);
        }, 8000);
    }
