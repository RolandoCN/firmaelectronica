
function btn_eliminar_menuInicio(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// ============================ METODOS PARA LA GESTIÓN DE CAMARA ==================================

    function sector_editar_menuInicio(id){
        $.get("/gestionMenuInicio/menuInicio/"+id+"/edit", function (resultado) {
            // alert(resultado.resultado.img);
            $('#ord').val(resultado.resultado.ord);
             //$('#img').val(resultado.resultado.img);
            $('#ruta').val(resultado.resultado.ruta);


        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_menuInicio').val('PUT'); // decimo que sea un metodo put
        $('#frm_menuInicio').attr('action','/gestionMenuInicio/menuInicio/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_menuInicio_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_menuInicio').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_menuInicio_cancelar').click(function(){

        $('#method_menuInicio').val('POST');
        $('#frm_menuInicio').attr('action','/gestionMenuInicio/menuInicio');
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE MENU INICIO ==================================