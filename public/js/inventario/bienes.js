$(document).ready(function(){
    cargar_listado();   
    cargar_buscador();
    var error_pdf=$('#error_pdf').val();
    if(error_pdf=="danger"){
        alertNotificar("Ocurrió un error al descargar el acta","error");
    }
    
});

function cargar_buscador(){
    
    var url_bus="/inventarios/buscarMaterial";
    $('#bien').select2({
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
                            text: item.descripcion,
                            id: item.idmaterial
                        }
                    })
                };
        },
        cache: true
        }
    });


    
    var url_bus2="/inventarios/buscarMarca";
    $('#marca').select2({
        placeholder: 'Escriba El Valor A Consultar',
        minimumInputLength: 2,
        ajax: {
            url: url_bus2,
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
              
                return {
                    results:  $.map(data, function (item) {
                    
                        return {
                            text: item.descripcion,
                            id: item.idmarca
                        }
                    })
                };
        },
        cache: true
        }
    });

    $('#modelo').select2();
}


function info_marca(){
    var marca= $('#marca').val();

    if(marca=="" ||marca==null){
        $('#nombre_marca').val('');
        return;
    }
    else{
    
        var txt=$("#marca :selected").text();
        $('#nombre_marca').val(txt);


        $('#modelo').html('');
        $('#modelo').attr('disabled',true);
        vistacargando("m","Espere por favor");
        $.get("/inventarios/cargarModelo/"+marca, function(data){       
            vistacargando("");
           
            if(data.error==true){
                alertNotificar(data.mensaje,'error');
                return;                      
            }

            $('#modelo').attr('disabled',false);
            $.each(data.resultado,function(i,item){
                $('#modelo').append(`<option value="${item.idmodelo}">${item.descripcion}</option>`);
            })
            $("#modelo").trigger("chosen:updated"); // actualizamos el combo
          
            
        }).fail(function(){
            vistacargando("");
            alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
        });

        
        
    }
}

function info_modelo(){
    var modelo= $('#modelo').val();
    if(modelo!=''){
        var txt=$("#modelo :selected").text();
        $('#nombre_modelo').val(txt);
        
    }else{
        $('#nombre_modelo').val('');
    }
}

//carga listado en la tabla
function cargar_listado(){
	$('#tb_listaBienes').html('');
	$("#TablaBienes").DataTable().destroy();
    $('#TablaBienes tbody').empty();
    var num_col = $("#TablaBienes thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaBienes tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);   
   
    $.get("/inventarios/cargarListado", function(data){
       
        if(data.error==true){
            $("#TablaBienes tbody").html('');
            $("#TablaBienes tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            $("#TablaBienes tbody").html('');
            $("#TablaBienes tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            return;                      

        }
        $("#TablaBienes tbody").html('');
       
        $.each(data['resultado'], function(i, item){
           
            var btn=`    <button type="button" class="btn btn-info" onclick="editar('${item.idinv_activo}')">
                            Editar
                        </button> 
                        <button type="button" class="btn btn-primary" onclick="verDetalle('${item.idinv_activo}')">
                            Detalle
                        </button> 
                        
                       
                    `;
            
          
            if(item.estado_bien=='BU'){
                var estado_="Bueno";
            }else if(item.estado_bien=="MA"){
                var estado_="Malo";
            }else if(item.estado_bien=="RE"){
                var estado_="Regular";
            }else{
                var estado_="Excelente";
            }

            if(item.uso_bien=='LI'){
                var uso_="Libre";
            }else if(item.uso_bien=="OC"){
                var uso_="Ocupado";
            }else{
                var uso_="Baja";
            }
            
            $('#TablaBienes').append(`<tr role="row" class="odd">

                                <td  width="12%" colspan="1">
                                    ${item['num_activo_cabildo']}
                                </td>

                                <td  width="30%" colspan="1">
                                    ${item['nombre_cta']}
                                </td>

                               
								<td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
									${item['valor_compra']}
								</td>
                                <td  width="12%"style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['fecha_compra']}
                                </td> 


                                <td  width="13%"style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${uso_}
                                </td> 
                                
                                <td width="8%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${estado_}
                                </td>  
                                
                                <td width="15%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${btn}
                                </td>  
                                
                            </tr>  `);

                          
                       
        });

        
        cargar_estilos_tabla("TablaBienes",10);
    
    }).fail(function(){
        $("#TablaBienes tbody").html('');
        $("#TablaBienes tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   

}

function cargar_estilos_tabla_acta(idtabla,pageLength){

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

function cargar_estilos_tabla(idtabla,pageLength){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "desc" ]],
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

//guardo en una variable global el numero de cta asociado al bien buscado
globalThis.numero_cta_regis="";

//guardo en una variable global el numero de material asociado al bien buscado
globalThis.numero_material_regis=""

//no permitimos modificar el input disabled num de cta del formulario de registro
function  teclea_num_cta(){
    alertNotificar("Los datos del numero de cuenta no se pueden modificar","info");
    $('#num_cta').val(numero_cta_regis);
    $('#num_cta').prop('readonly',true);
    return;
}

//no permitimos modificar el input disabled num de material del formulario de registro
function teclea_num_material(){
    alertNotificar("Los datos del numero de material no se pueden modificar","info");
    $('#num_material').val(numero_material_regis);
    $('#num_material').prop('readonly',true);
    return;
}


$("#frm_Bien").on("submit", function(e){
	e.preventDefault();
	var bien=$('#buscar_bien').val();
    var num_cta=$('#num_cta').val();
    var num_material=$('#num_material').val();
    var marca=$('#marca').val();
    var modelo=$('#modelo').val();
	var estado=$('#estado').val();
    var fecha_compra=$('#fecha_compra').val();
	var valor_compra=$('#valor_compra').val();
    var fecha_revalorizacion=$('#fecha_revalorizacion').val();
	var valor_revalorizacion=$('#valor_revalorizacion').val();
    var control=$('#control').val();
    var txt=$("#modelo :selected").text();
    $('#nombre_modelo').val(txt);

	if(bien=="" || bien==null){
		alertNotificar("Debe registrar un nombre cuenta","error");
		return;
	}
    if(num_cta=="" || num_cta==null){
		alertNotificar("El bien ingresado no tiene asociado un número de cuenta válido","error");
		return;
	}
    if(num_material=="" || num_material==null){
		alertNotificar("El bien ingresado no tiene asociado un número de material válido","error");
		return;
	}
    if(marca=="" || marca==null){
		alertNotificar("Debe registrar una marca","error");
		return;
	}
    if(modelo=="" || modelo==null){
		alertNotificar("Debe registrar un modelo","error");
		return;
	}

	if(estado=="" || estado==null){
		alertNotificar("Debe seleccionar un estado","error");
		return;
	}
	if(fecha_compra=="" || fecha_compra==null){
		alertNotificar("Debe seleccionar una fecha de compra","error");
		return;
	}
    if(valor_compra=="" || valor_compra==null){
		alertNotificar("Debe registrar un valor de compra","error");
		return;
	}

    if(valor_compra<0){
		alertNotificar("Debe registrar un valor de compra mayor a cero","error");
		return;
	}

    if(fecha_revalorizacion!=""){
        if(valor_revalorizacion=="" || valor_revalorizacion==null){
            alertNotificar("Debe registrar un valor de revalorizacion","error");
            return;
        }
        
        if(valor_revalorizacion<0){
            alertNotificar("Debe registrar un valor de revalorizacion mayor a cero","error");
            return;
        }
	}

    if(valor_revalorizacion!=""){
        if(fecha_revalorizacion=="" || fecha_revalorizacion==null){
            alertNotificar("Debe registrar un fecha de revalorizacion","error");
            return;
        }
        if(valor_revalorizacion<0){
            alertNotificar("Debe registrar un valor de revalorizacion mayor a cero","error");
            return;
        }
	}
    if(control=="" || control==null){
		alertNotificar("Debe seleccionar el bien sujeto control","error");
		return;
	}
	

	if($('#method_Bien').val()=='POST'){
	    guardar_bien(); 
	}else{
	    editar_bien();
	}
});

////guardar
function guardar_bien() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
	
	var data=$("#frm_Bien").serialize();
	$.ajax({
		url:'/inventarios/bienes', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
          
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_listado();
			limpiar_campos_bienes();
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			limpiar_campos_bienes();
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}

function limpiar_campos_bienes(){
    $('#bien').val('');
    $('#fecha_compra').val('');
    $('#valor_compra').val('');
    $('#resumen').val('');
    $('#observaciones').val('');
    $('#num_cta').val('');
    $('#num_material').val('');
    $('#valor_revalorizacion').val('');
    $('#valor_depreciacion').val('');
    $('#fecha_revalorizacion').val('');
    $("#marca").val('').change();
    $("#modelo").val('').change();
    $('.option_marca').prop('selected',false);
    $("#marca").trigger("chosen:updated");
    $('.option_modelo').prop('selected',false);
    $("#modelo").trigger("chosen:updated");
    $('#modelo').prop('disabled',true);
    $('.option_estado').prop('selected',false);
    $("#estado").trigger("chosen:updated");
    $('.option_uso').prop('selected',false);
    $("#uso").trigger("chosen:updated");
    $('.option_control').prop('selected',false);
    $("#control").trigger("chosen:updated");

    $('#buscar_bien').val('');
    $('#nombre_cta').val('');
    $('#resumen').val('');
    $('#num_material').val('');
    $('#num_cta').val('');
}

function verDetalle(id){

    $('#num_activo_').html('');
    $('#nombre_cta_').html('');
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
    $('#empleado_').html('');
    $('#uso_').html('');
    $('#estado_').html('');
    $('#departamento_').html('');

    $('#departamento').html('');
    $('#departamento').val('').change();
    $('#empleado').val('').change();
    
    //fotos
    $('#idactivoImag_selecc').val('');
    $('#fotos').val('');
    $('#descripcion').val('');

    //seccion custodio
    $('#dato_empleado').val('');
    $('#id_empleado').val('');
    $('#mensaje_custodio').html('');
    $('#id_cust_act_local').val('');
    $('#id_cust_num_act_cab').val('');

    //seccion caracteristica
    $('#tbody_caracteristica').html('');
    $('.option_caracteristicas').prop('selected',false);
    $("#cmb_caracteristica").trigger("chosen:updated");
    $('#caracteristica_des').val('');
    $('#idactivoCaract_selecc').val('');
    $('#idactivoLocalCaract_selecc').val('');
    
    
    vistacargando("m","Espere por favor");
    $.get("/inventarios/bienes/"+id, function(data){
       
        vistacargando("");
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }

        if(data.resultado.estado_bien!=null){
            if(data.resultado.estado_bien=='BU'){
                var estadores="Bueno";
            }else if(data.resultado.estado_bien=="MA"){
                var estadores="Malo";
            }else if(data.resultado.estado_bien=="RE"){
                var estadores="Regular";
            }else{
                var estadores="Excelente";
            }
        }
           
        if(data.resultado.uso_bien!=null){
            if(data.resultado.uso_bien=='LI'){
                var usoresp="Libre";
            }else if(data.resultado.uso_bien=="OC"){
                var usoresp="Ocupado";
            }else{
                var usoresp="Baja";
            }
        }

        if(data.resultado.bien_sujeto_control!=null){
            if(data.resultado.bien_sujeto_control=='S'){
                var bensujresp="Si";
            
            }else{
                var bensujresp="No";
            }
        }

        if(data.resultado.id_marca==null){
            var detalle_marca="";
        }else{
            var detalle_marca=data.resultado.marca.descripcion;
        }

        if(data.resultado.id_modelo==null){
           var detalle_modelo="";
           
        }else{
            var detalle_modelo=data.resultado.modelo.descripcion;
        }

        $('#num_activo_').html(data.resultado.num_activo_cabildo);
        $('#nombre_cta_').html(data.resultado.nombre_cta);
        $('#numero_cta_').html(data.resultado.numero_cta);
        $('#numero_material_').html(data.resultado.id_material);
        $('#marca_').html(detalle_marca);
        $('#modelo_').html(detalle_modelo);
        $('#fcompra_').html(data.resultado.fecha_compra);
        $('#vcompra_').html(data.resultado.valor_compra);
        $('#tipo_').html(bensujresp);
        $('#uso_').html(usoresp);
        $('#estado_').html(estadores);

        
        if(data.resultado.depre_acum==null){
            $('#div_depre_acu').hide();
        }else{
            var depreciacion=data.resultado.depre_acum*1;
            depreciacion=depreciacion.toFixed(2);
            $('#div_depre_acu').show();
        }
        if(data.resultado.fecha_revalorizacion==null){
            $('#div_fecha_rev').hide();
        }else{
            $('#div_fecha_rev').show();
        }
        if(data.resultado.revalorizacion==null){
            $('#div_rev').hide();
        }else{
            $('#div_rev').show();
        }
        $('#depreceacion_').html(depreciacion);
        $('#frevalorizacion_').html(data.resultado.fecha_revalorizacion);
        $('#vrevalorizacion_').html(data.resultado.revalorizacion);

        if(data.custodio.length>0){

            $('#mensaje_custodio').append(`<div class="form-group">
                                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                                <div class="col-md-7 col-sm-7 col-xs-12">
                                                    <div class="alert alert-info alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
                                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                                        </button>
                                                        <strong>Información: </strong> El bien ya tiene un custodio activo
                                                    </div>
                                                </div>
                                            </div>`);

            
            $('#dato_empleado').val(data.custodio[0].funcionario);
            
            $('#dato_empleado').prop('disabled',true);
          
            $('#btn_registrar_cust').hide();

            $('#guarda_custodio').prop('disabled',true);

            globalThis.iddepartamento_cust=data.custodio[0].iddepart;
            globalThis.idempp_cust=data.custodio[0].idemplea;


            $('#departamento').html('');
            
            $('#departamento').append(`<option value="${data.custodio[0].iddepart}">${data.custodio[0].departamento}</option>`).change();
            $("#departamento").trigger("chosen:updated"); 
            $('#departamento').attr('disabled',true); 

        }else{
            globalThis.iddepartamento_cust="";
            globalThis.idempp_cust="";
            $('#dato_empleado').prop('disabled',false);
            $('#departamento').attr('disabled',true); 
         
            $('#btn_registrar_cust').show();
            $('#guarda_custodio').prop('disabled',false);
        }

     
        tabla_caracteristica(data.caracteristica);
        tabla_imagenes(data.imagenes)
        
        //id para el formulario de custodio (id_cust_act_local=id activo local )
        $('#id_cust_act_local').val(data.resultado.idinv_activo);
        $('#id_cust_num_act_cab').val(data.resultado.num_activo_cabildo);
        
       //id para el formulario de foto
        $('#idactivoImag_selecc').val(data.resultado.idinv_activo);

        //id para el formulario de caract (enviamos el activo de cabildo y el local)
        $('#idactivoCaract_selecc').val(data.resultado.num_activo_cabildo);
        $('#idactivoLocalCaract_selecc').val(data.resultado.idinv_activo);


        combos_custodio();

        $('#detalles').click();

        $('#modalDetalles').modal('show');
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });


}

function tabla_imagenes(datos){
    var idtabla = "tabla_foto";
        $(`#${idtabla}`).DataTable({

            dom: ""
            +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            "order": [[ 0, "asc" ]],
            pageLength: 3,
            searching  : false,
            sInfoFiltered:false,
            language: {
                        lengthMenu: "Mostrar _MENU_ registros por pagina",
                        zeroRecords: "No se encontraron resultados en su busqueda",							
                        searchPlaceholder: "Buscar registros",
                        info: "Mostrando registros de _START_ al _END_ de un total de  _TOTAL_ registros",
                        infoEmpty: "No existen registros",
                        infoFiltered: "(filtrado de un total de _MAX_ registros)",
                        search: "Buscar:",
                        paginate: {
                                    first: "Primero",
                                    last: "Último",
                                    next: "Siguiente",
                                    previous: "Anterior"
                                    },
                        },
                                            
            data: datos,

                columnDefs:[
                            { "width": "30%", "targets": 0 },
                            { "width": "50%", "targets": 1 },							
                            { "width": "20%", "targets": 2, className:"centrado"},
                    
                                
                ],
                        
                columns:[
                            {data: "descripcion"},
                            {data: "descripcion"},
                            {data: "descripcion"},
                            
                            
                ],
            
                "rowCallback": function( row, data, index ){

                    if(data.ruta!=null){
                        var link="visualizarimg/"+data.ruta;
                    }

                    $('td', row).eq(0).html(`
                        <center>${data.descripcion}</center>
                            

                    `);
                
                    $('td', row).eq(1).html(`
                                                <center><img id="verimgmodal"src="${link}" width="90px" height="90px"style=""></center>
                                                    
            
                                            `);
                                
                    $('td', row).eq(2).html(`
                                                <center><button type="button" onclick="foto_eliminar('${data.idinv_fotos_activos}')"class="btn btn-xs btn-danger " >
                                                    Borrar
                                                </button></center>
                                                    
            
                                            `);
    
                } 

        }); 
        
}

function tabla_caracteristica(datos){
    $('#tbody_caracteristica').html('');
    $("#tabla_caracteristica").DataTable().destroy();
    $('#tabla_caracteristica tbody').empty();

    $.each(datos, function(i, item){
        var btn=`<button type="button" class="btn btn-danger btn-sm" onclick="eliminar_caract('${item.idcarbien}')">
                    Eliminar
                </button>`;
        $('#tabla_caracteristica').append(`<tr role="row" class="odd">

                                                <td width="40%" style=" vertical-align: middle; text-align:center" >
                                                    ${item.nombre}
                                                </td>

                                                <td  width="40%"style=" vertical-align: middle; text-align:center">
                                                    ${item.codigo}
                                                </td> 

                                                <td  width="20%"style=" vertical-align: middle; text-align:center">
                                                    ${btn}
                                                </td> 
                                                
        
                                            </tr>`);

    })

    cargar_estilos_tabla_caract("tabla_caracteristica",5);


}

function eliminar_caract(idcaract){
    swal({
        title: '',
        text: '¿Estas seguro de eliminar la caracteristica?',
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
            vistacargando("m","Espere por favor");
            $.get("/inventarios/eliminarCaracteristica/"+idcaract, function(data){       
                vistacargando("");
                if(data.error==true){
                    alertNotificar(data.mensaje,'error');
                    return;                      
                }
                alertNotificar(data.mensaje,"success");
                tabla_caracteristica(data.lista_caract);
                
            }).fail(function(){
                vistacargando("");
                alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
            });
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
      
    });
}

function cargar_estilos_tabla_caract(idtabla,pageLength){
    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "desc" ]],
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

function combos_custodio(){
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

    var url_bus_empleado="/inventarios/buscarEmpleado";
    $('#empleado').select2({
        placeholder: 'Escriba El Valor A Consultar',
        minimumInputLength: 4,
        ajax: {
            url: url_bus_empleado,
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                $('#guarda_custodio').prop('disabled',false);
               
                return {
                results:  $.map(data, function (item) {
                   
                    return {
                        text: item.descripcion,    
                        id: item.idemplea
                        
                    }
                })
                };
        },
        cache: true
        }
    });
}




$("#frm_Custodio").on("submit", function(e){
	e.preventDefault();
	var nuevo_empleado=$('#id_empleado').val();
    var nuevo_departamento=$('#departamento').val();
    
	if(nuevo_empleado=="" || nuevo_empleado==null){
		alertNotificar("Debe seleccionar un empleado","error");
		return;
	}
    if(nuevo_departamento=="" || nuevo_departamento==null){
		alertNotificar("Debe seleccionar un departamento","error");
		return;
	}

    //si el departamento y el empleado es el mismo que viene desde cabildo(no hubo cambio) no dejamos registrat
    if(nuevo_empleado==idempp_cust && nuevo_departamento==iddepartamento_cust){
        alertNotificar("El empleado y el departamento selecccionado, son los mismos a los ya registrados","info");
        $('#guarda_custodio').prop('disabled',true);
        return;
    }
    
	if($('#method_Custodio').val()=='POST'){
        swal({
            title: '',
            text: '¿Estas seguro de asignar el custodio del activo al empleado?',
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
                guardar_custodio(); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
          
        });

	   
	}else{
	    editar_custodio();
	}
});

////guardar
function guardar_custodio() {
    
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
	
	var data=$("#frm_Custodio").serialize();
	$.ajax({
		url:'/inventarios/custodio', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
          
            if(requestData.error==true){
                alertNotificar(requestData.mensaje,"error");
                return;
            }

            //si se realiza con exito desabilitamos los input y el boton de guardar
         
            $('#dato_empleado').prop('disabled',true);
            $('#guarda_custodio').prop('disabled',true);
            $('#departamento').attr('disabled',true); 

            cargar_listado();

            $('#modalDetalles').modal('hide');
            
            // window.location.href='/inventarios/descargarActa/'+requestData.pdf;
			alertNotificar("Custodio asignado exitosamente","success");
		}, error:function (requestData) {
			vistacargando("");
			
			alertNotificar(requestData.mensaje,"error");
			
		}
	});
	
}


function editar(id){
    vistacargando("m","Espere por favor");
    $.get("/inventarios/bienes/"+id, function(data){
       
        vistacargando("");
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }

        
        globalThis.nombre_cuenta_global=data.resultado.nombre_cta;
        globalThis.numero_cta_global=data.resultado.numero_cta;
        globalThis.id_material_global=data.resultado.id_material;

        $('#idactivo').val(id);
        $('#edit_buscar_bien').val(data.resultado.nombre_cta);
        $('#nombre_cta_edit').val(data.resultado.nombre_cta);
        $('#fecha_compra_act').val(data.resultado.fecha_compra);
        $('#valor_act').val(data.resultado.valor_compra);
        // $('#resumen_act').val(data.resultado.resumen_bien);
        $('#observaciones_act').val(data.resultado.observaciones);
        $('#num_cta_act').val(data.resultado.numero_cta);
        $('#num_material_act').val(data.resultado.id_material);
        $('#valor_revalorizacion_act').val(data.resultado.revalorizacion);
        $('#valor_depreciacion_act').val(data.resultado.depre_acum);
        $('#fecha_revalorizacion_act').val(data.resultado.fecha_revalorizacion);
        $('#num_activo_cabil').val(data.resultado.num_activo_cabildo);


        if(data.resultado.id_marca==null){
            var idmarca_="";
            var detalle_marca="";
        }else{
            var idmarca_=data.resultado.marca.idinv_marca;
            var detalle_marca=data.resultado.marca.descripcion;
        }

        if(data.resultado.id_modelo==null){
            var idmodelo_="";
            var detalle_modelo="";
           
        }else{
            var idmodelo_=data.resultado.modelo.idinv_modelo;
            var detalle_modelo=data.resultado.modelo.descripcion;
        }


        $('#marca_act').html('');
        $('#marca_act').attr('disabled',false);  
        $('#marca_act').append(`<option value="${idmarca_}">${detalle_marca}</option>`).change();
        $("#marca_act").trigger("chosen:updated"); 

        $('#nombre_marca_act').val(detalle_marca);
        
        globalThis.modelo_edit_global=idmodelo_;

        $('#nombre_modelo_act').val(detalle_modelo);
        

        $('.option_estado').prop('selected',false); 
        $(`#estado_act option[value="${data.resultado['estado_bien']}"]`).prop('selected',true); 
        $("#estado_act").trigger("chosen:updated"); 

        $('.option_uso').prop('selected',false); 
        $(`#uso_act option[value="${data.resultado['uso_bien']}"]`).prop('selected',true); 
        $("#uso_act").trigger("chosen:updated"); 

        $('.option_control').prop('selected',false); 
        $(`#control_act option[value="${data.resultado['bien_sujeto_control']}"]`).prop('selected',true); 
        $("#control_act").trigger("chosen:updated");

              
        combo_buscar_edit();
        $('#form_actualizar').show();
        $('#formulario_registro').hide();

        $('html,body').animate({scrollTop:$('#adm_bienes').offset().top},400);
        // $('#modalDetalles').modal('show');
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });

   
}

function cancelar_actualizacion(){
    $('#form_actualizar').hide();
    $('#formulario_registro').show();
    limpiar_campos_bienes_act();
    limpiar_campos_bienes();
}

function regresar_busqueda(){
    $('#panelLista').show();
    $('#seccionDetalle').hide();
    limpiar_campos_bienes_act();
    limpiar_campos_bienes();
}

function limpiar_campos_bienes_act(){
    $("#marca_act").val('').change();
    $("#modelo_act").val('').change();
    $('#idactivo').val('');
    $('#edit_buscar_bien').val('');
    $('#nombre_cta_edit').val('');
    $('#bien_act').val('');
    $('#fecha_compra_act').val('');
    $('#valor_act').val('');
    $('#resumen_act').val('');
    $('#observaciones_act').val('');
    $('#num_cta_act').val('');
    $('#num_material_act').val('');
    $('#valor_revalorizacion_act').val('');
    $('#valor_depreciacion_act').val('');
    $('#fecha_revalorizacion_act').val('');
    $('#num_activo_cabil').val('');
    
    $('.option_estado').prop('selected',false);
    $("#estado_act").trigger("chosen:updated");
    $('.option_uso').prop('selected',false);
    $("#uso_act").trigger("chosen:updated");
    $('.option_control').prop('selected',false);
    $("#control_act").trigger("chosen:updated");
    $('#nombre_marca_act').val('');
    $('#nombre_modelo_act').val('');

    $('.option_modelo').prop('selected',false);
    $("#modelo").trigger("chosen:updated");
   


}

$("#frm_ActualizarBien").on("submit", function(e){
	e.preventDefault();
	var bien=$('#edit_buscar_bien').val();
    var num_cta=$('#num_cta_act').val();
    var num_material=$('#num_material_act').val();
    var marca=$('#marca_act').val();
    var modelo=$('#modelo_act').val();
    var estado=$('#estado_act').val();
	var uso=$('#uso_act').val();
	var fecha_compra=$('#fecha_compra_act').val();	
	var valor_compra=$('#valor_act').val();
    var fecha_revalorizacion=$('#fecha_revalorizacion_act').val();
	var valor_revalorizacion=$('#valor_revalorizacion_act').val();
    var control=$('#control_act').val();
    var txt=$("#modelo_act :selected").text();
    $('#nombre_modelo_act').val(txt);

	
    if(bien=="" || bien==null){
		alertNotificar("Debe registrar un nombre cuenta","error");
		return;
	}
    if(num_cta=="" || num_cta==null){
		alertNotificar("El bien ingresado no tiene asociado un número de cuenta válido","error");
		return;
	}
    if(num_material=="" || num_material==null){
		alertNotificar("El bien ingresado no tiene asociado un número de material válido","error");
		return;
	}
    if(marca=="" || marca==null){
		alertNotificar("Debe registrar una marca","error");
		return;
	}
    if(modelo=="" || modelo==null){
		alertNotificar("Debe registrar un modelo","error");
		return;
	}

	if(estado=="" || estado==null){
		alertNotificar("Debe seleccionar un estado","error");
		return;
	}

    if(uso=="" || uso==null){
		alertNotificar("Debe seleccionar un uso","error");
		return;
	}
	if(fecha_compra=="" || fecha_compra==null){
		alertNotificar("Debe seleccionar una fecha de compra","error");
		return;
	}
    if(valor_compra=="" || valor_compra==null){
		alertNotificar("Debe registrar un valor de compra","error");
		return;
	}

    if(valor_compra<0){
		alertNotificar("Debe registrar un valor de compra mayor a cero","error");
		return;
	}

    if(fecha_revalorizacion!=""){
        if(valor_revalorizacion=="" || valor_revalorizacion==null){
            alertNotificar("Debe registrar un valor de revalorizacion","error");
            return;
        }
        
        if(valor_revalorizacion<0){
            alertNotificar("Debe registrar un valor de revalorizacion mayor a cero","error");
            return;
        }
	}

    if(valor_revalorizacion!=""){
        if(fecha_revalorizacion=="" || fecha_revalorizacion==null){
            alertNotificar("Debe registrar un fecha de revalorizacion","error");
            return;
        }
        if(valor_revalorizacion<0){
            alertNotificar("Debe registrar un valor de revalorizacion mayor a cero","error");
            return;
        }
	}
    if(control=="" || control==null){
		alertNotificar("Debe seleccionar el bien sujeto control","error");
		return;
	}


	if($('#method_BienAct').val()=='PUT'){
	    actualizar_bien(); 
	}else{
	    guardar_bien();
	}
});

////actualizar_bien
function actualizar_bien() {
	vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
	var idact=$('#idactivo').val();
	var data=$("#frm_ActualizarBien").serialize();
	$.ajax({
		url:'/inventarios/bienes/'+idact, // Url que se envia para la solicitud
		method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
		data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
		dataType: 'json',
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
			vistacargando("");
           
            if(requestData.estadoP=='error'){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return;
            }
            cargar_listado();
			limpiar_campos_bienes_act();
			alertNotificar(requestData.mensaje,requestData.estadoP);
            cancelar_actualizacion();
		}, error:function (requestData) {
			vistacargando("");
			// limpiar_campos_bienes();
			alertNotificar(requestData.mensaje,requestData.estadoP);
			
		}
	});
	
}


// evento al darle enter sobre input de buscar bienes registros
$("#buscar_bien").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#msjAlerta').html('<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los bienes.</div>');
    if(e.which == 13) { // codigo del enter
        e.preventDefault();
        buscarInfo();
    }  
});
// al darle click a continuar
function buscarInfo(){
    var buscar = $("#buscar_bien").val();
    if(buscar==""){
        alertNotificar("Ingrese la descripción del bien","error");
        $("#buscar_bien").focus();
        $('#msjAlerta').html('');
        $('#alertIdAlert').fadeOut()
        return;
    }else{
        buscar_material();
        $('#msjAlerta').html('');
        $('#alertIdAlert').fadeOut()
    }
};

function limpiar_material(input){

    //verificamos si ya fue previamente buscado un material
    var idmat=$('#num_material').val();
    if(idmat!=""){
        $('#buscar_bien').val('');
        $('#nombre_cta').val('');
        $('#resumen').val('');
        $('#num_material').val('');
        $('#num_cta').val('');
    }
       
}


function buscar_material(){
    // validamos para ocultar el contenido de busqueda cuando
    var busqueda = $('#buscar_bien').val();
    var conten_busqueda = $('#buscar_bien').siblings('.conten_busqueda');
    var div_content = $(conten_busqueda).children('.div_content');
    $(conten_busqueda).hide();
       
    $('#msmDetalledos').html('');
    $('#msmDetalledos').hide();
    
    $('#MaterialLista').empty(); // limpiamos la tabla
    vistacargando("m","Buscando información...");
    $.get('/inventarios/buscarMateriales/'+busqueda, function (data){
    
        vistacargando("");
       ;
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            return;
        }
        if(data.resultado.length==0){
            alertNotificar("No se encontró el bien","info");
            return;
        }
        
        $('#MaterialLista').empty();
        $.each(data.resultado, function(i, item){
           
            $(conten_busqueda).show();
            $('#MaterialLista').append(
            
            `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
            border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarMaterial('${item.idmaterial}','${item.idtipo}','${item.descripcion}')">` +
            ' ' + item.descripcion +
            '</button>' +
            '<div class="dropdown-divider"></div>'
            );
        }); 
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   
} 

function capturarMaterial(idmaterial,idtipo,descripcion){
    $('.conten_busqueda').hide();
    
    $('#buscar_bien').val(descripcion);
    $('#nombre_cta').val(descripcion);
    $('#resumen').val(descripcion);
    $('#num_material').val(idmaterial);
    $('#num_cta').val(idtipo);
   
    //guardo en la variable global el num d cta
    numero_cta_regis=idtipo;

    //guardo en la variable global el num d material
    numero_material_regis=idmaterial;
}


// evento al darle enter sobre input de buscar bienes edicion (quitado)
$("#edit_buscar_bien").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#edit_msjAlerta').html('<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los bienes.</div>');
    if(e.which == 13) { // codigo del enter
        e.preventDefault();
        editBuscarInfo();
    }  
});
// al darle click a continuar
function editBuscarInfo(){
    var buscar = $("#edit_buscar_bien").val();
    if(buscar==""){
        alertNotificar("Ingrese la descripción  del bien","error");
        $("#edit_buscar_bien").focus()
        $('#edit_msjAlerta').html('');
        $('#edit_alertIdAlert').fadeOut()
        return;
    }else{
        edit_buscar_material();
        $('#edit_msjAlerta').html('');
        $('#edit_alertIdAlert').fadeOut()
    }
};

function edit_limpiar_material(input){

    //verificamos si ya fue previamente buscado un material
    var idmat=$('#num_material_act').val();
    if(idmat!=""){
        $('#edit_buscar_bien').val('');
        $('#nombre_cta_edit').val('');
        $('#num_material_act').val('');
        $('#num_cta_act').val('');
    }
       
}

function info_num_cta_edit(){
    alertNotificar("Los datos del numero de cuenta no se pueden modificar","info");
    $('#num_cta_act').val(numero_cta_global);
    $('#num_cta_act').prop('readonly',true);
    return;
}

function info_num_material_edit(){
    alertNotificar("Los datos del numero de material no se pueden modificar","info");
    $('#num_material_act').val(id_material_global);
    $('#num_material_act').prop('readonly',true);
    return;
}


function edit_buscar_material(){
    // validamos para ocultar el contenido de busqueda cuando
    var busqueda = $('#edit_buscar_bien').val();
    var conten_busqueda = $('#edit_buscar_bien').siblings('.conten_busqueda');
    var div_content = $(conten_busqueda).children('.div_content');
    $(conten_busqueda).hide();
   
    
    $('#EditMaterialLista').empty(); // limpiamos la tabla
    vistacargando("m","Buscando información...");
    $.get('/inventarios/buscarMateriales/'+busqueda, function (data){
    
        vistacargando("");
       ;
        if(data.error==true){
            alertNotificar(data.mensaje,"error");
            return;
        }
        if(data.resultado.length==0){
            alertNotificar("No se encontró el bien","info");
            return;
        }
        
        $('#EditMaterialLista').empty();
        $.each(data.resultado, function(i, item){
           
            $(conten_busqueda).show();
            $('#EditMaterialLista').append(
            
            `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
            border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="EditcapturarMaterial('${item.idmaterial}','${item.idtipo}','${item.descripcion}')">` +
            ' ' + item.descripcion +
            '</button>' +
            '<div class="dropdown-divider"></div>'
            );
        }); 
        
    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   
} 

function EditcapturarMaterial(idmaterial,idtipo,descripcion){
    
    $('.conten_busqueda').hide();
    
    $('#edit_buscar_bien').val(descripcion);
    $('#nombre_cta_edit').val(descripcion);
    $('#num_material_act').val(idmaterial);
    $('#num_cta_act').val(idtipo);

    numero_cta_global=idtipo;
    id_material_global=idmaterial;
   
    
}

function combo_buscar_edit(){

    var url_bus_marca="/inventarios/buscarMarca";
    $('#marca_act').select2({
        placeholder: 'Escriba El Valor A Consultar',
        minimumInputLength: 2,
        ajax: {
            url: url_bus_marca,
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
               
                return {
                    results:  $.map(data, function (item) {
                    
                        return {
                            text: item.descripcion,
                            id: item.idmarca
                        }
                    })
                };
        },
        cache: true
        }
    });

    

    $('#modelo_act').select2();


    var url_bus_departamento="/inventarios/buscarDepartamento";
    $('#departamento').select2({
        placeholder: 'Escriba El Valor A Consultar',
        minimumInputLength: 3,
        ajax: {
            url: url_bus_departamento,
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
              
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

    var url_bus_empleado="/inventarios/buscarEmpleado";
    $('#empleado').select2({
        placeholder: 'Escriba El Valor A Consultar',
        minimumInputLength: 4,
        ajax: {
            url: url_bus_empleado,
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
              
                return {
                    results:  $.map(data, function (item) {
                    
                        return {
                            text: item.descripcion,    
                            id: item.idemplea
                            
                        }
                    })
                };
        },
        cache: true
        }
    });
}

function info_marca_act(){
    var marca= $('#marca_act').val();
   
    if(marca=="" ||marca==null){
        $('#nombre_marca_act').val('');
        $('#modelo_act').html('');
        $("#modelo_act").val('').change();
        return;
    }
    else{

        var txt=$("#marca_act :selected").text();
        $('#nombre_marca_act').val(txt);

        $('#modelo_act').html('');
        $('#modelo_act').attr('disabled',true);
        vistacargando("m","Espere por favor");
        $.get("/inventarios/cargarModelo/"+marca, function(data){       
            vistacargando("");
                   
            if(data.error==true){
                alertNotificar(data.mensaje,'error');
                return;                      
            }

            $('#modelo_act').attr('disabled',false);
           
            $.each(data.resultado,function(i,item){
             
                if(modelo_edit_global==item.idmodelo){
                    var checkeado="selected";
                }
                $('#modelo_act').append(`<option ${checkeado} value="${item.idmodelo}">${item.descripcion}</option>`);
                // $('#modelo_act').append(`<option value="${item.idmodelo}">${item.descripcion}</option>`);
            })
            $("#modelo_act").trigger("chosen:updated"); // actualizamos el combo
          
            
        }).fail(function(){
            vistacargando("");
            alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
        });
        
    }
}

function info_modelo_act(){
    var modelo= $('#modelo_act').val();
    if(modelo!=''){
        var txt=$("#modelo_act :selected").text();
        $('#nombre_modelo_act').val(txt);
        
    }else{
        $('#nombre_modelo_act').val('');
    }
}

//carga listado en la tabla
function cargar_fotos(id){
    $('#tabla_foto').DataTable().destroy();
    $('#tabla_foto tbody').empty(); 

	var num_col = $("#tabla_foto thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tabla_foto tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);

	
	$.get("/inventarios/cargarFotos/"+id, function(retorno){
		
		var idtabla = "tabla_foto";
		if(retorno['error']==true){
			alertNotificar("Inconvenientes al obtener las imágenes del bien, por favor intente nuevamente","error");	
			return;
		}

       
		var idtabla = "tabla_foto";
        $(`#${idtabla}`).DataTable({

			dom: ""
			+"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
			+"<rt>"
			+"<'row'<'form-inline'"
			+" <'col-sm-6 col-md-6 col-lg-6'l>"
			+"<'col-sm-6 col-md-6 col-lg-6'p>>>",
			"destroy":true,
	        "order": [[ 0, "asc" ]],
			pageLength: 3,
			searching  : false,
			sInfoFiltered:false,
			language: {
						lengthMenu: "Mostrar _MENU_ registros por pagina",
						zeroRecords: "No se encontraron resultados en su busqueda",							
                        searchPlaceholder: "Buscar registros",
						info: "Mostrando registros de _START_ al _END_ de un total de  _TOTAL_ registros",
						infoEmpty: "No existen registros",
						infoFiltered: "(filtrado de un total de _MAX_ registros)",
						search: "Buscar:",
						paginate: {
									first: "Primero",
									last: "Último",
									next: "Siguiente",
									previous: "Anterior"
							      },
						},
                    
                        
            data: retorno.resultado,

				columnDefs:[
							{ "width": "30%", "targets": 0 },
                            { "width": "50%", "targets": 1 },							
                            { "width": "20%", "targets": 2, className:"centrado"},
					
								
				],
                       
				columns:[
							{data: "descripcion"},
                            {data: "descripcion"},
                            {data: "descripcion"},
							
							
				],
			
				"rowCallback": function( row, data, index ){

                    if(data.ruta!=null){
                        var link="visualizarimg/"+data.ruta;
                    }

                    $('td', row).eq(0).html(`
                        <center>${data.descripcion}</center>
                            

                    `);
					$('td', row).eq(1).html(`
												<center><img id="verimgmodal"src="${link}" width="90px" height="90px"style=""></center>
													
			
											`);
								
					$('td', row).eq(2).html(`
												<center><button type="button" onclick="foto_eliminar('${data.idinv_fotos_activos}')"class="btn btn-xs btn-danger " >
													Borrar
												</button></center>
													
			
											`);
    
                } 

        }); 
		// console.clear();

	
	}).fail(function(){
        $('#tabla_foto tbody').html('');
        $("#tabla_foto tbody").html(`<tr><td colspan="${num_col}"><center>Ocurrió un error</center></td></tr>`);
		alertNotificar("Inconvenientes al obtener las imágenes del bien, por favor intente nuevamente","error");
	
	});
	

}


///formulario de registro de fotos del bien
$("#formumlario_foto").on("submit", function(e){
	e.preventDefault();
	var fotos=$('#fotos').val();
    var idactivo=$('#idactivoImag_selecc').val();
   	
    if(fotos=="" || fotos==null){
		alertNotificar("Debe registrar minimo una foto","error");
		return;
	}

    vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
    var FrmData = new FormData(this);
	var data=$("#formumlario_foto").serialize();
	$.ajax({
		url:'/inventarios/guardarFotos', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: FrmData,
        contentType:false,
        cache:false,
        processData:false,
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
            vistacargando("");
            if(requestData.estadoP=="error"){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                
                return; 
            }
            $('#fotos').val('');
            cargar_fotos(idactivo);
			limpiar_campos_fotos();
			alertNotificar(requestData.mensaje,requestData.estadoP);
		}, error:function (requestData) {
			vistacargando("");
			alertNotificar('Ocurrió un error','error');
			
		}
	});
	
})

function limpiar_campos_fotos(){
	$('#fotos').val('');
    $('#descripcion').val('');
}


//eliminar fotos
function foto_eliminar(id) {
    
    if(confirm('¿Quiere eliminar la foto?')){
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
       
		vistacargando("m","Espere por favor");
        var idactivo=$('#idactivoImag_selecc').val();

		$.get("/inventarios/eliminarFotos/"+id, function(requestData){
            vistacargando("");
            if(requestData.estadoP=="error"){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                return; 
            }
            cargar_fotos(idactivo);
            limpiar_campos_fotos();
            alertNotificar(requestData.mensaje,requestData.estadoP);
					
			
	    }).fail(function(requestData){
            vistacargando("");
            alertNotificar('Ocurrió un error','error');
            limpiar_campos_fotos();
        });
    }

	
}

//al teclear en el input empleado
$("#dato_empleado").keypress(function(e){
    //mostramos un sms para alertar que debe dar enter para buscar los datos
    $('#msjAlertaCust').html('<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención!</strong> Presione la tecla enter para buscar los datos del empleado.</div>');
    if(e.which == 13) { // codigo del enter
        e.preventDefault();
        buscarInfoEmp();
    }  
});
// al darle click a continuar
function buscarInfoEmp(){
    var buscar = $("#dato_empleado").val();
    if(buscar==""){
        alertNotificar("Ingrese los datos del empleado","error");
        $("#dato_empleado").focus();
        $('#msjAlertaCust').html('');
        $('#alertIdAlert').fadeOut()
        return;
    }else{
        buscar_empleado();
        $('#msjAlertaCust').html('');
        $('#alertIdAlert').fadeOut()
    }
};

function limpiar_empleado(input){

    //verificamos si ya fue previamente buscado un material
    var idempl=$('#id_empleado').val();
    if(idempl!=""){
        $('#id_empleado').val('');
        $('#dato_empleado').val('');

        $('#departamento').html('');
        $('#departamento').val('').change();
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
       ;
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
            border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarEmpleado('${item.idemplea}','${item.cedula}','${item.nombres}','${item.iddepart}')">` +
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

function capturarEmpleado(idemplea,cedula,nombres,iddepart){
    $('.conten_busqueda').hide();
    $('#dato_empleado').val(cedula+" - "+nombres);
    $('#id_empleado').val(idemplea);

    obtener_departamento_empleado(iddepart);
   
    
}

function obtener_departamento_empleado(iddep){
    vistacargando("m","Obteniendo datos del departamento");
    $.get("/inventarios/consultaDepartEmpleado/"+iddep, function(data){       
        vistacargando("");
        
        if(data.error==true){
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        

        // $('#departamento').attr('disabled',false); 
        $('#departamento').html('');
            
        $('#departamento').append(`<option value="${data.resultado[0].iddepart}">${data.resultado[0].descripcion}</option>`).change();
        $("#departamento").trigger("chosen:updated"); 
        $('#departamento').attr('disabled',false); 
        
       

    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}




///formulario de registro de caracteristica del bien
$("#formumlario_caracteristica").on("submit", function(e){
	e.preventDefault();
	var tipo_caract=$('#cmb_caracteristica').val();
    var desc_caract=$('#caracteristica_des').val();
    var idactivo_form_caract=$('#idactivoCaract_selecc').val();
   	
    if(tipo_caract=="" || tipo_caract==null){
		alertNotificar("Seleccione un tipo de característica","error");
		return;
	}

    if(desc_caract=="" || desc_caract==null){
		alertNotificar("Debe registrar una descripción","error");
        $('#caracteristica_des').focus();
		return;
	}

    vistacargando("m","Espere por favor");
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
   
    var FrmData = new FormData(this);
	var data=$("#formumlario_caracteristica").serialize();
	$.ajax({
		url:'/inventarios/guardarCaracteristicas', // Url que se envia para la solicitud
		method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
		data: FrmData,
        contentType:false,
        cache:false,
        processData:false,
		success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
		{
            vistacargando("");
            if(requestData.estadoP=="error"){
                alertNotificar(requestData.mensaje,requestData.estadoP);
                
                return; 
            }
            $('#fotos').val('');
            // cargar_fotos(idactivo_form_caract);
			limpiar_campos_caract();
			alertNotificar(requestData.mensaje,requestData.estadoP);
            tabla_caracteristica(requestData.lista_caracteristica)
		}, error:function (requestData) {
			vistacargando("");
			alertNotificar('Ocurrió un error','error');
			
		}
	});
	
})

function limpiar_campos_caract(){
    $('#caracteristica_des').val('');
    $('.option_caracteristicas').prop('selected',false); // deseleccionamos 
    $("#cmb_caracteristica").trigger("chosen:updated"); // actualizamos 
    
}

