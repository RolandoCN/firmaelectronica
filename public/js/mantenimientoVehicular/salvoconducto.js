

function guardarSalvoconducto(){
  if($('#fsalidaedit').val()!=$('#fingresolledit').val()){
    alertNotificar('Solo se permite solicitar el salvoconducto para un solo día', "warning");
    return;
  }
  vistacargando('M','Por favor espere....');
  $('#frm_Salvoconducto').submit();
}

function actualizarSalvoconducto(){
  if($('#fsalidaeditm').val()!=$('#fingresolleditm').val()){
    alertNotificar('Solo se permite solicitar el salvoconducto para un solo día', "warning");
    return;
  }
  vistacargando('M','Por favor espere....');
  $('#frm_Linea_').submit();
}

function aprobarSalvoconducto(){
  
  $('#frm_Aprob').attr('action','/salvoConducto/aprobar');
  $('#modaldatoslinea').addClass('disabled_content');
  swal({
    title: "",
    text: "¿Está seguro que desea aprobar el salvoconducto?",
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
        $('#frm_Aprob').submit();
      }
      sweetAlert.close();   // ocultamos la ventana de pregunta
       $('#frm_Aprob').attr('action','');
       $('#modaldatoslinea').removeClass('disabled_content');
  }); 

  
}

function reprobarSalvoconducto(){
   $('#frm_Aprob').attr('action','/salvoConducto/reprobar');
  $('#modaldatoslinea').addClass('disabled_content');

    swal({
      title: "",
      text: "¿Está seguro que desea reprobar el salvoconducto?",
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
          $('#frm_Aprob').submit();
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
        $('#frm_Aprob').attr('action','');
        $('#modaldatoslinea').removeClass('disabled_content');

    }); 
}

function verdetalleusu(id){
  vistacargando('M','Por favor espere....');
  $.get("/salvoConducto/registro/"+id, function (data) {
    vistacargando();
    $('#DetalleTramite').modal('show');
  //  cargo los datos en la seccion correspondiente (seccion salvoconducto)      
  
  $('#prov').html(data.resultado.provincia.descripcion);
  $('#cant').html(data.resultado.canton.detalleCanton);
  $('#direcc').html(data.resultado.direccion);
  $('#motivo').html(data.resultado.motivo);
  $('#usuariosolicita').html(data.resultado.usuariosolicita.name);
  $('#fechasolicitud').html(data.resultado.fechasolicitud);
  $('#fechasalida').html(data.resultado.fechasalida);
  $('#fecharetorno').html(data.resultado.fechaingreso_llegada);
  $('#horasalidam').html(data.resultado.hora_salida);
  $('#horaretorno').html(data.resultado.hora_ingreso_llegada);
  $('#fechaaprobacion').html(data.resultado.fechaaprobacion);
  $('#parroquiainf').html(data.resultado.parroquia.descripcion);
  if(data.resultado.estado=='Reprobado'){
    $('#observacionReprueba').html(`<hr><div class="col-md-12" style="text-align: left" ><strong style="color:red">Observación de Reprobación:</strong><p>${data.resultado.observacion}</p></div>                                        
    </div>`);
  }else{
    $('#observacionReprueba').html(``);
  }

    

  if(data.resultado.idusuarioaprueba==null)
    {
     var usuarioaprueba=""; 
    }
  else
    {
      var usuarioaprueba=data.resultado.usuarioaprueba.name;
    }

    $('#usuarioaprobo').html(usuarioaprueba);


});

}

function verdetalle(id){
  $('#observacion').val('');
  vistacargando('M','Por favor espere...');
  $.get("/salvoConducto/registro/"+id, function (data) {
  // $('#datos').hide(300);
  // $('#detalle').show(300);
  $('#modaldatoslinea').modal("show");
  vistacargando();

 // cargo los datos en la seccion correspondiente (seccion vehiculo)      
  // $('#codigo').html(data.resultado.vehiculo.codigo_institucion);
  // $('#placa').html(data.resultado.vehiculo.placa);
  // $('#marca').html(data.resultado.vehiculo.marca.detalle);
  // $('#modelo').html(data.resultado.vehiculo.modelo);
  // $('#uso').html(data.resultado.vehiculo.tipouso.detalle);


  // $('#codigo').html(data.resultado.vehiculo.codigo_institucion);
  // $('#placa').html(data.resultado.vehiculo.placa);
  // $('#marca').html(data.resultado.vehiculo.marca.detalle);
  // $('#modelo').html(data.resultado.vehiculo.modelo);
  // $('#uso').html(data.resultado.vehiculo.tipouso.detalle);

// cargo los datos en la seccion correspondiente (seccion salvoconducto)      
  // $('#motivo').html(data.resultado.motivo);
  // $('#usuariosolicita').html(data.resultado.usuariosolicita.name);
  // $('#fechasolicitud').html(data.resultado.fechasolicitud);
  // $('#fechasalida').html(data.resultado.fechasalida);
  // $('#fecharetorno').html(data.resultado.fechaingreso_llegada);
  // $('#horasalidam').html(data.resultado.hora_salida);
  // $('#horaretorno').html(data.resultado.hora_ingreso_llegada);

  $('#fechaaprobacionmodal').val(data.resultado.fechaaprobacion);
 

  
 // $('#usarioaprobomodal').val(data.resultado.usuarioaprueba.name);  
  $('#provinciaomodal').val(data.resultado.provincia.descripcion);
  $('#cantonmodal').val(data.resultado.canton.detalleCanton);
  $('#parroquiamodal').val(data.resultado.parroquia.descripcion);
  $('#destinomodal').val(data.resultado.direccion);
  $('#motivomodal').val(data.resultado.motivo);
  if(data.resultado['idchofer']!=null){
    $('.option_chofer').prop('selected',false); 
    $(`#chofersalvoApro option[value="${data.resultado['idchofer']}"]`).prop('selected',true);  
    $("#chofersalvoApro").trigger("chosen:updated"); 
  }else{
   $('#chofersalvoApro').val('');

  }

  if(data.resultado['idmv_vehiculo']!=null){
    $('.optionvehiculo').prop('selected',false); 
    $(`#vehiculosalvoApro option[value="${data.resultado['idmv_vehiculo']}"]`).prop('selected',true);  
    $("#vehiculosalvoApro").trigger("chosen:updated");  
  }else{
    $('#vehiculosalvoApro').val('');
  }
  $('#usuariomodal').val(data.resultado.usuariosolicita.name);
  $('#fechasolicitudmodal').val(data.resultado.fechasolicitud);
  $('#fechasalidamodal').val(data.resultado.fechahorasalida);
  $('#fecharetornomodal').val(data.resultado.fechahoraretorno);
  $('#horasalidam').val(data.resultado.hora_salida);
  $('#horaretorno').val(data.resultado.hora_ingreso_llegada);


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
       //$("#imprimir").attr("disabled", true);
    $('#idsalvoc').val(data.resultado.idmv_salvoconducto);
    $("#aprm").hide();    
    $("#repm").show();
    $("#fechaprobacionform").show();
    $("#usuarioform").show();
    $('#fechaaproform').show();
    $('#usaurioaprform').show();
    $('#archivoform').hide();
    $("#chofersalvoApro").attr('disabled', true);
    $("#vehiculosalvoApro").attr('disabled', true);

    $('.optionpers').prop('selected',false); 
    // $(`#cmb_vehiculomodal option[value="${data.resultado['idmv_vehiculo']}"]`).prop('selected',true);  
    // $("#cmb_vehiculomodal").trigger("chosen:updated"); 
    
    // $("#conductormcodalapr").attr('disabled', 'disabled');
    // $('.optionpers').prop('selected',false); 
    // $(`#conductormcodalapr option[value="${data.resultado['idchofer']}"]`).prop('selected',true);  
    // $("#conductormcodalapr").trigger("chosen:updated"); 
    $('#observacionRepruebadiv').show();
    $('#observacionReprueba').attr('required',true);
    
    $('#frm_Aprob').attr('action','/salvoConducto/reprobar/'+data.resultado.idmv_salvoconducto);
    // $("#reaprobarm").attr("href", '/salvoConducto/reprobar/'+data.resultado.idmv_salvoconducto);

    // $('a[href]#reaprobarm').each(function () {
    //   var href = this.href;
    //     $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
    //     if (href.toLowerCase().indexOf("#") >= 0) {
    //     } else {
    //     // window.open(href);
    //     $(location).attr('href','/salvoConducto/reprobar/'+data.resultado.idmv_salvoconducto);
    //     }
    //     });
    //  });
    }

  if(data.resultado.estado=="Reprobado")
    {
    $('#idsalvoc').val(data.resultado.idmv_salvoconducto);
      
    $("#aprm").show();    
    $("#repm").hide();
    $("#fechaprobacionform").hide();
    $("#usuarioform").hide();
    $('#fechaaproform').hide();
    $('#usaurioaprform').hide();
    $('#archivoform').show();
    $("#chofersalvoApro").attr('disabled', false);
    $("#vehiculosalvoApro").attr('disabled', false);
  
    
    $('.optionpers').prop('selected',false); 
    // $("#cmb_vehiculomodal").trigger("chosen:updated"); 

    // $("#conductormcodalapr").attr('disabled', false);
    // $('.option_conductor').prop('selected',false); 
    // $("#conductormcodalapr").trigger("chosen:updated");
    $('#frm_Aprob').attr('action','/salvoConducto/aprobar');
    $('#observacionReprueba').text(data.resultado.observacion);
    $('#observacionReprueba').attr('readonly',true);
    $('#observacionRepruebadiv').show();
    $('#observacionReprueba').attr('required',false);

    // var idmv_v="";
    // $('#cmb_vehiculomodal').on('change', function() {

    //           var idmv_v= $('#cmb_vehiculomodal option:selected').val();
    //           console.log(idmv_v);
    //            vistacargando("M","Espere...");
    //           $.get("/salvoConducto/chofer/"+idmv_v, function (data) {
    //              vistacargando();
    //               console.log(data);
    //             if(data.conductor!=null){
    //             $('.option_conductor').prop('selected',false); 
    //             $(`#conductormcodalapr option[value="${data.conductor['idmv_tiporolpersona']}"]`).prop('selected',true);  
    //             $("#conductormcodalapr").trigger("chosen:updated"); 
    //             }

    //           });

              
    //           //$('#nombrearea').val(nombre_area);

    // });
      
  //    $("#frm_Aprob").on("submit", function(e){
  //       e.preventDefault();
  //       var idmv_v= $('#cmb_vehiculomodal option:selected').val();        
  //       var chof=$('#conductormcodalapr option:selected').val();

  //       if($('#cmb_vehiculomodal option:selected').val()==""){
  //         alert("Seleccione un vehículo");
  //       }
  //       else if($('#conductormcodalapr option:selected').val()==""){
  //         alert("Seleccione un chofer");
  //       }
  //       else{
        
  //       location.href = "aprobar/"+data.resultado.idmv_salvoconducto+'/'+idmv_v+'/'+chof; 
  //     }

  // });

    // $('#cmb_vehiculomodal').on('change', function() {
    // var idmv_v= $('#cmb_vehiculomodal option:selected').val();
    // $("#aprobarm").attr("href", '/salvoConducto/aprobar/'+data.resultado.idmv_salvoconducto+'/'+idmv_v);
    // });

    // $("#aprobarm").attr("href", '/salvoConducto/aprobar/'+data.resultado.idmv_salvoconducto+'/0');


     //  $('a[href]#aprobar').each(function () {
     //  var href = this.href;
     //    $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
     //    if (href.toLowerCase().indexOf("#") >= 0) {
     //    } else {
     //    // window.open(href);
     //    $(location).attr('href','/salvoConducto/aprobar/'+data.resultado.idmv_salvoconducto+'/0');
     //    }
     //    });
     // });

    }
 

  if(data.resultado.estado=="Pendiente")
  {
  $('#idsalvoc').val(data.resultado.idmv_salvoconducto);
  $("#aprm").show();
  $("#repm").show();
  $("#fechaprobacionform").show();
  $("#usuarioform").show();
  $('#fechaaproform').hide();
  $('#usaurioaprform').hide();
  $('#archivoform').show();
  $('#observacionReprueba').attr('required',false);
  $("#chofersalvoApro").attr('disabled', false);
  $("#vehiculosalvoApro").attr('disabled', false);
  $('.optionpers').prop('selected',false); 
  $('#observacionRepruebadiv').hide();
  // $('#frm_Aprob').attr('action','/salvoConducto/aprobar');
  

  // var idmv_v="";
  // $('#cmb_vehiculomodal').on('change', function() {

  //           var idmv_v= $('#cmb_vehiculomodal option:selected').val();
  //           console.log(idmv_v);
  //            vistacargando("M","Espere...");
  //           $.get("/salvoConducto/chofer/"+idmv_v, function (data) {
  //              vistacargando();
  //               console.log(data);
  //             if(data.conductor!=null){
  //             $('.option_conductor').prop('selected',false); 
  //             $(`#conductormcodalapr option[value="${data.conductor['idmv_tiporolpersona']}"]`).prop('selected',true);  
  //             $("#conductormcodalapr").trigger("chosen:updated"); 
  //             }

  //           });

            
  //           //$('#nombrearea').val(nombre_area);

  // });

  



}
$("#chofersalvoApro").trigger("chosen:updated"); 
$("#vehiculosalvoApro").trigger("chosen:updated"); 
  
});
}


function salvoconducto_editar(id){
    vistacargando('M','Por favor espere....');
  $.get("/salvoConducto/registro/"+id+"/edit", function (data) {
    vistacargando();
    $('#modaldatoseditar').modal('show');
 /// cargo los datos en la seccion correspondiente (seccion vehiculo)      
  $('#motivoeditm').val(data.resultado.motivo);
  $('#fsolicitudeditm').val(data.resultado.fechasolicitud);
  $('#fsalidaeditm').val(data.resultado.fechasalida);
  $('#fingresolleditm').val(data.resultado.fechaingreso_llegada);
 // $('#vehi').val(data.resultado.vehiculo.marca.detalle+"-"+data.resultado.vehiculo.modelo+"["+data.resultado.vehiculo.placa+"]");
  $('#idvehiculogm').val(data.resultado.idmv_vehiculo);
  //$('#buscar').val(data.resultado.vehiculo.codigo_institucion);
  $('#horasalidaeditm').val(data.resultado.hora_salida);
  $('#horaretornoeditm').val(data.resultado.hora_ingreso_llegada);
  $('#direccionm').val(data.resultado.direccion);

  $('.optionvehiculoeditar').prop('selected',false); 
  $(`#vehiculoSalvoedit option[value="${data.resultado['idmv_vehiculo']}"]`).prop('selected',true);  
  $("#vehiculoSalvoedit").trigger("chosen:updated");  

  $('.option_choferedit').prop('selected',false); 
  $(`#choferSalvoedit option[value="${data.resultado['idchofer']}"]`).prop('selected',true);  
  $("#choferSalvoedit").trigger("chosen:updated");  
 
  $('.optioncant').prop('selected',false); 
  $(`#cantonm option[value="${data.resultado['idcanton']}"]`).prop('selected',true);  
  $("#cantonm").trigger("chosen:updated");


  $('.optionprov').prop('selected',false); 
  $(`#provinciam option[value="${data.resultado['idprovincia']}"]`).prop('selected',true);  
  $("#provinciam").trigger("chosen:updated");

  $('.optionpers').prop('selected',false); 
  $(`#cmb_personam option[value="${data.resultado['idusuariosolicita']}"]`).prop('selected',true);  
  $("#cmb_personam").trigger("chosen:updated"); 
  cargarParroquias($('#cantonm').val(),'parroquiaEdit');


   $('#frm_Linea_').prop('action',window.location.protocol+'//'+window.location.host+'/salvoConducto/registro/'+id);
  setTimeout(function() {
    $('.optionparroquiaEdit').prop('selected',false); 
    $(`#parroquiaEdit option[value="${data.resultado['idparroquia']}"]`).prop('selected',true);  
    $("#parroquiaEdit").trigger("chosen:updated");
  },  1000);
  
  // $('#method_Salvoconducto').val('PUT'); 
  // $('#frm_Salvoconducto').prop('action',window.location.protocol+'//'+window.location.host+'/salvoConducto/registro/'+id);
  // $('#btn_salvocond_cancelar').removeClass('hidden');

  //   $('html,body').animate({scrollTop:$('#administradorSalvo').offset().top},400);
});


}


$('#btn_salvocond_cancelar').click(function(){
    $('#motivoedit').val('');
    $('#direccion').val('');
    $('#fsolicitudedit').val('');
    $('#fsalidaedit').val('');
    $('#fingresolledit').val('');
    $('#vehi').val('');
    $('#idvehiculog').val('');
    $('#buscar').val('');
    $('#horasalidaedit').val('');
    $('#horaretornoedit').val('');
    $('.canton').prop('selected',false); 
    $("#canton").trigger("chosen:updated"); 
    $('.optionprov').prop('selected',false); 
    $("#provincia").trigger("chosen:updated");
    $('.optionpers').prop('selected',false); 
    $("#cmb_persona").trigger("chosen:updated"); 
    $('#method_Salvoconducto').val('POST'); 
    $('#frm_Salvoconducto').prop('action',window.location.protocol+'//'+window.location.host+'/salvoConducto/registro/');
    $(this).addClass('hidden');
});

function btn_eliminarsalvoconducto(btn){
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
    $('#vehiculosListaCombustible').empty(); // limpiamos la tabla
    //$('detallevehiculo').addClass('hidden');
    $.get('/salvoConducto/buscar_vehiculo/'+busqueda, function (data){
        console.clear(); console.log(data);
          $('#vehiculosListaCombustible').empty();
          $('#vehi').val('');
          $('#idvehiculog').val('');
         
          $.each(data.resultado, function(i, item){
            console.log(item);
            
            
            $(conten_busqueda).show();
            $('#vehiculosListaCombustible').append(
             
               `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
               border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarVehiculo('${item.codigo_institucion}','${item.placa}','${item.idmv_vehiculo}','${item.marca.detalle}','${item.modelo}')">` +
              '<i class="fa fa-car"></i>   ' + item.marca.detalle+"-"+item.modelo +` <strong>[ ${item.placa} ]</strong> `+'   <label style="float:right" ><i class="fa fa-closed-captioning"></i> ' + item.codigo_institucion + '</label>' +
              '</button>' +
              '<div class="dropdown-divider"></div>'
            );
        });  
    });
} 

function capturarVehiculo(codigo,placa,idvehiculo,marca,modelo){
    //alert("DSd");
    $('.conten_busqueda').hide();
    $('#buscar').val('');
    //$('detallevehiculo').removeClass('hidden');
    $('#vehi').val(marca+"-"+modelo+"["+placa+"]");
    $('#idvehiculog').val(idvehiculo);
}
$("#provincia").change(function() {

  cargarCantones($('#provincia').val(),'canton','parroquia');

});

$("#provinciam").change(function() {

  cargarCantones($('#provinciam').val(),'cantonm','parroquiaEdit');

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

$("#canton").change(function() {

  cargarParroquias($('#canton').val(),'parroquia');

});

$("#cantonm").change(function() {

  cargarParroquias($('#cantonm').val(),'parroquiaEdit');

});

function cargarParroquias(valor,idelement)
{
 
  $.get('/salvoConducto/getParroquias/'+valor, function (data) { 
    $('#'+idelement).html('');
    console.log(data);
    if(data.status){
      data.datos.forEach(element => {
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