function btn_eliminar_clave(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// ============================ METODOS PARA LA GESTIÓN DE CLAVE ==================================

    function sector_editar_clave(idclave){
        $.get("/gestionInsidencia/clave/"+idclave+"/edit", function (resultado) {
            $('#clave').val(resultado.resultado.descripcion); // cargamos la descripción del sector a editar
             $('#color').val(resultado.resultado.color); // cargamos la descripción del sector a editar
            console.log(resultado.resultado.descripcion);
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_clave').val('PUT'); // decimo que sea un metodo put
        $('#frm_clave').attr('action','/gestionInsidencia/clave/'+idclave); // actualizamos la ruta del formulario para actualizar
        $('#btn_clave_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_clave').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_clave_cancelar').click(function(){
        $('#clave').val(''); // limpiamos el input de descripción
        $('#color').val('#ffffff'); // limpiamos el input de descripción
        $('#method_clave').val('POST'); // decimo que sea un metodo put
        $('#frm_clave').attr('action','/gestionInsidencia/clave'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE CLAVE ==================================