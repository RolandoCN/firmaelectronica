
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
        cargar_estilos_tabla("sr_tabla_solicitudes");
    });

    function cargar_estilos_tabla(idtabla){

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
            "language": lenguajeTabla
        });

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
        $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','1px');
        $(`#${idtabla}`).find('.resp').css('width','150px');  
        $(`#${idtabla}`).find('.flex').css('display','flex');   
        $('[data-toggle="tooltip"]').tooltip();
        
    }


//FUNCIONES PARA AROBAR O DENEAR UNA SOLICITUD
    function aprobar_denegar_solicitud_actividad(id_encrypt, accion){
        

        swal({
            title: "",
            text: "¿Está seguro que desea continuar?",
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
                
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
        
                var frmData = {
                    id: id_encrypt,
                    sr_accion: accion                    
                }
        
                vistacargando("M", "Espere...");

                $.post("/controlProyecto/aprobarDenegarSolicitudAct", frmData, function(retorno){
                    
                    console.log(retorno);
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);                            
                    if(!retorno.error){                        
                        cargar_tabla_solicitudes_actividad(retorno.solic_actividad);                     
                    }
            
                }).fail(function(){
                    vistacargando();
                    alertNotificar("No se pudo realizar la operación, por favor intente más tarde.");  
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    }


    function cargar_tabla_solicitudes_actividad(solic_actividad){ 
               
        $("#sr_tabla_solicitudes").DataTable().destroy();
        $('#sr_tabla_solicitudes tbody').empty();
    
        $.each(solic_actividad, function(key, actividad){

            var responsable = "";
            if(actividad.departamento_responsable!=null){
                responsable = (`
                    <ul class="list-inline" style="margin-bottom: 0px;">
                        <li><a class="pull-left border-aero icon_respon" data-toggle="tooltip" data-original-title="${actividad.departamento_responsable.nombre}"> <i class="fa fa-institution aero"></i></a></li>
                        <li><a class="pull-left border-aero icon_respon_user" data-toggle="tooltip" data-original-title="${actividad.usuario_responsable.name}"> <i class="fa fa-user aero"></i></a></li>
                    </ul>
                `);
            }

            $("#sr_tabla_solicitudes tbody").append(`
                <tr>
                    <td class="col_sm">${key+1}</td>                    
                    <td>
                        <a>${actividad.descripcion}</a><br>
                        <small><b>Proyecto:</b> ${actividad.proyecto.descripcion} </small>
                    </td>                                            
                    <td>
                        <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Del: </b> <span style="width: max-content; line-height: inherit;">${actividad.fechaInicio}</span></span>
                        <span style="display: flex; line-height: inherit;"><b style="padding-right: 2px;">Al: </b>  <span style="width: max-content; line-height: inherit;">${actividad.fechaFin}</span></span>
                    </td>
                    <td> ${responsable} </td>
                    <td>
                        Solicitud para reprogramar la fecha final de la actividad para que finalize el <b>${actividad.fecha_reprogramar}</b>
                    </td>     
                    <td>
                        <center>
                            <button onclick="aprobar_denegar_solicitud_actividad('${actividad.idcon_actividad_encrypt}', 'A')" class="btn btn-success btn-xs">
                                <i class="fa fa-thumbs-up"></i> Aprobar 
                            </button>
                            <button onclick="aprobar_denegar_solicitud_actividad('${actividad.idcon_actividad_encrypt}', 'D')" class="btn btn-danger btn-xs">
                                <i class="fa fa-thumbs-down"></i> Denegar
                            </button>
                        </center>
                    </td>                                          
                </tr>
            `);

        });

        cargar_estilos_tabla("sr_tabla_solicitudes");

    }