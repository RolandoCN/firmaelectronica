function cargar_buscador(){
    
    var url_bus="/gestionCoactiva/buscarContribuyente";
    $('#id_contribuyente').select2({
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

///para buscar las deudas
function consultar_deudas(){
    var codigo_contrib=$('#id_contribuyente').val();
  
    if(codigo_contrib=="" || codigo_contrib==0){
        alertNotificar("Ingrese los datos del contribuyente","info");
        return;
    }

    //otenenemos el nombre del contribuyente
    var nombrecontribuyente=$('#id_contribuyente option:selected').text();
    var valor_aux = nombrecontribuyente.split(' - ');  
    var nombre_contribuyente=valor_aux[1]; 

    $('.valor_sugerido_').html('');
    $('.deuda_pendiente_').html('');
    $('.cedula_').html('');
    $('.contribuyente_').html('');
    $('#valor_inicial_').val('');
    $('#valor_coactiva_').val('');
    $('#msjAlertaInconsis').html('');
    $('#alertIdAlertInc').fadeOut();

    $('#contribuyente_selecc').val('');

    $('#btn_ver').html("");

    $('#body_tabla_emision').html('');
	$("#tabla_emision").DataTable().destroy();
    $('#tabla_emision tbody').empty();
    var num_col = $("#tabla_emision thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#tabla_emision tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`); 

    vistacargando("m","Espere por favor");
    $.get("/gestionCoactiva/buscarDeudasPlan/"+codigo_contrib, function(data){
        console.log(data)
        $('#btn_guardar').hide();
        vistacargando("");
        if(data.error==true){
            if(data.tipo=="success"){
                alertNotificar(data.mensaje,"success");
                 return;   
            }
            //si esta registrado el convenio y esta pendiente... proceso.. rechazado
            if(data.estados==true){
                if(data.idplan==null){
                    var url="/convenio/solicitudes";
                }else{
                    var url="/gestionCoactiva/solicitudesCoactiva";
                }
                $('#msjAlertaInconsis').html(`<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlertInc"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención! </strong>${data.mensaje}, para visualizar el listado de convenio de pagos registrados en el sistema, presione <a style="color:black" href=${url} target="_blank">AQUÍ</a> .</div>`);
                return;   
            }
            //si el usuario esta registrado en unplan activo
            if(data.plan_relacionado==true){
                $('#msjAlertaInconsis').html(`<div class="text-center alert alert-info col-md-12" role="alert" id="alertIdAlertInc"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Atención! </strong>${data.mensaje}, para visualizar el listado dep planes registrados en el sistema, presione <a style="color:black" href="/gestionCoactiva/registroPlanes" target="_blank">AQUÍ</a> .</div>`);
                return;   
            }

            //si el usuario no esta registrado en el sistema intranet, lo redireccionamos a la vista de registro de usuario
            // window.location.href
            alertNotificar(data.mensaje,"error");
            if(data.existe_user==false){
                setTimeout(function() {
                    window.open('/registroUsuario/cabildo','_blank');
                },  4000);

            }        
                      
            return;   
        }

        //emisiones
        listatitulo(data.resultado.emisiones);
       
        
        $('.valor_sugerido_').html()
       
        var sbu=data.resultado.salario_basico*1;
        sbu=parseFloat(sbu);

        //si la deuda no supera el SBU
        if(data.totalDeuda <= sbu){           
            alertNotificar("El valor adeudado es $ "+data.totalDeuda+" el cúal no supera el salario básico actual","success");
            return;
        }

        //obtenemos el valor inicial que es (20% dato paramentrizado) del total de la deuda
        var valor_inicial=data.resultado.valor_inicial;
      
        //obtenemos el valor por concepto de coactiva que es (12% dato paramentrizado) del total de la deuda
        var valor_coactiva=data.resultado.valor_coactiva;      

        //obtenemos el total del valor de cuota de entrada sugerido que es la suma de valor inical mas valor coactiva
        var valor_sugerido=data.resultado.total_cuota_entrada;     

        //guardo el valor sugerido en una variable golbal
        globalThis.valor_sugerido_entrada=valor_sugerido;

        //guardo el valor de la deuda en una variable golbal
        // var deuda_total
        globalThis.deuda=data.resultado.totalDeuda;

        $('#cuota_entrada').val(valor_sugerido);

        //seccion detalle contribuyentes
        $('.valor_inicial_').html(' $ '+ valor_inicial);
        $('.valor_coactiva_').html(' $ '+ valor_coactiva);
        $('.valor_sugerido_').html(' $ '+ valor_sugerido);
        $('.deuda_pendiente_').html(' $ '+ data.resultado.totalDeuda);


        $('#btn_ver').append(`<button class='btn btn-info btn-xs'type="button" onclick="vertitulo()">Visualizar</button>`);

        $('.cedula_').html(data.resultado.usuario.cedula);
        $('.contribuyente_').html(data.resultado.usuario.name);

        //seccion formulario de registro
        $('#contribuyente_selecc').val(data.resultado.usuario.cedula);
        $('#valor_inicial_').val(valor_inicial);
        $('#valor_coactiva_').val(valor_coactiva);

        $('#formulario_consulta').hide();
        $('#seccion_datos_deudas').show();

        

    }).fail(function(){
        vistacargando("");
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
}

function vertitulo(){
    $('#modal_titulo').modal('show');
}

function listatitulo(emisiones){
  
    $('#body_tabla_emision').html('');	
    $.each(emisiones,function(i,item){
        var total=(parseFloat(item['valor'])+parseFloat(item['iva'])+parseFloat(item['interes'])+parseFloat(item['recargo'])+parseFloat(item['coactiva']))-parseFloat(item['descuento']);
        
        $('#tabla_emision').append(`<tr">
                            <td style="text-align:center;width:20%">${item['emi01codi']}</td>
                            <td style="text-align:left;width:50%">${item['impuesto']}</td>
                            <td style="text-align:center;width:20%">${item['fecha_obli']}</td>
                            <td style="text-align:center;width:10%">$${parseFloat(total).toFixed(2)}</td>
                            </tr>`);
    });
    cargar_estilos_tabla_emision("tabla_emision",5);
    
       


}

function cargar_estilos_tabla_emision(idtabla,pageLength){

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

//para validar los datos de calculo de la amortizacion
function calcular_amortizacion(){
    //obtenemos el valor de la cantidad de cuota seleccionada
    var cantidad_cuot=$('#cant_cuotas').val();

    //obtenemos el valor del campo del cuota entrada
    var entrada=$('#cuota_entrada').val();
    // entrada=parseFloat(entrada);
  
    //si esta vacio el input de cuota de entrada o es menor al valor sugerido
    if(entrada < valor_sugerido_entrada){
        alertNotificar("La cuota de entrada no puede ser menor al valor de entrada sugerido","error");
        $('#cuota_entrada').focus();
        return;
    }

    //si la cuota de entrada es mayor o igual al valor de la deuda pendiente
    if(entrada >= deuda){
        alertNotificar("La cuota de entrada no puede ser mayor o igual al total de la deuda pendiente","error");
        $('#cuota_entrada').focus();
        return;
    }

    //si esta vacio el campo de seleccion de cantidad de cuotas es decir no a  seleccionado ninnguna opcion
    if(cantidad_cuot==""){
        alertNotificar("Seleccione la cantidad de cuotas","error");
        return;
    }
    vistacargando("m","Espere por favor");
    generar_cuotas_pagos(entrada,deuda,cantidad_cuot);

   
}

//funcion que calcula los valores a pagar amortizados
function generar_cuotas_pagos(entrada,deuda,cantidad_cuot){
  
    $('#btn_guardar').hide();
    $('#tb_listaAmortizacion').html('');
	$("#TablaAmortizacion").DataTable().destroy();
    $('#TablaAmortizacion tbody').empty();
    var num_col = $("#TablaAmortizacion thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaAmortizacion tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);  
   
    $.get('/gestionCoactiva/generarCuotas/'+entrada+'/'+deuda+'/'+cantidad_cuot,function(data){
        console.log(data)
		vistacargando();
        $('#tb_listaAmortizacion').html('');
        if(data.error==true){
            $('#btn_guardar').hide();
            $("#TablaAmortizacion tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        $('.cant_cuota_').html(cantidad_cuot);
        $('.valor_x_cuota_').html(data['detalle'][1].total);

        
		$.each(data['detalle'],function(i,item){
			$('#TablaAmortizacion').append(`<tr>
								<td style=" vertical-align: middle; text-align:center">${item['cuota']}</td>
								<td style=" vertical-align: middle; text-align:center">$${item['total']}</td>
								<td style=" vertical-align: middle; text-align:center">${item['fecha']}</td>
								</tr>`);
		});
        cargar_estilos_tabla("TablaAmortizacion",5);
        $('#btn_guardar').show();
        $('#modalTablaCalculo').modal('show');

        //guardo el valor entrada en una variable golbal
        globalThis.valor_entrada_global=entrada;

        //guardo el valor de deuda en una variable golbal
        globalThis.valor_deuda_global=deuda;

        //guardo la cantidad de cuota en una variable golbal
        globalThis.cantidad_cuota_global=cantidad_cuot;
       

	}).fail(function(){
        $('#btn_guardar').hide();
        $("#TablaAmortizacion tbody").html(`<tr><td colspan="${num_col}" style="padding:20px; 0px; font-size:20px;"><center>Ocurrió un error</b></center></td></tr>`); 
        alertNotificar(data.mensaje,'error');
        alertNotificar('Inconvenientes al procesar solicitud','error');
        vistacargando();
    })
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

function keyupEntradad(){
    
    $('.option_cant_cuotas').prop('selected',false);
    $("#cant_cuotas").trigger("chosen:updated"); 
    $('#btn_guardar').hide();
    $('#tb_listaAmortizacion').html('');
    $("#TablaAmortizacion").DataTable().destroy();
    $('#TablaAmortizacion tbody').empty();
    var num_col = $("#TablaAmortizacion thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaAmortizacion tbody").html(`<tr><td colspan="${num_col}" style="padding:10px; 0px; font-size:12px;"><center>No existen registros</b></center></td></tr>`);
}




//accion cuando presiona el boton guardar
function registrar_convenio(){
    //obtenemos el valor de la cantidad de cuota seleccionada
    var cantidad_cuot=$('#cant_cuotas').val();

    //obtenemos el valor del campo del cuota entrada
    var entrada=$('#cuota_entrada').val();
    // entrada=parseFloat(entrada);

    //si esta vacio el input de cuota de entrada o es menor al valor sugerido
    if(entrada < valor_sugerido_entrada){
        alertNotificar("La cuota de entrada no puede ser menor al valor de entrada sugerido","error");
        $('#cuota_entrada').focus();
        return;
    }

    //si la cuota de entrada es mayor al valor de la deuda pendiente
    if(entrada > deuda){
        alertNotificar("La cuota de entrada no puede ser mayor al total de la deuda pendiente","error");
        $('#cuota_entrada').focus();
        return;
    }

    //si esta vacio el campo de seleccion de cantidad de cuotas es decir no a  seleccionado ninnguna opcion
    if(cantidad_cuot==""){
        alertNotificar("Seleccione la cantidad de cuotas","error");
        return;
    }

    swal({
        title: '',
        text: 'Está seguro de solicitar el convenio de pago',
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
            $('#frm_Convenio').submit();            
        }
        sweetAlert.close();   
            
    });

}

$('#frm_Convenio').submit(function(e){
    e.preventDefault();
    vistacargando('m','Registrando el convenio');
    $.ajaxSetup({
       headers: {
               'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
       });        

       $.ajax({
           type: "POST",
           url: '/gestionCoactiva/generarConvenioPlan',
           data: new FormData(this),
           contentType: false,
           cache: false,
           processData:false,
           success: function(data){ 
             
               vistacargando();
               if(data['error']==true){
                   alertNotificar(data['detalle'],'error');
                   return;
               }
               if(data['error']==false){
                   alertNotificar(data['detalle'],'success');
                //    window.location.href='/gestionCoactiva/descargarDocumento/'+data['pdf'];
                   regresar_busqueda();
               }
            },error: function(e){
                vistacargando("");
                alertNotificar('Ocurrió un error, intente nuevamente', "error");
                return;
            }
       });
   
});

function regresar_busqueda(){
    $('#seccion_datos_deudas').hide();
    $('#formulario_consulta').show();
    limpiar_datos_registro();
    
}

function limpiar_datos_registro(){
    $('.valor_sugerido_').html('');
    $('.deuda_pendiente_').html('');
    $('.cedula_').html('');
    $('.contribuyente_').html('');

    $('#valor_inicial_').val('');
    $('#valor_coactiva_').val('');

    $('#contribuyente_selecc').val('');
    $('#cuota_entrada').val('');
    $('.option_cant_cuotas').prop('selected',false);
    $("#cant_cuotas").trigger("chosen:updated"); 
    $('#tb_listaAmortizacion').html('');
    
    $("#TablaAmortizacion").DataTable().destroy();
    $('#TablaAmortizacion tbody').empty();
    var num_col = $("#TablaAmortizacion thead tr th").length; //obtenemos el numero de columnas de la tabla
    $("#TablaAmortizacion tbody").html(`<tr><td colspan="${num_col}" style="padding:10px; 0px; font-size:12px;"><center>No existen registros</b></center></td></tr>`);

}

function generar_simulacion(){
    var codigo_contrib=$('#id_contribuyente').val();
    var nombre_cont=$('.contribuyente_').html();
    var valor_ini=$('#valor_inicial_').val();
    var valor_coact=$('#valor_coactiva_').val();
    
    vistacargando("m","Espere por favor");           

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });  
    
    $.ajax({
        type: "POST",
        url: '/gestionCoactiva/generarSimulacionConvenio',
        data: { _token: $('meta[name="csrf-token"]').attr('content'),codigo_contrib:codigo_contrib,entrada_request:valor_entrada_global,          deuda_request:valor_deuda_global,cantidad_cuota_request:cantidad_cuota_global,nombre_cont_request:nombre_cont,valor_ini_request:valor_ini,valor_coact_request:valor_coact},
       
        success: function(data){ 
            console.log(data)
            vistacargando();
            if(data['error']==true){
                alertNotificar(data['mensaje'],'error');
                return;
            }
            if(data['error']==false){
                alertNotificar(data['mensaje'],'success');
                window.location.href='/gestionCoactiva/descargarDocSimulacion/'+data['pdf'];
              
            }
        },error: function(e){
            vistacargando("");
            alertNotificar('Ocurrió un error, intente nuevamente', "error");
            return;
        }
    });
    
    
    
}