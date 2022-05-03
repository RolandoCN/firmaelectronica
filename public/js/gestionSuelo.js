 function lineafabrica(idsector){

    $.get("/gestionSuelo/sector/"+idsector, function (resultado) {
        console.log(resultado);
        console.log(resultado.idsector);
        console.log(resultado.resultado.Descripcion);
    var id=resultado.idsector;
    $('#simbologia').val(resultado.resultado.simbologia)
    $('#lotemin').val(resultado.resultado.loteMinimo);
    $('#frentemin').val(resultado.resultado.frenteMinimo);
    $('#cos').val(resultado.resultado.cos);
    $('#cus').val(resultado.resultado.cus);
    $('#numpisos').val(resultado.resultado.numeroPisos);
    $('#alturamax').val(resultado.resultado.alturaMaxima);
    $('#retiroportal').val(resultado.resultado.retiroPortal);
    $('#retirofrontal').val(resultado.resultado.retiroFrontal);
    $('#retirolateral').val(resultado.resultado.retiroLateral);
    $('#retiroposterior').val(resultado.resultado.retiroPosterior);
    $('#relaciofrentefondo').val(resultado.resultado.relacionFrenteFondo);
    $('#idsector').val(resultado.idsector);
    $('#sector_descripcion_').val(resultado.resultado.Descripcion);
    $('#cmb_zona_sector_').val(resultado.resultado.idzona);
    
    $('#frm_Linea_').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/sector/'+id);

    $("#modaldatoslinea").modal("show");

    });

 }


  $('#modaldatoslinea').on('hidden.bs.modal', function (e) {
      $('#simbologia').val('');
      $('#lotemin').val('');
      $('#frentemin').val('');
      $('#cos').val('');
      $('#cus').val('');
      $('#numpisos').val('');
      $('#alturamax').val('');
      $('#retiroportal').val('');
      $('#retirofrontal').val('');
      $('#retirolateral').val('');
      $('#retiroposterior').val('');
      $('#relaciofrentefondo').val('');
      $('#idsector').val('');
      $('#sector_descripcion_').val('');
      $('#cmb_zona_sector_').val('');
    


      // $("#modaldatoslinea").modal("show");
  })







function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
}


// ============================ METODOS PARA LA GESTIÓN DE SECTORES ==================================

    function sector_editar(idsector){
        $.get("/gestionSuelo/sector/"+idsector+"/edit", function (resultado) {
            $('#sector_descripcion').val(resultado.resultado.Descripcion); // cargamos la descripción del sector a editar
            $('.option_zona_sector').prop('selected',false); // deseleccioamos todas las zonas del combo
            $(`#cmb_zona_sector option[value="${resultado.resultado.zona.idzona}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
            $("#cmb_zona_sector").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_sector').val('PUT'); // decimo que sea un metodo put
        $('#frm_US_sector').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/sector/'+idsector); // actualizamos la ruta del formulario para actualizar
        $('#btn_sector_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_sectores').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina        
    }


    $('#btn_sector_cancelar').click(function(){
        $('#sector_descripcion').val(''); // limpiamos el input de descripción
        $('.option_zona_sector').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#cmb_zona_sector").trigger("chosen:updated"); // actualizamos el combo de zonas
        $('#method_sector').val('POST'); // decimo que sea un metodo put
        $('#frm_US_sector').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


// ============================ /METODOS PARA LA GESTIÓN DE SECTORES ==================================



// ============================ METODOS PARA LA GESTION DE CLAVES ASICIADAS ===========================

    function claves_asociadas_editar(idclaves_asociadas){

        $.get("/gestionSuelo/clavesAsociadas/"+idclaves_asociadas+"/edit", function (resultado) {
            $('#parte_clave').val(resultado.resultado.parte_clave); // cargamos la parte clave de la clave asociada a editar
            $('.option_sector_CA').prop('selected',false); // deseleccionamos todos los sectores para seleciconar uno nuevo
            $(`#cmb_sector_claves_asoc option[value="${resultado.resultado.sector.idsector}"]`).prop('selected',true); // seleccionamos el sector al que pertenece la clave asociada
            $("#cmb_sector_claves_asoc").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_claves_asiciadas').val('PUT'); // decimo que sea un metodo put
        $('#frm_clave_asociada').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/clavesAsociadas/'+idclaves_asociadas); // actualizamos la ruta del formulario para actualizar
        $('#btn_calves_asiciadas_cancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#administrador_claves_asociadas').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina
    }


    $('#btn_calves_asiciadas_cancelar').click(function(){
        $('#parte_clave').val(''); // limpiamos el input de parte clave
        $('.option_sector_CA').prop('selected',false); // deseleccionamos los sectores seleccionados
        $("#cmb_sector_claves_asoc").trigger("chosen:updated"); // actualizamos el combo de sectores
        $('#method_claves_asiciadas').val('POST'); // decimo que sea un metodo put
        $('#frm_clave_asociada').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });

// ============================ /METODOS PARA LA GESTION DE CLAVES ASICIADAS ===========================


    function cargarSector(){
        var idzona=$('#SelectZona').val();
        vistacargando('M',"Espere..."); // mostramos una ventana de carga
        $.get("/gestionSuelo/sector/"+idzona, function (data) {
            $('#SelecSector').html('');
            $.each(data.resultado,function(i,item){
                $('#SelecSector').append(`<option value="${item.idsector}">${item.Descripcion}</option>`);
            });
            $("#SelecSector").trigger("chosen:updated"); // actualizamos el combo de sector
            vistacargando(); // ocultamos la ventana de carga
        }).fail(function(erro){
            vistacargando(); // ocultamos la ventana de carga
        });
    }


    function sector_actividad_editar(idsector_actividad){
        vistacargando('M',"Espere..."); // mostramos una ventana de carga
        $.get("/gestionSuelo/sector_actividades/"+idsector_actividad+"/edit", function (data){

            // primero actualizamos el combo de sectores
            // cargamos los sectores a los que pertenece el sector_actividad a editar
            $('#SelecSector').html('<option value=""></option>');
            $.each(data.ListaSectores,function(i,item){
                $('#SelecSector').append(`<option class="option_sector_actividad" value="${item.idsector}">${item.Descripcion}</option>`);
            });
            $("#SelecSector").trigger("chosen:updated"); // actualizamos el combo de sector


            // SELECCIONAMOS CADA UNO DE LOS COMBOS CON LOS ID QUE RETORNA LA CONSULTA
            // deseleccionamos todos lo seleccionado en los combos
                $(".option_sector_actividad").prop("selected",false);

            // seleccionamos en el combo sector
                $(`#SelecSector option[value=${data.sector_actividad.idsector}]`).prop("selected",true);
                $(`#SelecSector`).trigger("chosen:updated"); // actualizamos el combo de sector
            // seleccionamos en el combo actividad
                $(`#SelectActividades option[value=${data.sector_actividad.idactividades}]`).prop("selected",true);
                $(`#SelectActividades`).trigger("chosen:updated"); // actualizamos el combo de actividades
            // seleccionamos en el combo uso
                $(`#SelecUso option[value=${data.sector_actividad.iduso}]`).prop("selected",true);
                $(`#SelecUso`).trigger("chosen:updated"); // actualizamos el combo de uso
            // seleccionamos en el combo tipo de uso
                $(`#SelectTipoUso option[value=${data.sector_actividad.idtipo_uso}]`).prop("selected",true);
                $(`#SelectTipoUso`).trigger("chosen:updated"); // actualizamos el combo de tipo uso
            

            // modificamos el action del formulario para que actualice
            $('#method_sector_actividades').val('PUT'); // decimo que sea un metodo put
            $('#frm_sector_actividades').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/sector_actividades/'+idsector_actividad); // actualizamos la ruta del formulario para actualizar
            $("#btn_gestionSectorActividadescancelar").removeClass("hidden"); // mostramos el boton de cancelar la edición
    
            $('html,body').animate({scrollTop:$('#administradorSectorActividades').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina

            vistacargando(); // ocultamos la ventana de carga
        }).fail(function(erro){
            vistacargando(); // ocultamos la ventana de carga
        });
    }

    $("#btn_gestionSectorActividadescancelar").click(function(){

        // deseleccionamos todos lo seleccionado en los combos
        $(".option_sector_actividad").prop("selected",false);
        $(".cmb_sector_actividad").trigger("chosen:updated"); // actualizamos todos los combos ya que todos los select tiene la clase "cmb_sector_actividad"

        // modificamos el action del formulario para que inserte
        $('#method_sector_actividades').val('POST'); // decimo que sea un metodo post
        $('#frm_sector_actividades').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/sector_actividades'); // actualizamos la ruta del formulario para INSERTAR
        $(this).addClass("hidden"); // ocultamos el boton de cancelar la edición    

    });


    
//################GESTION ZONA#########################################################################

//EDITAR LA ZONA
function zona_editar(idzona){

    $.get("/gestionSuelo/zona/"+idzona+"/edit", function (data) {
        $('#descripcion_zona').val(data.resultado.Descripcion);
        $('#method_Zona').val('PUT'); // decimo que sea un metodo put
	    $('#frm_Zona').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/zona/'+idzona);
	    $('#btn_gestionZonacancelar').removeClass('hidden');
	    $('html,body').animate({scrollTop:$('#administradorZona').offset().top},400);
    }).fail(function(error){
        alert("Error al ejecutar la petición");
    });
    
}

//ACCION DEL BOTON DE CANCELAR EN ZONA
$('#btn_gestionZonacancelar').click(function(){
    $('#descripcion_zona').val('');
    $('#method_Zona').val('POST'); // decimos que sea un metodo put
    $('#frm_Zona').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/zona/');
    $(this).addClass('hidden');
});
//######################################################################################################

//################GESTION USO#########################################################################

//EDITAR EL USO
function uso_editar(iduso){

    $.get("/gestionSuelo/uso/"+iduso+"/edit", function (data) {
        $('#descripcion_uso').val(data.resultado.Descripcion);
        $('#method_Uso').val('PUT'); // decimo que sea un metodo put
	    $('#frm_Uso').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/uso/'+iduso);
	    $('#btn_gestionUsocancelar').removeClass('hidden');
	    $('html,body').animate({scrollTop:$('#administradorUso').offset().top},400);
    }).fail(function(error){
        alert("Error al ejecutar la petición");
    });
    
}

//ACCION DEL BOTON DE CANCELAR EN ZONA
$('#btn_gestionUsocancelar').click(function(){
    $('#descripcion_uso').val('');
    $('#method_Uso').val('POST'); // decimos que sea un metodo put
    $('#frm_Uso').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/uso/');
    $(this).addClass('hidden');
});
//######################################################################################################


//################GESTION TIPO DE USO#########################################################################

//EDITAR EL USO
function tipo_uso_editar(idtipouso){

    $.get("/gestionSuelo/tipo_uso/"+idtipouso+"/edit", function (data) {
        $('#descripcion_TipoUso').val(data.resultado.Descripcion);
        $('#method_TipoUso').val('PUT'); // decimo que sea un metodo put
	    $('#frm_TipoUso').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/tipo_uso/'+idtipouso);
	    $('#btn_gestionTipoUsocancelar').removeClass('hidden');
	    $('html,body').animate({scrollTop:$('#administradorTipoUso').offset().top},400);
    }).fail(function(error){
        alert("Error al ejecutar la petición");
    });
    
}

//ACCION DEL BOTON DE CANCELAR EN ZONA
$('#btn_gestionTipoUsocancelar').click(function(){
    $('#descripcion_TipoUso').val('');
    $('#method_TipoUso').val('POST'); // decimos que sea un metodo put
    $('#frm_TipoUso').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/tipo_uso/');
    $(this).addClass('hidden');
});
//######################################################################################################


//################GESTION ACTIVIDADES #########################################################################

//EDITAR EL USO
function actividades_editar(idactividades){

    vistacargando('M',"Espere..."); // mostramos una ventana de carga
    $.get("/gestionSuelo/actividades/"+idactividades+"/edit", function (data) {
        $('#descripcion_Actividades').val(data.resultado.Descripcion);
        $('#detalle_Actividades').val(data.resultado.Detalle);
        $('#detalle_ActividadesBom').val(data.resultado.actividad_cuerpobombero);
        $('#valor1').val(data.resultado.valor1);
        $('#valor2').val(data.resultado.valor2);
        $('#valor3').val(data.resultado.valor3);
        $('#method_Actividades').val('PUT'); // decimo que sea un metodo put
	    $('#frm_Actividades').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/actividades/'+idactividades);
	    $('#btn_gestionActividadescancelar').removeClass('hidden');
        $('html,body').animate({scrollTop:$('#administradorActividades').offset().top},400);

        vistacargando(); // ocultamos una ventana de carga
    }).fail(function(error){
        vistacargando(); // ocultamos una ventana de carga
        alert("Error al ejecutar la petición");
    });
    
}

//ACCION DEL BOTON DE CANCELAR EN ZONA
$('#btn_gestionActividadescancelar').click(function(){
    $('#descripcion_Actividades').val('');
    $('#detalle_Actividades').val('');
    $('#detalle_ActividadesBom').val('');
    $('#valor1').val('');
    $('#valor2').val('');
    $('#valor3').val('');
    $('#method_Actividades').val('POST'); // decimos que sea un metodo put
    $('#frm_Actividades').prop('action',window.location.protocol+'//'+window.location.host+'/gestionSuelo/actividades/');
    $(this).addClass('hidden');
});
//######################################################################################################


