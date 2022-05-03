function btn_eliminar_diasfestivos(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}



// ============================ METODOS PARA LA GESTIÓN DE DIAS FESTIVOS ==================================

    function editar_diasfestivos(iddia_festivo){
        //console.log(iddia_festivo);
        
        $.get("/gestionAgenda/diasFestivos/"+iddia_festivo+"/edit", function (data){
   
               //console.log(data.resultado.dia+"/"+ data.resultado.mes +"/"+ data.resultado.anio.descripcion);
               var dato=(data.resultado.anio.descripcion+"-"+ data.resultado.mes +"-"+data.resultado.dia);
                console.log(dato);
                $('#diasfestivos').val(dato);
                
      //$('#diasfestivos').val(data.resultado.anio.descripcion+"/"+data.resultado.mes+"/"+data.resultado.dia);
 
                
        })/*.fail(function(error){
            alert("Error al ejecutar la petición");
        });*/

        $('#method_diasfestivos').val('PUT'); 
        $('#frm_diasfestivos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionAgenda/diasFestivos/'+iddia_festivo);
        $('#btn_diasfestivos_cancelar').removeClass('hidden');// mostramos el boton cancelaradministrador_horarios

       $('html,body').animate({scrollTop:$('#administrador_dias').offset().top},400);// realizamos la animación de subir a la parte superior de la pagina        
    }


   //ACCION DEL BOTON DE CANCELAR EN ZONA
$('#btn_diasfestivos_cancelar').click(function(){
    $("#diasfestivos").val(""); // limpiamos la fecha seleccionada
    $('#method_diasfestivos').val('POST'); // decimos que sea un metodo put
    $('#frm_diasfestivos').prop('action',window.location.protocol+'//'+window.location.host+'/gestionAgenda/diasFestivos');
    $(this).addClass('hidden');
});

// ============================ /METODOS PARA LA GESTIÓN DE DIAS FESTIVOS ==================================

