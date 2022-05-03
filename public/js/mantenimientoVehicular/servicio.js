    $('#check_frecuencia').on('ifChecked', function(event){

             
             $('#frecuencia').removeClass('hidden');
    });
    $('#check_frecuencia').on('ifUnchecked', function(event){
                      
             $('#frecuencia').addClass('hidden');
    });
    $('#check_matricula').on('ifChecked', function(event){
                      
             $('#matricula').removeClass('hidden');
    });
    $('#check_matricula').on('ifUnchecked', function(event){
                      
             $('#matricula').addClass('hidden');
    });

    $('#check_imagen').on('ifChecked', function(event){
                      
             $('#imagen').removeClass('hidden');
    });
    $('#check_imagen').on('ifUnchecked', function(event){
                      
             $('#imagen').addClass('hidden');
    });

    function modalMarca(){
      cargartablaMarca();
      $("#modaldatos").modal("show");
    }

     $('#modaldatos').on('hidden.bs.modal', function (e) {
        
       $('#idmv_marca').val('');
       $('marcam').val('');
      actualizarcombomarca();
       //actualizarcombomarca_();
         })

     function modalVehiculo(){
      cargartablaVehiculo();
      $("#modalvehiculo").modal("show");
    }

     $('#modalvehiculo').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
         })

     function modalTipoUso(){
      cargartablaTipo();
      $("#modaldatostipouso").modal("show");
    }

     $('#modaldatostipouso').on('hidden.bs.modal', function (e) {
        
       $('#idmv_tipoUso').val('');
       $('tipom').val('');
       actualizarcombotipo();
          })

     function modalServicio(){
      $("#modalfrecuenciavehiculo").modal("hide");
      cargartablaServicio();
      $("#modalservicio").modal("show");
    }

     $('#modalservicio').on('hidden.bs.modal', function (e) {
      $("#modalfrecuenciavehiculo").modal("show");
        
       $('#idmv_servicio').val('');
       $('serviciom').val('');
       actualizarcomboservicio();
          })

      function modalUnidad(){
      $("#modalfrecuenciavehiculo").modal("hide");
      cargartablaUnidad();
      $("#modalunidad").modal("show");
    }

     $('#modalunidad').on('hidden.bs.modal', function (e) {
        $("#modalfrecuenciavehiculo").modal("show");
       $('#idunidad').val('');
       $('unidadm').val('');
       actualizarcombounidad();
          })


      function actualizarcomboservicio(){

         $('#serviciocombo').find('option').remove().end();
         $('#serviciocombo').append('<option value="">Selecccione un  servicio</option>');
         var id=1;
        $.get("/servicios/cargacomboservicio/"+id+'/', function(data){
          console.log(data);
        $.each(data.resultado,function(i,item){

        $('#serviciocombo').append('<option class="servicio" value="'+item.idmv_servicio+'">'+item.detalle+'</option>');
         });

        $("#serviciocombo").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }

     function actualizarcombounidad(){

         $('#unidadcombo').find('option').remove().end();
         $('#unidadcombo').append('<option value="">Selecccione una unidad de medida</option>');
         var id=1;
        $.get("/servicios/cargacombounidad/"+id+'/', function(data){
        $.each(data.resultado,function(i,item){
        $('#unidadcombo').append('<option class="unidad" value="'+item.idmv_unidadmedida+'">'+item.detalle+'</option>');
         });

        $("#unidadcombo").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }

      function actualizarcombomarca(){

         $('#marcacombo').find('option').remove().end();
         $('#marcacombo').append('<option value="">Selecccione una marca</option>');
         var id=1;
        $.get("/vehiculo/cargacombomarca/"+id+'/', function(data){
            console.log(data);
        $.each(data.resultado,function(i,item){
        $('#marcacombo').append('<option class="meta" value="'+item.idmv_marca+'">'+item.detalle+'</option>');
         });

        $("#marcacombo").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }


  //  function actualizarcombomarca_(){

  //        $('#marcacombo').find('option').remove().end();
  //        $('#marcacombo').append('<option value="">Selecccione una marca</option>');
  //        var id=1;
  //       $.get("/vehiculo/cargacombomarca/"+id+'/', function(data){
  //           console.log(data);
  //       $.each(data.resultado,function(i,item){
  //       $('#marcacombo').append('<option class="meta" value="'+item.idmv_marca+'">'+item.detalle+'</option>');
  //        });

  //       $("#marcacombo").trigger("chosen:updated"); 
  //      }).fail(function(){
  //        alert("erer");
        
  //      });
  // }


     function actualizarcombotipo(){
//alert("SDd");
         $('#tipocombo').find('option').remove().end();
         $('#tipocombo').append('<option value="">Selecccione un tipo</option>');
         var id=1;
        $.get("/vehiculo/cargacombotipo/"+id+'/', function(data){
          console.log(data);
        $.each(data.resultado,function(i,item){
        $('#tipocombo').append('<option class="tipo" value="'+item.idmv_tipoUso+'">'+item.detalle+'</option>');
         });

        $("#tipocombo").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }
      
        //ELIMINAR 
        function btn_eliminarfre(btn){
            if(confirm('¿Quiere eliminar el registro?')){
                $(btn).parent('.frm_eliminar').submit();
            }
        }
        function frecuencia_editar(id){
            $.get("/servicios/registro/"+id+"/edit", function (data) {
            console.log(data);
            $('#idvehiculo').val(data.resultado.idmv_vehiculo);
            $('#codigo_vehiculo').val(data.resultado.vehiculo.codigo_institucion);
            $('.servicio').prop('selected',false); 
            $(`#serviciocombo option[value="${data.resultado['idmv_servicio']}"]`).prop('selected',true); 
            $("#serviciocombo").trigger("chosen:updated");
            $('.unidad').prop('selected',false); 
            $(`#unidadcombo option[value="${data.resultado['idmv_unidadmedida']}"]`).prop('selected',true); 
            $("#unidadcombo").trigger("chosen:updated"); 
            
             $('#valor').val(data.resultado.valor);
           
        
         });

        $('#method_Fre').val('PUT'); 
        $('#frm_Fre').prop('action',window.location.protocol+'//'+window.location.host+'/servicios/registro/'+id);
        $('#btn_fre_cancelar').removeClass('hidden');

        $('html,body').animate({scrollTop:$('#administradorVehiculo').offset().top},400);
    }

        // la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
        $('#btn_fre_cancelar').click(function(){
            $('#idvehiculo').val('');
            $('#codigo_vehiculo').val('');
            $('.servicio').prop('selected',false); //
            $("#serviciocombo").trigger("chosen:updated"); 
            $('.unidad').prop('selected',false); //
            $("#unidadcombo").trigger("chosen:updated");
            $('#valor').val('');    
            $('#method_Fre').val('POST'); 
            $('#frm_Fre').prop('action',window.location.protocol+'//'+window.location.host+'/servicios/registro/');
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


     $("#frm_Marca").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_Marca').val()=='POST')
        {
          console.log('Guardar');
          guardarMarca();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarMarca();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarMarca() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_Marca").serialize();
        $.ajax({
            url:'/vehiculo/marca', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmMarca').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposMarca();
                cargartablaMarca();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarMarca(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idmarca').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_Marca").serialize();
        $.ajax({
            url:'/vehiculo/marca/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmMarca').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposMarca();
                cargartablaMarca();
                $('#method_Marca').val('POST'); 
                $('#frm_Marca').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarMarca/');
                 $('#btn_marca_cancelar').addClass('hidden');
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposMarca(){
      $('#marcam').val('');
      $('#idmarca').val('');
    }


     function cargartablaMarca(){
      var id=1;

               $.get("/vehiculo/"+id+'/llenarmarca', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_marca";
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
                                    <button type="button" onclick="editar_marca('${data.idmv_marca_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarMarca('${data.idmv_marca_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarMarca(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/marca/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmMarca').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaMarca();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposMarca();

  }

       function editar_marca(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/vehiculo/"+id+'/editmarca', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#marcam').val(data.resultado.detalle);
         $('#idmarca').val(data.resultado.idmv_marca);
        
         });
       $('#method_Marca').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_marca_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_marca_cancelar').click(function(){
   $('#marcam').val('');
   $('#method_Marca').val('POST'); 
    $('#frm_Marca').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarMarca/');
    $(this).addClass('hidden');


    });






    $("#frm_Unidad").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_Unidad').val()=='POST')
        {
          console.log('Guardar');
          guardarUnidad();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarUnidad();
          //cargacombometa($('#idproyectopoa').val());
          //$('#btn_unidad_cancelar').addClass('hidden');

        }


         function guardarUnidad() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_Unidad").serialize();
        $.ajax({
            url:'/vehiculo/unidad', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmUnidad').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposUnidad();
                cargartablaUnidad();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarUnidad(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idunidad').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_Unidad").serialize();
        $.ajax({
            url:'/vehiculo/unidad/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmUnidad').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposUnidad();
                cargartablaUnidad();
                 $('#method_Unidad').val('POST'); 
                 $('#frm_Unidad').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarUnidad/');

                 $('#btn_unidad_cancelar').addClass('hidden');

                 // location.reload();
                 // setInterval(function() {
                 //      $('#modalunidad').modal('hide');
                 //  }, 3000);

                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposUnidad(){
      $('#unidadm').val('');
      $('#idunidad').val('');
    }


     function cargartablaUnidad(){
      var id=1;

               $.get("/vehiculo/"+id+'/llenarunidad', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_unidad";
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
                                    <button type="button" onclick="editar_unidad('${data.idmv_unidadmedida_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarUnidad('${data.idmv_unidadmedida_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarUnidad(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/unidad/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmUnidad').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaUnidad();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposUnidad();

  }

       function editar_unidad(id){
    //limpiarCamposMedioV();
    var valorid=id;
   // alert(valorid);
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/vehiculo/"+id+'/editunidad', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#unidadm').val(data.resultado.detalle);
         $('#idunidad').val(data.resultado.idmv_unidadmedida);
        
         });
       $('#method_Unidad').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_unidad_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_unidad_cancelar').click(function(){
    $('#unidadm').val('');
    $('#method_Unidad').val('POST'); 
    $('#frm_Unidad').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarUnidad/');
    $(this).addClass('hidden');


    });




     $("#frm_Servicio").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_Servicio').val()=='POST')
        {
          console.log('Guardar');
          guardarServicio();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarServicio();
          //cargacombometa($('#idproyectopoa').val());
          $('#btn_servicio_cancelar').addClass('hidden');

        }


         function guardarServicio() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_Servicio").serialize();
        $.ajax({
            url:'/vehiculo/servicio', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmServicio').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposServicio();
                cargartablaServicio();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarServicio(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idservicio').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_Servicio").serialize();
        $.ajax({
            url:'/vehiculo/servicio/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmServicio').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposServicio();
                cargartablaServicio();
                $('#method_Servicio').val('POST'); 
                $('#frm_Servicio').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarServicio/');
                 $('#btn_servicio_cancelar').addClass('hidden');

                 // location.reload();
                 // setInterval(function() {
                 //      $('#modalservicio').modal('hide');
                 //  }, 3000);
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposServicio(){
      $('#serviciom').val('');
      $('#idservicio').val('');
    }


     function cargartablaServicio(){
      var id=1;

               $.get("/vehiculo/"+id+'/llenarservicio', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_servicio";
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
                                    <button type="button" onclick="editar_servicio('${data.idmv_servicio_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarServicio('${data.idmv_servicio_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarServicio(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/servicio/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmServicio').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaServicio();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposServicio();

  }

       function editar_servicio(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/vehiculo/"+id+'/editservicio', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#serviciom').val(data.resultado.detalle);
         $('#idservicio').val(data.resultado.idmv_servicio);
        
         });
       $('#method_Servicio').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_servicio_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_servicio_cancelar').click(function(){
   $('#serviciom').val('');
   $('#method_Servicio').val('POST'); 
    $('#frm_Servicio').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarServicio/');
    $(this).addClass('hidden');


    });








     $("#frm_Tipo").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_Tipo').val()=='POST')
        {
          console.log('Guardar');
          guardarTipo();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarTipo();
          //cargacombometa($('#idproyectopoa').val());
          $('#btn_tipo_cancelar').addClass('hidden');

        }


         function guardarTipo() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_Tipo").serialize();
        $.ajax({
            url:'/vehiculo/tipo', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipo').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipo();
                cargartablaTipo();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarTipo(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idtipo').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_Tipo").serialize();
        $.ajax({
            url:'/vehiculo/tipo/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipo').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipo();
                cargartablaTipo();
                $('#method_Tipo').val('POST'); 
                $('#frm_Tipo').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarTipo/');
                 $('#btn_tipo_cancelar').addClass('hidden');
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposTipo(){
      $('#tipom').val('');
      $('#idtipo').val('');
    }


     function cargartablaTipo(){
      var id=1;

               $.get("/vehiculo/"+id+'/llenartipo', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_tipo";
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
                                    <button type="button" onclick="editar_tipo('${data.idmv_tipoUso_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarTipo('${data.idmv_tipoUso_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarTipo(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/tipo/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmTipo').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaTipo();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposTipo();

  }

       function editar_tipo(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/vehiculo/"+id+'/edittipo', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#tipom').val(data.resultado.detalle);
         $('#idtipo').val(data.resultado.idmv_tipoUso);
        
         });
       $('#method_Tipo').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_tipo_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_tipo_cancelar').click(function(){
    $('#tipom').val('');
    $('#method_Tipo').val('POST'); 
    $('#frm_Tipo').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarTipo/');
    $(this).addClass('hidden');


    });

