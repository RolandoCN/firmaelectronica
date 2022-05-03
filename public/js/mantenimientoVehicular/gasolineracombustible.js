


// ============================= GESTIONES DE GASOLINERA COMBUSTIBLES =================================
//FUNCIONES PARA EDITAR LOS REGISTROS 
// Gestion gasolinera-combustible
function gasolineracombustible_editar(id){
    $.get("/gasolineraCombustibles/"+id+"/edit", function (data) {
        console.log(data);
        $('#precio').val(data.precio);
        $('.opcion_combustible').prop('selected',false); 
        $(`#detallecombustible option[value="${data['idmv_tipocombustible']}"]`).prop('selected',true);
        $("#detallecombustible").trigger("chosen:updated"); 
        $('.opcion_gasolinera').prop('selected',false); 
        $(`#detallegasolinera option[value="${data['idmv_gasolinera']}"]`).prop('selected',true);
        $("#detallegasolinera").trigger("chosen:updated"); 
        
       
        
    });

    $('#method_asignarGasolineraCombustible').val('PUT'); 
    $('#frm_asignarGasolineraCombustible').prop('action',window.location.protocol+'//'+window.location.host+'/gasolineraCombustibles/'+id);
    $('#btn_gasolineracombCancelar').removeClass('hidden');

   // $('html,body').animate({scrollTop:$('#administradorCanton').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_gasolineracombCancelar').click(function(){
    $('#precio').val('');
    $('.opcion_combustible').prop('selected',false); // 
    $("#detallecombustible").trigger("chosen:updated"); // 
    $('.opcion_gasolinera').prop('selected',false); // 
    $("#detallegasolinera").trigger("chosen:updated"); //  
    $('#method_asignarGasolineraCombustible').val('POST'); 
    $('#frm_asignarGasolineraCombustible').prop('action',window.location.protocol+'//'+window.location.host+'/gasolineraCombustibles/');
    $(this).addClass('hidden');
});

//ELIMINAR DETALLEGASOLINERA
function btn_eliminardetallegas(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


//Gestion GASOLINERA/////////////////////////////////////////////////////////


function gasolinera_editar(id){
    $.get("/gasolinera/"+id+"/edit", function (data) {
        console.log(data);
        $('#nombre_gasolinera').val(data.resultado.detalle);
        $('#det_contratacion').val(data.resultado.detallecontratacion);
        
       
        
    });

    $('#method_gasolinera').val('PUT'); 
    $('#frm_gasolinera').prop('action',window.location.protocol+'//'+window.location.host+'/gasolinera/'+id);
    $('#btn_gasolineraCancelar').removeClass('hidden');

   // $('html,body').animate({scrollTop:$('#administradorCanton').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_gasolineraCancelar').click(function(){
    $('#nombre_gasolinera').val('');
    $('#det_contratacion').val('');
         
    $('#method_gasolinera').val('POST'); 
    $('#frm_gasolinera').prop('action',window.location.protocol+'//'+window.location.host+'/gasolinera/');
    $(this).addClass('hidden');
});

//ELIMINAR DETALLEGASOLINERA
function btn_eliminargaso(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}



//Gestion combustible/////////////////////////////////////////////////////////


function combustible_editar(id){
    $.get("/combustible/"+id+"/edit", function (data) {
        console.log(data);
        console.log(data.resultado);

        console.log(data.resultado.detalle);
        $('#detallecombustibles').val(data.resultado.detalle);
        
            
        
    });

    $('#method_combustible').val('PUT'); 
    $('#frm_combustible').prop('action',window.location.protocol+'//'+window.location.host+'/combustible/'+id);
    $('#btn_combustibleCancelar').removeClass('hidden');

   // $('html,body').animate({scrollTop:$('#administradorCanton').offset().top},400);
}

// la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
$('#btn_combustibleCancelar').click(function(){
    $('#detallecombustibles').val('');
            
    $('#method_combustible').val('POST'); 
    $('#frm_combustible').prop('action',window.location.protocol+'//'+window.location.host+'/combustible/');
    $(this).addClass('hidden');
});

//ELIMINAR DETALLEGASOLINERA
function btn_eliminarcomb(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


