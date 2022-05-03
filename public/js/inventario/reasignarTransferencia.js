
//vairable global para determinar si es desde el boton buscar o es una recarga interna del datatable
globalThis.esRecargaTabla="No";

function consultar_custodio(){
    $('#msjAlertaInconsis').html('');
    $('#alertIdAlertInc').fadeOut();
    var info_empleado=$('#dato_empleado').val();
    if(info_empleado==""|| info_empleado==null){
        alertNotificar("Ingrese un criterio de busqueda","error");
        return;
    }
    var cedula=$('#cedula_empleado').val();
    globalThis.cedulaGlobal=cedula;

    $('#divbtnbuscar').html(`<button id="btnBuscars" disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  

    $('#tb_listaCustodio').html('');
	$("#TablaListaCustodio").DataTable().destroy();
    $('#TablaListaCustodio tbody').empty();
    var num_col = $("#TablaListaCustodio thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaListaCustodio tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);  

    $('#contribuyente_modal').html('');
    $('#cedula_modal').html('');
    $('#codigo_modal').html('');
    $('#departamento_modal').html('');

    $.get("/inventarios/consultarCustodioBienes/"+cedula, function(data){       
        $('#divbtnbuscar').html(` <button type="button" onclick="consultar_custodio()" class="btn btn-primary"><i class="fa fa-search"></i> Buscar</button>`);
       
        if(data.error==true){
            $("#TablaListaCustodio tbody").html('');
            $("#TablaListaCustodio tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.listado_custodio.length==0){
            $('#btns_accion_modal').hide();
            $("#TablaListaCustodio tbody").html('');
            $("#TablaListaCustodio tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            return;                      

        }

        $("#TablaListaCustodio tbody").html('');
        var contador=0;
        $.each(data['listado_custodio'], function(i, item){

            if(item.nroacta!=null){
                var num_acta=item.nroacta;
                var tiene_acta="S";
            }else{
                var num_acta="";
                var tiene_acta="N";
            }
           
            var btn=`
                    <button type="button" class="btn btn-primary" onclick="detalleBienesCustodio('${item.idcust}','${cedula}','${tiene_acta}')">
                        Detalle
                    </button> 
                
            `;

            if(item.estado=="SI"){
               
                var estado=(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`
                        );
            }else{
                
                var estado=(`<span style="min-width: 90px !important;font-size: 12px" class="label label-danger estado_validado"><i class="fa fa-thumbs-down"></i>&nbsp; No Aprobado &nbsp;&nbsp;</span>`
                );  
            }


            $('#TablaListaCustodio').append(`<tr role="row" class="odd" >

                            <td width="5%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${contador=contador+1}
                            </td>  

                            <td  width="15%"style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item.idcust}
                            </td> 
                            
                            <td width="30%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${item.descripcion}
                            </td>  

                            
                            <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${num_acta}
                            </td>  
                        
                            <td  width="15" colspan="1" style="vertical-align: middle; text-align:center"  class="paddingTR">
                                ${estado}
                            </td>

                            <td width="15%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                                ${item.fechaingreso}
                            </td>

                           

                            <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${btn}
                            </td>
                        
                            
                        </tr>  `);
 
                            
        });

        //validamos para ver si es esta viniendo la peticion desde el boton buscar o es una recarga interna
        if(esRecargaTabla=="No"){
            //solo si no es recarga interna mostramos el efecto de ocultar y desocultar
            $('#seccion_datos_cust').show();
            $('#formulario_consultar_cust_').hide();

        }
            
        cargar_estilos_tabla("TablaListaCustodio",10);

        $('#contribuyente_modal').html(data.detalle[0].apellidos+" "+data.detalle[0].nombres);
        $('#cedula_modal').html(cedula);
        $('#codigo_modal').html(data.detalle[0].idemplea);
        $('#departamento_modal').html(data.detalle[0].departamento);
       
        
    }).fail(function(){
        $('#divbtnbuscar').html(` <button type="button" onclick="consultar_custodio()" class="btn btn-primary"><i class="fa fa-search"></i> Buscar</button>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}

function regresar_busqueda(){
    $('#seccion_datos_cust').hide();
    $('#formulario_consultar_cust_').show();
    esRecargaTabla="No";
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

//al presiojnar el btn detalle de los bienes asociados a ese custodiosdel datatable principal
function detalleBienesCustodio(id,cedula,estado_acta){
    limpiar_detalle_act();
    regresar();

    $('#idempleado_txt').val('');
    $('#iddepartamento_txt').val('');
    $('#idtransfe_txt').val('');
    $('#numero_acta_txt').val('');

    $('#num_transferencia_modal').html('');
    $('#num_acta_modal').html('');
    $('#responsable_modal').html('');
    $('#descripcion_modal').html('');

    $('#nombre_dep_modal').val('');
    $('#num_transferencia_seleccionada').val('');

    $('#dato_empleado_new').val('');
    $('#id_empleado_new').val('');
    $('#dato_departamento').val('');
    $('#id_new_depar').val('');
    $('#observaciones').val('');

    $('#departamento').html('');
    $('#departamento').val('').change();
    $('#departamento').attr('disabled',true); 

    $('#nombre_depar_new').val('');
    

    $('#lista_activos').html('');
    $('.contet_activo_selecc').html('');

    $('#seccion_reasignacion').show();
    $('#detalle_secccion').hide();

    vistacargando("m","Espere por favor");
    $.get("/inventarios/consultaBienesCustodio/"+id+"/"+cedula, function(data){       
        vistacargando("");
        
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.lista_bienes.length==0){
            alertNotificar('No se encontró información','error');
            return;                      

        }
        //si tiene acta ponemos en el titulo del btn imprimir acta
        if(estado_acta=="S"){
            $('#titulo_btn_acta').html('Imprimir Acta');
            globalThis.tituloAlerta="¿Está seguro de reasignar la transferencia?";
        }else{
            $('#titulo_btn_acta').html('Generar Acta');
            globalThis.tituloAlerta="¿Está seguro de reasignar la transferencia?";
        }

        //para la propusta 2
        // $('#seccion_datos_cust').hide();
        // $('#opcion2').show();
       
        $('#modalDetalleActivo').modal('show');
        reseterarBtnSeleccionDes();

        carga_tabla_detalle(data);

        combo_departamento();

    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });

}

function carga_tabla_detalle(data){
   

    $('#idempleado_txt').val(data.lista_bienes[0].idemplea);
    $('#iddepartamento_txt').val(data.lista_bienes[0].iddepart);
    $('#idtransfe_txt').val(data.lista_bienes[0].idtransf);
    $('#numero_acta_txt').val(data.lista_bienes[0].nroacta);

    $('#num_transferencia_modal').html(data.lista_bienes[0].idtransf);
    $('#num_transferencia_seleccionada').val(data.lista_bienes[0].idtransf);
    $('#num_acta_modal').html(data.lista_bienes[0].nroacta);
    $('#responsable_modal').html(data.lista_bienes[0].empleado);
    $('#descripcion_modal').html(data.lista_bienes[0].descripcion);

    $('#nombre_dep_modal').val(data.lista_bienes[0].departamento);
    $('#cedula_empl_old').val(cedulaGlobal);

    $('#tb_listaDetalle').html('');
	$("#TablaListaDetalle").DataTable().destroy();
    $('#TablaListaDetalle tbody').empty();

    $("#TablaListaDetalle tbody").html('');
    


    $.each(data.lista_bienes, function(i, item){
      
        var btn=`
                <button type="button" class="btn btn-info" onclick="verDetalleAct('${item.idactivo}')">
                    Ver
                </button> 
            
                `;

        $('#TablaListaDetalle').append(`<tr role="row" class="odd" >

                        <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                            <input data-id="${item['idactivo']}" id="cod_activo${item['idactivo']}" value="${item['idactivo']}" name="cod_emision[]"  style="width:20px;height:20px;;cursor: pointer" type="checkbox" >
                        </td>

                        <td width="8%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                            ${item.idactivo}
                        </td>  
                        
                        <td width="40%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                            ${item.material}
                        </td>  
                    
                        <td  width="45%" colspan="1" style="vertical-align: middle; text-align:center"  class="paddingTR">
                            ${item.observacion}
                        </td>

                        <td width="7%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                            ${btn}
                        </td>
                    
                        
                    </tr>  `);

                    
                    $(`#cod_activo${item['idactivo']}`).click(function(){
                        if($(`#cod_activo${item['idactivo']}`).prop('checked')){
                            $(".contet_activo_selecc").append(`<input id="input_${item['idactivo']}" type="hidden" name="lista_activos_selecc[]" value="${item['idactivo']}">`);
                            estado_cabildo(item.idactivo,'N',item.idtransf);
                        }else{
                            $(`#input_${item['idactivo']}`).remove();
                            estado_cabildo(item.idactivo,'S',item.idtransf);
                        }
                    });

                        
    });

    
    cargar_estilos_tabla("TablaListaDetalle",5);
}

function estado_cabildo(idactivo,estado,idtransf){
   
    vistacargando("m","Actualizando...");
    $.get("/inventarios/actualizarEstadoCabildo/"+idactivo+"/"+estado+"/"+idtransf, function(data){       
        vistacargando("");
        if(data.error==true){

            if(estado=="N"){
                $(`#cod_activo${idactivo}`).prop('checked',false);
                $(`#input_${idactivo}`).remove();
            }else{
                
            }

            alertNotificar(data.mensaje,'error');
            return;                      
        }
        alertNotificar(data.mensaje,'success');
       
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}

function cambiar_estado_todo_cabildo(estado){
    var lista_activos_cambiar=[];
    $("input[name='lista_activos_selecc[]']").each(function(indice, elemento) {
        lista_activos_cambiar.push($(elemento).val());
    });

    var idtransf=$('#num_transferencia_seleccionada').val();
    vistacargando("m","Actualizando...");
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    
    $.ajax({
        type: "POST",
        url: '/inventarios/actualiEstaCabilMulti',
        data: { _token: $('meta[name="csrf-token"]').attr('content'),
        lista_activos:lista_activos_cambiar,idtransf:idtransf,estado:estado},
        success: function(data){
          
            vistacargando("");                
            if(data.error==true){

                if(estado=="N"){
                    if(data.lista_error=="todos"){
                        cargar_estilos_tabla('TablaListaDetalle',-1);
                        var inputs=$('#TablaListaDetalle').find('input');
                        $(".contet_activo_selecc").html('');
                        $.each(inputs,function(i,item){
                            $(`#${item.id}`).prop('checked',false);
                        })
                        reseterarBtnSeleccionDes();
                        cargar_estilos_tabla('TablaListaDetalle',5);
                    }else{
                        $(data.lista_error).each(function(indice, elemento) {
                            $(`#cod_activo${elemento}`).prop('checked',false);
                            $(`#input_${elemento}`).remove();
                        });
                    }
                   
                }
               
    
                alertNotificar(data.mensaje,'error');
                return;                      
            }

            alertNotificar(data.mensaje,'success');       
        
                            
        }, error:function (data) {
            vistacargando("");
            cargar_estilos_tabla('TablaListaDetalle',-1);
            var inputs=$('#TablaListaDetalle').find('input');
            $(".contet_activo_selecc").html('');
            $.each(inputs,function(i,item){
                $(`#${item.id}`).prop('checked',false);
            })
            reseterarBtnSeleccionDes();
            cargar_estilos_tabla('TablaListaDetalle',5);
            alertNotificar('Ocurrió un error, intentelo más tarde','error');
        }
    });

}


function seleccionarTodosDesc(){
    $(".contet_activo_selecc").html('');
    cargar_estilos_tabla('TablaListaDetalle',-1);
	var inputs=$('#TablaListaDetalle').find('input');
	$.each(inputs,function(i,item){
        $(".contet_activo_selecc").append(`<input id="input_${item.attributes[0].value}" type="hidden" name="lista_activos_selecc[]" value="${item.attributes[0].value}">`);
		$(`#${item.id}`).prop('checked',true);
	})
	$('#btnSeleccionarActivos').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
	$('#btnSeleccionarActivos').removeClass('btn-info');
	$('#btnSeleccionarActivos').addClass('btn-danger');
	$('#btnSeleccionarActivos').attr('onClick','deseleccionarTodosDes()');

    cambiar_estado_todo_cabildo('N');
  
}

function deseleccionarTodosDes(){
    cambiar_estado_todo_cabildo('S');
    cargar_estilos_tabla('TablaListaDetalle',-1);
	var inputs=$('#TablaListaDetalle').find('input');
    $(".contet_activo_selecc").html('');
	$.each(inputs,function(i,item){
		$(`#${item.id}`).prop('checked',false);
	})
	reseterarBtnSeleccionDes();
    cargar_estilos_tabla('TablaListaDetalle',5);
   

     

}

function reseterarBtnSeleccionDes(){
	$('#btnSeleccionarActivos').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
	$('#btnSeleccionarActivos').removeClass('btn-danger');
	$('#btnSeleccionarActivos').addClass('btn-info');
	$('#btnSeleccionarActivos').attr('onClick','seleccionarTodosDesc()');
}

function limpiar_detalle_act(){
    
    $('#nombre_cta_').html('');
    $('#num_activo_').html('');
    $('#numero_cta_').html('');
    $('#numero_material_').html('');
    $('#marca_').html('');
    $('#modelo_').html('');
    $('#fcompra_').html('');
    $('#vcompra_').html('');
    $('#tipo_').html('');
    $('#depreceacion_').html('');
    $('#frevalorizacion_').html('');
    $('#vrevalorizacion_').html('');
    $('#uso_').html('');
    $('#estado_').html('');
    $('#idactivo_imp').val('');

   
   
}

function cancelar(){
    limpiar_detalle_act();
    $('#modalDetalleActivo').modal('hide');
    $('#msjAlertaInconsis').html('');
    $('#alertIdAlertInc').fadeOut();
}

//obtenemos los detalles del activo enviado
function verDetalleAct(id){
    limpiar_detalle_act();
    $('#msjAlertaInconsis').html('');
    $('#alertIdAlertInc').fadeOut();
    vistacargando("m","Espere por favor");
    $.get("/inventarios/informacionActivo/"+id, function(data){       
        vistacargando("");
       
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            alertNotificar('Información inconsistente, por favor revisar el registro del activo con código '+id,'error');
            return;                      

        }

        if(data.resultado[0].estado_bien!=null){
            if(data.resultado[0].estado_bien=='BU'){
                var estadores="Bueno";
            }else if(data.resultado[0].estado_bien=="MA"){
                var estadores="Malo";
            }else if(data.resultado[0].estado_bien=="RE"){
                var estadores="Regular";
            }else{
                var estadores="Excelente";
            }
        }else{
            var estadores="";
        }
           
        if(data.resultado[0].uso_bien!=null){
            if(data.resultado[0].uso_bien=='LI'){
                var usoresp="Libre";
            }else if(data.resultado[0].uso_bien=="OC"){
                var usoresp="Ocupado";
            }else{
                var usoresp="Baja";
            }
        }else{
            var usoresp="";
        }

        if(data.resultado[0].bien_sujeto_control!=null){
            if(data.resultado[0].bien_sujeto_control=='S'){
                var bensujresp="Si";
            
            }else{
                var bensujresp="No";
            }
        }else{
            var bensujresp="";
        }


        $('#nombre_cta_').html(data.resultado[0].material);
        $('#num_activo_').html(data.resultado[0].idactivo);
        $('#numero_cta_').html(data.resultado[0].idtipo);
        $('#numero_material_').html(data.resultado[0].idmaterial);
        $('#marca_').html(data.resultado[0].marca);
        $('#modelo_').html(data.resultado[0].modelo);
        $('#fcompra_').html(data.resultado[0].feccompra);
        $('#vcompra_').html(data.resultado[0].valorcompra);
        $('#tipo_').html(bensujresp);
        $('#depreceacion_').html(data.resultado[0].depreacum);
        $('#frevalorizacion_').html(data.resultado[0].fecharevalor);
        $('#vrevalorizacion_').html(data.resultado[0].revalor);
        $('#uso_').html(usoresp);
        $('#estado_').html(estadores);

        $('#idactivo_imp').val(data.resultado[0].idactivo);
        
        $('#seccion_reasignacion').hide();
        $('#detalle_secccion').show();

        $('#btn_prim').hide();
        $('#btn_atras').show();

    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}

function regresar(){
    $('#seccion_reasignacion').show();
    $('#detalle_secccion').hide();

    $('#btn_prim').show();
    $('#btn_atras').hide();
}


function generar_transferencia(){
    $('#msjAlertaInconsis').html('');
    $('#alertIdAlertInc').fadeOut();

    var nuevo_empleado=$('#id_empleado_new').val();
    var nuevo_departamento=$('#departamento').val();
    var observaciones=$('#observaciones').val();

    if(nuevo_empleado==null || nuevo_empleado==""){
        alertNotificar("Ingrese el nuevo empleado","error");
        $('#dato_empleado_new').focus();
        $('#dato_empleado_new').val('');
        return;
    }

    if(nuevo_departamento==null || nuevo_departamento==""){
        alertNotificar("Ingrese el nuevo departamento","error");
        $('#dato_departamento').focus();
        $('#dato_departamento').val('');
        return;
    }

    if(observaciones==null || observaciones==""){
        alertNotificar("Ingrese una observacion","error");
        $('#observaciones').focus();
        return;
    }

    var inputs=$('.contet_activo_selecc').find('input');
    if(inputs.length==0){
        alertNotificar("Por favor seleccione al menos una activo", "error"); return;
    }


    swal({
        title: '',
        text: tituloAlerta,
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
            $("#frm_reasignacion").submit();

        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
      
    });

}

$("#frm_reasignacion").on("submit", function(e){

	e.preventDefault();
    vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   	
	var data=$("#frm_reasignacion").serialize();
	$.ajax({
		url:'/inventarios/procesarReasignacion', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
           
            if(requestData.error==true){
                if(requestData.inconsis!=null){
                    $('#msjAlertaInconsis').html(`<div class="text-center alert alert-danger col-md-12" role="alert" id="alertIdAlertInc"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> No se pudo generar el documento, existen inconsistencias en el/los siguiente(s) activo(s) con código ${requestData.inconsis} .</div>`);
                    return;
                }
                  
                alertNotificar(requestData.mensaje,"error");
                return;
            }

            esRecargaTabla="Si";
            consultar_custodio();
            alertNotificar(requestData.mensaje,"success");
            $('#modalDetalleActivo').modal('hide');

		}, error:function (requestData) {
			vistacargando("");
			
			alertNotificar(requestData.mensaje,"error");
			
		}
	});

})

function imprimir(id){
    vistacargando("m","Espere por favor");
    $.get("/inventarios/crearEntrega/"+id, function(data){       
        vistacargando("");
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        alertNotificar("El documento se descargará en unos segundos...","success");
        window.location.href='/inventarios/descargarActa/'+data.pdf;
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });

  
}


$("#dato_empleado").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#msjAlerta').html('<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los datos del empleado.</div>');
    $('.conten_busqueda').hide();
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
        $('#alertIdAlert').fadeOut();
        return;
    }else{
        buscar_empleado();
        $('#msjAlerta').html('');
        $('#alertIdAlert').fadeOut();
    }
};

function limpiar_empleado(input){

    //verificamos si ya fue previamente buscado un material
    var idempl=$('#cedula_empleado').val();
    if(idempl!=""){
        $('#cedula_empleado').val('');
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
    $('#cedula_empleado').val(cedula);
   
    
}



///nuevo empleado

$("#dato_empleado_new").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#msjAlertaNuevo').html('<div class="text-center alert alert-success col-md-12" role="alert" id="alertIdAlertNuevo"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los datos del empleado.</div>');
    $('.conten_busqueda').hide();
    if(e.which == 13) { // codigo del enter
        e.preventDefault();
        buscarInfoNewEmpl();
    }  
});
// al darle click a continuar
function buscarInfoNewEmpl(){
    var buscar = $("#dato_empleado_new").val();
    if(buscar==""){
        alertNotificar("Ingrese los datos del empleado","error");
        $("#dato_empleado_new").focus();
        $('#msjAlertaNuevo').html('');
        $('#alertIdAlertNuevo').fadeOut();
        return;
    }else{
        buscar_nuevo_empleado();
        $('#msjAlertaNuevo').html('');
        $('#alertIdAlertNuevo').fadeOut();
    }
};

function limpiar_empleado_new(input){

    //verificamos si ya fue previamente buscado u
    var idempl=$('#id_empleado_new').val();
    if(idempl!=""){
        $('#id_empleado_new').val('');
        $('#dato_empleado_new').val('');

        $('#departamento').html('');
        $('#departamento').val('').change();
        $('#departamento').attr('disabled',true); 
    }
       
}


function buscar_nuevo_empleado(){
    // validamos para ocultar el contenido de busqueda cuando
    var busqueda = $('#dato_empleado_new').val();
    var conten_busqueda = $('#dato_empleado_new').siblings('.conten_busqueda');
    var div_content = $(conten_busqueda).children('.div_content');
    $(conten_busqueda).hide();
       
       
    $('#NewEmpleadoLista').empty(); // limpiamos la tabla
    vistacargando("m","Buscando información...");
    $.get('/inventarios/buscarEmpleados/'+busqueda, function (data){
       ;
        vistacargando("");
       
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            return;
        }
        if(data.resultado.length==0){
            alertNotificar("No se encontró el empleado","info");
            return;
        }
        
        $('#NewEmpleadoLista').empty();
        $.each(data.resultado, function(i, item){
           
            $(conten_busqueda).show();
            $('#NewEmpleadoLista').append(
            
            `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
            border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarNuevoEmpleado('${item.idemplea}','${item.cedula}','${item.nombres}','${item.iddepart}')">` +
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

function capturarNuevoEmpleado(idemplea,cedula,nombres,iddepart){
    //validamos que el nuevo empleado sea diferente al actual
    var empleado_actual=$('#idempleado_txt').val();
    if(empleado_actual==idemplea){
        alertNotificar("El nuevo empleado debe ser diferente al actual","error");
        $('.conten_busqueda').hide();
        $('#dato_empleado_new').val('');
        $('#id_empleado_new').val('');
        return;
    }
    $('.conten_busqueda').hide();
    $('#dato_empleado_new').val(cedula+ " - " +nombres);
    $('#id_empleado_new').val(idemplea);
    obtener_departamento_empleado(iddepart);
    
}



function obtener_departamento_empleado(iddep){
    $.get("/inventarios/consultaDepartEmpleado/"+iddep, function(data){       
        
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }
       

        $('#departamento').html('');
            
        $('#departamento').append(`<option value="${data.resultado[0].iddepart}">${data.resultado[0].descripcion}</option>`).change();
        $("#departamento").trigger("chosen:updated"); 
        $('#departamento').attr('disabled',false); 
        
       

    }).fail(function(){
       
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}


$("#dato_departamento").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#msjAlertaNuevo').html('<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los datos del departamento.</div>');
    $('.conten_busqueda').hide();
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
        $('#msjAlertaNuevo').html('');
        $('#alertIdAlert').fadeOut()
        return;
    }else{
        dato_departamento();
        $('#msjAlertaNuevo').html('');
        $('#alertIdAlert').fadeOut()
    }
};

function limpiar_departamento(input){

    //verificamos si ya fue previamente buscado un material
    var iddep=$('#id_new_depar').val();
    if(iddep!=""){
        $('#id_new_depar').val('');
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
    $('#id_new_depar').val(iddepartamento);
   
    
}

function combo_departamento(){
    
    var url_bus_departamento="/inventarios/buscarDepartamento";
    $('#departamento').select2({
        placeholder: 'Escriba El Valor A Consultar',
        minimumInputLength: 3,
        ajax: {
            url: url_bus_departamento,
            dataType: 'json',
            delay: 250,
            processResults: function (data) {

                $('#guarda_custodio').prop('disabled',false);
               
                return {
                    results:  $.map(data, function (item) {
                    
                        return {
                            text: item.descripcion,    
                            id: item.iddepart
                            
                        }
                    })
                };
        },
        cache: true
        }
    });

  
}