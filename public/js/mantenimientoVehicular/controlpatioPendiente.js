$(document).ready(function () {
 
    listaTabla();
    $('#signArea').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:190});
    $('#signArea_edit').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:190});
    //estilos de tabla
   
});
 // funcion para limpiar una firma dibujada
function limpiarSingArea(){
    $('#signArea').signaturePad().clearCanvas();
}
function combustible_buscarVehiculo(input){
    // validamos para ocultar el contenido de busqueda cuando
    var busqueda = $(input).val();
    var conten_busqueda = $(input).siblings('.conten_busqueda');
    var div_content = $(conten_busqueda).children('.div_content');
    $(conten_busqueda).hide();
    //  $('#tbody_dato_salida').html('');
    //  $("#table_dato_salida").hide();
    //  $('#vehi').val('');
    //  $('#idvehiculog').val('');
    //  $('#infoKilometraje').hide();
    //  $('#msmDetalledos').html('');
    //  $('#msmDetalledos').hide();
    //  $('#infoHorometro').hide();
    //  $('.option_conductor').prop('selected',false); // deseleccionamos
    //  $("#conductormcodalapr").trigger("chosen:updated"); // actualizamos el combo 
    //  $('#vehiculosListaCombustible').empty(); // limpiamos la tabla
    $.get('/salvoConducto/buscar_vehiculo/'+busqueda, function (data){
        if(data.error==true){

        }
        else{
          $('#vehiculosListaCombustible').empty();
          $('#vehi').val('');
          $('#idvehiculog').val('');
         
          $.each(data.resultado, function(i, item){
           
            
            
            $(conten_busqueda).show();
            $('#vehiculosListaCombustible').append(
             
               `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
               border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarVehiculo('${item.codigo_institucion}','${item.placa}','${item.idmv_vehiculo}','${item.descripcion}','${item.codigo_institucion}')">` +
              '<i class="fa fa-car"></i>   ' + item.descripcion+"-"+item.codigo_institucion +` <strong>[ ${item.placa} ]</strong> `+'   <label style="float:right" ><i class="fa fa-closed-captioning"></i> ' + item.codigo_institucion + '</label>' +
              '</button>' +
              '<div class="dropdown-divider"></div>'
            );
        }); 
        } 
    });
} 
function capturarVehiculo(codigo,placa,idvehiculo,descripcion,ci){
    $('.conten_busqueda').hide();
    $('#idtarea').val('');
    $('#tarea').val('');
    $('#buscar').val(descripcion+" "+ci+" ["+placa+"]");
    $('#idvehiculog').val(idvehiculo);
    // cargartarea(idvehiculo);
    medicion(idvehiculo);
    chofer(idvehiculo);
}
function cargartarea(id){
    $('#tbody_dato_salida').html('');
    $('#tareasguard').html('');
    $.get("/controlIngresoPatio/cargartarea/"+id, function (data) {
        if(data.error == true){
                mostrarMensaje(data.mensaje,data.status,'mensaje_info');
        }else{
            if(data.lista_tramites.length===0){
                var tarea="no";
                $('#tareasguard').val(tarea); 
                $("#table_dato_salida").show(700);

                
                $('#tbody_dato_salida').append(
                    `<tr>
                        <td colspan="2"><center>Sin tareas que mostrar</center></td>
                        
                        
                        </tr>`);
            }else{
                var tarea="si";
                $('#tareasguard').val(tarea); 
            } 
            $("#table_dato_salida").show(700);
            $.each(data.lista_tramites, function(i,item){
                $('#tbody_dato_salida').append(
                        `<tr>
                            <td style="color:black">${i+1}</td>
                            <td style="color:black">${item.detalle_tarea}</td>
                        </tr>`);
                }); 
        }
    });
}
function medicion(id){
    $.get('/despachoCombustible/buscar_tipomedicion/'+id, function (data){
      $.each(data.resultado,function(i,item){
      if(item.detalle=="Kilometraje")
        {
          //alert(item.detalle);
        //   ultimokilometraje(id);
          $('#kilometraje').attr('readonly',false);
  
        }
      if(item.detalle=="Horómetro")
        {
        // ultimoHorometro(id);
        $('#horometro').attr('readonly',false); 
        // alert(item.detalle);         
        }
      })
  
      });
}
function ultimokilometraje(id){
    $.get("/controlIngresoPatio/ultimoKm/"+id, function (data) {
        if(data.error == true){
        mostrarMensaje(data.mensaje,data.status,'mensaje_info');
        }else{ 
            if(data.resultado==null){var resp=0;}else{var resp=data.resultado} 
            $('#msmDetalledos').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                            <div class="col-md-12 col-sm-6 col-xs-12"style="margin-bottom:12px">
                                <div class="alert alert-info alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                            <strong>Información: </strong> El valor del último kilometraje fué ${resp}
                                </div>
                            </div>
                            `);
            $('#msmDetalledos').show(200);
        }
    });
}
//consulto el ultimo Horometro  del vehiculo seleccionado
function ultimoHorometro(id){
    $.get("/controlIngresoPatio/ultimoKm/"+id, function (data) {
        if(data.error == true){
        mostrarMensaje(data.mensaje,data.status,'mensaje_info');
        }else{  
            $('#infoHorometro').html('');
            $('#infoHorometro').append(`<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
            <div style="background-color: blue;color: white;margin-bottom:0px;margin-left:10px
                ;margin-right:10px" class="alert  alert-dismissible fade in col-md-6" role="alert">
            <button type="button" style="color:white;margin-right:20px;margin-bottom:0px" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
            </button>
            <strong>Información: </strongEl último Horometro registrado fué ${data['resultado']}
            </div>`);
            $('#infoHorometro').show(200);
        }
    });
}
//selecciono el chofer q tiene asignado el custodio
function chofer(id){
    $.get("/salvoConducto/chofer/"+id, function (data) {
        if(data.conductor!=null){
            $('.option_conductor').prop('selected',false); 
            $(`#conductormcodalapr option[value="${data.conductor['idmv_tiporolpersona']}"]`).prop('selected',true);  
            $("#conductormcodalapr").trigger("chosen:updated"); 
        }
    });
}



$("#frm_ControlPendiente").submit(function(e){
    e.preventDefault();
    if($('#method_ControlIngreso_').val()=='POST'){
        $('#msmDetalledos').html('');
        $('#msmDetalledos').hide();
        vistacargando("M", "Espere...");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        var FrmData = new FormData(this);
        var iddetale = $("#iddetallef").val();
        var idtabla=1;
        html2canvas([document.getElementById('sign-pad')], {
            onrendered: function (canvas) {
                var canvas_img_data = canvas.toDataURL('image/png');
                var img_data = canvas_img_data.replace(/^data:image\/(png|jpg);base64,/, "");
                FrmData.append("b64_firma",img_data);
                $.ajax({
                    url: '/controlIngresoPatio/storePendiente',
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    complete: function(request){                    
                        requestData = request.responseJSON; // obtenemos el json que se retorna
                        $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12"style="margin-bottom:12px">
                                    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> ${requestData.mensaje}
                                    </div>
                                </div>
                        `);
                        $('#msmDetalledos').show(200);
                        vistacargando();
                        if(requestData['error']==true){
                            alertNotificar(requestData['mensaje'],'error');
                        }else{
                            listaTabla(); // actualizamos la imagen de la firma editada
                            limpiarSingArea();
                            limpiarcampos();
                            $("#preview_firma").hide();
                        }
                    }
                }).fail(function(){            
                    $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12"style="margin-bottom:12px">
                                    <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> Error al enviar la información
                                    </div>
                                </div>
                        `);
                    $('#msmDetalledos').show(200);
                    vistacargando();
                });
            }
        }); 
    
    }else{
        vistacargando("M", "Espere...");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        var FrmData = new FormData(this);
        var idcontrol = $("#idcontrol").val();
        var idtabla=1;
        html2canvas([document.getElementById('sign-pad')], {
            onrendered: function (canvas) {
                var canvas_img_data = canvas.toDataURL('image/png');
                var img_data = canvas_img_data.replace(/^data:image\/(png|jpg);base64,/, "");
                FrmData.append("b64_firma",img_data);
                $.ajax({
                    url: '/controlIngresoPatio/registro/'+idcontrol,
                    method: 'PUT',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    complete: function(request){                    
                        requestData = request.responseJSON; // obtenemos el json que se retorna
                        console.log(requestData);
                        $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12"style="margin-bottom:12px">
                                    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> ${requestData.mensaje}
                                    </div>
                                </div>
                        `);
                        
                        if(!requestData.error){
                            listaTabla(); // actualizamos la imagen de la firma editada
                            limpiarSingArea();
                            $("#preview_firma").hide();
                            
                        }
                    }
                }).fail(function(){            
                    $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12"style="margin-bottom:12px">
                                    <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> Error al enviar la información
                                    </div>
                                </div>
                        `);

                 
                });
            }
        }); 
    
    }
});

function listaTabla(){
    $.get("/controlIngresoPatio/lista", function (data) {
        $('#bodytable').html('');
        var idtabla = "datatable";
        $(`#${idtabla}`).DataTable({
                dom: ""
            +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            "order": [[ 1, "desc" ]],
            pageLength: 10,
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
                
            data: data.resultado,
                
            columns:[
                    {data: "fecha_registro" },
                    {data: "fecha_registro" },
                    {data: "fecha_registro" },
                    {data: "fecha_registro" },
                    {data: "fecha_registro" },
            ],
            "rowCallback": function( row, data, index ){
                if(data.entrada_salida=='Salida'){
                    $('td', row).eq(1).html(data.fecha_hora_salida);
                }else{
                    $('td', row).eq(1).html(data.fecha_hora_entradaa);
                }
                $('td', row).eq(4).html(`
                            <button type="button" onclick="eliminarControl('${data.idmv_control_ingreso_patio}')" class="btn btn-sm btn-danger marginB0 " data-toggle="tooltip" data-original-title="Eliminar" ><i class="fa fa-trash"></i></button>
                `);
                $('td', row).eq(4).css('text-align','center');
                $('td', row).eq(4).css('vertical-align','middle');
                $('td',row).eq(0).html(data.vehiculo.descripcion+" "+data.vehiculo.codigo_institucion+" ["+data.vehiculo.placa+"]"); 
                if(data.entrada_salida=='Entrada'){
                    var estad="Entrada";
                    $('td',row).eq(2).html(estad); 
                }else{
                    var estad="Salida";
                    $('td',row).eq(2).html(estad); 
                } 
                if(data.firmaconductor==null){
                    $('td',row).eq(3).html(' <center><span"> Sin Firmar &nbsp; &nbsp;&nbsp;</span></center>'); 
                }else{
                    $('td',row).eq(3).html(` <center><img src='data:image/png;base64,${data.firmaconductor}') class="img_firma2"></center>`);
                } 
            } 
        }); 
        vistacargando();
    });
}

function limpiarcampos(){

    $('#tarea').val('');
    $('#idtarea').val('');
    $('#observaciones').val('');
    $('#observacionesreg').val('');
    $('#finicio').val('');
    $('#fsalida').val('');
    $('#vehi').val('');
    $('#idvehiculog').val('');
    $('#buscar').val('');
    $('#hinicio').val('');
    $('#hsalida').val('');
    $('#kilometraje').attr('readonly','readonly');
    $('#kilometraje').val('');
    $('#horometro').attr('readonly','readonly');
    $('#horometro').val(''); 
    $('.option_conductor').prop('selected',false); 
    $("#conductormcodalapr").trigger("chosen:updated"); 
    $('#infoKilometraje').hide();
    $('#infoHorometro').hide();
 
    $('#tbody_dato_salida').html('');
    $("#table_dato_salida").hide();
    $("#fecha").val('')
  }

  $('#conductormcodalapr').on('change', function() {
    //compruebo si el input que tiene el valor del idvehiculo esta vacio
    if($('#idvehiculog').val()==""){
      $('#buscar').val('');
      $('#buscar').focus();
      $('.option_conductor').prop('selected',false); // deseleccionamos
      $("#conductormcodalapr").trigger("chosen:updated"); // actualizamos el combo 
      $('#msmDetalledos').html('');
      $('#msmDetalledos').append(`
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                 <div class="col-md-12 col-sm-6 col-xs-12" style="margin-bottom:12px">
                     <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                           <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <strong>Información: </strong> El Vehículo ingresado no existe
                       </div>
                    </div>
      `);
  
      $('#msmDetalledos').show(200);
    }
  })
  
$('#check_entradaveh').on('ifChecked', function(event){
    $('#check_salidaveh').iCheck('uncheck');
});
$('#check_entradaveh').on('ifUnchecked', function(event){
    $('#check_salidaveh').iCheck('check');
});
$('#check_salidaveh').on('ifChecked', function(event){
    $('#check_entradaveh').iCheck('uncheck');
});
$('#check_salidaveh').on('ifUnchecked', function(event){
    $('#check_entradaveh').iCheck('check');
})

function btn_eliminarcontrol(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

function eliminarControl(id){
    swal({
        title: "",
        text: "¿Está seguro que desea eliminar?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if(isConfirm){ // si dice que quiere eliminar
            vistacargando("M",'Por favor espere.....');
            $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });

            $.ajax({
                type: "DELETE",
                url: '/controlIngresoPatio/registro/'+id,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){ 
                    alertNotificar(data['mensaje'],data['estadoP']);
                    listaTabla()
                    vistacargando();

                }
            }); 
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}

function control_editar(id){
    limpiarcampos();
    $.get("/controlIngresoPatio/registro/"+id+"/edit", function (data) {
  
    console.log(data);
  
    if(data.resultado.idmv_tareas_vehiculos==null){
      var idtareav="";
      var detalletarea="";
    }
    else{
      var idtareav=data.resultado.idmv_tareas_vehiculos
      var detalletarea=data.resultado.tarea.detalle_tarea
    }
    if(data.resultado.entrada_salida=='Salida'){
       $('#check_salidaveh').iCheck('check');
    }
    else{
       $('#check_entradaveh').iCheck('check');
    }
   /// cargo los datos en la seccion correspondiente (seccion vehiculo)      
    $('#tarea').val(detalletarea);
    $('#idtarea').val(idtareav);
   // $('#vehi').val(data.resultado.vehiculo.marca.detalle+"-"+data.resultado.vehiculo.modelo+"["+data.resultado.vehiculo.placa+"]");
    $('#finicio').val(data.resultado.fecha_ingreso);
    $('#fsalida').val(data.resultado.fecha_salida);
    $('#idcontrol').val(data.resultado.idmv_control_ingreso_patio);
    
    //$('#vehi').val(data.resultado.vehiculo.marca.detalle+"-"+data.resultado.vehiculo.modelo+"["+data.resultado.vehiculo.placa+"]");
    $('#buscar').val(data.resultado.vehiculo.marca.detalle+"-"+data.resultado.vehiculo.modelo+"["+data.resultado.vehiculo.placa+"]");
    $('#idvehiculog').val(data.resultado.idmv_vehiculo);
    //$('#buscar').val(data.resultado.vehiculo.codigo_institucion);
    $('#hinicio').val(data.resultado.hora_entrada);
    $('#hsalida').val(data.resultado.hora_salida);
    $('#observacionesreg').val(data.resultado.observaciones);
  
    if(data.resultado.kilometraje!=null){
          //alert(item.detalle);
          $('#kilometraje').attr('readonly',false);
          $('#kilometraje').val(data.resultado.kilometraje);
  
    }
   if(data.resultado.horometro!=null){
       $('#horometro').attr('readonly',false); 
       $('#horometro').val(data.resultado.horometro);
        // alert(item.detalle);         
  }
    
    cargartarea(data.resultado.idmv_vehiculo);
  
    $('#method_ControlIngreso').val('PUT'); 
    //$('#frm_ControlIngreso').prop('action',window.location.protocol+'//'+window.location.host+'/controlIngresoPatio/registro/'+id);
    $('#btn_control_cancelar').removeClass('hidden');
  
      $('html,body').animate({scrollTop:$('#administradorControl').offset().top},400);
  });
  
  
  }

