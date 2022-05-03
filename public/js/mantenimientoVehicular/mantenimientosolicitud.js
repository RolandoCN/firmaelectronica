$(document).ready(function () {
    cargar_tabla();
    $('#signArea').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:90});
    $('#signArea_edit').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:90});
});

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
    "zeroRecords": "No se encontraron registros",
    "infoEmpty": "No hay registros para mostrar",
    "infoFiltered": " - filtrado de MAX registros",
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
    "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
    }
};

function cargar_estilos_tabla(idtabla){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 1, "desc" ]],
        pageLength: 10,
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
  
function cargar_tabla(){
      $('#listaSoli').html('');
      $("#datatable_solicitud_mant").DataTable().destroy();
      $('#datatable_solicitud_mant tbody').empty();
      vistacargando('m','Cargando información...');
      $.get("/mantenimiento/tablamantsoli", function (data) {
            vistacargando();
            $.each(data['resultado'],function(i,item){
                var estado=""
                var botones='';
                var observacion='';
                var color='';
                if(item['firma_chofer']!=1){
                    estado = (`<span style="min-width: 50px !important;" class="label label-warning estado_firma"><i class="fa fa-check-circle"></i> Por firmar</span>`);
                    botones=`<button  type="button" onclick="metodofirma('${item['codigo_mantenimiento']}','${item['idmv_mantenimiento_encrypt']}')" data-toggle="tooltip" data-original-title="Firmar Documento" class="btn btn-sm btn-success "><i class="fa fa-magic"></i> Firmar 
                            </button>
                             <button  type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                            </button>
                            <button  type="button" class="btn btn-sm btn-danger "data-toggle="tooltip" data-original-title="Eliminar" onclick="btn_eliminarmant('${item['idmv_mantenimiento_encrypt']}')"><i class="fa fa-trash"></i> Eliminar</button>
                            </center> `;
                    if(item['observacion_devolucion_mecanico']!=null){
                        observacion=item['observacion_devolucion_mecanico'];
                        color='#ff000029';
                    }
                } else{
                    if(item['estado_chofer']=='R' && item['estado_revision_soli']=='Pendiente'){
                        estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Firmado</span>`);
                        botones=` <button type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                                    </button>
                                    <button  type="button" class="btn btn-sm btn-warning "data-toggle="tooltip" data-original-title="Eliminar" onclick="revertir_firmado('${item['idmv_mantenimiento_encrypt']}')"><i class="fa fa-refresh"></i> Revertir</button>
                                </center>`;
                        observacion=item['observacion_devolucion_mecanico'];
                        color='#ff000029';

                    }else{
                        estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Firmado y enviado</span>`);
                        botones=` <button type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                                    </button>`;
                    }
                }
                $('#listaSoli').append(`<tr role="row" class="odd">
                                            <td width="10%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                                                ${item['codigo_mantenimiento']}
                                            </td>
                                            <td width="10%" style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                                ${item['fecha_solicitud_mantenimento']}
                                            </td>
                                            <td style=" vertical-align: middle;"  class="paddingTR">
                                                <b>Chofer: </b>${item['chofer']['usuario']['name']}<br>
                                                <b>Vehículo: </b>${item['vehiculo']['descripcion']+' '+item['vehiculo']['codigo_institucion']+' '+item['vehiculo']['placa']}<br>
                                                <b>Tipo Mantenimiento: </b> ${item['tipo']}<br>
                                            </td>
                                            <td width="15%" style="vertical-align: middle; text-align:center; background-color:${color}"  class="paddingTR">
                                                ${observacion}
                                            </td>
                                            <td width="5%" style=" vertical-align: middle; text-align:center "  class="paddingTR">
                                                ${estado}
                                            </td>
                                            <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                                <center>
                                                ${botones} 
                                            </td>
                                        </tr>  `);
            });
            cargar_estilos_tabla("datatable_solicitud_mant");
      });  

}

$('#frm_Mantenimiento').submit(function(e){
    e.preventDefault();
    vistacargando('Registrando solicitud...');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/mantenimiento/registro',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }
            if(data['error']==false){
                alertNotificar(data['detalle'],'success');
                cargar_tabla();
                vistacargando();
            }
        },
        error: function(e){
            alertNotificar('Inconvenientes al realizar registro','error');
            vistacargando();
            return;
        }
    });
});

function metodofirma(solicitud,solicitud_encrypt){
    $('#solicitud_modal_firma').html('Código: '+solicitud);
    $('#idsolicitud_encrypt').val(solicitud_encrypt);
    $('#solicitud_modal_firma_manual').html('Código: '+solicitud);
    $('#idsolicitud_encrypt_firma').val(solicitud_encrypt);
    $('#descargar_doc_firma').html(`<p > <a  data-toggle="tooltip" data-placement="right" title="Recuerde que puede descargar el documento y firmarlo." id="btn_descargar_documento_firmar" class="btn btn-info btn-sm"  id="btn_descargar_documento_firmar" href="/mantenimiento/descargar/${solicitud_encrypt}" class="btn btn-info btn-sm" ><i class="fa fa-download"></i> Descargar documento</a></p>`);
    // $('#descargar_doc_firma').attr(`<a></a>`'href','/mantenimiento/descargar/'+solicitud_encrypt)
    $("#modal_metodo_firma").modal("show");
}
function firmarManual(){
    $("#modal_metodo_firma").modal("hide");
    $('#modal_manual').modal();
}
    // funcion para limpiar una firma dibujada
    function limpiarSingArea(){
        $('#signArea').signaturePad().clearCanvas();
    }

function firmarSubirDocumento(){
    vistacargando('m','Por favor espere....');
    $('#input_subirDocumento').val('');
    $('#text_subir_doc_manual').val('');
    $('#vista_doc_firmado').html('');
    $("#modal_metodo_firma").modal("hide");
    $('#input_subirDocumento').html('');
    $('#text_subir_doc_manual').html('');

    setTimeout(() => {
        $('#modal_subir_documento_firmado').modal('show');  
        vistacargando();  
    }, 500); 
}


$(".input_subirDocumento").change(function(e){
    if(e.target.files.length>0){
    // obtenemos y mostramos el nombre del documento seleccionado
        var nombreDocSelc = $(this)[0].files[0].name;
    // validamos la extencion del documeto
        var tipoDocSalec = nombreDocSelc.split('.').pop(); // obtenemos la extención del documento
        if(tipoDocSalec != 'pdf' && tipoDocSalec !='PDF'){
            alertNotificar(`El formato del documento .${tipoDocSalec} no está permitido`, "error");
            return;
        }
        $('#text_subir_doc_manual').val(nombreDocSelc);
        $('#vista_doc_firmado').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
    }else{
        $('#vista_doc_firmado').html(``);

    }
});

$("#form_subir_documento_firmado").submit(function(e){ 
    e.preventDefault();
    $("#modal_subir_documento_firmado").modal("hide");
    var FrmData = new FormData(this);
    $.ajaxSetup({
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
    });
    vistacargando('M','Subiendo documento...'); // mostramos la ventana de espera
    $.ajax({
        url: "/mantenimiento/subirArchivoFirmado",
        method: 'POST',
        data: FrmData,
        dataType: 'json',
        contentType:false,
        cache:false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }   
            alertNotificar(data['detalle'],'success');
            location.reload();                           
        },
        error: function(){
            vistacargando();
            alertNotificar("Incovenientes al procesar solicitud", "error");
        }
    }).fail(function(){
        alertNotificar('Incovenientes al procesar solicitud','error');
        vistacargando();
    });
});


    $("#frm_asignarFirma").submit(function(e){
        e.preventDefault();
        vistacargando("M", "Espere...");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var FrmData = new FormData(this);

        html2canvas([document.getElementById('sign-pad')], {
            onrendered: function (canvas) {
                var canvas_img_data = canvas.toDataURL('image/png');
                var img_data = canvas_img_data.replace(/^data:image\/(png|jpg);base64,/, "");

                FrmData.append("b64_firma",img_data);
                //ajax call to save image inside folder
                $.ajax({
                    url: '/mantenimiento/guardarFirma',
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    success: function(data){
                        if(data['error']==true){
                            alertNotificar(data['detalle'],'error');
                            vistacargando();
                            return;
                        }   
                        alertNotificar(data['detalle'],'success');
                        location.reload();                           
                    }
                }).fail(function(){            
                    alertNotificar("Error el enviar la información", "error");
                    vistacargando();
                });
            }
        }); 


    });
  


    // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#datatable').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#datatable').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });
    
 function reemplazarArchivo(id){
     $('#idmante_archivo').val(id);
     $('#generar_archivo_nuevamente').modal('show');


 }   
 
 function cerrar(){
     $('#idmante_archivo').val('');
     $('#generar_archivo_nuevamente').modal('hide');
 }

 function btn_eliminarmant(id) {
    swal({
        title: "",
        text: "¿Esta seguro que desea eliminar el registro?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            vistacargando("M", "Eliminando registro...");
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url:'/mantenimiento/registro/'+id, 
                method: 'DELETE',              
                dataType: 'json',
                success: function(data) 
                {
                    if(data['error']==true){
                        alertNotificar(data['detalle'],'danger');
                        vistacargando();
                        return;
                    }
                    alertNotificar(data['detalle'],'success');
                    cargar_tabla();
                    vistacargando();
                }, error:function () {
                    alertNotificar('Inconvenientes al eliminar registro','danger');
                    vistacargando();
                }
            });
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
  }
  

function revertir_firmado(id) {
    swal({
        title: "",
        text: "¿Esta seguro que desea revertir la firma registro?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, revertir!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
            vistacargando("M", "Revirtiendo firma...");
            $.get('/mantenimiento/revertir_firmado/'+id, function (data){
                if(data['error']==true){
                    alertNotificar(data['detalle'],'error');
                    vistacargando();
                    return;
                }
                alertNotificar(data['detalle'],'success');
                cargar_tabla();
                vistacargando();
            }).fail(function(){
                alertNotificar('Inconvenientes al revertir firma','error');
                vistacargando();
            });
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}
  








  // si ingresa un chofer inexistente


function buscarVehiculo(input){
        // validamos para ocultar el contenido de busqueda cuando
        var busqueda = $(input).val();
        var conten_busqueda = $(input).siblings('.conten_busqueda');
        var div_content = $(conten_busqueda).children('.div_content');
         $(conten_busqueda).hide();
         
         $('#idvehiculog').val('');
         $('#vehiculosListaCombustible').empty(); // limpiamos la tabla
        //$('detallevehiculo').addClass('hidden');

        $.get('/salvoConducto/buscar_vehiculo/'+busqueda, function (data){
            if(data.error==true){

            }
            else{
              $('#vehiculosListaCombustible').empty();
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
        $('#buscar').val(descripcion+" "+ci+" ["+placa+"]");
        $('#idvehiculog').val(idvehiculo);
        // cargartarea(idvehiculo);
        // medicion(idvehiculo);
        // chofer(idvehiculo);
    
}

function buscarChofer(input){
        // validamos para ocultar el contenido de busqueda cuando
        var busqueda = $(input).val();
        var conten_busqueda_chof = $(input).siblings('.conten_busqueda_chof');
        var div_content = $(conten_busqueda_chof).children('.div_content2');
         $(conten_busqueda_chof).hide();
         
         $('#idchofersel').val('');
         $('#choferlista').empty(); // limpiamos la tabla
        //$('detallevehiculo').addClass('hidden');

        $.get('/mantenimiento/buscar_chofer/'+busqueda, function (data){
            if(data.error==true){

            }
            else{
              $('#choferlista').empty();
              $('#idchofersel').val('');
             
              $.each(data.resultado, function(i, item){
                
                
                $(conten_busqueda_chof).show();
                $('#choferlista').append(
                 
                   `<button class='dropdown-item' style="width:100%;height:40px;background-color:white;
                   border-color:white;text-align:left;font-size:14px;color:black"type='button' onclick="capturarChofer('${item.idus001}','${item.usuario.name}','${item.usuario.cedula}')">` +
                  '<i class="fa fa-user"></i>   ' + item.usuario.name+'   <label style="float:right" ><i class="fa fa-closed-captioning"></i> ' + item.usuario.cedula + '</label>' +
                  '</button>' +
                  '<div class="dropdown-divider"></div>'
                );
            }); 
            } 
        });
} 



function capturarChofer(id,nombre,cedula){
          
          $('.conten_busqueda_chof').hide();
          $('#buscarchofer').val(nombre);
          $('#idchofersel').val(id);
          // cargartarea(idvehiculo);
          // medicion(idvehiculo);
          // chofer(idvehiculo);
    
}

$('#cmb_tipo').on('change', function() {

        // var chofer=$('#idchofersel').val();
        // if(chofer==''){
        // $('#buscarchofer').val('');
        // $('.optiontipo1').prop('selected',false); // deseleccionamos
        // $('.optiontipo2').prop('selected',false); // deseleccionamos
        // $("#cmb_tipo").trigger("chosen:updated"); // actualizamos el combo 
        // alertNotificar('Ingrese un Chofer Existente')
        // }

        var vehiculo=$('#idvehiculog').val();
        if(vehiculo==''){
        $('#buscar').val('');
        $('.optiontipo1').prop('selected',false); // deseleccionamos
        $('.optiontipo2').prop('selected',false); // deseleccionamos
        $("#cmb_tipo").trigger("chosen:updated"); // actualizamos el combo 
        alertNotificar('Ingrese un Vehículo Existente')
        }

        if($('#cmb_tipo').val()=='Correctivo'){
          $('#descripcion_soli').removeClass('hidden');
        }
        else{
           $('#descripcion_soli').addClass('hidden');
           $('#descripcion').val('');
        }

          


})

function verdetallesoli(id){
    vistacargando('m','Por favor espere...');
    $.get("/mantenimiento/registro/"+id, function (data) {
        vistacargando();
          $('#DetalleMant').modal("show");
          // cargo los datos en la seccion correspondiente (seccion vehiculo)      
          $('#vehiculodetalle').html(data.resultado.vehiculo.descripcion+" # "+data.resultado.vehiculo.codigo_institucion +" ["+ data.resultado.vehiculo.placa+']');
          $('#departamentodetalle').html(data.resultado.vehiculo.departamento.nombre);
          // cargo los datos en la seccion correspondiente (seccion chofer)      
          $('#chofersolicita').html(data.resultado.chofer.usuario.name);
          $('#fechasolicitud').html(data.resultado.fecha_solicitud_mantenimento);
          // cargo los datos en la seccion correspondiente (seccion motivo solicitud mantenimiento)      
          $('#tipodetalle').html(data.resultado.tipo);
          if(data.resultado.tipo=='Correctivo'){
            $('#observacióndetalle').html('Solicitando la revisión técnica de '+data.resultado.descripcion);
          }
          else{
              $('#observacióndetalle').html('Solicitando realizar un mantenimiento preventivo');
          }

          if(data.resultado.estado_revision_soli=="Pendiente"){
            $('#fechaprobacionform_').hide();
            $('#fecharevision').html('');
            $('#usuarioform_').hide();
            $('#mecanicorevisa').html('');

          }

          else{
            $('#fechaprobacionform_').show();
            $('#fecharevision').html(data.resultado.fecha_revision_solicitud);
            $('#usuarioform_').show();
            $('#mecanicorevisa').html(data.resultado.mecanico.usuario.names);


          }
          $('#smsMant').addClass('hidden');
          
    });

}

function verdocumento(codigo,ruta){
         var iframe=$('#iframePdf');
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo").attr("href", '/mantenimiento/descargar/'+codigo);
         $("#documento_soli_mant").modal("show");
}

$('#documento_soli_mant').on('hidden.bs.modal', function (e) {
         
          var iframe=$('#iframePdf');
          iframe.attr("src", null);

});

$('#descargar').click(function(){
         $('#documento_soli_mant').modal("hide");
});


  ////////////////////////////////////////////////////////////////////////////////////////////////


function Aprobacion(){

         $('#smsMant').addClass('hidden');
                  
         $("#btn_modal_cerrar_con").attr("disabled", false);
                
           //verficamos si hay documentos seleccionados
         var informeaux = $("#listaSoli").find(".check_documento:checked");
         if(informeaux.length==0){
            alertNotificar("Primero seleccione un informe", "default"); return;
         }
         $('#modal_aprobar_tramite').modal('show');

}

// function firmarManual(){

//          var informeaux_aux_manual = $("#listaSoli").find(".check_documento:checked");
//          if(informeaux_aux_manual.length==0){
//                  alertNotificar("Primero seleccione un informe", "default"); return;
//          }

//          if(informeaux_aux_manual.length>=2){
//                  alertNotificar("Solo se puede subir un archivo, por favor seleccione solo un informe", "default"); return;
//          }

//          $("#content_informe_maual").html(""); //quitamos los antiguos
//          $.each(informeaux_aux_manual, function(index, periodo){
//          $("#content_informe_maual").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
//          })
//          $('#modal_aprobar_tramite').modal('hide');
//          setTimeout(() => {
//          $('#modal_subir_documento_firmado').modal('show');
//          }, 500);

// }

// $("#form_subir_documento_firmado").submit(function(e){ 
                
//             e.preventDefault();

//             $("#modal_subir_documento_firmado").modal("hide");

//             //-------------------------------------------

//               var FrmData = new FormData(this);
              
//               $.ajaxSetup({
//                   headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
//               });
              
//               vistacargando('M','Subiendo documento...'); // mostramos la ventana de espera

//               $.ajax({
//                   url: "/mantenimiento/subirArchivoFirmado",
//                   method: 'POST',
//                   data: FrmData,
//                   dataType: 'json',
//                   contentType:false,
//                   cache:false,
//                   processData:false,
//                   success: function(retorno){

//                      vistacargando(); // ocultamos la ventana de espera          

//                      actualizar_tabla();
                     
//                      if(retorno['error']==true){
//                         $('#infoFirma').html('');
//                         $('#infoFirma').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
//                                     <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
//                                     </button>
//                                     <strong>¡Atención!</strong> ${retorno['mensaje']}
//                                   </div>`);
//                         $('#infoFirma').show(200);
//                         setTimeout(function() {
//                         $('#infoFirma').hide(200);
//                         },  3000);
//                         vistacargando();
//                         return false;

//                      }   
//                      else{
//                       //llenar(cedula);
//                           $('#infoFirma').html('');
//                           $('#infoFirma').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
//                                       <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
//                                        </button>
//                                        <strong>¡Atención!</strong> ${retorno['mensajeok']}
//                                         </div>`);
//                           $('#infoFirma').show(200);
//                           setTimeout(function() {
//                           $('#infoFirma').hide(200);
//                           },  3000);
//                           vistacargando();
//                           return false;
//                      }                                           

                     
                      
//                   },
//                   error: function(error){
//                       vistacargando(); // ocultamos la ventana de espera
//                       alertNotificar("Error al obtener la información de los informes", "error");
//                       actualizar_tabla();
                      
                     
                      
//                   }
//               });


//         });


function firmaElectronica(){


            var informeaux_aux = $("#listaSoli").find(".check_documento:checked");
              if(informeaux_aux.length==0){
                 alertNotificar("Primero seleccione un informe", "default"); return;
              }
              $("#content_informe").html(""); //quitamos los antiguos
              $.each(informeaux_aux, function(index, periodo){
              $("#content_informe").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
              })

               $('#modal_aprobar_tramite').modal('hide');
               vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
                $.get("/tareasVehiculos/verificarConfigFirmado/", function(retorno){
                
                vistacargando();
                $("#informacion_certificado_cons").html("");

                if(!retorno.error){ // si no hay error

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar").html("¿Está seguro que desea generar y firmar el documento?");
                    }

                    // verificiamos la vigencia del certificado
                    vertificado_vigente = false;
                    if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
                        vertificado_vigente = true;
                    }


                    // cargamos el input para subir el certificado
                    if(config_firma.archivo_certificado==true && vertificado_vigente==true){
                        $("#content_archivo_certificado").hide();
                    }else{
                        $("#content_archivo_certificado").show();
                    }

                    // cargamos el input para la contraseña
                    if(config_firma.clave_certificado==true && vertificado_vigente==true){
                        $("#content_clave_certificado").hide();                        
                    }else{
                        $("#content_clave_certificado").show();
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
                            
                            $("#informacion_certificado").html(`
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
                    $("#modal_firma_electronica").modal("show");
                    
                }else{
                    alertNotificar(retorno.mensaje, retorno.status);

                }
            }).fail(function(){
               
                vistacargando(); 
                alertNotificar("No se pudo completar la acción", "error");

            });

}

$("#frm_firma_electronica").submit(function(e){ 
                
            e.preventDefault();

            $("#modal_firma_electronica").modal("hide");

            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Firmando documento(s)...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/mantenimiento/generarFirma",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(retorno){

                     vistacargando(); // ocultamos la ventana de espera          

                     actualizar_tabla();
                     
                     if(retorno['error']==true){
                        $('#infoFirma').html('');
                        $('#infoFirma').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>¡Atención!</strong> ${retorno['mensaje']}
                                  </div>`);
                        $('#infoFirma').show(200);
                        setTimeout(function() {
                        $('#infoFirma').hide(200);
                        },  3000);
                        vistacargando();
                        return false;

                     }   
                     else{
                      //llenar(cedula);
                          $('#infoFirma').html('');
                          $('#infoFirma').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                       </button>
                                       <strong>¡Atención!</strong> ${retorno['mensajeok']}
                                        </div>`);
                          $('#infoFirma').show(200);
                          setTimeout(function() {
                          $('#infoFirma').hide(200);
                          },  3000);
                          vistacargando();
                          return false;
                     }                                           

                     
                      
                  },
                  error: function(error){
                      vistacargando(); // ocultamos la ventana de espera
                      alertNotificar("Error al obtener la información de los informes", "error");
                      actualizar_tabla();
                      
                     
                      
                  }
              });


        });



  // // FUNCION PARA SELECCIONAR UN ARCHVO --------------

    $("#archivo_certificado").click(function(e){
        $(this).parent().siblings('input').val($(this).parent().prop('title'));
        this.value = null; // limpiamos el archivo
    });

    $("#archivo_certificado").change(function(e){
        //alert("DDDDD");

        if(this.files.length>0){ // si se selecciona un archivo

            //verificamos si es un archivo p12
            if(this.files[0].type != "application/x-pkcs12"){
                alertNotificar("El archivo del certificado debe ser formato_ .p12", "default");
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
$('#frm_Mantenimiento').on('submit', function(e) {
    vistacargando('m','Registrando solicitud...');
})