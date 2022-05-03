function consultarResumido(){
    vistacargando('M','Por favor espere...');
    $('#frm_Reporte3').submit();
}

 function EliminarInformeResum(){

  //verficamos si hay documentos seleccionados
            var informeaux = $("#listaRes").find(".check_documento:checked");
            if(informeaux.length==0){
                    alertNotificar("Primero seleccione un informe", "default"); return;
            }
            //mostramos la modal de la firma electrónica
            console.log('eliminar');
            $("#eliminar_inf_resum").modal("show");

            var informeaux_aux = $("#listaRes").find(".check_documento:checked");
              if(informeaux_aux.length==0){
                 alertNotificar("Primero seleccione un informe", "default"); return;
              }

            $("#inf_selec_rsum").html(""); //quitamos los antiguos
            $.each(informeaux_aux, function(index, periodo){
              console.log(periodo);
            $("#inf_selec_rsum").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
            })

            var tipo="resumido";
            $('#tiporesum').html('');
            $('#tiporesum').val(tipo);


}



  ////////////////////////////////////////////////////////////////////////////////////////////////

  //function para llenar la tabla

    function actualizar_tabla_resumido(){
      var id=1;
      $.get("/tareasVehiculos/tablaresumido/"+id, function (data) {
        console.log(data);

            var idtabla = "tablaresumido";
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

                         
                        if(data.descripcion=='Resumido'){
                          $('td', row).eq(1).html('Informe resumido de combustible y kilometraje desde ' + data.fecha_inicial+ ' hasta ' + data.fecha_final);
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

                          
                          $('td', row).eq(3).html(`<button type="button" onclick="verpdfResum('${data.ruta}','${data.idmv_informes}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button></a>`);
                          

                        
                            
                  
                    }
                  });
                  $('input').iCheck({
                  checkboxClass: 'icheckbox_flat-green'
                });
                });  

    }

    //visualizar archivo  
    function verpdfResum(ruta,codigo){
        
          var iframe=$('#iframePdfRes');
         
          iframe.attr("src", "/tareasVehiculos/visualizardocum/"+ruta);   
          $("#vinculoRes").attr("href", '/tareasVehiculos/'+codigo+'/descargar');
          $("#documentopdfResum").modal("show");
     }

    $('#documentopdfResum').on('hidden.bs.modal', function (e) {
          
         var iframe=$('#iframePdfRes');
         iframe.attr("src", null);

    });

    $('#descargarRes').click(function(){
         $('#documentopdfResum').modal("hide");
    });

   // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#tablaresumido').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#tablaresumido').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function AprobacionResumido(){
            
            $("#btn_modal_cerrar_res").attr("disabled", false);

            
            //verficamos si hay documentos seleccionados
            var informeaux = $("#listaRes").find(".check_documento:checked");
            if(informeaux.length==0){
                    alertNotificar("Primero seleccione un informe", "default"); return;
            }

            vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
            $.get("/tareasVehiculos/verificarConfigFirmado/", function(retorno){
                console.log(retorno);
                
                vistacargando();
                $("#informacion_certificado_res").html("");

                if(!retorno.error){ // si no hay error

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar_res").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar_res").html("¿Está seguro que desea generar y firmar el documento?");
                    }

                    // verificiamos la vigencia del certificado
                    vertificado_vigente = false;
                    if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
                        vertificado_vigente = true;
                    }


                    // cargamos el input para subir el certificado
                    if(config_firma.archivo_certificado==true && vertificado_vigente==true){
                        $("#content_archivo_certificado_res").hide();
                    }else{
                        $("#content_archivo_certificado_res").show();
                    }

                    // cargamos el input para la contraseña
                    if(config_firma.clave_certificado==true && vertificado_vigente==true){
                        $("#content_clave_certificado_res").hide();                        
                    }else{
                        $("#content_clave_certificado_res").show();
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
                            
                            $("#informacion_certificado_res").html(`
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

                    $("#input_clave_certificado_res").val("");
                    $("#text_archivo_certificado_res").val("No seleccionado");

                    //reiniciamos el icono de documento firmado
                    $("#icono_estado_firma").html('<span class="fa fa-times-circle"></span>');
                    $("#icono_estado_firma").parent().removeClass('btn_verde');
                    $("#icono_estado_firma").parent().addClass('btn_rojo');
                    $("#icono_estado_firma").parent().siblings('input').val("No seleccionado");
                    $("#btn_enviar_tramite").hide();

                    
                    //mostramos la modal de la firma electrónica
                    console.log('debe');
                    $("#modal_firma_res").modal("show");
                    
                }else{
                    alertNotificar(retorno.mensaje, retorno.status);

                }
            }).fail(function(){
               
                vistacargando(); 
                alertNotificar("No se pudo completar la acción", "error");

            });
        
        }



  ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#frm_firma_electronica_res").submit(function(e){ 
                
            e.preventDefault();

            $("#modal_firma_res").modal("hide");

            var informeaux_aux = $("#listaRes").find(".check_documento:checked");
              if(informeaux_aux.length==0){
                 alertNotificar("Primero seleccione un informe", "default"); return;
              }
              $("#contet_periodo_selec_res").html(""); //quitamos los antiguos
              $.each(informeaux_aux, function(index, periodo){
                console.log(periodo);
              $("#contet_periodo_selec_res").append(`<input type="hidden" name="list_informe[]" value="${$(periodo).val()}">`);
              })
            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Generando documento(s)...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/tareasVehiculos/generarInf",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(retorno){

                     vistacargando(); // ocultamos la ventana de espera          
                     console.log(retorno);

                     actualizar_tabla_resumido();
                     
                     if(retorno['error']==true){
                        $('#smsResumido').html('');
                        $('#smsResumido').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>¡Atención!</strong> ${retorno['mensaje']}
                                  </div>`);
                        $('#smsResumido').show(200);
                        setTimeout(function() {
                        $('#smsResumido').hide(200);
                        },  3000);
                        vistacargando();
                        return false;

                     }   
                     else{
                      //llenar(cedula);
                          $('#smsResumido').html('');
                          $('#smsResumido').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                       </button>
                                       <strong>¡Atención!</strong> ${retorno['mensajeok']}
                                        </div>`);
                          $('#smsResumido').show(200);
                          setTimeout(function() {
                          $('#smsResumido').hide(200);
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




  // // FUNCION PARA SELECCIONAR UN ARCHVO --------------

    $("#archivo_certificado3").click(function(e){
        $(this).parent().siblings('input').val($(this).parent().prop('title'));
        this.value = null; // limpiamos el archivo
    });

    $("#archivo_certificado3").change(function(e){
        //alert("hhh");

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