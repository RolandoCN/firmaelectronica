
	$("#frm_destino_presupuesto").on("submit", function(e){
		e.preventDefault();
		if($('#method_destinopresupuesto').val()=='POST'){
			guardarDestinoPresupuesto();
		}else if($('#method_destinopresupuesto').val()=='PUT'){
            actualizarDestinoPresupuesto()
		}
	});

//Cancelar
$('#btn_destino_cancelar').click(function (event) {
        $('#method_destinopresupuesto').val('POST');
        $('#btn_destino_cancelar').addClass('hidden');
        limpiarCampos();
    });

function btn_eliminar_DestinoPresupuesto(id){
    if(confirm('¿Quiere eliminar el registro?')){
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url:'/gestionDestinoPresupuestoPoa/destinoPresupuesto/'+id, // Url que se envia para la solicitud
                method: 'DELETE',              // Tipo de solicitud que se enviará, llamado como método
                dataType: 'json',
                success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
                {
                    $('#mensajeDestinoPresupuesto').html(`
                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                        <div class="col-md-12 col-sm-6 col-xs-12">
                            <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                 <script type="text/javascript">
                                      window.setTimeout(function() {
                                          $(".alert").fadeTo(3000, 0).slideUp(100, function(){
                                              $(this).remove();
                                          });
                                      }, 2000);
                                   </script>
                                <strong>Información: </strong> ${requestData.mensaje}
                            </div>
                        </div>
                    `);
                limpiarCampos();
                cargartablaDestinoPresupuesto($('#idproyectopoa_id').val());
                }, error:function (requestData) {
                    console.log('Error no se puedo completar la acción');
                }
            });
        }
}


//Editar Destino Presupuesto
 function sector_editar_destinoPresupuesto(idDestino){
        $.get("/gestionDestinoPresupuestoPoa/destinoPresupuesto/"+idDestino+"/edit", function (resultado) {
            $('#descripcion').val(resultado.resultado.descripcion);
            $('.option_idmeta').prop('selected',false);
            $(`#idmeta option[value="${resultado.resultado.idmeta}"]`).prop('selected',true);
            $("#idmeta").trigger("chosen:updated");
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_destinopresupuesto').val('PUT'); // decimo que sea un metodo put
        $('#frm_medioVerificacion').attr('action','/gestionDestinoPresupuestoPoa/destinoPresupuesto/'+idDestino); // actualizamos la ruta del formulario para actualizar
        $('#btn_destino_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_medioVerificacion').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


//Guardar Destino Presupuesto
    function guardarDestinoPresupuesto() {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
             var FrmData = {
                idproyecto: $('#idproyectopoa_id').val(),
                idparroquia: $('#idParroquia').val(),
                porcentaje: $('#porcentaje').val(),
             };
            //var data=$("#frm_destino_presupuesto").serialize();
            $.ajax({
                url:'/gestionDestinoPresupuestoPoa/destinoPresupuesto', // Url que se envia para la solicitud
                method: 'POST',              // Tipo de solicitud que se enviará, llamado como método
                data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
                dataType: 'json',

                success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
                {
                    //console.log(requestData);
                    $('#mensajeDestinoPresupuesto').html(`
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                            <div class="col-md-12 col-sm-6 col-xs-12">
                                <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                     <script type="text/javascript">
                                      window.setTimeout(function() {
                                          $(".alert").fadeTo(3000, 0).slideUp(500, function(){
                                              $(this).remove();
                                          });
                                      }, 2000);
                                   </script>
                                    <strong>Información: </strong> ${requestData.mensaje}
                                </div>
                            </div>
                        `);
                    limpiarCampos();

                    cargartablaDestinoPresupuesto($('#idproyectopoa_id').val());
                }, error:function (requestData) {
                    console.log(requestData);
                    //alert("error")
                }
                });

    }

//actualizar Destino Presupuesto
    function actualizarDestinoPresupuesto() {

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var FrmData = {
                idproyecto: $('#idproyectopoa_id').val(),
                idparroquia: $('#idParroquia').val(),
                porcentaje: $('#porcentaje').val(),
            };
            $.ajax({
                url:'/gestionDestinoPresupuestoPoa/destinoPresupuesto/'+$('#iddestino').val(), // Url que se envia para la solicitud
                method: 'PUT',              // Tipo de solicitud que se enviará, llamado como método
                data: FrmData,               // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
                dataType: 'json',
                success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
                {
                    //var clean = requestData.estadoP;
                    $('#mensajeDestinoPresupuesto').html(`
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                            <div class="col-md-12 col-sm-6 col-xs-12">
                                <div class="alert alert-${requestData.estadoP} alert-dismissible fade in" id="idalert" role="alert" style="margin-bottom: 0;">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                     <script type="text/javascript">
                                      window.setTimeout(function() {
                                          $(".alert").fadeTo(3000, 0).slideUp(500, function(){
                                              $(this).remove();
                                          });
                                      }, 2000);
                                   </script>
                                    <strong>Información: </strong> ${requestData.mensaje}
                                </div>
                            </div>
                        `);
                    //if (clean != 'danger') {
                      limpiarCampos();
                    //}
                    $('#method_destinopresupuesto').val('POST');
                    cargartablaDestinoPresupuesto($('#idproyectopoa_id').val());
                    $('#btn_destino_cancelar').addClass('hidden');

                }, error:function (requestData) {
                    console.log(requestData);
                }
                });

    }

function cargartablaDestinoPresupuesto(id) {
     $.get("/gestionDestinoPresupuestoPoa/destinoPresupuesto/"+id+'/', function (resultado) {
        llenarTabla(resultado);
     });
 }
//llenar tabla plna de contratacion

function llenarTabla(data){
    var datatable = {
                    placeholder: "Destino Presupuesto"
    }
$('#dPresupuesto').css({'padding-top':'12px','padding-bottom':'12px', 'border':'1','overflow-x':'inherit'});
 var tablatramites = $('#listaDestinoPresupuesto').DataTable({



    dom: ""
    +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
    +"<rt>"
    +"<'row'<'form-inline'"
    +" <'col-sm-6 col-md-6 col-lg-6'l>"
    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
    "destroy":true,
     pageLength: 10,

     data: data,
      columnDefs: [
                    {  className: "todo_mayus", targets: 0 },
                    {  className: "todo_mayus", targets: 1 },
                    {  className: "todo_mayus", targets: 2 },
                    {  className: "paddingTR", targets: 3 },

                ],
      columns:[
           {data: "porcentaje" },
           {data: "porcentaje" },
           {data: "parroquia.descripcion" },
            {data: "porcentaje" },

       ],
        "rowCallback": function( row, data, index ){
            $('td', row).eq(0).html(index+1);
         $('td', row).eq(3).html(`<button type="button" onclick="buscarDestinoPresupuesto('${data.iddestino_presupuesto_encrypt}')" class="btn btn-sm btn-info btn_icon" data-toggle="tooltip" dataplacement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-edit"></i></button>
         <button type="button" onclick="btn_eliminar_DestinoPresupuesto('${data.iddestino_presupuesto_encrypt}')" class="btn btn-sm btn-danger btn_icon" data-toggle="tooltip" dataplacement="top" title="Ver detalle general del trámite" style="margin-bottom: 0;"><i class="fa fa-remove"></i></button>`);
    }
});
}

//buscar Destino del Presupuesto
    function buscarDestinoPresupuesto(id){
        $.get("/gestionDestinoPresupuestoPoa/destinoPresupuesto/"+id+'/edit', function (data) {
            console.log(data)

            $('#iddestino').val(id);
            $('#porcentaje').val(data.resultado.porcentaje);


            $('.option_idparroquia').prop('selected',false);
            $(`#idParroquia option[value="${data.resultado.idparroquia}"]`).prop('selected',true);
            $("#idParroquia").trigger("chosen:updated");

            $('#btn_destino_cancelar').removeClass('hidden');
            $('#method_destinopresupuesto').val('PUT');
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });
    }

 function limpiarCampos() {
     $('#porcentaje').val("");
     $('.option_idparroquia').prop('selected',false);
     $("#idParroquia").trigger("chosen:updated");
}
