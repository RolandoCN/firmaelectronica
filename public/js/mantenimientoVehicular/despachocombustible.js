
$(document).ready(function () {
$('#signArea').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:190});
$('#signArea_edit').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:190});

})
function salvoconducto_editar(id){
  $.get("/despachoCombustible/registro/"+id+"/edit", function (data) {
  console.log(data);

 /// cargo los datos en la seccion correspondiente (seccion vehiculo)      
  $('#fecha').val(data.resultado.fecha);
  
  $('.optiongasolinera').prop('selected',false); 
  $(`#cmbgasolinera option[value="${data.resultado['idmv_gasolinera']}"]`).prop('selected',true);  
  $("#cmbgasolinera").trigger("chosen:updated");   

 
  $('#method_Despacho').val('PUT'); 
  $('#frm_Despacho').prop('action',window.location.protocol+'//'+window.location.host+'/despachoCombustible/registro/'+id);
  $('#btn_despacho_cancelar').removeClass('hidden');
  $('html,body').animate({scrollTop:$('#administradorDespacho').offset().top},400);

});


}


$('#btn_despacho_cancelar').click(function(){
    $('#motivoedit').val('');
    $('#fecha').val('');
    $('.optiongasolinera').prop('selected',false); 
    $("#cmbgasolinera").trigger("chosen:updated");
    $('#method_Despacho').val('POST'); 
    $('#frm_Despacho').prop('action',window.location.protocol+'//'+window.location.host+'/despachoCombustible/registro/');
    $(this).addClass('hidden');
});

function btn_eliminardespacho(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


function verdetalle(id){

    $.get("/despachoCombustible/registro/"+id, function (data) {
    console.log(data);

   /// cargo los datos en la seccion correspondiente (seccion vehiculo)      
    $('#gasolineramodal').html(data.resultado.gasolinera.detalle);
    $("#fechamodal").html('Chone,'+data.fechaletra);
    $("#gasolinerasele").val(data.resultado.idmv_gasolinera);
    $('#despacho').val(data.resultado.idmv_despacho_combustible);
   // $('#despachoelim').val(data.resultado.idmv_despacho_combustible);
   //oculto el listado y muestro los detalles
    $('#datos').hide(300);
    $('#detalle').show(300);
    limpiarDetalle();
    cargartablaDetalle(data.resultado.idmv_despacho_combustible);

});

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
    $('.option_conductor').prop('selected',false); // deseleccionamos
    $("#conductormcodal").trigger("chosen:updated"); // actualizamos el combo
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
               border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarVehiculo('${item.codigo_institucion}','${item.placa}','${item.idmv_vehiculo}','${item.descripcion}','${item.codigo_institucion}','${item.idmv_tipocombustible}')">` +
              '<i class="fa fa-car"></i>   ' + item.descripcion+"-"+item.codigo_institucion +` <strong>[ ${item.placa} ]</strong> `+'   <label style="float:right" ><i class="fa fa-closed-captioning"></i> ' + item.codigo_institucion + '</label>' +
              '</button>' +
              '<div class="dropdown-divider"></div>'
            );
        });  
    });
} 

function capturarVehiculo(codigo,placa,idvehiculo,descripcion,ci,idtipocomb){
    
     var gasolinera=$('#gasolinerasele').val();
     $.get('/despachoCombustible/buscar_tipomedicion/'+idvehiculo, function (data){
     console.log(data);
     $.each(data.resultado,function(i,item){
    if(item.detalle=="Kilometraje")
      {
        //alert(item.detalle);
        $('#kilometrajemodal').attr('readonly',false);
        $('#kilometrajemodal').val('');

      }
    if(item.detalle=="Horómetro")
      {
      $('#horometrajemodal').attr('readonly',false); 
      $('#horometrajemodal').val('');
      // alert(item.detalle);         
      }
    })

    });

    $('.conten_busqueda').hide();
    $('#buscar').val(descripcion+" "+ci+" ["+placa+"]");
    $('#idvehiculog').val(idvehiculo);
    
    $('.option_combustible').prop('selected',false); 
    $(`#cmb_combustiblemodal option[value="${idtipocomb}"]`).prop('selected',true);  
    $("#cmb_combustiblemodal").trigger("chosen:updated");

    $('#precio').val();
    $('#preciounitariomodal').val();
    $('#galonesmodal').val('');
    $('#totalmodal').val('');
    $.get('/despachoCombustible/verpreciocomb/'+gasolinera+'/'+idtipocomb, function (data){
    console.log(data);
    if(data.resultado==null)
    {
        var preciogas="";
        $('#totalmodal').attr('readonly','readonly');
        $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> La gasolinera no tiene asignado un precio para el tipo de combustible
                            </div>
                        </div>
                    `);
    }
    else
    {
    var preciogas=data.resultado.precio
    $('#totalmodal').attr('readonly',false);
    
    }      
    $('#precio').val(preciogas);
    $('#preciounitariomodal').val(preciogas);

    });

    

}



$('#cmb_combustiblemodal').on('change', function() {

      $('precio').val('');
      $('preciounitariomodal').val('');
      $('#galonesmodal').val('');
      $('#totalmodal').val('');

      var idtipocombus= $('#cmb_combustiblemodal').val();
      var gasolineras=$('#gasolinerasele').val();
      
            
      $.get('/despachoCombustible/verpreciocomb/'+gasolineras+'/'+idtipocombus, function (data){

      console.log(data);
      if(data.resultado==null){
        var preciogas="";
        $('#totalmodal').attr('readonly','readonly');
        $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> La gasolinera no tiene asignado un precio para el tipo de combustible
                            </div>
                        </div>
                    `);
      }
      else{
       var preciogas=data.resultado.precio;
       $('#totalmodal').attr('readonly',false);
      
      }      
      $('#precio').val(preciogas);
      $('#preciounitariomodal').val(preciogas);
      

     });


});

function calculartotal(input){
    var galones=0; 
    // validamos para ocultar el contenido de busqueda cuando
    var totalp = $(input).val();
    var preciocaluni=$('#precio').val();

    console.log(totalp);
    console.log(preciocaluni);

    var galones=totalp/preciocaluni;
    console.log(galones);
    if(totalp==0)
    {
      $('#preciounitariomodal').val('');
      $('#galonesmodal').val('');  
    }
    else
    {
    var galonestotal=(galones-0).toFixed(2);
    $('#preciounitariomodal').val(preciocaluni);
    $('#galonesmodal').val(galonestotal);
    }

}


////////////////////////////CRUD DETALLLE///////////////////////////////////////////////////////////////////////

$('#conductormcodal').on('change', function() {

  var veh=$('#idvehiculog').val();
  
  if(veh==''){
      $('#buscar').val('');
      $('.option_conductor').prop('selected',false); // deseleccionamos
      $("#conductormcodal").trigger("chosen:updated"); // actualizamos el combo 
      $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> Ingrese un vehículo existente
                            </div>
                        </div>
                    `);
       $('#msmDetalle').show(200);
       setTimeout(function() {
       $('#msmDetalle').hide(200);
       },  5000);
      

  }    


});

$("#frm_DetalleDespacho").on("submit", function(e){
        e.preventDefault();
        
        if($('#method_DetalleDes').val()=='POST')
        {
          console.log('Guardar');
          guardarDetalle();
        
        }
        else{
          console.log('editar');
          editarDetalle();
        
        }


  function guardarDetalle() {
     
     $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
     });
    vistacargando("M","Espere...");
    var id=$('#despacho').val();
    var data=$("#frm_DetalleDespacho").serialize();
    $.ajax({
        url:'/despachoCombustible/detalle', // Url que se envia para la solicitud
        method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
        data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
        dataType: 'json',
        success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
               vistacargando();
                console.log(requestData);
                //console.log(requestData);
                $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
               
                
                limpiarDetalle();
                cargartablaDetalle(id);
                if(requestData.estadoP!='danger'){
                $('#iddetallef').val(requestData.iddetalled);
                $('#iddet').val(requestData.iddetalled);
                $('#Firma').modal('show');
              }
            }, error:function (requestData) {
                console.log(requestData);
                vistacargando();
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarDetalle(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        vistacargando("M","Espere...");
        var id=$('#despacho').val();
        var idactualizar=$('#iddetalledespacho').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_DetalleDespacho").serialize();
        $.ajax({
            url:'/despachoCombustible/detalle/'+idactualizar, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                vistacargando();
                $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarDetalle();
                cargartablaDetalle(id);
                              
                $('#method_DetalleDes').val('POST'); 
                $('#frm_DetalleDespacho').prop('action',window.location.protocol+'//'+window.location.host+'/despachoCombustible/detalle/');
                $('#btncancelardetalle').addClass('hidden');
                if(requestData.estadoP!='danger'){
                $('#iddetallef').val(requestData.iddetalled);
                $('#iddet').val(requestData.iddetalled);
                $('#Firma').modal('show');
                }
            }, error:function (requestData) {
                console.log(requestData);
                vistacargando();
            }
            });

    }
    function limpiarDetalle(){
      $('#galonesmodal').val('');
      $('#facturamodal').val('');
      $('#preciounitariomodal').val('');
      $('#totalmodal').val('');
      $('#buscar').val('');
      $('#kilometrajemodal').attr('readonly',true);
      $('#kilometrajemodal').val('');
      $('#horometrajemodal').attr('readonly',true);
      $('#horometrajemodal').val('');
      $('.option_combustible').prop('selected',false); // deseleccionamos
      $("#cmb_combustiblemodal").trigger("chosen:updated");
      $('.option_conductor').prop('selected',false); // deseleccionamos
      $("#conductormcodal").trigger("chosen:updated");
       
    }


     function cargartablaDetalle(id){
      //var id=1;
      //
      console.log(id);
               $.get("/detalle/"+id+'/llenardetalle', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "datatable2";
                    $(`#${idtabla}`).DataTable({
                       dom: ""
                    +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
                    +"<rt>"
                    +"<'row'<'form-inline'"
                    +" <'col-sm-6 col-md-6 col-lg-6'l>"
                    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                    "destroy":true,
                     "order": [[ 4, "desc" ]],
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
                        
                        data: resultado.resultado,
                       
                        columns:[
                            {data: "idmv_detalle_despacho" },
                            {data: "vehiculo.placa" },
                            {data: "tipocombustible.detalle" },
                            {data: "total" },
                            {data: "fecha_hora_despacho" },
                            {data: "fecha_hora_despacho" },
                            {data: "estado" },
                            {data: "estado" },                              
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(1).html(data.vehiculo.descripcion+" "+data.vehiculo.codigo_institucion);

                           $('td', row).eq(7).html(`
                          <button type="button" onclick="editar_detalle('${data.idmv_detalle_despacho}')" data-toggle="tooltip" data-original-title="Ver detalle" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
                          <button type="button" onclick="ver_detalledes('${data.idmv_detalle_despacho}')" data-toggle="tooltip" data-original-title="Ver detalle" class="btn btn-sm btn-success btn_icon" style="margin-bottom: 0;"><i class="fa fa-eye"></i></button>
                          <button type="button" onclick="eliminardetalle2('${data.idmv_detalle_despacho}')"data-toggle="tooltip" data-original-title="Ver detalle"  class="btn btn-sm btn-danger btn_icon" style="margin-bottom: 0;" ><i class="fa fa-remove"></i></button>
          
                                `);
    
                         if(data.estado=='Aprobado'){
                                    // estad="Pendiente";
                                   $('td',row).eq(6).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-success estado_validado"> Aprobado &nbsp; &nbsp;&nbsp;</span>'); 
                                }
                         else{
                                    // estad="Atendido"
                                  $('td',row).eq(6).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-danger estado_validado"> No aprobado &nbsp;</span>');

                        } 

                        if(data.firma_conductor==null){
                                    // estad="Pendiente";
                            $('td',row).eq(5).html('<span"> Sin Firmar &nbsp; &nbsp;&nbsp;</span>'); 
                        }
                        else{
                                 // estad="Atendido"
                           $('td',row).eq(5).html(`<img src='data:image/png;base64,${data.firma_conductor}') class="img_firma">`);
                        } 


                         
                        } 



                        }); 

                        });                               
                    

     }

     function imprimir_cus(id)
     {
       $.get("/custodio/"+id+'/imprimircustodio', function (data) {

       });
     }

    function eliminardetalle2(id){
      $('#iddetalle_eliminar').val(id);
      var iddesp=$('#despacho').val();
      $('#despachoelim').val(iddesp);
      $('#eliminar').modal("show");

    }



    function eliminardetalle(id) {
    console.log(id);
     var idv=$('#despacho').val();
     var idactualizar=$('#iddetalledespacho').val();
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/despachoCombustible/detalle/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmDetalle').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaDetalle(idv);
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

        limpiarDetalle();
  }

    function editar_detalle(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/detalle/"+id+'/edit', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
         $('#facturamodal').val(data.resultado.num_factura_ticket);
         $('#iddetalledespacho').val(data.resultado.idmv_detalle_despacho);
         $('#idvehiculog').val(data.resultado.idmv_vehiculo);
         $('#precio').val(data.resultado.precio_unitario);
         $('#galonesmodal').val(data.resultado.galones);
         $('#preciounitariomodal').val(data.resultado.precio_unitario);
         $('#totalmodal').val(data.resultado.total);
         $('#buscar').val(data.resultado.vehiculo.descripcion+" "+data.resultado.vehiculo.codigo_institucion+' ['+data.resultado.vehiculo.placa+ ']')
         
         $('.option_combustible').prop('selected',false); // deseleccioamos
         $(`#cmb_combustiblemodal option[value="${data.resultado['idmv_tipocombustible']}"]`).prop('selected',true); // seleccionamos 
         $("#cmb_combustiblemodal").trigger("chosen:updated");

         $('.option_conductor').prop('selected',false); // deseleccioamos
         $(`#conductormcodal option[value="${data.resultado['idconductor']}"]`).prop('selected',true); // seleccionamos 
         $("#conductormcodal").trigger("chosen:updated");


         $('.option_persona').prop('selected',false); // deseleccioamos
         $(`#cmb_persona option[value="${data.resultado['idmv_tiporolpersona']}"]`).prop('selected',true); // seleccionamos 
         $("#cmb_persona").trigger("chosen:updated"); 

         if(data.resultado.Horometraje!=null){
          $('#horometrajemodal').attr('readonly',false);
          $('#horometrajemodal').val(data.resultado.Horometraje);
         }
         else{
          $('#horometrajemodal').attr('readonly',true);
          $('#horometrajemodal').val('');              
         }
         if(data.resultado.Kilometraje!=null){
          $('#kilometrajemodal').attr('readonly',false);
          $('#kilometrajemodal').val(data.resultado.Kilometraje);
         }
         else{
          $('#kilometrajemodal').attr('readonly',true);
          $('#kilometrajemodal').val('');
         }
        
        
         });
       $('#method_DetalleDes').val('PUT'); // decimo que sea un metodo put
      // $('#frm_NovedadesVeh').attr('action','/novedades/registro/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btncancelardetalle').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btncancelardetalle').click(function(){
      $('#iddetalledespacho').val('');
      $('#idvehiculog').val('');
      $('#precio').val('');
      $('#galonesmodal').val('');
      $('#preciounitariomodal').val('');
      $('#totalmodal').val('');
      $('#buscar').val('');
      $('#facturamodal').val('');
      $('.option_combustible').prop('selected',false); // deseleccionamos
      $("#cmb_combustiblemodal").trigger("chosen:updated");
      $('.option_conductor').prop('selected',false); // deseleccionamos
      $("#conductormcodal").trigger("chosen:updated");
      $('.option_persona').prop('selected',false); // deseleccionamos
      $("#cmb_persona").trigger("chosen:updated");
      $('#horometrajemodal').attr('readonly',true);
      $('#horometrajemodal').val('');
      $('#kilometrajemodal').attr('readonly',true);
      $('#kilometrajemodal').val('');
      $('#method_DetalleDes').val('POST'); 
      $('#frm_DetalleDespacho').prop('action',window.location.protocol+'//'+window.location.host+'/despachoCombustible/detalle/');
      $(this).addClass('hidden');


    });

    function ver_detalledes(id){
      $.get("/detalle/"+id+'/verdetalle', function (data) {
        console.log(data);
        $('#gasolineramodalapr').html(data.resultado.despacho.gasolinera.detalle);
        $('#vehiculomodalapr').html(data.resultado.vehiculo.descripcion+" "+data.resultado.vehiculo.codigo_institucion+ " ["+data.resultado.vehiculo.placa+"]");
        $('#totalmodalapr').html(data.resultado.total);
        $('#kilometrajemodalapr').html(data.resultado.Kilometraje);
        $('#horometromodalapr').html(data.resultado.Horometraje);
        $('#combustiblemodalapr').html(data.resultado.tipocombustible.detalle);  
        $('#galonesmodalapr').html(data.resultado.galones);
        $('#preciounitmodal').html(data.resultado.precio_unitario);
        $('#conductormodalapr').html(data.resultado.choferes.usuario.name);
        $('#fechaaprmodalapr').html(data.resultado.fecha_hora_aprobacion);   
        $('#iddetalle').val(data.resultado.idmv_detalle_despacho);
        $('#estado').val(data.resultado.estado);
        $('#idmv_despacho_c').val(data.resultado.idmv_despacho_combustible);

        if(data.resultado.idusuarioaprueba==null){
          var usuarioap="";
        }
        else{
          var usuarioap=data.resultado.usuarioaprueba.name;  
        }
        $('#usuariomodalapr').html(usuarioap);
        $('#fechadespachomodalapr').html(data.resultado.fecha_hora_despacho);

        if(data.resultado.estado=="Aprobado"){
          $('#reprob').show();
          $('#aprob').hide();
          $('#contfirma').hide();
        }
        else{
          $('#aprob').show();
          $('#contfirma').show();
          $('#reprob').hide();
        }

         $('#detalletabla').append(
             `<tr>
                 <td>${data.resultado.tipocombustible.detalle}</td>
                 <td>${data.resultado.galones}</td>
                 <td>${data.resultado.precio_unitario}</td>
                 <td>${data.resultado.total}</td>
                 

                 
                 </tr>`);            
        cargartareadetalle(data.resultado.idmv_vehiculo,data.resultado.idmv_despacho_combustible);
        $('#DetalleDespacho').modal('show');
        //$('#Firma').modal('show');

       });
     
    }
///////////////////////////////////////////////////////////////////////////////////

function cargartareadetalle(id,fecha){
   $('#tareamodalapr').html('');
   $('#tareasg').html('');
  $.get("/controlIngresoPatio/cargartareadetalle/"+id+'/'+fecha, function (data) {
    
    if(data.error == true){
             mostrarMensaje(data.mensaje,data.status,'mensaje_info');
    }
    else{
      console.log(data);
      
       if(data.lista_tramites.length===0){
        var tareas="no";
        $('#tareasg').val(tareas);
        $('#tareamodalapr').html('');
         $("#table_dato_salida").show(700);
            $('#tareamodalapr').append(
             `<li>
                Sin tareas que mostrar
                 
                 
                 </li>`);
        }
        else{
         var tareas="si";
         $('#tareasg').val(tareas);
        }
     
       var items=[];
      

       $.each(data.lista_tramites, function(i,item){
       $('#tareamodalapr').html('');   
       $("#table_dato_salida").show(700);
       console.log(item.detalle_tarea);
       items.push($('<li/>').text(item.detalle_tarea));

      
       }); 
      $('#tareamodalapr').append.apply($('#tareamodalapr'), items);

    }


  });

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cambiarestado(){
 
  var id=$('#iddetalle').val();
  var estado=$('#estado').val();
  var idtabla=$('#idmv_despacho_c').val();
   $('#DetalleDespacho').modal('hide');
   $.get("/detalle/"+id+'/'+estado+'/cambioestado', function (data) {
  console.log(data);
    cargartablaDetalle(idtabla);
   
    $('#msmDetalledos').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${data.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${data.mensaje}
                  </div>
              </div>
  `);


  });
}


 // functión para actualizar la firma de un departamento
    $("#firma").submit(function(e){
        e.preventDefault();
        $('#DetalleDespacho').modal('hide');
        $('html,body').animate({scrollTop:$('#msmDetalledos').offset().top},400);
        vistacargando("M", "Espere...");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var FrmData = new FormData(this);

        var iddetale = $("#iddetalle").val();
        var idtabla=$('#idmv_despacho_c').val();
        var tareasdes=$('#tareasg').val();

        html2canvas([document.getElementById('sign-pad')], {
            onrendered: function (canvas) {
                var canvas_img_data = canvas.toDataURL('image/png');
                var img_data = canvas_img_data.replace(/^data:image\/(png|jpg);base64,/, "");

                FrmData.append("b64_firma",img_data);
                FrmData.append("iddetale",iddetale);
                FrmData.append("tareasdes",tareasdes);

                //ajax call to save image inside folder
                $.ajax({
                    url: '/detalle/aprobarconfirma',
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    complete: function(request){                    
                        requestData = request.responseJSON; // obtenemos el json que se retorna
                        console.clear();
                        console.log(requestData);
                        // control de request
                       // alertNotificar(requestData.mensaje, requestData.estadoP);
                         $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12">
                                    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> ${requestData.mensaje}
                                    </div>
                                </div>
                        `);
                        vistacargando();
                        if(!requestData.error){
                            cargartablaDetalle(idtabla); // actualizamos la imagen de la firma editada
                            limpiarSingArea();
                            $("#preview_firma").hide();
                            
                        }
                    }
                }).fail(function(){            
                     //alertNotificar("Error el enviar la información", "error");
                   //$('#DetalleDespacho').modal('hide');
                    $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12">
                                    <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> Error al enviar la información
                                    </div>
                                </div>
                        `);

                    vistacargando();
                });
            }
        }); 


    });




    // functión para actualizar la firma de un departamento
    $("#firmamodal").submit(function(e){
        e.preventDefault();
        $('#DetalleDespacho').modal('hide');
        $('html,body').animate({scrollTop:$('#msmDetalledos').offset().top},400);
        vistacargando("M", "Espere...");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var FrmData = new FormData(this);

        var iddetale = $("#iddetallef").val();
         var idtabla=$('#iddesp').val();

        html2canvas([document.getElementById('sign-pad')], {
            onrendered: function (canvas) {
                var canvas_img_data = canvas.toDataURL('image/png');
                var img_data = canvas_img_data.replace(/^data:image\/(png|jpg);base64,/, "");

                FrmData.append("b64_firma",img_data);
                FrmData.append("iddetale",iddetale);

                //ajax call to save image inside folder
                $.ajax({
                    url: '/detalle/aprobarconfirma',
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    complete: function(request){                    
                        requestData = request.responseJSON; // obtenemos el json que se retorna
                        console.clear();
                        console.log(requestData);
                        // control de request
                       // alertNotificar(requestData.mensaje, requestData.estadoP);
                         $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12">
                                    <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> ${requestData.mensaje}
                                    </div>
                                </div>
                        `);
                        vistacargando();
                        if(!requestData.error){
                            cargartablaDetalle(idtabla); // actualizamos la imagen de la firma editada
                            limpiarSingArea();
                            $("#preview_firma").hide();
                            
                        }
                    }
                }).fail(function(){            
                     //alertNotificar("Error el enviar la información", "error");
                   //$('#DetalleDespacho').modal('hide');
                    $('#msmDetalledos').html(`
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                <div class="col-md-12 col-sm-6 col-xs-12">
                                    <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>Información: </strong> Error al enviar la información
                                    </div>
                                </div>
                        `);

                    vistacargando();
                });
            }
        }); 


    });