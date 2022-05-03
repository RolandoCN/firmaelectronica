function actualizar_tabla(){
    $('#listaSoli').html('');
    $("#datatable_orden_mant").DataTable().destroy();
    $('#datatable_orden_mant tbody').empty();
    vistacargando('m','Cargando información...');
    $.get("/orden/tablaorden", function (data) {
          vistacargando();
          $.each(data['resultado'],function(i,item){
              var estado=""
              var botones='';
              var botonesdoc='';
  
              if(item['estado_jefe_mant']=='P'){
                estado = (`<span style="min-width: 50px !important;" class="label label-warning estado_firma"><i class="fa fa-check-circle"></i> Por aprobar</span>`);
                botones=`<button  type="button" onclick="verdetalle('${item['idmv_mantenimiento_encrypt']}')" data-toggle="tooltip" data-original-title="Detalle de la solicitud" class="btn btn-sm btn-info "><i class="fa fa-eye"></i> Detalle 
                        </button> `;
                botonesdoc=` <button  type="button" onclick="verdocumento('${item['idmv_mantenimiento_encrypt']}','${item['ruta_informe_solic']}')" data-toggle="tooltip" data-original-title="Ver Memorando" class="btn btn-sm btn-info "><i class="fa fa-file"></i> Memo 
                </button> 
                <button  onclick="verrevision('${item['ruta_informe_revision']}','${item['idmv_mantenimiento_encrypt']}')"  type="button" data-toggle="tooltip" data-original-title="Ver diagnóstico" class="btn btn-sm btn-warning "><i class="fa fa-file"></i> Diagnóstico 
                </button>`;
              }else{
                  estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Aprobado</span>`);
                  botones=`<button  type="button" class="btn btn-sm btn-danger "data-toggle="tooltip" data-original-title="Recuperar" onclick="recuperar_revision('${item['idmv_mantenimiento_encrypt']}')"><i class="fa fa-share"></i> Recuperar</button>
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
          cargar_estilos_tabla("datatable_orden_mant");
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
  









  //Para mostrar los detalles y asignar repuewstos... servicios..areas..(Revision)
  function verdetalle(id){
     vistacargando('M','Espere...'); 
     
     $.get("/orden/registro/"+id, function (data) {
          if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;            
          }
          $('#idmantenimiento').val(data.detalle.idmv_mantenimiento);
          $('#vehicudodetalle2').html(data.detalle.vehiculo.descripcion+" # "+data.detalle.vehiculo.codigo_institucion +" ["+ data.detalle.vehiculo.placa+']');
          $('#choferdetalle2').html(data.detalle.chofer.usuario.name);
          $('#fechasolicituddetalle2').html(data.detalle.fecha_solicitud_mantenimento);
          $('#tipodetallle2').html(data.detalle.tipo);
          $('#mecanicodetalle').html(data.detalle.mecanico.usuario.name);
          $('#fecharevisiondetalle').html(data.detalle.fecha_revision_solicitud);
          $('#observacionmecanico').html(data.detalle.observacion_mecanico);


        //   $('#memorando').append(`<button type="button" onclick="verdocumentoartesano('${data.resultado.ruta_informe_solic}')" class="btn btn-sm btn-primary pull-left" ><i class="fa fa-eye"></i> </button>`);

          if(data.detalle.tipo=='Correctivo'){
            $('#detalle2').html('Solicitando la revisión técnica de '+data.detalle.descripcion);
          }
          else{
              $('#detalle2').html('Solicitando realizar un mantenimiento preventivo');
          }

          // if(data.resultado.rechazo_entrega!=null){
          //   $('#panel_rechazo').removeClass('hidden');
          //   $('#usuario_rechazo').html(data.resultado.usuarioentrega.name);
          //   $('#detalle_rechazo').html(data.resultado.rechazo_entrega);
          //   console.log(data.resultado.usuarioentrega.name);
          // }
          // else{
          //   $('#panel_rechazo').addClass('hidden');
          //   $('#usuario_rechazo').html('');
          //   $('#detalle_rechazo').html('');
          //   console.log('dsd');

          // }
           if(data.detalle.reprobacion_orden!=null){
            $('#panel_rechazo').removeClass('hidden');
            $('#usuario_rechazo').html(data.detalle.usuarioorden.name);
            $('#detalle_rechazo').html(data.detalle.reprobacion_orden);
          }
          else{
            $('#panel_rechazo').addClass('hidden');
            $('#usuario_rechazo').html('');
            $('#detalle_rechazo').html('');

          }
          $('#botones_orden').html(`<button type="button" onclick="metodofirma('${data['detalle']['idmv_mantenimiento_encrypt']}')" class="btn btn-success"><i class="fa fa-magic"></i> Firmar y enviar</button>
          <button type="button" onclick="enviar_revision('${data['detalle']['idmv_mantenimiento_encrypt']}')" class="btn btn-warning "><i class="fa fa-pencil"></i> Revisión</button>
          <button type="button" onclick="salirDetalle()" class="btn btn-danger "><i class="fa fa-mail-reply"></i> Atrás</button>`);
         // agg_fila_sms();
          repuesto_conf(data.detalle.idmv_mantenimiento);
          servicio_conf(data.detalle.idmv_mantenimiento)

         $('#datos').hide(300);
         $('#detalle').show(300);
         ver_doc_soli(data['detalle']['ruta_informe_solic'])
         vistacargando();
    }).fail(function(){
        alertNotificar('Ocurrió un error','error');
        vistacargando();
    })
  }
  
  //Para salir de la vista detalle y volver al listado vista principal
function salirDetalle(){
  $('#detalle').hide(300);
  $('#datos').show(300);
  limpiardetallerevision();

 }
 
 function firmarManual(){
    vistacargando('m','Por favor espere....');
    $('#input_subirDocumento').val('');
    $('#text_subir_doc_manual').val('');
    $('#vista_doc_firmado').html('');
    $("#modal_metodo_firma").modal("hide");
    $('#input_subirDocumento').html('');
    $('#text_subir_doc_manual').html('');
    verdocumentoaprobacion( $('#idsolicitud_encrypt_firmar').val());
    setTimeout(() => {
        $('#modal_subir_documento_firmado').modal('show');  
        vistacargando();  
    }, 500); 
}

function metodofirma(idsolicitud){
    $('#idsolicitud_encrypt_firmar').val(idsolicitud);
    $("#modal_metodo_firma").modal("show");
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
          url: "/materiales/aprobar_solicitud_admi",
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
          error: function(error){
              vistacargando(); // ocultamos la ventana de espera
              alertNotificar("Error al obtener la información de los informes", "error");
          }
      }).fail(function(){
            alertNotificar('Ocurrión un error intente nuevamente','error');
            vistacargando();
        });


});


function firmaelectronica(){
    vermemoadmi();
}
/////////////////////////////////////////////////////

      $("#frm_Orden").submit(function(e){ 

                  
              e.preventDefault();

              var nr

              var FrmData = new FormData(this);

              console.log(FrmData);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Espere...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/orden/registro",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(requestData){

                     
                     vistacargando(); // ocultamos la ventana de espera .         
                     console.log(requestData);
                      //actualizar_tabla();
                      if(requestData['error']==true && requestData['indisponibilidad']==true){
                        var detalle=`<p> No se puede aprobar porque no hay disponibles los siguientes materiales:</p>`
                        $.each(requestData['detalle'],function(i,item){
                            detalle=detalle+`<li><b style="font-size:12px">${item['Material']}</b><br> <b>Disponible:</b> ${item['cant_cabildo']} <br><b>Solicitado</b>: ${item['cant_soli']} </li>`;
                        });
                        console.log('hola');
                        alertNotificar(detalle,'warning');
                        return;
                      }
                                           

                     if(requestData.estadoP == 'success'){
                      salirDetalle();
                      $('html,body').animate({scrollTop:$('#administradorOrden').offset().top},400);
                        actualizar_tabla();
                        $('#infoFirma').html(`
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                            <div class="col-md-12 col-sm-6 col-xs-12">
                                <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>Información: </strong> ${requestData.mensaje}
                                </div>
                            </div>
                        `);

                     }
                     if(requestData.estadoP == 'stock'){

                      //alertNotificar(requestData.mensaje);
                      var idmant=$('#idmantenimiento').val();
                      $('#idrechazar_orden').val(idmant);
                      $('#eliminar').modal('show');  
                      $('#msmRechazar').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                        `);
                  
                    } 
                    if(requestData.estadoP == 'danger'){
                       alertNotificar(requestData.mensaje,'error');
                    }                                         

                     
                      
                  },
                  error: function(error){
                      vistacargando(); // ocultamos la ventana de espera
                      alertNotificar("Ocurrió un error intente nuevamente", "error");
                     // actualizar_tabla();
                      salirDetalle();
                      
                     
                      
                  }
              });


        });
    //////////////////////////////////////////////////////////////////////////////////////////////////////

     function reprobar(){
            var idmant=$('#idmantenimiento').val();
            $('#idrechazar_orden').val(idmant);
            $('#eliminar').modal("show");
            $('#observacion').val('');

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function limpiardetallerevision(){

        $('#idmantenimiento').val('');
        //$('#listaRepuestoAgg').html('');
        $("#listaConfirmaRep").html('');
        $('#listaConfirmaServ').html('');
        $('#idchofersel').val('');
        $('#buscarchofer').val('');
        $('#choferlista').empty();
        //$('#listaRepuesto').html('');
        //$('#listaserv').html('');
        //datos_servicio();
        
    }

    function verrevision(ruta,codigo){
        var iframe=$('#iframePdf_rev');
        iframe.attr("src", "/revision/visualizarDoc/"+ruta);   
        $("#vinculo_rev").attr("href", '/revision/descargar/'+codigo);
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
            url: `/orden/enviar_revision`,
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
                salirDetalle();
                actualizar_tabla();
            },
            error: function(){
                alertNotificar("Ocurrió un error intente nuevamente", "error");    
                vistacargando();                
            }
        });
      }
  
    function ver_doc_soli(ruta){
        $.get(`/orden/obtenerDocumento/${ruta}`, function(docB64){
            var encabezado = '<hr style="margin: 10px 0px;"><p style="font-weight: 700;"><i class="fa fa-desktop"></i> Vista previa del documento</p>';
            $("#documento_principal_soli").html(encabezado+" "+`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 650px;"></iframe>`);
        });
    }
  //tabla con el listado de todas las solicitudes 
//   function actualizar_tabla(){
//       var id=1;
//       $.get("/orden/tablaorden/"+id, function (data) {
//         console.log(data);

//             var idtabla = "datatable";
//                     $(`#${idtabla}`).DataTable({
//                        dom: ""
//                     +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
//                     +"<rt>"
//                     +"<'row'<'form-inline'"
//                     +" <'col-sm-6 col-md-6 col-lg-6'l>"
//                     +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
//                     "destroy":true,
//                      "order": [[ 0, "desc" ]],
//                     pageLength: 10,
//                     sInfoFiltered:false,
//                      language: {
//                         lengthMenu: "Mostrar _MENU_ registros por pagina",
//                         zeroRecords: "No se encontraron resultados en su busqueda",
//                         searchPlaceholder: "Buscar registros",
//                         info: "Mostrando registros de _START_ al _END_ de un total de  _TOTAL_ registros",
//                         infoEmpty: "No existen registros",
//                         infoFiltered: "(filtrado de un total de _MAX_ registros)",
//                         search: "Buscar:",
//                         paginate: {
//                             first: "Primero",
//                             last: "Último",
//                             next: "Siguiente",
//                             previous: "Anterior"
//                         },
//                     },
                        
//                         data: data.resultado,

//                          columnDefs: [
//                             {  width:"15%", targets: 0 },
//                             {  width:"17%", targets: 1 },
//                             {  width:"15%", targets: 2 },
//                             {  width:"10%", targets: 3 },
//                             {  width:"10%", targets: 4 },
//                             {  width:"10%", targets: 5 },
//                             {  width:"18%", targets: 6 },
//                             {  width:"18%", targets: 7 },
                           
//                         ],
                       
//                         columns:[
//                             {data: "codigo_mantenimiento" },
//                             {data: "fecha_solicitud_mantenimento" },
//                             {data: "fecha_solicitud_mantenimento" },
//                             {data: "fecha_solicitud_mantenimento" },
//                             {data: "tipo" },
//                             {data: "tipo" },
//                             {data: "tipo" },
//                             {data: "tipo" },
                            
                            
//                         ],
//                         "rowCallback": function( row, data, index ){
//                         $('td', row).eq(0).html(data.codigo_mantenimiento);
//                         $('td', row).eq(2).html(data.vehiculo.descripcion+" "+data.vehiculo.codigo_institucion+" ["+data.vehiculo.placa+"]");
//                         $('td', row).eq(3).html(data.chofer.usuario.name);

                      
//                         if(data.firma_orden!=1 && data.ruta_informe_orden==null){
//                            $('td', row).eq(5).html(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`);
//                         }
//                         if(data.ruta_informe_orden!=null && data.firma_orden==1 ){
//                            $('td', row).eq(5).html(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`);

//                         }

//                         if(data.ruta_informe_orden!=null && data.firma_orden!=1 ){
//                            $('td', row).eq(5).html(`<span style="min-width: 90px !important;font-size: 12px" class="label label-warning estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Generado &nbsp;&nbsp;</span>`);
//                         }

//                         if(data.reprobacion_orden!=null){
//                            $('td', row).eq(5).html(`<span style="min-width: 90px !important;font-size: 12px" class="label label-danger estado_validado"><i class="fa fa-thumbs-down"></i>&nbsp; Rechazado &nbsp;&nbsp;</span>`);
//                         }

                                               
//                          var estado=""
                         

//                          /////////////////////////////////
//                          if(data.firma_orden!=1 && data.ruta_informe_orden==null || data.reprobacion_orden!=null){
//                           estado = (`<label for="ckeckpinf_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
//                                                          <input id="ckeckpinf${data.idmv_mantenimiento}" disabled type="checkbox" class="flat check_documento" value="${data.idmv_mantenimiento}">
//                                                          <span style="padding-top: 5px;"> Seleccionar</span>
//                                      </label>
//                                   `);
//                          }
                         
                        
//                          if(data.firma_orden!=1 && data.ruta_informe_orden!=null && data.reprobacion_orden==null){
//                           estado = (`<label for="ckeckpinf_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
//                                                          <input id="ckeckpinf${data.idmv_mantenimiento}"  type="checkbox" class="flat check_documento" value="${data.idmv_mantenimiento}">
//                                                          <span style="padding-top: 5px;"> Seleccionar</span>
//                                      </label>
//                                   `);
//                          }
//                          if(data.firma_orden==1 && data.ruta_informe_orden!=null && data.reprobacion_orden==null){
//                           estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Completado</span>

//                             `);

//                          }
//                          /////////////////////
//                          $('td', row).eq(6).html(estado); 

//                          var botones="";
//                          if(data.firma_orden==1 && data.aprobacion_final_orden==1){
//                           botones=(`
//                             <button type="button" disabled onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
//                             </button>

//                             <button type="button"  onclick="verRevision('${data.idmv_mantenimiento}','${data.ruta_informe_revision}')" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Ver Revisión"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button"  onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-warning marginB0"data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button"  disabled onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0"data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
//                             </button>
//                            `);

//                          }

//                          if(data.firma_orden==1 && data.aprobacion_final_orden!=1){
//                           botones=(`
//                             <button type="button" disabled onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
//                             </button>

//                             <button type="button"  onclick="verRevision('${data.idmv_mantenimiento}','${data.ruta_informe_revision}')" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Ver Revisión"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button"  onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button" onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
//                             </button>
//                            `);

//                          }
//                           if(data.firma_orden!=1 && data.aprobacion_final_orden!=1 && data.ruta_informe_orden!=null){
//                           botones=(`
//                             <button type="button" disabled onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
//                             </button>

//                             <button type="button"  onclick="verRevision('${data.idmv_mantenimiento}','${data.ruta_informe_revision}')" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Ver Revisión"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button"  onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-warning marginB0"data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button" disabled onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
//                             </button>
//                            `);

//                          }

//                          if(data.firma_orden!=1 && data.aprobacion_final_orden!=1 && data.ruta_informe_orden==null){
//                           botones=(`
//                             <button type="button"  onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
//                             </button>

//                             <button type="button"  onclick="verRevision('${data.idmv_mantenimiento}','${data.ruta_informe_revision}')" class="btn btn-sm btn-success marginB0"data-toggle="tooltip" data-original-title="Ver Revisión"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button" disabled  onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
//                             </button>

//                             <button type="button" disabled onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0"data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
//                             </button>
//                            `);

//                          }

//                          ////////////////////////
                         
                          
//                          $('td', row).eq(7).html(botones);
//                          $('td', row).eq(0).css('width','15%');
//                          $('td', row).eq(7).css('width','15%');
//                          $('td', row).eq(1).css('width','15%');
//                          $('td', row).eq(2).css('width','15%');
//                          $('td', row).eq(3).css('width','20%');

                        
                            
                  
//                     }
//                   });
//                   $('input').iCheck({
//                   checkboxClass: 'icheckbox_flat-green'
//                 });
//                 });  

//     }

    // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#datatable').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#datatable').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });
    
    function verdocumento(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         var iframe=$('#iframePdf');
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo").attr("href", '/orden/descargar/'+codigo);
         $("#documento_soli_orden").modal("show");
    }

    $('#documento_soli_orden').on('hidden.bs.modal', function (e) {
            
            var iframe=$('#iframePdf');
            iframe.attr("src", null);

    });

    $('#descargar').click(function(){
           $('#documento_soli_orden').modal("hide");
    });

    function verRevision(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         var iframe=$('#iframePdf_rev');
         // iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo_rev").attr("href", '/revision/descargar/'+codigo);
         $("#documento_soli_mant").modal("show");
    }

     $('#documento_soli_mant').on('hidden.bs.modal', function (e) {
            
            var iframe=$('#iframePdf_rev');
            iframe.attr("src", null);

    });

    $('#descargar_rev').click(function(){
           $('#documento_soli_mant').modal("hide");
    });

  

   function repuesto_conf(id){
       $('#listaConfirmaRep').html('Cargando.......');
        $.get("/orden/repuesto_conf/"+id, function (data) {
            $('#listaConfirmaRep').html('');
            $.each(data.resultado, function(i,item){
                $('#listaConfirmaRep').append(
                    `  <tr class="color">
                        <td>${item.material_cabildo}</td>
                        <td>${item.cantidad_cabildo}</td>
                        </tr>`);
            });
        })
    }

    function servicio_conf(id){
        $('#listaConfirmaServ').html('Cargando.......');
        $.get("/orden/servicio_conf/"+id, function (data) {
            $('#listaConfirmaServ').html('');
            $.each(data.resultado, function(i,item){
                $('#listaConfirmaServ').append(
                    `<tr>
                        <td>${item.servicio.detalle}</td>
                    </tr>`);
            });
        })
    }

    

function buscarMecanico(input){
        // validamos para ocultar el contenido de busqueda cuando
        var busqueda = $(input).val();
        var conten_busqueda_chof = $(input).siblings('.conten_busqueda_chof');
        var div_content = $(conten_busqueda_chof).children('.div_content2');
         $(conten_busqueda_chof).hide();
         
         $('#idchofersel').val('');
         $('#choferlista').empty(); // limpiamos la tabla
        //$('detallevehiculo').addClass('hidden');

        $.get('/revision/buscar_mecanico/'+busqueda, function (data){
            //console.clear(); 
            console.log(data);
            if(data.error==true){

            }
            else{
              $('#choferlista').empty();
              $('#idchofersel').val('');
             
              $.each(data.resultado, function(i, item){
                console.log(item);
                
                
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



$('#documento_soli_mant').on('hidden.bs.modal', function (e) {
         
          var iframe=$('#iframePdf');
          iframe.attr("src", null);

});

$('#descargar').click(function(){
         $('#documento_soli_mant').modal("hide");
});

function verdocumentoaprobacion(){
    vistacargando('m','Por favor espere...');
    $.get(`/orden/visualizardocaprobacion/${$('#idsolicitud_encrypt_firmar').val()}`, function(docB64){
            vistacargando();
            // $("#modal_metodo_firma").modal("hide");
            // $("#modal_firma_electronica").modal("show");
            var encabezado = '<hr style="margin: 10px 0px;"><p style="font-weight: 700;"><i class="fa fa-desktop"></i> Vista previa del documento</p>';
            $("#vista_doc_firmado").html(encabezado+" "+`<iframe id="iframe_document" src="data:application/pdf;base64,${docB64}" type="application/pdf" frameborder="0" style="width: 100%; height: 650px;"></iframe>`);
    }).fail(function(){
        vistacargando();
        $("#vista_doc_firmado").html(`
            <h2 class="codDoc_asociado" style="margin-bottom: 20px;"> 
                <center><i class="fa fa-frown-o" style= "font-size: 22px;"></i> NO SE PUDO CARGAR EL DOCUMENTO </center>
            </h2>
        `);
    });
}


  ////////////////////////////////////////////////////////////////////////////////////////////////


// function Aprobacion(){
         
//          $('#smsOrden').addClass('hidden');         
//          $("#btn_modal_cerrar_con").attr("disabled", false);
                
//            //verficamos si hay documentos seleccionados
//          var informeaux = $("#listaSoli").find(".check_documento:checked");
//          if(informeaux.length==0){
//             alertNotificar("Primero seleccione un informe", "default"); return;
//          }
//          console.log(informeaux);
//          $('#modal_aprobar_tramite').modal('show');

// }

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
//           console.log(periodo);
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
//                   url: "/orden/subirArchivoFirmado",
//                   method: 'POST',
//                   data: FrmData,
//                   dataType: 'json',
//                   contentType:false,
//                   cache:false,
//                   processData:false,
//                   success: function(retorno){

//                      vistacargando(); // ocultamos la ventana de espera          
//                      console.log(retorno);

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

function reemplazarArchivo(id){
     $('#idmante_archivo').val(id);
     $('#generar_archivo_nuevamente').modal('show');


  }    
 
  function cerrar(){
     $('#idmante_archivo').val('');
     $('#generar_archivo_nuevamente').modal('hide');
  }


// function firmaElectronica(){


//             var informeaux_aux = $("#listaSoli").find(".check_documento:checked");
//               if(informeaux_aux.length==0){
//                  alertNotificar("Primero seleccione un informe", "default"); return;
//               }
//               $("#content_informe").html(""); //quitamos los antiguos
//               $.each(informeaux_aux, function(index, periodo){
//                 console.log(periodo);
//               $("#content_informe").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
//               })

//                $('#modal_aprobar_tramite').modal('hide');
//                vistacargando("M", "Espere..");
//             //obtenemos la información de la firma electronica
//                 $.get("/tareasVehiculos/verificarConfigFirmado/", function(retorno){
//                 console.log(retorno);
                
//                 vistacargando();
//                 $("#informacion_certificado_cons").html("");

//                 if(!retorno.error){ // si no hay error

//                     var config_firma = retorno.config_firma;

//                     // cargamos la configuracion de la firma electronica
//                     if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
//                         $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
//                     }else{
//                         $("#titulo_firmar").html("¿Está seguro que desea generar y firmar el documento?");
//                     }

//                     // verificiamos la vigencia del certificado
//                     vertificado_vigente = false;
//                     if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
//                         vertificado_vigente = true;
//                     }


//                     // cargamos el input para subir el certificado
//                     if(config_firma.archivo_certificado==true && vertificado_vigente==true){
//                         $("#content_archivo_certificado").hide();
//                     }else{
//                         $("#content_archivo_certificado").show();
//                     }

//                     // cargamos el input para la contraseña
//                     if(config_firma.clave_certificado==true && vertificado_vigente==true){
//                         $("#content_clave_certificado").hide();                        
//                     }else{
//                         $("#content_clave_certificado").show();
//                     }



//                     //cargamos la informacion del certificado
//                         if(config_firma.archivo_certificado==true){
//                             color_mensaje_certificado = "icon_success";
//                             mensaje_certificado = "Certificado vigente";
//                             icono_mensaje_certificado = "fa fa-check-square";
//                             if(config_firma.archivo_certificado==true && config_firma.dias_valido<=0){
//                                 color_mensaje_certificado = "icon_danger";
//                                 mensaje_certificado = "Certificado expirado";
//                                 icono_mensaje_certificado = "fa fa-times-circle";
//                             }else if(config_firma.archivo_certificado==true && config_firma.dias_valido <= config_firma.dias_notific_expira){
//                                 color_mensaje_certificado = "icon_warning";
//                                 mensaje_certificado = "Certificado casi expirado";
//                                 icono_mensaje_certificado = "fa fa-warning";
//                             }   
                            
//                             $("#informacion_certificado").html(`
//                                 <div id="infoDepFlujGen_1" class="form-group infoDepFlujGen content_info_certificado" style="margin-bottom: 0px; margin-top: 16px;">
//                                     <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>
//                                     <div class="col-md-8 col-sm-8 col-xs-12">
//                                         <div class="tile-stats" style="margin-bottom: 0px; border-color: #cccccc;">
//                                             <div class="icon ${color_mensaje_certificado}" style="font-size: 25px;"><i class="${icono_mensaje_certificado}"></i></div>
//                                             <div class="count ${color_mensaje_certificado}" style="font-size: 20px;">${mensaje_certificado}</div>                                    
//                                             <p>El certificado cargado es válido durante los siguientes <b>${config_firma.dias_valido} días</b>.</p>                                                                                
//                                         </div>
//                                         <hr style="margin-bottom: 2px;">                                        
//                                     </div>
//                                 </div>
//                             `);
                            
//                         }

//                     $("#input_clave_certificado").val("");
//                     $("#text_archivo_certificado").val("No seleccionado");

//                     //reiniciamos el icono de documento firmado
//                     $("#icono_estado_firma").html('<span class="fa fa-times-circle"></span>');
//                     $("#icono_estado_firma").parent().removeClass('btn_verde');
//                     $("#icono_estado_firma").parent().addClass('btn_rojo');
//                     $("#icono_estado_firma").parent().siblings('input').val("No seleccionado");
//                     $("#btn_enviar_tramite").hide();

                    
//                     //mostramos la modal de la firma electrónica
//                     console.log('debe');
//                     $("#modal_firma_electronica").modal("show");
                    
//                 }else{
//                     alertNotificar(retorno.mensaje, retorno.status);

//                 }
//             }).fail(function(){
               
//                 vistacargando(); 
//                 alertNotificar("No se pudo completar la acción", "error");

//             });

// }

// $("#frm_firma_electronica").submit(function(e){ 
                
//             e.preventDefault();

//             $("#modal_firma_electronica").modal("hide");

//             //-------------------------------------------

//               var FrmData = new FormData(this);
              
//               $.ajaxSetup({
//                   headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
//               });
              
//               vistacargando('M','Generando documento(s)...'); // mostramos la ventana de espera

//               $.ajax({
//                   url: "/orden/generarFirma",
//                   method: 'POST',
//                   data: FrmData,
//                   dataType: 'json',
//                   contentType:false,
//                   cache:false,
//                   processData:false,
//                   success: function(retorno){

//                      vistacargando(); // ocultamos la ventana de espera          
//                      console.log(retorno);

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
          url: "/orden/aprobar_solicitud_admi",
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
          error: function(error){
              vistacargando(); // ocultamos la ventana de espera
              alertNotificar("Error al obtener la información de los informes", "error");
          }
      }).fail(function(){
            alertNotificar('Ocurrión un error intente nuevamente','error');
            vistacargando();
        });


});
