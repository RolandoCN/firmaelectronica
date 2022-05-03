function cargar_lista_plan(){
    var num_col = $("#TablaListaPlan thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);
   
    $.get("/gestionCoactiva/cargarDatosPlanes", function(data){
        console.log(data)
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            $("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center>No se encontraron datos</center></td></tr>`);
            return;   
        }
        if(data.error==false){
            
            if(data.resultado.length <= 0){
                $("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center>No se encontraron datos</center></td></tr>`);
                alertNotificar("No se encontró datos","error");
                return;  
            }
         
            $('#TablaListaPlan').DataTable({
                "destroy":true,
                pageLength: 10,
                autoWidth : true,
                order: [[ 0, "desc" ]],
                sInfoFiltered:false,
                language: {
                    url: '/json/datatables/spanish.json',
                },
                columnDefs: [
                    { "width": "10%", "targets": 0, "className":"text-center"},
                    { "width": "25%", "targets": 1, "className":"text-center" },
                    { "width": "10%", "targets": 2, "className":"text-center" },
                    { "width": "35%", "targets": 3, },
                    { "width": "10%", "targets": 4, "className":"text-center" },
                    { "width": "15%", "targets": 5, "className":"text-center" },
                    
                   
                ],
                data: data.resultado,
                columns:[
                        {data: "idcoact_plan"},
                        {data: "descripcion" },
                        {data: "created_at"},
                        {data: "estado"},
                        {data: "estado"},
                        {data: "estado"},
                ],    
                "rowCallback": function( row, data ) {

                    var set=[''];
                    var hr='';
                    $.each(data.plan_contribuyente,function(i,item){            
                        if(i>=0){hr=`<p style="padding-bottom:1px">`;}                       
                        var cont=`<b>CIU:</b> ${item.ciu}<br><b>Identificación</b> ${item.identificacion}<br><b>Razón Social: </b> ${item['nombres']}<br> `;
                        set[i]= ` ${hr} ${cont}`;
                    });

                    $('td', row).eq(3).html(set);


                    $('td', row).eq(5).html(`
                                        <form method="DELETE" class="frm_eliminar" action="/gestionCoactiva/coactivar/delete/${data.idcoact_plan_encrypt}"  enctype="multipart/form-data">
                                        
                                            <a onclick="buscar_plan('${data.idcoact_plan_encrypt}')" class="btn btn-primary btn-xs">
                                            <i class="fa fa-eye"></i> Ver </a>
                                           
                                        </form>
                                    
                    `); 
                }             
            });
        }
    }).fail(function(){
        $("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center>No se encontraron datos</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });

}

function regresar(){
    $('#seccion_busqueda').show();
    $('#seccion_detalle_coac').hide();
    $('#codigo_modal').html('');
    $('#descripcion_modal').html('');
    $('#fecha_modal').html('');
    $('#usario_modal').html('');
    $('#estado_modal').html('');
}

function buscar_plan(plan){

    if(plan=="" || plan==null){
        alertNotificar("Plan no encontrado","error");
        
        return;
    }
    
    $('#btnCoact').prop('disabled',true);
    $('#btnCoact').hide();   
    
    $('#plan_se').val(plan);
    $('.contet_titulo_seleccion').html('');
    $('#tb_listaContBody').html('');
    $("#TablaContr").DataTable().destroy();
    $('#TablaContr tbody').empty();
    var num_col = $("#TablaContr thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 

    $('#cedulas_con').html('');

    vistacargando("m","Espere por favor");
    $.get("/gestionCoactiva/infoPlanesContribuyente/"+plan, function (data) {
        console.log(data)
        vistacargando("");
      
        $('#tb_listaCoactivaBody').html('');
        if(data.error==true){
            $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
            alertNotificar(data.mensaje,'error');
            return;                      
        }

        $('#TablaContr tbody').html('');
        
        $.each(data['resultado'][0]['plan_contribuyente'], function(i, item){
            
            $('#cedulas_con').append(`<input type="hidden" name="cedulas_sel[]" value="${item['identificacion']}"></input>`);
            
            $('#TablaContr').append(`<tr role="row" class="odd">
                            
                            <td style="text-align:center;width:15%; vertical-align: middle">
                                ${item['ciu']}
                            </td>
                            <td style="text-align:center;vertical-align: middle;width:15%">
                                ${item['identificacion']}
                                
                            </td>
                            <td style="text-align:center;width:50%">
                                ${item['nombres']}
                                
                            </td>
                            
                            <td style="min-width:20%"class="paddingTR">
                                <center>
                                    <button type="button" style="padding-top:0px !important; padding-bottom:0px !important" class="btn btn-sm btn-success" onClick="tiulos_info('${item['identificacion']}','${item['idcoact_plan']}')">
                                        <i class="fa fa-file"></i>
                                        Títulos       
                                    </button>
                                </center>
                            </td>

                            
                        </tr>  `);
                        
    
            
        });
        console.log(data)
        $('#seccion_busqueda').hide();
        $('#seccion_detalle_coac').show();

        $('#codigo_modal').html(data['resultado'][0].idcoact_plan);
        $('#descripcion_modal').html(data['resultado'][0].descripcion);
        $('#fecha_modal').html(data['resultado'][0].created_at);
        $('#usario_modal').html(data['resultado'][0].usuario_registra.name);
        $('#estado_modal').html(data['resultado'][0].estado);


        
        globalThis.mensaje_coact=true;

        //si todos las emisiones estan coactivadas desabilitamos el boton coactivar
        if(data['resultado'][0].estado=='Coactivado'){
          
            mensaje_coact=true;
            $('#btnCoact').show();
            
        }else{
            mensaje_coact=false;
            $('#btnCoact').show();
            $('#btnCoact').prop('disabled',false);            
            
        }        
        
        cargar_estilos_tabla("TablaContr",10);


    }).fail(function(error){
        $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
        
        vistacargando("");
        alertNotificar("Error al ejecutar la petición","error");
    });
    
}


function cargar_estilos_tabla(idtabla,pageLength){

    $("#"+idtabla).DataTable({
        'paging'      : true,
        'searching'   : true,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : true,
        "destroy":true,
        pageLength: 10,
        sInfoFiltered:false,
        language: {
            url: '/json/datatables/spanish.json',
        },
    });
}

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

function cargar_estilos_tabla_tit(idtabla,pageLength){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 5, "desc" ]],
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


function tiulos_info(cedula,plan){
    globalThis.plan_sel=plan;
    $('#detalle_cont').hide();
    $('#contribuyente_modal').html('');
    $('#cedula_modal').html('');
    
    $('#cerrar_detalle').hide();
    $('#cerrar_modal').show();
    $('#modalTitulos').modal('show');
    
    $('#tb_listadoTit').html('');
    $("#TablaListaTitulo").DataTable().destroy();
    $('#TablaListaTitulo tbody').empty();
    var num_col = $("#TablaListaTitulo thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 

    $.get("/gestionCoactiva/titulosCreditos/"+cedula+"/"+plan, function (data) {
        $('#tb_listadoTit').html('');
        $('#tb_listadoTitCoact').html('');
        
        if(data.error==true){
            $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 

            alertNotificar(data.mensaje,'error');
            return;                      
        }    

        cargar_titulos(data,cedula);
       
       
    }).fail(function(error){

        $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 

      
        vistacargando("");
        alertNotificar("Error al ejecutar la petición","error");
    });
    
}

function cargar_titulos(data,cedula){
    $('#contribuyente_modal').html(data.detalle[0].nombre);
    $('#cedula_modal').html(cedula);
    var total_titulo=0;
    var total_aplica=0;
    var cont=0;
    console.log(data)
    $('#TablaListaTitulo tbody').html('');
    $.each(data['detalle'], function(i, item){
       
          
        cont=cont+1;
        total_titulo=total_titulo+1;
        if(item['aplica']==1){
            $(".contet_titulo_seleccion").append(`<input id="input_${item['emi01codi']}" type="hidden" name="list_cod_emisiones[]" value="${item['emi01codi']}">`);
            var chequear="checked";
            total_aplica=total_aplica+1;
        }else{
            var chequear="";
        }

        var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva']))-parseFloat(item['descuento']);
        
       
        $('#TablaListaTitulo').append(`<tr role="row" class="odd">
            

                <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                <input data-id="${item['emi01codi']}" id="codtitulo_${item['emi01codi']}" value="${item['emi01codi']}" name="cod_emision[]"  style="width:20px;height:20px;;cursor: pointer" type="checkbox" ${chequear} >
                </td>

                <td style="text-align:center;width:5%">
                    ${item['estado']}
                </td>

                <td style="text-align:center;width:15%">
                    ${item['emi01codi']}
                </td>


                <td style="text-align:center;width:40%">
                    ${item['impuesto']}
                </td>

                <td style="text-align:center;width:10%">
                    ${item['anio']} - ${item['mes']}
                </td>

                <td style="text-align:center;width:10%">
                    $${parseFloat(total).toFixed(2)}
                </td>

                <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                <center>
                    <button type="button" class="btn btn-sm btn-success marginB0" onClick="detalleEmision(${item['valor']},${item['iva']},${item['coactiva']},${item['descuento']},${item['interes']},${item['recargo']})">
                            <i class="fa fa-eye" >
                                
                            </i> Ver
                        </button>
                </center>
                </td>
            
            </tr>  `);

            $(`#codtitulo_${item['emi01codi']}`).click(function(){
                if($(`#codtitulo_${item['emi01codi']}`).prop('checked')){
                    $(".contet_titulo_seleccion").append(`<input id="input_${item['emi01codi']}" type="hidden" name="list_cod_emisiones[]" value="${item['emi01codi']}">`);
                }else{
                    $(`#input_${item['emi01codi']}`).remove();
                }
            });
                
        
        
    });

    var nfilas=$("#tb_listadoTit tr").length;
    if(nfilas==0){
        $('#btn_titulos').hide();
    }else{
        $('#btn_titulos').show();
    }

    
    if(total_titulo==total_aplica){
        $('#btnSeleccionarTit').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
        $('#btnSeleccionarTit').removeClass('btn-info');
        $('#btnSeleccionarTit').addClass('btn-danger');
        $('#btnSeleccionarTit').attr('onClick','deseleccionarTodosTit()');
    }else{
        $('#btnSeleccionarTit').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
        $('#btnSeleccionarTit').removeClass('btn-info');
        $('#btnSeleccionarTit').addClass('btn-danger');
        $('#btnSeleccionarTit').attr('onClick','deseleccionarTodosTit()');
    }
    
    
    cargar_estilos_tabla_tit("TablaListaTitulo",10);
    $('#detalle_cont').show();    
}

function seleccionarTodosTitulos(){
    cargar_estilos_tabla_tit('TablaListaTitulo',-1);
	var inputs=$('#TablaListaTitulo').find('input');
	$.each(inputs,function(i,item){
        $(".contet_titulo_seleccion").append(`<input id="input_${item.attributes[0].value}" type="hidden" name="list_cod_emisiones[]" value="${item.attributes[0].value}">`);
		$(`#${item.id}`).prop('checked',true);
	})
	$('#btnSeleccionarTit').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
	$('#btnSeleccionarTit').removeClass('btn-info');
	$('#btnSeleccionarTit').addClass('btn-danger');
	$('#btnSeleccionarTit').attr('onClick','deseleccionarTodosTit()');
  
}

function deseleccionarTodosTit(){
    cargar_estilos_tabla_tit('TablaListaTitulo',-1);
	var inputs=$('#tb_listadoTit').find('input');
    $(".contet_titulo_seleccion").html('');
	$.each(inputs,function(i,item){
		$(`#${item.id}`).prop('checked',false);
	})
	reseterarBtnSeleccionTit();
    cargar_estilos_tabla_tit('TablaListaTitulo',10);

}

function reseterarBtnSeleccionTit(){
	$('#btnSeleccionarTit').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
	$('#btnSeleccionarTit').removeClass('btn-danger');
	$('#btnSeleccionarTit').addClass('btn-info');
	$('#btnSeleccionarTit').attr('onClick','seleccionarTodosTitulos()');
}

//aplicar_coactiva
function aplicar_coactivas(){
    if(mensaje_coact==true){
        alertNotificar("Todos los títulos fuerón coactivados anteriormente","success");
        return;
    }
    var array_cedula=[];
    $("input[name='cedulas_sel[]']").each(function(indice, elemento) {
        array_cedula.push($(elemento).val());
    });

    var array_emisiones=[];
    $("input[name='list_cod_emisiones[]']").each(function(indice, elemento) {
        array_emisiones.push($(elemento).val());
    });

    swal({
        title: '',
        text: 'Está seguro de coactivar los títulos de crédito',
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
           
            $('#coactivar_titulo').submit();

        }
        sweetAlert.close();   
        
    });
}

$('#coactivar_titulo').submit(function(e){
    e.preventDefault();
    vistacargando("m","Espere por Favor");
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/gestionCoactiva/coactivarEmision',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            
            vistacargando("");
            if(data['error']==true){
                alertNotificar(data['detalle'], "error");
                return;
            }
            if(data['error']==false){
                alertNotificar(data['detalle'],'success');
                
                $('#modalTitulos').modal('hide');
                regresar();
                cargar_lista_plan();
            }
            
        },
        error: function(e){
            vistacargando("");
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            return;
        }
    });
})



function detalleEmision(subtotal,iva,coactiva,descuento,interes,recargo){
    $('#bodyModalDetalles').show();
    $('#bodyModalListaTitulo').hide();

    $('#cerrar_detalle').show();
    $('#cerrar_modal').hide();
    
    $('#bodydetalles').html(`<tr align="center">
                                <td>
                        			$${parseFloat(subtotal).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(iva).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(coactiva).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(descuento).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(interes).toFixed(2)}
                        		</td>
                        		<td>
                        			$${parseFloat(recargo).toFixed(2)}
                        		</td>
                        	</tr>`);
	
}


function cerrar_detalle(){
    $('#bodyModalDetalles').hide();
    $('#bodyModalListaTitulo').show();

    $('#cerrar_detalle').hide();
    $('#cerrar_modal').show();
}

$('#modalTitulos').on('hidden.bs.modal', function (e) {
    cerrar_detalle();
})

