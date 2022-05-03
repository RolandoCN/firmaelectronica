 

 function modalVehiculo(){
      cargartablaVehiculo();
      $("#modalvehiculo").modal("show");
    }

     $('#modalvehiculo').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
         })

     function modalTipoNovedades(){
      cargartablaNovedades();
      $("#modalnovedades").modal("show");
    }

     $('#modalnovedades').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
       actualizarcombostiponov();
         })

   

      function actualizarcombostiponov(){

         $('#novedadcombo').find('option').remove().end();
         $('#novedadcombo').append('<option value="">Selecccione un  servicio</option>');
         var id=1;
        $.get("/novedades/cargacombotiponovedades/"+id+'/', function(data){
          console.log(data);
        $.each(data.resultado,function(i,item){

        $('#novedadcombo').append('<option class="novedad" value="'+item.idmv_tiponovedades+'">'+item.detalle+'</option>');
         });

        $("#novedadcombo").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }

      
        //ELIMINAR 
        function btn_eliminarnov(btn){
            if(confirm('¿Quiere eliminar el registro?')){
                $(btn).parent('.frm_eliminar').submit();
            }
        }
        function noved_editar(id){
            $.get("/novedades/registro/"+id+"/edit", function (data) {
            console.log(data);
            $('#idvehiculo').val(data.resultado.idmv_vehiculo);
            $('#codigo_vehiculo').val(data.resultado.vehiculo.codigo_institucion);
            $('.novedad').prop('selected',false); 
            $(`#novedadcombo option[value="${data.resultado['idmv_tiponovedades']}"]`).prop('selected',true); 
            $("#novedadcombo").trigger("chosen:updated");
            
             $('#detalle').val(data.resultado.detalle);

        
         });

        $('#method_NovedadesP').val('PUT'); 
        $('#frm_NovedadesP').prop('action',window.location.protocol+'//'+window.location.host+'/novedades/registro/'+id);
        $('#btn_noved_cancelar').removeClass('hidden');

        $('html,body').animate({scrollTop:$('#administradorNovedades').offset().top},400);
    }

        // la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
        $('#btn_noved_cancelar').click(function(){
            $('#idvehiculo').val('');
            $('#codigo_vehiculo').val('');
            $('.novedad').prop('selected',false); //
            $("#novedadcombo").trigger("chosen:updated"); 
            $('#detalle').val('');    
            $('#method_NovedadesP').val('POST'); 
            $('#frm_NovedadesP').prop('action',window.location.protocol+'//'+window.location.host+'/novedades/registro/');
            $(this).addClass('hidden');
        });

      function cargartablaVehiculo(){
      var id=1;

               $.get("/servicios/"+id+'/llenarvehiculo', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_vehiculo";
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
                        
                       data: resultado.resultado,
                       
                        columns:[
                            {data: "codigo_institucion" },
                            {data: "placa" },
                            {data: "num_chasis" },
                            {data: "año_fabricacion" },
                            {data: "marca.detalle" },
                            {data: "modelo" },
                            {data: "tipo_uso.detalle" },
                            {data: "placa" },
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(7).html(`
                                     <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleVehiculo
                                    ('${data.idmv_vehiculo}', '${data.codigo_institucion}', this)"> 
                                        <i class="fa fa-check"></i> Seleccionar
                                    </button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }

     function cargarDetalleVehiculo(id,codigo){
        $('#codigo_vehiculo').val(codigo);
        $('#idvehiculo').val(id);
        $('#modalvehiculo').modal('hide');
     }


     $("#frm_Novedades").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_Novedades').val()=='POST')
        {
          console.log('Guardar');
          guardarNovedades();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarTipoNovedades();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarNovedades() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_Novedades").serialize();
        $.ajax({
            url:'/novedades/tipo', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmNovedades').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposNovedades();
                cargartablaNovedades();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarTipoNovedades(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idtipon').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_Novedades").serialize();
        $.ajax({
            url:'/novedades/tipo/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmNovedades').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposNovedades();
                cargartablaNovedades();
                $('#method_Novedades').val('POST'); 
                $('#frm_Novedades').prop('action',window.location.protocol+'//'+window.location.host+'/novedades/guardarNovedades/');
                 $('#btn_nov_cancelar').addClass('hidden');
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposNovedades(){
      $('#novedadm').val('');
      $('#idtipon').val('');
    }


     function cargartablaNovedades(){
      var id=1;
      //

               $.get("/novedades/"+id+'/llenartiponov', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_tiponov";
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
                        
                        data: resultado.resultado,
                       
                        columns:[
                            {data: "detalle" },
                            {data: "detalle" },
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(1).html(`
                                    <button type="button" onclick="editar_nov('${data.idmv_tiponovedades_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarNoved('${data.idmv_tiponovedades_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarNoved(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/novedades/tipo/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmNovedades').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaNovedades();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

        limpiarCamposNovedades();
  }

       function editar_nov(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/novedades/"+id+'/editnov', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#novedadm').val(data.resultado.detalle);
         $('#idtipon').val(data.resultado.idmv_tiponovedades);
        
         });
       $('#method_Novedades').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_nov_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_nov_cancelar').click(function(){
   $('#novedadm').val('');
   $('#idtipon').val('');
   $('#method_Novedades').val('POST'); 
    $('#frm_Novedades').prop('action',window.location.protocol+'//'+window.location.host+'/novedades/guardarNovedades/');
    $(this).addClass('hidden');


    });
