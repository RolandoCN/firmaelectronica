
    $("#busqueda").keydown(function(event){
    
    $("#mostardatos").addClass('hidden');
   // $('#buscar').prop("disabled",false);
    $('#buscar').html(`<button type="submit" class="btn btn-primary"> <span class="fa fa-search"></span> Buscar</button>`);
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
        "zeroRecords": "No se encontraron registros coincidentes",
        "infoEmpty": "No hay registros para mostrar",
        "infoFiltered": " - filtrado de MAX registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        }
    };

   

   

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

     // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#datatable').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#datatable').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });   
        }, 200);
    });
 
    $('#frmBuscar').submit(function(e){
      //  alert("sdd");
    e.preventDefault();
    //  $('#buscar').prop("disabled",true);
       
       $('#buscar').html(`<button disabled=true  type="button" class="btn btn-primary"> <span class="fa fa-search"></span> Buscar</button>`);  
        vistacargando("M","Buscando...");
       var busqueda = $("#busqueda").val();
        if(busqueda === ''){
        //alert("Ingrese una descripción");
        $('#infoBusqueda').html('');
            $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong> Ingrese el Código del predio.
                      </div>`);
            $('#infoBusqueda').show(200);
            setTimeout(function() {
            $('#infoBusqueda').hide(200);
            },  3000);
          //return;
          vistacargando();
        return false;
         }
         else{
          var codigo=busqueda;
          llenar(codigo);
                 
 }
});
    function llenar(codigo){
       $.get("/generacionRolPago/listado/"+codigo+"/edit", function (datos) {
            vistacargando();
             if(datos['error']==true){

            $('#infoBusqueda').html('');
            $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong> Empleado no encontrado.
                      </div>`);
            $('#infoBusqueda').show(200);
            setTimeout(function() {
            $('#infoBusqueda').hide(200);
            },  3000);
          //return;
            vistacargando();
            return false;

             }
            
              $('#mostardatos').removeClass('hidden');
           //    var codigoempleado=datos.resultado[0].codigoemp;
              var cedula=datos.resultado[0].cedula;
              var correouser=datos.resultado[0].correo;
              $('#generartodos').val(cedula);
              $('#correousuario').val(correouser);
              $('#acta_ticket').html(`<hr><a  type="button" target="_blank" href="/generacionRolPago/ticket/${correouser}" class="btn btn-warning"><i class="fa fa-envelope"></i> Generar ticket</a> `);

          

///////////////  tabla  ////////////////////////////////////////
           var tabla = $('#datatable').DataTable({
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
                         //language: datatableLenguaje(datatable),
                      data: datos.resultado,
                      columns:[
                              {data: "periodo"},
                              {data: "periodoregimen" },
                              {data: "nombres"},
                              {data: "correo"},
                              {data: "periodoregimen"},
                              {data: "periodoregimen" },
                              {data: "periodoregimen"},
                              
                     ],

                    "rowCallback": function( row, data, index ){    
                        //columna de fecha
                       var retornar="";
                       var mensa="";
                       
                         if(data.estado!="pendiente")
                        {
                          retornar = `<span style="min-width: 50px !important;" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Completado</span>`;

                        }
                        else{
                            retornar = (`
                                    <label for="ckeckper_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                        <input id="ckeckper_${data.rolcodigo}" type="checkbox" class="flat check_documento" value="${data.rolcodigo}">
                                        <span style="padding-top: 5px;"> Generar</span>
                                    </label>
                                `);
                        }
                        if(data.estado=="pendiente")
                        {
                           mensa = (`
                                    <label for="ckeckmens_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                        <input id="ckeckmens_${data.rolcodigo}" type="checkbox" class="flat check_documento_m" value="${data.rolcodigo}"disabled>
                                        <span style="padding-top: 5px;"> Enviar</span>
                                    </label>
                                `);
                        }

                         if(data.estado!="pendiente")
                        {
                           mensa = (`
                                    <label for="ckeckmens_${index}" style="min-width: 50px !important; margin-bottom: 0px;">
                                        <input id="ckeckmens_${data.rolcodigo}" type="checkbox" class="flat check_documento_m" value="${data.rolcodigo}">
                                        <span style="padding-top: 5px;"> Enviar</span>
                                    </label>
                                `);
                        }
                        $('td', row).eq(4).html(retornar);
                        $('td', row).eq(5).html(mensa);

                        if(data.estado!="pendiente"){
                         $('td', row).eq(6).html(`<button type="button" onclick="verpdf('${data.ruta}','${data.rolcodigo}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>`);
                        }
                        else{
                         $('td', row).eq(6).html(`<button type="button"  class="btn btn-sm btn-primary marginB0" disabled><i class="fa fa-eye"></i> Visualizar</a>`);
 
                        }

                    }
           
                });

                 
                // $('input').iCheck({
                //     checkboxClass: 'icheckbox_flat-green'
                // });

            


////////////////////////fin tabla/////////////////////////////////////////////////////


                 
              
    });   
    }

     function verpdf(ruta,codigo){
         var iframe=$('#iframePdf');
         // iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizardoc/"+ruta);   
         $("#vinculo").attr("href", '/generacionRolPago/'+codigo+'/descargar');
         $("#documentopdf").modal("show");
     }

    $('#documentopdf').on('hidden.bs.modal', function (e) {
          
            var iframe=$('#iframePdf');
            iframe.attr("src", null);

    });

    $('#descargar').click(function(){
            $('#documentopdf').modal("hide");
    });



  ///////////////////////////////////////////////////////////////////////////////////////////////////////

    //Funcion para el envio de documentos al correo
    
        function EnviarAlCorreo(){

             if($('#generartodos').prop('checked'))
            {
               //alertNotificar("seleccionados todos", "default"); return;
               //verificar();
               $("#contet_periodo_selec").html(""); //quitamos los antiguos
               $("#contet_periodo_selec").append(`<input type="hidden" name="list_cod_periodo" value="${cedulac}">`);
               var cedulac=$('#generartodos').val();

                
               vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
               $.get("/generacionRolPago/"+cedulac+"/datosUser/", function(retorno){


                 if(retorno['error']==true){
                 $('#tabla').removeClass("disabled_content");
                  $('#generartodos').iCheck('uncheck');


                  $('#infoBusqueda').html('');
                  $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                              </button>
                              <strong>¡Atención!</strong> ${retorno['resultado']}.
                            </div>`);
                  $('#infoBusqueda').show(200);
                  setTimeout(function() {
                  $('#infoBusqueda').hide(200);
                  },  3000);
                //return;
                vistacargando();
              return false;

                   }
                if(retorno.resultado[0].correo==null)
                {
                  $('#tabla').removeClass("disabled_content");
                  $('#generartodos').iCheck('uncheck');

                  $('#tabla').removeClass("disabled_content");
                  $('#generartodos').iCheck('uncheck');

                  $('#infoBusqueda').html('');
                  $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                              </button>
                              <strong>¡Atención!</strong> El Empleado no tiene registrado un correo electrónico.
                            </div>`);
                  $('#infoBusqueda').show(200);
                  setTimeout(function() {
                  $('#infoBusqueda').hide(200);
                  },  3000);
                //return;
                vistacargando();
                return false;


                }
                else{
               
                console.log(retorno);
               // alert(retorno.resultado.cedula);    
                
                vistacargando();
                $('#cedulaproModal').val(retorno.resultado[0].cedula);
                $('#empleadoproModal').val(retorno.resultado[0].nombres);
                $('#correoproModal').val(retorno.resultado[0].correo);

               //  $('#correotxt').val(retorno.resultado.correo);

                 //mostramos la modal de la firma electrónica.
                $("#modal_enviocorreo").modal("show");
               }

                });

        //       return;


            }

            else{


            //verficamos si hay documentos seleccionados
                var per_selec_aux = $("#tb_lista").find(".check_documento_m:checked");
                if(per_selec_aux.length==0){
                    alertNotificar("Primero seleccione un periodo", "default"); return;
                }
                var cedulac=$('#generartodos').val();

               vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
               $.get("/generacionRolPago/"+cedulac+"/datosUser/", function(retorno){
               
                console.log(retorno);
               // alert(retorno.resultado.cedula);    
                
                vistacargando();

                if(retorno.resultado[0].correo==null)
                {
                  var cedula=retorno.resultado[0].identificacion;
                  llenar(cedula);
                  $('#infoBusqueda').html('');
                  $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                              </button>
                              <strong>¡Atención!</strong> El Empleado no tiene registrado un correo electrónico.
                            </div>`);
                  $('#infoBusqueda').show(200);
                  setTimeout(function() {
                  $('#infoBusqueda').hide(200);
                  },  3000);
                //return;
                vistacargando();
                return false;


                }
                else{
                $('#cedulaproModal').val(retorno.resultado[0].cedula);
                $('#empleadoproModal').val(retorno.resultado[0].nombres);
                $('#correoproModal').val(retorno.resultado[0].correo);

               //  $('#correotxt').val(retorno.resultado.correo);

                 //mostramos la modal de la firma electrónica.
                $("#modal_enviocorreo").modal("show");

                }

              });





          }


        }


          $("#frm_correo_rolespago").submit(function(e){ 
                
            e.preventDefault();

             $("#modal_enviocorreo").modal("hide");

                if($('#generartodos').prop('checked'))
                {
               //alertNotificar("seleccionados todos", "default"); return;
                var cedulac= $('#generartodos').val();
              // generacionglobal(cedulac);

               $("#contet_periodo_selec2").html(""); //quitamos los antiguos
               
                $("#contet_periodo_selec2").append(`<input type="hidden" name="list_cod_periodo" value="${cedulac}">`);


            var FrmData = new FormData(this);
            // FrmData.append("zzzz","zxxxx0");
            $.ajaxSetup({
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            });
            
            vistacargando('M','Enviando documento(s)...'); // mostramos la ventana de espera

            $.ajax({
                url: "/generacionRolPago/envioCorreoGlobal",
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                success: function(retorno){

                   // vistacargando(); // ocultamos la ventana de espera          
                    // console.log(retorno);
                    // var cedula=retorno['cedula'];
                    // console.log(cedula);
                    // console.log(retorno.cedula); 

                    //llenartabla(cedula);
                    // $('#generartodos').iCheck('uncheck');

                   if(retorno['error']==true){
                   // alert(retorno.mensaje);
                    $('#generartodos').iCheck('uncheck');

                    //var cedula=(retorno['cedula']);
                   // console.log(cedula);
                      $('#infoBusqueda').html('');
                      $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                  </button>
                                  <strong>¡Atención!</strong> ${retorno['mensaje']}
                                </div>`);
                      $('#infoBusqueda').show(200);
                      setTimeout(function() {
                      $('#infoBusqueda').hide(200);
                      },  3000);

                     // llenartabla();
                    //return;
                    vistacargando();
                  return false;

             }   
             else{
                 $('#generartodos').iCheck('uncheck');
               $('#infoBusqueda').html('');
                      $('#infoBusqueda').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                  </button>
                                  <strong>¡Atención!</strong> ${retorno['mensajeok']}
                                </div>`);
                      $('#infoBusqueda').show(200);
                      setTimeout(function() {
                      $('#infoBusqueda').hide(200);
                      },  3000);
                    //return;
                    vistacargando();
                  return false;


             }                                           

                   
                    
                },
                error: function(error){
                    vistacargando(); // ocultamos la ventana de espera
                    alertNotificar("Error al obtener la información de los roles de pago", "error");
                    
                    $("#cont_generando_roles").hide();
                    $("#cont_roles_generados").hide();
                    $("#cont_roles_no_generados").hide();
                    $("#frm_firma_electronica_rolespago").show();
                    $("#info_periodo_genrando").html("");
                    $(".info_num_generados").html("");
                    $("#btn_modal_cerrar").attr("disabled", false);

                    // cargamos el porcentaje
                    $("#porcentajeBar").attr("style", "width:0%");
                    $("#porcentajeBar").html("0%");
                    
                }
            });
            return;
                
                }




                //obtenemos los input seleccionados
                var per_selec_aux = $("#tb_lista").find(".check_documento_m:checked");
                if(per_selec_aux.length==0){
                    alertNotificar("Primero seleccione un periodo", "default"); return;
                }
                $("#contet_periodo_selec2").html(""); //quitamos los antiguos
                $.each(per_selec_aux, function(index, periodo){
                    $("#contet_periodo_selec2").append(`<input type="hidden" name="list_cod_periodo2[]" value="${$(periodo).val()}">`);
                })
            //-------------------------------------------

            var FrmData = new FormData(this);
            // FrmData.append("zzzz","zxxx0");
            $.ajaxSetup({
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            });
            
            vistacargando('M','Enviando documento(s)...'); // mostramos la ventana de espera

            $.ajax({
                url: "/generacionRolPago/envioCorreoInd",
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                success: function(retorno){

                   // vistacargando(); // ocultamos la ventana de espera          
                    console.log(retorno);
                    var cedula=retorno['cedula'];
                    // console.log(cedula);
                    // console.log(retorno.cedula); 
                    llenar(cedula);

                    //$('#generartodos').iCheck('uncheck');

                   if(retorno['error']==true){
                   // alert(retorno.mensaje);

                    //var cedula=(retorno['cedula']);
                   // console.log(cedula);
                      $('#infoBusqueda').html('');
                      $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                  </button>
                                  <strong>¡Atención!</strong> ${retorno['mensaje']}
                                </div>`);
                      $('#infoBusqueda').show(200);
                      setTimeout(function() {
                      $('#infoBusqueda').hide(200);
                      },  3000);

                     // llenartabla();
                    //return;
                    vistacargando();
                  return false;

             }   
             else{
              // $('#generartodos').iCheck('uncheck');

               $('#infoBusqueda').html('');
                      $('#infoBusqueda').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                  </button>
                                  <strong>¡Atención!</strong> ${retorno['mensajeok']}
                                </div>`);
                      $('#infoBusqueda').show(200);
                      setTimeout(function() {
                      $('#infoBusqueda').hide(200);
                      },  3000);
                    //return;
                    vistacargando();
                  return false;


             }                                           

                   
                    
                },
                error: function(error){
                    vistacargando(); // ocultamos la ventana de espera
                    alertNotificar("Error al obtener la información de los roles de pago", "error");
                    
                    $("#cont_generando_roles").hide();
                    $("#cont_roles_generados").hide();
                    $("#cont_roles_no_generados").hide();
                    $("#frm_firma_electronica_rolespago").show();
                    $("#info_periodo_genrando").html("");
                    $(".info_num_generados").html("");
                    $("#btn_modal_cerrar").attr("disabled", false);

                    // cargamos el porcentaje
                    $("#porcentajeBar").attr("style", "width:0%");
                    $("#porcentajeBar").html("0%");
                    
                }
            });

          });   







  /////////////////////////////////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////////////////////////
// FUNCIÓN PARA COMPROBAR LA CONFIGURACIÓN DE LA FIRMA ELECTRÓNICA
    
        function firmarRolesPago(){
            $("#content_check_sinfirma").show();
            $("#ckeckp_nofirma").iCheck('uncheck');
            $("#cont_generando_roles").hide();
            $("#cont_roles_generados").hide();
            $("#cont_roles_no_generados").hide();
            $("#frm_firma_electronica_rolespago").show();
            $("#info_periodo_genrando").html("");
            $(".info_num_generados").html("");
            $("#btn_modal_cerrar").attr("disabled", false);

            // cargamos el porcentaje
            $("#porcentajeBar").attr("style", "width:0%");
            $("#porcentajeBar").html("0%");

            if($('#generartodos').prop('checked'))
            {
               verificar();
               return;
            }

            //verficamos si hay documentos seleccionados
            var per_selec_aux = $("#tb_lista").find(".check_documento:checked");
            if(per_selec_aux.length==0){
                    alertNotificar("Primero seleccione un periodo", "default"); return;
            }

            vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
            $.get("/generacionRolPago/verificarConfigFirmado/", function(retorno){

               
                
                vistacargando();
                $("#informacion_certificado").html("");

                if(!retorno.error){ // si no hay error

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar").html("¿Está seguro que desea generar y firmar los roles de pago?");
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

                    //paso el correo
                    var correoEnvisr=$('#correousuario').val();
                    $('#correoEnvio').val(correoEnvisr);

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



  ////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////

   
      $('#generartodos').on('ifChecked', function(event){
       var cedulac= $('#generartodos').val();
       checkearse(cedulac);
       $('#tabla').addClass("disabled_content");

      });

      $('#generartodos').on('ifUnchecked', function(event){
       vistacargando("M","Deseleccionando ...");
       var cedulac= $('#generartodos').val();
       llenar(cedulac);
       $('#tabla').removeClass("disabled_content");    
      vistacargando();
      });

      function checkearse(cedulac){
       vistacargando("M","Seleccionando ...");
       $.get("/generacionRolPago/"+cedulac+"/generartodos", function (data) {
       console.log(data);
       $.each(data.resultado, function(i, item){
       $("#datatable").find('#ckeckper_'+item.trol01codi).iCheck('check');
       $("#datatable").find('#ckeckmens_'+item.trol01codi).iCheck('check');
   
       });
       vistacargando();
       });
       }


       //FUNCIÓN QUE SE EJECUTA AL SELECCIONAR UNA FILA (DOCUMENTOS)
      $('#tb_lista').delegate('input','ifChecked', function(event){
          $(this).parents('tr').addClass("fila_selec");
         // actualizar_actividad($(this).val(),this);       
      });

      $('#tb_lista').delegate('input','ifUnchecked', function(event){
          $(this).parents('tr').removeClass("fila_selec");
      });



  ///////////////////////////////////////////////////////////////////////////////////////////////////////

   // FUNCION PARA FIRMAR ELECTRONICAMENTE DOCUMENTO -------------------

        var cant_generados = 0;
        var cant_iteraciones = 0;
        var total_generar = 0;  

        $("#frm_firma_electronica_rolespago").submit(function(e){ 
                
            e.preventDefault();

            $("#modal_firma_electronica").modal("hide");

            //generar todos
            if($('#generartodos').prop('checked'))
            {
               var cedulac= $('#generartodos').val();
               console.log(cedulac);
               $("#contet_periodo_selec").html(""); //quitamos los antiguos
               $("#contet_periodo_selec").append(`<input type="hidden" name="list_cod_periodo" value="${cedulac}">`);
                

                var FrmData = new FormData(this);
                // FrmData.append("zzzz","zxxxx0");
                $.ajaxSetup({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
                });
                
                vistacargando('M','Generando documento(s)...'); // mostramos la ventana de espera

                $.ajax({
                    url: "/generacionRolPago/generartodosdoc",
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    success: function(retorno){

                        vistacargando(); // ocultamos la ventana de espera          
                        console.log(retorno);
                        $('#generartodos').iCheck('uncheck');
            
                        var cedula=retorno['cedula'];
                       
                        if(retorno['error']==true){
                       
                          $('#infoBusqueda').html('');
                          $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                      </button>
                                      <strong>¡Atención!</strong> ${retorno['mensaje']}
                                    </div>`);
                          $('#infoBusqueda').show(200);
                          setTimeout(function() {
                          $('#infoBusqueda').hide(200);
                          },  3000);

                         vistacargando();
                         return false;

                        }   
                        else{

                           $('#infoBusqueda').html('');
                                  
                                  $('#infoBusqueda').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                              </button>
                                              <strong>¡Atención!</strong> ${retorno['mensajeok']}
                                            </div>`);
                                  $('#infoBusqueda').show(200);
                                  setTimeout(function() {
                                  $('#infoBusqueda').hide(200);
                                  },  3000);
                                //return;
                                vistacargando();
                              return false;


                         }                                           

                       
                        
                    },
                    error: function(error){
                        vistacargando(); // ocultamos la ventana de espera
                        alertNotificar("Error al obtener la información de los roles de pago", "error");
                        
                        $("#cont_generando_roles").hide();
                        $("#cont_roles_generados").hide();
                        $("#cont_roles_no_generados").hide();
                        $("#frm_firma_electronica_rolespago").show();
                        $("#info_periodo_genrando").html("");
                        $(".info_num_generados").html("");
                        $("#btn_modal_cerrar").attr("disabled", false);

                        // cargamos el porcentaje
                        $("#porcentajeBar").attr("style", "width:0%");
                        $("#porcentajeBar").html("0%");
                        
                    }
                }); 

                return;


            }


            //generar por seleccion
            //obtenemos los input seleccionados
              var per_selec_aux = $("#tb_lista").find(".check_documento:checked");
              if(per_selec_aux.length==0){
                 alertNotificar("Primero seleccione un periodo", "default"); return;
              }
              $("#contet_periodo_selec").html(""); //quitamos los antiguos
              $.each(per_selec_aux, function(index, periodo){
              $("#contet_periodo_selec").append(`<input type="hidden" name="list_cod_periodo[]" value="${$(periodo).val()}">`);
              })
            //-------------------------------------------

              var FrmData = new FormData(this);
              
              $.ajaxSetup({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
              });
              
              vistacargando('M','Generando documento(s)...'); // mostramos la ventana de espera

              $.ajax({
                  url: "/generacionRolPago/getRoles",
                  method: 'POST',
                  data: FrmData,
                  dataType: 'json',
                  contentType:false,
                  cache:false,
                  processData:false,
                  success: function(retorno){

                     vistacargando(); // ocultamos la ventana de espera          
                     console.log(retorno);
                     var cedula=retorno['cedula'];
                      
                     if(retorno['error']==true){
                        $('#infoBusqueda').html('');
                        $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>¡Atención!</strong> ${retorno['mensaje']}
                                  </div>`);
                        $('#infoBusqueda').show(200);
                        setTimeout(function() {
                        $('#infoBusqueda').hide(200);
                        },  3000);
                        vistacargando();
                        return false;

                     }   
                     else{
                      llenar(cedula);
                          $('#infoBusqueda').html('');
                          $('#infoBusqueda').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                       </button>
                                       <strong>¡Atención!</strong> ${retorno['mensajeok']}
                                        </div>`);
                          $('#infoBusqueda').show(200);
                          setTimeout(function() {
                          $('#infoBusqueda').hide(200);
                          },  3000);
                          vistacargando();
                          return false;
                     }                                           

                     
                      
                  },
                  error: function(error){
                      vistacargando(); // ocultamos la ventana de espera
                      alertNotificar("Error al obtener la información de los roles de pago", "error");
                      
                      $("#cont_generando_roles").hide();
                      $("#cont_roles_generados").hide();
                      $("#cont_roles_no_generados").hide();
                      $("#frm_firma_electronica_rolespago").show();
                      $("#info_periodo_genrando").html("");
                      $(".info_num_generados").html("");
                      $("#btn_modal_cerrar").attr("disabled", false);

                      // cargamos el porcentaje
                      $("#porcentajeBar").attr("style", "width:0%");
                      $("#porcentajeBar").html("0%");
                      
                  }
              }); 
        });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

    function verificar()
        {

            vistacargando("M", "Espere..");
            //obtenemos la información de la firma electronica
            $.get("/generacionRolPago/verificarConfigFirmado/", function(retorno){
                console.log(retorno);
                
                vistacargando();
                $("#informacion_certificado").html("");

                if(!retorno.error){ // si no hay error

                    var config_firma = retorno.config_firma;

                    // cargamos la configuracion de la firma electronica
                    if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                        $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
                    }else{
                        $("#titulo_firmar").html("¿Está seguro que desea generar y firmar los roles de pago?");
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

                    //paso el correo
                    var correoEnvisr=$('#correousuario').val();
                    $('#correoEnvio').val(correoEnvisr);


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


  /////////////////////////////////////////////////////////////////////////////////////////////////

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