

//funcion para eliminar el registro

 function btn_eliminar_RP(btn){
    if(confirm('¿Quiere eliminar el registro?')){
    	  vistacargando('M','Espere por favor');
        $(btn).parent('.frm_eliminar').submit();
    }
}

//evento para detectar el envio del registro
$("#frm_asignarGestion").on("submit", function(e){
    vistacargando('M','Espere por favor');
});

//funcion para editar el registro
function procedimiento_regimen_editar(id){
    // vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("/gestionProyectoPoa/regimenProcedimiento/"+id+"/edit", function (data) {
        console.log(data);
      
        $('.option_idtiporegimen').prop("selected", false);
        $(`#idtiporegimen option[value="${data['idtiporegimen']}"]`).prop("selected", true);
        $("#idtiporegimen").trigger("chosen:updated"); 
       
        
        $('.opcion_idprocedimiento_contratacion').prop("selected", false);
              
            $(`#idprocedimiento_contratacion option[value="${data.idprocedimiento_contratacion}"]`).prop("selected", true);  
            $("#idprocedimiento_contratacion").trigger("chosen:updated");          
     
        vistacargando(); // ocultamos la ventana de espera
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_asignarPTR').val('PUT'); // decimo que sea un metodo put
    $('#frm_asignarGestion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionProyectoPoa/regimenProcedimiento/'+id);
  
}

//evento para detectar cancelar del formulario
$("#frm_asignarGestion").on("reset", function(e){

	$('.option_idtiporegimen').prop("selected", false);
	$("#idtiporegimen").trigger("chosen:updated"); 

	$('.opcion_idprocedimiento_contratacion').prop("selected", false);
	$("#idprocedimiento_contratacion").trigger("chosen:updated"); 

    $('#method_asignarPTR').val('POST'); // decimo que sea un metodo put
    $('#frm_asignarGestion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionProyectoPoa/regimenProcedimiento');
    
});