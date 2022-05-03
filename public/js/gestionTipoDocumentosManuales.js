$(document).ready(function(){
    cargarContenidoTablas('datatablebuttons');
    cargarContenidoTablas('datatablecheckbox');
    cargarContenidoTablas('datatablefixedheader');
    
});
function cargarContenidoTablas(tabla) {
    $(`#${tabla}`).DataTable( {
        "language": {
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
    }
} );
}



//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


function tipodoc_editar(idtipodocumento_m){
    $.get("/gestionDocumentos/tipoDocumento/"+idtipodocumento_m+"/edit", function (data) {
        console.log(data);
        $('#descripcion').val(data.resultado.descripcion);
      // $('#formato').val(data.resultado.ruta);
             
});

    $('#method_TipoDoc').val('PUT'); 
    $('#frm_TipoDoc').prop('action',window.location.protocol+'//'+window.location.host+'/gestionDocumentos/tipoDocumento/'+idtipodocumento_m);
    $('#btn_tipodoc_cancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administradorTipoDocumentos').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_tipodoc_cancelar').click(function(){
     $('#descripcion').val('');
    
    $('#frm_TipoDoc').prop('action',window.location.protocol+'//'+window.location.host+'/gestionDocumentos/tipoDocumento/');
    $(this).addClass('hidden');
});

//es para pasar el nombre del archivo seleccionado en el input del formato del requisito
$('#formato').change(function(e){
    archivo="Seleccione un archivo";
    if(this.files.length>0){ // si se selecciona un archivo
        archivo=(this.files[0].name);
        $('#nombreFormatoSeleccionado').val(archivo);
 
    }
});


function doc_addfooter(archivo)
{
    
    vistacargando("M","Validando...");
    var data=archivo;
        $.ajax({
            url:'/gestionDocumentos/registro', // Url que se envia para la solicitud
            method: 'GET',              // Tipo de solicitud que se enviará, llamado como método
            data:{'valor':data},              // Datos enviados al servidor, un conjunto de pares clave / valor (es decir, campos de formulario y valores)
            //dataType: 'json',
            success: function(requestData)   // Una función a ser llamada si la solicitud tiene éxito
            {
                //console.log(requestData);
                vistacargando();
                     $('#infoBusqueda').html('');
                     $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>¡Atención!</strong> Documento validado de manera exitosa
                                  </div>`);
                      $('#infoBusqueda').show(200);
                      setTimeout(function() {
                      $('#infoBusqueda').hide(200);
                      },  3000);

                      // $("#datatable").find('#doc_id_'+archivo).css('visibility', 'hidden');
               // alert("ok");
                //location.reload(true);
                
                
            }, error:function (requestData) {
                vistacargando();
                //alert("Se produjo un error");
                 $('#infoBusqueda').html('');
                     $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                    </button>
                                    <strong>¡Atención!</strong> Se produjo un error a la hora de validar el archivo.
                                  </div>`);
                      $('#infoBusqueda').show(200);
                      setTimeout(function() {
                      $('#infoBusqueda').hide(200);
                      },  3000);
            }
            });
}