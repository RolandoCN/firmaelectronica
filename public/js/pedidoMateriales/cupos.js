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

$("#cmb_material").change(function(e){
    vistacargando('m','Por favor espere....');
    $('#tabla_materiales_departamento').hide(200);
    $('#div_cupo').html('');
    $('#div_cupo').addClass('hidden');
    $("#check_cantidad_general").iCheck('uncheck');
    var stock= $(`#optionmaterial${this.value}`)[0].attributes[0].value;
    var idmaterial=this.value;
    $.get('/materiales/cupos_dep/'+idmaterial, function (data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            $('.option_material_dep').prop('selected',false); 
            $(`#cmb_material option[value=""]`).prop('selected',true); 
            $("#cmb_material").trigger("chosen:updated");
            return;
        }
        $('#lista_materiales_departamento').html('');
        $("#tabla_materiales_dep").DataTable().destroy();
        $('#tabla_materiales_dep tbody').empty();
        $.each(data['detalle'],function(i,item){
            
            if(item['cupo']>0){
                var cupo=item['cupo'];
            }else{
                var cupo='';
            }
            $('#lista_materiales_departamento').append(`<tr>
            <td width="50%">${item['nombre']}</td>
            <td width="10%" >
                <input id="input_cupo${item['iddepartamento']}" value="${cupo}" type="number"  class="form-control "> 
            </td>
            <td width="10%" align="center"><button type="button" onclick="guardarcupos('${item['iddepartamento']}','${idmaterial}',${stock})" class="btn btn-sm btn-info"><span class="fa fa-save"></span></button></td>`);
        });
        cargar_estilos_tabla('tabla_materiales_dep');
        $('#tabla_materiales_departamento').show(200);
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        $('.option_material_dep').prop('selected',false); 
        $(`#cmb_departamento option[value=""]`).prop('selected',true); 
        $("#cmb_departamento").trigger("chosen:updated");
        vistacargando();
    })


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

function guardarcupos(iddepartamento,idmaterial,stock){
    var cupo=parseInt($(`#input_cupo${iddepartamento}`).val());
    stock=parseInt(stock);
    if(cupo<=0){
        alertNotificar('Por favor ingresar el cupo','warning');
        return;
    }
    if(stock<cupo){
        alertNotificar('El cupo no debe superar al stock de '+stock,'warning');
        return;
    }
    vistacargando('m','Asignando cupo');
    $.get('/materiales/guardar_cupo/'+iddepartamento+'/'+idmaterial+'/'+cupo, function (data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }
        alertNotificar(data['detalle'],'success');
        vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    })
}

$('#check_cantidad_general').on('ifChecked', function(event){
    $('#div_cupo').html(`<div class="form-group " >
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="">Cupo  <span class="required">*</span></label>
                            <div class="col-md-6 col-sm-6 col-xs-12 ">
                                <input type="number" class="form-control" id="cupo_general" required name="cupo_general">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for=""></label>
                            <div class="col-md-6 col-sm-6 col-xs-12 ">
                                <button class="btn btn-sm btn-primary"><i class="fa fa-save"></i> Guardar</button>
                            </div>
                        </div>`);
    $('#div_cupo').removeClass('hidden');
});

$('#check_cantidad_general').on('ifUnchecked', function(event){
    $('#div_cupo').html('');
    $('#div_cupo').addClass('hidden');
});

$("#form_cupos_general").submit(function(e){ 
    e.preventDefault();
    if($('#cmb_material').val()=='' || $('#cmb_material').val()==0){
        alertNotificar('Por favor seleccione el material','warning');
        return;
    }
    if($('#cupo_general').val()<=0){
        alertNotificar('Por favor el cupo debe ser mayor a 0','warning');
        return;
    }
    var cupo=parseInt($('#cupo_general').val());
    var stock= parseInt($(`#optionmaterial${$("#cmb_material").val()}`)[0].attributes[0].value);
    if(stock<cupo){
        alertNotificar('El cupo no debe superar al stock disponible del material, disponibilidad: '+stock,'warning');
        return;
    }

    vistacargando('M','Guardando cupo general...');
        var FrmData = new FormData(this);
        $.ajaxSetup({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
        });
         $.ajax({
          url: "/materiales/cupo_general",
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
            alertNotificar(data['detalle'],'success');
            cargar_tabla($('#cmb_material').val(),stock);
            vistacargando();            
        }
        }).fail(function(){
            alertNotificar('Ocurrió un error intente nuevamente','error');
            vistacargando();
        });
});

function cargar_tabla(idmaterial,stock){
    $('#tabla_materiales_departamento').hide(200);
    $.get('/materiales/cupos_dep/'+idmaterial, function (data){
        $('#lista_materiales_departamento').html('');
        $("#tabla_materiales_dep").DataTable().destroy();
        $('#tabla_materiales_dep tbody').empty();
        $.each(data['detalle'],function(i,item){
            
            if(item['cupo']>0){
                var cupo=item['cupo'];
            }else{
                var cupo='';
            }
            $('#lista_materiales_departamento').append(`<tr>
            <td width="50%">${item['nombre']}</td>
            <td width="10%" >
                <input id="input_cupo${item['iddepartamento']}" value="${cupo}" type="number"  class="form-control "> 
            </td>
            <td width="10%" align="center"><button type="button" onclick="guardarcupos('${item['iddepartamento']}','${idmaterial}',${stock})" class="btn btn-sm btn-info"><span class="fa fa-save"></span></button></td>`);
        });
        cargar_estilos_tabla('tabla_materiales_dep');
        $('#tabla_materiales_departamento').show(200);
    }).fail(function(){
        alertNotificar('Ocurrió un error intente nuevamente','error');
        vistacargando();
    });
}