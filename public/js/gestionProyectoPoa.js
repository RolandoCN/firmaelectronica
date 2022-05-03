//funcion para validar fecha para que no sea inferior a la otra
    //document.getElementById("fecha_fin").onchange = function() {validarFecha()};
function validarFecha() {
    	if($('#fecha_inicio').val()>=$('#fecha_fin').val()){
    		 $('#fecha_fin').addClass('parsley-error');
    		 $('#fecha_fin').val("");
    		}else{
    			 $('#fecha_fin').removeClass('parsley-error');
    		}
}
//evento de observacion del proyecto
//$('#btnObG').click(function (e) {
function observacionProyecto (e) {
    $('#modalVerObser').modal('show');
    $('#msmObser').html(e);
}
//accion de guardar proyecto
$("#frm_proyecto").on("submit", function(e){

    // e.preventDefault();
    // alert($('#cmb_competencia').val());
    // if($('#cmb_competencia').val()==0){
    //   alertNotificar('Por favor seleccione la competencia','error');
    //   return;
    // }else{
    //   if($('#idpoa_obj_pdot').val()==0){
      
    //   }
    // }
    vistacargando('M','Espere por favor') ;
});
//funcion para eliminar
    function btn_eliminar_proyecto(btn){
        if(confirm('¿Quiere eliminar el registro?')){
            $(btn).parent('.frm_eliminar').submit();
              vistacargando('M','Espere por favor');
        }
    }  
    
    function btn_eliminar_proyectojs(id){
        if(confirm('¿Quiere eliminar el registro?')){
              vistacargando('M','Espere por favor');
              $.ajaxSetup({
                  headers: {
                      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                  }
              });
              $.ajax({
                  url:'/gestionProyectoPoa/eliminarPoa/'+id, // Url que se envia para la solicitud
                  method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
                  dataType: 'json',
                  success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
                  {
                     vistacargando();
                    $('#msmProyecto').html(`
                      <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                      <div class="col-md-6 col-sm-6 col-xs-12">
                          <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                              </button>
                              <strong>Información: </strong> ${requestData.mensajeProyecto}
                          </div>
                      </div>
                      `);
                     obtenerListProyectoPoa();

                  }, error:function (requestData) {
                     vistacargando();
                    console.log('Error no se puedo completar la acción');
                  }
              });
        }
    }

// ============================ METODOS PARA LA GESTIÓN DE PROYECTO ==================================
    function editar_proyecto(idproyecto){
        $.get("/gestionProyectoPoa/proyecto/"+idproyecto+"/edit", function (resultado) {
            $('.option_competencia').prop('selected',false);
            $(`#cmb_competencia option[value="${resultado['resultado']['pdot']['idpoa_competencia']}"]`).prop('selected',true);
            $("#cmb_competencia").trigger("chosen:updated");
            competanciachange(`${resultado['resultado']['pdot']['idpoa_competencia']}`,`${resultado['resultado']['pdot']['objetivo_p_d_n']['descripcion']}`,`${resultado['resultado']['idpoa_obj_pdot']}`);


            $('#perfil_proyecto').removeAttr("required");
            $('#listMeta').html("");
            $('#codigo').val(resultado.resultado.codigo);
            $('#nombre').val(resultado.resultado.nombre);
            $('#objectivo').val(resultado.resultado.objectivo);
            $('.option_pdot').prop('selected',false);
            $(`#idpoa_obj_pdot option[value="${resultado.resultado.idpoa_obj_pdot}"]`).prop('selected',true);
            $("#idpoa_obj_pdot").trigger("chosen:updated");
            // $('#indicador').val(resultado.resultado.indicador);
            $('.option_meta').prop('selected',false);
            $(`#idmeta option[value="${resultado.resultado.idmeta}"]`).prop('selected',true);
            $("#idmeta").trigger("chosen:updated"); // actualizamos el combo
            $('#fecha_inicio').val(resultado.resultado.fecha_inicio);
            $('#fecha_fin').val(resultado.resultado.fecha_fin);
            $('.option_periodo').prop('selected',false);
            $(`#idperiodo option[value="${resultado.resultado.idperiodo}"]`).prop('selected',true);
            $("#idperiodo").trigger("chosen:updated"); // actualizamos el combo
           
            if(resultado.resultado.tiene_contratacion=='1'){
               $('#tiene_contratacion1').iCheck('check');
               $('#tiene_contratacion2').iCheck('uncheck');
               $('#tiene_contratacion3').iCheck('uncheck');
            }else if(resultado.resultado.tiene_contratacion=='0'){
               $('#tiene_contratacion2').iCheck('check');
               $('#tiene_contratacion1').iCheck('uncheck');
               $('#tiene_contratacion3').iCheck('uncheck');
            }else if(resultado.resultado.tiene_contratacion=='2'){
              $('#tiene_contratacion2').iCheck('uncheck');
              $('#tiene_contratacion1').iCheck('uncheck');
              $('#tiene_contratacion3').iCheck('check');

            }else{
               $('#tiene_contratacion2').iCheck('uncheck');
               $('#tiene_contratacion1').iCheck('uncheck');
               $('#tiene_contratacion3').iCheck('uncheck');
            }
            //mostrar editar meta
            $.each(resultado.resultado.meta,function(i,item){
                console.log(item.descripcion);
                $('#listMeta').append(`
                      <div class="itemMeta text-ligth" style="margin-bottom:8px;" >
                           <span class=" right btn btn-xs fa fa-minus btn-danger right"onclick="eliminarMetaBD(this,${item.idmeta})" style="">  </span>
                           <textarea class="form-control has-feedback-right" name="meta[${item.idmeta}]" value="${item.descripcion}" placeholder="Descripción de la meta" required>${item.descripcion}</textarea>
                      </div>
                   `);
            });


        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_proyecto').val('PUT');
        $('#frm_proyecto').attr('action','/gestionProyectoPoa/proyecto/'+idproyecto);
        $('#btn_proyecto_cancelar').removeClass('hidden'); // mostramos el boton cancelar
        $('html,body').animate({scrollTop:$('#administrador_proyecto').offset().top},400);
    }


    $('#btn_proyecto_cancelar').click(function(){
        $('#method_proyecto').val('POST');
        $('#frm_proyecto').attr('action','/gestionProyectoPoa/proyecto');
        $(this).addClass('hidden');
        $('#codigo').val('');
        $('#nombre').val('');
        $('#objectivo').val('');
        // $('#indicador').val('');
        $('.option_meta').prop('selected',false);
        $("#idmeta").trigger("chosen:updated"); // actualizamos el combo
        $('#fecha_inicio').val('');
        $('#fecha_fin').val('');
        $('.option_periodo').prop('selected',false);
        $("#idperiodo").trigger("chosen:updated"); // actualizamos el combo
        $('#listMeta').html("");
        $('#tiene_contratacion2').iCheck('uncheck');
        $('#tiene_contratacion1').iCheck('uncheck');
        $('#tiene_contratacion3').iCheck('uncheck');
        $('.option_pdot').prop('selected',false);
        $("#idpoa_obj_pdot").trigger("chosen:updated");
        $('#selec_pdot').hide(200);
        $('#idpoa_obj_pdot').html(``);
        $('#pdn_input').hide(200);
        $('#cmb_competencia').val('0');
        $('.option_competencia').prop("selected", false);
        $(`#cmb_competencia option[value="0"]`).prop("selected", true);  
        $("#cmb_competencia").trigger("chosen:updated")


    });
    //obtener lista de proyecto poa
    function obtenerListProyectoPoa() {

       $.get("getProyecto", function (data) {
         var t=parseFloat(data.totalPoa);
         $('#totalPoatxt').html(` <h2 > <b class="bg-success" style="padding:5px;">TOTAL POA $ ${new Intl.NumberFormat(["ban", "id"]).format(t)} </b>  </h2>`);
              llenarTablaPoa(data);
          });
    }
    // cargarr tabla poa
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
        "zeroRecords": "No se encontraron registros coincidentes",
        "infoEmpty": "No hay registros para mostrar",
        "infoFiltered": " - filtrado de MAX registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        }
    };
    function llenarTablaPoa(data) {
      var idtabla = "datatablePoa";
       var tablatramite = $('#datatablePoa').DataTable({
          dom: ""
          +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
          +"<rt>"
          +"<'row'<'form-inline'"
          +" <'col-sm-6 col-md-6 col-lg-6'l>"
          +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                "destroy":true,

                pageLength: 10,
                sInfoFiltered:false,
                data: data.listaProyecto,
                "language": lenguajeTabla,
                columnDefs: [
                    {  className: "col_sm", targets: 0 },
                    {  className: "sorting", targets: 1 },
                    {  className: "sorting col_sm", targets: 2 },
                    {  className: "sorting col_sm", targets: 3 }
                ],
            columns:[
                 {data: "idproyecto" },
                 {data: "codigo" },
                 {data: "nombre" },
                 {data: "objectivo" },
                //  {data :"indicador"},
                 {data: "objectivo" },
                 {data: "fecha_inicio" },
                 {data: "perfil_proyecto" },
                 {data: "valor"},
                 {data: "idproyecto" },

             ],
              "rowCallback": function( row, data, index ){
                   var set=[''];
                   var hr='';
                    $.each(data.meta,function(i,item){
                          if(i>0){hr=`<hr>`;}
                         set[i]= ` ${hr} ${item.descripcion} `;
                    });

                     $('td', row).eq(0).html(index+1);
                     $('td', row).eq(8).html(`<b>$ ${new Intl.NumberFormat(["ban", "id"]).format(data.valor)} </b>`);
                     $('td', row).eq(6).html(`INICIO <br> ${data.fecha_inicio} <hr> FIN <br> ${data.fecha_fin}`);
                     $('td', row).eq(7).html(`
                        <a class="btn btn-app" href="/buscarDocumento/diskFormatoProyectoPoa/${data.perfil_proyecto}" target='black'>
                            <i class="fa fa-file-pdf-o"></i> perfil proyecto
                        </a>
                      `);
                      $('td', row).eq(5).html(set);
                      var url=window.location.protocol+'//'+window.location.host;
                       //control de estado de los proyectos
                    if(data.estado=='A'){
                       $(row).addClass('bg-success');
                      $('td', row).eq(9).html(`
                           <center>
                              <a class="btn btn-block btn-success btn-sm" disabled> <i class="fa fa-check"></i> Aprobado</a>
                              <a class="btn btn-block btn-info btn-sm" href="${url}/gestionProyectoPoa/reportePoa" target='_black'> <i class="fa fa-download"></i>  Ver proyecto</a>
                          </center>
                      `);
                    }else if(data.estado=='R'){
                       $(row).addClass('bg-danger');
                        $('td', row).eq(9).html(`
                          <center>
                            <a class="btn btn-block btn-danger btn-sm" disabled> <i class="fa fa-thumbs-o-down"></i> Reprobado</a>
                            <a class="btn btn-block btn-info btn-sm" target='_black' href="${url}/gestionProyectoPoa/proyecto/'${data.idproyecto_encrypt}"> <i class="fa fa-eye"></i> Ver detalle</a>
                          </center>
                        `);
                    }else  if(data.estado=='P'){
                      $(row).addClass('bg-warning');
                      $('td', row).eq(9).html(`
                           <center>
                            <a class="btn btn-block btn-default btn-sm" disabled> <i class="fa fa-eye-slash"></i> En revision</a>
                            <a class="btn btn-block btn-info btn-sm" target='_black' href="${url}/gestionProyectoPoa/proyecto/'${data.idproyecto_encrypt}"> <i class="fa fa-eye"></i> Ver detalle</a>
                          </center>
                        `);
                    }else if(data.estado=='C'){
                       $(row).addClass('bg-info');
                       $('td', row).eq(9).html(`
                            <center>
                               <a class="btn btn-block btn-default btn-sm" disabled> <i class="fa fa-eye-slash"></i> Corregir</a>
                               <form method="POST" class="frm_eliminar" action="${url}/gestionProyectoPoa/proyecto/'${data.idproyecto_encrypt}"  enctype="multipart/form-data">
                                   <input type="hidden" name="_method" value="DELETE">
                                   <button type="button" onclick="editar_proyecto('${data.idproyecto_encrypt}')" class=" btn btn-block  btn-primary marginB0"><i class="fa fa-edit"></i> Editar</button>
                                   <button type="button" class="btn btn-block btn-warning marginB0"  onclick="modalProyecto('${data.idproyecto_encrypt}')"><i class="fa fa-external-link"></i> Completar</button>
                                   <a class="btn btn-block btn-success marginB0" href="${url}/gestionProyectoPoa/proyecto/.${data.idproyecto_encrypt}"> <i class="fa fa-thumbs-o-up"></i> Enviar a revisión</a>
                               </form>
                           </center>
                       `);
                    }else{
                      $('td', row).eq(9).html(`
                           <center>
                            <form method="POST" class="frm_eliminar" action="${url}/gestionProyectoPoa/proyecto/'${data.idproyecto_encrypt}"  enctype="multipart/form-data">
                                <input type="hidden" name="_method" value="DELETE">
                                <button type="button" onclick="editar_proyecto('${data.idproyecto_encrypt}')" class=" btn btn-block  btn-primary marginB0"><i class="fa fa-edit"></i> Editar</button>
                                <button type="button" class="btn btn-block btn-danger marginB0" onclick="btn_eliminar_proyectojs('${data.idproyecto_encrypt}')"><i class="fa fa-trash"></i> Eliminar</button>
                                <button type="button" class="btn btn-block btn-warning marginB0"  onclick="modalProyecto('${data.idproyecto_encrypt}')"><i class="fa fa-external-link"></i> Completar</button>
                                <a class="btn btn-block btn-success marginB0" href="${url}/gestionProyectoPoa/proyecto/.${data.idproyecto_encrypt}"> <i class="fa fa-thumbs-o-up"></i> Enviar a revisión</a>
                            </form>
                          </center>
                      `);
                    }
          }
      });
      // para posicionar el input del filtro
      $(`#${idtabla}_filter`).css('float', 'left');
      $(`#${idtabla}_filter`).children('label').css('width', '100%');
      $(`#${idtabla}_filter`).parent().css('padding-left','0');
      $(`#${idtabla}_wrapper`).css('margin-top','10px');
      $(`input[aria-controls="${idtabla}"]`).css('width', '50%');
      //buscamos las columnas que deceamos que sean las mas angostas
      $(`#${idtabla}`).find('.col_sm').css('width','10px');
      // $(`#${idtabla}`).find('.col_lg').css('width','300px');

    }

// ============================ /METODOS PARA LA GESTIÓN DE PROYECTO ==================================
// show modal meta
    var con=1;
    $('#btnmetaadd').click(function(){
        con=con+1;
        $('#listMeta').append(`
            <div class="itemMeta text-ligth" style="margin-bottom:8px;">
             <span class=" right btn btn-xs fa fa-minus bg-danger right"onclick="eliminarMeta(this)" style="">  </span>
             <textarea class="form-control has-feedback-right" name="meta[null${con}new]" placeholder="Descripción de la meta"value="" required></textarea>
            </div>
        `);
    });
    //quitar meta de la lista
    function eliminarMeta(btn) {
         $(btn).parents('.itemMeta').remove();
         con=con-1;
    }
    //eliminar meta del proyecto poa
    function eliminarMetaBD(este,id) {
        if(confirm('¿Quiere eliminar el registro?')){
            $.get("deleteMeta/"+id, function (data) {
                if (data.estadoP=='success') {
                    obtenerListProyectoPoa();
                   $(este).parents('.itemMeta').remove();
                    con=con-1;
                }
                $('#msmMeta_').html(`<i class="text-${data.estadoP}">${data.mensajeProyecto}</i>`);
                 window.setInterval("$('#msmMeta_').html('')",7000);

            }).fail(function(error){
                alert("Error al ejecutar la petición");
            });
        }

    }

 ///////////////////////////GESTION DE METAS///////////////////////////////////////////////////
//metodo para traer las meta
function cargarMeta(idp) {

    $('#bodyMeta').html("");
      var unidaMedida='';
    $.get("/gestionMetaPoa/meta/"+idp, function (resultado) {
       $.each(resultado,function(i,item){
         if(item.unida_medida!=''){
            repetir= clearInterval(repetir);
            repetir= window.clearInterval(repetir);
               repetir=0;
             unidaMedida=item.unida_medida[0].descripcion;
         }else{
             repetir=0;
           efectoo();
         }
         $('#bodyMeta').append(`
              <tr>
                  <td class="bg-success"> ${item.descripcion} </td>
                  <td>${unidaMedida} </td>
                  <td>${item.linea_base} </td>
                  <td>${item.linea_proyectada} </td>
                  <td>
                   <button type="button" id="efe" onmouseover="pararefec()"  onclick="editarMeta('${item.idmeta}')" class="btn btn-block btn-info btn_icon" data-toggle="tooltip" dataplacement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-edit"></i> </button>
                  </td>
              </tr>
           `);
         unidaMedida='';
       });

    });
}

function editarMeta(idmeta) {
    window.clearInterval(repetir);
    $('#divMeta').removeClass('hide');
    $.get("/gestionMetaPoa/meta/"+idmeta+'/edit', function (resultado) {
        $('#btn_metaC_cancelar').removeClass('hidden');
        $('#idmeta').val(resultado.idmeta_encrypt);
        $('#divMeta').removeClass('hide');
         $('#linea_proyectada').val(resultado.linea_proyectada);
         $('#linea_base').val(resultado.linea_base);
         $('.option_idunidad_medida').prop('selected',false);
         $(`#idunidad_medida option[value="${resultado.idunidad_medida}"]`).prop('selected',true);
         $("#idunidad_medida").trigger("chosen:updated");
    });
}
//evento actualizar
$("#frm_meta").on("submit", function(e){

    e.preventDefault();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    var FrmData = {
        idunidad_medida: $('#idunidad_medida').val(),
        linea_base: $('#linea_base').val(),
        linea_proyectada: $('#linea_proyectada').val(),
    };
    $.ajax({
        url:'/gestionMetaPoa/meta/'+$('#idmeta').val(), // Url que se envia para la solicitud
        method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
        data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
        dataType: 'json',
        success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
        {
            console.log(requestData);
            $('#msmMetC').html(`
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                    <div class="col-md-12 col-sm-6 col-xs-12">
                        <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <strong>Información: </strong> ${requestData.mensaje}
                        </div>
                    </div>
                `);
            limpiarCamposMeta();
            cargarMeta($('#idproyectopoa').val());
        }, error:function (requestData) {
            console.log(requestData);
        }
        });

});
$('#btn_metaC_cancelar').click(function (event) {
limpiarCamposMeta();
});
//limpiar camor del form completar meta
function limpiarCamposMeta() {
      $('#btn_metaC_cancelar').addClass('hidden');
      $('#idmeta').val("");
      $('#divMeta').addClass('hide');                                                                                                                                                                                  //
      $('#linea_proyectada').val("");
      $('#linea_base').val("");
      $('.option_idunidad_medida').prop('selected',false);
      $("#idunidad_medida").trigger("chosen:updated");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//alerta de confirmacion del modulo de aprobacion POA
function confirmar(idp,url,estado,estado_info) {
  var opcion = confirm("¿Estas seguro que deseas ejecutar esta acción? ");
    if (opcion) {
       vistacargando('M','Por favor espere..');
       if(url=='bandejaAprobacion' && estado=='P'){
          $.get("/gestionProyectoPoa/validarTecho/"+idp, function (resultado) {
              console.log(resultado);
              if(resultado.estado=='danger'){
                 vistacargando();
                alert("Lo sentimos no es posible aprobar el proyecto, ha superado el techo establecido");
                return;
              }else{
                compleUpdate(idp,url,estado,estado_info);
                return;
              }
          });
       }else{
          compleUpdate(idp,url,estado,estado_info);
       }
    }else{
      return false;
    }
}
//funcion para completar el estado despues de validar el techo del proyecto
function compleUpdate(idp,url,estado,estado_info) {
  $.get("/gestionProyectoPoa/updateProyecto/"+idp+'/'+estado+'/'+estado_info, function (resultado) {
    console.log(resultado);
       if(resultado=='success'){
            window.location="/gestionProyectoPoa/"+url;
            return;
       }
       if(resultado=="info"){
         alert('Lo sentimos este proyecto ya fue eliminado..');
         window.location="/gestionProyectoPoa/"+url;
         return;
       }
       return;
  }).fail(function(error){
          alert("Error al ejecutar la petición");
          vistacargando();
  });
}

//modal de estado financiero
function modalFinancciero(idp) {
  $('#showPartidasEstado').html('');
  vistacargando('M','Cargando..');
   $.get("/gestionPlanContratacionPoa/getEstadoFinanciero/"+idp, function (data) {

      $.each(data,function(i,item){
        let  estaf='';
        var cont=0;
        var fila='';
          $.each(item.presupuesto, function (a, estF) {
            if(estF.estado_financiero!=null){
               estaf=estaf+`<tr>
                              <td><b>${estF.estado_financiero['partida']}</b><br> ${estF.estado_financiero['descripcion_partida']}</td>
                              <td> <i class="fa fa-usd"></i> ${estF.estado_financiero['monto_asignacion_inicial']}</td>
                              <td> <i class="fa fa-usd"></i> ${estF.estado_financiero['total_codificado']}</td>
                              <td> <i class="fa fa-usd"></i> ${estF.estado_financiero['total_comprometido']}</td>
                              <td> <i class="fa fa-usd"></i> ${estF.estado_financiero['total_devengado']}</td>
                            </tr>
                            `;
                cont++;

            }
          });
          console.log(estaf);
           fila=`<tr>
                    <td >${item.actividad}</td>
                    <td>
                      <table class="table" style="font-size:80%;">
                        <tr>
                          <th>Descripción partida</th>
                          <th>Monto asignado inicial</th>
                          <th>Total  codificado</th>
                          <th>Total  comprometido</th>
                          <th>Total  devengado</th>
                        </tr>
                           ${estaf}
                      </table>
                    </td>
                </tr>`;
                  console.log(fila);
           $('#showPartidasEstado').append(fila);
           fila=' '; estaf='';
      });
      $('#modalFinanciero').modal('show');
      vistacargando();
   }).fail(function(error){
         vistacargando();
         alert("Error al ejecutar la petición");
   });
}

var repetir;
animacion = function(){
 efecto=  document.getElementById('efe').classList.toggle('fade');
}
function efectoo() {
  //  repetir= window.setInterval(animacion,800);
  // repetir= setInterval(animacion, 900);
}
function pararefec() {
    $('#efe').removeClass('fade');
    clearInterval(repetir);
}

function competanciachange(valor,pdn=null,id=null){
  $('#selec_pdot').hide(200);
  $('#idpoa_obj_pdot').html(``);
  $('#pdn_input').hide(200);
  //buscar los pdot de la competencia
  if(id==null){
    vistacargando('m','Cargando objetivos PDOT');
  }else{
    vistacargando('m','Por favor espere...');
  }
  $.get("/gestionProyectoPoa/pdotcompetencia/"+valor, function (data) {
    console
    if(data['error']==true){
      alertNotificar(data['detalle'],'error');
      vistacargando();
      return;
    }
    $('#idpoa_obj_pdot').html(`<option class="option_pdot"  value='0'></option>`);
    $.each(data['detalle'],function(i,item){
      var selected='';
      if(item['idpoa_obj_pdot']==id){
        selected='selected';
      }
      $('#idpoa_obj_pdot').append(`<option ${selected} class="option_pdot"  value="${item.idpoa_obj_pdot}">${item.descripcion}</option>`);
    });
    $("#idpoa_obj_pdot").trigger("chosen:updated");
    if(id!=null && pdn !=null){
      $('#input_pdn').val(pdn);
      $('#pdn_input').show(200);
    }

    $('#selec_pdot').show(200);
    vistacargando();
  }).fail(function(error){
    vistacargando();
    alertNotificar('Ocurrió un error intente nuevamente','error');
  });
}

function pdotchange(valor,dato=null){
  //buscar los pdot de la competencia
  vistacargando('m','Por favor espere...');
  $.get("/gestionProyectoPoa/pdn_pdt/"+valor, function (data) {
    if(data['error']==true){
      alertNotificar(data['detalle'],'error');
      vistacargando();
      return;
    }
    $('#input_pdn').val(data['detalle']['objetivo_p_d_n']['descripcion']);
    $('#pdn_input').show(200);
    vistacargando();
  }).fail(function(error){
    vistacargando();
    alertNotificar('Ocurrió un error intente nuevamente','error');
  });
}

function informacion(texto){
 
  swal({ title: "",
  text: texto,
  type: "info",
  closeOnConfirm: true,
  closeOnCancel: false});
}

