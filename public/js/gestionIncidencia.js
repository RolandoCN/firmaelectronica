//limpiar al cancelar
$('#btnReset').click(function() {
  limpiarForm();
});

//evento para obtener los deribados y departamentos
$('.radio_evento').on('ifChecked', function(event){
  $(this).val();
  $.get("/gestionInsidencia/obtenerEventoDI/"+$(this).val(), function (data) {

    //instituciones
    $('.check_inst').iCheck('uncheck');
    $('.check_inst').iCheck('enable');
    $('.check_instSelect').removeClass('bg-success');

    $.each(data.resultado.evento_institucion, function(i, item) {
        $('#check_inst'+item.idinstitucion).iCheck('check');
        $('#check_inst'+item.idinstitucion).iCheck('disable');
        $('#check_instSelect'+item.idinstitucion).addClass('bg-success');

    });

    //departamento///
    $('.check_depa').iCheck('uncheck');
    $('.check_depa').iCheck('enable');
    $('.check_depaSelect').removeClass('bg-success');
  	$.each(data.resultado.evento_departamento, function(i, item) {
    		$('#check_depa'+item.iddepartamento).iCheck('check');
        $('#check_depa'+item.iddepartamento).iCheck('disable');
        $('#check_depaSelect'+item.iddepartamento).addClass('bg-success');
  	});

  });
});


//funcion para checkear la camara
var cam=0;
function check_camara($id){
	$('.cam'+cam).html('<i class="fa fa-circle-o"></i>');
	$('.cam'+$id).html('<i class="fa fa-check-circle"></i>');
	cam=$id;
	$('#idcamara').val(cam);
}


//Gestion Guardar incidencias
$("#formularioIncidencia").on("submit", function(e){
    e.preventDefault();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    var arr_sele_inst =[];
    var arr_sele_depa =[];
    $('.inst_seleccionado').each(function(i, seleccionado){
      arr_sele_inst[i]=$(seleccionado).val()
    });
    $('.depa_seleccionado').each(function(i, seleccionado){
      arr_sele_depa[i]=$(seleccionado).val()
    });

    var FrmData = {
        idcamara: $('#idcamara').val(),
        idevento: $('.evento_seleccionada').val(),
        idclave: $('.clave_seleccionada').val(),
        direccion: $('#direccion').val(),
        referencia: $('#referencia').val(),
        instituciones:arr_sele_inst,
        departamento:arr_sele_depa,
    }
    $.ajax({
        url:'/gestionInsidencia/incidencia', // Url que se envia para la solicitud
        method: 'POST',             // Tipo de solicitud que se enviará, llamado como método
        data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
        dataType: 'json',
        success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
        {
        	limpiarForm();
          $('#mensajeVentanaIncidencia').html(`
                  	<div id="mensaje_alert"  class="alert alert-info alert-dismissible alert_sm" role="alert">
                        <strong>MENSAJE!</strong> <span id="mensaje_info">Registro insertado con exito</span>
                    </div>
          `);
            window.setInterval("$('#mensajeVentanaIncidencia').html('')",9000);
             vistacargando();
        },
        beforeSend: function() {
          vistacargando('M','Espere por favor enviando incidencia');
        },
        error:function () {
          alert("Error al ejecutar la petición");
            vistacargando();
        }
    });
});


//eventos de chekear
  //chekear y deschekera clave
    $('.radio_clave').on('ifChecked', function(event){
       $(this).addClass('clave_seleccionada');
       console.log('check');
    });
     $('.radio_clave').on('ifUnchecked', function(event){
       $(this).removeClass('clave_seleccionada');
        console.log('uncheck');
    });
  //chekear y deschekera evento
    $('.radio_evento').on('ifChecked', function(event){
       $(this).addClass('evento_seleccionada');
       console.log('check');
    });
     $('.radio_evento').on('ifUnchecked', function(event){
       $(this).removeClass('evento_seleccionada');
        console.log('uncheck');
    });
  //deschekear y checke instituciones
    $('.check_inst').on('ifChecked', function(event){
      $(this).addClass('inst_seleccionado');
    });

    $('.check_inst').on('ifUnchecked', function(event){
      $(this).removeClass('inst_seleccionado');
    });
  //deschekear y check departamentos
    $('.check_depa').on('ifChecked', function(event){
      $(this).addClass('depa_seleccionado');
    });

    $('.check_depa').on('ifUnchecked', function(event){
      $(this).removeClass('depa_seleccionado');
    });
//eventos de chekear end//


//limpiar formulario
function limpiarForm(){
	$('.cam'+cam).html('<i class="fa fa-circle-o"></i>');
	$('#idcamara').val("");
  $('#referencia').val("");
  $('#direccion').val("");
	$('#instuDepa').html("");
	$('.radio_clave').iCheck('uncheck');
	$('.radio_evento').iCheck('uncheck');
  $('.check_inst').iCheck('uncheck');
  $('.check_depa').iCheck('uncheck');
  $('.check_inst').iCheck('enable');
  $('.check_depa').iCheck('enable');
  $('.check_instSelect').removeClass('bg-success');
  $('.check_depaSelect').removeClass('bg-success');
}
