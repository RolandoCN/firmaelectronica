function btn_eliminar_medioVerificacion(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// =================l=========== METODOS PARA LA GESTIÓN DE EVENTO ==================================

    function sector_editar_medioVerificacion(idmedioV){
        $.get("/gestionMedioVerificacionPoa/medioVerificacion/"+idmedioV+"/edit", function (resultado) {
            $('#descripcion').val(resultado.resultado.descripcion);
            $('.option_idmeta').prop('selected',false);
            $(`#idmeta option[value="${resultado.resultado.idmeta}"]`).prop('selected',true);
            $("#idmeta").trigger("chosen:updated");
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_medioVerificacions').val('PUT'); // decimo que sea un metodo put
        $('#frm_medioVerificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+idmedioV); // actualizamos la ruta del formulario para actualizar
        $('#btn_medioVerificacion_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_medioVerificacion').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_medioVerificacion_cancelar').click(function(){
       $('#descripcion').val('');
       $('.option_idmeta').prop('selected',false);
        $("#idmeta").trigger("chosen:updated"); // actualizamos el combo

         $('.meta').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#metascombo").trigger("chosen:updated"); // actualizamos el combo de zonas

            
        $('#method_medioVerificacions').val('POST'); // decimo que sea un metodo put
        $('#frm_medioVerificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE EVENTO ==================================




  //ENVIAR PLAN CONTRATACION
    $("#frm_medio_verificacions").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_medioVerificacions').val()=='POST')
        {
          console.log('Guardar');
          guardarMedioVerificacion();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarMedioVerificacion();
          //cargacombometa($('#idproyectopoa').val());
          $('#btn_medio_cancelar').addClass('hidden');

        }
    });

    //editar medioverficacion
  function editar_medio_verificacion(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     $('#conten_add_documento').html('');
    $.get("/gestionMedioVerificacionPoa/medioVerificacion/"+id+'/edit', function (data) {
      console.log(data);
         $('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 console.log(data.resultado.descripcion);
         $('#descripcion_').val(data.resultado.descripcion);
         $('.option_idtipoDoc').prop('selected',false);
         $(`#idtipo_documentos option[value="${data.resultado.idtipo_documento_poa}"]`).prop('selected',true);
         $("#idtipo_documentos").trigger("chosen:updated");

          $('.meta').prop('selected',false);
         $(`#metascombo option[value="${data.resultado.idmeta}"]`).prop('selected',true);
         $("#metascombo").trigger("chosen:updated");

       


         
          });
       $('#method_medioVerificacions').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_medio_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#msmMedioV').offset().top},400); 


    }
    $('#btn_medio_cancelar').click(function(){
    cargacombometa($('#idproyectopoa').val());
    limpiarCamposMedioV();
   $('#method_medioVerificacions').val('POST'); 
    $('#frm_medio_verificacions').prop('action',window.location.protocol+'//'+window.location.host+'/gestionMedioVerificacionPoa/medioVerificacion/');
    $(this).addClass('hidden');


    });
  


    //Guardar plan de contratacion
    function guardarMedioVerificacion() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_medio_verificacions").serialize();
        $.ajax({
            url:'/gestionMedioVerificacionPoa/medioVerificacion', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmMedioV').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposMedioV();
                cargartablaMedio($('#idproyectopoa').val());
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }

    //Guardar plan de contratacion
    function editarMedioVerificacion(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idmedioverificacion').val();
        var data=$("#frm_medio_verificacions").serialize();
        $.ajax({
            url:'/gestionMedioVerificacionPoa/medioVerificacion/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmMedioV').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposMedioV();
                cargartablaMedio($('#idproyectopoa').val());
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }


    function limpiarCamposMedioV() {
     $('#descripcion_').val("");
     $('.option_idtipoDoc').prop('selected',false);
     $("#idtipo_documentos").trigger("chosen:updated");
     
    
    }



    //obtener data para llenara lista de plan de contratacion
    function cargartablaMedio(id) {
         $.get("/gestionMedioVerificacionPoa/medioVerificacion/"+id+'/', function (resultado) {
          $('#tablaM').html("");
            console.log(resultado);
            $.each(resultado,function(i,item){
            var i=0;
              $('#tablaM').append(
             `<tr>
                  <td>${i+1} </td>
                  <td>${item.descripcion} </td>
                  <td>${item.tipodoc.descripcion} </td>
                  <td>${item.meta.descripcion} </td>
                  
                   <td>
          <button type="button" onclick="editar_medio_verificacion('${item.idmedio_verificacion_encrypt}')" class="btn btn-sm btn-info btn_icon" data-toggle="tooltip" dataplacement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarMedioVerificacion('${item.idmedio_verificacion_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip" dataplacement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
                   </td>
                   </tr>`);
            //llenarTablaMed(resultado);
         });
       });
    }
//llenar tabla plna de contratacion


function cargacombometa(id){

         $('#metascombo').find('option').remove().end();
         $('#metascombo').append('<option value="">Selecccione una meta</option>');

        $.get("/gestionMedioVerificacionPoa/cargacombo/"+id+'/', function(data){
        //console.log(data);
       // console.log(da.resultado.descripcion)
         $.each(data,function(i,item){
                // console.log(item.idmeta);
                // console.log(item.descripcion);

          $('#metascombo').append('<option class="meta" value="'+item.idmeta+'">'+item.descripcion+'</option>');
           //$('#documentoscombo').append('<option value="'+item.idmeta+'">'+item.descripcion+'</option>');
            //$('#documentoscombo').html(item).fadeIn();
                
            });

        $("#metascombo").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
}

//eliminar Plan Contratacion
  function eliminarMedioVerificacion(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/gestionMedioVerificacionPoa/medioVerificacion/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmMedioV').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaMedio($('#idproyectopoa').val());
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposMedioV();

  }