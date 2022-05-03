function cargar_lista_plan(){
    var num_col = $("#TablaListaPlan thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaListaPlan tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);
   
    $.get("/gestionCoactiva/cargarDatosPlanes", function(data){
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
                                        
                                            <a onclick="buscar_plan_instancia('${data.idcoact_plan_encrypt}')" class="btn btn-primary btn-xs"> <i class="fa fa-eye"></i> Ver </a>
                                           
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
}


function buscar_plan_instancia(plan){
    
    if(plan=="" || plan==null){
        alertNotificar("Plan no encontrado","error");
        
        return;
    }
      
    $('#tb_listaContBody').html('');
    $("#TablaContr").DataTable().destroy();
    $('#TablaContr tbody').empty();
    var num_col = $("#TablaContr thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 

    vistacargando("m","Espere por favor");
    $.get("/gestionCoactiva/infoInstanciaContribuyente/"+plan, function (data) {
        vistacargando("");
        $('#tb_listaCoactivaBody').html('');
        if(data.error==true){
            $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
            alertNotificar(data.mensaje,'error');
            return;                      
        }

        if(data.resultado.length==0){
            $("#TablaContr tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>No existen registros</b></center></td></tr>`); 
            alertNotificar("Los títulos asociados a estes plan se encuentran descoactivados",'error');
            return;   
        }
        console.log(data)
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
                            <td style="min-width:35%"class="paddingTR">
                                <center>

                                    <button type="button" class="btn btn-sm btn-success" onClick="tiulos_info('${item['cedula']}','${item['idplan']}')"><i class="fa fa-file"></i>
                                    Título       
                                    </button>
                                    
                                    <button type="button" class="btn btn-sm btn-primary" onClick="mostrar_instancias('${item['cedula']}','${item['idplan']}','${item['nombres']}')"><i class="fa fa-edit"></i>
                                        Instancia       
                                    </button>
                                    
                                </center>
                            </td>
                            
                        </tr>  `);
                        
    
            
        });
        
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
    
    $('#cerrar_detalle').hide();
    $('#cerrar_modal').show();
    $('#modalTitulos').modal('show');
    
    $('#tb_listadoTit').html('');
    $("#TablaListaTitulo").DataTable().destroy();
    $('#TablaListaTitulo tbody').empty();
    var num_col = $("#TablaListaTitulo thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 


    $.get("/gestionCoactiva/titulosCreditosInstancia/"+cedula+"/"+plan, function (data) {
        $('#tb_listadoTit').html('');
        $('#tb_listadoTitCoact').html('');
        
        if(data.error==true){
            $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 

            alertNotificar(data.mensaje,'error');
            return;                      
        }    

        if(data.detalle.length==0){
            $("#TablaListaTitulo tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>No se encontrarón títulos coactivados y/o generados</b></center></td></tr>`); 
            alertNotificar("Todos los títulos relacionados a este plan para este contribuyente han sido descoactivados","info");
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
    $('#TablaListaTitulo tbody').html('');
    
    $('#contribuyente_modal').html(data.detalle[0].nombre);
    $('#cedula_modal').html(cedula);    
    var total_titulo=0;
    var cont=0;
    
   
    $.each(data['detalle'], function(i, item){
       
        cont=cont+1;
        total_titulo=total_titulo+1;
       

        var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva']))-parseFloat(item['descuento']);
    
        $('#TablaListaTitulo').append(`<tr role="row" class="odd">
                    <td style="text-align:center;width:5%">
                        ${cont}
                    </td>

                    <td style="text-align:center;width:5%">
                    ${item['estado']}
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

    var nfilas=$("#tb_listadoTit tr").length;
    if(nfilas==0){
        $('#btn_titulos').hide();
    }else{
        $('#btn_titulos').show();
    }

    $('#detalle_cont').show(); 
    
    
    cargar_estilos_tabla_tit("TablaListaTitulo",10);
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

$('#modalInstancias').on('hidden.bs.modal', function (e) {
    $('#plan_sel').val('');
    $('#idcontrib').val('');
    $('#ident_instancia').val('');
    $('#contrib_instancia').val('');
})

function eliminar_instancias(id){
    swal({
        title: '',
        text: 'Está seguro de eliminar el evento',
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
            var nombre=$('#contrib_instancia').val();
            var plan=$('#plan_sel').val();
            vistacargando("m","Espere por favor");
            $.get("/gestionCoactiva/eliminarInstancias/"+id, function (data) {
                vistacargando("");
                if(data.error==true){
                    alertNotificar(data.mensaje,'error');
                    return;                      
                }

                limpiar_campos_eventos();                         
                mostrar_instancias(data['identificacion'],plan,nombre)
            
            }).fail(function(error){
                vistacargando("");            
                alertNotificar("Error al ejecutar la petición","error");
            });

        }
        sweetAlert.close();   
            
    });

    
}


function mostrar_instancias(cedula, plan,nombre){
    $('#plan_sel').val(plan);
    $('#idcontrib').val(cedula);
    $('#ident_instancia').val(cedula);
    $('#contrib_instancia').val(nombre);
    limpiar_campos_eventos();

    $('#modalInstancias').modal('show');
    $('#tb_listaEventos').html('');
	$("#tablaEventos").DataTable().destroy();
    $('#tablaEventos tbody').empty();
    var num_col = $("#tablaEventos thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tablaEventos tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);  

    $.get("/gestionCoactiva/infoInstancias/"+cedula+"/"+plan, function (data) {
      
        if(data.error==true){
            $("#tablaEventos tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
            alertNotificar(data.mensaje,'error');
            return;                      
        }

        $("#tablaEventos tbody").html('');
        $.each(data['resultado'], function(i, item){
            if(item['evento_destino']['evento']['requiere_documento']=='Si'){
                var requiere_="Si";
                var btn_descargar=`<button type="button" class="btn btn-sm btn-warning marginB0" onClick="descargarInstancia('${item["idinstancias"]}','${item["evento_destino"]['evento']['ruta_reporte']}')">
               
                    
                 Descargar
            </button>`;
            }else{
                var requiere_="No";
                var btn_descargar=`<button type="button"  onclick="sms_sindocumento()" disabled class="btn btn-sm btn-warning marginB0"> 
                                  
                 Descargar
            </button>`;
            }

            if(item.documento!=null){
                var cod_sec=item.documento.secuencia
            }else{
                var cod_sec="";
            }
           

            $('#tablaEventos').append(`<tr role="row" class="odd">
                                <td style=" vertical-align: middle; text-align:center; width:5%"  class="paddingTR">
                                    ${item['idinstancias']}
                                </td>
                               
                                <td style=" vertical-align: middle; text-align:center; width:15%"  class="paddingTR">
                                    ${item['evento_destino']['evento']['descripcion']} ${cod_sec}
                                </td>
                                <td style=" vertical-align: middle;text-align:center;width:15%"  class="paddingTR">
                                    ${item['evento_destino']['destino']['descripcion']}
                                </td>
                               
                                <td style=" vertical-align: middle; text-align:center;width:15%"  class="paddingTR">
                                    ${item['observacion']}
                                </td>
                                <td style=" vertical-align: middle;text-align:center:width:10% "  class="paddingTR">
                                    ${requiere_}
                                </td>
                               
                                <td style=" vertical-align: middle; text-align:center;width:20%"  class="paddingTR">
                                    ${item['created_at']}
                                </td>
                            
                                <td style="text-align: center; vertical-align: middle; width:20%"  class="paddingTR">
                                    <center>
                                       ${btn_descargar}

                                       <button type="button" class="btn btn-sm btn-danger marginB0" onClick="eliminar_instancias('${item["idinstancias"]}')">
                                        
                                              
                                        Anular
                                        </button>       
                                    </center>
                                </td>
                                
                            </tr>  `);
                       


        });
    
        cargar_estilos_tabla_inst("tablaEventos",10);

       
        
    
    }).fail(function(error){
        $("#tablaEventos tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
      
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

    var identificacion=$('#idcontrib').val();
    var plan=$('#plan_sel').val();
    var nombre=$('#contrib_instancia').val();

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
                // mostrar_instancias(data['identificacion'],data['idplan'],data['contribuyente'])
                mostrar_instancias(identificacion,plan,nombre)
                
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
        order: [[ 5, "desc" ]],
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
