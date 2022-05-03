function cargar_lista_plan_coact(){
    var num_col = $("#TablaListaPlan thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);
   
    $.get("/gestionCoactiva/cargarDatosPlanesCoact", function(data){
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
                        var cont=`<b>CIU:</b> ${item.ciu}<br> <b>Identificación:</b> ${item.identificacion}<br><b>Razón Social: </b> ${item['nombres']} `;
                        set[i]= ` ${hr} ${cont}`;
                    });

                    $('td', row).eq(3).html(set);
                    $('td', row).eq(5).html(`
                                        <form method="DELETE" class="frm_eliminar" action="/gestionCoactiva/coactivar/delete/${data.idcoact_plan_encrypt}"  enctype="multipart/form-data">
                                        
                                            <a onclick="buscar_plan_coact('${data.idcoact_plan}')" class="btn btn-primary btn-xs">  <i class="fa fa-eye"></i> Ver </a>
                                           
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
    $('#codigo_modal').html('');
    $('#descripcion_modal').html('');
    $('#fecha_modal').html('');
    $('#usario_modal').html('');
    $('#estado_modal').html('');
    $('#seccion_busqueda').show();
    $('#seccion_detalle_coac').hide();
    ventana_cargando=true;
}

globalThis.ventana_cargando=true;
function buscar_plan_coact(plan){
    if(plan=="" || plan==null){
        alertNotificar("Plan no encontrado","error");        
        return;
    }
    
   
      
    $('.contet_titulo_seleccion_des').html('');
    $('#tb_listaContBody').html('');
    $("#TablaContr").DataTable().destroy();
    $('#TablaContr tbody').empty();
    var num_col = $("#TablaContr thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 

    if(ventana_cargando==true){
        vistacargando("m","Espere por favor");
    }
        
    $.get("/gestionCoactiva/infoPlanesCoactivados/"+plan, function (data) {
        
        if(ventana_cargando==true){
            vistacargando("");
        }

        $('#tb_listaCoactivaBody').html('');
        if(data.error==true){
            $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>No hay registros para mostrar</b></center></td></tr>`); 
            alertNotificar("No hay emisiones para descoactivar para este plan",'error');
            return; 
        }

        $('#TablaContr tbody').html('');
        $.each(data['resultado'], function(i, item){
           
            $('#TablaContr').append(`<tr role="row" class="odd">
                            
                            <td style="text-align:center;width:15%; vertical-align: middle">
                                ${item['ciu']}
                            </td>
                            <td style="text-align:center;vertical-align: middle;width:15%">
                                ${item['cedula']}                                
                            </td>

                            <td style="text-align:center;width:50%">
                                ${item['nombres']}                                
                            </td>

                            <td style="min-width:20%"class="paddingTR">
                                <center>
                                    
                                    <button type="button" class="btn btn-sm btn-success" onClick="tiulos_info('${item['cedula']}','${item['idplan']}')"><i class="fa fa-file"></i>
                                        Título       
                                    </button>

                                    
                                </center>
                            </td>
                            
                        </tr>  `);
                        
    
            
        });
        console.log(data)
        $('#seccion_busqueda').hide();
        $('#seccion_detalle_coac').show();
      
        
        $('#codigo_modal').html(data['resultado'][0].idplan);
        $('#descripcion_modal').html(data['resultado'][0].plan);
        $('#fecha_modal').html(data.fecha);
        $('#usario_modal').html(data['resultado'][0].usuario);
        $('#estado_modal').html(data['resultado'][0].estado);

        cargar_estilos_tabla("TablaContr",10);


    }).fail(function(error){
        $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
        
        if(ventana_cargando==true){
            vistacargando("");
        }

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


function tiulos_info(cedula,plan){
    globalThis.plan_sel=plan;
    $('#detalle_cont').hide();
    $('#contribuyente_modal').html('');
    $('#cedula_modal').html('');

    $('.contet_titulo_seleccion_des').html('');
    $('#btn_titulos_coact').hide();
    $('#cerrar_detalle_coat').hide();
    $('#cerrar_modal').show();
    $('#modalTitulos').modal('show');
    
   
    $('#tb_listadoTitCoact').html('');
    $("#TablaListaTituloCoact").DataTable().destroy();
    $('#TablaListaTituloCoact tbody').empty();
    var num_col = $("#TablaListaTituloCoact thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaListaTituloCoact tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 

    $.get("/gestionCoactiva/titulosCreditos/"+cedula+"/"+plan, function (data) {
     
        $('#tb_listadoTit').html('');
        $('#tb_listadoTitCoact').html('');
        
        if(data.error==true){
           
            $("#TablaListaTituloCoact tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 

            alertNotificar(data.mensaje,'error');
            return;                      
        }

        cargar_titulos_coactivados(data,cedula);

       
    }).fail(function(error){

        $("#TablaListaTituloCoact tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
        vistacargando("");
        alertNotificar("Error al ejecutar la petición","error");
    });
    
}


function cargar_titulos_coactivados(data,cedula){
    $('#contribuyente_modal').html(data.detalle[0].nombre);
    $('#cedula_modal').html(cedula);    
    $('#btn_titulos_coact').hide();
    $('.contet_titulo_seleccion_des').html('');
    $('#TablaListaTituloCoact tbody').html('');
    var cont=0;
    $.each(data['detalle'], function(i, item){
     
        if(item.estado=='Coactivado'){
            cont=cont+1;
            var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva']))-parseFloat(item['descuento']);
        
            $('#TablaListaTituloCoact').append(`<tr role="row" class="odd">
                        <td style="text-align:center;width:5%">
                            ${cont}
                        </td>

                        <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                        <input data-id="${item['emi01codi']}" id="codtitulocoact_${item['emi01codi']}" value="${item['emi01codi']}" name="cod_emision[]"  style="width:20px;height:20px;;cursor: pointer" type="checkbox">
                        </td>

                        <td style="text-align:center;width:15%">
                            ${item['emi01codi']}
                        </td>

                       

                        <td style="text-align:center;width:35%">
                            ${item['impuesto']}
                        </td>

                        <td style="text-align:center;width:15%">
                            ${item['anio']} - ${item['mes']}
                        </td>

                        <td style="text-align:center;width:20%">
                            $${parseFloat(total).toFixed(2)}
                        </td>

                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                        <center>
                            <button type="button" class="btn btn-sm btn-success marginB0" onClick="detalleEmisionCoact(${item['valor']},${item['iva']},${item['coactiva']},${item['descuento']},${item['interes']},${item['recargo']})">
                                    <i class="fa fa-eye" >
                                        
                                    </i> Ver
                                </button>
                        </center>
                        </td>
                    
                    </tr>  `);

                    $(`#codtitulocoact_${item['emi01codi']}`).click(function(){
                        if($(`#codtitulocoact_${item['emi01codi']}`).prop('checked')){
                            $(".contet_titulo_seleccion_des").append(`<input id="input_${item['emi01codi']}" type="hidden" name="list_cod_emisionesco[]" value="${item['emi01codi']}">`);
                        }else{
                            $(`#input_${item['emi01codi']}`).remove();
                        }
                    });
                    
        }
        

        
    });
    
   
    if(data['detalle'].length>0){
        $('#btn_titulos_coact').show();
        $('#btnSeleccionarTitDes').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
        $('#btnSeleccionarTitDes').removeClass('btn-danger');
        $('#btnSeleccionarTitDes').addClass('btn-info');
        $('#btnSeleccionarTitDes').attr('onClick','seleccionarTodosDesc()');
    }else{
        $('#btn_titulos_coact').hide();
    }
    
    cargar_estilos_tabla_tit("TablaListaTituloCoact",10);
    $('#detalle_cont').show(); 
}

function seleccionarTodosDesc(){
    cargar_estilos_tabla_tit('TablaListaTituloCoact',-1);
	var inputs=$('#TablaListaTituloCoact').find('input');
	$.each(inputs,function(i,item){
        $(".contet_titulo_seleccion_des").append(`<input id="input_${item.attributes[0].value}" type="hidden" name="list_cod_emisionesco[]" value="${item.attributes[0].value}">`);
		$(`#${item.id}`).prop('checked',true);
	})
	$('#btnSeleccionarTitDes').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
	$('#btnSeleccionarTitDes').removeClass('btn-info');
	$('#btnSeleccionarTitDes').addClass('btn-danger');
	$('#btnSeleccionarTitDes').attr('onClick','deseleccionarTodosDes()');
  
}

function deseleccionarTodosDes(){
    cargar_estilos_tabla_tit('TablaListaTituloCoact',-1);
	var inputs=$('#TablaListaTituloCoact').find('input');
    $(".contet_titulo_seleccion_des").html('');
	$.each(inputs,function(i,item){
		$(`#${item.id}`).prop('checked',false);
	})
	reseterarBtnSeleccionDes();
    cargar_estilos_tabla_tit('TablaListaTituloCoact',10);

     

}

function reseterarBtnSeleccionDes(){
	$('#btnSeleccionarTitDes').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
	$('#btnSeleccionarTitDes').removeClass('btn-danger');
	$('#btnSeleccionarTitDes').addClass('btn-info');
	$('#btnSeleccionarTitDes').attr('onClick','seleccionarTodosDesc()');
}

//aplicar_descoactiva
function aplicar_descoactiva(){
    var array_cedula=[];
    $("input[name='cedulas_sel[]']").each(function(indice, elemento) {
        array_cedula.push($(elemento).val());
    });

    var array_emisiones=[];
    $("input[name='list_cod_emisionesco[]']").each(function(indice, elemento) {
        array_emisiones.push($(elemento).val());
    });

    var inputs=$('.contet_titulo_seleccion_des').find('input');
    if(inputs.length==0){
        alertNotificar("Por favor seleccione al menos una título", "error"); return;
    }
    swal({
        title: '',
        text: 'Está seguro de descoactivar los títulos de crédito',
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
            // e.preventDefault();
            vistacargando("m","Espere por Favor");
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        
            $.ajax({
                type: "POST",
                url: '/gestionCoactiva/descoactivarEmision',
                data: { _token: $('meta[name="csrf-token"]').attr('content'),
                idplan:plan_sel,array_cedula:array_cedula,array_emisiones:array_emisiones},
               
                success: function(data){
                  
                    vistacargando("");
                    if(data['error']==true){
                        alertNotificar(data['detalle'], "error");
                        return;
                    }
                    if(data['error']==false){
                        alertNotificar(data['detalle'],'success');                        
                        ventana_cargando=false
                        buscar_plan_coact(plan_sel);
                        $('#modalTitulos').modal('hide');
                    }
                    
                },
                error: function(e){
                    vistacargando("");
                    alertNotificar('Ocurrió un error intente nuevamente', "error");
                    return;
                }
            });

        }
        sweetAlert.close();   
        
    });
}



function detalleEmisionCoact(subtotal,iva,coactiva,descuento,interes,recargo){
    $('#bodyModalDetallesCoact').show();
    $('#bodyModalListaTituloCoact').hide();
    $('#cerrar_modal').hide();
    $('#cerrar_detalle_coat').show();
    
    
    $('#bodydetallesCoact').html(`<tr align="center">
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



function cerrar_detalle_coat(){
    $('#bodyModalDetallesCoact').hide();
    $('#bodyModalListaTituloCoact').show();

    $('#cerrar_detalle_coat').hide();
    $('#cerrar_modal').show();
}

$('#modalTitulos').on('hidden.bs.modal', function (e) {
    cerrar_detalle_coat();
})

function mostrar_instancias(cedula, plan){
    $('#modalInstancias').modal('show');
    $('#tb_listaEventos').html('');
	$("#tablaEventos").DataTable().destroy();
    $('#tablaEventos tbody').empty();
    var num_col = $("#tablaEventos thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tablaEventos tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);  

    $.get("/gestionCoactiva/infoInstancias/"+cedula+"/"+plan, function (data) {
      
     
        if(data.error==true){
          
            alertNotificar(data.mensaje,'error');
            return;                      
        }

        $("#tablaEventos tbody").html('');
        $.each(data['resultado'], function(i, item){
            if(item['evento_destino']['evento']['requiere_documento']=='Si'){
                var requiere_="Si";
                var btn_descargar=`<button type="button" class="btn btn-sm btn-warning marginB0" onClick="descargarInstancia('${item["idinstancias"]}','${item["evento_destino"]['evento']['ruta_reporte']}')">
                <i class="fa fa-download" >
                    
                </i> Descargar
            </button>`;
            }else{
                var requiere_="No";
                var btn_descargar=`<button type="button"  onclick="sms_sindocumento()" disabled class="btn btn-sm btn-warning marginB0"> 
                <i class="fa fa-download" >                    
                </i> Descargar
            </button>`;
            }
            
            $('#tablaEventos').append(`<tr role="row" class="odd">
                               
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['evento_destino']['evento']['descripcion']}
                                </td>
                                <td style=" vertical-align: middle;text-align:center"  class="paddingTR">
                                    ${item['evento_destino']['destino']['descripcion']}
                                </td>
                               
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['observacion']}
                                </td>
                                <td style=" vertical-align: middle;text-align:center "  class="paddingTR">
                                    ${requiere_}
                                </td>

                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['created_at']}
                                </td>
                            
                                <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                    <center>
                                       ${btn_descargar}
                                    </center>
                                </td>
                                
                            </tr>  `);
                       


        });
    
        cargar_estilos_tabla_inst("tablaEventos",10);

        $('#plan_sel').val(plan);
        $('#idcontrib').val(cedula);
        
    
    }).fail(function(error){
        
        vistacargando("");
        alertNotificar("Error al ejecutar la petición","error");
    });
}

function sms_sindocumento(){
    alertNotificar("Este evento no tiene asociado ningún documento","error");
    return;
}
function descargarInstancia2(id, ruta){
    
    window.location.href='/gestionCoactiva/'+ruta+'/'+id;
}

function descargarInstancia(id, ruta){
    vistacargando("m","Espere por Favor");
    $.get('/gestionCoactiva/'+ruta+'/'+id, function(data){
       
        if(data.error==true){
            vistacargando("");
            alertNotificar(data.mensaje,"error");
            return;
        } 
        alertNotificar("El documento se descargará en uno segundos...","success");
        window.location.href='/gestionCoactiva/descargarDocumentoIns/'+data.pdf;
        vistacargando("");
    }).fail(function(){
        vistacargando("");               
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}

//funcion que obtiene los datos del evento al seleccionar una opcion en el combo evento
function obtenerInfoEvento(){
    vistacargando("m","Espere por favor");
    $('#cmb_dirigido').html('');
    $('#codigo_evento').val('');
    var tipo_evento=$('#cmb_evento').val();
    $.get("/gestionCoactiva/obtenerInfoEvento/"+tipo_evento, function(data){

        vistacargando(""); 
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            return;
        } 
        if(data.resultado.codigo_documento==null){
            alertNotificar('El evento seleccionado no tiene registrado un código',"error");
            return;
        } 
        $('#codigo_evento').val(data.resultado.codigo_documento);

        if(data.resultado.evento_registro.length<=0){
            $('.option_dirigido').prop('selected',false); // deseleccionamos 
            $("#cmb_dirigido").trigger("chosen:updated"); // actualizamos
            alertNotificar("El tipo de evento seleccionado, no tiene registrado destinatario(s)","error");
            return;
        }
        
        $('#cmb_dirigido').append(`<option class="option_dirigido"value=""></option>`);
        $('#cmb_dirigido').attr('disabled',false);
        $.each(data.resultado.evento_registro,function(i,item){
            $('#cmb_dirigido').append(`<option value="${item.destino.idregistro_destino}">${item.destino.descripcion}</option>`);
        })
        $("#cmb_dirigido").trigger("chosen:updated"); // actualizamos el combo


    }).fail(function(){
        vistacargando("");               
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}


//funcionn para proceder a realizar un evento de una instancia
function registrar_evento(){
    var tipo_evento=$('#cmb_evento').val();
    var dirigido=$('#cmb_dirigido').val();
    
    if(tipo_evento==null || tipo_evento==""){
        alertNotificar("Debe seleccionar un tipo de evento","error");
        return;
    }

    if(dirigido==null || dirigido==""){
        alertNotificar("Debe seleccionar destinatario","error");
        return;
    }


    swal({
        title: '',
        text: 'Está seguro de registrar el evento',
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
                $("#frm_Eventos").submit();

        }
        sweetAlert.close();   
        
    });
}

//formulario que manda a registrar una instancia o evento
$('#frm_Eventos').submit(function(e){
    e.preventDefault();
    vistacargando("m","Espere por Favor");
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/gestionCoactiva/registrarEventos',
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
               
                limpiar_campos_eventos();
                // cargar_tabla_eventos(+data['identificacion']);                           
                mostrar_instancias(data['identificacion'],data['idplan'])
                
            }
            
    },
    error: function(e){
        vistacargando("");
        alertNotificar('Ocurrió un error intente nuevamente', "error");
        return;
    }
    });
});

function limpiar_campos_eventos(){
    $('#cmb_dirigido').html('');
    $('#codigo_evento').val('');
    $('#fecha').val('');
    $('#observacion').val('');
    $('.option_evento').prop('selected',false); // deseleccionamos 
    $("#cmb_evento").trigger("chosen:updated"); // actualizamos
    $('.option_dirigido').prop('selected',false); // deseleccionamos 
    $("#cmb_dirigido").trigger("chosen:updated"); // actualizamos
}

function cargar_estilos_tabla_inst(idtabla,pageLength){

    $("#"+idtabla).DataTable({
        'paging'      : true,
        'searching'   : true,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : false,
        "destroy":true,
        pageLength: 10,
        order: [[ 4, "desc" ]],
        sInfoFiltered:false,
        language: {
            url: '/json/datatables/spanish.json',
        },
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
