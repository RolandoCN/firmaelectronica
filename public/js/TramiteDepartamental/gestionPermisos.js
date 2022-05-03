$(document).ready(function(){
    cargarContenidoTablas('idtablamenu');
});


function cargarContenidoTablas(tabla) {
    $(`#${tabla}`).DataTable( {
        "language": {
            "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                        '<option value="5">5</option>'+
                        '<option value="10">10</option>'+
                        '<option value="20">20</option>'+
                        '<option value="30">30</option>'+
                        '<option value="40">40</option>'+
                        '<option value="-1">Todos</option>'+
                        '</select> registros',
            "search": "Buscar:",
            "zeroRecords": "No se encontraron registros coincidentes",
            "infoEmpty": "No hay registros para mostrar",
            "infoFiltered": " - filtrado de _MAX_ registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
        }
    }
} );
}


// GESTION DE MENU

function menu_editar(idmenu){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestionMenu/"+idmenu+"/edit", function (data) {
        $('#nombre_menu').val(data.nombremenu);
        $('#icon_menu').val(data.icono);
        $('#icon_menu_btn').html(`<i class="${data.icono}"></i>`);

        vistacargando(); // oculatamos la vista de carga
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_menu').val('PUT'); // decimo que sea un metodo put
    $('#frm_menu').prop('action',window.location.protocol+'//'+window.location.host+'/gestionMenu/'+idmenu);
    $('#btn_gestionmenucancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}

$('#btn_gestionmenucancelar').click(function(){
    $('#nombre_menu').val('');
    $('#icon_menu').val('fa fa-circle-o');
    $('#icon_menu_btn').html(`<i class="fa fa-circle-o"></i>`);

    $('#method_menu').val('POST'); // decimo que sea un metodo put
    $('#frm_menu').prop('action',window.location.protocol+'//'+window.location.host+'/gestionMenu/');
    $(this).addClass('hidden');

});

// GESTION DE GESTIONES XD

function gestion_editar(idgestion){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestionGestion/"+idgestion+"/edit", function (data) {
        $('#nombre_gestion').val(data.nombregestion);
        $('#ruta_gestion').val(data.ruta);
        $('#icon_gestion').val(data.icono);
        $('#icono_gestione_btn').html(`<i class="${data.icono}"></i>`);
        
        $('.gestion_selec_menu').attr("selected", false); // quitamos el selected a los seleccionados anteriormente
        $(`#gestion_selec_menu option[value="${data.idmenu}"]`).attr("selected", true);
        $('#gestion_selec_menu_chosen').children('a').children('span').html($(`#gestion_selec_menu option[value="${data.idmenu}"]`).html());

        vistacargando(); // ocultamos la ventana de espera
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_gestion').val('PUT'); // decimo que sea un metodo put
    $('#frm_gestion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionGestion/'+idgestion);
    $('#btn_gestiongestioncancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}

$('#btn_gestiongestioncancelar').click(function(){
    $('#nombre_gestion').val('');
    $('#ruta_gestion').val('');
    $('#icon_gestion').val('fa fa-circle-o');
    $('#icono_gestione_btn').html(`<i class="fa fa-circle-o"></i>`);

    $('.gestion_selec_menu').attr("selected", false); // quitamos el selected a los seleccionados anteriormente
    $('#gestion_selec_menu_chosen').children('a').children('span').html('Seleccione un menú');

    $('#method_gestion').val('POST'); // decimo que sea un metodo put
    $('#frm_gestion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionGestion/');
    $(this).addClass('hidden');
});

// ESTION DE TIPO DE FUNCIONARIO PUBLICO

function tipoFP_editar(idtipoFP){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("gestionTipoFP/"+idtipoFP+"/edit", function (data) {
        $('#nombre_tipoFP').val(data.descripcion);
        vistacargando(); // ocultamos la ventana de espera
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_tipoFP').val('PUT'); // decimo que sea un metodo put
    $('#frm_tipoFP').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoFP/'+idtipoFP);
    $('#btn_gestiontipoFPcancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}


$('#btn_gestiontipoFPcancelar').click(function(){
    $('#nombre_tipoFP').val('');

    $('#method_tipoFP').val('POST'); // decimo que sea un metodo put
    $('#frm_tipoFP').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoFP');
    $(this).addClass('hidden');
});


// GESTION DE ASIGNACION DE GESTION A UN TIPO  FP

function asignarGestion_editar(idtipoFP_gestion){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("asignarGestionTipo/"+idtipoFP_gestion+"/edit", function (data) {
        console.log(data);
   
        $('.opcion_tipoFP').attr("selected", false);
        $(`#AGTFP_tipousuario option[value="${data.idtipoFP}"]`).attr("selected", true);
        $('#AGTFP_tipousuario_chosen').children('a').children('span').html($(`#AGTFP_tipousuario option[value="${data.idtipoFP}"]`).html());

        $('.opcion_gestion').attr("selected", false);
        $(`#AGTFP_gestion option[value="${data.idgestion}"]`).attr("selected", true);
        $('#AGTFP_gestion_chosen').children('a').children('span').html($(`#AGTFP_gestion option[value="${data.idgestion}"]`).html());

        vistacargando(); // ocultamos la ventana de espera
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#method_asignarGestion').val('PUT'); // decimo que sea un metodo put
    $('#frm_asignarGestion').prop('action',window.location.protocol+'//'+window.location.host+'/asignarGestionTipo/'+idtipoFP_gestion);
    $('#btn_gestionasignargestioncancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}


$('#btn_gestionasignargestioncancelar').click(function(){
    $('.opcion_tipoFP').attr("selected", false);
    $('#AGTFP_tipousuario_chosen').children('a').children('span').html('Seleccione un tipo de usuario');

    $('.opcion_gestion').attr("selected", false);
    $('#AGTFP_gestion_chosen').children('a').children('span').html('Seleccione una gestión');

    $('#method_asignarGestion').val('POST'); // decimo que sea un metodo put
    $('#frm_asignarGestion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoFP');
    $(this).addClass('hidden');
});


// GESTION PARA ASIGNAR TIPO DE USUARIO A FUNCIONARIO
function asignarTipoFP_editar(idusuarioAsignar){
    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.get("asignarTipoFPFuncionarioMostrar/"+idusuarioAsignar, function (data) {

        $('#ciu_seleccionado').html(data.funcionario.ciu);
        $('#cedula_seleccionada').html(data.funcionario.cedula);
        $('#nombre_seleccionado').html(data.funcionario.name);
        $('#email_seleccionado').html(data.funcionario.email);

        console.clear(); console.log(data);

        // mostramos formulario para agregar mas tipos fp
        $('#frm_contenedor_asignarTipo').show(300);
        

        // CARGAMOS LOS TIPOSFP EN EL COMBO  ATFP_tipoFP
        // recorremos cada uno de los tiposfp que retorna la consulta

        var contenedor = ""; // variable para almacenar le HTML de los option a agregar
        $.each(data.listaTipoFP,function(i,tipoFP){
            contenedor = contenedor+`<option class="opcionATFP_tipoFP" value="${tipoFP.idtipoFP}">${tipoFP.descripcion}</option>`;
        });

        // cargamos el select con las nueva lista de tiposFP
        $('#div_ATFP_tipoFP').html(`
            <select data-placeholder="Seleccione una tipo de usuario" name="ATFP_tipoFP" id="ATFP_tipoFP" required="required" class="chosen-select form-control" tabindex="5">
                <option value=""></option>
                ${contenedor}
            </select>
        `);

        $('.chosen-select').chosen(); // recargamos los estilos y contenido de los combos

        //CARGAMOS LA TABLA CON TODOS LOS TIPOSFP ASIGNADOS AL USUARIO SELECCIONADO

        // preparamos el div que contiene el listado de tipos asignados para mostrarlo en caso de existir tipos agregados
        $('#div_tipoUsuariosAsignados').hide();
        $('#div_tipoUsuariosAsignados').removeClass('hidden');

        $("#tb_tipoUsuarioAsignados").html(""); // primero limpiamos la tabla
        $.each(data.tipoFP_asignados,function(i,tipoFPasigando){
            $('#div_tipoUsuariosAsignados').show(300); // si existen tipos asignados mostramos el div
            var textJefeSecre = "";
            if(tipoFPasigando.jefe_departamento==1){
                textJefeSecre = "Jefe";
            }else if(tipoFPasigando.secre_departamento==1){
                textJefeSecre = "Secretario(a)";
            }

            $("#tb_tipoUsuarioAsignados").append(`
                <tr class="even pointer">
                    <td class="a-center "><center>${i+1}</center></td>
                    <td class="">${tipoFPasigando.tipofp.descripcion}</td>
                    <td class="">${tipoFPasigando.departamento.nombre}</td>
                    <td class="">${textJefeSecre}</td>
                    <td class="">
                        <form method="POST" class="frm_eliminarAsigancionTipoFP nosubmit" onsubmit="return eliminarTipoFPAsignado(this)" action="${window.location.protocol+'//'+window.location.host}/eliminarTipoFPFuncionario/${tipoFPasigando.idus001_tipofp}"  enctype="multipart/form-data">
                            ${data.token}    
                            <input type="hidden" name="_method" value="DELETE">
                            <button class="btn btn-outline-danger btn-sm" style="margin-bottom: 0 !important;">
                                <i class="fa fa-trash"></i> Eliminar
                            </button>
                        </form>
                    </td>
                </tr>
            `);
        });
        
        vistacargando(); // ocultamos la ventana de espera
    }).fail(function(){
        // si ocurre un error
        vistacargando(); // ocultamos la vista de carga
        alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
    });

    $('#ATFP_idusuario').val(idusuarioAsignar);
    $('#btn_gestionasignarTipoFPcancelar').removeClass('hidden');

    $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
}

function eliminarTipoFPAsignado(form){
    // por defecto su tiene la clase no dejamos que se ejecute el submit del formulario que elimina
    if($(form).hasClass("nosubmit")){
        // preguntamos si quiere eliminar (ejecutar el submit del frm)
        swal({
            title: "",
            text: "¿Esta seguro que quiere eliminar la asignación?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, eliminalo!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que quiere eliminar
                sweetAlert.close(); // ocultamos la ventana de pregunta
                $(form).removeClass("nosubmit"); // quitamos la clase para se ejecute el acion de forma normal
                $(form).submit(); // ejecutamos evento submit del formulario
            } else {
                sweetAlert.close();   // ocultamos la ventana de pregunta
            }
        }); 
        return false;  // evitamos que se ejecute el evento submit    
    }

}



$('#btn_gestionasignarTipoFPcancelar').click(function(){

    $('#frm_contenedor_asignarTipo').hide(300);
    $('#div_tipoUsuariosAsignados').hide(300);
    $('#ciu_seleccionado').html('No seleccionado');
    $('#cedula_seleccionada').html('No seleccionado');
    $('#nombre_seleccionado').html('No seleccionado');
    $('#email_seleccionado').html('No seleccionado');

    $('.opcionATFP_tipoFP').attr("selected", false); 
    $('#ATFP_tipousuario_chosen').children('a').children('span').html('Seleccione un tipo de usuario');
    $('#ATFP_idusuario').val('');
    $('#btn_gestionasignarTipoFPcancelar').addClass('hidden');
});


// esta funcionar sirve para todas las tablas del menu
function btn_eliminar(btn){

    swal({
        title: "",
        text: "¿Quiere eliminar el registro?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminalo!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que quiere eliminar
            sweetAlert.close(); // ocultamos la ventana de pregunta
            $(btn).parent('.frm_eliminar').submit();
        } else {
            sweetAlert.close();   // ocultamos la ventana de pregunta
        }
    }); 
    
}

// evento para los botones de seleccionar icono

$('.buttonIconoSeleccionado').click(function(){
    $('#modalSeleccionarIcono').modal('show');
    // obtenemos y guardamos el id del boton que llama la ventana modal de iconos
    $('#idButtonSeleccionado').val($(this)[0].id);
    $('#idInputSeleccionado').val($(this).siblings('input')[0].id);
});

$('#contenedor_iconos')
.children('section')
.children('div')
.children('div')
.children('a')
.click(function(){
    var icono = $(this).children('i').prop('class');
    //$('#idButtonSeleccionado').ht
    $(`#${$('#idButtonSeleccionado').val()}`).html(`<i class="${icono}"></i>`); 
    $(`#${$('#idInputSeleccionado').val()}`).val(icono); // asignamos el nombre del icono seleccioando
    $('#modalSeleccionarIcono').modal('hide');
});


$('.buscarIcono').keyup(function(e){
    var buscar=$(this).val();
    $('#contenedor_iconos section').each(function (s, section) {
        var totalIconos=0;
        var iconosOcultos=0;
        $(section).children('div').each(function (d1, div1) {
            $(div1).children('div').each(function (d2, div2) {
                textoicono=$(div2).children('a').html();
                if(textoicono.indexOf(buscar)>-1){
                    $(div2).show();
                }else{
                    $(div2).hide();
                    iconosOcultos++;
                }
                totalIconos++;
            });
        });
        if(iconosOcultos==totalIconos){
            $(section).hide();
        }else{
            $(section).show();
        }
    });  
});
