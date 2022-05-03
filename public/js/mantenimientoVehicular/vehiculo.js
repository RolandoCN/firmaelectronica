  var conta=1;
//funcion para leer la imagen y asignarla al img
  function readImage (input,conta) {
    if (input.files && input.files[0]) {
     // conta=conta+1;
      var reader = new FileReader();
      reader.onload = function (e) {
          if($('#check_imagen_').prop("checked")){
            
          $('#blahaux'+conta).attr('src', e.target.result); // Renderizamos la imagen
      }
      else{
        $('#blah'+conta).attr('src', e.target.result); // Renderizamos la imagen
      }
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  // funcion para leer imagen agg desde jquery 
  
  function readImageU (input) {
    if (input.files && input.files[0]) {
      
      var reader = new FileReader();
      reader.onload = function (e) {
          if($('#check_imagen_').prop("checked")){
            
          $('#blahaux1').attr('src', e.target.result); // Renderizamos la imagen
      }
      else{
        $('#blah1').attr('src', e.target.result); // Renderizamos la imagen
      }
      }
      reader.readAsDataURL(input.files[0]);
    }
  }


 //este es el del input file principal
  $("#imgInp1").change(function () {
    // Código a ejecutar cuando se detecta un cambio de archivO
     readImageU(this);
    //$('#detalleimagen'+contad).removeClass('hidden');
  });

//este es el del input agg desde jquery
  $("#imgInpM1").change(function () {
    // Código a ejecutar cuando se detecta un cambio de archivO
       readImageU(this);
    //$('#detalleimagen'+contad).removeClass('hidden');
  });



  //agregar campos ocultos para el registro de matricula desde js
   var con=1;
    $('#aggmatri').bind('click',function(){
        con=con+1;
        $('#newmatricula_').append(`
                       <div id="elim_${con}">
                       <div class="form-group col-md-4 col-sm-12 col-xs-12">
                          <label for="inputDetalleM">Detalle</label>
                          <input type="text" required placeholder="Detalle de matrícula" class="form-control"  name="detallematricula[${con}]">
                        </div>

                        <div class="form-group col-md-4 col-sm-12 col-xs-12">
                          <label for="inputFechaM">Fecha de matrícula</label>
                          <input type="date" class="form-control" required name="fmatricula[f${con}]">
                        </div>

                        <div class="form-group col-md-3 col-sm-12 col-xs-12">
                          <label for="inputFechaV">Fecha de Vencimiento</label>
                          <input type="date" placeholder="Detalle de matrícula" class="form-control" name="fvencimiento[${con}]">
                        </div> 

                        <div class="form-group col-md-1 col-sm-12 col-xs-12"style="margin-top: 25px">
                         <button onclick="eliminarMatr('${con}',this)" type="button" class="btn btn-warning btn-sm" style="margin-right: 0px;"><i class="fa fa-trash"></i> Eliminar</button>
                       </div>
                       </div>

        `);

    });



//eliminar campos agg
     function eliminarMatr(cont,btn) {
         $(btn).parents('#elim_'+cont).remove();
         con=con-1;
    }

// agregar campos con jquery para campos de imagenes
    var cont=1;
    $('#aggimgveh').bind('click',function(){
        cont=cont+1;
        $('#imag').append(`
                       <div id="eliming_${cont}">
                       
                       <div class="form-group col-md-4 col-sm-12 col-xs-12">
                          <label for="inputDetalleM">Imagen</label>
                          <input type="file" multiple="" class="form-control"id="imgInp${cont}" name="imgveh[
                          ${cont}]" accept="image/*">
                        </div>

                        <div class="form-group  col-md-4 col-sm-12 col-xs-12"id="detalleimagen${cont}">
                          <label for="inputFechaM">Detalle</label>
                          <input type="text" class="form-control" placeholder="Detalle de la imagén" name="detalleimagen[${cont}]">
                        </div>

                        <div class="form-group col-md-2 col-sm-12 col-xs-12">
                         <center><img id="blah${cont}" src="https://via.placeholder.com/150" style="width: 70px; height: 60px" alt="Tu imagen" class="form-control col-md-7 col-xs-12">
                           </center>
                        </div> 

                        <div class="form-group col-md-2 col-sm-12 col-xs-12"style="margin-top: 25px">
                         <button onclick="eliminarVeh('${cont}',this)" type="button" class="btn btn-warning btn-sm" style="margin-right: 0px;"><i class="fa fa-trash"></i> Eliminar</button>
                       </div>
                       </div>

        `);

          $("#imgInp"+cont).change(function () {
          // Código a ejecutar cuando se detecta un cambio de archivO
         // contad=contad+1;
          readImage(this,cont);
          $('#detalleimagen'+cont).removeClass('hidden');
        });



    });

    //eliminamos filas agg
     function eliminarVeh(cont,btn) {
      console.log('borrar');
         $(btn).parents('#eliming_'+cont).remove();
         cont=cont-1;
    }

 //limpiamos campos de modal de edicion
   function limpiarmodal(){
        $('#idvehiculomatricula').val('');
        $('#idvehiculoimagenmodal').val('');
        $('#idvehiculomodal').val('');
        $('#codigomodal').val('');
        $('#chasismodal').val('');
        $('#fabricacionmodal').val('');
        $('#modelomodal').val('');
        $('#placamodal').val('');
        $('#chasismodal').val('');
        $('#descripcionmodal').val('');

        $('.option_marca').prop('selected',false); // 
        $("#marcacombocodal").trigger("chosen:updated");
        $('.option_uso').prop('selected',false); // 
        $("#tipocombomodal").trigger("chosen:updated");

        $("#tipomedicionmodal").find('option').prop('selected', false);
        $("#tipomedicionmodal").trigger("chosen:updated");


        $('#check_imagen').iCheck('uncheck');
        $('#check_matricula_').iCheck('uncheck');
        $('#blahaux').attr("src", "https://via.placeholder.com/150");

        $('#verimgmodal').attr("src", "https://via.placeholder.com/150");


   } 

   // funcion para acceder a los datos a editar
  function editarmodal(id){
        $('#check_imagen').iCheck('uncheck');
        $('#tb_listadoimagen').html('');
        $('#tb_litadomatricula').html('');
        $('#tb_litadodetalle').html('');
        $('#tb_litadodetallecomp').html('');
        $('#tb_litadodetalleser').html('');
        $('#tb_litadodetallecusto').html('');
        $.get("/vehiculo/registro/"+id+"/edit", function (data) {
        console.log(data);
        var ivehiculo=data.resultado.idmv_vehiculo;
        $('#idvehiculocomponente').val(data.resultado.idmv_vehiculo);
        $('#idvehiculocustodio').val(data.resultado.idmv_vehiculo);
        $('#idvehiculoservicio').val(data.resultado.idmv_vehiculo);
        $('#idvehiculonovedad').val(data.resultado.idmv_vehiculo);
        $('#idvehiculomatricula').val(data.resultado.idmv_vehiculo);
        $('#idvehiculoimagenmodal').val(data.resultado.idmv_vehiculo);
         $('#idvehiculomodal').val(data.resultado.idmv_vehiculo);
        $('#codigomodal').val(data.resultado.codigo_institucion);
        $('#chasismodal').val(data.resultado.num_chasis);
        $('#fabricacionmodal').val(data.resultado.año_fabricacion);
        $('#modelomodal').val(data.resultado.modelo);
        $('#placamodal').val(data.resultado.placa);
        $('#descripcionmodal').val(data.resultado.descripcion);

        $('#chasismodal').val(data.resultado.num_chasis);

        $('.option_marca').prop('selected',false); 
        $(`#marcacombocodal option[value="${data.resultado['idmv_marca']}"]`).prop('selected',true); 
        $("#marcacombocodal").trigger("chosen:updated");

        $('.option_departa').prop('selected',false); 
        $(`#departamentomodal option[value="${data.resultado['iddepartamento']}"]`).prop('selected',true); 
        $("#departamentomodal").trigger("chosen:updated"); 

        $('.option_uso').prop('selected',false); 
        $(`#tipocombomodal option[value="${data.resultado['idmv_tipoUso']}"]`).prop('selected',true); 
        $("#tipocombomodal").trigger("chosen:updated"); 

        $('.option_tipocomb').prop('selected',false); 
        $(`#tipocombustiblemodal option[value="${data.resultado['idmv_tipocombustible']}"]`).prop('selected',true); 
        $("#tipocombustiblemodal").trigger("chosen:updated");

        $("#tipomedicionmodal").find('option').prop('selected', false);
        $.each(data.resultado.tipomedicion, function(i,item){
          // $(`#tipomedicionmodal option[value="${item['idmv_tipomedicion']}"]`).prop('selected',true); 
          // $("#tipomedicionmodal").trigger("chosen:updated");

          $("#tipomedicionmodal").find(`.option_tipocomb_${item.idmv_tipomedicion}`).prop('selected', true);
          $("#tipomedicionmodal").trigger("chosen:updated");


        });

        // $('.option_marca').prop('selected',false); 
        // $(`#marcacombocodal option[value="${data.resultado['idmv_marca']}"]`).prop('selected',true); 
        // $("#marcacombocodal").trigger("chosen:updated");



        $('#frm_EditVehiculo_').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/registro/'+ivehiculo);


         if(data.resultado.matricula.length===0){
            $('#tb_litadomatricula').append(
             `<tr>
                 <td colspan="4"><center>Sin datos que mostrar</center></td>
                 
                 
                 </tr>`);
        }

         $.each(data.resultado.matricula, function(i,item){
            if(item.detalle==null){var detallem="";}
            else{var detallem=item.detalle}
             $('#tb_litadomatricula').append(
             `<tr>
                 <td>${detallem}</td>
                 <td>${item.fecha_matricula}</td>
                 <td>${item.fecha_vigencia}</td>
                 <td>
                 <center>
                 
                    <button type="button" onclick="eliminarmatr('${item.idmv_matricula}','${item.idmv_vehiculo}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-trash"></i></button>
                   
                    </center>
                    </td>

                 
                 </tr>`);
                        
        

         });

      
        if(data.resultado.imagenes.length===0){
            $('#tb_listadoimagen').append(
             `<tr>
                 <td colspan="3"><center>Sin imagenes que mostrar</center></td>
                 
                 
                 </tr>`);
        }
         $.each(data.resultado.imagenes, function(i,item){
            if(item.detalle==null){var detall="";}
            else{var detall=item.detalle}
              
             $('#tb_listadoimagen').append(
             `<tr>
                 <td>${detall}</td>
                 <td>
                  <center><img id="verimgmodal"src="visualizarimg/${item.imagen}" width="50px" height="50px"style=""></center>
                 </td>
                 <td>
                 <center>
                    <button type="button" onclick="eliminarimg('${item.idmv_imagenvehiculo}','${item.idmv_vehiculo}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-trash"></i></button>
                   
                    </center>
                    </td>

                 
                 </tr>`);
                        
        

         });



    });    
   $("#modaleditarvehiculo").modal("show"); 

    }
    function verimg(id){
      //  $('#verimgmodal').attr('src','/DocumentosManuales/'+id); // Renderizamos la imagen

       // var id2='Imgmenu-202005021588461063.png';
        //var ruta= base64_encode(\Storage::disk('diskMenuInicoImagen')->get(id2);
            
         $('#verimgmodal').attr('src',"visualizarimg/"+id);
            
    }


    $('#modaleditarvehiculo').on('hidden.bs.modal', function (e) {
        $('#check_imagen_').iCheck('uncheck');
        limpiarmodal();
      
          })


       function eliminarmatr(id,idvehic) {
      $('html,body').animate({scrollTop:$('#modaledi').offset().top},400);
      vistacargando('M','Espere');
    // console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
        //editarmodal(idvehic);
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/matricula/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmEditarModal').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
              editarmodal(idvehic);
              vistacargando();
            
          }, error:function (requestData) {
            vistacargando('M','Espere');
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   

  }


      function eliminarimg(id,idvehic) {
      $('html,body').animate({scrollTop:$('#modaledi').offset().top},400);
      vistacargando('M','Espere');
    // console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
        //editarmodal(idvehic);
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/imagenes/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmEditarModal').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
              editarmodal(idvehic);
              vistacargando();
            
          }, error:function (requestData) {
            vistacargando('M','Espere');
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   

  }

    

  function btn_eliminarveh(btn){
            if(confirm('¿Quiere eliminar el registro?')){
                $(btn).parent('.frm_eliminar').submit();
            }
        }
    
    $('#check_novedades').on('ifChecked', function(event){

             
             $('#nov').removeClass('hidden');
    });
    $('#check_novedades').on('ifUnchecked', function(event){
                      
             $('#nov').addClass('hidden');
    });

    $('#check_servicio').on('ifChecked', function(event){

             
             $('#serv').removeClass('hidden');
    });
    $('#check_servicio').on('ifUnchecked', function(event){
                      
             $('#serv').addClass('hidden');
    });

     $('#check_custodio').on('ifChecked', function(event){

             
             $('#cus').removeClass('hidden');
    });
    $('#check_custodio').on('ifUnchecked', function(event){
                      
             $('#cus').addClass('hidden');
    });

    $('#check_componentes').on('ifChecked', function(event){

             
             $('#com').removeClass('hidden');
    });
    $('#check_componentes').on('ifUnchecked', function(event){
                      
             $('#com').addClass('hidden');
    });

    $('#check_novedades').on('ifChecked', function(event){

             
             $('#novedades').removeClass('hidden');
    });
    $('#check_novedades').on('ifUnchecked', function(event){
                      
             $('#novedades').addClass('hidden');
    });


    $('#check_matricula').on('ifChecked', function(event){
                      
             $('#matr').removeClass('hidden');
    });
    $('#check_matricula').on('ifUnchecked', function(event){
                      
             $('#matr').addClass('hidden');
    });

    $('#check_imagen').on('ifChecked', function(event){
                      
             $('#imagen').removeClass('hidden');
    });
    $('#check_imagen').on('ifUnchecked', function(event){
                      
             $('#imagen').addClass('hidden');
    });


    function eliminarvehiculomodal()
    {
      var idvehelim=$('#idvehiculomodal').val();
      $('#idvehiculoeliminar').val(idvehelim);
      $('#modaleliminarvehiculo').modal("show");
    }


    function detallevehmodal(id){
      cargartablaNovedadesVehi(id);
      $("#modaldetallevehiculo").modal("show");
      $('#idvehiculonov').val(id);
    }

    function custodiovehmodal(id){
      cargartablaCus(id);
      $("#modalcustodio").modal("show");
      $('#idvehcus').val(id);
    }



     function modalTipoNovedades(){
     cargartablaNovedades();
     $("#modaldetallevehiculo").modal("hide");
      $("#modalnovedades").modal("show");
    }

     $('#modalnovedades').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
       $("#modaldetallevehiculo").modal("show");
       actualizarcombostiponov();
         })



     function modalMarcaComponte(){
     cargartablaMarcaComp();
     $("#modalcomponentevehiculo").modal("hide");
      $("#modalmarcacomp").modal("show");
    }

     $('#modalmarcacomp').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
      // $("#modalcomponentevehiculo").modal("show");
       actualizarcombomarcacomp();
         })



    
     function serviciovehmodal(id){
      cargartablaFreVehi(id);
      $("#modalfrecuenciavehiculo").modal("show");
      $('#idvehiculofre').val(id);
    }

    function componentesvehmodal(id){
      cargartablaCompVehi(id);
      $("#modalcomponentevehiculo").modal("show");
      $('#idvcompfre').val(id);
    }

     
      function actualizarcombostiponov(){

         $('#cmb_novedadvehi').find('option').remove().end();
         $('#cmb_novedadvehi').append('<option value="">Selecccione un  tipo</option>');
         var id=1;
        $.get("/novedades/cargacombotiponovedades/"+id+'/', function(data){
          console.log(data);
        $.each(data.resultado,function(i,item){

        $('#cmb_novedadvehi').append('<option class="novedad" value="'+item.idmv_tiponovedades+'">'+item.detalle+'</option>');
         });

        $("#cmb_novedadvehi").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }


  function actualizarcombotipocombustible(){

         $('#cmb_tipocombustible').find('option').remove().end();
         $('#cmb_tipocombustible').append('<option value="">Selecccione un tipo</option>');
         var id=1;
        $.get("/vehiculo/cargacombotipocombustible/"+id+'/', function(data){
            console.log(data);
        $.each(data.resultado,function(i,item){
        $('#cmb_tipocombustible').append('<option class="meta" value="'+item.idmv_tipocombustible+'">'+item.detalle+'</option>');
         });

        $("#cmb_tipocombustible").trigger("chosen:updated"); 
       }).fail(function(){
         alert("erer");
        
       });
  }


  function modalTipoCombustible(){
      cargartablaTipoComb();
      $("#modaltipocomb").modal("show");
    }

     $('#modaltipocomb').on('hidden.bs.modal', function (e) {
        
       $('#idmv_marca').val('');
       $('marcam').val('');
       actualizarcombotipocombustible();
       //actualizarcombomarca_();
         })


  /////////////////////////////////////////////////////////////////////////////////


  /////////////modal tipo combustible///////////////////////////////////////////////

  $("#frm_TipoCombustible").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_TipoCombustible').val()=='POST')
        {
          console.log('Guardar');
          guardarTipoCombustible();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarTipoCombustible();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarTipoCombustible() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_TipoCombustible").serialize();
        $.ajax({
            url:'/vehiculo/tipocombustible', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipoCombustible').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipoComb();
                cargartablaTipoComb();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarTipoCombustible(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idtipocombustible').val();
        //alert(id);
        //var id=1;
        console.log(id);
        var data=$("#frm_TipoCombustible").serialize();
        $.ajax({
            url:'/vehiculo/tipocombustible/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmTipoCombustible').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposTipoComb();
                cargartablaTipoComb();
                $('#method_TipoCombustible').val('POST'); 
                $('#frm_TipoCombustible').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarTipoCombustible/');
                 $('#btn_mtipocomb_cancelar').addClass('hidden');
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposTipoComb(){
      $('#tipocombustiblem').val('');
      $('#idtipocombustible').val('');
    }


     function cargartablaTipoComb(){
      var id=1;

               $.get("/vehiculo/"+id+'/llenartipocomb', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_tipocomb";
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
                                    <button type="button" onclick="editar_tipocomb('${data.idmv_tipocombustible_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
                                    <button type="button" onclick="eliminarTipoComb('${data.idmv_tipocombustible_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


   function eliminarTipoComb(id) {
    console.log(id);
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/tipocombustible/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmTipoCombustible').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaTipoComb();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposTipoComb();

  }

    function editar_tipocomb(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/tipocombustible/"+id+'/editcomb', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#tipocombustiblem').val(data.resultado.detalle);
         $('#idtipocombustible').val(data.resultado.idmv_tipocombustible);
        
         });
       $('#method_TipoCombustible').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_marca_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
   $('#btn_mtipocomb_cancelar').click(function(){
   $('#tipocombustiblem').val('');
   $('#method_TipoCombustible').val('POST'); 
   $('#frm_TipoCombustible').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarTipoCombustible/');
   $(this).addClass('hidden');


    });




    ///////////////modal  custodio/////////////////////////////////////////////

  $("#frm_CusVeh").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_CusVeh').val()=='POST')
        {
          console.log('Guardar');
          guardarCustodioVehi();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarCustodioVehi();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarCustodioVehi() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        var id=$('#idvehcus').val();
        var data=$("#frm_CusVeh").serialize();
        $.ajax({
            url:'/vehiculo/custodio', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmCusVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCusVehi();
                cargartablaCus(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarCustodioVehi(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idvehcus').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_CusVeh").serialize();
        $.ajax({
            url:'/vehiculo/custodio/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmCusVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCusVehi();
                cargartablaCus(id);
                $('#method_CusVeh').val('POST'); 
                $('#frm_CusVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/custodio/');
                 $('#btn_cus_cancelar').addClass('hidden');
                 // location.reload();
                 // setInterval(function() {
                 //      $('#modalnovedades').modal('hide');
                 //  }, 3000);
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCusVehi(){
      $('#acta').val('');
      $('#fechaini').val('');
      $('#fechafin').val('');
      $('.option_persona').prop('selected',false); // deseleccionamos
      $("#cmb_persona").trigger("chosen:updated");
      $('.act').prop('selected',false);
      $('.inac').prop('selected',false); // deseleccionamos
      $("#cmb_estado").trigger("chosen:updated");
      $('#idcus').val('');  
    }


     function cargartablaCus(id){
      //var id=1;
      //
      console.log(id);
               $.get("/custodio/"+id+'/llenarcus', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_cusveh";
                    $(`#${idtabla}`).DataTable({
                       dom: ""
                    +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
                    +"<rt>"
                    +"<'row'<'form-inline'"
                    +" <'col-sm-6 col-md-6 col-lg-6'l>"
                    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                    "destroy":true,
                     "order": [[ 2, "asc" ]],
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
                            {data: "tipopersonarol.usuario.name" },
                            {data: "tipopersonarol.tipo.detalle" },
                            {data: "estado" },
                            {data: "fecha_ini" },
                            {data: "fecha_fin" },
                            {data: "fecha_fin" },
                          
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(5).html(`
                          <a href="/custodio/imprimir/${data.idmv_custodio}"><button type="button" class="btn btn-sm btn-primary btn_icon" style="margin-bottom: 0;"data-toggle="tooltip" data-original-title="Imprimir Custodio"><i class="fa fa-print"></i></button></a>
                          <button type="button" onclick="editar_cus('${data.idmv_custodio}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"data-toggle="tooltip" data-original-title="Editar"><i class="fa fa-edit"></i></button>
                          <button type="button" onclick="eliminarcusveh('${data.idmv_custodio}')" class="btn btn-sm btn-danger btn_icon"style="margin-bottom: 0;data-toggle="tooltip" data-original-title="Eliminar"  ><i class="fa fa-remove"></i></button>
          
                                `);
    
                         if(data.estado=='Inactivo'){
                                    // estad="Pendiente";
                                    $('td',row).eq(2).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-danger estado_validado"> Inactivo &nbsp;</span>');
                                }
                         else{
                                    // estad="Atendido"
                                   $('td',row).eq(2).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-success estado_validado"> Activo &nbsp; &nbsp;&nbsp;</span>'); 
                        }  
                        } 



                        }); 

                        });                               
                    

     }

     function imprimir_cus(id)
     {
       $.get("/custodio/"+id+'/imprimircustodio', function (data) {

       });
     }

    
    function eliminarcusveh(id) {
    console.log(id);
     var idv=$('#idvehcus').val();
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/custodio/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmCusVeh').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaCus(idv);
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

        limpiarCusVehi();
  }

    function editar_cus(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/custodio/"+id+'/editcus', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#idcus').val(data.resultado.idmv_custodio);
         $('#acta').val(data.resultado.acta);
         $('#fechaini').val(data.resultado.fecha_ini);
         $('#fechafin').val(data.resultado.fecha_fin);
         $('.act').prop('selected',false);
         $('.ini').prop('selected',false); // deseleccioamos
         $(`#cmb_estado option[value="${data.resultado['estado']}"]`).prop('selected',true); // seleccionamos 
         $("#cmb_estado").trigger("chosen:updated"); 
         $('.option_persona').prop('selected',false); // deseleccioamos
         $(`#cmb_persona option[value="${data.resultado['idmv_tiporolpersona']}"]`).prop('selected',true); // seleccionamos 
         $("#cmb_persona").trigger("chosen:updated"); 
        
        
         });
       $('#method_CusVeh').val('PUT'); // decimo que sea un metodo put
      // $('#frm_NovedadesVeh').attr('action','/novedades/registro/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_cus_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_cus_cancelar').click(function(){
    $('#acta').val('');
    $('#idcus').val('');
      $('#fechaini').val('');
      $('#fechafin').val('');
      $('.option_persona').prop('selected',false); // deseleccionamos
      $("#cmb_persona").trigger("chosen:updated");
      $('.act').prop('selected',false);
      $('.inac').prop('selected',false); // deseleccionamos
      $("#cmb_estado").trigger("chosen:updated");
    $('#method_CusVeh').val('POST'); 
    $('#frm_CusVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/custodio/');
    $(this).addClass('hidden');


    });

  

  ///////////////modal  novedades/////////////////////////////////////////////

  $("#frm_NovedadesVeh").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_NovedadesVeh').val()=='POST')
        {
          console.log('Guardar');
          guardarNovedadesVehi();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarTipoNovedadesVehi();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarNovedadesVehi() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        var id=$('#idvehiculonov').val();
        var data=$("#frm_NovedadesVeh").serialize();
        $.ajax({
            url:'/vehiculo/novedad', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmNovedadesVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposNovedadesVehi();
                cargartablaNovedadesVehi(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarTipoNovedadesVehi(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idvehiculonov').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_NovedadesVeh").serialize();
        $.ajax({
            url:'/vehiculo/novedad/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmNovedadesVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposNovedadesVehi();
                cargartablaNovedadesVehi(id);
                $('#method_NovedadesVeh').val('POST'); 
                $('#frm_NovedadesVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/novedad/');
                 $('#btn_novveh_cancelar').addClass('hidden');
                 // location.reload();
                 // setInterval(function() {
                 //      $('#modalnovedades').modal('hide');
                 //  }, 3000);
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposNovedadesVehi(){
      $('#idnov').val('');
      $('#detalle').val('');
      $('#fecha').val('');
      $('.novedad').prop('selected',false); // deseleccionamos
      $("#cmb_novedadvehi").trigger("chosen:updated");
    }


     function cargartablaNovedadesVehi(id){
      //var id=1;
      //
      console.log(id);
               $.get("/novedades/"+id+'/llenarnov', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_novveh";
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
                            {data: "tipo.detalle" },
                            {data: "detalle" },
                            {data: "fecharegistro" },
                            {data: "detalle" },
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(3).html(`
                                    <button type="button" onclick="editar_novveh('${data.idmv_novedades}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarNovedveh('${data.idmv_novedades}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarNovedveh(id) {
    console.log(id);
     var idv=$('#idvehiculonov').val();
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/novedad/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmNovedadesVeh').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaNovedadesVehi(idv);
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

        limpiarCamposNovedadesVehi();
  }

    function editar_novveh(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/novedades/"+id+'/editarnovedades', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#detalle').val(data.resultado.detalle);
         $('#fecha').val(data.resultado.fechanovedad);
         $('#idnov').val(data.resultado.idmv_novedades);
         $('.novedad').prop('selected',false); // deseleccioamos
         $(`#cmb_novedadvehi option[value="${data.resultado['idmv_tiponovedades']}"]`).prop('selected',true); // seleccionamos 
         $("#cmb_novedadvehi").trigger("chosen:updated"); 
        
        
         });
       $('#method_NovedadesVeh').val('PUT'); // decimo que sea un metodo put
      // $('#frm_NovedadesVeh').attr('action','/novedades/registro/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_novveh_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_novveh_cancelar').click(function(){
    $('#detalle').val('');
    $('#fecha').val('');
    $('#idnov').val('');
    $('.novedad').prop('selected',false); // deseleccionamos
   $("#cmb_novedadvehi").trigger("chosen:updated"); // actualizamos el combo 
   
    $('#method_NovedadesVeh').val('POST'); 
    $('#frm_NovedadesVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/novedades/');
    $(this).addClass('hidden');


    });




///////////////modal  fecuencia servico/////////////////////////////////////////////

  $("#frm_FrecuenciaVeh").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_FrecuenciaVeh').val()=='POST')
        {
          console.log('Guardar');
          guardarfrecuenciaVehi();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarFrecuenenciaVehi();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarfrecuenciaVehi() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        var id=$('#idvehiculofre').val();
        var data=$("#frm_FrecuenciaVeh").serialize();
        $.ajax({
            url:'/vehiculo/servicios', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmFrecuenciaVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCampoFrecVehi();
                cargartablaFreVehi(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarFrecuenenciaVehi(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idvehiculofre').val();
        console.log(id);
        //var id=1;
        console.log(id);
        var data=$("#frm_FrecuenciaVeh").serialize();
        $.ajax({
            url:'/vehiculo/servicios/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmFrecuenciaVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCampoFrecVehi();
                cargartablaFreVehi(id);
                $('#method_FrecuenciaVeh').val('POST'); 
                $('#frm_FrecuenciaVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/servicios/');
                 $('#btn_frecu_cancelar').addClass('hidden');
                 // location.reload();
                 // setInterval(function() {
                 //      $('#modalnovedades').modal('hide');
                 //  }, 3000);
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCampoFrecVehi(){
        $('#valor').val('');
        $('#idfrec').val('');
        $('#fechaserv').val('');
        $('.novedad').prop('selected',false); // deseleccionamos
        $("#cmb_novedadvehi").trigger("chosen:updated"); // actualizamos el combo 
        $('.servicio').prop('selected',false); // deseleccionamos
        $("#serviciocombo").trigger("chosen:updated"); // actualizamos el combo 
        $('.unidad').prop('selected',false); // deseleccionamos
        $("#unidadcombo").trigger("chosen:updated"); // actualizamos el combo 
   
    }


     function cargartablaFreVehi(id){
      //var id=1;
      //
      console.log(id);
               $.get("/servicios/"+id+'/llenarserv', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_freveh";
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
                            {data: "servicio.detalle" },
                            {data: "unidad.detalle" },
                            {data: "valor" },
                            {data: "fecharegistro" },
                            {data: "fecharegistro" },
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(4).html(`
                                    <button type="button" onclick="editar_freveh('${data.idmv_frecuenciaservicio}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarFreveh('${data.idmv_frecuenciaservicio}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarFreveh(id) {
    console.log(id);
     var idv=$('#idvehiculofre').val();
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/servicios/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmFrecuenciaVeh').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaFreVehi(idv);
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

        limpiarCampoFrecVehi();
  }

    function editar_freveh(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/servicios/"+id+'/editserv', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#valor').val(data.resultado.valor);
         $('#fechaserv').val(data.resultado.fechaservicio);
         $('#idfrec').val(data.resultado.idmv_frecuenciaservicio);
         $('.unidad').prop('selected',false); // deseleccioamos
         $(`#unidadcombo option[value="${data.resultado['idmv_unidadmedida']}"]`).prop('selected',true); // seleccionamos 
         $("#unidadcombo").trigger("chosen:updated");
         $('.servicio').prop('selected',false); // deseleccioamos
         $(`#serviciocombo option[value="${data.resultado['idmv_servicio']}"]`).prop('selected',true); // seleccionamos 
         $("#serviciocombo").trigger("chosen:updated"); 
        
        
         });
       $('#method_FrecuenciaVeh').val('PUT'); // decimo que sea un metodo put
      // $('#frm_NovedadesVeh').attr('action','/novedades/registro/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_frecu_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_frecu_cancelar').click(function(){
    $('#valor').val('');
    $('#fechaserv').val('');
    $('#idfrec').val('');
    $('.novedad').prop('selected',false); // deseleccionamos
    $("#cmb_novedadvehi").trigger("chosen:updated"); // actualizamos el combo 
    $('.servicio').prop('selected',false); // deseleccionamos
    $("#serviciocombo").trigger("chosen:updated"); // actualizamos el combo 
    $('.unidad').prop('selected',false); // deseleccionamos
    $("#unidadcombo").trigger("chosen:updated"); // actualizamos el combo 
   
    $('#method_FrecuenciaVeh').val('POST'); 
    $('#frm_FrecuenciaVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/servicios/');
    $(this).addClass('hidden');


    });





    ///////////////modal  componentes vehiculos/////////////////////////////////////////////

  $("#frm_CompoVeh").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_CompoVeh').val()=='POST')
        {
          console.log('Guardar');
          guardarComponenteVehi();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarComponenteVehi();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarComponenteVehi() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        var id=$('#idvcompfre').val();
        var data=$("#frm_CompoVeh").serialize();
        $.ajax({
            url:'/vehiculo/componentes', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmCompoVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCampoCompVehi();
                cargartablaCompVehi(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarComponenteVehi(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idvcompfre').val();
        console.log(id);
        //var id=1;
        console.log(id);
        var data=$("#frm_CompoVeh").serialize();
        $.ajax({
            url:'/vehiculo/componentes/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmCompoVeh').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCampoCompVehi();
                cargartablaCompVehi(id);
                $('#method_CompoVeh').val('POST'); 
                $('#frm_CompoVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/componentes/');
                $('#btn_compo_cancelar').addClass('hidden');
                 // location.reload();
                 // setInterval(function() {
                 //      $('#modalnovedades').modal('hide');
                 //  }, 3000);
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCampoCompVehi(){
       $('#idcomp').val('');
       $('.componente_').prop('selected',false); // deseleccionamos
       $("#componentecombo").trigger("chosen:updated"); // actualizamos el combo 
       $('#descripcioncom').val('');
       $('#fechacom').val('');
     
    }


     function cargartablaCompVehi(id){
      //var id=1;
      //
      console.log(id);
               $.get("/componentes/"+id+'/llenarcomp', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_compoveh";
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
                            {data: "componente.detalle" },
                            {data: "componente.marca.detalle" },
                            {data: "componente.tipo" },
                            {data: "descripcion" },
                            {data: "fecha_registro" },
                            {data: "componente.tipo" },
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(5).html(`
                                    <button type="button" onclick="editar_compveh('${data.idmv_vehiculocomponente}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarCompveh('${data.idmv_vehiculocomponente}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }
      

      function eliminarCompveh(id) {
    console.log(id);
     var idv=$('#idvcompfre').val();
    if(confirm('¿Quiere eliminar el registro?')){
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
      });
      $.ajax({
          url:'/vehiculo/componentes/'+id, // Url que se envia para la solicitud
          method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
          dataType: 'json',
          success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
          {
            console.log(requestData);
            $('#msmCompoVeh').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaCompVehi(idv);
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

        limpiarCampoCompVehi();
  }

    function editar_compveh(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/componentes/"+id+'/editcomp', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
        
         $('#idcomp').val(data.resultado.idmv_vehiculocomponente);
         $('.componente_').prop('selected',false); // deseleccioamos
         $(`#componentecombo option[value="${data.resultado['idmv_componente']}"]`).prop('selected',true); // seleccionamos 
         $("#componentecombo").trigger("chosen:updated");
         $('#descripcioncom').val(data.resultado.descripcion);
         $('#fechacom').val(data.resultado.fechaentrega);
        

         });

       $('#method_CompoVeh').val('PUT'); // decimo que sea un metodo put
      // $('#frm_NovedadesVeh').attr('action','/novedades/registro/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_compo_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_compo_cancelar').click(function(){
    $('#idcomp').val('');
    $('.componente_').prop('selected',false); // deseleccionamos
    $("#componentecombo").trigger("chosen:updated"); // actualizamos el combo 
    $('#descripcioncom').val('');
    $('#fechacom').val('');
    
    $('#method_CompoVeh').val('POST'); 
    $('#frm_CompoVeh').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/componentes/');
    $(this).addClass('hidden');


    });

//////////////////////////////////////////////////////////////////////////////////////////////////


$("#frm_MarcaComp").on("submit", function(e){
        e.preventDefault();
        //guardarMedioVerificacion();
        if($('#method_MarcaComp').val()=='POST')
        {
          console.log('Guardar');
          guardarMarcaCom();
          // cargacombometa($('#idproyectopoa').val());
          //cargacombometa(id);
        }
        else{
          console.log('editar');
          editarMarcaC();
          //cargacombometa($('#idproyectopoa').val());
         // $('#btn_marca_cancelar').addClass('hidden');

        }


         function guardarMarcaCom() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
       
        
        var data=$("#frm_MarcaComp").serialize();
        $.ajax({
            url:'/vehiculo/marca', // Url que se envia para la solicitud
            method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmMarcaComp').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposMarcac();
                cargartablaMarcaComp();
            }, error:function (requestData) {
                console.log(requestData);
            }
            });
        //cargartablaMedio(id)

    }
    });

      function editarMarcaC(valorid) {

      console.log(valorid);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    
        var id=$('#idmarcac').val();
        //var id=1;
        console.log(id);
        var data=$("#frm_MarcaComp").serialize();
        $.ajax({
            url:'/vehiculo/marca/'+id, // Url que se envia para la solicitud
            method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
            data: data,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                console.log(requestData);
                //console.log(requestData);
                $('#msmMarcaComp').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCamposMarcac();
                cargartablaMarcaComp();
                $('#method_MarcaComp').val('POST'); 
                $('#frm_MarcaComp').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarMarca/');
                 $('#btn_marcac_cancelar').addClass('hidden');
                //cargacombometa(id);
            }, error:function (requestData) {
                console.log(requestData);
            }
            });

    }
    function limpiarCamposMarcac(){
      $('#marcamc').val('');
      $('#idmarcac').val('');
    }


     function cargartablaMarcaComp(){
      var id=1;

               $.get("/vehiculo/"+id+'/llenarmarca', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_marcac";
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
                                    <button type="button" onclick="editar_marcac('${data.idmv_marca_encrypt}')" class="btn btn-sm btn-info btn_icon" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="eliminarMarcac('${data.idmv_marca_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip"  style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }


      function eliminarMarcac(id) {
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
            $('#msmMarcaComp').html(`
              <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
              <div class="col-md-12 col-sm-6 col-xs-12">
                  <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                      </button>
                      <strong>Información: </strong> ${requestData.mensaje}
                  </div>
              </div>
              `);
            cargartablaMarcaComp();
          }, error:function (requestData) {
            console.log('Error no se puedo completar la acción');
          }
      });
      }

   limpiarCamposMarcac();

  }

       function editar_marcac(id){
    //limpiarCamposMedioV();
    var valorid=id;
    console.log(valorid);
     //$('#conten_add_documento').html('');
    $.get("/vehiculo/"+id+'/editmarca', function (data) {
      console.log(data);
         //$('#idmedioverificacion').val(data.resultado.idmedio_verificacion_encrypt);
 
         $('#marcamc').val(data.resultado.detalle);
         $('#idmarcac').val(data.resultado.idmv_marca);
        
         });
       $('#method_MarcaComp').val('PUT'); // decimo que sea un metodo put
       // $('#frm_medio_verificacion').attr('action','/gestionMedioVerificacionPoa/medioVerificacion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_marcac_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        //$('html,body').animate({scrollTop:$('#msmMarca').offset().top},400); 


    }
    $('#btn_marcac_cancelar').click(function(){
   $('#marcamc').val('');
   $('#method_MarcaComp').val('POST'); 
    $('#frm_MarcaComp').prop('action',window.location.protocol+'//'+window.location.host+'/vehiculo/guardarMarca/');
    $(this).addClass('hidden');


    });






   

   