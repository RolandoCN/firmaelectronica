
    var tamMax = 2; // maximo 2 megas el peso de los documentos
    var estado_deuda='';
       function seleccionarTipoProceso(idtipoProceso, descripcion,deuda){
        $("#content_tramites").hide();
        $("#content_realizar_tramite").show(200);
        $('#titulo_tramite').html(' - '+descripcion);
         estado_deuda =deuda;
        $("#tipo_poroceso_desc").val(descripcion);
        $("#cmb_tramite").val(idtipoProceso);

        $("#mensajeInfo").html("");

        if(idtipoProceso == ""){ console.warn("No buscar"); return; }

        $("#infoDocumento").hide();
        mensajeCarga("listaRequisitos","Buscando requisitos..."); //esperando respuesta del servidor

        $.get('/gestionIniciarTramite/getRequisitos/'+idtipoProceso, function(retorno){
           // console.log(retorno);

            $("#infoDocumento").show();
            $("#listaRequisitos").html("");

            tamMax = retorno.limiteMega; // limite de magas para los documentos adjuntos

            retorno.listaRequisitos.forEach(requisito => {

                $("#infoDocumento").hide(); //quitamos el icono solo si cargamos requisitos
                var idRequisito = requisito.idrequisitoTipoProceso;
                var label = "(Opcional)";
                var visualizarReqisito = "";
                if(requisito.obligatorio==1){ label="(Obligatorio)"; }
                if(requisito.formato == "" || requisito.formato==null){ visualizarReqisito = "display:none;"}

                var texto_max_archivo = "archivos";
                var multiple_file = "multiple";
                if(requisito.maximo_archivos==1){ texto_max_archivo = "archivo"; multiple_file=""; }

                $("#listaRequisitos").append(`
                    <div class="form-group" style="margin-bottom: 0;">

                        <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>

                        <label class="control-label col-md-10 col-sm-10 col-xs-9" style="margin-bottom: 2px; font-size: 12px; text-align: left;">${requisito.descripcion} (.${requisito.extension})</label>
                        <label class="control-label col-md-2 col-sm-2 col-xs-3" for="detalle">${label}</label>

                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <div class="input-prepend input-group">
                                <label  title="Agregar un documento" class=" control-label btn btn-primary btn-upload add-on input-group-addon" for="requisito_${idRequisito}">

                                    <input id="requisito_${idRequisito}" name="file_documento_adjunto_${requisito.idrequisitoTipoProceso}[]" class="requisito_adjuntar sr-only file_requisito_tramite" type="file" accept="" ${multiple_file}>
                                    <input type="hidden" class="maximo_archivos" value="${requisito.maximo_archivos}">
                                    <input type="hidden" class="descripcion" value="${requisito.descripcion}">
                                    <input type="hidden" class="idrequisitoProceso" value="${requisito.idrequisitoTipoProceso_encrypt}">
                                    <input type="hidden" class="idrequisitoProceso_val" name="idrequisitoProcesoAdjunto[]" value="">
                                    <input type="hidden" class="formato_requisito" value="${requisito.extension}">

                                    <span title="" class="docs-tooltip" data-toggle="tooltip" data-original-title="Agregar un documento"></span>
                                    <span class="fa fa-upload"></span>
                                </label>
                                <input id="file_requisito_${idRequisito}" style="pointer-events: none;" name="" class="form-control" type="text" value="Puede seleccionar un máximo de ${requisito.maximo_archivos} ${texto_max_archivo}">
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-2 col-xs-12" style="margin-bottom: 2px;">
                            <a style="${visualizarReqisito}" href="/gestionRequisitoTipoProceso/verRequisitoTipoProceso/${requisito.formato}" target="_blak" class="btn btn-sm btn-info"><i class="fa fa-info-circle"></i> Formato</a>
                        </div>
                    </div>
                `);

            });

        }).fail(function(){
            $("#infoDocumento").show();
            $("#listaRequisitos").html("");
        });

    }

    $("#form_enviar_tramite").submit(function(e){

        $("#mensajeInfo").html("");
        $("#mensajeInfo2").html("");

        e.preventDefault();
        if($('#correo').val()!='' && $('#correo').val()!=$('#correoverficar').val()){
            cargarMensaje("#mensajeInfo",'danger', 'Los correos electrónicos no coinciden', true);
            return;
        }
        var FrmData = new FormData(this);

        // agregamos la animacion del boton
        $("#enviar_tramite").html('<span class="spinner-border" role="status" aria-hidden="true"></span> Enviando...');
        $("#content_frmbotones").addClass("disabled_content");
        $(this).addClass("disabled_content");

        $.ajaxSetup({
			headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
        });

	    $.ajax({
			url: '/gestionIniciarTramite/registrarTramite',
			method: "POST",
            data: FrmData,
            type: "json",
            contentType:false,
            cache:false,
            processData:false,
			complete: function (request)
			{
                var resultado = request.responseJSON;
               // console.log(resultado);

                if(resultado.error){
                    cargarMensaje("#mensajeInfo",resultado.color, resultado.info, true);
                }


                if(resultado.error==false){ // si no hay error
                    cargarMensaje("#mensajeInfo2",resultado.color, resultado.info, true);

                    $('#DetalleTramite').modal("show");

                    limpiarVentanaModal();

                    $('#cedulaproModal').html(resultado.cedula);
                    $('#nombreModal').html(resultado.nombre);
                    $('#cedulaSolicitanteModal').html(resultado.cedulaSolicitante);
                    $('#nombreSolcitanteModal').html(resultado.nombreSolicitante);
                    $('#asuntoModal').html(resultado.asunto);
                    $('#codigoModal').html(resultado.codigoRastreo);
                    $('#fechaModal').html(resultado.fecha);
                    $('#areaModal').html(resultado.proceso);
                    $('#celularModal').html(resultado.celular);
                    $('#correoModal').html(resultado.correo);


                    $('#codigotxt').val(resultado.codigoRastreo);
                    $('#cedulatxt').val(resultado.cedula);
                    $('#fechatxt').val(resultado.fecha);

                    $("#btn").attr("href", '/gestionIniciarTramite/imprimir/'+resultado['codigoRastreo']+'/'+resultado.cedula);

                    $('a[href]#btn').each(function () {
                        var href = this.href;

                        $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
                            if (href.toLowerCase().indexOf("#") >= 0) {

                            } else {
                                // window.open(href);

                                $(location).attr('href','/gestionIniciarTramite/imprimir/'+resultado['codigoRastreo']+'/'+resultado.cedula);
                            }
                        });
                    });


                    // setTimeout(function() {
                    // vistacargando("M", "Espere...");
                    // },  3000);
                    // vistacargando();

                }else{
                    $("#enviar_tramite").html(' <i class="fa fa-location-arrow" style="margin-right: 5px;"></i> <b>Enviar Trámite</b>');
                    $("#form_enviar_tramite").removeClass("disabled_content");
                    $("#content_frmbotones").removeClass("disabled_content");
                }

			},error: function(){
                cargarMensaje("#mensajeInfo","danger", "Se produjo un error al iniciar el tramite", true);
                $("#enviar_tramite").html(' <i class="fa fa-location-arrow" style="margin-right: 5px;"></i> <b>Enviar Trámite</b>');
                $("#form_enviar_tramite").removeClass("disabled_content");
                $("#content_frmbotones").removeClass("disabled_content");
            }
	    });

    });


    function limpiarVentanaModal(){
        estado_deuda="";
        $('.crtDni').removeClass('bad');
        $('#enviar_tramite').removeClass('hide');
        $('#cedula_propietario').val('');
        $('#nombre_propietario').val('');
        $('#cedula_solicitante').val('');
        $('#nombre_solicitante').val('');
        $('#correo').val('');
        $('#correoverficar').val('');
        $('#divVerificarCorreo').hide();
        $('#correoverficar').attr("required", false);

        $('#celular').val('');


        $("#cmb_tramite").val("");

        $("#content_realizar_tramite").hide();
        $("#content_tramites").show(200);

        $("#tipo_poroceso_desc").val("");
        $("#cmb_tramite").val("");

        $("#tramite_asunto").val("");
        $("#tramite_obs").val("");

        $("#lista_documentos_adjuntos").html("");
        $("#cont_lista_documentos_adjuntos").hide(200);


        $("#enviar_tramite").html(' <i class="fa fa-location-arrow" style="margin-right: 5px;"></i> <b>Enviar Trámite</b>');
        $("#form_enviar_tramite").removeClass("disabled_content");
        $("#content_frmbotones").removeClass("disabled_content");

        $("#infoDocumento").show();
        $("#listaRequisitos").html("");
    }



    var contenido_boton = "";

    $("#listaRequisitos").delegate(".requisito_adjuntar", "click", function(e){

        contenido_boton = $(this).parent().parent().html();
        maximo_archivos=$(this).siblings('.maximo_archivos').val(); // nomnbre del requisito

        var texto_max_archivo = "archivos";
        if(maximo_archivos==1){ texto_max_archivo = "archivo"; }

        $(this).parent().siblings('input').val(`Puede seleccionar un máximo de ${maximo_archivos} ${texto_max_archivo}`); // agregamos le nombre del requisito
        var content = $(this).parent().parent();
        $(content).children().children('.idrequisitoProceso_val').val(null); //quitamos le id del requisito

        this.value = null;
    });



    $("#listaRequisitos").delegate(".requisito_adjuntar", "change", function(e){

        archivo="";
        num_seleccionados = this.files.length;
        if(num_seleccionados>0){ // si se selecciona un archivo

            //validamos que ingrese solo el numero de archivos permitidos
                maximo_archivos=$(this).siblings('.maximo_archivos').val(); // nomero máximo archivos
                descripcion_requisito=$(this).siblings('.descripcion').val(); // nombre del requisito
                var texto_max_archivo = "archivos";
                if(maximo_archivos==1){ texto_max_archivo = "archivo"; }
                if(num_seleccionados>maximo_archivos){
                    this.value = null;
                    cargarMensaje("#mensajeInfoDoc","danger",`Solo puede seleccionar un máximo de ${maximo_archivos} ${texto_max_archivo} del requisito ${descripcion_requisito}`, false);
                    return;
                }
            //--------------------------------------------------------------------

            if(num_seleccionados>1){
                $(this).parent().siblings('input').val(num_seleccionados+" archivos seleccionados");
            }else{
                $(this).parent().siblings('input').val(num_seleccionados+" archivo seleccionado");
            }
            $(this).siblings('.idrequisitoProceso_val').val($(this).siblings('.idrequisitoProceso').val());

        }else{
            return;
        }

        var elemento = this;

        $.each(this.files, function(i, file){
            archivo = file.name;
            var tipoDocSalec = archivo.split('.').pop(); // obtenemos la extención del documento
            var extension = $(elemento).siblings('.formato_requisito').val();
            if(tipoDocSalec != extension){
                cargarMensaje("#mensajeInfoDoc","danger","El requisito debe estar en formato "+extension, false);
                var content = $(elemento).parent().parent();
                $(content).html(contenido_boton);
                $(content).children().children('.idrequisitoProceso_val').val(null);
                return;
            }

            // validamos el tamaño del documento seleccionado
            var tamArchivo = $(elemento)[0].files[0].size; // obtenemos el tamaño del archivo
            var tamArchivo = ((tamArchivo/1024)/1024);
            if(tamArchivo>tamMax){
                cargarMensaje("#mensajeInfoDoc","danger",`Solo se permite adjuntar documentos con un tamaño de ${tamMax}MB`,false);
                var content = $(elemento).parent().parent();
                $(content).html(contenido_boton);
                $(content).children().children('.idrequisitoProceso_val').val(null);
                return;
            }
        });

    });



    function cargarMensaje(contenedor, color, mensaje, subir){
        if(subir){
            $('html,body').animate({scrollTop:$(".nav_menu").offset().top},400);
        }
        $(contenedor).html(`
            <div class="alert alert-${color} alert-dismissible" role="alert" style="font-size:15px" padding: 20px 20px; margin-bottom: 20px;">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="top: 0 !important; right: 0 !important;"><span aria-hidden="true">&times;</span></button>
                <strong>¡Información!</strong> ${mensaje}
            </div>
        `);
        $(contenedor).show(200);
        if(!subir){
            setTimeout(() => {
                $(contenedor).hide(200);
            }, 6000);
        }


    }



    // la funcion recive el id del div donde se quier cargar el mensaje
    function mensajeCarga(contenedor,mensaje){
        $(`#${contenedor}`).hide();
        $(`#${contenedor}`).html(`

                <div class="row">
                    <blockquote class="blockquote text-center" style="border: 0; margin-bottom: 10px;">
                        <div class="d-flex justify-content-center">
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <p class="text-center">
                            <strong>
                            ${mensaje}
                            </strong>
                        </p>
                    </blockquote>
                </div>

        `);
        $(`#${contenedor}`).show(200);
    }
//FUNCION PARA VALIDAR SI EL CIUDADANO MANTIENE DEUDAS
function validarDeuda() {

    var cedula=$('#cedula_propietario').val();
    tramite=atob(estado_deuda);
    if(tramite=='1'){
        if(cedula!="" && cedula.length>9){
            $('#sms').html('');
           $.get('/gestionIniciarTramite/deuda/'+cedula+'/'+$('#cmb_tramite').val(), function(data){
               if(data.estado=='danger'){
                   $('.crtDni').addClass('bad');
                   $('#enviar_tramite').addClass('hide');
                   $('#sms').append(`<div style="color: black"  class="alert  alert-dismissible fade in bg-${data.estado}" role="alert">
                                       <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                                       <strong> ¡Atención! </strong>  ${data.msm}.
                                     </div>`);
                   $('#sms').show(200);
                    setTimeout(function() {
                      $('#sms').hide(200);
                    },  6000);
               }else if(data.estado=='success'){
                   $('.crtDni').removeClass('bad');
                   $('#enviar_tramite').removeClass('hide');
               }
           });
        }
    }


}

$( "#cedula_propietario" ).blur(function() {

    var cedula=$('#cedula_propietario').val();
    if(cedula=="" && cedula.length<9){ return; }
    if($('#nombre_propietario').val()=='Servicio no disponible' || $('#nombre_propietario').val()=='' || $('#nombre_propietario').val()=='Cargando...'){
       $('#nombre_propietario').val('Cargando...');
       $.get('/gestionIniciarTramite/getDatosCedula/'+cedula+'/'+$('#cmb_tramite').val(), function(data){
            if(data['error']==true){ //POR API
                $('#cedula_propietario').val('');
                $('#cedula_propietario').focus();
                $('#nombre_propietario').val('');
                $('#sms').html('');
                $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                                    <strong>¡Atención!</strong>El número de identificación del Propietario no fue encontrado.
                                </div>`);
                $('#sms').show(200);
                setTimeout(function() {
                    $('#sms').hide(200);
                },  3000);
                return;
            }
       
        //POR ALGORITMO
            if(data['cedulacorrecta']==false){
            $('#cedula_propietario').val('');
            $('#cedula_propietario').focus();
            $('#nombre_propietario').val('');

                $('#sms').html('');
                $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <strong>¡Atención!</strong>El número de identificación del Propietario está incorrecto.
                        </div>`);
                $('#sms').show(200);
                setTimeout(function() {
                    $('#sms').hide(200);
                },  3000);
            return;
            }
            //POR ALGORITMO
            if(data['cedulacorrecta']==true){
            $('#nombre_propietario').val('Servicio no disponible');
            return;
            }
        //POR ALGORITMO
            if(data['ruccorrecto']==false){

            $('#cedula_propietario').val('');
            $('#cedula_propietario').focus();
            $('#nombre_propietario').val('');

            $('#sms').html('');
                $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <strong>¡Atención!</strong>El número de Cédula o Ruc del Propietario ingresado está incorrecto.
                        </div>`);
                $('#sms').show(200);
                setTimeout(function() {
                $('#sms').hide(200);
                },  3000);
            return;
            }

            if(data['correo']!=''){
                $('#correo').val(data['correo']);
                $('#correoverficar').val(data['correo']);
                $('#divVerificarCorreo').show(200);
                $('#correoverficar').attr("required", true);
            }
            //RESULATADO CORRECTO X ALGORITMO
            if(data['ruccorrecto']==true){

            $('#nombre_propietario').val('Servicio no disponible');

            return;
            }


        //RESULTADO CORRECTO POR API
         if(data['cedula']==true)
            {
                   validarDeuda();
                $('#nombre_propietario').val(data.datos.resultado[9].valor);
            }
         if(data['ruc']==true)
            {
                   validarDeuda();
                $('#nombre_propietario').val(data.datos.resultado[1].valor);
            }
        if(data['vigencia']!=null){
            if(data['vigencia']['user']==false){
                alertNotificar(data['vigencia']['mensaje'],'info');
                $('#sms').html('');
                $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <strong>¡Atención!</strong> ${data['vigencia']['mensaje']}
                          </div>`);
                $('#sms').show(200);
                setTimeout(function() {
                $('#sms').hide(200);
                },  5000);
                $('#cedula_propietario').val('');
                $('#cedula_propietario').focus();
                $('#nombre_propietario').val('');
            }else if(data['vigencia']['vigente']==true){
                alertNotificar(data['vigencia']['mensaje'],'success');
            }else if(data['vigencia']['vigente']==false){
                alertNotificar(data['vigencia']['mensaje'],'error');
                $('#sms').html('');
                $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <strong>¡Atención!</strong> ${data['vigencia']['mensaje']}
                          </div>`);
                $('#sms').show(200);
                setTimeout(function() {
                $('#sms').hide(200);
                },  5000);
                $('#cedula_propietario').val('');
                $('#cedula_propietario').focus();
                $('#nombre_propietario').val('');
            }
        }





      }).fail(function(){

          $('#cedula_propietario').val('');
          $('#cedula_propietario').focus();
          $('#nombre_propietario').val('');

          $('#sms').html('');
            $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong>El número de identificación del Propietario no fue encontrado.
                      </div>`);
            $('#sms').show(200);
            setTimeout(function() {
            $('#sms').hide(200);
            },  3000);
          return;


         });
    }



  });


     $( "#cedula_solicitante" ).blur(function() {

      var cedula=$('#cedula_solicitante').val();
      if(cedula==""){ return; }
       if($('#nombre_solicitante').val()=='Servicio no disponible' || $('#nombre_solicitante').val()=='' || $('#nombre_solicitante').val()=='Cargando...'){
        $('#nombre_solicitante').val('Cargando...');

       $.get('/gestionIniciarTramite/getDatosCedula/'+cedula, function(data){
       // console.log(data);
       //SI HUBO ERROR MEDIANTE API
          if(data['error']==true){

            $('#cedula_solicitante').val('');
         // $('#cedula_solicitante').focus();
          $('#nombre_solicitante').val('');

          $('#sms').html('');
            $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong>El número de identificación del Solicitante no fue encontrado.
                      </div>`);
            $('#sms').show(200);
            setTimeout(function() {
            $('#sms').hide(200);
            },  3000);
          return;

         }
        //RESULTADO POR ALGORITMO
          if(data['cedulacorrecta']==false){

          $('#cedula_solicitante').val('');
        //  $('#cedula_solicitante').focus();
          $('#nombre_solicitante').val('');

          $('#sms').html('');
            $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong>El número de identificación del Solicitante está incorrecto.
                      </div>`);
            $('#sms').show(200);
            setTimeout(function() {
            $('#sms').hide(200);
            },  3000);
          return;
        }

        //RESULTADO POR ALGORITMO
        if(data['cedulacorrecta']==true){

          $('#nombre_solicitante').val('Servicio no disponible');

          return;
        }

          if(data['ruccorrecto']==false){

          $('#cedula_solicitante').val('');
        //  $('#cedula_solicitante').focus();
          $('#nombre_solicitante').val('');

          var nombrepropi=$('#nombre_propietario').val();
         // alert(nombrepropi);
           if(nombrepropi!="")
          {
            $('#cedula_solicitante').focus();
          }

          $('#sms').html('');
            $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong>El número de Cédula o Ruc del Solicitante ingresado está incorrecto.
                      </div>`);
            $('#sms').show(200);
            setTimeout(function() {
            $('#sms').hide(200);
            },  3000);
          return;
        }

        //RESULTADO POR ALGORITMO
        if(data['ruccorrecto']==true){

          $('#nombre_solicitante').val('Servicio no disponible');

          return;
        }



        if(data['cedula']==true)
            {
                  $('#nombre_solicitante').val(data.datos.resultado[9].valor);
            }
        if(data['ruc']==true)
            {

                  $('#nombre_solicitante').val(data.datos.resultado[1].valor);
            }




      }).fail(function(){

          $('#cedula_solicitante').val('');

          $('#nombre_solicitante').val('');


         // alert(nombrepropi);


          $('#sms').html('');
            $('#sms').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong>El número de identificación del solicitante no fue encontrado.
                      </div>`);
            $('#sms').show(200);
            setTimeout(function() {
            $('#sms').hide(200);
            },  3000);
          return;


    });
  }



  });

        $('#cedula_solicitante').keydown(function() {
          $('#nombre_solicitante').val('');
   });

         $('#cedula_propietario').keydown(function() {
          $('#nombre_propietario').val('');
          $('#divVerificarCorreo').hide(200);
          $('#correoverficar').attr("required", false);
          $('#correoverficar').val('');
          $('#correo').val('');
   });



         $('#check_personal').on('ifChecked', function(event){

             $('#check_solicitante').iCheck('uncheck');
             $('#propietario').removeClass('hidden');
             $('#cedula_propietario').val('');
             $('#cedula_propietario').focus();
             $('#cedula_solicitante').val('');
             $('#nombre_propietario').val('');
             $('#nombre_solicitante').val('');
             $("#tramite_asunto").val("");
             $("#tramite_obs").val("");
             $('#correo').val('');
             $('#celular').val('');
             $('#divVerificarCorreo').hide();




        });


         $('#check_personal').on('ifUnchecked', function(event){
            $('#check_personal').iCheck('uncheck');
            $('#check_solicitante').iCheck('check');
            //$('#propietario').addClass('hidden');
            $('#cedula_propietario').val('');
            $('#cedula_solicitante').val('');
            $('#nombre_propietario').val('');
            $('#nombre_solicitante').val('');
            $("#tramite_asunto").val("");
            $("#tramite_obs").val("");
            $('#celular').val('');
            $('#correo').val('');
            $('#divVerificarCorreo').hide();



        });


         $('#check_solicitante').on('ifChecked', function(event){

             $('#check_personal').iCheck('uncheck');
             $('#propietario').removeClass('hidden');
             $('#solicitante').removeClass('hidden');
             $('#cedula_propietario').val('');
             $('#cedula_solicitante').val('');
             $('#cedula_propietario').focus();
             $('#nombre_propietario').val('');
             $('#nombre_solicitante').val('');
             $("#tramite_asunto").val("");
             $("#tramite_obs").val("");
             $('#correo').val('');
             $('#celular').val('');
             $('#correoverficar').val('');
             $('#divVerificarCorreo').hide();
             $('#correoverficar').attr("required", false);





        });


         $('#check_solicitante').on('ifUnchecked', function(event){
             $('#check_solicitante').iCheck('uncheck');
             $('#check_personal').iCheck('check');
             //$('#propietario').addClass('hidden');
             $('#solicitante').addClass('hidden');
             $('#cedula_propietario').val('');
             $('#cedula_solicitante').val('');
             $('#nombre_propietario').val('');
             $('#nombre_solicitante').val('');
             $('#correo').val('');
             $('#celular').val('');
             $('#correoverficar').val('');
             $('#divVerificarCorreo').hide();
             $('#correoverficar').attr("required", false);


             $("#tramite_asunto").val("");
             $("#tramite_obs").val("");





        });


         function imprimirTicket()
         {
            var codigo_imprimir=$('#codigotxt').val();
            var cedula_imprimir=$('#cedulatxt').val();
            var fecha_imprimir=$('#fechatxt').val();
            alert(codigo_imprimir);

      }

    $(document).ready(function () {
         $('#check_personal').iCheck('check');
        cargarTipoProceso();
    });

        $('#imprimir').click(function(){
            //  vistacargando("M", "Espere...");
            //  setTimeout(() => {
            //   vistacargando();
            // }, 10000);
             $('#DetalleTramite').modal("hide");


        });


     function cargarTipoProceso(){

        mensajeCarga('content_tipo_proceso', 'Obteniendo los trámites');

        $.get('/gestionIniciarTramite/getTipoProceso', function(retorno){

            $('#content_tipo_proceso').html("");
            //console.log(retorno);

            if(retorno.error==false){

                if(retorno.listaTipoProceso.length==0){
                    $('#content_tipo_proceso').html(`
                        <div class="panel panel-info" style="margin-bottom: 0px;">
                            <div class="panel-heading">
                                <div class="row">
                                    <blockquote class="blockquote text-center" style="margin-bottom: 0px; border-left: 0;">
                                        <p class="text-center"><strong><i class="fa fa-exclamation-triangle"></i> No hay trámites disponibles.</strong></p>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    `);
                }

                $.each(retorno.listaTipoProceso, function(index, tipoProceso){

                    var panel_area = $("#content_tipo_proceso").find('.panel_area_'+tipoProceso.codigoAreaDestino);
                  //  console.log(panel_area)
                    if(panel_area.length==0){
                        $("#content_tipo_proceso").append(`
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <div class="panel panel-primary">
                                    <div class="panel-heading" style="padding:5px 15px;">
                                        <b>ÁREA RESPONSABLE: ${tipoProceso.area}</b>
                                    </div>
                                    <div id="panel_area_${tipoProceso.codigoAreaDestino}" class="panel-body panel_area_${tipoProceso.codigoAreaDestino}">
                                        <div class="col-md-12 col-sm-12 col-xs-12 text-center"></div>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                        `);
                    }
                    let deuda = btoa(tipoProceso.validar_deuda);
                    var contProceso = `
                        <div class="col-md-4 col-sm-6 col-xs-12 profile_details">
                            <div class="well profile_view" style="margin-bottom: 0px;">
                            <div class="col-sm-12">

                                <div class="left col-xs-10" style="margin: 10px 0px;">
                                    <h2 style="margin-bottom: 10px;"><b>${tipoProceso.descripcion} </b></h2>
                                    <!--<p style="text-align: justify;"><b> <i class="fa fa-users"></i> ÁREA RESPONSABLE : </b> ${tipoProceso.area}</p>-->
                                    <p style="text-align: justify;"><b> <i class="fa fa-exclamation-circle"></i> DETALLE: </b> ${tipoProceso.detalle} </p>
                                </div>

                                <div class="right col-xs-2 text-center">
                                    <center><i class="fa fa-file-text-o" style="font-size: 45px;"></i></center>
                                </div>
                            </div>
                            <div class="col-xs-12 bottom text-center">
                                <div class="col-xs-6 col-sm-6 emphasis">
                                    <p class="ratings" style="text-align: right;">Para realizar el trámite</p>
                                </div>
                                <div class="col-xs-6 col-sm-6 emphasis" style="text-align: left;">
                                    <button type="button" onclick="seleccionarTipoProceso('${tipoProceso.idtipo_proceso_encrypt}','${tipoProceso.descripcion}','${deuda}')" class="btn btn-primary btn-xs"><i class="fa fa-edit"> </i> Clic aquí</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    `;

                    $('#panel_area_'+tipoProceso.codigoAreaDestino).append(contProceso);
                });
            }else{
                $('#content_tipo_proceso').html(`
                    <div class="panel panel-danger" style="margin-bottom: 0px;">
                        <div class="panel-heading">
                            <div class="row">
                                <blockquote class="blockquote text-center" style="margin-bottom: 0px; border-left: 0;">
                                    <p class="text-center"><strong><i class="fa fa-times-circle"></i> Se produjo un error al obtener la información. Inténtalo de nuevo más tarde.</strong></p>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                `);
            }

        }).fail(function(){
            $('#content_tipo_proceso').html(`
                <div class="panel panel-danger" style="margin-bottom: 0px;">
                    <div class="panel-heading">
                        <div class="row">
                            <blockquote class="blockquote text-center" style="margin-bottom: 0px; border-left: 0;">
                                <p class="text-center"><strong><i class="fa fa-times-circle"></i>  Se produjo un error al obtener la información. Inténtalo de nuevo más tarde.</strong></p>
                            </blockquote>
                        </div>
                    </div>
                </div>
            `);
        });

    }


    //funciones para validar los campos de cedula y celular

    $('.input_number').on('input', function() { //para que solo se ingresen numeros
        this.value = this.value.replace(/[^0-9]/g,'');
    });

    $( "#correo" ).keyup(function() {
        if($( "#correo" ).val()!=''){
            $('#divVerificarCorreo').show(200);
            $('#correoverficar').attr("required", true);
            $('#correoverficar').val('');

        }else{
            $('#divVerificarCorreo').hide(200);
            $('#correoverficar').attr("required", false);
            $('#correoverficar').val('');


        }
    });

    //bloquear control c y control v
    $("#correoverficar").on('paste', function(e){
        e.preventDefault();
    })

    $("#correoverficar").on('copy', function(e){
        e.preventDefault();
    })