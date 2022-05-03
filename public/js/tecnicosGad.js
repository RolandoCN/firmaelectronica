function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}

$('#btn_tecnicoCancelar').click(function(){
    $('#observacion').val(''); 
    $('#funcionario').val(''); 
    $('#equipo').val(''); 
    $('#direccionIP').val(''); 
    $("#estado").val('A');
    $('.option_departamento').prop('selected',false); 
    $("#departamento").trigger("chosen:updated"); 
    $('#method_tecnicos').val('POST'); 
    $('#frm_Tecnicos').prop('action',window.location.protocol+'//'+window.location.host+'/tecnicos/registro/'); // agregamos la ruta post (ruta por defecto)
    $(this).addClass('hidden'); 
});

 function tecnicos_editar(idtecnico){
        $.get("/tecnicos/registro/"+idtecnico+"/edit", function (resultado) {
        	$('#departamento').html('<option value=""></option>');
            $.each(resultado['departamentos'],function(i,item){
                $('#departamento').append(`<option class="option_departamento" value="${item.iddepartamento}">${item.nombre}</option>`);
            });
            $("#departamento").trigger("chosen:updated");
            $(".option_departamento").prop("selected",false);
            $(`#departamento option[value=${resultado.tecnicos.iddepartamento}]`).prop("selected",true);
            $(`#departamento`).trigger("chosen:updated");
            $("#funcionario").val(resultado.tecnicos.funcionario);
			$("#equipo").val(resultado.tecnicos.equipo);
			$("#direccionIP").val(resultado.tecnicos.ip);
			$("#estado").val(resultado.tecnicos.estado);
			$("#observacion").val(resultado.tecnicos.observacion);

            // modificamos el action del formulario para que actualice
            $('#method_tecnicos').val('PUT'); // decimo que sea un metodo put
            $('#frm_Tecnicos').prop('action',window.location.protocol+'//'+window.location.host+'/tecnicos/registro/'+resultado.tecnicos.idtecnicos_gad); // actualizamos la ruta del formulario para actualizar
            $("#btn_tecnicoCancelar").removeClass("hidden"); // mostramos el boton de cancelar la edición
    
            $('html,body').animate({scrollTop:$('#administradorRegistroEquipos').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
        });
}