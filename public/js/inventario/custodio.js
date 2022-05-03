$(document).ready(function(){
    cargar_listado();   
       
});

//carga listado en la tabla
function cargar_listado(){
    $(".contet_activos_selecc").html('');
    $(".contet_activos_name").html('');
    $(".contet_nombre_activos_selecc").html('');
	$('#tb_listaBienLibre').html('');
	$("#TablaBienLibre").DataTable().destroy();
    $('#TablaBienLibre tbody').empty();
    var num_col = $("#TablaBienLibre thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaBienLibre tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);   
   
    $.get("/inventarios/cargarBienLibre", function(data){
      
        if(data.error==true){
            $("#TablaBienLibre tbody").html('');
            $("#TablaBienLibre tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            $('#btns_accion_modal').hide();
            $("#TablaBienLibre tbody").html('');
            $("#TablaBienLibre tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            return;                      

        }
        $('#btns_accion_modal').show();
        $("#TablaBienLibre tbody").html('');
       
        $.each(data['resultado'], function(i, item){
           
            var btn=`<button type="button" class="btn btn-primary" onclick="sincronizar('${item.idactivo}')">
            Detalle
            </button> 
                
            `;

            var marca=item.marca;
            var modelo=item.modelo;
            var marca_modelo=marca+" - "+modelo;

            $('#TablaBienLibre').append(`<tr role="row" class="odd" id="fila_${item['idactivo']}">

                            <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                            <input data-id="${item['idactivo']}" id="contet_activos_${item['idactivo']}" value="${item['idactivo']}" name="cod_emision[]"  style="width:20px;height:20px;;cursor: pointer" class="chec"type="checkbox">
                            </td>
                            
                            <td width="13%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item['idactivo']}
                            </td>  
                        
                            <td  width="30%" colspan="1">
                                ${item.material}
                                <input name="nombre_act[]" id="${item['idactivo']}" type="hidden" class="activos_selecc_lis_name"  value="${item.material}">
                            </td>

                            <td width="20%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                                ${marca_modelo}
                            </td>

                            <td  width="15%"style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item.feccompra}
                            </td> 

                            <td width="17%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item.valorcompra}
                            </td>
                        
                        
                         
                            
                        </tr>  `);

                        $(`#contet_activos_${item['idactivo']}`).click(function(){
                            if($(`#contet_activos_${item['idactivo']}`).prop('checked')){
                                $(".contet_activos_selecc").append(`<input id="input_${item['idactivo']}" type="hidden" name="list_activos[]" value="${item['idactivo']}">`);

                                $(".contet_activos_name").append(`<input id="inputname_${item['idactivo']}" type="hidden" name="name_list_activos[]" value="${item['material']}">`);


                            }else{
                                $(`#input_${item['idactivo']}`).remove();
                                $(`#inputname_${item['idactivo']}`).remove();
                            }
                        });
                                
                            
        });

        
        cargar_estilos_tabla("TablaBienLibre",5);
    
    }).fail(function(){
        $("#TablaBienLibre tbody").html('');
        $("#TablaBienLibre tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   

}

function modal_busqueda(){
    $(".contet_nombre_activos_selecc").html('');
    $('#modalActivo').modal('show');

}

function agregar_lista_act(){
    var inputs=$('.contet_activos_selecc').find('input');
    if(inputs.length==0){
        alertNotificar("Por favor seleccione al menos una activo", "error"); return;
    }

    array_nombre=[];
    var inputs=$('#TablaBienLibre').find('input:checked');

    $("input[name='name_list_activos[]']").each(function(indice, elemento) {

        var nombre_activos=$(elemento).val();
        array_nombre.push(nombre_activos);

    });

    var activos= array_nombre.join(', ')
   
    $(".contet_nombre_activos_selecc").append(` <div class="form-group">
                                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="">Detalles<span class="required">*</span>
                                                    </label>
                                                    <div class="col-md-7 col-sm-7 col-xs-12">
                                                        <textarea id="n" rows="4" class="form-control col-md-7 col-xs-12" disabled name="name_activo">${activos}</textarea>
                                                    </div>
                                                </div>
    
    
                                               `);


    $('#activos_libre').val(array_nombre.length+" elementos seleccionados");
    $('#modalActivo').modal('hide');

}


function cancelar(){
    array_nombre=[];
    $('#activos_libre').val(array_nombre.length+" elementos seleccionados");
    $('#modalActivo').modal('hide');
    cargar_listado();

    $('#btnSeleccionar').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
    $('#btnSeleccionar').removeClass('btn-danger');
    $('#btnSeleccionar').addClass('btn-default');
    $('#btnSeleccionar').attr('onClick','seleccionarTodos()');
}


function cargar_estilos_tabla(idtabla,pageLength){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "asc" ]],
        pageLength: pageLength,
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




function seleccionarTodos(){
    $(".contet_activos_name").html('');
    $(".contet_activos_selecc").html('');
    cargar_estilos_tabla('TablaBienLibre',-1);
    var inputs=$('#tb_listaBienLibre').find('.chec');
    $.each(inputs,function(i,item){

        $(".contet_activos_selecc").append(`<input id="input_${item.attributes[0].value}" type="hidden" name="list_activos[]" value="${item.attributes[0].value}">`);
        $(`#${item.id}`).prop('checked',true);

       
    })

    var inputs_name=$('#tb_listaBienLibre').find('.activos_selecc_lis_name');
    $.each(inputs_name,function(i,item2){
          
        $(".contet_activos_name").append(`<input id="inputname_${item2.id}" type="hidden" name="name_list_activos[]" value="${item2.value}">`);
       
    })


    $('#btnSeleccionar').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
    $('#btnSeleccionar').removeClass('btn-default');
    $('#btnSeleccionar').addClass('btn-danger');
    $('#btnSeleccionar').attr('onClick','deseleccionarTodos()');
    // cargar_estilos_tabla('TablaBienLibre',10);
  }
  
  
  
  function deseleccionarTodos(){
    cargar_estilos_tabla('TablaBienLibre',-1);
    var inputs=$('#tb_listaBienLibre').find('input');
    $(".contet_activos_name").html('');
    $(".contet_activos_selecc").html('');
    $.each(inputs,function(i,item){
        $(`#${item.id}`).prop('checked',false);
    })
    reseterarBtnSeleccion();
    cargar_estilos_tabla('TablaBienLibre',5);
  
  }
  
function reseterarBtnSeleccion(){
    $('#btnSeleccionar').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
    $('#btnSeleccionar').removeClass('btn-danger');
    $('#btnSeleccionar').addClass('btn-default');
    $('#btnSeleccionar').attr('onClick','seleccionarTodos()');
}

$("#dato_empleado").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#msjAlerta').html('<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los datos del empleado.</div>');
    if(e.which == 13) { // codigo del enter
        e.preventDefault();
        buscarInfo();
    }  
});
// al darle click a continuar
function buscarInfo(){
    var buscar = $("#dato_empleado").val();
    if(buscar==""){
        alertNotificar("Ingrese los datos del empleado","error");
        $("#dato_empleado").focus();
        $('#msjAlerta').html('');
        $('#alertIdAlert').fadeOut()
        return;
    }else{
        buscar_empleado();
        $('#msjAlerta').html('');
        $('#alertIdAlert').fadeOut()
    }
};

function limpiar_empleado(input){

    //verificamos si ya fue previamente buscado un material
    var idempl=$('#id_empleado').val();
    if(idempl!=""){
        $('#id_empleado').val('');
        $('#dato_empleado').val('');
    }
       
}


function buscar_empleado(){
    // validamos para ocultar el contenido de busqueda cuando
    var busqueda = $('#dato_empleado').val();
    var conten_busqueda = $('#dato_empleado').siblings('.conten_busqueda');
    var div_content = $(conten_busqueda).children('.div_content');
    $(conten_busqueda).hide();
       
       
    $('#EmpleadoLista').empty(); // limpiamos la tabla
    vistacargando("m","Buscando información...");
    $.get('/inventarios/buscarEmpleados/'+busqueda, function (data){
    
        vistacargando("");
       
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            return;
        }
        if(data.resultado.length==0){
            alertNotificar("No se encontró el empleado","info");
            return;
        }
        
        $('#EmpleadoLista').empty();
        $.each(data.resultado, function(i, item){
           
            $(conten_busqueda).show();
            $('#EmpleadoLista').append(
            
            `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
            border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarEmpleado('${item.idemplea}','${item.cedula}','${item.nombres}')">` +
            '<i class="fa fa-user"></i>   '  +item.cedula+" - "+ item.nombres +
            '</button>' +
            '<div class="dropdown-divider"></div>'
            );
        }); 
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   
} 

function capturarEmpleado(idemplea,cedula,nombres){
    $('.conten_busqueda').hide();
    $('#dato_empleado').val(cedula+" - "+nombres);
    $('#id_empleado').val(idemplea);
   
    
}


$("#dato_departamento").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#msjAlerta').html('<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los datos del departamento.</div>');
    if(e.which == 13) { // codigo del enter
        e.preventDefault();
        buscarDepart();
    }  
});
// al darle click a continuar
function buscarDepart(){
    var buscar = $("#dato_departamento").val();
    if(buscar==""){
        alertNotificar("Ingrese los datos del departamento","error");
        $("#dato_departamento").focus();
        $('#msjAlerta').html('');
        $('#alertIdAlert').fadeOut()
        return;
    }else{
        dato_departamento();
        $('#msjAlerta').html('');
        $('#alertIdAlert').fadeOut()
    }
};

function limpiar_departamento(input){

    //verificamos si ya fue previamente buscado un material
    var iddep=$('#id_departamento').val();
    if(iddep!=""){
        $('#id_departamento').val('');
        $('#dato_departamento').val('');
    }
       
}


function dato_departamento(){
    // validamos para ocultar el contenido de busqueda cuando
    var busqueda = $('#dato_departamento').val();
    var conten_busqueda = $('#dato_departamento').siblings('.conten_busqueda');
    var div_content = $(conten_busqueda).children('.div_content');
    $(conten_busqueda).hide();
       
       
    $('#DepartamentoLista').empty(); // limpiamos la tabla
    vistacargando("m","Buscando información...");
    $.get('/inventarios/buscarDepartamentos/'+busqueda, function (data){
    
        vistacargando("");
       
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            return;
        }
        if(data.resultado.length==0){
            alertNotificar("No se encontró el departamento","info");
            return;
        }
        
        $('#DepartamentoLista').empty();
        $.each(data.resultado, function(i, item){
           
            $(conten_busqueda).show();
            $('#DepartamentoLista').append(
            
            `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
            border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarDepartamento('${item.iddepart}','${item.descripcion}')">` +
            '<i class="fa fa-building"></i>   '  +item.descripcion+
            '</button>' +
            '<div class="dropdown-divider"></div>'
            );
        }); 
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   
} 

function capturarDepartamento(iddepartamento,nombredep){
    $('.conten_busqueda').hide();
    $('#dato_departamento').val(nombredep);
    $('#id_departamento').val(iddepartamento);
   
    
}










