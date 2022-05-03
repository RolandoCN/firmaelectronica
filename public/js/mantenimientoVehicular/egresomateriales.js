 function actualizar_tabla2(){
      var id=1;
      $.get("/egresoRepuesto/tablaegreso/"+id, function (data) {
        console.log(data);

            var idtabla = "datatable_listado";
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

                            {  width:"12%", targets: 0 },
                            {  width:"20%", targets: 1 },
                            {  width:"40%", targets: 2 },
                            {  width:"12%", targets: 3 },
                            {  width:"15%", targets: 4 },
                           
                        ],
                       
                        columns:[
                            {data: "fecha" },
                            {data: "detalle" },
                           
                            {data: "detalle" },
                            {data: "detalle" },
                            {data: "detalle" },
                            
                        ],
                        "rowCallback": function( row, data, index ){                       

                      

                         var estado=""
                         if(data.firmabodeguero!=1){
                          estado = (`<label for="ckeckpinf_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                                         <input id="ckeckpinf${data.idmv_egresocabildo}" type="checkbox" class="flat check_documento" value="${data.idmv_egresocabildo}">
                                                         <span style="padding-top: 5px;"> Seleccionar</span>
                                     </label>
                                  `);
                         }
                         else{
                          estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Completado</span>

                            `);

                         }
                          $('td', row).eq(3).html(estado); 

                          
                           $('td', row).eq(4).html(`<button type="button" onclick="verpdf('${data.ruta}','${data.idmv_egresocabildo}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button></a>`);
                          

                        
                            
                  
                    }
                  });
                  $('input').iCheck({
                  checkboxClass: 'icheckbox_flat-green'
                });
                });  

    }

    // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#datatable_listado').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#datatable_listado').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });
//modal para agregar item materiales
        function modalagregar(){
          //alert("sds");
           // abrimos la modal
            $('#modal_add_rep').modal('show');

        }
//visualizar archivo  
       function verdocumento(ruta,codigo){
             var iframe=$('#iframePdf');
             // iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
             iframe.attr("src", "/egresoRepuesto/visualizardoc/"+ruta);   
             $("#vinculo").attr("href", '/egresoRepuesto/'+codigo+'/descargar');
             $("#documentopdf").modal("show");
       }

       $('#documentopdf').on('hidden.bs.modal', function (e) {
              
             var iframe=$('#iframePdf');
             iframe.attr("src", null);

       });

       $('#descargar').click(function(){
             $('#documentopdf').modal("hide");
       });
      
      //Para salir de la vista detalle y volver al listado vista principal
       function salirDetalle2(){
          $('#nuevo').hide(300);
          $('#datos').show(300);
          $('#listaRepuestoAgg').html('');
          $('#tabla_carrito').addClass('hidden');
          $('#orden').val('');
          $('#detalleobs').val('');
          //$('#nombre_responsable').val('');
          $('#nombre_retira').val('');
          $('#nombre_bodega').val('');
          $('#cedularetira').val('');
          $('.option_responsable').prop('selected',false); // 
          $("#cmb_responsable").trigger("chosen:updated"); //
          $('.option_empleado').prop('selected',false); // 
          $("#cmb_empleado").trigger("chosen:updated"); //
          $('.option_bodega').prop('selected',false); // 
          $("#cmb_bodega").trigger("chosen:updated"); //
          $('#materialselecc').val('');
          total=0;
          $('html,body').animate({scrollTop:$('#infoFirma').offset().top},400);

        
      }

      function abrirnuevo(){
          $('#datos').hide(300);
          $('#nuevo').show(300);
      }

       // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#datatable_listado').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#datatable_listado').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });
       //tabla con el listado de todas las solicitudes 
    function actualizar_tabla(){
        var id=1;
        $.get("/egresoRepuesto/tablaegreso/"+id, function (data) {
          console.log(data);

              var idtabla = "datatable_listado";
                      $(`#${idtabla}`).DataTable({
                         dom: ""
                      +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
                      +"<rt>"
                      +"<'row'<'form-inline'"
                      +" <'col-sm-6 col-md-6 col-lg-6'l>"
                      +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                      "destroy":true,
                       "order": [[ 2, "desc" ]],
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
                              {  width:"5%", targets: 0 },
                              {  width:"35%", targets: 1 },
                              {  width:"10%", targets: 2 },
                              {  width:"20%", targets: 3 },
                              {  width:"10%", targets: 4 },
                              {  width:"10%", targets: 5 },
                             
                                
                            
                             
                          ],
                         
                          columns:[
                              {data: "idmv_egresocabildo" },
                              {data: "detalle" },
                              {data: "fecha" },
                              
                              {data: "empleado_retira_cabildo" },
                              {data: "fecha" },
                              {data: "fecha" },
                             
                          ],
                          "rowCallback": function( row, data, index ){

                                                                        
                           var estado=""
                           
                            if(data.idbodega!=null){
                                if(data.firma_subbodega!=1){
                                    estado = (`<label for="ckeckpinf_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                                            <input id="ckeckpinf${data.idmv_egresocabildo}"  type="checkbox" class="flat check_documento" value="${data.idmv_egresocabildo}">
                                                            <span style="padding-top: 5px;"> Seleccionar</span>
                                        </label>
                                    `);
                                }else{
                                    estado = (`<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Completado</span>
                                    `);
                                }
                            }else{
                                estado = (`<span style="min-width: 50px !important; font-size:13px" class="label label-warning"><i class="fa fa-times"></i> Incompleto</span>
                                `);
                            }


                           /////////////////////////////////////////////////
                           $('td', row).eq(1).html(`<b>Código: </b>${data.solicitud_mantenimiento.codigo_mantenimiento} <br>
                                                    <b>Detalle: </b>${data.solicitud_mantenimiento.observaciones}<br>
                                                    <b>Chofer: </b>${data.solicitud_mantenimiento.chofer.usuario.name} `); 
                           $('td', row).eq(4).html(estado); 
                           $('td', row).eq(4).css('text-align','center'); 
                           $('td', row).eq(5).css('text-align','center'); 
                           var botones="";
                            if(data.idbodega!=null){
                                if(data.firmabodeguero==1 && data.firmas_manuales!=1){
                                    botones=(`
                                    <button type="button"  onclick="verdetalle_egr(${data.idmv_egresocabildo})" data-toggle="tooltip" data-original-title="Ver detalle"class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
                                    </button>

                                    <button type="button"   onclick="verdocumento('${data.ruta}','${data.codigo_externo}')"data-toggle="tooltip" data-original-title="Ver documento" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Entrega"><i class="fa fa-file"></i> 
                                    </button>

                                    <button type="button" disabled onclick="reemplazarArchivo(${data.idmv_egresocabildo})" data-toggle="tooltip" data-original-title="Generar el archivo de nuevo" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
                                    </button>
                                    `);
                                }else{
                                    botones=(`
                                    <button type="button"  onclick="verdetalle_egr(${data.idmv_egresocabildo})" data-toggle="tooltip" data-original-title="Ver detalle"class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
                                    </button>

                                    <button type="button"   onclick="verdocumento('${data.ruta}','${data.codigo_externo}')" data-toggle="tooltip" data-original-title="Ver documento"class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Entrega"><i class="fa fa-file"></i> 
                                    </button>

                                    <button type="button"  onclick="reemplazarArchivo(${data.idmv_egresocabildo})" data-original-title="Generar el archivo de nuevo"class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
                                    </button>
                                    `);
                                }
                            }else{
                                botones=(`
                                <button type="button"  onclick="modal_completar_egreso(${data.idmv_egresocabildo})" data-toggle="tooltip" data-original-title="Completar registro"class="btn btn-sm btn-danger marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-check"></i>  Completar
                                </button>
                                `); 

                            }
                        
                           // if(data.firmas_manuales!=1){

                           //     botones=(`
                           //    <button type="button"  onclick="verdetalle_egr(${data.idmv_egresocabildo})" data-toggle="tooltip" data-original-title="Ver detalle"class="btn btn-sm btn-primary marginB0" data-toggle="tooltip" data-original-title="Ver detalle"><i class="fa fa-eye"></i> 
                           //    </button>

                           //    <button type="button"   onclick="verdocumento('${data.ruta}','${data.codigo_externo}')"data-toggle="tooltip" data-original-title="Ver documento" class="btn btn-sm btn-warning marginB0" data-toggle="tooltip" data-original-title="Ver Entrega"><i class="fa fa-file"></i> 
                           //    </button>

                           //    <button type="button"  onclick="reemplazarArchivo(${data.idmv_egresocabildo})" data-toggle="tooltip" data-original-title="Generar el archivo de nuevo" class="btn btn-sm btn-success marginB0" data-toggle="tooltip" data-original-title="Generar nuevamente archivo"><i class="fa fa-refresh"></i> 
                           //    </button>
                           //   `);
                           // }
                                                                             
                           $('td', row).eq(5).html(botones);
                                                 
                      }
                    });
                    $('input').iCheck({
                    checkboxClass: 'icheckbox_flat-green'
                  });
                  });  

      }

    function modal_completar_egreso(id){
        $('#id_egreso').val(id);
        limpiar_completar();
        $('#modal_completar_egreso').modal('show');
    }

      function firmar_modal(){
                        
               $('#smsGuardarCarga').addClass('hidden');
               $("#btn_modal_cerrar_con").attr("disabled", false);
                      
                 //verficamos si hay documentos seleccionados
               var informeaux = $("#lista_egreso").find(".check_documento:checked");
               if(informeaux.length==0){
                  alertNotificar("Primero seleccione un informe", "default"); return;
               }
               console.log(informeaux);
               $('#modal_aprobar_tramite').modal('show');

      }

      function reemplazarArchivo(id){
    
             $('#idegresoarchivo').val(id);
             $('#generar_archivo_nuevamente').modal('show');


      } 
      //agregar nuevo egreso


    $("#formulario_add").submit(function(e){ 
                
              e.preventDefault();

              var txtdetalle=$('#detalleobs').val();
              var txtcmb_bodega=$('#cmb_bodega').val();
              var txtcmb_empleadoret=$('#cmb_empleado').val();
              var nr = $("#listaRepuestoAgg tr").length;
            //alert(nr);
              
              if(txtdetalle==''){
                  //alert('Debe ingresar un detalle');
                  alertNotificar("Debe ingresar un detalle", "default"); return;
                  //return false; 
              }
              if(txtcmb_bodega==''){
                  // alert('Debe seleccionar una bodega');
                  // return false; 
                  alertNotificar("Debe seleccionar una bodega", "default"); return;
              }
              if(txtcmb_empleadoret==''){
                  // alert('Debe seleccionar un empleado');
                  // return false; 
                  alertNotificar("Debe seleccionar un empleado", "default"); return;
              }
              if(nr==0 ){
                  // alert('Debe seleccionar por los menos un material');
                  // return false;
                  alertNotificar("Debe seleccionar por los menos un material", "default"); return;
              }  

           // $("#generar_archivo_nuevamente").modal("hide");

            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Registrando...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/egresoRepuesto/registro",
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
                     salirDetalle2();
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
      //frm_GenerarDeNuevo

      $("#frm_GenerarDeNuevo").submit(function(e){ 
                
            e.preventDefault();

            $("#generar_archivo_nuevamente").modal("hide");

            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Generando documento...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/egresoRepuesto/reemplazar_documento",
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


      $('#modal_subir_documento_firmado').on('hidden.bs.modal', function (e) {
        $('#modal_aprobar_tramite').modal('hide');

      })


      function firmarManual(){

               $("#content_informe_maual").html(""); //quitamos los antiguos
               $('#archivomodal').val('');
               var informeaux_aux_manual = $("#lista_egreso").find(".check_documento:checked");
               if(informeaux_aux_manual.length==0){
                       alertNotificar("Primero seleccione un informe", "default"); return;
               }

               if(informeaux_aux_manual.length>=2){
                       alertNotificar("Solo se puede subir un archivo, por favor seleccione solo un informe", "default"); return;
               }

               
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
            //$('#modal_aprobar_tramite').modal('hide');

            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Subiendo documento...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/egresoRepuesto/subirArchivoFirmado",
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


            var informeaux_aux = $("#lista_egreso").find(".check_documento:checked");
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
              
            vistacargando('M','Generando documento(s)...'); // mostramos la ventana de espera

            $.ajax({
                  url: "/egresoRepuesto/generarFirma",
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



  // FUNCION PARA SELECCIONAR UN ARCHVO --------------

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

      
      function verdetalle_egr(id){

          vistacargando("M", "Espere..");
          $.get('/egresoRepuesto/registro/'+id, function (data){
            vistacargando();
            console.log(data); 
            $('#empleadodetalle').html(data.resultado.empleado_respons_cabildo);
            $('#bodegadetalle').html(data.resultado.nombre_bodega);
            var num_orden=data.resultado.numero_orden;
            if(num_orden==""){
              var num_orden_="";
              $('#ordendetalle').html(num_orden_);
            }else{
               $('#ordendetalle').html(num_orden);
            }
            $('#detalledetalle').html(data.resultado.detalle);
            $('#fechadetalle').html(data.resultado.fecha);
            $('#empleadoretiradetalle').html(data.resultado.empleado_retira_cabildo);
            $('#usuariodetalle').html(data.resultado.elaborado.name);
            $('#valordetalle').html(data.resultado.valor);

            $('#listaDetallleEgreso').html('');
            $.each(data.resultado.detallegre, function(i,item){
            $('#listaDetallleEgreso').append(

                    '<tr>'+
                             '<td>'+'<center>'+item.material+ '</td>'+
                             '<td>'+'<center>'+item.cantidadpedida+ '</td>'+
                             '<td>'+'<center>'+item.cantidadentregada+ '</td>'+
                             '<td>'+'<center>'+item.costounitario+ '</td>'+
                             '<td>'+'<center>'+item.costototal+ '</td>'+
                             
                         '</tr>');

            })

            $('#datos').hide(300);
            $('#detalleegresos').show(300); 

        
          })
      }

       //Para salir de la vista detalle y volver al listado vista principal
       function salirDetalleEgreso(){
          $('#detalleegresos').hide(300);
          $('#datos').show(300);
         
        
      }
     //  accion cuando seleeciona un responsable
      $('#cmb_responsable').on('change', function() {
          var nombreEmpleadoresp=$("#cmb_responsable option:selected").text();
          $('#nombre_responsable').val(nombreEmpleadoresp);
      })
      //  accion cuando seleeciona un empleado retira
      $('#cmb_empleado').on('change', function() {
          $('#btnGuardar').attr('disabled',true);
          var nombreEmpleadoretira=$("#cmb_empleado option:selected").text();
          var idempleadoretira=$('#cmb_empleado').val();
          $('#nombre_retira').val(nombreEmpleadoretira);
          $.get('/egresoRepuesto/consultacedula/'+idempleadoretira, function (data){
            console.log(data);
            $('#btnGuardar').attr('disabled',false);
            $('#cedularetira').val(data.resultado[0].cedula);
          });
      })

       //  accion cuando seleeciona una bodega
      $('#cmb_bodega').on('change', function() {
          var nombreBodega=$("#cmb_bodega option:selected").text();
          $('#nombre_bodega').val(nombreBodega);
      })

      //accion cuando seleeciona un item de los materiales
      $('#cmb_material').on('change', function() {
       // abrimos la modal
          //$('#modal_add_rep').modal('show');

          var idmaterial=$('#cmb_material').val();
          vistacargando("M", "Espere..");
          $.get('/egresoRepuesto/materialseleccionado/'+idmaterial, function (data){
            vistacargando();
            console.log(data); 
            console.log(data.resultado[0].cantidad);
            $('#stock').val(data.resultado[0].cantidad);
            $('#cunitario').val(data.resultado[0].cpromedio);
            $('#repuestoname').val(data.resultado[0].descripcion);
            $('#unidad').val(data.resultado[0].unidad);
            $('#idrep').val(data.resultado[0].idrepuesto);
            $('#idtipo').val(data.resultado[0].idtipo);
           
            var idrepuesto_ya_agg=$('#repuesto_agg_'+idmaterial).val();
      
            // Si el repuesto ya esta agg en el carrito cargamos al campo cantidad el valor seleccionado
            if(idrepuesto_ya_agg>=0){
              var cantidad_anterior=$('#cantidad_agg_'+idmaterial).val();
              $('#cantidad').val('');
              $('#valorviejo').val(cantidad_anterior);
            }
            //caso contrario lo limpiamos
            else{
              $('#cantidad').val('');
              $('#valorviejo').val('');
            }

          })

      })

      $('#modal_add_rep').on('hidden.bs.modal', function (e) {
           
            $('#stock').val('');
            $('#cunitario').val('');
            $('#unidad').val('');
            $('#repuestoname').val('');
            $('#idrep').val('');
            $('#idtipo').val('');
            $('#cantidad').val('');
            $('#ctotal').val('');
            $('.option_cuenta').prop('selected',false); // 
            $("#cmb_cuenta").trigger("chosen:updated"); //
            $('.option_partida').prop('selected',false); // 
            $("#cmb_partida").trigger("chosen:updated"); //
            $('.option_material').prop('selected',false); // 
            $("#cmb_material").trigger("chosen:updated"); //

            
       

     });

      function cantidadMateriale(total){
       // alert(total);
              $('#materialselecc').val(total);  
      }

      function cerrarModalReempl(){
           $('#generar_archivo_nuevamente').modal('hide');
      }

      function calcularTotal2(input){
        // validamos para ocultar el contenido de busqueda cuando
            var busqueda = $(input).val();
            //alert(busqueda);
            var stockpermitido=$('#stock').val();
            var cunitario=$("#cunitario").val();

            if(parseInt(busqueda)>parseInt(stockpermitido)){
              alert("No puede solicitar más de "+stockpermitido+" productos");
              
              $("#cantidad").val('');
              $('#ctotal').val('');
              
            }else{
              var ctotat2=busqueda*cunitario;
              var ctotat=ctotat2.toFixed(2);
             // alert(ctotat);
              $('#ctotal').val(ctotat);
            }

      }



    //Formulario que permite añadur repuesto al mantenimiento seleccionado.. (modal)
      var cont=0;
      var sub=[];
      var total=0;
     $("#frm_addRepuesto").submit(function(e){

         e.preventDefault();

        
         var stock_max=$('#stock').val();
         var stock_max_=stock_max*1;
         var cant_selecc_au=$('#cantidad').val();
         var cant_selecc_ante=$('#valorviejo').val();

        

         var cant_selecc=(Number(cant_selecc_au) + Number(cant_selecc_ante));
         var cant_selecc=cant_selecc*1;

         if(cant_selecc > stock_max_){

            alertNotificar("La Cantidad ingresada no debé ser superior a "+stock_max_, "default");
            return;
          }

         console.log(total);
         sub[cont]=cant_selecc_au;
         total=parseInt(total)+parseInt(sub[cont]);
         cont++;
         //alert(cant_selecc);
         if(cant_selecc==""){
          // alert("Ingrese una cantidad");
          // return false;
           alertNotificar("Ingrese una cantidad", "default"); return;
         }
         
        
         //alamaceno el valor del id repuesto
         var id_repuesto_selecc=$('#idrep').val();

         //busco si ese valor-repuesto (id) ya se encuentra en el carrito
         var idrepuesto_ya_agg=$('#repuesto_agg_'+id_repuesto_selecc).val();
         //alert(idrepuesto_ya_agg);
         var punitario=$('#cunitario').val();
         var ptotal=$('#ctotal').val();
         var tipos=$("#idtipo").val();
         var cuenta=$("#cmb_cuenta").val();
         var nombrecuenta=$("#cmb_cuenta option:selected").text();
         if(nombrecuenta==""){
          nombrecuenta="-----";
         }
         var partida=$("#cmb_partida").val();

         var nombrepartida=$("#cmb_partida option:selected").text();
         if(nombrepartida==""){
          nombrepartida="-----";
         }
         var nombrematerial=$('#repuestoname').val();
         //var nombrematerial=$('#cmb_material option:selected').text();
         var unidad_ag=$('#unidad').val();

         var abrir="[";
         var cerrar="]";

          var abrir2="[";
         var cerrar2="]";

         if(cuenta==""){
         var abrir="";
         var cerrar="";
          // alert("Seleccione una cuenta");
          // return false;
           //alertNotificar("Seleccione una cuenta", "default"); return;
         }

          if(partida==""){
          var abrir2="";
          var cerrar2="";
          // alert("Ingrese una partida");
          // return false;
           //alertNotificar("Seleccione una partida", "default"); return;
         }
          //Cerramos la modal de agg repuesto
         $('#modal_add_rep').modal('hide');
         $('#tabla_carrito').removeClass('hidden');
         //si ya se encuentra ese valor sera mayor a 0
         if(idrepuesto_ya_agg>=0){
            console.log(cant_selecc);
            //quitarRepuestoSeleccionado(id_repuesto_selecc,cant_selecc);
             $("#tr_rep_" + id_repuesto_selecc).remove();

         }
          
          //guarado los valores respectivo en variables
          var stock_selecc=$('#cantidad').val();
          //var rep_selecc=$('#repuestoname').val();
          var rep_selecc=$('#cmb_material option:selected').text();

          //var cantidadMat=$('#materialselecc').val();
          
          //quitarRepuestoSeleccionado(0,0);
         
          
          $('#resp_agg').val(rep_selecc);
          $('#cant_agg').val(cant_selecc);


          //lo agregamos al carrito

                 $('#listaRepuestoAgg').append(

                  '<tr id = "tr_rep_'+id_repuesto_selecc+'">'+
                           '<td>'+
                               '<input type="hidden" name="idrespuesto_agregado[]" class="idrepuesto" id="repuesto_agg_'+id_repuesto_selecc+'" value="'+id_repuesto_selecc+'">'+
                               '<input type="hidden" name="cantidad_agregada[]" class="cantidad" id="cantidad_agg_'+id_repuesto_selecc+'" value="'+cant_selecc+'">'+
                               '<input type="hidden" name="material_agregada[]" class="material" id="material_agg_'+nombrematerial+'" value="'+nombrematerial+'">'+
                               '<input type="hidden" name="unidad_agregada[]" class="unidad" id="unidad_agg_'+unidad_ag+'" value="'+unidad_ag+'">'+
                               '<input type="hidden" name="punitario_agregada[]" class="puni" id="punitario_agg_'+punitario+'" value="'+punitario+'">'+
                               '<input type="hidden" name="ptotal_agregada[]" class="ptotal" id="ptotal_agg_'+ptotal+'" value="'+ptotal+'">'+
                               '<input type="hidden" name="tipo_agregada[]" class="tipo" id="tipo_agg_'+tipos+'" value="'+tipos+'">'+
                               '<input type="hidden" name="cuenta_agregada[]" class="cuenta" id="cuenta_agg_'+cuenta+'" value="'+cuenta+'">'+
                               '<input type="hidden" name="partida_agregada[]" class="tipo" id="partida_agg_'+partida+'" value="'+partida+'">'+
                               '<center>'+nombrecuenta+'</center>'+'</center>'+
                               
                           '</td>'+
                           '<td>'+'<center>'+nombrepartida+'</center>'+ '</center>'+ '</td>'+
                           '<td>'+'<center>'+rep_selecc+'</center>'+ '</td>'+
                           '<td>'+'<center>'+cant_selecc+ '</td>'+
                           '<td>'+'<center>'+punitario+ '</td>'+
                           '<td>'+'<center>'+ptotal+ '</td>'+
                           '<td>'+
                           ' <button class="btn btn-danger btn-sm" onclick="quitarRepuestoSeleccionado('+id_repuesto_selecc+','+cant_selecc+',this)"><i class="fa fa-times"></i></button>'+
                            '</center>'+'</td>'+
                       '</tr>');

         cantidadMateriale(total);
            

     })

     // funcion para quitar elementos o filas del carrito repuesto
     function quitarRepuestoSeleccionado(id,valor){
      console.log(valor);
      console.log(id);
           total=total-valor;
           $('#materialselecc').val(total);
           $("#tr_rep_" + id).remove();
           var nr = $("#listaRepuestoAgg tr").length;
            //alert(nr);
           if(nr==0 && id!=0){
              agg_fila_sms();
           }
      
      }
    function eliminar_fila_sms(){
          quitarRepuestoSeleccionado(0);
    }

    function agg_fila_sms(){
    //numero de filas de la tbla
          var nr = $("#listaRepuestoAgg tr").length;
          $('#tabla_carrito').addClass('hidden');
                    //tabla de carrito repuesto
          // $('#listaRepuestoAgg').append(
          //   `<tr id="tr_rep_0">
          //        <td colspan="3"><center>Sin datos que mostrar</center></td>
          //    </tr>`);

   }


$("#form_complete_egreso").submit(function(e){ 
    e.preventDefault();
    $('#nombre_bodega_complete').val($('select[name="cmb_bodega_complete"] option:selected').text());
    $('#nombre_bodega_complete').val($('select[name="cmb_bodega_complete"] option:selected').text());
    $('#nombre_empleado_retira_complete').val($('select[name="cmb_empleado_retira_complete"] option:selected').text());
    $('#cedula_empleado_retira_complete').val($('select[name="cmb_empleado_retira_complete"] option:selected')[0].attributes[1].value);

    var txtcmb_bodega=$('#cmb_bodega_complete').val();
    var txtcmb_empleadoret=$('#cmb_empleado_retira_complete').val();
    if(txtcmb_bodega==''){
        alertNotificar("Debe seleccionar una bodega", "default"); return;
    }
    if(txtcmb_empleadoret==''){
        alertNotificar("Debe seleccionar un empleado", "default"); return;
    }

  //-------------------------------------------

    var FrmData = new FormData(this);
    
    $.ajaxSetup({
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
    });
    
    vistacargando('M','Completando registro...'); // mostramos la ventana de espera

    $.ajax({
        url: "/egresoRepuesto/completar_egreso",
        method: 'POST',
        data: FrmData,
        dataType: 'json',
        contentType:false,
        cache:false,
        processData:false,
        success: function(retorno){

           if(retorno['error']==false){
              vistacargando();
              actualizar_tabla();
              $('#modal_completar_egreso').modal('hide');
              alertNotificar(retorno['detalle'],'success');
         
              return;

           }   
           else{
                alertNotificar(retorno['detalle'],'error');
                vistacargando();
                return;
           }                                           

           
            
        },
        error: function(error){
            vistacargando(); // ocultamos la ventana de espera
            alertNotificar("Error al obtener la información de los informes", "error");
        }
    });


});

function limpiar_completar(){
    $('#orden_complete').val('');
    $('#cmb_bodega_complete').val('');
    $('.option_bodega_complete').prop('selected',false); 
    $("#cmb_bodega_complete").trigger("chosen:updated"); 
    $('#cmb_empleado_retira_complete').val('');
    $('.option_empleado_complete').prop('selected',false); 
    $("#cmb_empleado_retira_complete").trigger("chosen:updated"); 
}
