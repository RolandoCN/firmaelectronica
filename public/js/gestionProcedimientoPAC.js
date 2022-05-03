
//funcion para eliminar el registro
 function btn_eliminar_procedimiento(btn){
    if(confirm('¿Quieres eliminar el registro?')){
    	  vistacargando('M','Espere por favor');
        $(btn).parent('.frm_eliminar').submit();
    }
}

//evento para detectar el envio del registro
$("#frm_procedimiento").on("submit", function(e){
    vistacargando('M','Espere por favor');
});

//funcion para editar el registro
function procedimientopac_editar(id){
    vistacargando('M','Espere por favor...'); // mostramos la ventana de espera
    $.get("/gestionProyectoPoa/procedimiento/"+id+"/edit", function (data) {
        
        $('#descripcion').val(data.descripcion);
        vistacargando(); // ocultamos la ventana de espera
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_procedimiento').val('PUT'); // decimo que sea un metodo put
    $('#frm_procedimiento').prop('action',window.location.protocol+'//'+window.location.host+'/gestionProyectoPoa/procedimiento/'+id);
  
}

//evento para detectar cancelar del formulario
$("#frm_procedimiento").on("reset", function(e){
	
    $('#descripcion').val(" ");
    $('#method_procedimiento').val('POST'); // decimo que sea un metodo put
    $('#frm_procedimiento').prop('action',window.location.protocol+'//'+window.location.host+'/gestionProyectoPoa/procedimiento');
    
});