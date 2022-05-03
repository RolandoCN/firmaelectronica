
    var lenguajeTabla = {
        "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                    '<option value="5">5</option>'+
                    '<option value="10">10</option>'+
                    '<option value="20">20</option>'+
                    '<option value="30">30</option>'+
                    '<option value="40">40</option>'+
                    '<option value="-1">Todos</option>'+
                    '</select> registros',
        "search": "Buscar:",
        "searchPlaceholder": "Ingrese un criterio de busqueda",
        "zeroRecords": "No se encontraron registros coincidentes",
        "infoEmpty": "No hay registros para mostrar",
        "infoFiltered": " - filtrado de MAX registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        }
    };

    $(document).ready(function () {
        cargar_estilos_tabla('tabla_departamentos');
    });

    function cargar_estilos_tabla(idtabla){        
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 2, "desc" ]],
            pageLength: 10,
            sInfoFiltered:false,
            "language": lenguajeTabla
        });

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
    }


    // función para filtrar los departamentos por el id del periodo seleccionado
    $('#gd_filtrarDepartamentoOrganigrama').change(function(){
        // obtenemos el id del periodo seleccionado
        var idperido=this.value;
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`filtrarDepartamentosPorPeriodo/${idperido}`,function(request){
            dibujarOrgamigrama(request);
            onWindowResize(); // hacemos que se refresque el diagrama
            vistacargando(); // ocultamos la vista de carga
        }).fail(function(){
            // si ocurre un error
            vistacargando(); // ocultamos la vista de carga
            alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
        });
        
    });


    // evento al dar click en el boton editar del organigrama

    function clickInfo(btn){        
        var iddepartamento=$(btn)[0].id;
        editar_departamento(iddepartamento);
    }

    function editar_departamento(iddepartamento){
        
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get(`/departamentos/gestion/${iddepartamento}/edit`,function(departamento){
            
            //mostramos los datos del departamento
            $("#gd_nombre").val(departamento.nombre);
            $("#gd_codcabildo").val(departamento.codCabildo);
            $("#gd_abreviacion").val(departamento.abreviacion);
            $("#gd_nivel").val(departamento.nivel);
            $("#gd_correo").val(departamento.correo);
            $("#gd_programa").val(departamento.programa);

            if(departamento.departamento_aprueba_poa==1){
                $("#check_aprueba_poa").iCheck("check");
            }else{
                $("#check_aprueba_poa").iCheck("uncheck");
            }

            if(departamento.tramite_externo==1){
                $("#check_tramite_externo").iCheck("check");
            }else{
                $("#check_tramite_externo").iCheck("uncheck");
            }

            if(departamento.cambio_documento==1){
                $("#check_cambio_documento").iCheck("check");
            }else{
                $("#check_cambio_documento").iCheck("uncheck");
            }

            if(departamento.bodega_general==1){
                $("#check_bodega_general").iCheck("check");
            }else{
                $("#check_bodega_general").iCheck("uncheck");
            }

            if(departamento.admin_contrato==1){
                $("#check_administrador_contrato").iCheck("check");
            }else{
                $("#check_administrador_contrato").iCheck("uncheck");
            }
            
            if(departamento.global==1){
                $("#check_dep_global").iCheck("check");
            }else{
                $("#check_dep_global").iCheck("uncheck");
            }

            // seleccionamos el combo de departamentos padre
            //cargamos los departamentos padres en el combo en funciona al periodo que viene en la consulta
            recargar_combo_departamentopadre(departamento.idperiodo,departamento.iddepartamento_padre);
            
            // $('.gd_select_departamento_padre').attr("selected", false); // deseleccionamos la opcion que esta seleccionada
            // $(`#gd_select_departamento_padre option[value="${departamento.iddepartamento_padre}"]`).attr("selected", true);
            // $('#gd_select_departamento_padre_chosen').children('a').children('span').html("Seleccione un departamento");
            // $('#gd_select_departamento_padre_chosen').children('a').children('span').html($(`#gd_select_departamento_padre option[value="${departamento.iddepartamento_padre}"]`).html());


            // seleccionamos el combo de periodo
            $('.gd_select_periodo').attr("selected", false); // deseleccionamos la opcion que esta seleccionada
            $(`#gd_select_periodo option[value="${departamento.idperiodo}"]`).prop("selected", true);
            $('#gd_select_periodo_chosen').children('a').children('span').html("Seleccione un periodo");
            $('#gd_select_periodo_chosen').children('a').children('span').html($(`#gd_select_periodo option[value="${departamento.idperiodo}"]`).html());

            //editamos la ruta del formulario de ingreso
            $('#method_departamento').val('PUT'); // decimo que sea un metodo put
            $('#frm_departamento_gestion').prop('action',window.location.protocol+'//'+window.location.host+'/departamentos/gestion/'+departamento.iddepartamento);
            
            //editamos la ruta del formulario de eliminacion
            $('#frm_departamento_gestion_eliminar').prop('action',window.location.protocol+'//'+window.location.host+'/departamentos/gestion/'+departamento.iddepartamento);

            //editamos la vista de los botones del formulario de ingreso
            $('#btn_departamento_cancelar').removeClass('hidden');
            $('#btn_departamento_eliminar').removeClass('hidden');
            $('#btn_departamento_guardar').html("<i class='fa fa-thumbs-up'></i> Guardar");

            // redireccionar la ventana al formulario
            $('html,body').animate({scrollTop:$('#administador_departamentos').offset().top},400);
            vistacargando(); // ocultamos la vista de carga
        }).fail(function(e){
            // si ocurre un error
            vistacargando(); // ocultamos la vista de carga
            alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
        });

    }


    $('#btn_departamento_cancelar').click(function(){

        //limpiamos los input del formulario
        $("#gd_nombre").val("");
        $("#gd_codcabildo").val("");
        $("#gd_abreviacion").val("");
        $("#gd_nivel").val("");
        $("#gd_correo").val("");
        $("#gd_programa").val("");
        $("#check_aprueba_poa").iCheck("uncheck");
        $("#check_cambio_documento").iCheck("uncheck");
        $("#check_tramite_externo").iCheck("uncheck");
        $("#check_bodega_general").iCheck("uncheck");
        $("#check_dep_global").iCheck("uncheck");
    
        //deseleccionamos el combo de departamento padre
        $('.gd_select_departamento_padre').attr("selected", false); // quitamos el departamento seleccionados anteriormente
        $('#gd_select_departamento_padre_chosen').children('a').children('span').html('Seleccione un departamento');
        
        //deseleccionamos el combo de periodos
        $('.gd_select_periodo').attr("selected", false); // quitamos el periodo seleccionados anteriormente
        $('#gd_select_periodo_chosen').children('a').children('span').html('Seleccione un periodo');

        //reiniciamos la ruta y metodo del formulario de registro
        $('#method_departamento').val('POST'); // decimo que sea un metodo put
        $('#frm_departamento_gestion').prop('action',window.location.protocol+'//'+window.location.host+'/departamentos/gestion');
        
        //limpiamos la ruta del formulario de eliminacion
        $('#frm_departamento_gestion_eliminar').prop('action',"");
        
        //reiniciamos los botones del formulacio
        $(this).addClass('hidden');
        $('#btn_departamento_eliminar').addClass('hidden');
        $('#btn_departamento_guardar').html("<i class='fa fa-cloud-upload'></i> Registrar");

    });

    // EVENTO DEL BOTON ELIMINAR DEPARTAMENTO
    $("#btn_departamento_eliminar").click(function(e){

        // preguntamos al usuario si quiere eliminar el departamento
        if(confirm("Esta seguro que desea eliminar el departamento")){
            $("#frm_departamento_gestion_eliminar").submit(); // ejecutamos el formulario de eliminar departamento
        }
        
    });

    // EVENTO PARA FILTRAR LOS DEPARTAMENTOS DEPENDIENDO DEL PERIODO SELECCIONADO

    // codigo no terminado
    $("#gd_select_periodo").change(function(e){
        var idperiodo_seleccionado=$(this).val();

        // enviamos cero porque no queremos que seleccione ningun departamento
        recargar_combo_departamentopadre(idperiodo_seleccionado,0);
    });


    function recargar_combo_departamentopadre(idperiodo_filtrado,iddepartamento_seleccionar) {
        var contenido="";
        $.get(`filtrarDepartamentosPorPeriodo/${idperiodo_filtrado}`,function(departamentos){
            $.each(departamentos,function(i,departamento){
                var seleccionar="";
                if(departamento.iddepartamento==iddepartamento_seleccionar){
                    seleccionar="selected";
                }
                contenido=contenido+`<option ${seleccionar} class="gd_select_departamento_padre" value="${departamento.iddepartamento}">${departamento.nombre}</option>`;
            });

            $("#conten_select_departamento_padre").html(`
                <div class="chosen-select-conten">
                    <select data-placeholder="Seleccione un departamento"  name="gd_select_departamento_padre" id="gd_select_departamento_padre" class="chosen-select form-control" tabindex="5">        
                        <option class="gd_select_departamento_padre" value="">Seleccione un departamento</option>
                        ${contenido}
                    </select>
                </div>
            `);
            $('.chosen-select').chosen();
        });     
    }

//==================================================





//========= FUNCIONES PARA ACTIVIDADES ==============


// metodo para editar una actividad de un departamento
function editar_actividad(idactividad){

    vistacargando("M", "Espere..");
    //mostramos la informacion de la actividad selecionada
    $.get(`/departamentos/actividad/${idactividad}/edit`,function(retorno){
     
        vistacargando();

        $(".combos_actividad").hide(500); // ocultamos los combos de periodo y el de departamento
        $("#btn_agregar_actividad").hide(500); // ocultamos el boton de agregar actividad
        $("#ga_actividad").removeClass("componentLeft"); // hacemos mas grante el textarea de actividad
    
        //mostramos los botones de edicion
        $("#btn_actividad_cancelar").removeClass("hidden");
        $("#btn_actividad_eliminar").removeClass("hidden");
        $("#btn_actividad_guardar").html("<i class='fa fa-thumbs-up'></i> Guardar");

        $("#ga_actividad").val(retorno.obj_actividad.descripcion);        
        $("#contet_usuarios_asignados").show();

        //mostramos el check de activida principal
        $("#content_check_principal").show();
        $("#check_principal").iCheck('uncheck');
        if(retorno.obj_actividad.principal == 1){
            $("#check_principal").iCheck('check');
        }

        //cargamos el combo de usuarios del departamento
        $("#gd_select_usuario").html("");
        $.each(retorno.lista_usuarios, function (i, user) { 
            $("#gd_select_usuario").append(`
                <option value="${user.idus001_encrypt}">${user.name}</option>
            `);
            $("#gd_select_usuario").trigger("chosen:updated");
        });

        //cargamos la tabla de funcionarios
        cargar_tabla_usuarios(retorno.lista_usuarios_asig);

    }).fail(function(){
        vistacargando();
    });

    //modificamos la ruta de los formulario para modificar o eliminar una actividad
    $('#method_actividad').val('PUT'); // decimo que sea un metodo put para modificar la actividad
    $('#frm_actividad_gestion').prop("action",window.location.protocol+'//'+window.location.host+"/departamentos/actividad/"+idactividad);
    $("#input_idactividad").val(idactividad);

    //modificamos la ruta del formularion de eliminacion de un departamento para que coincida con el seleccionado
    $("#frm_actividad_eliminar").prop("action",window.location.protocol+'//'+window.location.host+"/departamentos/actividad/"+idactividad);

    //cargamos la tabla de usuarios asignados a actividades

}


// evento para cancelar una edicion de una actividad
$("#btn_actividad_cancelar").click(function(){
    $(".combos_actividad").show(500); // mostramos los combos de periodo y el de departamento
    $("#btn_agregar_actividad").show(500); // mostramos el boton de agregar actividad
    $("#ga_actividad").addClass("componentLeft"); // hacemos mas grante el textarea regrese a la normalidad

    //ocultamos los botones de edicion
    $("#btn_actividad_cancelar").addClass("hidden");
    $("#btn_actividad_eliminar").addClass("hidden");
    $("#btn_actividad_guardar").html("<i class='fa fa-cloud-upload'></i> Registrar");

    //modificamos la ruta de los formulario para se guerden nuevas actividades
    $('#method_actividad').val('POST'); // decimo que sea un metodo post para guardar actividad
    $('#frm_actividad_gestion').prop('action',window.location.protocol+'//'+window.location.host+'/departamentos/actividad');

    $('#ga_actividad').val("");

    //reiniciamo el action del formulario de eliminacion de actividad
    $("#frm_actividad_eliminar").prop("action","");

    $("#contet_usuarios_asignados").hide();
    $("#input_idactividad").val("");

    //ocultamos el check de activida principal
    $("#content_check_principal").hide();

});


// metodo para ejecutar formulario de eliminacin de una actividad
$("#btn_actividad_eliminar").click(function(){
        // preguntamos al usuario si quiere eliminar la actividad
        if(confirm("Esta seguro que desea eliminar la actividad")){
            $("#frm_actividad_eliminar").submit(); // ejecutamos el formulario de eliminar actividad
        }
});

$("#gd_select_cmd_periodo").change(function(e){
    var idperiodo_seleccionado=$(this).val();

    // enviamos cero porque no queremos que seleccione ningun departamento
    recargar_combo_seleccionar_departamento(idperiodo_seleccionado,0)
});


function recargar_combo_seleccionar_departamento(idperiodo_filtrado,iddepartamento_seleccionar) {
    var contenido="";
    $.get(`filtrarDepartamentosPorPeriodo/${idperiodo_filtrado}`,function(departamentos){
        $.each(departamentos,function(i,departamento){
            var seleccionar="";
            if(departamento.iddepartamento==iddepartamento_seleccionar){
                seleccionar="selected";
            }
            contenido=contenido+`<option ${seleccionar} class="gd_select_cmb_departamento" value="${departamento.iddepartamento}">${departamento.nombre}</option>`;
        });

        $("#conten_select_cmb_departamento").html(`
            <div class="chosen-select-conten">
                <select data-placeholder="Seleccione un departamento" onchange="filtrar_actividades_por_departamento(this)" name="gd_select_cmb_departamento" id="gd_select_cmb_departamento" class="chosen-select form-control" tabindex="5">        
                    <option class="gd_select_cmb_departamento" value="">Seleccione un departamento</option>
                    ${contenido}
                </select>
            </div>
        `);
        $('.chosen-select').chosen();
    });     
}

function filtrar_actividades_por_departamento(cmb_departamento){

    //limpiamos todas las actividades mostradas
    $("#ul_lista_actividades").html("");
    $("#msj_no_actividad").removeClass("hidden"); // mostramos el mensajito de que no hay actividad
    if($(cmb_departamento).val()==""){return;}   
    vistacargando('M','Espere...'); // mostramos la ventana de espera

    $.get("filtrarActividadPorDepartamento/"+$(cmb_departamento).val(), function(lista_actividades){
        
        $.each(lista_actividades, function (a, actividad) { 
            $("#msj_no_actividad").addClass("hidden"); // quitamos el mensajito de que no hay actividad
             // cargamos la lista de actividades(li) al ul 
             var principal = "";
             if(actividad.principal == 1){ principal = (`<span class="label label-warning pull-left" style="margin: 2px 5px 0px 0px; font-size: 11px;">Principal</span>`); }
             $("#ul_lista_actividades").append(`
                <li>
                    <div class="block" style="margin: 0 0 0 120px;">
                    <div class="tags" style="width: auto;">
                        <a href="#administador_actividad" onclick="editar_actividad(${actividad.idactividad})" class="tag">
                            <span>Actividad #${a+1}</span>
                        </a>
                    </div>
                    <div class="block_content">
                        <h2 class="title">
                            <a>${principal} ${actividad.descripcion}</a>
                        </h2>
                        <div class="byline"></div>
                        <p class="excerpt">
                            Departamento: ${actividad.departamento.nombre}
                        </p>
                    </div>
                    </div>
                    
                </li>
             `);
        });
        
        vistacargando(); // quitamos la ventana de espera        
    }).fail(function(){
        alert('No se pude ejecutar la peticion al servidor');
        vistacargando(); // quitamos la ventana de espera  
    });


}


// evento para quitar una actividad agregada

function agregar_actividad() {

    //obtenemos la descripcion de la actividad desde el texarea
    var actividad = $('#ga_actividad').val();

    //validamos que le textarea no esté vacio
    if(actividad==""){
         new PNotify({
                title: 'Mensaje de Información',
                text: "Ingrese una descripción a la actividad",
                type: "default",
                hide: true,
                delay: 2000,
                styling: 'bootstrap3',
                addclass: ''
            });
        return; // no agregamos la actividad
    }

    // si el contenedor de actividades esta oculto lo mostramos
    if($('#conten_actividades_sin_guardar').hasClass('hidden') || $('#conten_actividades_sin_guardar').is(':hidden')){
        // quidamos la clase hidden que oculta por defecto el contenedor de actividades
        $('#conten_actividades_sin_guardar').removeClass('hidden');
        //coultamos y mostramos con animacion
        $('#conten_actividades_sin_guardar').hide();
        $('#conten_actividades_sin_guardar').show(200);
    }



    //agregamos un alert con una visualizacion de la actividad agregada
    $('#conten_add_actividades').append(`
        <div class="alert alert-info alert-dismissible fade in" role="alert" style="margin-bottom: 5px;">
            <button type="button" class="close"  data-dismiss="alert" ><span aria-hidden="true">×</span>
            </button>
            <strong>Actividad!</strong> ${actividad}
            <input type="hidden" name="input_actividad[]" value="${actividad}">
        </div>
    `);

    // limpiamos el textarea de la actividad
    $('#ga_actividad').val("");
}

// funciona para cargar los usuarios agregados

    function cargar_tabla_usuarios(lista_usuarios_asig){
        //cargamos la tabla de funcionarios
        $("#tabla_usuarios_asignados").DataTable().destroy();
        $('#tabla_usuarios_asignados tbody').empty();

        $.each(lista_usuarios_asig, function (i, act_us001) { 
            $('#tabla_usuarios_asignados tbody').append(`
                <tr>
                    <td>${i+1}</td>
                    <td><span style="user-select: all;">${act_us001.us001.cedula}</span></td>
                    <td>${act_us001.us001.name}</td>
                    <td><span style="user-select: all;">${act_us001.us001.email}</span></td>
                    <td><button class="btn btn-xs btn-danger" onclick="quitar_usuario('${act_us001.idactividad_us001_encrypt}')"> <i class="fa fa-chain-broken"></i> Eliminar</button></td>
                </tr>
            `);
        });

        cargar_estilos_tabla('tabla_usuarios_asignados');
    }


//funciona para agregar un usuario a una actividad

    $('#frm_agregar_usuario').submit(function(e){
        
        e.preventDefault();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var formulario = this;
        var FrmData = new FormData(formulario);
        var btn_submit = $(formulario).find('[type=submit]');
        var txt_submit = $(btn_submit).html();
        $(formulario).addClass('disabled_content');
        $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);
        
        $.ajax({
            url: `/departamentos/actividad/agregarUsuario`,
            method: "POST",
            data: FrmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(retorno){
                // si es completado
                $(formulario).removeClass('disabled_content');
                $(btn_submit).html(txt_submit);

                alertNotificar(retorno.mensaje, retorno.status);                            
                if(!retorno.error){                                                                          
                    cargar_tabla_usuarios(retorno.lista_usuarios_asig);
                }
            },
            error: function(error){
                $(formulario).removeClass('disabled_content');
                $(btn_submit).html(txt_submit);
                alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");                    
            }
        }); 

    });

//funcion para quitar un usuario asignado
    function quitar_usuario(idactividad_us001_encrypt){
        swal({
            title: "",
            text: "¿Está seguro que desea quitar el usuario?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            cancelButtonClass: "btn-danger",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que si

                vistacargando("M",'Espere...');
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
            
                $.ajax({
                    type: "DELETE",
                    url: '/departamentos/actividad/quitarUsuario/'+idactividad_us001_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            cargar_tabla_usuarios(retorno.lista_usuarios_asig);
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo quitar el usuario, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    }


// proviene del evento "onmouseup" que se ejecuta cuando se suelta el boton al dar
// click izquierdo con el mouse sobre un elemento en concreto
// en este caso se usa para comprobar cuando se elimina una actividad

function comprobar_numero_actividades(contenedor){
    // esperamos unos segundos para que se elimine la actividad
    setTimeout(function(){
        // preguntamos si no hay actividades
        if($(contenedor).find('div').length==0){
            //ocultamos el contenedor de actividades
            $('#conten_actividades_sin_guardar').hide(200);
        }
    }, 500);
}


