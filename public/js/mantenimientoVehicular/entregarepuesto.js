  
  //Para mostrar los detalles y asignar repuewstos... servicios..areas..(Revision)
  function verdetalle(id){
     vistacargando('M','Espere...'); 
     
     $.get("/entregaRepuesto/registro/"+id, function (data) {
       vistacargando();
          console.log(data);

          if(data['error']==true){
            actualizar_tabla();
            $('#infoFirma').html('');
            $('#infoFirma').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>¡Atención!</strong> ${data['message']}
                                  </div>`);
            $('#infoFirma').show(200);
            setTimeout(function() {
            $('#infoFirma').hide(200);
             },  3000);
            vistacargando();
            return false;
            
          }
          
          //mando el idmantenimento a revisar.
          $('#idmantenimiento').val(data.resultado.idmv_mantenimiento);
          // cargo los datos en la seccion correspondiente (seccion vehiculo)      
          $('#vehicudodetalle2').html(data.resultado.vehiculo.descripcion+" # "+data.resultado.vehiculo.codigo_institucion +" ["+ data.resultado.vehiculo.placa+']');
          $('#departamentomodal2').html(data.resultado.vehiculo.departamento.nombre);
          // cargo los datos en la seccion correspondiente (seccion chofer)      
          $('#choferdetalle2').html(data.resultado.chofer.usuario.name);
          $('#fechasolicituddetalle2').html(data.resultado.fecha_solicitud_mantenimento);
          // cargo los datos en la seccion correspondiente (seccion motivo solicitud mantenimiento)      
          $('#tipodetallle2').html(data.resultado.tipo);
          
          //info inspeccion tecnica
          $('#mecanicodetalle').html(data.resultado.mecanico.usuario.name);
          $('#fecharevisiondetalle').html(data.resultado.fecha_revision_solicitud);
          $('#observacionmecanico').html(data.resultado.observacion_mecanico);

          //dpcumentyo memo
          $('#memorando').append(`<button type="button" onclick="verdocumentoartesano('${data.resultado.ruta_informe_solic}')" class="btn btn-sm btn-primary pull-left" ><i class="fa fa-eye"></i> </button>`);

          $('#smsGuardarCarga').addClass('hidden');

          if(data.resultado.tipo=='Correctivo'){
            $('#detalle2').html('Solicitando la revisión técnica de '+data.resultado.descripcion);
          }
          else{
              $('#detalle2').html('Solicitando realizar un mantenimiento preventivo');
          }

           if(data.resultado.repuesta_solicitud=='ok'){
             $('#btn_guardar').attr('disabled',false);
          }
          else{
              $('#btn_guardar').attr('disabled',false);
          }
          $('#btn_guardar').attr('disabled',false);

          //agg_fila_sms();
          repuesto_conf(data.resultado.idmv_mantenimiento);
          egreso_conf(data.resultado.idmv_mantenimiento);
         // servicio_conf(data.resultado.idmv_mantenimiento)

         $('#datos').hide(300);
         $('#detalle').show(300);
          

    

     })
  }
  
  function salirDetalle(){
  $('#detalle').hide(300);
  $('#datos').show(300);
  limpiardetallerevision();

 }

 


    ////////////////////////////////////////////////////////////////////////////////////////////////////////


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

                     

                     if(requestData.estadoP != 'danger'){
                      salirDetalle();
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
                     else{
                      alertNotificar(requestData.mensaje);
                  
                    }                                          

                     
                      
                  },
                  error: function(error){
                      vistacargando(); // ocultamos la ventana de espera
                      alertNotificar("Error al obtener la información de los informes", "error");
                     // actualizar_tabla();
                      salirDetalle();
                      
                     
                      
                  }
              });


        });
    //////////////////////////////////////////////////////////////////////////////////////////////////////

     function reprobar(){
            var idmant=$('#idmantenimiento').val();
            $('#idrechazar_entrega').val(idmant);
            $('#eliminar').modal("show");

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function limpiardetallerevision(){

        $('#idmantenimiento').val('');
        $('#listaRepuestoAgg').html('');
        $("#listaConfirmaRep").html('');
        $('#listaConfirmaServ').html('');
        $('#idchofersel').val('');
        $('#buscarchofer').val('');
        $('#choferlista').empty();
        //datos_servicio();
        
    }

    

  
  //tabla con el listado de todas las solicitudes 
  function actualizar_tabla(){
      var id=1;
      $.get("/entregaRepuesto/tablaentrega/"+id, function (data) {
        console.log(data);

            var idtabla = "datatable";
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
                            {  width:"17%", targets: 1 },
                            {  width:"15%", targets: 2 },
                            {  width:"10%", targets: 3 },
                            {  width:"10%", targets: 4 },
                            {  width:"10%", targets: 5 },
                            {  width:"18%", targets: 6 },
                           
                        ],
                       
                        columns:[
                            {data: "fecha_solicitud_mantenimento" },
                            {data: "fecha_solicitud_mantenimento" },
                            {data: "fecha_solicitud_mantenimento" },
                            {data: "tipo" },
                            {data: "tipo" },
                            {data: "tipo" },
                            {data: "tipo" },
                            
                            
                        ],
                        "rowCallback": function( row, data, index ){

                        $('td', row).eq(1).html(data.vehiculo.descripcion+" "+data.vehiculo.codigo_institucion);
                        $('td', row).eq(2).html(data.chofer.usuario.name);

                     
                        ///////////////////////////////////
                        if(data.firma_entrega!=1 && data.ruta_informe_entrega==null){
                           $('td', row).eq(4).html(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`);
                        }
                        if(data.ruta_informe_entrega!=null && data.firma_entrega==1 ){
                           $('td', row).eq(4).html(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`);

                        }

                        if(data.ruta_informe_entrega!=null && data.firma_entrega!=1 ){
                           $('td', row).eq(4).html(`<span style="min-width: 90px !important;font-size: 12px" class="label label-warning estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Generado &nbsp;&nbsp;</span>`);
                        }

                        if(data.rechazo_entrega!=null){
                           $('td', row).eq(4).html(`<span style="min-width: 90px !important;font-size: 12px" class="label label-danger estado_validado"><i class="fa fa-thumbs-down"></i>&nbsp; Rechazado &nbsp;&nbsp;</span>`);
                        }
                        /////////////////////////////////////

                                               
                         var estado=""
                
                         ////////////////////////////////////////////////

                         if(data.ruta_informe_entrega==null && data.firma_entrega!=1 || data.rechazo_entrega!=null){
                          estado = (`<label for="ckeckpinf_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                                         <input id="ckeckpinf${data.idmv_mantenimiento}" disabled type="checkbox" class="flat check_documento" value="${data.idmv_mantenimiento}">
                                                         <span style="padding-top: 5px;"> Seleccionar</span>
                                     </label>
                                  `);
                         }
                         
                        
                         if(data.firma_entrega!=1 && data.ruta_informe_entrega!=null && data.rechazo_entrega==null){
                          estado = (`<label for="ckeckpinf_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                                         <input id="ckeckpinf${data.idmv_mantenimiento}"  type="checkbox" class="flat check_documento" value="${data.idmv_mantenimiento}">
                                                         <span style="padding-top: 5px;"> Seleccionar</span>
                                     </label>
                                  `);
                         }
                         if(data.firma_entrega==1 && data.ruta_informe_entrega!=null && data.rechazo_entrega==null){
                          estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Completado</span>

                            `);

                         }


                         /////////////////////////////////////////////////
                         $('td', row).eq(5).html(estado); 

                         var botones="";

                         if(data.ruta_informe_entrega==null && data.firma_entrega!=1){
                          botones=(`
                            <button type="button"  onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
                            </button>

                            <button type="button"  onclick="verOrden('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
                            </button>

                            <button type="button"  disabled onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_entrega}')" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Entrega"><i class="fa fa-file"></i> 
                            </button>

                            <button type="button"  disabled onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
                            </button>
                           `);

                         }

                         if(data.ruta_informe_entrega!=null && data.firma_entrega!=1){
                          botones=(`
                            <button type="button" disabled onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
                            </button>

                            <button type="button"  onclick="verOrden('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
                            </button>

                            <button type="button"   onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_entrega}')" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Entrega"><i class="fa fa-file"></i> 
                            </button>

                            <button type="button"  disabled onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
                            </button>
                           `);

                         }

                        if(data.firma_entrega==1 && data.aprobacion_final_entrega!=1){
                          botones=(`
                            <button type="button" disabled onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
                            </button>

                            <button type="button"  onclick="verOrden('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
                            </button>

                            <button type="button"  onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_entrega}')" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Entrega"><i class="fa fa-file"></i> 
                            </button>
                            <button type="button"  onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0"data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
                            </button>
                           `);

                         }
                         if(data.firma_entrega==1 && data.aprobacion_final_entrega==1){
                          botones=(`
                            <button type="button" disabled onclick="verdetalle(${data.idmv_mantenimiento})" class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
                            </button>

                            <button type="button"  onclick="verOrden('${data.idmv_mantenimiento}','${data.ruta_informe_orden}')" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Ver Orden"><i class="fa fa-file"></i> 
                            </button>

                            <button type="button"  onclick="verdocumento('${data.idmv_mantenimiento}','${data.ruta_informe_entrega}')" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Entrega"><i class="fa fa-file"></i> 
                            </button>
                            <button type="button" disabled onclick="reemplazarArchivo(${data.idmv_mantenimiento})" class="btn btn-sm btn-success marginB0"data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
                            </button>
                           `);

                         }
                                               
                         $('td', row).eq(6).html(botones);
                          

                        
                            
                  
                    }
                  });
                  $('input').iCheck({
                  checkboxClass: 'icheckbox_flat-green'
                });
                });  

    }

    function reemplazarArchivo(id){
     //$('#smsGuardarCarga').removeClass('hidden');
     $('#idmante_archivo').val(id);
     $('#generar_archivo_nuevamente').modal('show');


  }    
 
  function cerrar(){
     $('#idmante_archivo').val('');
     $('#generar_archivo_nuevamente').modal('hide');
  }
  

    function verdocumento(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         var iframe=$('#iframePdf');
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo").attr("href", '/entregaRepuesto/descargar/'+codigo);
         $("#documento_entrega").modal("show");
    }

    $('#documento_entrega').on('hidden.bs.modal', function (e) {
            
            var iframe=$('#iframePdf');
            iframe.attr("src", null);

    });

    $('#descargar').click(function(){
           $('#documento_entrega').modal("hide");
    });

    function verOrden(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         var iframe=$('#iframePdf_orden');
         // iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo_orden").attr("href", '/orden/descargar/'+codigo);
         $("#documento_orden").modal("show");
    }

     $('#documento_orden').on('hidden.bs.modal', function (e) {
            
            var iframe=$('#iframePdf_rev');
            iframe.attr("src", null);

    });

    $('#descargar_orden').click(function(){
           $('#documento_orden').modal("hide");
    });

   function repuesto_conf(id){
       $.get("/orden/repuesto_conf/"+id, function (data) {
       console.log(data);
       $('#listaConfirmaRep').html('');
       $.each(data.resultado, function(i,item){                  
       $('#listaConfirmaRep').append(
             `<tr>
                 <td>${item.cantidad}</td>
                 <td>${item.repuesto.descripcion}</td> 
              </tr>`);     

         });
      })
    }

    function egreso_conf(id){

      $('#cmb_egreso').find('option').remove().end();
         //$('#cmb_egreso').append('<option value="">Selecccione un  tipo</option>');
         $.get("/entregaRepuesto/egreso_conf/"+id, function (data) {
         console.log(data.resultado);
             $.each(data.resultado,function(i,item){
                console.log(item.detalle);
                $('#cmb_egreso').append('<option class="egreso" value="'+item.idmv_egresocabildo+'">'+item.idmv_egresocabildo+" | "+item.detalle+'</option>');
              });

         //  $.each(data.resultado,function(i2,item2){

          $('#cmb_egreso').on('change', function() {
           $('#listaConfirmaEgr').html('');
           $('#tablaegreso').removeClass('hidden');
           $('#cmb_egreso').children(':selected').each((idx,el)=>{
                 $.each(data.resultado,function(i2,item2){
                  if(item2.idmv_egresocabildo==el.value){
                          $('#listaConfirmaEgr').append(
                             `<tr>
                                     <td>${el.value}</td>
                                     <td>${item2.detalle}</td> 
                                     <td>${item2.empleado_respons_cabildo}</td>
                                     <td>
                                       <center>
                                              <button type="button" onclick="verdocegreso('${item2.idmv_egresocabildo}','${item2.ruta}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-file"></i></button>
                                       </center>
                                    </td>
                              </tr>`);
                  }                
                })
            })
         })



       //})



         $("#cmb_egreso").trigger("chosen:updated");

        
      })
      
    }
      //let $a=$('#cmb_egreso').val();

     
    function verdocegreso(codigo,ruta){
          //alert("SSDs");
            
             var iframe=$('#iframePdfegreso');
             iframe.attr("src", "visualizarDoc/"+ruta);   
             $("#vinculo_egreso").attr("href", '/entregaRepuesto/descargaregreso/'+codigo);
             $("#documento_egreso").modal("show");
        }

        $('#documento_egreso').on('hidden.bs.modal', function (e) {
                
                var iframe=$('#iframePdfegreso');
                iframe.attr("src", null);

        });

        $('#descargar_egre').click(function(){
               $('#documento_egreso').modal("hide");
        }); 
   
 
  ////////////////////////////////////////////////////////////////////////////////////////////////


function Aprobacion(){
                  
         $('#smsGuardarCarga').addClass('hidden');
         $("#btn_modal_cerrar_con").attr("disabled", false);
                
           //verficamos si hay documentos seleccionados
         var informeaux = $("#listaSoli").find(".check_documento:checked");
         if(informeaux.length==0){
            alertNotificar("Primero seleccione un informe", "default"); return;
         }
         console.log(informeaux);
         $('#modal_aprobar_tramite').modal('show');

}

function firmarManual(){

         var informeaux_aux_manual = $("#listaSoli").find(".check_documento:checked");
         if(informeaux_aux_manual.length==0){
                 alertNotificar("Primero seleccione un informe", "default"); return;
         }

         if(informeaux_aux_manual.length>=2){
                 alertNotificar("Solo se puede subir un archivo, por favor seleccione solo un informe", "default"); return;
         }

         $("#content_informe_maual").html(""); //quitamos los antiguos
         $.each(informeaux_aux_manual, function(index, periodo){
          console.log(periodo);
         $("#content_informe_maual").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
         })
         $('#modal_aprobar_tramite').modal('hide');
         setTimeout(() => {
         $('#modal_subir_documento_firmado').modal('show');
         }, 500);

}

$("#form_subir_documento_firmado").submit(function(e){ 
                
            e.preventDefault();

            $("#modal_subir_documento_firmado").modal("hide");

            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Subiendo documento...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/entregaRepuesto/subirArchivoFirmado",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(retorno){

                     vistacargando(); // ocultamos la ventana de espera          
                     console.log(retorno);

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


function firmaElectronica(){


            var informeaux_aux = $("#listaSoli").find(".check_documento:checked");
              if(informeaux_aux.length==0){
                 alertNotificar("Primero seleccione un informe", "default"); return;
              }
              $("#content_informe").html(""); //quitamos los antiguos
              $.each(informeaux_aux, function(index, periodo){
                console.log(periodo);
              $("#content_informe").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
              })

               $('#modal_aprobar_tramite').modal('hide');
               vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
                $.get("/tareasVehiculos/verificarConfigFirmado/", function(retorno){
                console.log(retorno);
                
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
                    console.log('debe');
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
                  url: "/entregaRepuesto/generarFirma",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(retorno){

                     vistacargando(); // ocultamos la ventana de espera          
                     console.log(retorno);

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

