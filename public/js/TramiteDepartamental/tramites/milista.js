// cargamos la tabla
$(document).ready(function () {
    cargartable();
});
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



function cargartable(){
    $.get('/tramite/listas', function(data){
        $('#bodymilista').html('');
        $("#table_milista").DataTable().destroy();
        $('#table_milista tbody').empty();
       
        $.each(data['detalle'],function(i,item){
            var destinos='';
            console.log(item['listadepartamento']);
            $.each(item['listadepartamento'],function(i2,item2){
                destinos=destinos+ `<li>
                                        ${item2['departamento']['jefe_departamento'][0]['us001']['name']}<br>
                                        <b style="color:#0559c9;font-size:12px;padding-left:18px">${item2['departamento']['nombre']}</b>
                                    </li>`
            //    destinos=destinos+ `<tr>
               
            //         <td>
            //             ${item2['departamento']['jefe_departamento'][0]['us001']['name']}
            //         </td>
            //         <td>
            //             ${item2['departamento']['nombre']}
            //         </td>
            //     </tr>`
            });
            $('#bodymilista').append(`<tr role="row" class="odd">
                <td  align="center" style="font-size: 14px;text-align: center; vertical-align: middle" class="paddingTR" >
                    ${item['descripcion']}
                </td>
                <td width="50%" >

                                ${destinos}
                
                </td>
                
               
                <td  style="text-align: center; vertical-align: middle;"  class="paddingTR">
                    <center>
                        <button onclick="editarlista(${item['idtd_lista']})" type="button" class="btn btn-sm btn-info marginB0" >
                            <i class="fa fa-eye" ></i> Editar
                        </button>
                        <button onclick="eliminarlista(${item['idtd_lista']})" type="button" class="btn btn-sm btn-danger marginB0">
                            <i class="fa fa-eye" ></i> Eliminar
                        </button>
                    </center>
                </td>
                
            </tr>  `);
        });

        cargar_estilos_tabla('table_milista');
    });
}


$('#frm_milista').submit(function(e){
    e.preventDefault();
    if($('#destinos').val()==null){
        alertNotificar('Seleccione los destinos','warning');
        return;
    }
    vistacargando('m','Creando lista..')
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/tramite/storelista',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'], "error");
                vistacargando();
                return;
            }
            if(data['error']==false){
                cargartable();
                alertNotificar(data['detalle'], "success");
                vistacargando();
                limpiar();

            }
        },
        error: function(e){
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            vistacargando();
            return;
        }
    });
});

function eliminarlista(id){
  
    swal({
        title: '',
        text: 'Está seguro que desea eliminar la lista, recuerde que se eliminarán todos los destinos',
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-sm btn-info",
        cancelButtonClass: "btn-sm btn-danger",
        confirmButtonText: "Si, Aceptar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que si
            vistacargando("M",'Eliminando..');
            $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
        
            $.ajax({
                type: "DELETE",
                url: '/tramite/eliminarlista/'+id,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){ 
                    if(data['error']==true){
                        alertNotificar(data['detalle'],'error');
                        return;
                    }
                    if(data['error']==false){
                        alertNotificar(data['detalle'], "success");
                        cargartable();
                    }
                    vistacargando();
                },
                error: function(e){
                    alertNotificar('Ocurrió un error intente nuevamente', "error");
                    vistacargando();
                    return;
                }
            }); 
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    });
}


function editarlista(idlista){
    vistacargando('m','Por favor espere...');
    $.get('/tramite/show/'+idlista, function(data){
        console.log(data);
        $('#nombre_lista').val(data['detalle']['descripcion']);
        $('.opcion_destinos').prop("selected", false);
        $.each(data['detalle']['listadepartamento'], function(index, dep){            
            $(`#destinos option[value="${dep['iddepartamento']}"]`).prop("selected", true);  
            $("#destinos").trigger("chosen:updated");          
        }); 
        $('#btn_actualizar').attr('onclick', `updatelista(${idlista})`);
        $('#btn_actualizar').show();
        $('#btn_guardar').hide();
        $('#btn_cancelar').show();
        

        
        vistacargando();

    });
}

function updatelista(id){
    vistacargando('m','Actualizando lista...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "PUT",
        url: '/tramite/update',
        data: { 
            destinos:$('#destinos').val(),
            lista: $('#nombre_lista').val(),
            idlista: id
        },

        success: function(data){ 
                if(data['error']==true){
                    alertNotificar(data['detalle'],'error');
                    vistacargando();
                    return;
                }
                if(data['error']==false){
                    alertNotificar(data['detalle'], "success");
                    vistacargando();
                    cargartable();
                    cancelar();
                }
        }
    });
}

function cancelar(){
    $('#btn_guardar').show();
    $('#btn_actualizar').hide();
    $('#btn_cancelar').hide();
    $('#destinos').val(0);
    $('.opcion_destinos').prop("selected", false);
    $(`#destinos option[value="0"]`).prop("selected", true);  
    $("#destinos").trigger("chosen:updated");  
    $('#nombre_lista').val('');
}

function limpiar(){
    $('#destinos').val(0);
    $('.opcion_destinos').prop("selected", false);
    $(`#destinos option[value="0"]`).prop("selected", true);  
    $("#destinos").trigger("chosen:updated");  
    $('#nombre_lista').val('');
}