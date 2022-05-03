    


$('#frm_reporte_usuario').submit(function(){
        event.preventDefault();       
        if($('#funcionario').val()==0){
           alertNotificar('Seleccione el funcionario', "error");
           return
        }
        vistacargando('M','Por favor espere...');
       
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: '/reporteUsuarios',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            success: function(data){
                if(data['error']==true){
                    vistacargando();
                    alertNotificar(data['detalle'], "error");
                    return;
                }
                if(data['error']==false){
                    cargartablejs(data);
                    alertNotificar('Registro Exitoso', "success");
                    $('#funcionario').val(0);
                    $('#tiporeporte').val('Tarea');
                    $("#funcionario").trigger("chosen:updated");
                    $("#tiporeporte").trigger("chosen:updated");
                }
                 vistacargando();
        },
        error: function(e){
           
            vistacargando();
            alertNotificar(data['detalle'], "error");
            return;
        }
    });
});

function cargartablejs(data){
    $('#tbodyReportUsuario').html('');
    $("#tableUsuarioReporte").DataTable().destroy();
    $('#tableUsuarioReporte tbody').empty();

     $.each(data['detalle'], function(i, item){
        $('#tbodyReportUsuario').append(`<tr role="row" class="odd">
                            <td  width="1%" colspan="1">
                                ${i+1}
                            </td>
                            <td   colspan="1">
                                ${item['usuario']['name']}
                            </td>
                            <td   colspan="1">
                                ${item['tipo']}
                            </td>
                             <td align="center"   colspan="1">
                                <button onclick="eliminar('${item['idmv_reporte_usuario']}')" class="btn btn-xs btn-danger"><span class="fa fa-trash"></span> </button> 
                            </td>
                            </tr>`);
     });
     cargar_estilos_tabla("tableUsuarioReporte");
    
}


//ESTILOS DE TABLA

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

    $(document).ready(function () {
        $(`#tableUsuarioReporte`).DataTable({
            pageLength: 10,
            "language": lenguajeTabla
        });
    });


    function eliminar(id){
        swal({
            title: "",
            text: "¿Está seguro de eliminar este registro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-sm btn-info",
            cancelButtonClass: "btn-sm btn-danger",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que si
                acccioneliminar(id);
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    }

function acccioneliminar(id){
    vistacargando("M",'Por Favor espere');
    $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

    $.ajax({
        type: "DELETE",
        url: '/reporteUsuarios/'+id,
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){ 
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
               
            }
            if(data['error']==false){
                cargartablejs(data);
                $('#funcionario').val(0);
                $('#tiporeporte').val('Tarea');
                $("#funcionario").trigger("chosen:updated");
                $("#tiporeporte").trigger("chosen:updated");
                alertNotificar('Registro Eliminado','success');
            }
            vistacargando();
        },
        error: function(e){
            alertNotificar(data['detalle'], "error");
            vistacargando();
            return;
        }
    }); 
}