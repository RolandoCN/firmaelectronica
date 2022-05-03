$(document).ready(function () {
  $('#signArea').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:90});
  $('#signArea_edit').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:90});
});
function actualizar_tabla(){
  $('#listaSoli').html('');
  $("#datatable_revision").DataTable().destroy();
  $('#datatable_revision tbody').empty();
  vistacargando('m','Cargando información...');
  $.get("/revision/tablasolicitud/1", function (data) {
        vistacargando();
        $.each(data['resultado'],function(i,item){
            var estado=""
            var botones='';
            var botonesdoc='';

            if(item['estado_revision_soli']=='Pendiente'){
              estado = (`<span style="min-width: 50px !important;" class="label label-warning estado_firma"><i class="fa fa-check-circle"></i> Por diagnosticar</span>`);
              botones=`<button  type="button" onclick="verdetalle('${item['idmv_mantenimiento']}')" data-toggle="tooltip" data-original-title="Diagnóstico técnico" class="btn btn-sm btn-success "><i class="fa fa-wrench"></i> Diagnosticar 
                      </button>
                      
                      <button  type="button" onclick="enviar_revision('${item['idmv_mantenimiento_encrypt']}')" data-toggle="tooltip" data-original-title="Devolver solicitud" class="btn btn-sm btn-danger "><i class="fa fa-mail-reply"></i> Devolver 
                      </button>
                      </center> `;
              botonesdoc=` <button  type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
              </button> `;

                      
            }else if(item['estado_revision_soli']!='Pendiente'){
              if(item['estado_mecanico']=='A'){
                estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Firmado</span>`);
                botones=`<button  type="button" class="btn btn-sm btn-danger "data-toggle="tooltip" data-original-title="Recuperar" onclick="recuperar_revision('${item['idmv_mantenimiento_encrypt']}')"><i class="fa fa-share"></i> Recuperar</button>
                        </center>`;
                botonesdoc=`   <button  type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                </button>
                <button  onclick="verrevision('${item['ruta_informe_revision']}','${item['idmv_mantenimiento_encrypt']}')"  type="button" data-toggle="tooltip" data-original-title="Ver diagnóstico" class="btn btn-sm btn-warning "><i class="fa fa-file"></i> Diagnóstico 
                </button> `;
              }else{
                  if(item['estado_mecanico']=='R'){
                    estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Firmado</span>`);
                    botones=`<button  type="button" class="btn btn-sm btn-warning "data-toggle="tooltip" data-original-title="Volver a firmar" onclick="revertir_firmado('${item['idmv_mantenimiento_encrypt']}')"><i class="fa fa-refresh"></i> Volver a firmar</button>
                            </center>`;
                    botonesdoc=`   <button  type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                    </button>
                    <button  onclick="verrevision('${item['ruta_informe_revision']}','${item['idmv_mantenimiento_encrypt']}')"  type="button" data-toggle="tooltip" data-original-title="Ver diagnóstico" class="btn btn-sm btn-warning "><i class="fa fa-file"></i> Diagnóstico 
                    </button> `;
                }else{
                  estado = (`<span style="min-width: 50px !important;" class="label label-warning estado_firma"><i class="fa fa-check-circle"></i> Por firmar</span>`);
                  botones=`<button  type="button" onclick="metodofirma('${item['codigo_mantenimiento']}','${item['idmv_mantenimiento_encrypt']}')" data-toggle="tooltip" data-original-title="Firmar Documento" class="btn btn-sm btn-success "><i class="fa fa-magic"></i> Firmar 
                          </button>
                        
                          <button  type="button" onclick="revertir_revision('${item['idmv_mantenimiento_encrypt']}')" data-toggle="tooltip" data-original-title="Revertir revisión" class="btn btn-sm btn-warning "><i class="fa fa-refresh"></i> Revertir diagnóstico 
                        </button>`;
                  botonesdoc=`   <button  type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                  </button>
                  <button  onclick="verrevision('${item['ruta_informe_revision']}','${item['idmv_mantenimiento_encrypt']}')"  type="button" data-toggle="tooltip" data-original-title="Ver diagnóstico" class="btn btn-sm btn-warning "><i class="fa fa-file"></i> Diagnóstico 
                  </button> `;
                }
              }
                
        
            } else{
                estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Firmado</span>`);
                botones=`<button  type="button" class="btn btn-sm btn-warning "data-toggle="tooltip" data-original-title="Eliminar" onclick="revertir_firmado('${item['idmv_mantenimiento_encrypt']}')"><i class="fa fa-refresh"></i> Revertir</button>
                        </center>`;
                botonesdoc=`   <button  type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                </button>
                <button  onclick="verrevision('${item['ruta_informe_revision']}','${item['idmv_mantenimiento_encrypt']}')"  type="button" data-toggle="tooltip" data-original-title="Ver diagnóstico" class="btn btn-sm btn-warning "><i class="fa fa-file"></i> Diagnóstico 
                </button> `;
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
                                        
                                        
                                        <td width="5%" style=" vertical-align: middle; text-align:center "  class="paddingTR">
                                            ${estado}
                                        </td>
                                        <td  style=" vertical-align: middle; text-align:center "  class="paddingTR">
                                            ${botonesdoc}
                                        </td>
                                        <td style="text-align: center; vertical-align: middle;"  class="paddingTR">
                                            <center>
                                            ${botones} 
                                        </td>
                                    </tr>  `);
        });
        cargar_estilos_tabla("datatable_revision");
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
  "zeroRecords": "No se encontraron registros",
  "infoEmpty": "No hay registros para mostrar",
  "infoFiltered": " - filtrado de MAX registros",
  "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
  "paginate": {
      "previous": "Anterior",
      "next": "Siguiente"
  }
};

function cargar_estilos_tabla(idtabla,page=10){

  $(`#${idtabla}`).DataTable({
      dom: ""
      +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
      +"<rt>"
      +"<'row'<'form-inline'"
      +" <'col-sm-6 col-md-6 col-lg-6'l>"
      +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
      "destroy":true,
      order: [[ 1, "desc" ]],
      pageLength: page,
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

function verdocumento(codigo,ruta){
  var iframe=$('#iframePdf_memo');
  iframe.attr("src", "visualizarDoc/"+ruta);   
  $("#vinculo_memo_rev").attr("href", '/mantenimiento/descargar/'+codigo);
  $("#documento_soli_mant").modal("show");
}


function enviar_revision(id){
  swal({
      title: "¿Está seguro que desea enviar a revisión?",
      html: true,
      text: `<textarea  rows="6" style="resize:none" placeholder="Ingrese la observación" class="form-control" cols="50" id="obsevacion_aprobacion"></textarea>`,
      // type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonClass: "btn-sm btn-success",
      cancelButtonClass: "btn-sm btn-default",
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
  }, function () {
      if ($('#obsevacion_aprobacion').val()=='' ){
          alertNotificar('Por favor llenar todos los campos','error'); 
          return false;
      }
      guardar_revision(id, $('#obsevacion_aprobacion').val());
      sweetAlert.close();        
  });
}
//revision para devolucion
function guardar_revision(id,observacion){
  vistacargando('M','Por Favor Espere..');
  $.ajaxSetup({
      headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
  });
  $.ajax({
      url: `/revision/enviar_revision_mecanico`,
      method: "POST",
      data: {
          'id':id,
          'observacion':observacion,},
      success: function(data){

          if(data['error']==true){
              alertNotificar(data['detalle'],'error');
              vistacargando();
              return;
          }
          alertNotificar(data['detalle'],'success');
          vistacargando();
          actualizar_tabla();
      },
      error: function(){
          alertNotificar("Ocurrió un error intente nuevamente", "error");    
          vistacargando();                
      }
  });
}
 
//Para mostrar los detalles y asignar repuewstos... servicios..areas..(Revision)
function verdetalle(id){
    vistacargando('M','Espere...'); 
    $.get("/revision/registro/"+id, function (data) {
        if(data['error']==true){
          actualizar_tabla();
          alertNotificar('')
          $('#infoFirma').html(data['message'],'error');
          vistacargando();
          return;
        }
        //mando el idmantenimento a revisar
        $('#idmantenimiento').val(data.resultado.idmv_mantenimiento_encrypt);
        // cargo los datos en la seccion correspondiente (seccion vehiculo)      
        $('#vehicudodetalle2').html(data.resultado.vehiculo.descripcion+" # "+data.resultado.vehiculo.codigo_institucion +" ["+ data.resultado.vehiculo.placa+']');
        $('#departamentomodal2').html(data.resultado.vehiculo.departamento.nombre);
        // cargo los datos en la seccion correspondiente (seccion chofer)      
        $('#choferdetalle2').html(data.resultado.chofer.usuario.name);
        $('#fechasolicituddetalle2').html(data.resultado.fecha_solicitud_mantenimento);
        // cargo los datos en la seccion correspondiente (seccion motivo solicitud mantenimiento)      
        $('#tipodetallle2').html(data.resultado.tipo);
        //dpcumentyo memo
        // $('#memorando').append(`<button type="button" onclick="verdocumentoartesano('${data.resultado.ruta_informe_solic}')" class="btn btn-sm btn-primary pull-left" ><i class="fa fa-eye"></i> </button>`);

        if(data.resultado.tipo=='Correctivo'){
          $('#detalle2').html('Solicitando la revisión técnica de '+data.resultado.descripcion);
        }else{
            $('#detalle2').html('Solicitando realizar un mantenimiento preventivo');
        }

        if(data.resultado.reprobacion_orden!=null){
          $('#panel_rechazo').removeClass('hidden');
          $('#usuario_rechazo').html(data.resultado.usuarioorden.name);
          $('#detalle_rechazo').html(data.resultado.reprobacion_orden);
        }else{
          $('#panel_rechazo').addClass('hidden');
          $('#usuario_rechazo').html('');
          $('#detalle_rechazo').html('');
        }
        $('#smsmRevision').addClass('hidden');

        
      tabla_area();
      tabla_servicio();
      agg_fila_sms();
        $('#datos').hide(300);
        $('#detalle').show(300);
      vistacargando();
    }).fail(function(){
      alertNotificar('m','Ocurrió un error intente nuevamente');
      vistacargando();
    });
}

function tabla_area(){
  $('#listaSolic_areadiag').html('');
  $("#datatable_area_diag").DataTable().destroy();
  $('#datatable_area_diag tbody').empty();
  $('#listaSolic_areadiag').html( `<tr><td colspan="2"><center>Cargando Información......</center></td></tr>`);
  $.get("/revision/buscar_area", function (data) {
    $('#listaSolic_areadiag').html('');
    var nf = data.resultado.length;
    if(nf === 0){
        //tabla de repuesto
          $('#listaSolic_areadiag').append(
            `<tr id="tr_rep_0">
                <td colspan="2"><center>Sin datos que mostrar</center></td>
          </tr>`);
    }else{
        $.each(data.resultado, function(i,item){
          $('#listaSolic_areadiag').append(
            `<tr id="tr_${i}">
                <td>${item.descripcion}</td>
                <td align="center">
                    <label for="ckeckarea2${i}" style="min-width: 50px !important; margin-bottom: 0px;">
                        <input style="width:18px;height:18px;;cursor: pointer;" id="ckeckarea2${i}" type="checkbox" name="area_agre[]"class=" check_documento3" value="${item.idmv_vehiculo_area_diagnosticada}">
                        <span style="padding-top: 5px;"></span>
                    </label>
                </td>
              </tr>`);
              $(`#ckeckarea2${i}`).click(function(){
                if($(`#ckeckarea2${i}`).prop('checked')){
                  $(`#tr_${i}`).css('background-color','#ddffdd');
                }else{
                  $(`#tr_${i}`).css('background-color','white');
                }
              });
        });
    }
    cargar_estilos_tabla('datatable_area_diag','40');
  })
}

////////////tabla servicio///////////////////
function tabla_servicio(){
  $('#listaserv').html('');
  $("#datatable_serv").DataTable().destroy();
  $('#datatable_serv tbody').empty();
  $.get("/revision/buscar_servicio", function (data) {
    $('#listaserv').html('');
    var nf = data.resultado.length;
      if(nf === 0){
              $('#listaserv').append(
                `<tr id="tr_rep_0">
                    <td colspan="2"><center>Sin datos que mostrar</center></td>                        
              </tr>`);
      }else{
          $.each(data.resultado, function(i,item){
              $('#listaserv').append(
              `<tr id="tr_serv${i}">
                  <td>${item.detalle}</td>
                  <td align="center"><label for="ckeckarea_ser${i}" style="min-width: 50px !important; margin-bottom: 0px;">
                                            <input style="width:18px;height:18px;;cursor: pointer;" id="ckeckarea_ser${i}" type="checkbox" name="servicio_agg[]"class=" check_documento3" value="${item.idmv_servicio}">
                                            <span style="padding-top: 5px;"> </span>
                        </label>
                  </td>
                </tr>`);
              $(`#ckeckarea_ser${i}`).click(function(){
                if($(`#ckeckarea_ser${i}`).prop('checked')){
                  $(`#tr_serv${i}`).css('background-color','#ddffdd');
                }else{
                  $(`#tr_serv${i}`).css('background-color','white');
                }
              });
          });
      }
    cargar_estilos_tabla('datatable_serv','40');
  }) 
}

function agg_fila_sms(){
    //tabla de carrito repuesto
    $('#listaRepuestoAgg').append(
         `<tr id="tr_rep_0">
          <td colspan="3"><center>Sin datos que mostrar</center></td>
        </tr>`);
}

function eliminar_fila_sms(){
  quitarRepuestoSeleccionado(0);
}

//Para salir de la vista detalle y volver al listado vista principal
function salirDetalle(){
  $('#detalle').hide(300);
  $('#datos').show(300);
  limpiardetallerevision();
  $('#listaSolic').html('');
  $('#listaRepuesto').html('');
  $('#listaserv').html('');
}
 


// funcion para quitar elementos o filas del carrito repuesto
function quitarRepuestoSeleccionado(id){
    $("#tr_rep_" + id).remove();
    var nr = $("#listaRepuestoAgg tr").length;
    //alert(nr);
    if(nr==0 && id!=0){
      agg_fila_sms();
    }

}
    

function revertir_revision(idmantenimento){
  swal({
      title: "",
      text: 'Desea revertir la revisión',
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn-danger",
      confirmButtonText: 'Si, revertir',
      cancelButtonText: "No, cancela!",
      closeOnConfirm: false,
      closeOnCancel: false
  },
  function(isConfirm) {
      if (isConfirm) { 
        vistacargando('m','Revirtiendo, espere por favor....');
        $.get('/revision/revertirrevision/'+idmantenimento,function(data){
              if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
              }
              alertNotificar(data['detalle'],'success');
              actualizar_tabla();
              vistacargando();

        }).fail(function(){
          alertNotificar('Ocurrió un error intente nuevamente');
          vistacargando();
        });
      }
      sweetAlert.close();   // ocultamos la ventana de pregunta
  }); 
}

//recuperar cuando se haya firmado y enviado
function recuperar_revision(idmantenimento){
  swal({
      title: "",
      text: 'Desea recuperar la solicitud',
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn-danger",
      confirmButtonText: 'Si, recuperar',
      cancelButtonText: "No, cancela!",
      closeOnConfirm: false,
      closeOnCancel: false
  },
  function(isConfirm) {
      if (isConfirm) { 
        vistacargando('m','Revirtiendo, espere por favor....');
        $.get('/revision/recuperar_revision/'+idmantenimento,function(data){
              if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
              }
              alertNotificar(data['detalle'],'success');
              actualizar_tabla();
              vistacargando();

        }).fail(function(){
          alertNotificar('Ocurrió un error intente nuevamente');
          vistacargando();
        });
      }
      sweetAlert.close();   // ocultamos la ventana de pregunta
  }); 
}



function metodofirma(solicitud,solicitud_encrypt){
  $('#solicitud_modal_firma').html('Código: '+solicitud);
  $('#idsolicitud_encrypt').val(solicitud_encrypt);
  $('#solicitud_modal_firma_manual').html('Código: '+solicitud);
  $('#idsolicitud_encrypt_firma').val(solicitud_encrypt);
  $('#descargar_doc_firma').html(`<p > <a  data-toggle="tooltip" data-placement="right" title="Recuerde que puede descargar el documento y firmarlo." id="btn_descargar_documento_firmar" class="btn btn-info btn-sm"  id="btn_descargar_documento_firmar" href="/revision/descargar/${solicitud_encrypt}" class="btn btn-info btn-sm" ><i class="fa fa-download"></i> Descargar documento</a></p>`);
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
      url: "/revision/subirArchivoFirmado",
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
          $.get('/revision/revertir_firmado/'+id, function (data){
              if(data['error']==true){
                  alertNotificar(data['detalle'],'error');
                  vistacargando();
                  return;
              }
              alertNotificar(data['detalle'],'success');
              actualizar_tabla();
              vistacargando();
          }).fail(function(){
              alertNotificar('Inconvenientes al revertir firma','error');
              vistacargando();
          });
      }
      sweetAlert.close();   // ocultamos la ventana de pregunta
  }); 
}

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
              url: '/revision/guardarFirma',
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

    //////////////////si ingresa un chofer inexitsne///////////////////////////////////////////////////////

    // $('#conductormcodal').on('change', function() {


    ////////////////////////////////////////////////////
    

    $("#frm_Revision").submit(function(e){ 

              e.preventDefault();

              var FrmData = new FormData(this);

              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Espere...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/revision/registro",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(data){

                   // salirDetalle();

                     vistacargando(); // ocultamos la ventana de espera          
                      if(data['error']==true){
                        alertNotificar(data['detalle'],'error');
                        vistacargando();
                        return;
                      }
                      alertNotificar(data['detalle'],'success');
                      actualizar_tabla();
                      salirDetalle();
                      vistacargando();
                      $('html,body').animate({scrollTop:$('#administradorDiag').offset().top},400);
                      
                  },
                  error: function(){
                      vistacargando(); // ocultamos la ventana de espera
                      alertNotificar("Ocurrió un error", "error");
                  }
              });


    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    function limpiardetallerevision(){

        $('#idmantenimiento').val('');
        $('#observacionmecanico').val('');
        $('#listaRepuestoAgg').html('');
        //$('#listaRepuesto').html('');
        $('#idmecanicosel').val('');
        $('#buscadormecanico').val('');
        $('#choferlista').empty();
        datos_servicio();
        //datos_areas();

        $('#datatable2').delegate('input','ifChecked', function(event){
          $(this).parents('tr').iCheck('uncheck');
         // actualizar_actividad($(this).val(),this);       
      });



    }

    function datos_servicio(){
      id=1;
      $.get("/servicios/cargacomboservicio/"+id, function (data) {

        $.each(data.resultado, function(i,item){
          console.log(item);
          if($('#ckeckserv'+item.idmv_servicio).prop('checked')){
            $('#ckeckserv'+item.idmv_servicio).iCheck('uncheck');
          }


        })



      })
    }

    function datos_areas(){
      id=1;
      var nr = $("#datatable2 tr").length;
      alert(nr);
      $.get("/revision/datosareas/"+id, function (data) {

        $.each(data.resultado, function(i,item){
          console.log(item);
          if($('#ckeckarea'+item.idmv_vehiculo_area_diagnosticada).prop('checked')){
            $('#ckeckarea'+item.idmv_vehiculo_area_diagnosticada).iCheck('uncheck');
          }


        })



      })
    }

   

  // //funcion para mostrar modal ver repuesto y añadir dicho repuesto con la cantidad
  // function add_car(id,repuesto,stock){
    
  //   $('#modal_add_rep').modal('show');
  //   $('#repuesto_add').val(repuesto);
  //   $('#stock').val(stock);
  //   $('#idrep').val(id);

  //   var idrepuesto_ya_agg=$('#repuesto_agg_'+id).val();
    
  //   // Si el repuesto ya esta agg en el carrito cargamos al campo cantidad el valor seleccionado
  //   if(idrepuesto_ya_agg>=0){
  //     var cantidad_anterior=$('#cantidad_agg_'+id).val();
  //     $('#cantidad').val('');
  //     $('#valorviejo').val(cantidad_anterior);
  //   }
  //   //caso contrario lo limpiamos
  //   else{
  //     $('#cantidad').val('');
  //     $('#valorviejo').val('');
  //   }
  //   console.log('viejo'+$('#valorviejo').val());
  // }

  

  //mostrar todos los repuestos cuando cargue la pagina
  // function cargarTodosRepuesto(){
  //    var busqueda='*';
  //    //vistacargando('M','Espere...');
  //    $.get('/revision/buscar_repuesto/'+busqueda, function (data){
      
  //          $('#listaRepuesto').html('');
  //           //console.clear();
  //          console.log(data);

  //          var nf = data.resultado.length;
  //          //alert(nf);

  //          if(nf === 0){
  //            //tabla de repuesto
  //             $('#listaRepuesto').append(
  //               `<tr id="tr_rep_0">
  //                    <td colspan="2"><center>Sin datos que mostrar</center></td>
                     
                     
  //              </tr>`);
  //          }
 
  //         else{ 
  //           $.each(data.resultado, function(i,item){
            
  //           if(item.descripcion==null){var detall=""; var stock_aux=""}
  //           else{var detall=item.descripcion; var stock_aux=item.stock_solicitud;}
              
  //            $('#listaRepuesto').append(
  //            `<tr>
  //                <td>${detall}</td>
  //                <td><center>${stock_aux}
                 
  //                   <button type="button" onclick="add_car('${item.idmv_repuestos}','${item.descripcion}','${item.stock_solicitud}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-shopping-cart"></i></button>
                   
  //                   </center>

  //                </td>
                

                 
  //                </tr>`);
            
        

  //        });

  //       vistacargando();
  //       }

  //   })



  // }

    //mostrar todos los repuestos cuando cargue la pagina
  // function buscarRepuesto(input){
  //    //var busqueda='*';
  //    var busqueda = $(input).val();

  //    if(busqueda==''){
  //         busqueda='*';
  //    }
  //    $.get('/revision/buscar_repuesto/'+busqueda, function (data){
  //           $('#listaRepuesto').html('');
  //           //console.clear();
  //            console.log(data);

  //            var nf = data.resultado.length;
           
  //           if(nf === 0){
  //            //tabla de repuesto
  //             $('#listaRepuesto').append(
  //               `<tr id="tr_rep_0">
  //                    <td colspan="2"><center>Sin datos que mostrar</center></td>
                     
                     
  //              </tr>`);
  //           }
 
  //           else{

  //           $.each(data.resultado, function(i,item){
            
  //           if(item.descripcion==null){var detall=""; var stock_aux=""}
  //           else{var detall=item.descripcion; var stock_aux=item.stock_solicitud;}
              
  //            $('#listaRepuesto').append(
  //            `<tr>
  //                <td>${detall}</td>
  //                <td><center>${stock_aux}
                 
  //                   <button type="button" onclick="add_car('${item.idmv_repuestos}','${item.descripcion}','${item.stock_solicitud}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-shopping-cart"></i></button>
                   
  //                   </center>

  //                </td>
                

                 
  //                </tr>`);
            
        

  //        });
  //       }

  //   })



  // }



      // // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
      // $('#datatable').on( 'draw.dt', function () {
      //   setTimeout(function() {
      //       $('#datatable').find('input').iCheck({
      //           checkboxClass: 'icheckbox_flat-green',
      //           radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
      //       });   
      //   }, 200);
      // });
  
  // function reemplazarArchivo(id){
  //    $('#idmante_archivo').val(id);
  //    $('#generar_archivo_nuevamente').modal('show');


  // }    
 
  // function cerrar(){
  //    $('#idmante_archivo').val('');
  //    $('#generar_archivo_nuevamente').modal('hide');
  // }

  // function verdocumento(codigo,ruta){
  //        console.log(ruta);
  //        console.log(codigo);
  //        var iframe=$('#iframePdf');
  //        // iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
  //        iframe.attr("src", "visualizarDoc/"+ruta);   
  //        $("#vinculo").attr("href", '/revision/descargar/'+codigo);
  //        $("#documento_soli").modal("show");
  // }

  // $('#documento_soli').on('hidden.bs.modal', function (e) {
         
  //         var iframe=$('#iframePdf');
  //         iframe.attr("src", null);

  // });

  // $('#descargar').click(function(){
  //        $('#documento_soli').modal("hide");
  // });




  function verrevision(ruta,codigo){
     var iframe=$('#iframePdf_rev');
     iframe.attr("src", "/revision/visualizarDoc/"+ruta);   
     $("#vinculo_revision").attr("href", '/revision/descargar/'+codigo);
     $("#documento_soli").modal("show");
  }

  $('#documento_soli').on('hidden.bs.modal', function (e) {
          var iframe=$('#iframePdf_rev');
          iframe.attr("src", null);
  });

  $('#vinculo_revision').click(function(){
         $('#documento_soli').modal("hide");
  });




    //  function buscarServicio(input){
    //     // validamos para ocultar el contenido de busqueda cuando
    //     var busqueda = $(input).val();
    //     if(busqueda==''){
    //       busqueda='*';
    //     }
    //     $.get("/revision/buscar_servicio/"+busqueda, function (data) {
    //     console.log(data);

    //     $('#listaserv').html('');

    //     var nf = data.resultado.length;
           
    //     if(nf === 0){
    //          //tabla de repuesto
    //           $('#listaserv').append(
    //             `<tr id="tr_rep_0">
    //                  <td colspan="2"><center>Sin datos que mostrar</center></td>
                     
                     
    //            </tr>`);
    //     }
 
    //     else{

    //     $('#listaserv').html('');
    //     $.each(data.resultado, function(i,item){
            
            
    //          $('#listaserv').append(
    //          `<tr>
    //              <td>${item.detalle}</td>
    //              <td><label for="ckeckarea${item}" style="min-width: 50px !important; margin-bottom: 0px;">
    //                                                      <input type="checkbox" name="servicio_agg[]"class=" check_documento3" value="${item.idmv_servicio}">
    //                                                      <span style="padding-top: 5px;"> Seleccionar</span>
    //                                  </label>

    //              </td>
                

                 
    //              </tr>`);
    //         //  $('input').iCheck({
    //         //       checkboxClass: 'icheckbox_flat-green'
    //         //     });
            
        

    //      });
    //     }

    //   })

 
    // }


  
 //////////////tabla area diagnostico///////////////////////////////

    // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
   
           //FUNCIÓN QUE SE EJECUTA AL SELECCIONAR UNA FILA (DOCUMENTOS)
      $('#listaSolic_areadiag').delegate('input','checked', function(event){
        alert('hola');
          $(this).parents('tr').addClass("fila_selec");
         // actualizar_actividad($(this).val(),this);       
      });

      $('#listaSolic_areadiag').delegate('input','Unchecked', function(event){
          $(this).parents('tr').removeClass("fila_selec");
      });


    //////////////tabla servicios///////////////////////////////
 
    

  //FUNCIÓN QUE SE EJECUTA AL SELECCIONAR UNA FILA (DOCUMENTOS)
  $('#listaserv').delegate('input','checked', function(event){
      $(this).parents('tr').addClass("fila_selec");
  });

  $('#listaserv').delegate('input','Unchecked', function(event){
      $(this).parents('tr').removeClass("fila_selec");
  });


  //accion cuando seleeciona un item de los materiales
  $('#cmb_material').on('change', function() {
        var idmaterial=$('#cmb_material').val();
        limpiar_repuestos_agregar();
        vistacargando("M", "Espere..");
        $.get('/egresoRepuesto/materialseleccionado/'+idmaterial, function (data){
            if(data['error']==true){
              alertNotificar(data['resultado'],'error');
              vistacargando();
              return;
            }
            vistacargando();
            $('#stock').val(data.resultado[0].cantidad);
            $('#repuestoname').val(data.resultado[0].descripcion);
            $('#unidad').val(data.resultado[0].unidad);
            $('#idrep').val(data.resultado[0].idrepuesto);
            $('#idtipo').val(data.resultado[0].idtipo);    
        }).fail(function(){
          alertNotificar('Inconvenientes al obtener detalle del repuesto intente nuevamente','error');
          vistacargando();
        });

  })

  function validar_stock(input){
    var busqueda = $(input).val();
    var stockpermitido=$('#stock').val();
    if(parseInt(busqueda)>parseInt(stockpermitido)){
      alertNotificar("No puede solicitar más de "+stockpermitido+" del stock permitido", 'warning');
      $("#cantidad").val('');
    }
  }

  function agregar_repuesto(){
      var stock_max=$('#stock').val();
      var stock_max_=stock_max*1;
      var cant_selecc_au=$('#cantidad').val();
      var cant_selecc=(Number(cant_selecc_au));
      var cant_selecc=cant_selecc*1;
      if(cant_selecc==""){
        alertNotificar("Ingrese la cantidad del repuesto", "default"); return;
      }
      //alamaceno el valor del id repuesto
      var id_repuesto_selecc=$('#idrep').val();
      //busco si ese valor-repuesto (id) ya se encuentra en el carrito
      var idrepuesto_ya_agg=$('#repuesto_agg_'+id_repuesto_selecc).val();
      if(idrepuesto_ya_agg>=0){
        alertNotificar('Repuesto ya se encuentra agregado','warning');
        return;    
      }
      if(cant_selecc > stock_max_){
        alertNotificar("La Cantidad ingresada no debé ser superior a "+stock_max_, "default");
        return;
      }
      var tipos=$("#idtipo").val();
      quitarRepuestoSeleccionado(0);
      var nombrematerial=$('#repuestoname').val();
      var unidad_ag=$('#unidad').val();
      $('#tabla_carrito').removeClass('hidden');
      var rep_selecc=$('#cmb_material option:selected').text();
      $('#resp_agg').val(rep_selecc);
      $('#cant_agg').val(cant_selecc);
      //lo agregamos al carrito
      $('#listaRepuestoAgg').append(
                '<tr id = "tr_rep_'+id_repuesto_selecc+'">'+
                '<td style="display:none">'+
                  '<input type="hidden" name="idrespuesto_agregado[]" class="idrepuesto" id="repuesto_agg_'+id_repuesto_selecc+'" value="'+id_repuesto_selecc+'">'+
                  '<input type="hidden" name="cantidad_agregada[]" class="cantidad" id="cantidad_agg_'+id_repuesto_selecc+'" value="'+cant_selecc+'">'+
                  '<input type="hidden" name="material_agregada[]" class="material" id="material_agg_'+nombrematerial+'" value="'+nombrematerial+'">'+
                  '<input type="hidden" name="unidad_agregada[]" class="unidad" id="unidad_agg_'+unidad_ag+'" value="'+unidad_ag+'">'+
                  // '<input type="hidden" name="punitario_agregada[]" class="puni" id="punitario_agg_'+punitario+'" value="'+punitario+'">'+
                  // '<input type="hidden" name="ptotal_agregada[]" class="ptotal" id="ptotal_agg_'+ptotal+'" value="'+ptotal+'">'+
                  '<input type="hidden" name="tipo_agregada[]" class="tipo" id="tipo_agg_'+tipos+'" value="'+tipos+'">'+
                  // '<input type="hidden" name="cuenta_agregada[]" class="cuenta" id="cuenta_agg_'+cuenta+'" value="'+cuenta+'">'+
                  // '<input type="hidden" name="partida_agregada[]" class="tipo" id="partida_agg_'+partida+'" value="'+partida+'">'+
                '</td>'+
                '<td>'+'<center>'+rep_selecc+ '</td>'+
                '<td>'+'<center>'+cant_selecc+ '</td>'+
              //  '<td>'+'<center>'+ptotal+ '</td>'+
                '<td>'+
                ' <button type="button" class="btn btn-danger btn-sm" onclick="quitarRepuestoSeleccionado('+id_repuesto_selecc+','+cant_selecc+',this)"><i class="fa fa-times"></i></button>'+
                '</center>'+'</td>'+
      '</tr>');
      $("#cmb_material").val('');
      $('.option_material').prop('selected',false); 
      $("#cmb_material").trigger("chosen:updated"); 
      limpiar_repuestos_agregar();
      
  }

  function limpiar_repuestos_agregar(){
      $('#cunitario').val('');
      $('#ctotal').val('');
      $('#unidad').val('');
      $('#cantidad').val('');
      $('#stock').val('');
  }


  function Aprobacion(){
    $('#smsmRevision').addClass('hidden');
    $("#btn_modal_cerrar_con").attr("disabled", false);
          
    //verficamos si hay documentos seleccionados
    var informeaux = $("#listaSoli").find(".check_documento:checked");
    if(informeaux.length==0){
      alertNotificar("Primero seleccione un informe", "default"); return;
    }
    console.log(informeaux);
    $('#modal_aprobar_tramite').modal('show');
  }