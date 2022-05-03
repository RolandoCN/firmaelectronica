
$('.inputValClave').keyup(function(e){ 

    clave=$(this).val();
    regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    if (regex.test(clave) || clave==''){
        // clave correcta
        $(this).parent().removeClass('has-error');
        $(this).siblings('.mserror').html('');
    }else{
        // clave inforrecta
        $(this).parent().addClass('has-error');
        $(this).siblings('.mserror').html(`<span class="help-block"> 
                                                La contraseña debe tener al menos 8 caracteres, incluir letras mayúsculas, minúsculas y numeros.
                                            </span>`);
    }
});

$('.inputConfClave').keyup(function(e){
    clave=$('.inputValClave').val();
    confirma=$(this).val();

    
    if (clave==confirma || confirma==''){
        // clave correcta
        $(this).parent().removeClass('has-error');
        $(this).siblings('.mserror').html('');
    }else{
        // clave inforrecta
        $(this).parent().addClass('has-error');
        $(this).siblings('.mserror').html(`<span class="help-block"> 
                                                Confirme bien la contraseña.
                                            </span>`);
    }

});

$('.btn_registrarUsuario').click(function(){
    $('#modal_cargando_title').html('Espere');
    $('#modal_cargando').show(); 
});


$('.frm_registrar').submit(function(){
    $('#modal_cargando_title').html('Registrando');
    $('#modal_cargando').show(); 
});