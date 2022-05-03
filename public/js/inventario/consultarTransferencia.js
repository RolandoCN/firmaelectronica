
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
    $('#idtransferencia').val('');
    $('#numero_acta_txt').val('');
    $('#lista_activos').html('');

    $('#tabla_detalle').show();
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
            globalThis.tituloAlerta="¿Está seguro de imprimir el acta de entrega?";
        }else{
            $('#titulo_btn_acta').html('Generar Acta');
            globalThis.tituloAlerta="¿Está seguro de generar el acta de entrega?";
        }
       
        $('#modalDetalleActivo').modal('show');

        carga_tabla_detalle(data);

    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });

}

function carga_tabla_detalle(data){
 
    $('#idempleado_txt').val(data.lista_bienes[0].idemplea);
    $('#iddepartamento_txt').val(data.lista_bienes[0].iddepart);
    $('#idtransferencia').val(data.lista_bienes[0].idtransferencia);
    $('#numero_acta_txt').val(data.lista_bienes[0].nroacta);
  

    $('#tb_listaDetalle').html('');
	$("#TablaListaDetalle").DataTable().destroy();
    $('#TablaListaDetalle tbody').empty();

    $("#TablaListaDetalle tbody").html('');
    


    $.each(data.lista_bienes, function(i, item){
       
        $('#lista_activos').append(` <input type="hidden" name="numeroact_cabildo_txt[]"
                                    value="${item.idactivo}">`);

        var btn=`
                <button type="button" class="btn btn-primary" onclick="verDetalleAct('${item.idactivo}')">
                    Ver
                </button> 
            
                `;

        $('#TablaListaDetalle').append(`<tr role="row" class="odd" >

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

                        
    });

    
    cargar_estilos_tabla("TablaListaDetalle",5);
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
        
        $('#tabla_detalle').hide();
        $('#detalle_secccion').show();

        $('#btn_prim').hide();
        $('#btn_atras').show();

    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}

function regresar(){
    $('#tabla_detalle').show();
    $('#detalle_secccion').hide();

    $('#btn_prim').show();
    $('#btn_atras').hide();
}


function generar_acta(){
    $('#msjAlertaInconsis').html('');
    $('#alertIdAlertInc').fadeOut();
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
            $("#form_entrega").submit();

        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
      
    });

}

$("#form_entrega").on("submit", function(e){

	e.preventDefault();
    vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   	
	var data=$("#form_entrega").serialize();
	$.ajax({
		url:'/inventarios/generarActaEntrega', // Url que se envia para la solicitud
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
            window.location.href='/inventarios/descargarActa/'+requestData.pdf;
			alertNotificar("Acta de entrega creada exitosamente","success");
            consultar_custodio();
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
    $('.conten_busqueda').hide();
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

