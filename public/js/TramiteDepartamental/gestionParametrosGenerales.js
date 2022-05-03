

function btn_eliminar_controlP(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

// ============================ METODOS PARA LA GESTIÓN DE CONTROL PROCESO ==================================

    function sector_editar_controlp(id){
        $.get("/parametrosGeneralesDocumental/gestion/"+id+"/edit", function (resultado) {
            $('#codigo').val(resultado.resultado.codigo); //
            $('#descripcion').val(resultado.resultado.descripcion); //
            $('#valor').val(resultado.resultado.valor); //

        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_controlP').val('PUT'); // decimo que sea un metodo put
        $('#frm_controlP').attr('action','/parametrosGeneralesDocumental/gestion/'+id); // actualizamos la ruta del formulario para actualizar
        $('#btn_controlP_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_controlP').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_controlP_cancelar').click(function(){
        $('#codigo').val('');
        $('#descripcion').val('');
        $('#valor').val('');
        $('#method_controlP').val('POST'); // decimo que sea un metodo put
        $('#frm_controlP').attr('action','/parametrosGeneralesDocumental/gestion'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE CAMARA ==================================