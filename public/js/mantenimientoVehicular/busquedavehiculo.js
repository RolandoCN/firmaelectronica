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

    

    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha").show(200);
    });
    
    $('#check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea.
        $("#content_filtrar_fecha").hide(200);
    });


//funcion limpiar input
    function limpiartxt(){
      $('#fechaInicio').val('');
      $('#fechaFin').val('');
      $('.optionveh').prop('selected',false); 
      $("#cmb_vehiculomodalrepor").trigger("chosen:updated"); 
    
    }


 //FUNCION PARA FILTRAR LAS INSPECCIONES
    function filtrarTareas(){
       
      var iframe=$('#iframePdfTareas');
      iframe.attr("src", null);
      $('#pdfver').addClass('hidden');

        var fechaini=$('#fechaInicio').val();
        if(fechaini==null || fechaini==''){
        $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12" style="margin-bottom:10px">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> Ingrese la fecha inicial
                            </div>
                        </div>
                    `);
        return true;
        } 

        var fechafinal=$('#fechaFin').val();
        if(fechafinal==null || fechafinal==''){
        $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12" style="margin-bottom:10px">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> Ingrese la fecha final
                            </div>
                        </div>
                    `);
        return true;
        } 

        var cmb=$('#cmb_vehiculomodalrepor').val();
        if(cmb==null || cmb==''){
        $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12" style="margin-bottom:10px">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> Seleccione al menos un vehículo
                            </div>
                        </div>
                    `);
        return true;
        } 

        if(fechafinal < fechaini){
          $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12" style="margin-bottom:10px">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> La fecha inicial no puede ser mayor a la final
                            </div>
                        </div>
                    `);
        return true;

        }     
      
        var FrmData = {
            
            //check_filtrar_fecha: check_filtrar_fecha,
            fechaInicio: $("#fechaInicio").val(),
            fechaFin: $("#fechaFin").val(),
            //estado: $(".estado_tramite:checked").val(),
            cmbveh: $("#cmb_vehiculomodalrepor").val()
        } 

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });  

        vistacargando("M", "Espere...");

        $.ajax({
        url: '/tareasVehiculos/filtrar', 
        method: "POST", 
            data: FrmData,
            type: "json",             
       complete: function (request)   
       {
                vistacargando();
                //console.log(data);
                var retorno = request.responseJSON;
                console.clear(); console.log(retorno);

                if(retorno.error == true){
                    limpiartxt();
                    $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12" style="margin-bottom:10px">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${retorno.mensaje}
                            </div>
                        </div>
                    `);
                   // mostrarMensaje(retorno.mensaje,retorno.status,'mensaje_info');
                }else{
                  
                  limpiartxt();
                  $('#pdfver').removeClass('hidden');
                  var iframe=$('#iframePdfTareas');
                  ruta=retorno.lista_tareas;
                  iframe.attr("src", "/tareasVehiculos/visualizardocum/"+ruta);   
                  $("#vinculoTareaa").attr("href", '/tareasVehiculos/'+ruta+'/descargartarea');
                  $("#modalbusqueda").modal("show");

                }
                
      },error: function(){
                limpiartxt();
                //mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                $('#msmDetalle').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12" style="margin-bottom:10px">
                            <div class="alert alert-danger alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${retorno.mensaje}
                            </div>
                        </div>
                    `);
                vistacargando();
            }
      });

    }


    $('#modalbusqueda').on('hidden.bs.modal', function (e) {
                      
      var iframe=$('#iframePdfTareas');
      iframe.attr("src", null);
      $('#pdfver').addClass('hidden');
      limpiartxt();

    });

    $('#descargarTareaa').click(function(){
    $('#modalbusqueda').modal("hide");
    });


    function verdetalletarea(id){
      $.get("/tareasVehiculos/detallever/"+id, function (data) {
  // $('#datos').hide(300);
  // $('#detalle').show(300);
      $('#modalbusqueda').modal("hide");
      $('#modalbusquedadet').modal("show");
      console.log(data);

     // cargo los datos en la seccion correspondiente (seccion vehiculo)      
      $('#codigodet').html(data.resultado.vehiculo.codigo_institucion);
      $('#placadet').html(data.resultado.vehiculo.placa);
      $('#marcadet').html(data.resultado.vehiculo.marca.detalle);
      $('#modelodet').html(data.resultado.vehiculo.modelo);
      $('#usodet').html(data.resultado.vehiculo.tipouso.detalle);

      


    // cargo los datos en la seccion correspondiente (seccion salvoconducto)      
      $('#detalledet').html(data.resultado.detalle_tarea);
      $('#fechasolicituddet').html(data.resultado.fecharegistro);
      $('#fechasalidadet').html(data.resultado.fecha_inicio);
      $('#fecharetornodet').html(data.resultado.fecha_fin);
      $('#codigodet').html(data.resultado.codigo_institucion);

      if(data.resultado.estado=="Aprobado")
      {
        $('#fechaformdet').show();
        $('#aproformdet').show();
  
      } 
      else{

        $('#fechaformdet').hide();
        $('#aproformdet').hide();

      } 
      if(data.resultado.idusuarioaprueba==null)
        {
         var usuarioaprueba=""; 
        }
      else
        {
          var usuarioaprueba=data.resultado.usuarioaprueba.name;
        }  
      $('#usuarioaprobodet').html(usuarioaprueba);
      $('#estadodet').html(data.resultado.estado);
      if(data.resultado.idusuarioaprueba==null)
        {
         var fechaaprobacion=""; 
        }
      else
        {
          var fechaaprobacion=data.resultado.fechaaprobacion;
        }
      $('#fechaaprobaciondet').html(fechaaprobacion);

    })
    }

    $('#modalbusquedadet').on('hidden.bs.modal', function (e) {

        $('#modalbusqueda').modal("show");
    })