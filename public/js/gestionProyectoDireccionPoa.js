//estados de aprobacion  AD(APROBADO),RD(REPROBADO),PD(PENDIENTE) CD(CORREGIR)
//evento de acccion de aprobar
$('.radio_aprobar').on('ifChecked', function(event){
  confirmarUpdate($(this).val(),'bandejaAprobacionDireccion','A','AD','');
});
//evento de accion de eliminar
$('.radio_eliminar').on('ifChecked', function(event){
	confirmarUpdate($(this).val(),'bandejaAprobacionDireccion','R','RD','');
});
//evento de accion de revisar
$('.radio_revision').on('ifChecked', function(event){
  $('#modalObservacion').modal('show');
  $('#idmodal').val( $(this).val());
});
//eventos de los btn de la modal observacion
$('#btnObC').click(function (e) {
  vistacargando('M','Cancelando');
  window.location="/gestionProyectoPoa/bandejaAprobacionDireccion";
});
$('#btnObG').click(function (e) {
  // console.log($('#txtobservacion').val());
  confirmarUpdate($('#idmodal').val(),'bandejaAprobacionDireccion','C','CD',$('#txtobservacion').val());
});
//evento aprobar todos
 $('.check_todos').on('ifChecked', function(event){
    allConfirmarUpdate($(this).val(),'bandejaAprobacionDireccion');
 });

function periodotechos(idperiodo){
	  vistacargando('M','Cargando....');
    $('#departamentos_techo_body').html('');
    // $("#tabla_techos").DataTable().destroy();
    // $('#departamentos_techo_body tbody').empty();
    $('#panel_techos').hide(200);
    $.get("/gestionProyectoPoa/lista_techoperiodo/"+idperiodo, function (resultado) {
      if(resultado['error']==true){
        alertNotificar(resultado['detalle'],'error');
        vistacargando();
        return;
      }
      $('#total').html(`<i class="fa fa-usd"></i> ${resultado['montoPresupuestario']}`);
      $.each(resultado['listaProyecto'],function(i,item){
        $('#departamentos_techo_body').append(` <tr >
            <th scope="row">${i+1}</th>
            <td class=" "  width="50%">
                <b >${item['area']}</b>
            </td>
            <td class="trinput">
                <input  type="number"  step="0.000001" class="form-control" min="0"  value="${item['techoArea']}" onclick="obtenerV(this)"/>
            </td>
            <td width="30px">
                <button class="btn btn-sm btn-primary btn-block" onclick ="updateTechosFinanciero('${item['iddepencryp']}',this,${item['idperiodo']})"> <i class="fa fa-save"></i> </button>
            </td>
        </tr>`);
      });
    $('#panel_techos').show(200);
     
      vistacargando();
    }).fail(function(){
      alertNotificar('Ocurrió un error intente nuevamente','error');
      vistacargando();
      return;
    });
}

function periodotechosdireccion(idperiodo){
  vistacargando('M','Cargando....');
  $('#areas_direccion').html('');
  // $("#tabla_techos").DataTable().destroy();
  // $('#departamentos_techo_body tbody').empty();
  $('#total_direccion').html('');
  $('#panel_techos').hide(200);
  $.get("/gestionProyectoPoa/lista_techoperiodo_direccion/"+idperiodo, function (resultado) {
    if(resultado['error']==true){
      alertNotificar(resultado['detalle'],'error');
      vistacargando();
      return;
    }
    $('#total_direccion').html(`<i class="fa fa-usd"></i> ${resultado['montoPresupuestario']}`);
    $.each(resultado['listaProyecto'],function(i,item){
      $('#areas_direccion').append(` <tr >
          <th scope="row">${i+1}</th>
          <td class=" "  width="50%">
              <b >${item['area']}</b>
          </td>
          <td class="trinput">
              <input  type="number"  step="0.000001" class="form-control" min="0"  value="${item['techoArea']}" onclick="obtenerV(this)"/>
          </td>
          <td width="30px">
              <button class="btn btn-sm btn-primary btn-block" onclick ="updateTechos('${item['iddepencryp']}',this,${item['idperiodo']})"> <i class="fa fa-save"></i> </button>
          </td>
      </tr>`);
    });
  $('#panel_techos').show(200);
   
    vistacargando();
  }).fail(function(){
    alertNotificar('Ocurrió un error intente nuevamente','error');
    vistacargando();
    return;
  });
}
//alerta de confirmacion del modulo de aprobacion POA
function confirmarUpdate(idp,url,estado,estado_info,obs) {

  var opcion = confirm("¿Estas seguro que deseas ejecutar esta acción? ");
    if (opcion) {
    	vistacargando('M','Actualizando');
        $.get("/gestionProyectoPoa/updateProyecto/"+idp+'/'+estado+'/'+estado_info+'/'+obs, function (resultado) {
            console.log(resultado);
             if(resultado=='success'){
                window.location="/gestionProyectoPoa/"+url;
             }else if(resultado=='info'){
                alert('Lo sentimos este proyecto ya fue eliminado');
                window.location="/gestionProyectoPoa/"+url;
                vistacargando();
             } else{
                alert("Error al ejecutar la petición");
                vistacargando();
             }
        }).fail(function(error){
                alert("Error al ejecutar la petición");
                vistacargando();
        });

    }else{
    	vistacargando('M','Cancelando');
    	 window.location="/gestionProyectoPoa/"+url;
    }
}
//
//aprobar todos direccion
function allConfirmarUpdate(idp,url) {
	var opcion = confirm("¿Estas seguro que deseas ejecutar esta acción? ");
	  if (opcion) {
	  	vistacargando('M','Actualizando');
	      $.get("/gestionProyectoPoa/allUpdateProyectoDireccion/"+idp, function (resultado) {
	          // console.log(resultado);
	           if(resultado=='success'){
	                window.location="/gestionProyectoPoa/"+url;
	           }
	      }).fail(function(error){
	              alert("Error al ejecutar la petición");
	              vistacargando();
	      });
	  }else{
	  	vistacargando('M','Cancelando');
	  	window.location="/gestionProyectoPoa/"+url;
	  }
}

//funcion para actualizar los techos
function updateTechos(iddepa,ste,idperiodo) {
     var inp= $(ste).parent().siblings('.trinput').find('input').val().replace(/[^0-9.]/g,'');
       if(inp!=''  && inp!="e"){
          var opcion = confirm("¿Estas seguro que deseas ejecutar esta acción? ");
          if(opcion){
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var FrmData = {
                iddepartamento: iddepa,
                techoArea:inp,
                idperiodo:idperiodo
            };
            $.ajax({
                url:'/gestionProyectoPoa/putTecho',
                method: 'POST',
                data: FrmData,
                dataType: 'json',
                success: function(requestData)
                {
                   inp= $(ste).parent().siblings('.trinput').find('input').val(requestData.valor);
                  if(requestData.estado=="error"){
                      inp= $(ste).parent().siblings('.trinput').find('input').val(requestData.valor);
                  }
                  alerMen(requestData);

                }, error:function (requestData) {
                   alerMen(requestData);
                    // $(ste).val(numT);
                    // numT='';
                }
            });
          }else{
            inp= $(ste).parent().siblings('.trinput').find('input').val(numT);
          }
      }else{
         inp= $(ste).parent().siblings('.trinput').find('input').val(numT);
        numT='';
      }
}
//funcion para actualizar techos asiganados por financiero
// $('#valor_Pasivo').on('input', function() {
//      this.value = this.value.replace(/[^0-9.]/g,'');
// });
function updateTechosFinanciero(iddepa,ste,idperiodo) {
    var inp= $(ste).parent().siblings('.trinput').find('input').val().replace(/[^0-9.]/g,'');
      if(inp!=''  && inp!="e"){
          var opcion = confirm("¿Estas seguro que deseas ejecutar esta acción? ");
          if(opcion){
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var FrmData = {
                iddepartamento: iddepa,
                techoArea:inp,
                idperiodo:idperiodo
            };
        $.ajax({
            url:'/gestionProyectoPoa/putTechoFinanciero',
            method: 'POST',
            data: FrmData,
            dataType: 'json',
            success: function(requestData)
              {
                  inp= $(ste).parent().siblings('.trinput').find('input').val(requestData.valor);
                  // $('#total').html(`<i class="fa fa-usd"></i>  ${ new Intl.NumberFormat(["ban", "id"]).format(requestData.total)} `);
                  $('#total').html(`<i class="fa fa-usd"></i> ${requestData.total} `);

                  if(requestData.estado=="error"){
                      inp= $(ste).parent().siblings('.trinput').find('input').val(requestData.valor);
                  }
                  alerMen(requestData);
                }, error:function (requestData) {
                   alerMen(requestData);
              }
            });
          }else{
            inp= $(ste).parent().siblings('.trinput').find('input').val(numT);
          }
      }else{
        inp= $(ste).parent().siblings('.trinput').find('input').val(numT);
        numT='';
      }
}
function alerMen(requestData) {
   new PNotify({
        title: 'Mensaje de Información',
        text: `${requestData.msm}`,
        type: `${requestData.estado}`,
        hide: true,
        delay: 2000,
        styling: 'bootstrap3',
        addclass: ''
    });
}
//obtener valor antes de cambiar
var numT='';
function obtenerV(este) {
  numT=$(este).val();
}