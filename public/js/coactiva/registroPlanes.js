function cargar_lista_plan(){
    var num_col = $("#TablaListaPlan thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);
   
    $.get("/gestionCoactiva/cargarDatosPlanLista", function(data){
        console.log(data)
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            $("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>No se encontraron datos</center></td></tr>`);
            return;   
        }
        if(data.error==false){
            
            if(data.resultado.length <= 0){
                $("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>No se encontraron datos</center></td></tr>`);
               
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
                    { "width": "20%", "targets": 1, "className":"text-center", },
                    { "width": "10%", "targets": 2, "className":"text-center"},
                    { "width": "30%", "targets": 3, },
                    { "width": "10%", "targets": 4,"className":"text-center" },
                    { "width": "15%", "targets": 5, "className":"text-center"},
                    
                   
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
                    var cont=0
                    $.each(data.plan_contribuyente_instancia, function(i, item){ 
                        $.each(item.instancias, function(i2, item2){   
                            if(item2.estado==1){
                                cont=cont+1;
                            }           
                           
                        })
                    })
                    if(data.convenio_pago.length>0){
                        cont=cont+1;
                    }
                    
                    if(data.estado=='Generado' && cont==0){
                        var bnt_elim=`<a onclick="eliminar_plan('${data.idcoact_plan_encrypt}')" class="btn btn-danger btn-sm"> Eliminar </a>`;
                        var btn_edi=`<a onclick="editar_plan('${data.idcoact_plan_encrypt}')" class="btn btn-primary btn-sm"> Editar </a>`;

                    }else{
                        var bnt_elim=`<a disabled class="btn btn-danger btn-sm"> Eliminar </a>`
                        var btn_edi=`<a disabled class="btn btn-primary btn-sm"> Editar </a>`;
                    }
                    var set=[''];
                    var hr='';
                    $.each(data.plan_contribuyente_instancia,function(i,item){            
                        if(i>=0){hr=`<p style="padding-bottom:1px">`;}                       
                        var cont=`<b>CIU:</b> ${item.ciu}<br> <b>Identificación:</b> ${item.identificacion}<br><b>Razón Social: </b> ${item['nombres']} `;
                        set[i]= ` ${hr} ${cont}`;
                    });

                    $('td', row).eq(3).html(set);

                    $('td', row).eq(5).html(`
                                        <form method="DELETE" class="frm_eliminar" action="/gestionCoactiva/coactivar/delete/${data.idcoact_plan_encrypt}"  enctype="multipart/form-data">

                                            ${btn_edi}
                                            ${bnt_elim}
                                           
                                        </form>
                                    
                    `); 
                }             
            });
        }
    }).fail(function(){
        $("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>No se encontraron datos</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });

}

function eliminar_plan(id){
    swal({
        title: '',
        text: 'Está seguro de eliminar el plan',
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
            vistacargando("m","Espere por favor");
            $.get("/gestionCoactiva/eliminarPlan/"+id, function(data){
                vistacargando("");
                if(data.error==true){
                    alertNotificar(data.mensaje,"error");
                    return;   
                }
                if(data.error==false){
                    alertNotificar(data.mensaje,"success");
                    cargar_lista_plan();
                }
            

            }).fail(function(){
                vistacargando("");
                alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
            });
        }
        sweetAlert.close();   
            
    });
}


function editar_plan(id){
    vistacargando("m","Espere por favor");
    $.get("/gestionCoactiva/obtenerPlan/"+id, function(data){
        vistacargando("");
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            return;   
        }
        if(data.error==false){
            $('#btn_guarda_edita').html('Actualizar');
            $('#method_buscar').val('PUT');
            $('#lista_planes').hide();
            $('#cmb_impuesto').prop('disabled',true);
            $('.optionImp').prop('selected',false); 
            $.each(data['impuesto'], function(i, item){                
                $(`#cmb_impuesto option[value="${item['codigo_imp']}"]`).prop('selected',true);  
                $("#cmb_impuesto").trigger("chosen:updated");                
            })

         
            $('#fecha_hasta').val(data.resultado[0].plan_contribuyente[0].fecha_formateada);
            $('#idplanedi').val(data.resultado[0].plan_contribuyente[0].idcoact_plan);
            $('#fecha_hasta').prop('disabled',true);
            $('#txt_plan').val(data.resultado[0].descripcion);

            $("#tb_listaContBody").html('');

            var input_emi=[''];
            $('#seccion_cont').show();            
            $.each(data['resultado'][0].plan_contribuyente, function(i, item){

                $.each(data['emisiones'], function(i2, item2){
                    if(item2.cedula==item.identificacion){
                        input_emisiones=`<input type="hidden" class="emis" name="emisiones_${item['identificacion']}[]" value="${item2.codigo_emi}">`;
                        input_emi[i2]= `${input_emisiones}`;
                    }
                    
                })
                var nueva_fila=item.identificacion;
                var nfilas=$("#tb_listaContBody tr").length;
                if(nfilas>0){
                    var dato=$("#cont_"+item.identificacion).find("input").val();
                    if(nueva_fila==dato){
                        alertNotificar("El contribuyente ya está agregado a la lista","error");
                        return;
                    }
                }
                

                $('#TablaContr').append(`<tr role="row" class="odd" id="cont_${item['identificacion']}">
                                    
                                    <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                        ${item['identificacion']}
                                        <input type="hidden" name="contrib[]" value="${item['identificacion']}">
    
                                    </td>
                                    <td style=" vertical-align: middle; text-align:center"  class="paddingTR ">
                                        <div style="display:none">${input_emi}</div>
                                    
                                        ${item['nombres']}

                                </td>
                                    <td style=" vertical-align: middle;text-align:center"  class="paddingTR">
                                        ${item['ciu']}
                                    </td>
                                    
                                    
                                    <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                        <center>
                                            
                                            <button type="button" class="btn btn-sm btn-primary marginB0" onClick="ver_titulos('${item['identificacion']}')">
                                                <i class="fa fa-file" >
                                                    
                                                </i> Títulos
                                            </button>
                                            <button type="button" class="btn btn-sm btn-danger marginB0" onClick="eliminar_cont(${item['identificacion']})">
                                                <i class="fa fa-trash" >
                                                    
                                                </i> Eliminar
                                            </button>

                                        </center>
                                    </td>
                                    
                                </tr>  `);
                            
    
    
            });
            $('#identificacion_').val('').change();
            
        }
       

    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });

}

function cargar_buscador(){
    
    var url_bus="/gestionCoactiva/buscarContribuyente";
    $('#identificacion_').select2({
        placeholder: 'Escriba El Valor A Consultar',
        minimumInputLength: 3,
        ajax: {
            url: url_bus,
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
              

                return {
                results:  $.map(data, function (item) {
                        
                        return {
                            text: item.cedula_ruc+" - "+item.nombres,
                            id: item.cedula_ruc
                        }
                    })
                };
        },
        cache: true
        }
    });
}


function cancelar_registro(){
    limpiar_campos_reg();
    $('#cancelar_secc').hide();
    // $('#method_buscar').val('PUT');
} 
function fecha_cambia(e){
    $('#seccion_cont').hide();
    $("#tb_listaContBody tr").html('');
    $("#tb_listaContBody").html('');
   
}

//evento onchange del contribuyente
function obtener_info_cont(){
    var idcont=$('#identificacion_').val();
    console.log(idcont);
    if(idcont!=null){
        // $('#lista_planes').hide();
        var fecha_hasta=$('#fecha_hasta').val();
        var imp= $("select[name='cmb_impuesto[]']").val();
        if(imp==null){
            alertNotificar("Seleccione al menos un tipo de impuesto","error");
            $('#identificacion_').val('').change();
            return;
        }

        if(fecha_hasta==null || fecha_hasta==""){
            alertNotificar("Seleccione una fecha","error");
            $('#identificacion_').val('').change();
            return;
        }
       
        vistacargando("m","Espere por favor");           

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        $.ajax({
            type: "POST",
            url: '/gestionCoactiva/datoBuscarEmisiones',
            data: { _token: $('meta[name="csrf-token"]').attr('content'),
            cedula:idcont,fecha_hasta:fecha_hasta,imp:imp},
            success: function(data){
                vistacargando("");                
                if(data.error==true){
                    $('#cancelar_secc').show();
                    var nFilas = $("#tb_listaContBody tr").length;
                    if(nFilas==0){
                        $('#cancelar_secc').show();
                    }else{
                        $('#cancelar_secc').hide();
                    }
                    $('#identificacion_').val('').change();
                    alertNotificar(data.mensaje,'error');
                    return;                      
                }
              
                if(data.resultado.length==0){
                    $('#identificacion_').val('').change();
                    alertNotificar("No se pudo acceder a la información","error");
                    return;                      
        
                }
                $('#cancelar_secc').hide();
                $('#lista_planes').hide();
                // alertNotificar("Contribuyente agregado exitosamnete","success");
                var input_emi=[''];
                $('#seccion_cont').show();            
                $.each(data['resultado'], function(i, item){

                    $.each(data['emisiones'], function(i2, item2){
                        if(item2.permitir=='si'){
                            input_emisiones=`<input type="hidden" class="emis" name="emisiones_${item['cedula_ruc']}[]" value="${item2.codigo}">`;
                            input_emi[i2]= `${input_emisiones}`;
                        }
                        
                    })
                    var nueva_fila=item.cedula_ruc;
                    var nfilas=$("#tb_listaContBody tr").length;
                    if(nfilas>0){
                        var dato=$("#cont_"+item.cedula_ruc).find("input").val();
                        if(nueva_fila==dato){
                            alertNotificar("El contribuyente ya está agregado a la lista","error");
                            return;
                        }
                    }
                    
    
                    $('#TablaContr').append(`<tr role="row" class="odd" id="cont_${item['cedula_ruc']}">
                                        
                                        <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                            ${item['cedula_ruc']}
                                            <input type="hidden" name="contrib[]" value="${item['cedula_ruc']}">
        
                                        </td>
                                        <td style=" vertical-align: middle; text-align:center"  class="paddingTR ">
                                            <div style="display:none">${input_emi}</div>
                                        
                                            ${item['nombres']}
    
                                    </td>
                                        <td style=" vertical-align: middle;text-align:center"  class="paddingTR">
                                            ${item['ciu']}
                                        </td>
                                        
                                        
                                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                            <center>
                                                
                                                <button type="button" class="btn btn-sm btn-primary marginB0" onClick="ver_titulos('${item['cedula_ruc']}')">
                                                    <i class="fa fa-file" >
                                                        
                                                    </i> Títulos
                                                </button>
                                                <button type="button" class="btn btn-sm btn-danger marginB0" onClick="eliminar_cont(${item['cedula_ruc']})">
                                                    <i class="fa fa-trash" >
                                                        
                                                    </i> Eliminar
                                                </button>

                                            </center>
                                        </td>
                                        
                                    </tr>  `);
                                
        
        
                });
                $('#identificacion_').val('').change();
                 
            }, error:function (data) {
                $('#identificacion_').val('').change();
                vistacargando("");
                alertNotificar('Ocurrió un error','error');
            }
        });
        
        
    }
}


function ver_titulos(id){
   
    var emisiones_selec_id= $('#cont_'+id).find(".emis");
  
    var array_impuestos=[];
    $(emisiones_selec_id).each(function(indice, elemento) {
        array_impuestos.push($(elemento).val());
    });

    $('#contribuyente_modal').html('');
    $('#cedula_modal').html('');
    $('#detalle_cont').hide();

    $('#cerrar_detalle').hide();
    $('#cerrar_modal').show();
    $('#modalTitulos').modal('show');
    
    $('#tb_listadoTit').html('');
    $("#TablaListaTitulo").DataTable().destroy();
    $('#TablaListaTitulo tbody').empty();
    var num_col = $("#TablaListaTitulo thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);            

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        $.ajax({
            type: "POST",
            url: '/gestionCoactiva/mostrarEmisiones',
            data: { _token: $('meta[name="csrf-token"]').attr('content'),
            codigo:array_impuestos,cedula:id},
            success: function(data){
                $('#tb_listadoTit').html('');
                $('#tb_listadoTitCoact').html('');

                vistacargando("");                
                if(data.error==true){
                    $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
                    alertNotificar(data.detalle,'error');
                    return;                      
                }
                
                if(data.resultado.length==0){
                    $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
                    alertNotificar("No se pudo acceder a la información","error");
                    return;                      
        
                }
                cargar_titulos(data,id);
                
            }, error:function (data) {
                $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
                vistacargando("");
                alertNotificar('Ocurrió un error','error');
            }
        });


}

function cargar_titulos(data,id){

    var total_titulo=0;    
    var cont=0;

    $('#contribuyente_modal').html(data.resultado[0].nombre);
    $('#cedula_modal').html(id);
    

    $('#TablaListaTitulo tbody').html('');
    $.each(data['resultado'], function(i, item){
       
        cont=cont+1;
        total_titulo=total_titulo+1;
        
        var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva']))-parseFloat(item['descuento']);
    
        $('#TablaListaTitulo').append(`<tr role="row" class="odd">
                    <td style="text-align:center;width:5%">
                        ${cont}
                    </td>

                    <td style="text-align:center;width:15%">
                        ${item['emi01codi']}
                    </td>

                    <td style="text-align:center;width:30%">
                        ${item['impuesto']}
                    </td>

                    <td style="text-align:center;width:15%">
                        ${item['anio']} - ${item['mes']}
                    </td>

                    <td style="text-align:center;width:15%">
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

        
    });
    $('#detalle_cont').show();    
    
    cargar_estilos_tabla_tit("TablaListaTitulo",10);
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

function eliminar_cont(id){
    $('#cont_'+id).remove();
    comprobar(); 

   
}
function comprobar(){
    var nFilas = $("#tb_listaContBody tr").length;
    if(nFilas==0){
        $('#seccion_cont').hide();
        $('#lista_planes').show();
    }else{
        $('#seccion_cont').show();
        $('#lista_planes').hide();
    }
}

function registro_plan(){
    var plan=$('#txt_plan').val();
    var fecha_hasta=$('#fecha_hasta').val();
    var imp= $("select[name='cmb_impuesto[]']").val();
    
    if(plan==null || plan==""){
        alertNotificar("Ingrese un nombre de plan","error");
        $('#txt_plan').focus();
        return;
    }

    if(imp==null){
        alertNotificar("Seleccione al menos un tipo de impuesto","error");
        $('#identificacion_').val('').change();
        return;
    }

    if(fecha_hasta==null || fecha_hasta==""){
        alertNotificar("Ingrese una fecha","error");
        $('#identificacion_').val('').change();
        $('#fecha_hasta').focus();
        return;
    }

    var nFilas = $("#tb_listaContBody tr").length;
    if(nFilas==0){
        alertNotificar("Ingrese al menos un contribuyente","error");
        return;
    }

    if($('#method_buscar').val()=='POST'){
        var txt="Está seguro de registrar este plan";
    }else{
        var txt="Está seguro de actualizar este plan";
    }

    swal({
        title: '',
        text: txt,
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-sm btn-info",
        cancelButtonClass: "btn-sm btn-danger",
        confirmButtonText: "Si, Continuar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que si
                $("#frm_registrar_plan").submit();

        }
        sweetAlert.close();   
        
    });
}


$('#frm_registrar_plan').submit(function(e){
    e.preventDefault();
    //registramos
    if($('#method_buscar').val()=='POST'){
        vistacargando("m","Espere por Favor");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        $.ajax({
            type: "POST",
            url: '/gestionCoactiva/guardarPlan',
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
                    cargar_lista_plan();
                    limpiar_campos_reg();
                    alertNotificar(data['detalle'],'success');
                   
                }
        },
        error: function(e){
            vistacargando("");
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            return;
        }
        });

    }else{//actualizamos
        var idplan=$('#idplanedi').val();
        vistacargando("m","Espere por Favor");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        var data=$("#frm_registrar_plan").serialize();
        $.ajax({
            url: '/gestionCoactiva/actualizarPlan/'+idplan,
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(data){
                vistacargando("");
               
                if(data['error']==true){
                    alertNotificar(data['detalle'], "error");
                    return;
                }
                if(data['error']==false){
                    cargar_lista_plan();
                    limpiar_campos_reg();
                    alertNotificar(data['detalle'],'success');
                   
                }
        },
        error: function(e){
            vistacargando("");
            alertNotificar('Ocurrió un error intente nuevamente', "error");
            return;
        }
        });
    }
   
});


function limpiar_campos_reg(){
    $('#cmb_impuesto').prop('disabled',false);
    $('#btn_guarda_edita').html('Guardar');
    $('#identificacion_').val('').change();
    $('#fecha_hasta').val('');
    $('#idplanedi').val('');
    $('#txt_plan').val('');
    $('.optionImp').prop('selected',false); 
    $("#cmb_impuesto").trigger("chosen:updated"); 
    $('#seccion_cont').hide();
    $("#tb_listaContBody tr").html('');
    $("#tb_listaContBody").html('');
    $('#lista_planes').show();
    $('html,body').animate({scrollTop:$('#panelBusqueda').offset().top},400);
    $('#method_buscar').val('POST');
    
    $('#fecha_hasta').prop('disabled',false);
    
}

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