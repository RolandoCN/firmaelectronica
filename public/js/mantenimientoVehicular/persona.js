 function modalTipoPersona(){
      cargartablaTipoP();
      $("#modalpersona").modal("show");
    }

     $('#modalpersona').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
       actualizarcombostipoper();
         })

   

      function actualizarcombostipoper(){

         $('#tipopcombo').find('option').remove().end();
         $('#tipopcombo').append('<option value="">Selecccione un tipo persona</option>');
         var id=1;
        $.get("/persona/cargacombotipopersona/"+id+'/', function(data){
          console.log(data);
        $.each(data.resultado,function(i,item){

        $('#tipopcombo').append('<option class="persona" value="'+item.idmv_tipopersona+'">'+item.detalle+'</option>');
         });

        $("#tipopcombo").trigger("chosen:updated"); 
       }).fail(function(){
         //alert("erer");
        
       });
  }

      
        //ELIMINAR 
        function btn_eliminarper(btn){
            if(confirm('¿Quiere eliminar el registro?')){
                $(btn).parent('.frm_eliminar').submit();
            }
        }
        function pers_editar(id){
            $.get("/persona/registro/"+id+"/edit", function (data) {
            console.log(data);
            $('#nombres').val(data.resultado.nombres);
            $('#apellidos').val(data.resultado.apellidos);
            $('#cedula').val(data.resultado.cedula);
            $('#direccion').val(data.resultado.direccion);
            $('.persona').prop('selected',false); 
            $(`#tipopcombo option[value="${data.resultado['idmv_tipopersona']}"]`).prop('selected',true); 
            $("#tipopcombo").trigger("chosen:updated");
            $('.option_tipo').prop('selected',false); 
            $(`#cmb_dep option[value="${data.resultado['iddepart']}"]`).prop('selected',true); 
            $("#cmb_dep").trigger("chosen:updated");
                        

        
         });

        $('#method_PersonaP').val('PUT'); 
        $('#frm_PersonaP').prop('action',window.location.protocol+'//'+window.location.host+'/persona/registro/'+id);
        $('#btn_pers_cancelar').removeClass('hidden');

        $('html,body').animate({scrollTop:$('#administradorPersona').offset().top},400);
    }

        // la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
        $('#btn_pers_cancelar').click(function(){
            $('#nombres').val('');
            $('#apellidos').val('');
            $('#cedula').val('');
            $('#direccion').val('');
            $('.persona').prop('selected',false); //
            $("#tipopcombo").trigger("chosen:updated"); 
            $('.option_tipo').prop('selected',false); //
            $("#cmb_dep").trigger("chosen:updated");   
            $('#method_PersonaP').val('POST'); 
            $('#frm_PersonaP').prop('action',window.location.protocol+'//'+window.location.host+'/persona/registro/');
            $(this).addClass('hidden');
        });

     


     $("#frm_TipoP").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_TipoP').val()=='POST')
        {
          console.log('Guardar');
          guardarTipoP();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarTipoP();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarTipoP() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_TipoP").serialize();
        $.ajax({
            url:'/persona/tipo', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipoP').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipoP();
                cargartablaTipoP();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarTipoP(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idtipop').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_TipoP").serialize();
        $.ajax({
            url:'/persona/tipo/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipoP').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipoP();
                cargartablaTipoP();
                $('#method_TipoP').val('POST'); 
                $('#frm_TipoP').prop('action',window.location.protocol+'//'+window.location.host+'/persona/guardarPersonas/');
                 $('#btn_tipop_cancelar').addClass('hidden');
                 location.reload();
                 setInterval(function() {
                      $('#modalpersona').modal('hide');
                  }, 3000);

                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposTipoP(){
      $('#novedadm').val('');
      $('#personam').val('');
    }


     function cargartablaTipoP(){
      var id=1;
      //

               $.get("/persona/"+id+'/llenartipoper', function (resultado) {    
               console.log(resultado); 
              // alert(resultado.resultado);

                    var idtabla = "table_tipoper";
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
                                    <button type="button" onclick="editar_per('${data.idmv_tipopersona_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarPer('${data.idmv_tipopersona_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarPer(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/persona/tipo/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmTipoP').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaTipoP();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

        limpiarCamposTipoP();
  }

       function editar_per(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/persona/"+id+'/editper', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#personam').val(data.resultado.detalle);
         $('#idtipop').val(data.resultado.idmv_tipopersona);
        
         });
       $('#method_TipoP').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_tipop_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_tipop_cancelar').click(function(){
   $('#personam').val('');
   $('#idtipop').val('');
   $('#method_TipoP').val('POST'); 
    $('#frm_TipoP').prop('action',window.location.protocol+'//'+window.location.host+'/persona/guardarPersonas/');
    $(this).addClass('hidden');


    });
