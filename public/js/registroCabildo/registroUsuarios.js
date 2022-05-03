  var cedulaAux='';
$( "#cedula" ).blur(function() {
    if($('#cedula').val()==''){return;}
    if($('#cedula').val()==cedulaAux){return;}
    $('#infoRegistro').html('');
    $('#btnRegistrar').prop('disabled',true);
	
	$('#nombres').val('Cargando...');
        $.get('/registroUsuario/dinardap/'+$('#cedula').val(), function(data){
            if(data['message']=='Server Error'){
                $('#nombres').val('');
                alertNotificar('Ocurrió un error intente nuevamente', "error");
                cedulaAux='';
                return;
            }
            if(data['error']==true){
                $('#nombres').val('');
                alertNotificar(data['detalle'], "error");
                cedulaAux='';
                return;
            }
            if(data['error']==false){
                if(data['tipo']=='Juridica'){
                    $('#divSexo').hide(200);
                    $('#tipPersona').val('J');
                }else{
                    $('#divSexo').show(200);
                    $('#tipPersona').val('N');
                }
                $('#nombres').val(data['detalle']);
                cedulaAux=$('#cedula').val();
                $('#btnRegistrar').prop('disabled',false);
            }
        });
});

  function limpiar(){
    $('#cedula').val('');
    $('#nombres').val('');
    $('#direccion').val('');
    $('#telefono').val('');
    $('#email').val('');
    // $('#infoRegistro').html('');
  }

  $('#frm_registroUser').submit(function(e){
        e.preventDefault();
        $('#infoRegistro').html('');
        if($('#tipPersona').val()=='N'){
        	if($('#sexo').val()==0){
	            alertNotificar('Seleccione el sexo del contribuyente', "error");
	            return;
	        }
        }

        $('#btnRegistrar').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Registrando Usuario`); 
        $('#btnRegistrar').prop('disabled',true); 
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: '/registroUsuario/cabildo',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            success: function(data){
                if(data['error']==true && data['email']==true){
                    $('#btnRegistrar').prop('disabled',false); 
                    $('#btnRegistrar').html(`<span class="fa fa-save"></span> <b>Registrar Usuario</b>`); 
                    alertNotificar('El correo electrónico ya se encuentra registrado.', "error");
                    $('#infoRegistro').html('');
                    $('#infoRegistro').html(`<div align="left"  class="alert alert-warning  alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <div align="center"><b style="color:red">NO SE PUDO REALIZAR EL REGISTRO</b></div>
                            <b style="align:center"> Correo electrónico ya se encuentra registrado con el siguiente Usuario:</b><br>
                            <b>Cédula:</b> ${data['detalle']['cedula']}<br>
                            <b>Razón Social:</b> ${data['detalle']['name']}<br>
                            <b>Celular:</b> ${data['detalle']['celular']}<br>
                          </div>`);
                    $('#infoRegistro').show(200);
                    return;
                }
            
                if(data['error']==true ){
                    $('#btnRegistrar').prop('disabled',false); 
                    $('#btnRegistrar').html(`<span class="fa fa-save"></span> <b>Registrar Usuario</b>`); 
                    alertNotificar(data['detalle'], "error");
                    return;
                }
               
                if(data['error']==false){
                    alertNotificar(data['detalle'], "success");
                    $('#infoRegistro').html('');
                    $('#infoRegistro').html(`<div align="center"  class="alert alert-success  alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <b> ${data['detalle']}</b><br>
                            <strong>CIU:</strong> ${data['Ciu']}
                          </div>`);
                    $('#infoRegistro').show(200);
                    $('#btnRegistrar').prop('disabled',false); 
                    $('#btnRegistrar').html(`<span class="fa fa-save"></span> <b>Registrar Usuario</b>`); 
                    limpiar();
                    return;
                }

        },
        error: function(e){
            $('#btnRegistrar').prop('disabled',false); 
            $('#btnRegistrar').html(`<span class="fa fa-save"></span> <b>Registrar Usuario</b>`); 
            alertNotificar(data['detalle'], "error");
            return;
        }
    });
  });

  $('#cedula').on('input', function() {
    this.value = this.value.replace(/[^0-9]/g,'');
  });
