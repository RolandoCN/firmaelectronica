$(document).ready(function(){
    cargar_tabla();
});
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
    "zeroRecords": "No se encontraron registros",
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

function cargar_tabla(){
    $('#tabla_departamento').hide(200);
    var checked='';
    var textotittle='Clic para permitir o no permitir solicitar materiales'
    $.get('/materiales/departamentos/', function (data){
        $('#lista_departamento').html('');
        $("#tabla_dep").DataTable().destroy();
        $('#tabla_dep tbody').empty();

        $.each(data['detalle'],function(i,item){
            if(item['solicitud_material']==1){
                checked='checked';

            }else{
                checked='';
            }
            $('#lista_departamento').append(`<tr>
            <td width="50%">${item['nombre']}</td>
            <td align="center" width="10%" >
                <input ${checked} data-toggle="tooltip" 
                    data-original-title="${textotittle}" data-placement="top" style="width:20px;height:20px;cursor: pointer;"id="input_dep${item['iddepartamento']}"  type="checkbox"  > 
            </td>`);
            $(`#input_dep${item['iddepartamento']}`).change(function() {
                if(this.checked) {
                    permitir(item['iddepartamento'],1);
                }else{
                    permitir(item['iddepartamento'],0);
                }
            });
        });
        cargar_estilos_tabla('tabla_dep');
        $('#tabla_departamento').show(200);
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
}

$("#form_parametrizacion").submit(function(e){ 
    e.preventDefault();
    vistacargando('M','Guardando parametrizacion...');
    var FrmData = new FormData(this);
    $.ajaxSetup({
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
    });
    $.ajax({
    url: "/materiales/guardar_parametrizacion",
    method: 'POST',
    data: FrmData,
    dataType: 'json',
    contentType:false,
    cache:false,
    processData:false,
    success: function(data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }   
            cargar_tabla();
            alertNotificar(data['detalle'],'success');
            vistacargando();            
        }
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
});

function guardar_parametrizacion(){
    swal({
        title: "",
        text: "¿Esta seguro que desea realizar la parametrización? recuerde que solo se permitirá realizar solicitud cuando la fecha actual este dentro del rango parametrizado",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, aceptar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            $("#form_parametrizacion").submit();
        }
        sweetAlert.close();
    }); 
}

function permitir(iddepartamento,valor){
    swal({
        title: "",
        text: "¿Esta seguro que desea realizar la parametrización?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, aceptar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            $.get('/materiales/permitir/'+iddepartamento+'/'+valor, function (data){
                if(data['error']==true){
                    alertNotificar(data['detalle'],'error');
                    vistacargando();
                    return;
                }   
                    cargar_tabla();
                    alertNotificar(data['detalle'],'success');
                    vistacargando();            
            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente','error');
                vistacargando();
            });
        }
        sweetAlert.close();
    }); 
}



