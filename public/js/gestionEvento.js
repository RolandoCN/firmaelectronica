function btn_eliminar_evento(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// ============================ METODOS PARA LA GESTIÓN DE EVENTO ==================================

    function sector_editar_evento(idevento){
        $.get("/gestionInsidencia/evento/"+idevento+"/edit", function (resultado) {
            console.log(resultado.resultado.descripcion);
            $('#evento').val(resultado.resultado.descripcion); // cargamos la descripción del sector a editar
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_evento').val('PUT'); // decimo que sea un metodo put
        $('#frm_evento').attr('action','/gestionInsidencia/evento/'+idevento); // actualizamos la ruta del formulario para actualizar
        $('#btn_evento_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_evento').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_evento_cancelar').click(function(){
        $('#evento').val(''); // limpiamos el input de descripción
        $('#method_evento').val('POST'); // decimo que sea un metodo put
        $('#frm_evento').attr('action','/gestionInsidencia/evento'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE EVENTO ==================================