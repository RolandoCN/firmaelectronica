

    $(document).ready(function(){
        cargarContenidoTablas('idtablamenu');
        cargarContenidoTablas('datatable-gestion');
        cargarContenidoTablas('datatable-tipofp');
        cargarContenidoTablas('datatable-asignar-gestion');
        cargarContenidoTablas('datatable-funcionarios');
    });

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

    function cargarContenidoTablas(idtabla) {

        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "asc" ]],
            pageLength: 10,
            sInfoFiltered:false,
            "language": lenguajeTabla
        });

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
        $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
        $(`#${idtabla}`).find('.resp').css('width','150px');  
        $(`#${idtabla}`).find('.flex').css('display','flex');   
        $('[data-toggle="tooltip"]').tooltip();
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
        $("#gestion_sistemaIN").iCheck('check');
        $.get("gestionGestion/"+idgestion+"/edit", function (data) {
            $('#nombre_gestion').val(data.nombregestion);
            $('#ruta_gestion').val(data.ruta);
            $('#icon_gestion').val(data.icono);
            $('#icono_gestione_btn').html(`<i class="${data.icono}"></i>`);

            if(data.sistema=="DOC"){
                $("#gestion_sistemaDOC").iCheck('check');
            }

            if(data.global==1){
                $("#check_gestion_global").iCheck('check');
            }else{
                $("#check_gestion_global").iCheck('uncheck');
            }

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
        $("#gestion_sistemaIN").iCheck('check');
        $("#check_gestion_global").iCheck('uncheck');
        
        $('.gestion_selec_menu').attr("selected", false); // quitamos el selected a los seleccionados anteriormente
        $('#gestion_selec_menu_chosen').children('a').children('span').html('Seleccione un menú');

        $('#method_gestion').val('POST'); // decimo que sea un metodo put
        $('#frm_gestion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionGestion/');
        $(this).addClass('hidden');
    });

    // ESTION DE TIPO DE FUNCIONARIO PUBLICO

    function tipoFP_editar(idtipoFP){
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $('.check_sistema').iCheck('uncheck');

        $.get("gestionTipoFP/"+idtipoFP+"/edit", function (data) {
            $('#nombre_tipoFP').val(data.descripcion);
            if(data.sistema == "IN" || data.sistema=="INDOC"){ 
                $('#check_intranet').iCheck('check');
            }
            if(data.sistema == "DOC" || data.sistema=="INDOC"){
                $('#check_documental').iCheck('check');
            }
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
        $('.check_sistema').iCheck('uncheck');;

        $('#method_tipoFP').val('POST'); // decimo que sea un metodo put
        $('#frm_tipoFP').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoFP');
        $(this).addClass('hidden');
    });


    // GESTION DE ASIGNACION DE GESTION A UN TIPO  FP

    function asignarGestion_editar(idtipoFP){
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get("asignarGestionTipo/"+idtipoFP+"/edit", function (retorno) {
            console.log(retorno);

            $('.opcion_tipoFP').prop("selected", false);
            $(`#AGTFP_tipousuario option[value="${retorno.idtipoFP}"]`).prop("selected", true);
            $("#AGTFP_tipousuario").trigger("chosen:updated"); 
            
            $('.opcion_gestion').prop("selected", false);
            $.each(retorno.lista_gestiones, function(index, gestion){            
                $(`#AGTFP_gestion option[value="${gestion.idgestion}"]`).prop("selected", true);  
                $("#AGTFP_gestion").trigger("chosen:updated");          
            }); 
            

            vistacargando(); // ocultamos la ventana de espera
        }).fail(function(){
            // si ocurre un error
            vistacargando(); // ocultamos la vista de carga
            alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
        });

        $('#method_asignarGestion').val('PUT'); // decimo que sea un metodo put
        $('#frm_asignarGestion').prop('action',window.location.protocol+'//'+window.location.host+'/asignarGestionTipo/'+idtipoFP);
        $('#btn_gestionasignargestioncancelar').removeClass('hidden');

        $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
    }

    // FUNCIONES PARA COPIAR LAS OPCIONES AGREGADAS A UN TIPOFP
    function copiar_gestiones(list_idgestion){
        list_idgestion = JSON.parse(list_idgestion);
        $(list_idgestion).each(function (index, idgestion) {
            $(`.opcion_gestion[value=${idgestion}]`).prop('selected', true);
            $("#AGTFP_gestion").trigger("chosen:updated");
            $("#AGTFP_cancelar").show();
        });
        $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
    }

    // FUNCION PARA LIMPIAR LAS GESTIONES SELECCIONADAS
    $("#AGTFP_cancelar").click(function(){
        $(".opcion_gestion").prop('selected', false);
        $("#AGTFP_gestion").trigger("chosen:updated");
        $(".opcion_tipoFP").prop('selected', false);
        $("#AGTFP_tipousuario").trigger("chosen:updated");
        $("#AGTFP_cancelar").hide();
    });

    $('#btn_gestionasignargestioncancelar').click(function(){
        $('.opcion_tipoFP').prop("selected", false);
        // $('#AGTFP_tipousuario_chosen').children('a').children('span').html('Seleccione un tipo de usuario');
        $("#AGTFP_tipousuario").trigger("chosen:updated");        

        $('.opcion_gestion').prop("selected", false);
        // $('#AGTFP_gestion_chosen').children('a').children('span').html('Seleccione una gestión');
        $("#AGTFP_gestion").trigger("chosen:updated");  

        $('#method_asignarGestion').val('POST'); // decimo que sea un metodo put
        $('#frm_asignarGestion').prop('action',window.location.protocol+'//'+window.location.host+'/gestionTipoFP');
        $(this).addClass('hidden');
    });






    // GESTION PARA ASIGNAR TIPO DE USUARIO A FUNCIONARIO

        function asignarTipoFP_editar(idusuarioAsignar){
            $('[data-toggle="tooltip"]').tooltip("hide");
            vistacargando('M','Espere...'); // mostramos la ventana de espera
            $.get("asignarTipoFPFuncionarioMostrar/"+idusuarioAsignar, function (data) {
                
                $("#cmb_rol_interno option[data-id=N]").prop("selected", true);
                $("#cmb_rol_interno").trigger("chosen:updated");
                $("#check_permitir_reasignar").iCheck('uncheck');
                $("#check_ver_todo_tramite").iCheck("uncheck");
                $('#contet_reasignar').hide();
                $("#cargo_usuario").val("");
                $("#idus001_tipopf_edit").val("");

                $("#ATFP_fecha_inicio").val($("#ATFP_fecha_inicio").attr("data-id"));
                $("#ATFP_fecha_fin").val($("#ATFP_fecha_fin").attr("data-id"));

                $("#btn_gestionasignarTipoFPcancelar").attr("onclick", `cancelar_edicion_ust('${idusuarioAsignar}')`);
                $("#btn_gestionasignarTipoFPcancelar").hide();
                $("#btn_gestionasignarTipoFPsalir").show();


                $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
                $('#ciu_seleccionado').html(data.funcionario.ciu);
                $('#cedula_seleccionada').html(data.funcionario.cedula);
                $('#nombre_seleccionado').html(data.funcionario.name);
                $('#email_seleccionado').html(data.funcionario.email);
                $('#email_actualizar').val(data.funcionario.email);

                //mostramos el nombre_documental del usuario
                $('#nombre_documental').val(data.funcionario.nombre_documental);

                // mostramos formulario para agregar mas tipos fp
                $('#frm_contenedor_asignarTipo').show(300);
                // ocultamos la tabla
                $('#asignartipoFP_tabla').hide();
                

                // CARGAMOS LOS TIPOSFP EN EL COMBO  ATFP_tipoFP
                // recorremos cada uno de los tiposfp que retorna la consulta

                var contenedor = ""; // variable para almacenar le HTML de los option a agregar
                $.each(data.listaTipoFP,function(i,tipoFP){
                    contenedor = contenedor+`<option class="opcionATFP_tipoFP" value="${tipoFP.idtipoFP}">${tipoFP.descripcion}</option>`;
                });

                // cargamos el select con las nueva lista de tiposFP
                $('#div_ATFP_tipoFP').html(`
                    <select data-placeholder="Seleccione una tipo de usuario" name="ATFP_tipoFP" id="ATFP_tipoFP" onchange="getCargoFuncionarioDepa()" required="required" class="chosen-select form-control" tabindex="5">
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
                var aux_depa = 0;
                var aux_color = "";
                $.each(data.tipoFP_asignados,function(i,tipoFPasignado){
                    $('#div_tipoUsuariosAsignados').show(); // si existen tipos asignados mostramos el div
                    var textJefeSecre = "";
                    if(tipoFPasignado.jefe_departamento==1){
                        textJefeSecre = "Jefe";
                    }else if(tipoFPasignado.secre_departamento==1){
                        textJefeSecre = "Secretario(a)";
                    }

                    var textReasignar = "";
                    if(tipoFPasignado.reasignar_tramite == 1){
                        textReasignar = "Si";
                    }

                    var textVerTodosTramites = "No";
                    if(tipoFPasignado.ver_todo_tramite == 1){
                        textVerTodosTramites = "Si";
                    }

                    var cargo_us = "";
                    if(tipoFPasignado.cargo!=null){
                        cargo_us = tipoFPasignado.cargo;
                    }

                    if(i==0){ aux_depa = tipoFPasignado.iddepartamento; }
                    if(aux_depa!=tipoFPasignado.iddepartamento){
                        aux_depa = tipoFPasignado.iddepartamento;                        
                        if(aux_color==""){
                            aux_color="bg-warning";
                        }else{
                            aux_color="";
                        }
                    }         

                    $("#tb_tipoUsuarioAsignados").append(`
                        <tr class="even pointer">
                            <td class="${aux_color} a-center"><center>${i+1}</center></td>
                            <td class="${aux_color}">${tipoFPasignado.tipofp.descripcion}</td>
                            <td class="${aux_color}">${tipoFPasignado.departamento.nombre}</td>
                            <td class="${aux_color}">${cargo_us}</td>
                            <td class="${aux_color}"><center>${textJefeSecre}</center></td>
                            <td class="${aux_color}"><center>${textReasignar}</center></td>
                            <td class="${aux_color}"><center>${textVerTodosTramites}</center></td>
                            <td class="${aux_color}" style="display: flex;">
                                <button type="button" class="btn btn-info btn-xs" onclick="us001_tipofp_edit('${tipoFPasignado.idus001_tipofp}')" style="margin-bottom: 0 !important;">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button type="button" class="btn btn-danger btn-xs" onclick="eliminarTipoFPAsignado('${tipoFPasignado.idus001_tipofp}', '${idusuarioAsignar}')" style="margin-bottom: 0 !important;">
                                    <i class="fa fa-trash"></i>
                                </button>
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
            $('#btn_gestionasignarTipoFPsalir').removeClass('hidden');
            
        }

        //funcione para obtener la informacion de un tipo fp asignado
        function us001_tipofp_edit(idus001_tipofp){

            vistacargando("M", "Espere...");
            $.get(`/editUs001TipoFP/${idus001_tipofp}`, function(retorno){

                vistacargando();
                if(!retorno.error){

                    //vargamos el combo de tipofp
                    var contenedor = ""; // variable para almacenar le HTML de los option a agregar
                    $.each(retorno.listaTipoFP,function(i,tipoFP){
                        contenedor = contenedor+`<option class="opcionATFP_tipoFP" value="${tipoFP.idtipoFP}">${tipoFP.descripcion}</option>`;
                    });
    
                    // cargamos el select con las nueva lista de tiposFP
                    $('#div_ATFP_tipoFP').html(`
                        <select data-placeholder="Seleccione una tipo de usuario" name="ATFP_tipoFP" id="ATFP_tipoFP" onchange="getCargoFuncionarioDepa()" required="required" class="chosen-select form-control" tabindex="5">
                            <option value=""></option>
                            ${contenedor}
                        </select>
                    `);
                    $('.chosen-select').chosen();

                    //seleccionamos el combo  tipofp
                    $("#ATFP_tipoFP option").prop("selected", false);
                    $(`#ATFP_tipoFP option[value=${retorno.us001_tipofp.idtipoFP}]`).prop("selected", true);
                    $("#ATFP_tipoFP").trigger("chosen:updated");

                    //seleccionamos el departamento
                    $("#ATFP_departamento option").prop("selected", false);
                    $(`#ATFP_departamento option[value=${retorno.us001_tipofp.iddepartamento}]`).prop("selected", true);
                    $("#ATFP_departamento").trigger("chosen:updated");

                    //cargamos las fechas
                    $("#ATFP_fecha_inicio").val(retorno.us001_tipofp.fecha_inicio);
                    $("#ATFP_fecha_fin").val(retorno.us001_tipofp.fecha_fin);

                    //seleccionamos el rol interno
                    $("#cmb_rol_interno option").prop("selected", false);
                    $("#check_permitir_reasignar").iCheck("uncheck");
                    $("#contet_reasignar").hide();
                    if(retorno.us001_tipofp.jefe_departamento==1){                        
                        $("#cmb_rol_interno option[data-id='J']").prop("selected", true);                                                                      
                    }else if(retorno.us001_tipofp.secre_departamento==1){
                        $("#cmb_rol_interno option[data-id='S']").prop("selected", true);
                        $("#contet_reasignar").show();
                        if(retorno.us001_tipofp.reasignar_tramite==1){
                            $("#check_permitir_reasignar").iCheck("check");
                        }
                    }else{
                        $("#cmb_rol_interno option[data-id='N']").prop("selected", true);  
                    }
                    $("#cmb_rol_interno").trigger("chosen:updated");

                    //cargamos el cargo del funcionario
                    $("#cargo_usuario").val(retorno.us001_tipofp.cargo);

                    //cargamos el id que estamos editando
                    $("#idus001_tipopf_edit").val(retorno.us001_tipofp.idus001_tipofp);

                    //seleccionamos el check de ver todos los tramites
                    $("#check_ver_todo_tramite").iCheck("uncheck");
                    if(retorno.us001_tipofp.ver_todo_tramite == 1){
                        $("#check_ver_todo_tramite").iCheck("check");
                    }

                    //cargamos el boton de calcelar edicion
                    $("#btn_gestionasignarTipoFPcancelar").show();
                    $("#btn_gestionasignarTipoFPsalir").hide();

                    //desplazamos el inicio
                    $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);

                }else{
                    alertNotificar(retorno.mensaje, retorno.status);
                }

            }).fail(function(){
                vistacargando();
                alertNotificar("Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "error");
            });

        }

        //funcion para cancelar la edicion de un us001_tipofp
        function cancelar_edicion_ust(idusuarioAsignar) {
            asignarTipoFP_editar(idusuarioAsignar);
        }

        //funcion para obtener el cargo de un funcionario en un departamento
        function getCargoFuncionarioDepa(){
           
            idus001_encrypt = $("#ATFP_idusuario").val();
            iddepartamento = $("#ATFP_departamento").val();
            if(idus001_encrypt=="" || iddepartamento ==""){ return; }

            vistacargando("M", "Espere...");
            $.get(`/getCargoFuncionarioDepa/${idus001_encrypt}/${iddepartamento}`, function(retorno){
                
                vistacargando();
                if(!retorno.error){
                    if(retorno.us001_tipofp!=null){
                        $("#cargo_usuario").val(retorno.us001_tipofp.cargo);
                    }else{
                        $("#cargo_usuario").val("");
                    }                 
                }else{
                    alertNotificar(retorno.mensaje, retorno.status);
                }

            }).fail(function(){
                vistacargando();
                alertNotificar("Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "error");                
            });
        }

        //funciones que se desencadena al cambiar un tipo de rol interno
        $("#cmb_rol_interno").change(function(){
            var opcion = $("#cmb_rol_interno option:selected").attr("data-id");
            $('#contet_reasignar').hide(150);
            if(opcion=="S"){
                $('#contet_reasignar').show(150);
            }
        });

        //funcion para guardar el nombre que aparecera en un documento generado desde el sistema documental
        $("#btn_guardar_nomdoc").click(function(){
        
            var nombre_documental = $("#nombre_documental").val();
            if(nombre_documental == null || nombre_documental == ""){
                alertNotificar("Ingrese el toda la información.");
                return;
            }

            var FrmData = {
                id: $("#ATFP_idusuario").val(),
                nombre_documental: nombre_documental
            }
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            vistacargando("M", "Espere...");
            $.ajax({
                url: "/actualizarDatosFuncionario",
                method: "POST",
                data: FrmData,
                dataType: 'json',
                success: function(retorno){
                    // si es completado
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);
                    if(!retorno.error){
                        cargar_tabla_funcionarios(retorno.lista_funcionarios);
                    }
                },
                error: function(error){
                    vistacargando();
                    alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");                        
                }
            }); 
        });

        //funcion para actualizar el email
        $("#btn_guardar_email").click(function(){

            var email_actualizar = $("#email_actualizar").val();
            if(email_actualizar == null || email_actualizar == ""){
                alertNotificar("Ingrese toda la información.");
                return;
            }

            var FrmData = {
                id: $("#ATFP_idusuario").val(),
                email_actualizar: email_actualizar
            }
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            vistacargando("M", "Espere...");
            $.ajax({
                url: "/actualizarEmailFuncionario",
                method: "POST",
                data: FrmData,
                dataType: 'json',
                success: function(retorno){
                    // si es completado
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);
                    if(!retorno.error){
                        cargar_tabla_funcionarios(retorno.lista_funcionarios);
                    }
                },
                error: function(error){
                    vistacargando();
                    alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");                        
                }
            }); 
        });

        
        $("#frm_contenedor_asignarTipo").submit(function(e){
            e.preventDefault();
        
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var FrmData = new FormData(this);
            var ruta = $(this).attr('action');
            vistacargando("M",'Guardando...');
            
            $.ajax({
                url: ruta,
                method: "POST",
                data: FrmData,
                dataType: 'json',
                contentType:false,
                cache:false,
                processData:false,
                success: function(retorno){
                    // si es completado
                    vistacargando();
                    alertNotificar(retorno.mensaje, retorno.status);

                    if(!retorno.error){  
                        asignarTipoFP_editar($("#ATFP_idusuario").val());
                        cargar_tabla_funcionarios(retorno.lista_funcionarios);
                    }
                },
                error: function(error){
                    vistacargando();
                    alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");                        
                }
            }); 

        });


        function eliminarTipoFPAsignado(idus001_tipofp, idusuarioAsignar){

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
                        
                        vistacargando("M",'Eliminando...');
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                    
                        $.ajax({
                            type: "DELETE",
                            url: '/eliminarTipoFPFuncionario/'+idus001_tipofp,
                            contentType: false,
                            cache: false,
                            processData:false,
                            success: function(retorno){ 
                                vistacargando(); // ocultamos la ventana de espera
                                alertNotificar(retorno.mensaje, retorno.status);
                                if(!retorno.error){                        
                                    asignarTipoFP_editar(idusuarioAsignar);
                                    cargar_tabla_funcionarios(retorno.lista_funcionarios);
                                }
                            },
                            error: function(error){
                                vistacargando(); // ocultamos la ventana de espera
                                alertNotificar("No se pudo eliminar el registro, por favor intente más tarde.");                        
                            }
                        });

                    }
                    sweetAlert.close();   // ocultamos la ventana de pregunta
                }); 

        }

        $('#btn_gestionasignarTipoFPsalir').click(function(){

            $('#asignartipoFP_tabla').show(300);
            $('#frm_contenedor_asignarTipo').hide(300);
            $('#div_tipoUsuariosAsignados').hide(300);
            $('#ciu_seleccionado').html('No seleccionado');
            $('#cedula_seleccionada').html('No seleccionado');
            $('#nombre_seleccionado').html('No seleccionado');
            $('#email_seleccionado').html('No seleccionado');

            $('.opcionATFP_tipoFP').attr("selected", false); 
            $('#ATFP_tipousuario_chosen').children('a').children('span').html('Seleccione un tipo de usuario');
            $('#ATFP_idusuario').val('');
            $('#btn_gestionasignarTipoFPsalir').addClass('hidden');
        });


        $("#a_gestionar_funcionario").click(function(){

            if($("#a_gestionar_funcionario").hasClass("tabla_cargada")){ return; }
            $("#a_gestionar_funcionario").addClass("tabla_cargada");

            var num_col = $("#datatable-funcionarios thead tr th").length; //obtenemos el numero de columnas de la tabla
            $("#datatable-funcionarios tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);
            $.get('/getAllFuncionarios', function(retorno){
                if(retorno.error){
                    $("#datatable-funcionarios tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="" role="status" aria-hidden="true"></span><b> No se pudo obtener la información</b></center></td></tr>`);
                }else{
                    cargar_tabla_funcionarios(retorno.lista_funcionarios);
                }            
            }).fail(function(){
                $("#datatable-funcionarios tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="" role="status" aria-hidden="true"></span><b> No se pudo obtener la información</b></center></td></tr>`);
            });

        });


        function dardeBaraFuncionario(idus001_encrypt){

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
                    
                    vistacargando("M",'Eliminando...');
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                
                    $.ajax({
                        type: "DELETE",
                        url: '/dardeBajaFuncionario/'+idus001_encrypt,
                        contentType: false,
                        cache: false,
                        processData:false,
                        success: function(retorno){ 
                            vistacargando(); // ocultamos la ventana de espera
                            alertNotificar(retorno.mensaje, retorno.status);
                            if(!retorno.error){
                                cargar_tabla_funcionarios(retorno.lista_funcionarios);
                            }
                        },
                        error: function(error){
                            vistacargando(); // ocultamos la ventana de espera
                            alertNotificar("No se pudo dar de baja el registro, por favor intente más tarde.");                        
                        }
                    }); 
                    
                }
                sweetAlert.close();   // ocultamos la ventana de pregunta
                $('[data-toggle="tooltip"]').tooltip("hide");
            });
        }

        function resetearClave(idus001_encrypt){

            swal({
                title: "Se aregará la cédula del funcionario como contraseña",
                text: "¿Esta seguro que quiere resetear la contraseña?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-primary",
                confirmButtonText: "Si, resetear!",
                cancelButtonText: "No, cancela!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) { // si dice que quiere eliminar
                    
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
            
                    var FrmData = {
                        idus001: idus001_encrypt
                    };            
                    vistacargando("M",'Espere...');
                    
                    $.ajax({
                        url: '/resetearClaveFuncionario',
                        method: "POST",
                        data: FrmData,
                        type: 'json',
                        success: function(retorno){
                            // si es completado
                            vistacargando();
                            alertNotificar(retorno.mensaje, retorno.status);
                        },
                        error: function(error){
                            vistacargando();
                            alertNotificar("No se pudo realizar la actualización, por favor intente más tarde.");                        
                        }
                    }); 

                }            
                sweetAlert.close();   // ocultamos la ventana de pregunta
                $('[data-toggle="tooltip"]').tooltip("hide");
            });

        }

        //funcion que carga la tabla de fucionarios publicos
        function cargar_tabla_funcionarios(lista_funcionarios){

            var idtabla = "datatable-funcionarios";
            $(`#${idtabla}`).DataTable({
                dom: ""
                +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                +"<rt>"
                +"<'row'<'form-inline'"
                +" <'col-sm-6 col-md-6 col-lg-6'l>"
                +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                "destroy":true,
                order: [[ 0, "asc" ]],
                pageLength: 10,
                sInfoFiltered:false,
                "language": lenguajeTabla,
                data: lista_funcionarios,
                columns:[
                    {data: "usuarios.ciu"},
                    {data: "usuarios.cedula"},
                    {data: "usuarios.name", render : function (item, type, user_tipoUsuario){
                        var email = "Sin E-mail";
                        var nombDoc = "s/n";
                        var texto_nombre = user_tipoUsuario.usuarios.name;
                        if(user_tipoUsuario.usuarios.email!=null){ email = user_tipoUsuario.usuarios.email; }
                        if(user_tipoUsuario.usuarios.nombre_documental!=null){ nombDoc = user_tipoUsuario.usuarios.nombre_documental; }
                        return texto_nombre+" "+email+" "+nombDoc;
                    }},
                    {data: "usuarios.name", render : function (item, type, user_tipoUsuario){ 
                        
                        var texto_tipo = "";
                        $.each(user_tipoUsuario.usuarios.us001_tpofp, function(i, us001_tpofp){                                                
                            msj_jefe = "";
                            if(us001_tpofp.jefe_departamento==1){ msj_jefe="Jefe de "; }
                            texto_tipo = texto_tipo + us001_tpofp.tipofp.descripcion + msj_jefe + us001_tpofp.departamento.nombre;                                                  
                        });
                        return texto_tipo;

                    }},
                    {data: "usuarios.name" }
                ],
                "rowCallback": function( row, user_tipoUsuario, index ){
                    $('td', row).addClass('odd');

                    //columna #0
                    var ciu = "";
                    if(user_tipoUsuario.usuarios.ciu!=null){ ciu = user_tipoUsuario.usuarios.ciu; }
                    $('td', row).eq(0).css({'vertical-align':'middle'});
                    $('td', row).eq(0).addClass('sorting_1');
                    $('td', row).eq(0).html(`<center>${ciu}</center>`);

                    //columna #1
                    $('td', row).eq(1).css({'vertical-align':'middle'});
                    $('td', row).eq(1).addClass('alVertical');
                    $('td', row).eq(1).html(`<span style="line-height: inherit; user-select: all;">${user_tipoUsuario.usuarios.cedula}</span>`);

                    //columna #2
                    var email = "Sin E-mail";
                    var nombDoc = "s/n";
                    if(user_tipoUsuario.usuarios.email!=null){ email = user_tipoUsuario.usuarios.email; }
                    if(user_tipoUsuario.usuarios.nombre_documental!=null){ nombDoc = user_tipoUsuario.usuarios.nombre_documental; }
                    $('td', row).eq(2).css({'vertical-align':'middle', 'line-height': 'normal'});             
                    $('td', row).eq(2).html(`
                        <span style="line-height: inherit; user-select: all;">${user_tipoUsuario.usuarios.name}</span> <br>
                        <span style="line-height: inherit; font-family: cursive; user-select: all;">${email}</span> <br>
                        <span style="line-height: inherit; font-family: system-ui; user-select: all; color: #7387a8; font-weight: 700;">${nombDoc}</span>
                    `);

                    //columna #3
                    $('td', row).eq(3).css({'vertical-align':'middle'});
                    if(user_tipoUsuario.usuarios.us001_tpofp.length==0){
                        $('td', row).eq(3).html('NO ASIGNADO');
                    }else{

                        var texto_tipo = "";
                        $.each(user_tipoUsuario.usuarios.us001_tpofp, function(i, us001_tpofp){                        
                            
                            msj_jefe = "";
                            st_jefe = "";
                            if(us001_tpofp.jefe_departamento==1){
                                msj_jefe="Jefe de ";
                                st_jefe = "color: #1bb969;";
                            }

                            texto_tipo = texto_tipo+(`
                                <li style="${st_jefe}">
                                    <b>${us001_tpofp.tipofp.descripcion}</b> 
                                    <span style="font-size: 11px; line-height: normal;">(<span style="line-height: inherit; user-select: all;">${msj_jefe}${us001_tpofp.departamento.nombre}</span>) </span>
                                </li>
                            `);                                              
                        });
                        $('td', row).eq(3).html(`<ul style="margin-bottom: 0px; padding-left: 18px;">${texto_tipo}</ul>`);
                    }

                    //columna #4
                    $('td', row).eq(4).css({'vertical-align':'inherit'});
                    $('td', row).eq(4).addClass('paddingTR');
                    $('td', row).eq(4).html(`
                        <center style="min-width: 100px;">
                            <button type="button" onclick="asignarTipoFP_editar('${user_tipoUsuario.usuarios.idus001_encrypt}')" class="btn btn-sm btn-primary marginB0" 
                            data-toggle="tooltip" data-original-title="Gestionar los roles del funcionario" data-placement="top">
                                <i class="fa fa-edit fa_sm"></i>
                            </button>

                            <button type="button" class="btn btn-danger btn-sm marginB0" onclick="dardeBaraFuncionario('${user_tipoUsuario.usuarios.idus001_encrypt}')"
                            data-toggle="tooltip" data-original-title="Dar de baja al funcionario" data-placement="top">
                                <i class="fa fa-trash fa_sm"></i>
                            </button>
                            
                            <button type="button" class="btn btn-warning btn-sm marginB0" onclick="resetearClave('${user_tipoUsuario.usuarios.idus001_encrypt}')"
                            data-toggle="tooltip" data-original-title="Resetear la contraseña del funcionario" data-placement="top">
                                <i class="fa fa-history fa_sm"></i>
                            </button> 
                            <a type="button" class="btn btn-default btn-sm marginB0" href="/loguearse/${user_tipoUsuario.usuarios.idus001_encrypt}" "
                            data-toggle="tooltip" data-original-title="Loguearse con el Usuario" data-placement="top" target="_blank">
                                <i class="fa fa-sign-in"></i>
                            </a>   
                            <a type="button" class="btn btn-success btn-sm marginB0" href="/actaintranet/${user_tipoUsuario.usuarios.idus001_encrypt}" "
                            data-toggle="tooltip" data-original-title="Generar Acta" data-placement="top" target="_blank">
                                <i class="fa fa-file-o"></i>
                            </a> 
                            
                        </center>
                    `);                

                    if(user_tipoUsuario.usuarios.estado=="E"){
                        $('td', row).remove();
                    }

                }
            });

            // para posicionar el input del filtro
            $(`#${idtabla}_filter`).css('float', 'left');
            $(`#${idtabla}_filter`).children('label').css('width', '100%');
            $(`#${idtabla}_filter`).parent().css('padding-left','0');
            $(`#${idtabla}_wrapper`).css('margin-top','10px');
            $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
            $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
            //buscamos las columnas que deceamos que sean las mas angostas
            $(`#${idtabla}`).find('.col_sm').css('width','10px');
            $(`#${idtabla}`).find('.resp').css('width','150px');  
            $(`#${idtabla}`).find('.flex').css('display','flex');

            $('[data-toggle="tooltip"]').tooltip();
            $(`#${idtabla}`).css('width', '100%');
            
            $(`#${idtabla}`).on('draw.dt', function () {        
                $('[data-toggle="tooltip"]').tooltip();
                $(`#${idtabla}`).css('width', '100%');
            });

        }






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


    //FUNCIONES PARA ORDENAR LAS GESTIONES DEL MENU

        function mover_gestion(direccion, idmenu, idgestion, btn){
            
            var tr1 = $(btn).parents('.tr_'+idmenu);
            var tr1_td1 = $(btn).parents('.td_gestion'); var tr1_td1_html= $(tr1_td1).html();
            var tr1_td2 = $(tr1_td1).siblings('.td_tipofp'); var tr1_td2_html= $(tr1_td2).html();

            //seleccionamos la fila quese le da click
            $(".col_mov").removeClass('col_selec');
            
            var boton = $(".col_mov").find("button");
            $(boton).removeClass('btn-warning');
            $(boton).addClass('btn-default');

            $(tr1_td1).addClass('col_selec'); 
            $(tr1_td1).find("button").removeClass('btn-warning');
            $(tr1_td2).addClass('col_selec');

            var boton = $(tr1_td1).find("button");
            $(boton).removeClass('btn-default');
            $(boton).addClass('btn-warning');

            if(direccion=="UP"){ //mover hacia arriba
                var tr2 = $(tr1).prev();
            }else{ //mover hacia abajo "DOWN"
                var tr2 = $(tr1).next();
            }

            vistacargando("M", "Espere..");
            $.get(`/gestionPermisos/ordenarGestion/${direccion}/${idmenu}/${idgestion}`, function(retorno){
                vistacargando();
                if(retorno.error==true){ return; }
                else if(retorno.recargar==true){ window.location.href="/gestionPermisos"; return; }

                if(tr2.length==1){
                    if(tr2.hasClass('tr_'+idmenu)){               
                        var tr2_td1 = $(tr2).find('.td_gestion'); var tr2_td1_html= $(tr2_td1).html();
                        var tr2_td2 = $(tr2).find('.td_tipofp'); var tr2_td2_html= $(tr2_td2).html();

                        //reeemplapazamos el texto
                        $(tr1_td1).html(tr2_td1_html);
                        $(tr1_td2).html(tr2_td2_html);

                        $(tr2_td1).html(tr1_td1_html);
                        $(tr2_td2).html(tr1_td2_html);

                        //seleccionamos la fila quese le da click
                        $(".col_mov").removeClass('col_selec');

                        var boton = $(".col_mov").find("button");
                        $(boton).removeClass('btn-warning');
                        $(boton).addClass('btn-default');

                        $(tr2_td1).addClass('col_selec');
                        $(tr2_td2).addClass('col_selec');

                        var boton = $(tr2_td1).find("button");
                        $(boton).removeClass('btn-default');
                        $(boton).addClass('btn-warning');

                    }
                }

            }).fail(function(){
                vistacargando();
            });

        }

        function mover_menu(direccion, idmenu, btn){
            
            var tr1 = $(btn).parents('.tr_'+idmenu);

            //seleccionamos la fila quese le da click
            $(".col_mov").removeClass('col_selec');
            var boton = $(".col_mov").find("button");
            $(boton).removeClass('btn-warning');
            $(boton).addClass('btn-default');

            $('.tr_'+idmenu).find('.col_mov').addClass('col_selec');
            var boton = $(tr1).find('.menu_col').find("button");
            $(boton).removeClass('btn-default');
            $(boton).addClass('btn-warning');


            vistacargando("M", "Espere..");
            $.get(`/gestionPermisos/ordenarMenu/${direccion}/${idmenu}`, function(retorno){
                vistacargando();

                if(retorno.error==true){ return; }
                else if(retorno.recargar==true){ window.location.href="/gestionPermisos"; return; }

                if(direccion=="UP"){ //mover hacia arriba
                    var tr2 = $(tr1).prev();
                    if(tr2.length==1){

                        tr2 = $(tr2).parent().find(`.${$(tr2).attr('data-id')}`); 
                        tr2 = tr2[0];

                        var list_tr1 = $(tr1).parent().find(`.${$(tr1).attr('data-id')}`);
                        $.each(list_tr1, function(index, item_tr1){
                            $(item_tr1).insertBefore(tr2);
                        });
                    }
                }else{ //mover hacia abajo "DOWN"

                    var list_tr1 = $(tr1).parent().find(`.${$(tr1).attr('data-id')}`);
                    var tr2 = $(list_tr1[list_tr1.length-1]).next();
            
                    if(tr2.length==1){

                        tr2 = $(tr2).parent().find(`.${$(tr2).attr('data-id')}`); 
                        tr2 = tr2[tr2.length-1];

                        var aux = tr2;
                        $.each(list_tr1, function(index, item_tr1){
                            $(item_tr1).insertAfter(aux);
                            aux = item_tr1;
                        });
                    }

                }

            }).fail(function(){
                vistacargando();
            });

        }