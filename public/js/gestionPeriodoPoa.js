
function btn_eliminar_periodoPoa(btn){
    if(confirm('¿Está seguro de eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// ============================ METODOS PARA LA GESTIÓN DE CONTROL PROCESO ==================================

 function editar_periodoPoa(id){
        $.get("/gestionPeriodoPoa/periodoPoa/"+id+"/edit", function (resultado) {
            $('#descripcion').val(resultado.resultado.descripcion); //
            $('#fecha_inicio_poa').val(resultado.resultado.fecha_inicio); //
            $('#fecha_fin_poa').val(resultado.resultado.fecha_fin); //
            $('#EstadoPoa').val(resultado.resultado.estado);
            $('#EstadoRPoa').val(resultado.resultado.estado_registro);



        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_periodoPoa').val('PUT'); // decimo que sea un metodo put
        $('#frm_periodoPoa').attr('action','/gestionPeriodoPoa/periodoPoa/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_periodoPoa_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_periodoPoa').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_periodoPoa_cancelar').click(function(){
        $('#descripcion').val('');
        $('#fecha_inicio_poa').val('');
        $('#EstadoRPoa').val('');
        $('#fecha_fin_poa').val('');
        $('#method_periodoPoa').val('POST'); // decimo que sea un metodo put
        $('#frm_periodoPoa').attr('action','/gestionPeriodoPoa/periodoPoa'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });

    function modificar_periodoPoa(id){

      $.get("/gestionEvaluacionPoa/evaluacion/"+id+"/edit", function (data){
        //console.log(data)
        $('#idevaluacion').val(id);
        $('#fecha_inicio').val(data.resultado.fecha_inicio);
        $('#fecha_fin').val(data.resultado.fecha_fin);
        $('#numero').val(data.resultado.numero);
        $("#btn_evaluacion").attr("onclick", "atualizar_evaluacion()")
        $("#btn_evaluacion_cancelar").removeClass("hidden");
      });
    }

  function atualizar_evaluacion()
    {

        var codEvaluacion = $('#idperiodo').val();
        $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
        });

        var FrmData = {
                      idevaluacion: $('#idevaluacion').val(),
                      fecha_inicio: $('#fecha_inicio').val(),
                      fecha_fin: $('#fecha_fin').val(),
                      numero: $('#numero').val(),
                      idperiodo: $('#idperiodo').val(),

                       }
   // Help para visualizar envio de data por consola
    //console.log(FrmData)
    //return
    $.ajax({
        url:"/gestionEvaluacionPoa/evaluacion/"+$('#idevaluacion').val()+"", // Url que se envia para la solicitud
        method: 'PUT',             // Tipo de solicitud que se enviará, llamado como método
        data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
        dataType: 'json',
        success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
        {
            showModal(codEvaluacion)
           // console.log(requestData);
          $('#mensajeVentanaIncidencia').html(`
                    <div id="mensaje_alert"  class="alert alert-${requestData['estadoP']} alert-dismissible alert_sm" role="alert">
                        <strong>MENSAJE!</strong> <span id="mensaje_info">${requestData['mensajeEvaluacion']}</span>
                    </div>
          `);
            limpiarControles()

            window.setInterval("$('#mensajeVentanaIncidencia').html('')",9000);
             //vistacargando();
        },
       // beforeSend: function() {
         // vistacargando('M','Espere por favor...');
         //},
        error:function () {
          alert("Error al ejecutar la petición");
            vistacargando();
        }



     });
    }


    $('#btn_periodoPoa_cancelar').click(function(){
        $('#descripcion').val('');
        $('#fecha_inicio_poa').val('');
        $('#fecha_fin_poa').val('');
        $('#method_periodoPoa').val('POST'); // decimo que sea un metodo put
        $('#frm_periodoPoa').attr('action','/gestionPeriodoPoa/periodoPoa'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });

     $('#btn_evaluacion_cancelar').click(function(){
        $('#fecha_fin').val('');
        $('#fecha_inicio').val('');
        $('#numero').val('');
        $(this).addClass('hidden'); // ocultamos el boton cancelar
        $("#btn_evaluacion").attr("onclick", "guardarEvaluacion()")
    });

function guardarEvaluacion()
{
    //e.preventDefault();
    var codEvaluacion = $('#idperiodo').val();

    //console.log(codEvaluacion)
    //return

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });



    var FrmData = {
        fecha_inicio: $('#fecha_inicio').val(),
        fecha_fin: $('#fecha_fin').val(),
        numero: $('#numero').val(),
        idperiodo: $('#idperiodo').val(),

    }
   // Help para visualizar envio de data por consola
   //console.log(FrmData)
   //return
    $.ajax({
        url:'/gestionEvaluacionPoa/evaluacion', // Url que se envia para la solicitud
        method: $('#method_evaluacion').val(),             // Tipo de solicitud que se enviará, llamado como método
        data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
        dataType: 'json',
        success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
        {
            //limpiarForm();
           showModal(codEvaluacion)

          $('#mensajeVentanaIncidencia').html(`
                    <div id="mensaje_alert"  class="alert alert-${requestData['estadoP']} alert-dismissible alert_sm" role="alert">
                        <strong>MENSAJE!</strong> <span id="mensaje_info">${requestData['mensajeEvaluacion']}</span>
                    </div>
          `);
            limpiarControles()

            window.setInterval("$('#mensajeVentanaIncidencia').html('')",9000);
             //vistacargando();
        },
       // beforeSend: function() {
         // vistacargando('M','Espere por favor...');
         //},
        error:function () {
          alert("Error al ejecutar la petición");
            vistacargando();
        }
     });

}

function limpiarControles()
{
        $('#fecha_fin').val('');
        $('#fecha_inicio').val('');
        $('#numero').val('');
        $('#btn_evaluacion_cancelar').addClass('hidden'); // ocultamos el boton cancelar
        $("#btn_evaluacion").attr("onclick", "guardarEvaluacion()")

}

function showModal(idperiodo) {
        $('#idperiodo').val(idperiodo)

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
        url:"/gestionEvaluacionPoa/evaluacion/"+idperiodo, // Url que se envia para la solicitud
        method: 'POST',             // Tipo de solicitud que se enviará, llamado como método
        data: '',     // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
        dataType: 'json',
        success: function(retorno)   // Una función a ser llamada si la solicitud tiene éxito
        {
           //return
           llenarTabla(retorno)

        },

        error:function () {
          alert("Error al ejecutar la petición");
            vistacargando();
        }
     });

}

function llenarTabla(data) {
//listaPlan
 var tablatramite = $('#datatable').DataTable({
    dom: ""
    +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
    +"<rt>"
    +"<'row'<'form-inline'"
    +" <'col-sm-6 col-md-6 col-lg-6'l>"
    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
    "destroy":true,
     pageLength: 10,
     sInfoFiltered:false,
     data: data,
      columns:[
           {data: "idevaluacion_poa" },
           {data: "fecha_inicio" },
           {data: "fecha_fin" },
           {data: "numero_romano" },
           {data: "numero" },
           {data: "numero" },
       ],
        "rowCallback": function( row, data, index ){
          $('td', row).eq(0).html(index+1);
          $('td', row).eq(4).html(`<button type="button" onclick="modificar_periodoPoa('${data.idevaluacion_poa_encrypt}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-edit"></i> Editar</button>`);
          $('td', row).eq(5).html(`<button type="button" class="btn btn-sm btn-danger marginB0" onclick="btn_eliminar_evaluacion('${data.idevaluacion_poa_encrypt}')"><i class="fa fa-trash"></i> Eliminar</button>`);
          $("#myModalLabel").html(` Registro de Evaluación:  '${data.periodo[0].descripcion}' `);
    }
});
}

function btn_eliminar_evaluacion(id){
     var codEvaluacion = $('#idperiodo').val();

    if(confirm('¿Quiere eliminar el registro?')){
       $.ajaxSetup({
        headers: {
                  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                 }
       });

   // Help para visualizar envio de data por consola
   //console.log(FrmData)
   //return
    $.ajax({
        url:"/gestionEvaluacionPoa/evaluacion/"+id+"", // Url que se envia para la solicitud
        method: 'DELETE',             // Tipo de solicitud que se enviará, llamado como método
             // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
        dataType: 'json',
        success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
        {
            //limpiarForm();
           showModal(codEvaluacion)
          $('#mensajeVentanaIncidencia').html(`
                    <div id="mensaje_alert"  class="alert alert-${requestData['estadoP']} alert-dismissible alert_sm" role="alert">
                        <strong>MENSAJE!</strong> <span id="mensaje_info">${requestData['mensajeEvaluacion']}</span>
                    </div>
          `);
            limpiarControles()

            window.setInterval("$('#mensajeVentanaIncidencia').html('')",9000);
             //vistacargando();
        },
       // beforeSend: function() {
         // vistacargando('M','Espere por favor...');
         //},
        error:function () {
          alert("Error al ejecutar la petición");
            vistacargando();
        }
     });
    }
}
// ============================ /METODOS PARA LA GESTIÓN DE CAMARA ==================================