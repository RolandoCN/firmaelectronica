function generarReporte(){
  vistacargando('M','Por favor espere...');
  $('#frm_Reporte_').submit();
}
function registrarTarea(){
  vistacargando('M','Por favor espere...');
  $('#frm_TareasVehiculo').submit();
}

function aprobacionTarea(){
  $('#frm_Aprobacion').prop('action','/tareasVehiculos/aprobar');
  $('#modaldatosapr').addClass('disabled_content');
  swal({
    title: "",
    text: "¿Está seguro que desea aprobar la tarea?",
    type: "warning",
    showCancelButton: true,
    confirmButtonClass: "btn-info",
    cancelButtonClass: "btn-danger",
    confirmButtonText: "Si, Continuar",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: false,
    closeOnCancel: false
  },
  function(isConfirm) {
      if (isConfirm) { // si dice que quiere eliminar
        vistacargando('M','Por favor espere....');
        $('#frm_Aprobacion').submit();
      }
      sweetAlert.close();   // ocultamos la ventana de pregunta
       $('#frm_Aprobacion').attr('action','');
       $('#modaldatosapr').removeClass('disabled_content');
  }); 
}

function reprobacionTarea(){
   $('#frm_Aprobacion').attr('action','/tareasVehiculos/reprobar');
  $('#modaldatosapr').addClass('disabled_content');

    swal({
      title: "",
      text: "¿Está seguro que desea reprobar la tarea?",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn-info",
      cancelButtonClass: "btn-danger",
      confirmButtonText: "Si, Continuar",
      cancelButtonText: "No, Cancelar",
      closeOnConfirm: false,
      closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que quiere eliminar
          vistacargando('M','Por favor espere....');
          $('#frm_Aprobacion').submit();
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
        $('#frm_Aprobacion').attr('action','');
        $('#modaldatosapr').removeClass('disabled_content');

    }); 
}




function verdetalle(id){
  vistacargando('M','Por favor espere...');
  $.get("/tareasVehiculos/registro/"+id, function (data) {
  // $('#datos').hide(300);
  // $('#detalle').show(300);
  $('#DetalleTramite').modal("show");
  vistacargando();

 // cargo los datos en la seccion correspondiente (seccion vehiculo)      
  $('#codigo').html(data.resultado.vehiculo.descripcion+" "+data.resultado.vehiculo.codigo_institucion);
  $('#placa').html(data.resultado.vehiculo.placa);
  $('#marca').html(data.resultado.vehiculo.marca.detalle);
  $('#modelo').html(data.resultado.vehiculo.modelo);
  $('#uso').html(data.resultado.vehiculo.tipouso.detalle);

  


// cargo los datos en la seccion correspondiente (seccion salvoconducto)      
  $('#detalle').html(data.resultado.detalle_tarea);
  $('#fechasolicitud').html(data.resultado.fecharegistro);
  $('#fechasalida').html(data.resultado.fecha_inicio);
  $('#fecharetorno').html(data.resultado.fecha_fin);
  $('#codigo').html(data.resultado.codigo_institucion);
  
  if(data.resultado.idusuarioaprueba==null)
    {
     var usuarioaprueba=""; 
    }
  else
    {
      var usuarioaprueba=data.resultado.usuarioaprueba.name;
    }  
  $('#usuarioaprobo').html(usuarioaprueba);
  $('#estado').html(data.resultado.estado);
  if(data.resultado.idusuarioaprueba==null)
    {
     var fechaaprobacion=""; 
    }
  else
    {
      var fechaaprobacion=data.resultado.fechaaprobacion;
    }
  $('#fechaaprobacion').html(fechaaprobacion);


  if(data.resultado.estado=="Aprobado")
    {
       //$("#imprimir").attr("disabled", true);
    $("#apr").hide();    
    $("#rep").show();
    $('#fechaform').show();
    $('#aproform').show();

    $("#reaprobar").attr("href", '/tareasVehiculos/reprobar/'+data.resultado.idmv_tareas_vehiculos);

    $('a[href]#reaprobar').each(function () {
      var href = this.href;
        $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
        if (href.toLowerCase().indexOf("#") >= 0) {
        } else {
        // window.open(href);
        $(location).attr('href','/tareasVehiculos/reprobar/'+data.resultado.idmv_tareas_vehiculos);
        }
        });
     });
    }

  if(data.resultado.estado=="Reprobado")
    {
       //$("#imprimir").attr("disabled", true);
    $("#apr").show();    
    $("#rep").hide();
    $('#fechaform').hide();
    $('#aproform').hide();

    $("#aprobar").attr("href", '/tareasVehiculos/aprobar/'+data.resultado.idmv_tareas_vehiculos);
    $('a[href]#aprobar').each(function () {
    var href = this.href;
      $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
      if (href.toLowerCase().indexOf("#") >= 0) {
      } else {
      // window.open(href);
      $(location).attr('href','/tareasVehiculos/aprobar/'+data.resultado.idmv_tareas_vehiculos);
      }
      });
   });

    }


  if(data.resultado.estado=="Pendiente")
  {
  $("#apr").show();
  $("#rep").hide();
  $('#fechaform').hide();
  $('#aproform').hide();
  



  $("#aprobar").attr("href", '/tareasVehiculos/aprobar/'+data.resultado.idmv_tareas_vehiculos);

  $('a[href]#aprobar').each(function () {
    var href = this.href;
      $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
      if (href.toLowerCase().indexOf("#") >= 0) {
      } else {
      // window.open(href);
      $(location).attr('href','/tareasVehiculos/aprobar/'+data.resultado.idmv_tareas_vehiculos);
      }
      });
   });




  }
  
});
}



function verdetalleapr(id){
  vistacargando('M','Por favor espere...');
  $('#observacionTarea').val('');
  $.get("/tareasVehiculos/registro/"+id, function (data) {
  vistacargando();
  $('#modaldatosapr').modal("show");
  $('#repm').show();
  $('#textoaprobado').html('');
 // cargo los datos en la seccion correspondiente (seccion vehiculo)      
  // $('#codigo').html(data.resultado.vehiculo.codigo_institucion);
  // $('#placa').html(data.resultado.vehiculo.placa);
  // $('#marca').html(data.resultado.vehiculo.marca.detalle);
  // $('#modelo').html(data.resultado.vehiculo.modelo);
  // $('#uso').html(data.resultado.vehiculo.tipouso.detalle);

  $('#cmb_vehiculomodal').val(data.resultado.vehiculo.descripcion+" "+data.resultado.vehiculo.codigo_institucion
    +" ["+data.resultado.vehiculo.placa+"]");
  $('#detallemodal').val(data.resultado.detalle_tarea);
  $('#fechasolicmodal').val(data.resultado.fecharegistro);
  $('#fsalidamodal').val(data.resultado.fecha_inicio);
  $('#fretornomodal').val(data.resultado.fecha_fin);
  $('#idtareav').val(data.resultado.idmv_tareas_vehiculos);
  if(data['resultado']['idchofer']){
    $('#choferAprobacion').val(data['resultado']['choferes']['usuario']['name']);
  }else{
     $('#choferAprobacion').val('');
  }
  if(data['resultado']['salvoconducto']!=null){

    $('#div_salvoconducto').show(200);

    $('#provinciadetalle').val(data['resultado']['salvoconducto']['provincia']['descripcion']);
    $('#cantondetalle').val(data['resultado']['salvoconducto']['canton']['detalleCanton']);
    $('#parroquiadetalle').val(data['resultado']['salvoconducto']['parroquia']['descripcion']);
    $('#direcciondetalle').val(data['resultado']['salvoconducto']['direccion']);

  }else{
    $('#div_salvoconducto').hide(200);

  }
  


// cargo los datos en la seccion correspondiente (seccion salvoconducto)      
  // $('#detalle').html(data.resultado.detalle_tarea);
  // $('#fechasolicitud').html(data.resultado.fecharegistro);
  // $('#fechasalida').html(data.resultado.fecha_inicio);
  // $('#fecharetorno').html(data.resultado.fecha_fin);
  // $('#codigo').html(data.resultado.codigo_institucion);
  
  if(data.resultado.idusuarioaprueba==null)
    {
     var usuarioaprueba=""; 
    }
  else
    {
      var usuarioaprueba=data.resultado.usuarioaprueba.name;
    }  
  $('#usarioaprobomodal').val(usuarioaprueba);
  $('#estado').html(data.resultado.estado);
  if(data.resultado.idusuarioaprueba==null)
    {
     var fechaaprobacion=""; 
    }
  else
    {
      var fechaaprobacion=data.resultado.fechaaprobacion;
    }
  $('#fechaaprobacionmodal').val(fechaaprobacion);


  if(data.resultado.estado=="Aprobado")
    {
    $("#conductormcodalapr").attr("disabled", true);
    $("#aprm").hide();    
    $("#repm").show();
    $('#fechaaproform').show();
    $('#usaurioaprform').show();
    $('#observacionTareadiv').show();

    $('.option_conductor').prop('selected',false); 
    $(`#conductormcodalapr option[value="${data.resultado['idchofer']}"]`).prop('selected',true);  
    $("#conductormcodalapr").trigger("chosen:updated"); 

    $('#method_Apr_').val('POST'); 
    // $('#frm_Aprobacion').prop('action','/tareasVehiculos/reprobar/'+data.resultado.idmv_tareas_vehiculos);

    // $("#reaprobarm").attr("href", '/tareasVehiculos/reprobar/'+data.resultado.idmv_tareas_vehiculos);
    if(data['resultado']['salvoconducto']['idmv_salvoconducto']!=null){
      if(data['resultado']['salvoconducto']['estado']=='Aprobado'){
        $('#repm').hide();
        $('#textoaprobado').html(`<b>El salvoconducto ya se encuentra aprobado</b>`);
        $('#observacionTareadiv').hide();
      }
    }
    // $('a[href]#reaprobarm').each(function () {
    //   var href = this.href;
    //     $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
    //     if (href.toLowerCase().indexOf("#") >= 0) {
    //     } else {
    //     // window.open(href);
    //     $(location).attr('href','/tareasVehiculos/reprobar/'+data.resultado.idmv_tareas_vehiculos);
    //     }
    //     });
    // });
    
  }

  if(data.resultado.estado=="Reprobado")
  {
  $("#conductormcodalapr").attr("disabled", false);
  $("#aprm").show();
  $("#repm").hide();
  $('#fechaaproform').hide();
  $('#usaurioaprform').hide();
  $('#observacionTareadiv').show();
  $('#method_Apr_').val('POST'); 
  // $('#frm_Aprobacion').prop('action','/tareasVehiculos/aprobar/');
  
  // var idvehic=data.resultado.idmv_vehiculo;
  // $.get("/salvoConducto/chofer/"+idvehic, function (data) {
  // vistacargando();

  // if(data.conductor!=null){
  //   console.log(data);
  //   $('.option_conductor').prop('selected',false); 
  //   $(`#conductormcodalapr option[value="${data.conductor['idmv_tiporolpersona']}"]`).prop('selected',true);  
  //   $("#conductormcodalapr").trigger("chosen:updated"); 
  // }

  // });      
  }


  if(data.resultado.estado=="Pendiente")
  {
  $("#conductormcodalapr").attr("disabled", false);
  $("#aprm").show();
  $("#repm").show();
  $('#fechaaproform').hide();
  $('#usaurioaprform').hide();
  $('#observacionTareadiv').show();
  $('#method_Apr_').val('POST'); 
 
  // var idvehic=data.resultado.idmv_vehiculo;
  // $.get("/salvoConducto/chofer/"+idvehic, function (data) {
  // vistacargando();
  // console.log(data);
  // if(data.conductor!=null){
  //   console.log(data);
  //   $('.option_conductor').prop('selected',false); 
  //   $(`#conductormcodalapr option[value="${data.conductor['idmv_tiporolpersona']}"]`).prop('selected',true);  
  //   $("#conductormcodalapr").trigger("chosen:updated"); 
  // }

  //  });



  // $("#aprobar").attr("href", '/tareasVehiculos/aprobar/'+data.resultado.idmv_tareas_vehiculos);

  // $('a[href]#aprobar').each(function () {
  //   var href = this.href;
  //     $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
  //     if (href.toLowerCase().indexOf("#") >= 0) {
  //     } else {
  //     // window.open(href);
  //     $(location).attr('href','/tareasVehiculos/aprobar/'+data.resultado.idmv_tareas_vehiculos);
  //     }
  //     });
  //  });




  }
  
});
}

$('#check_salvoconducto').on('ifChecked', function(event){
  $('#contenido_salvoconducto').show(200); 
  return;

});

$('#check_salvoconducto').on('ifUnchecked', function(event){
  $('.optionprov').prop('selected',false); 
  $(`#provincia option[value=""]`).prop('selected',true);  
  $("#provincia").trigger("chosen:updated");

  $('optioncant').prop('selected',false); 
  $("#canton").prop("disabled",true);
  $(`#canton option[value=""]`).prop('selected',true);  
  $("#canton").trigger("chosen:updated");

  $('.optionparroquia').prop('selected',false); 
  $("#parroquia").prop("disabled",true);
  $(`#parroquia option[value=""]`).prop('selected',true);  
  $("#parroquia").trigger("chosen:updated");
  $('#direccion').val('');
  $('#contenido_salvoconducto').hide(200); 

});

$("#provincia").change(function() {
  cargarCantones($('#provincia').val(),'canton','parroquia');
});

$("#canton").change(function() {

  cargarParroquias($('#canton').val(),'parroquia');

});

function cargarCantones(valor,idelement,elementparroquia)
{
  // $('#ciudad').html('Cargando...');
  
  $.get('/salvoConducto/getCantones/'+valor, function (data) { //se consume el servicio para esto se agrego en el de los servicios un header 
    
    $('#'+idelement).html('');
    
    if(data.status){
      
      data.datos.forEach(element => {
        
      if(element.detalleCanton=='CHONE' || element.detalleCanton=='Chone' || element.detalleCanton=='chone'){
        $('#'+idelement).append(`<option selected="true" value="${element.idcanton}">${element.detalleCanton}</option>`);
      }else{
        $('#'+idelement).append(`<option class="ctn" value="${element.idcanton}">${element.detalleCanton}</option>`);
      } 
        $("#"+idelement).prop("disabled",false); 
        $("#"+idelement).trigger("chosen:updated"); 
      });
      cargarParroquias($('#'+idelement).val(),elementparroquia);
    }
  });
}

function cargarParroquias(valor,idelement)
{
 
  $.get('/salvoConducto/getParroquias/'+valor, function (data) { 
    $('#'+idelement).html('');
    console.log(data);
    if(data.status){
      data.datos.forEach(element => {
      $('#'+idelement).append(`<option  value=""></option>`);
      if(element.descripcion=='CHONE' || element.descripcion=='Chone' || element.descripcion=='chone'){
        $('.option'+idelement).append(`<option selected="true" value="${element.idparroquia}">${element.descripcion}</option>`);
        
      }else{
        $('.option'+idelement).append(`<option class="ctn" value="${element.idparroquia}">${element.descripcion}</option>`);
      } 
        $("#"+idelement).prop("disabled",false); 
        $("#"+idelement).trigger("chosen:updated"); 
      });
    }
  });
}


function tarea_editar(id){
  vistacargando('M','Por favor espere....');
  $.get("/tareasVehiculos/registro/"+id+"/edit", function (data) {

  vistacargando();
  console.log(data);

 /// verifico si tiene salvoconducto
  if(data['resultado']['idmv_salvoconducto']!=null){

    $("#check_salvoconducto").iCheck('check');
      //cargo la provincia
    $('.optionprov').prop('selected',false); 
    $(`#provincia option[value="${data.resultado['salvoconducto']['provincia']['idprovincia']}"]`).prop('selected',true);  
    $("#provincia").trigger("chosen:updated");

      //cargar canton
    $('.optioncant').prop('selected',true); 
    $('#canton').prop('disabled',false); 
    $(`#canton option[value="${data.resultado['salvoconducto']['canton']['idcanton']}"]`).prop('selected',true);  
    $("#canton").trigger("chosen:updated");
    $('#horasalida').val(data.resultado['salvoconducto']['hora_salida']);
    $('#horaretorno').val(data.resultado['salvoconducto']['hora_ingreso_llegada']);
    //cargar parroquias
    cargarParroquias($('#canton').val(),'parroquia');
    setTimeout(function() {
      $('.optionparroquia').prop('selected',false); 
      $(`#parroquia option[value="${data.resultado['salvoconducto']['parroquia']['idparroquia']}"]`).prop('selected',true);  
      $("#parroquia").trigger("chosen:updated");
    },  2000);
    $('#direccion').val(data.resultado['salvoconducto']['direccion']);
    $('#contenido_salvoconducto').show(200);
  }else{

    $("#check_salvoconducto").iCheck('uncheck');
    $('#contenido_salvoconducto').hide(200);

  }
  $('#detallereg').val(data.resultado.detalle_tarea);
  $('#observacionesreg').val(data.resultado.observaciones);
  $('#fsolicitudedit').val(data.resultado.fechasolicitud);
  $('#fsalidaedit').val(data.resultado.fecha_inicio);
  $('#fretorno').val(data.resultado.fecha_fin);

  $('#buscar').val(data.resultado.vehiculo.descripcion+"-"+data.resultado.vehiculo.codigo_institucion+"["+data.resultado.vehiculo.placa+"]");
//  $('#vehi').val(data.resultado.vehiculo.marca.detalle+"-"+data.resultado.vehiculo.modelo+"["+data.resultado.vehiculo.placa+"]");
  //$('#buscar').val(data.resultado.vehiculo.codigo_institucion);

 
  $('.option_choferSalvo').prop('selected',false); 
  if(data['resultado']['idchofer']!=null){
    $(`#choferSalvo option[value="${data['resultado']['choferes']['idmv_tiporolpersona']}"]`).prop('selected',true);  
    $("#choferSalvo").trigger("chosen:updated"); 
  }

  $('.optionVehiculo').prop('selected',false); 
  $(`#vehiculo_tarea option[value="${data.resultado.idmv_vehiculo}"]`).prop('selected',true);  
  $("#vehiculo_tarea").trigger("chosen:updated"); 

  $('.optionpers').prop('selected',false); 
  $(`#cmb_persona option[value="${data.resultado['idusuariosolicita']}"]`).prop('selected',true);  
  $("#cmb_persona").trigger("chosen:updated"); 

  $('#method_TareasVehiculos').val('PUT'); 
  $('#frm_TareasVehiculo').prop('action',window.location.protocol+'//'+window.location.host+'/tareasVehiculos/registro/'+id);
  $('#btn_salvocond_cancelar').removeClass('hidden');
  

    $('html,body').animate({scrollTop:$('#administradorSalvo').offset().top},400);
});


}


$('#btn_salvocond_cancelar').click(function(){
    $("#check_salvoconducto").iCheck('uncheck');
    $('#contenido_salvoconducto').hide(200);

    $('.optionprov').prop('selected',false); 
    $(`#provincia option[value=""]`).prop('selected',true);  
    $("#provincia").trigger("chosen:updated");

    $('.optioncant').prop('selected',false); 
    $("#canton").prop("disabled",true);
    $(`#canton option[value=""]`).prop('selected',true);  
    $("#canton").trigger("chosen:updated");

    $('.optionparroquia').prop('selected',false); 
    $("#parroquia").prop("disabled",true);
    $(`#parroquia option[value=""]`).prop('selected',true);  
    $("#parroquia").trigger("chosen:updated");
    $('#direccion').val('');

    $('#detallereg').val('');
    $('#observacionesreg').val('');
    $('#fsolicitudedit').val('');
    $('#fsalidaedit').val('');
    $('#vehi').val('');
    $('#idvehiculog').val('');
    $('#buscar').val('');
    $('#fretorno').val('');
    $('#horasalidaedit').val('');
    $('.optionveh').prop('selected',false); 
    $("#cmb_vehiculo").trigger("chosen:updated"); 
    $('.optionpers').prop('selected',false); 
    $("#cmb_persona").trigger("chosen:updated"); 
    $('#method_TareasVehiculos').val('POST'); 
    $('#frm_TareasVehiculo').prop('action',window.location.protocol+'//'+window.location.host+'/tareasVehiculos/registro/');
    $(this).addClass('hidden');
});

function btn_eliminartarea(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}




function salirDetalle(){
  $('#detalle').hide(300);
  $('#datos').show(300);

 }

  function combustible_buscarVehiculo(input){
    // validamos para ocultar el contenido de busqueda cuando
    var busqueda = $(input).val();
    var conten_busqueda = $(input).siblings('.conten_busqueda');
    var div_content = $(conten_busqueda).children('.div_content');
    $(conten_busqueda).hide();
    $('#vehi').val('');
    $('#idvehiculog').val('');
    $('#fsalidaedit').val('');
    $('#fretorno').val('');
    $('#detallereg').val('');
    $('#vehiculosListaCombustible').empty(); // limpiamos la tabla
    //$('detallevehiculo').addClass('hidden');
    $.get('/salvoConducto/buscar_vehiculo_dep/'+busqueda, function (data){
        console.clear(); console.log(data);
          $('#vehiculosListaCombustible').empty();
          $('#vehi').val('');
          $('#idvehiculog').val('');
         
          $.each(data.resultado, function(i, item){
            console.log(item);
            
            
            $(conten_busqueda).show();
            $('#vehiculosListaCombustible').append(
             
               `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
               border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarVehiculo('${item.codigo_institucion}','${item.placa}','${item.idmv_vehiculo}','${item.descripcion}','${item.codigo_institucion}')">` +
              '<i class="fa fa-car"></i>   ' + item.descripcion+"-"+item.codigo_institucion +` <strong>[ ${item.placa} ]</strong> `+'   <label style="float:right" ><i class="fa fa-closed-captioning"></i> ' + item.codigo_institucion + '</label>' +
              '</button>' +
              '<div class="dropdown-divider"></div>'
            );
        });  
    });
} 

function capturarVehiculo(codigo,placa,idvehiculo,descripcion,ci){
    //alert("DSd");
    $('.conten_busqueda').hide();
    //$('#buscar').val('');
    //$('detallevehiculo').removeClass('hidden');
    $('#buscar').val(descripcion+" "+ci+" ["+placa+"]");
    $('#idvehiculog').val(idvehiculo);
}



 
  // FUNCION PARA SELECCIONAR UN ARCHVO --------------

    $(".seleccionar_archivo").click(function(e){
        $(this).parent().siblings('input').val($(this).parent().prop('title'));
        this.value = null; // limpiamos el archivo
    });

    $(".seleccionar_archivo").change(function(e){

        if(this.files.length>0){ // si se selecciona un archivo

            //verificamos si es un archivo p12
            if(this.files[0].type != "application/x-pkcs12"){
                alertNotificar("El archivo del certificado debe ser formato .p12", "default");
                this.value = null;
                return;
            }            

            archivo=(this.files[0].name);
            $(this).parent().siblings('input').val(archivo);
        }else{
            return;
        }

    });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////



  //function para llenar la tabla

    function actualizar_tabla_tarea(){
      var id=1;
      $.get("/tareasVehiculos/tablainforme/"+id, function (data) {
        console.log(data);

            var idtabla = "tablainforme";
                    $(`#${idtabla}`).DataTable({
                       dom: ""
                    +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
                    +"<rt>"
                    +"<'row'<'form-inline'"
                    +" <'col-sm-6 col-md-6 col-lg-6'l>"
                    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                    "destroy":true,
                     "order": [[ 0, "desc" ]],
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

                        columnDefs: [
                            {  width:"15%", targets: 0 },
                            {  width:"45%", targets: 1 },
                            {  width:"20%", targets: 2 },
                            {  width:"10%", targets: 3 },
                           
                        ],
                       
                        columns:[
                            {data: "fecha_creacion" },
                            {data: "fecha_creacion" },
                            {data: "hora_creacion" },
                            {data: "hora_creacion" },
                            
                            
                        ],
                        "rowCallback": function( row, data, index ){

                         //$('td', row).eq(0).html(data.fecha_creacion+" "+data.hora_creacion);

                         
                          if(data.descripcion=='Tareas'){
                          $('td', row).eq(1).html('Informe de Tareas desde ' + data.fecha_inicial+ ' hasta ' + data.fecha_final);
                         }

                        

                         var estado=""
                         if(data.aprobacion_funcionario!=1){
                          estado = (`<label for="ckeckpinf_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                                         <input id="ckeckpinf${data.idmv_informes}" type="checkbox" class="flat check_documento" value="${data.idmv_informes}">
                                                         <span style="padding-top: 5px;"> Seleccionar</span>
                                     </label>
                                  `);
                         }
                         else{
                          estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Completado</span>

                            `);

                         }
                          $('td', row).eq(2).html(estado); 

                          
                          $('td', row).eq(3).html(`<button type="button" onclick="verpdf('${data.ruta}','${data.idmv_informes}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button></a>`);
                          

                        
                            
                  
                    }
                  });
                  $('input').iCheck({
                  checkboxClass: 'icheckbox_flat-green'
                });
                });  

    }

    //visualizar archivo  
    function verpdf(ruta,codigo){
         var iframe=$('#iframePdf');
         // iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "/tareasVehiculos/visualizardoc/"+ruta);   
         $("#vinculo").attr("href", '/tareasVehiculos/'+codigo+'/descargar');
         $("#documentopdf").modal("show");
     }

    $('#documentopdf').on('hidden.bs.modal', function (e) {
          
         var iframe=$('#iframePdf');
         iframe.attr("src", null);

    });

    $('#descargar').click(function(){
         $('#documentopdf').modal("hide");
    });

   // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#tablainforme').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#tablainforme').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });

/////////////////////////////////////////////////////////////////////////////////////////////////

function EliminarInforme(){

  //verficamos si hay documentos seleccionados
            var informeaux = $("#lista").find(".check_documento:checked");
            if(informeaux.length==0){
                    alertNotificar("Primero seleccione un informe", "default"); return;
            }
            //mostramos la modal de la firma electrónica
            console.log('eliminar');
            $("#eliminar_inf").modal("show");

            var informeaux_aux = $("#lista").find(".check_documento:checked");
              if(informeaux_aux.length==0){
                 alertNotificar("Primero seleccione un informe", "default"); return;
              }

            $("#inf_selec").html(""); //quitamos los antiguos
            $.each(informeaux_aux, function(index, periodo){
              console.log(periodo);
            $("#inf_selec").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
            })

            var tipo="tareas";
            $('#tipo').html('');
            $('#tipo').val(tipo);


}

//////////////////////////////////////////////////////////////////////////////////////////////////

 function AprobacionTareas(){
            
            $("#btn_modal_cerrar").attr("disabled", false);

            
            //verficamos si hay documentos seleccionados
            var informeaux = $("#lista").find(".check_documento:checked");
            if(informeaux.length==0){
                    alertNotificar("Primero seleccione un informe", "default"); return;
            }

            vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
            $.get("/tareasVehiculos/verificarConfigFirmado/", function(retorno){
                console.log(retorno);
                
                vistacargando();
                $("#informacion_certificado_tar").html("");

                if(!retorno.error){ // si no hay error

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar_tarea").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar_tarea").html("¿Está seguro que desea generar y firmar el documento?");
                    }

                    // verificiamos la vigencia del certificado
                    vertificado_vigente = false;
                    if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
                        vertificado_vigente = true;
                    }

                    // cargamos el input para subir el certificado
                    if(config_firma.archivo_certificado==true && vertificado_vigente==true){
                        $("#content_archivo_certificado_tarea").hide();
                    }else{
                        $("#content_archivo_certificado_tarea").show();
                    }

                    // cargamos el input para la contraseña
                    if(config_firma.clave_certificado==true && vertificado_vigente==true){
                        $("#content_clave_certificad_tarea").hide();                        
                    }else{
                        $("#content_clave_certificad_tarea").show();
                    }



                    //cargamos la informacion del certificado
                        if(config_firma.archivo_certificado==true){
                            color_mensaje_certificado = "icon_success";
                            mensaje_certificado = "Certificado vigente";
                            icono_mensaje_certificado = "fa fa-check-square";
                            if(config_firma.archivo_certificado==true && config_firma.dias_valido<=0){
                                color_mensaje_certificado = "icon_danger";
                                mensaje_certificado = "Certificado expirado";
                                icono_mensaje_certificado = "fa fa-times-circle";
                            }else if(config_firma.archivo_certificado==true && config_firma.dias_valido <= config_firma.dias_notific_expira){
                                color_mensaje_certificado = "icon_warning";
                                mensaje_certificado = "Certificado casi expirado";
                                icono_mensaje_certificado = "fa fa-warning";
                            }   
                            
                            $("#informacion_certificado_tar").html(`
                                <div id="infoDepFlujGen_1" class="form-group infoDepFlujGen content_info_certificado" style="margin-bottom: 0px; margin-top: 16px;">
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <div class="tile-stats" style="margin-bottom: 0px; border-color: #cccccc;">
                                            <div class="icon ${color_mensaje_certificado}" style="font-size: 25px;"><i class="${icono_mensaje_certificado}"></i></div>
                                            <div class="count ${color_mensaje_certificado}" style="font-size: 20px;">${mensaje_certificado}</div>                                    
                                            <p>El certificado cargado es válido durante los siguientes <b>${config_firma.dias_valido} días</b>.</p>                                                                                
                                        </div>
                                        <hr style="margin-bottom: 2px;">                                        
                                    </div>
                                </div>
                            `);
                            
                        }

                    $("#input_clave_certificado").val("");
                    $("#text_archivo_certificado").val("No seleccionado");

                    //reiniciamos el icono de documento firmado
                    $("#icono_estado_firma").html('<span class="fa fa-times-circle"></span>');
                    $("#icono_estado_firma").parent().removeClass('btn_verde');
                    $("#icono_estado_firma").parent().addClass('btn_rojo');
                    $("#icono_estado_firma").parent().siblings('input').val("No seleccionado");
                    $("#btn_enviar_tramite").hide();

                    
                    //mostramos la modal de la firma electrónica
                    console.log('debe');
                    $("#modal_firma_tarea").modal("show");
                    
                }else{
                    alertNotificar(retorno.mensaje, retorno.status);

                }
            }).fail(function(){
               
                vistacargando(); 
                alertNotificar("No se pudo completar la acción", "error");

            });
        
        }



  ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#frm_firma_electronica_tarea").submit(function(e){ 
                
            e.preventDefault();

            $("#modal_firma_tarea").modal("hide");

            var informeaux_aux = $("#lista").find(".check_documento:checked");
              if(informeaux_aux.length==0){
                 alertNotificar("Primero seleccione un informe", "default"); return;
              }
              $("#contet_periodo_selec").html(""); //quitamos los antiguos
              $.each(informeaux_aux, function(index, periodo){
                console.log(periodo);
              $("#contet_periodo_selec").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
              })
            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Generando documento(s)...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/tareasVehiculos/generarApro",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(retorno){

                     vistacargando(); // ocultamos la ventana de espera          
                     console.log(retorno);

                     actualizar_tabla_tarea();
                     
                     if(retorno['error']==true){
                        $('#smsTareas').html('');
                        $('#smsTareas').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>¡Atención!</strong> ${retorno['mensaje']}
                                  </div>`);
                        $('#smsTareas').show(200);
                        setTimeout(function() {
                        $('#smsTareas').hide(200);
                        },  3000);
                        vistacargando();
                        return false;

                     }   
                     else{
                      //llenar(cedula);
                          $('#smsTareas').html('');
                          $('#smsTareas').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                       </button>
                                       <strong>¡Atención!</strong> ${retorno['mensajeok']}
                                        </div>`);
                          $('#smsTareas').show(200);
                          setTimeout(function() {
                          $('#smsTareas').hide(200);
                          },  3000);
                          vistacargando();
                          return false;
                     }                                           

                     
                      
                  },
                  error: function(error){
                      vistacargando(); // ocultamos la ventana de espera
                      alertNotificar("Error al obtener la información de los informes", "error");
                      actualizar_tabla_tarea();
                      
                     
                      
                  }
              });


        });