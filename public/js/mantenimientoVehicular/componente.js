 function modalVehiculo(){
      cargartablaVehiculo();
      $("#modalvehiculo").modal("show");
    }

     $('#modalvehiculo').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
         })

      function modalMarca(){
       cargartablaMarca();
       $("#modalvehiculo").modal("hide");
      $("#modaldatos").modal("show");
    }

     $('#modaldatos').on('hidden.bs.modal', function (e) {
        //modalComponente();
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
         })


     
      function modalComponente(){
      cargartablaTipoComp();
      //
      $("#modalcomponente").modal("show");
    //  actualizarcombomarca();
    actualizarcombomarcacomp();
    $("#modalcomponentevehiculo").modal("hide");
    }

     $('#modalcomponente').on('hidden.bs.modal', function (e) {
       $("#modalcomponentevehiculo").modal("show");
       $('#idunidad').val('');
       $('unidadm').val('');
       actualizarcombocomp();
          })


      function actualizarcombocomp(){

         $('#componentecombo').find('option').remove().end();
         $('#componentecombo').append('<option value="">Selecccione un  componente</option>');
         var id=1;
         $.get("/componentes/cargacombocompon/"+id+'/', function(data){
          console.log(data);
         // alert(data);
        $.each(data.resultado,function(i,item){

        $('#componentecombo').append('<option class="componente_" value="'+item.idmv_componente+'">'+item.detalle+" - "+item.marca.detalle+'</option>');
         });

        $("#componentecombo").trigger("chosen:updated"); 
        }).fail(function(){
         //alert("erer");
        
       });
  }

    

      function actualizarcombomarcacomp(){

         $('#marcacombo_').find('option').remove().end();
         $('#marcacombo_').append('<option value="">Selecccione una marca</option>');
         var id=1;
        $.get("/componentes/cargacombomarca/"+id+'/', function(data){
        $.each(data.resultado,function(i,item){
        $('#marcacombo_').append('<option class="marca_" value="'+item.idmv_marca+'">'+item.detalle+'</option>');
         });

        $("#marcacombo_").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }


         
        //ELIMINAR 
        function btn_eliminarvehc(btn){
            if(confirm('¿Quiere eliminar el registro?')){
                $(btn).parent('.frm_eliminar').submit();
            }
        }
        function vehiculocomp_editar(id){
            $.get("/componentes/registro/"+id+"/edit", function (data) {
            console.log(data);
            $('#idvehiculo').val(data.resultado.idmv_vehiculo);
            $('#codigo_vehiculo').val(data.resultado.vehiculo.codigo_institucion);
            $('.componente_').prop('selected',false); 
            $(`#componentecombo option[value="${data.resultado['idmv_componente']}"]`).prop('selected',true); 
            $("#componentecombo").trigger("chosen:updated");
                      
        
         });

        $('#method_Comp').val('PUT'); 
        $('#frm_VehCom').prop('action',window.location.protocol+'//'+window.location.host+'/componentes/registro/'+id);
        $('#btn_vehicom_cancelar').removeClass('hidden');

        $('html,body').animate({scrollTop:$('#administradorVehiculoComponente').offset().top},400);
    }

        // la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
        $('#btn_vehicom_cancelar').click(function(){
            $('#idvehiculo').val('');
            $('#codigo_vehiculo').val('');
            $('.componente_').prop('selected',false); //
            $("#componentecombo").trigger("chosen:updated"); 
            
            $('#method_Comp').prop('action',window.location.protocol+'//'+window.location.host+'/componentes/registro/');
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








    $("#frm_Componente").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_Componente').val()=='POST')
        {
          console.log('Guardar');
          guardarTipoComp();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarTipoComp();
          //cargacombometa($('#idproyectopoa').val());
          //$('#btn_unidad_cancelar').addClass('hidden');

        }


         function guardarTipoComp() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_Componente").serialize();
        $.ajax({
            url:'/componentes/tipo', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipoComp').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipoComp();
                cargartablaTipoComp();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarTipoComp(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idcompo').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_Componente").serialize();
        $.ajax({
            url:'/componentes/tipo/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipoComp').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipoComp();
                cargartablaTipoComp();
                 $('#method_Componente').val('POST'); 
                 $('#frm_Componente').prop('action',window.location.protocol+'//'+window.location.host+'/componentes/guardarTipoComp/');

                 $('#btn_vehcomp_cancelar').addClass('hidden');
                 //  location.reload();
                 // setInterval(function() {
                 //      $('#modalcomponente').modal('hide');
                 //  }, 3000);
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposTipoComp(){
      $('#idcompo').val('');
      $('#detallem').val('');
      $('.marca_').prop('selected',false); //
      $("#marcacombo_").trigger("chosen:updated");
      $('.acc').prop('selected',false); //
      $('.herr').prop('selected',false); //
      $("#cmbtipo").trigger("chosen:updated");
    }


     function cargartablaTipoComp(){
      var id=1;

               $.get("/componentes/"+id+'/llenartipocomp', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_vehcomp";
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
                            {data: "marca.detalle" },
                            {data: "tipo" },
                            {data: "tipo" },
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(3).html(`
                                    <button type="button" onclick="editar_tipocom('${data.idmv_componente_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarTipoc('${data.idmv_componente_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
 
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


     // function selecionarCompveh(idve,comp){
     //         $("#modalcomponentevehiculo").modal("show");
     //         //$('#idvcompfre').val(id);
     //         $('#idvtipocom').val(idve); 

     //         $('#detallecom').val(comp); 
 
     //         $('#modalcomponente').hide();


     //  }


      function eliminarTipoc(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/componentes/tipo/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmTipoComp').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaTipoComp();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposTipoComp();

  }

       function editar_tipocom(id){
    //limpiarCamposMedioV();
    var valorid=id;
    //alert(valorid);
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/componentes/"+id+'/edittipocomp', function (data) {
      console.log(data);
         $('#detallem').val(data.resultado.detalle);
         $('#idcompo').val(data.resultado.idmv_componente);
         $('.marca_').prop('selected',false); 
         $(`#marcacombo_ option[value="${data.resultado['idmv_marca']}"]`).prop('selected',true); 
         $("#marcacombo_").trigger("chosen:updated");
         $('.acc').prop('selected',false); 
         $('.herr').prop('selected',false); 
         $(`#cmbtipo option[value="${data.resultado['tipo']}"]`).prop('selected',true); 
         $("#cmbtipo").trigger("chosen:updated");
        
         });
       $('#method_Componente').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_vehcomp_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_vehcomp_cancelar').click(function(){
    $('#idcompo').val('');
      $('#detallem').val('');
      $('.marca_').prop('selected',false); //
      $("#marcacombo_").trigger("chosen:updated");
      $('.acc').prop('selected',false); //
      $('.herr').prop('selected',false); //
      $("#cmbtipo").trigger("chosen:updated")
    $('#frm_Componente').prop('action',window.location.protocol+'//'+window.location.host+'/componentes/guardarTipoComp/');
    $(this).addClass('hidden');


    });