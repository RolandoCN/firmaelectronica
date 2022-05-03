
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

    $(document).ready(function(){  
        cargar_estilos_tabla("tabla_bodega",6);
        cargar_estilos_tabla("tabla_sector", 12);
        cargar_estilos_tabla("tabla_seccion", 12);
        cargar_tabla_bodegas();
    });

    function cargar_estilos_tabla(idtabla, col, m=10){

        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-"+col+" inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "asc" ]],
            pageLength: m,
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
        $(`#${idtabla}`).find('.col_sm').css('width','1px');
        $(`#${idtabla}`).find('.resp').css('width','150px');  
        $(`#${idtabla}`).find('.flex').css('display','flex');   
        $('[data-toggle="tooltip"]').tooltip();

    }


    //FUNCIONES PARA GESTIONAR LA BODEGA ==========================================

        function cargar_tabla_bodegas(){
            
            var num_col = $('#tabla_bodega thead th').length;
            $('#tabla_bodega tbody').html(`<tr><td colspan="${num_col}"><center> <h2><span class="spinner-border" role="status" aria-hidden="true"></span> <b>Cargando...</b></center></h2></td></tr>`);

            $.get(`/bodega/getBodega`, function(retorno){
                $("#tabla_bodega").DataTable().destroy();
                $('#tabla_bodega tbody').empty();

                $.each(retorno.listaBodega, function (i, bodega) {

                    $('#tabla_bodega tbody').append(`
                        <tr role="row">
                            <td class="col_sm">${i+1}</td>
                            <td>${bodega.nombre}</td>
                            <td>${bodega.tipo}</td>
                            <td>${bodega.departamento['nombre']}</td>      
                            <td>${bodega.ubicacion}</td>
                            
                            <td class="paddingTR" style="text-align: center; vertical-align: middle;">
                                <center>                          
                                    <button type="button" class="btn btn-sm btn-primary marginB0" onclick="editar_bodega('${bodega.id_bodega_encrypt}')"><i class="fa fa-edit"></i> </button>
                                    <button type="button" class="btn btn-sm btn-danger marginB0" onclick="eliminar_bodega('${bodega.id_bodega_encrypt}')"><i class="fa fa-trash"></i></button>                   
                                </center>
                            </td>
                        </tr>
                    `);

                });

                cargar_estilos_tabla("tabla_bodega",6);
            });

        }

        $("#frm_bodega").submit(function(event){
                
            event.preventDefault();
            var formulario = this; // obtenemos el formulacion

            swal({
                title: "",
                text: "¿Está seguro que desea continuar?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-info",
                cancelButtonClass: "btn-danger",
                confirmButtonText: "Si, Continuar",
                cancelButtonText: "No, Cancelar",
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
                    
                    var FrmData = new FormData(formulario);
                    var metodo = $("#method_bodega").val();
                    var ruta = "";
                    var id_bodega_encrypt = $("#input_id_bodega_edit").val();
                    if(metodo == "PUT"){
                        ruta = "/bodega/admin/update/"+id_bodega_encrypt;
                    }else{
                        ruta = "/bodega/admin/store";
                    }

                    FrmData = $("#frm_bodega").serialize();

                    var btn_submit = $(formulario).find('[type=submit]');
                    var txt_submit = $(btn_submit).html();
                    $(formulario).addClass('disabled_content');
                    $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);

                    $.ajax({
                        url: ruta,
                        method: metodo,
                        data: FrmData,
                        dataType: 'json',
                        success: function(retorno){
                            // si es completado
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar(retorno.mensaje, retorno.status);

                            if(!retorno.error){
                                cargar_tabla_bodegas();
                                $('#btn_bodegacancelar').click();
                            }
                        },
                        error: function(error){                        
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar("No se pudo registrar el registro, por favor intente más tarde.");                        
                        }
                    }); 

                }

                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 

        });

        function editar_bodega(id_bodega_encrypt){

            vistacargando('M','Espere...'); // mostramos la ventana de espera
            $.get("/bodega/admin/"+id_bodega_encrypt+"/edit", function (retorno) {
                
                vistacargando();

                if(retorno.error){
                    alertNotificar(retorno.mensaje, retorno.status);
                    return;
                }

                $('#id_nombre').val(retorno.bodega.nombre);
                $('#id_ubicacion').val(retorno.bodega.ubicacion);
            
                var tipo_general=retorno.bodega.tipo;
            
                if(tipo_general=='A'){
                    $('#check_general').iCheck('uncheck');
                    $('#check_area').iCheck('check');
                }else{
                    $('#check_general').iCheck('check');
                    $('#check_area').iCheck('uncheck');
                }
            
                $('.cmb_tipobodega').prop('selected',false); 
                $(`#cmb_tipobodega option[value="${retorno.bodega['tipo']}"]`).prop('selected',true); 
                $("#cmb_tipobodega").trigger("chosen:updated");
            
                $('.option_area').prop('selected',false); // deseleccioamos todas las zonas del combo
                $(`#cmb_area option[value="${retorno.bodega['iddepartamento']}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado 
                $("#cmb_area").trigger("chosen:updated"); 
        
                $('#method_bodega').val('PUT'); // decimo que sea un metodo put
                $('#input_id_bodega_edit').val(id_bodega_encrypt);
                $('#btn_bodegacancelar').show(150);
            
                $("#content_sector").show();
                $("#title_sector").html(retorno.bodega.nombre);

                $("#contet_tabla_bodega").hide();
                $("#sector_idbodega").val(id_bodega_encrypt);

                cargar_tabla_sector(retorno.bodega.sector);

                $('html,body').animate({scrollTop:$('#adm').offset().top},400);

                
            }).fail(function(){
                // si ocurre un error
                vistacargando(); // ocultamos la vista de carga
                alertNotificar("No se pudo realizar la petición, por favor intente más tarde.");
            });
        
        }

        $('#btn_bodegacancelar').click(function(){
            $('#id_nombre').val('');
            $('#id_ubicacion').val('');
        
            $('.optionsolicitud1').prop('selected',false);
            $('.optionsolicitud2').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#cmb_tipobodega").trigger("chosen:updated");
            
            $('#check_area').iCheck('uncheck');
            $('#check_general').iCheck('uncheck');
        
            $('.option_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo de zonas
        
            $('#method_bodega').val('POST'); // decimo que sea un metodo put       
            $(this).hide(150);

            $("#content_sector").hide(200);
            $("#content_seccion").hide(200);
            $("#contet_tabla_bodega").show(200);
            $("#btn_sectorcancelar").click();

        });


        function eliminar_bodega(id_bodega_encrypt){
            swal({
                title: "",
                text: "¿Está seguro de quiere eliminar la bodega?",
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

                    vistacargando("M",'Eliminando...');
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                
                    $.ajax({
                        type: "DELETE",
                        url: '/bodega/admin/delete/'+id_bodega_encrypt,
                        contentType: false,
                        cache: false,
                        processData:false,
                        success: function(retorno){ 
                            alertNotificar(retorno.mensaje, retorno.status);
                            vistacargando(); // ocultamos la ventana de espera
                            if(!retorno.error){
                                cargar_tabla_bodegas();
                            }
                        },
                        error: function(error){
                            alertNotificar("No se pudo realizar la petición, por favor intente más tarde.");
                            vistacargando(); // ocultamos la ventana de espera
                        }
                    }); 
                }
                sweetAlert.close();   // ocultamos la ventana de pregunta
            });
        }

        $('#check_general').on('ifChecked', function(event){       
            $('#check_area').iCheck('uncheck');
            $("#conten_add_departamentos").html(""); // primero limpiamos la tabla
            $('#content_departamentos').addClass('hidden');
        
        });

        $('#check_area').on('ifChecked', function(event){       
            $('#check_general').iCheck('uncheck');
            if($('#content_departamentos').hasClass('hidden') || $('#content_departamentos').is(':hidden')){
                $('#content_departamentos').removeClass('hidden');            
                $('#content_departamentos').hide();
                $('#content_departamentos').show(200);
            }
            $('.option_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo de zonas    
        });
            
        $('#check_area').on('ifUnchecked', function(event){
            $('.option_area').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#cmb_area").trigger("chosen:updated"); // actualizamos el combo de zonas
            $("#conten_add_departamentos").html(""); // primero limpiamos la tabla
            $('#content_departamentos').addClass('hidden');
        });

    //FUNCIONES PARA GESTIONAR LOS SECTORES ========================================

        function cargar_tabla_sector(lista_sectores){
            
            $("#tabla_sector").DataTable().destroy();
            $('#tabla_sector tbody').empty();

            $.each(lista_sectores, function (i, sector){ 
                $('#tabla_sector tbody').append(`
                    <tr>
                        <td class="col_sm">${i+1}</td>
                        <td>${sector.descripcion}</td>
                        <td class="paddingTR" style="text-align: center; vertical-align: middle;">
                            <center>                          
                                <button type="button" class="btn btn-sm btn-primary marginB0" onclick="editar_sector('${sector.id_sector_encrypt}')"><i class="fa fa-edit"></i> </button>
                                <button type="button" class="btn btn-sm btn-danger marginB0" onclick="eliminar_sector('${sector.id_sector_encrypt}')"><i class="fa fa-trash"></i></button>                   
                            </center>
                        </td>
                    </tr>
                `);
            });

            cargar_estilos_tabla("tabla_sector", 12, 5);

        }

        $("#frm_sector").submit(function(event){
                
            event.preventDefault();
            var formulario = this; // obtenemos el formulacion

            swal({
                title: "",
                text: "¿Está seguro que desea continuar?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-info",
                cancelButtonClass: "btn-danger",
                confirmButtonText: "Si, Continuar",
                cancelButtonText: "No, Cancelar",
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
                    
                    var FrmData = new FormData(formulario);
                    var metodo = $("#method_sector").val();
                    var ruta = "";
                    var id_sector_encrypt = $("#input_id_sector_edit").val();
                    if(metodo == "PUT"){
                        ruta = "/sector/admin/update/"+id_sector_encrypt;
                    }else{
                        ruta = "/sector/admin/store";
                    }

                    FrmData = $("#frm_sector").serialize();

                    var btn_submit = $(formulario).find('[type=submit]');
                    var txt_submit = $(btn_submit).html();
                    $(formulario).addClass('disabled_content');
                    $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);

                    $.ajax({
                        url: ruta,
                        method: metodo,
                        data: FrmData,
                        dataType: 'json',
                        success: function(retorno){
                            // si es completado
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar(retorno.mensaje, retorno.status);

                            if(!retorno.error){
                                cargar_tabla_sector(retorno.listaSector, 12, 5);
                                $("#btn_sectorcancelar").click();
                            }
                        },
                        error: function(error){                        
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar("No se pudo registrar el registro, por favor intente más tarde.");                        
                        }
                    }); 

                }

                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 

        });


        function editar_sector(id_sector_encrypt){

            vistacargando('M','Espere...'); // mostramos la ventana de espera
            $.get("/sector/admin/"+id_sector_encrypt+"/edit", function (retorno) {
                
                vistacargando();
                if(retorno.error){
                    alertNotificar(retorno.mensaje, retorno.status);
                    return;
                }

                $("#input_id_sector_edit").val(id_sector_encrypt);
                $("#seccion_idsector").val(id_sector_encrypt);
                $("#sector_descripcion").val(retorno.sector.descripcion);
                $("#btn_sectorcancelar").show(200);
                $("#method_sector").val("PUT");

                cargar_tabla_seccion(retorno.sector.seccion);
                $("#content_seccion").show(200);
                $("#title_seccion").html(retorno.sector.descripcion);

            }).fail(function(){
                // si ocurre un error
                vistacargando();
                alertNotificar("No se pudo realizar la petición, por favor intente más tarde.");
            });
        }

        $("#btn_sectorcancelar").click(function(){

            $("#input_id_sector_edit").val("");
            $("#sector_descripcion").val("");
            $("#btn_sectorcancelar").hide(200);
            $("#method_sector").val("POST");

            $("#tabla_seccion").DataTable().destroy();
            $('#tabla_seccion tbody').empty();
            cargar_estilos_tabla("tabla_seccion", 12, 5);
            $("#content_seccion").hide(200);
            $("#btn_seccioncancelar").click();

        });


        function eliminar_sector(id_sector_encrypt){
            swal({
                title: "",
                text: "¿Está seguro de quiere eliminar el sector?",
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

                    vistacargando("M",'Eliminando...');
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                
                    $.ajax({
                        type: "DELETE",
                        url: '/sector/admin/delete/'+id_sector_encrypt,
                        contentType: false,
                        cache: false,
                        processData:false,
                        success: function(retorno){ 
                            alertNotificar(retorno.mensaje, retorno.status);
                            vistacargando(); // ocultamos la ventana de espera
                            if(!retorno.error){
                                cargar_tabla_sector(retorno.listaSector);
                            }
                        },
                        error: function(error){
                            alertNotificar("No se pudo realizar la petición, por favor intente más tarde.");
                            vistacargando(); // ocultamos la ventana de espera
                        }
                    }); 
                }
                sweetAlert.close();   // ocultamos la ventana de pregunta
            });
        }


    //FUNCIONES PARA GESTIONAR LAS SECCIONES ========================================

        function cargar_tabla_seccion(lista_secciones){
            
            $("#tabla_seccion").DataTable().destroy();
            $('#tabla_seccion tbody').empty();

            $.each(lista_secciones, function (i, seccion){ 
                $('#tabla_seccion tbody').append(`
                    <tr>
                        <td class="col_sm">${i+1}</td>
                        <td>${seccion.descripcion}</td>
                        <td class="paddingTR" style="text-align: center; vertical-align: middle;">
                            <center>                          
                                <button type="button" class="btn btn-sm btn-primary marginB0" onclick="editar_seccion('${seccion.id_seccion_encrypt}')"><i class="fa fa-edit"></i> </button>
                                <button type="button" class="btn btn-sm btn-danger marginB0" onclick="eliminar_seccion('${seccion.id_seccion_encrypt}')"><i class="fa fa-trash"></i></button>                   
                            </center>
                        </td>
                    </tr>
                `);
            });

            cargar_estilos_tabla("tabla_seccion", 12, 5);

        }

        $("#frm_seccion").submit(function(event){
                
            event.preventDefault();
            var formulario = this; // obtenemos el formulacion

            swal({
                title: "",
                text: "¿Está seguro que desea continuar?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-info",
                cancelButtonClass: "btn-danger",
                confirmButtonText: "Si, Continuar",
                cancelButtonText: "No, Cancelar",
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
                    
                    var FrmData = new FormData(formulario);
                    var metodo = $("#method_seccion").val();
                    var ruta = "";
                    var id_seccion_encrypt = $("#input_id_seccion_edit").val();
                    if(metodo == "PUT"){
                        ruta = "/seccion/admin/update/"+id_seccion_encrypt;
                    }else{
                        ruta = "/seccion/admin/store";
                    }

                    FrmData = $("#frm_seccion").serialize();

                    var btn_submit = $(formulario).find('[type=submit]');
                    var txt_submit = $(btn_submit).html();
                    $(formulario).addClass('disabled_content');
                    $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);

                    $.ajax({
                        url: ruta,
                        method: metodo,
                        data: FrmData,
                        dataType: 'json',
                        success: function(retorno){
                            // si es completado
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar(retorno.mensaje, retorno.status);

                            if(!retorno.error){
                                cargar_tabla_seccion(retorno.listaSeccion, 12, 5);
                                $("#btn_seccioncancelar").click();
                            }
                        },
                        error: function(error){                        
                            $(formulario).removeClass('disabled_content');
                            $(btn_submit).html(txt_submit);
                            alertNotificar("No se pudo registrar el registro, por favor intente más tarde.");                        
                        }
                    }); 

                }

                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 

        });


        function editar_seccion(id_seccion_encrypt){

            vistacargando('M','Espere...'); // mostramos la ventana de espera
            $.get("/seccion/admin/"+id_seccion_encrypt+"/edit", function (retorno) {
                
                vistacargando();
                if(retorno.error){
                    alertNotificar(retorno.mensaje, retorno.status);
                    return;
                }

                $("#input_id_seccion_edit").val(id_seccion_encrypt);
                $("#seccion_descripcion").val(retorno.seccion.descripcion);
                $("#btn_seccioncancelar").show(200);
                $("#method_seccion").val("PUT");

            }).fail(function(){
                // si ocurre un error
                vistacargando();
                alertNotificar("No se pudo realizar la petición, por favor intente más tarde.");
            });
        }

        $("#btn_seccioncancelar").click(function(){

            $("#input_id_seccion_edit").val("");
            $("#seccion_descripcion").val("");
            $("#btn_seccioncancelar").hide(200);
            $("#method_seccion").val("POST");

        });


        function eliminar_seccion(id_sector_encrypt){
            swal({
                title: "",
                text: "¿Está seguro de quiere eliminar la sección?",
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

                    vistacargando("M",'Eliminando...');
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                
                    $.ajax({
                        type: "DELETE",
                        url: '/seccion/admin/delete/'+id_sector_encrypt,
                        contentType: false,
                        cache: false,
                        processData:false,
                        success: function(retorno){ 
                            alertNotificar(retorno.mensaje, retorno.status);
                            vistacargando(); // ocultamos la ventana de espera
                            if(!retorno.error){
                                cargar_tabla_seccion(retorno.listaSeccion);
                            }
                        },
                        error: function(error){
                            alertNotificar("No se pudo realizar la petición, por favor intente más tarde.");
                            vistacargando(); // ocultamos la ventana de espera
                        }
                    }); 
                }
                sweetAlert.close();   // ocultamos la ventana de pregunta
            });
        }
        