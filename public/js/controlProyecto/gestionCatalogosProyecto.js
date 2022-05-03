    
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
        cargar_tabla_inicio("tp_tabla");
        cargar_tabla_inicio("ep_tabla");
        cargar_tabla_inicio("cp_tabla");
        cargar_tabla_inicio("pp_tabla");
        cargar_tabla_inicio("er_tabla");
    });

    function cargar_tabla_inicio(idtabla){
    
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

        estilo_tabla(idtabla);
    }

    function estilo_tabla(idtabla){

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

    $(".btn_cancelar_cat").click(function(){
        $(this).hide(200);
        $(this).parents('form').find('input').val("");
        $(this).parents('form').attr('action', $(this).parents('form').attr('data-id'));
        $(this).parents('form').find('.input_metodo').val("POST");
    });

//------------------------------------------------------------------------------------------------//
//********************************** GESTION TIPO PROYECTO ***************************************//
//------------------------------------------------------------------------------------------------//

    $("#frm_tp").submit(function(e){

        e.preventDefault();
        var formulario = this; // obtenemos el formulacion
        var bts = "";

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

                var FrmData = $(formulario).serialize();
                var ruta = $(formulario).attr('action');
                var metodo = $(formulario).find('.input_metodo').val();
    
                $(formulario).addClass('disabled_content');
                bts = $(formulario).find('button[type=submit]').html();
                $(formulario).find('button[type=submit]').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere`);                
                
                $.ajax({
                    url: ruta,
                    method: metodo,
                    data: FrmData,
                    dataType: 'json',
                    success: function(retorno){
                        // si es completado                        
                        alertNotificar(retorno.mensaje, retorno.status);
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                       
                        if(!retorno.error){                                                      
                            tp_cargar_tabla(retorno.lista_data);
                            $(formulario).find('input').val("");
                            $(formulario).find('.btn_cancelar_cat').hide(200);
                            $(formulario).attr('action', $(formulario).attr('data-id'));
                            $(formulario).find('.input_metodo').val("POST");
                        }
                    },
                    error: function(error){                        
                        alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                                         
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });

    function tp_editar_catalogo(iddata_encrypt){

        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/tipoProyecto/${iddata_encrypt}/edit`, function(retorno){

            vistacargando();
            if(!retorno.error){
                $("#tp_descripcion").val(retorno.data.descripcion);
                $("#frm_tp").attr('action', $("#frm_tp").attr('data-id')+'/'+iddata_encrypt);
                $("#frm_tp").find('.input_metodo').val("PUT");
                $("#frm_tp").find('.btn_cancelar_cat').show(200);
            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){            
            vistacargando(); // ocultamos la ventana de espera
            alertNotificar("No se pudo obtener el registro, por favor intente más tarde.");
        });
    }

    function tp_eliminar_catalogo(iddata_encrypt){
        
        swal({
            title: "",
            text: "¿Está seguro que desea eliminar el registro?",
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
                    url: '/controlProyecto/tipoProyecto/'+iddata_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            tp_cargar_tabla(retorno.lista_data);
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo eliminar el registro, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
        
    }

    function tp_cargar_tabla(lista_data){

        var idtabla = "tp_tabla";
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
            data: lista_data,
            columnDefs: [
                { className: "", targets: 0 },
                { className: "", targets: 1 },
                { className: "", targets: 2 }
            ],
            columns:[
                {data: "descripcion" , render : function (item, type, row_data, row){ return row.row+1; } },
                {data: "descripcion" },
                {data: "descripcion", render : function (item, type, row_data, row){
                    return (`
                        <button class="btn btn-xs btn-primary" onclick="tp_editar_catalogo('${row_data.idcon_tipoProyectoencrypt}')"><i class="fa fa-edit"></i> Editar</button>
                        <button class="btn btn-xs btn-danger" onclick="tp_eliminar_catalogo('${row_data.idcon_tipoProyectoencrypt}')"><i class="fa fa-trash"></i> Eliminar</button>  
                    `);
                }}
            ],
            "rowCallback": function( row, proyecto, index ){
                $('td', row).eq(2).css('display', 'flex'); 
            }
        });
        estilo_tabla(idtabla);

    }


//------------------------------------------------------------------------------------------------//
//********************************** GESTION ETAPA PROYECTO **************************************//
//------------------------------------------------------------------------------------------------//

    $("#frm_ep").submit(function(e){

        e.preventDefault();
        var formulario = this; // obtenemos el formulacion
        var bts = "";

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

                var FrmData = $(formulario).serialize();
                var ruta = $(formulario).attr('action');
                var metodo = $(formulario).find('.input_metodo').val();

                $(formulario).addClass('disabled_content');
                bts = $(formulario).find('button[type=submit]').html();
                $(formulario).find('button[type=submit]').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere`);                
                
                $.ajax({
                    url: ruta,
                    method: metodo,
                    data: FrmData,
                    dataType: 'json',
                    success: function(retorno){
                        // si es completado                        
                        alertNotificar(retorno.mensaje, retorno.status);
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                       
                        if(!retorno.error){                                                      
                            ep_cargar_tabla(retorno.lista_data);
                            $(formulario).find('input').val("");
                            $(formulario).find('.btn_cancelar_cat').hide(200);
                            $(formulario).attr('action', $(formulario).attr('data-id'));
                            $(formulario).find('.input_metodo').val("POST");
                        }
                    },
                    error: function(error){                        
                        alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                                         
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });

    function ep_editar_catalogo(iddata_encrypt){

        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/etapaProyecto/${iddata_encrypt}/edit`, function(retorno){

            vistacargando();
            if(!retorno.error){
                $("#ep_descripcion").val(retorno.data.descripcion);
                $("#ep_codigo").val(retorno.data.codigo);
                $("#frm_ep").attr('action', $("#frm_ep").attr('data-id')+'/'+iddata_encrypt);
                $("#frm_ep").find('.input_metodo').val("PUT");
                $("#frm_ep").find('.btn_cancelar_cat').show(200);
            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){            
            vistacargando(); // ocultamos la ventana de espera
            alertNotificar("No se pudo obtener el registro, por favor intente más tarde.");
        });
    }

    function ep_eliminar_catalogo(iddata_encrypt){
        
        swal({
            title: "",
            text: "¿Está seguro que desea eliminar el registro?",
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
                    url: '/controlProyecto/etapaProyecto/'+iddata_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            ep_cargar_tabla(retorno.lista_data);
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo eliminar el registro, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
        
    }

    function ep_cargar_tabla(lista_data){

        var idtabla = "ep_tabla";
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
            data: lista_data,
            columnDefs: [
                { className: "", targets: 0 },
                { className: "", targets: 1 },
                { className: "", targets: 2 }
            ],
            columns:[
                {data: "descripcion" , render : function (item, type, row_data, row){ return row.row+1; } },
                {data: "descripcion" },
                {data: "codigo" },
                {data: "descripcion", render : function (item, type, row_data, row){
                    return (`
                        <button class="btn btn-xs btn-primary" onclick="ep_editar_catalogo('${row_data.idcon_etapaencrypt}')"><i class="fa fa-edit"></i> Editar</button>
                        <button class="btn btn-xs btn-danger" onclick="ep_eliminar_catalogo('${row_data.idcon_etapaencrypt}')"><i class="fa fa-trash"></i> Eliminar</button>  
                    `);
                }}
            ],
            "rowCallback": function( row, proyecto, index ){
                $('td', row).eq(3).css('display', 'flex'); 
            }
        });
        estilo_tabla(idtabla);

    }


//------------------------------------------------------------------------------------------------//
//********************************** GESTION COMPONENTE PROYECTO *********************************//
//------------------------------------------------------------------------------------------------//

    $("#frm_cp").submit(function(e){

        e.preventDefault();
        var formulario = this; // obtenemos el formulacion
        var bts = "";

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

                var FrmData = $(formulario).serialize();
                var ruta = $(formulario).attr('action');
                var metodo = $(formulario).find('.input_metodo').val();

                $(formulario).addClass('disabled_content');
                bts = $(formulario).find('button[type=submit]').html();
                $(formulario).find('button[type=submit]').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere`);                
                
                $.ajax({
                    url: ruta,
                    method: metodo,
                    data: FrmData,
                    dataType: 'json',
                    success: function(retorno){
                        // si es completado                        
                        alertNotificar(retorno.mensaje, retorno.status);
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                       
                        if(!retorno.error){                                                      
                            cp_cargar_tabla(retorno.lista_data);
                            $(formulario).find('input').val("");
                            $(formulario).find('.btn_cancelar_cat').hide(200);
                            $(formulario).attr('action', $(formulario).attr('data-id'));
                            $(formulario).find('.input_metodo').val("POST");
                        }
                    },
                    error: function(error){                        
                        alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                                         
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });

    function cp_editar_catalogo(iddata_encrypt){

        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/componenteProyecto/${iddata_encrypt}/edit`, function(retorno){

            vistacargando();
            if(!retorno.error){
                $("#cp_descripcion").val(retorno.data.descripcion);
                $("#frm_cp").attr('action', $("#frm_cp").attr('data-id')+'/'+iddata_encrypt);
                $("#frm_cp").find('.input_metodo').val("PUT");
                $("#frm_cp").find('.btn_cancelar_cat').show(200);
            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){            
            vistacargando(); // ocultamos la ventana de espera
            alertNotificar("No se pudo obtener el registro, por favor intente más tarde.");
        });
    }

    function cp_eliminar_catalogo(iddata_encrypt){
        
        swal({
            title: "",
            text: "¿Está seguro que desea eliminar el registro?",
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
                    url: '/controlProyecto/componenteProyecto/'+iddata_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            cp_cargar_tabla(retorno.lista_data);
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo eliminar el registro, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
        
    }

    function cp_cargar_tabla(lista_data){

        var idtabla = "cp_tabla";
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
            data: lista_data,
            columnDefs: [
                { className: "", targets: 0 },
                { className: "", targets: 1 },
                { className: "", targets: 2 }
            ],
            columns:[
                {data: "descripcion" , render : function (item, type, row_data, row){ return row.row+1; } },
                {data: "descripcion" },
                {data: "descripcion", render : function (item, type, row_data, row){
                    return (`
                        <button class="btn btn-xs btn-primary" onclick="cp_editar_catalogo('${row_data.idcon_componente_encrypt}')"><i class="fa fa-edit"></i> Editar</button>
                        <button class="btn btn-xs btn-danger" onclick="cp_eliminar_catalogo('${row_data.idcon_componente_encrypt}')"><i class="fa fa-trash"></i> Eliminar</button>  
                    `);
                }}
            ],
            "rowCallback": function( row, proyecto, index ){
                $('td', row).eq(2).css('display', 'flex'); 
            }
        });
        estilo_tabla(idtabla);

    }


//------------------------------------------------------------------------------------------------//
//********************************** GESTION PRIORIDAD PROYECTO **********************************//
//------------------------------------------------------------------------------------------------//

    $("#frm_pp").submit(function(e){

        e.preventDefault();
        var formulario = this; // obtenemos el formulacion
        var bts = "";

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

                var FrmData = $(formulario).serialize();
                var ruta = $(formulario).attr('action');
                var metodo = $(formulario).find('.input_metodo').val();

                $(formulario).addClass('disabled_content');
                bts = $(formulario).find('button[type=submit]').html();
                $(formulario).find('button[type=submit]').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere`);                
                
                $.ajax({
                    url: ruta,
                    method: metodo,
                    data: FrmData,
                    dataType: 'json',
                    success: function(retorno){
                        // si es completado                        
                        alertNotificar(retorno.mensaje, retorno.status);
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                       
                        if(!retorno.error){                                                      
                            pp_cargar_tabla(retorno.lista_data);
                            $(formulario).find('input').val("");
                            $(formulario).find('.btn_cancelar_cat').hide(200);
                            $(formulario).attr('action', $(formulario).attr('data-id'));
                            $(formulario).find('.input_metodo').val("POST");
                        }
                    },
                    error: function(error){                        
                        alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                                         
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });

    function pp_editar_catalogo(iddata_encrypt){

        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/prioridadProyecto/${iddata_encrypt}/edit`, function(retorno){

            vistacargando();
            if(!retorno.error){
                $("#pp_descripcion").val(retorno.data.descripcion);
                $("#frm_pp").attr('action', $("#frm_pp").attr('data-id')+'/'+iddata_encrypt);
                $("#frm_pp").find('.input_metodo').val("PUT");
                $("#frm_pp").find('.btn_cancelar_cat').show(200);
            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){            
            vistacargando(); // ocultamos la ventana de espera
            alertNotificar("No se pudo obtener el registro, por favor intente más tarde.");
        });
    }

    function pp_eliminar_catalogo(iddata_encrypt){
        
        swal({
            title: "",
            text: "¿Está seguro que desea eliminar el registro?",
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
                    url: '/controlProyecto/prioridadProyecto/'+iddata_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            pp_cargar_tabla(retorno.lista_data);
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo eliminar el registro, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
        
    }

    function pp_cargar_tabla(lista_data){

        var idtabla = "pp_tabla";
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
            data: lista_data,
            columnDefs: [
                { className: "", targets: 0 },
                { className: "", targets: 1 },
                { className: "", targets: 2 }
            ],
            columns:[
                {data: "descripcion" , render : function (item, type, row_data, row){ return row.row+1; } },
                {data: "descripcion" },
                {data: "descripcion", render : function (item, type, row_data, row){
                    return (`
                        <button class="btn btn-xs btn-primary" onclick="pp_editar_catalogo('${row_data.idcon_prioridadencrypt}')"><i class="fa fa-edit"></i> Editar</button>
                        <button class="btn btn-xs btn-danger" onclick="pp_eliminar_catalogo('${row_data.idcon_prioridadencrypt}')"><i class="fa fa-trash"></i> Eliminar</button>  
                    `);
                }}
            ],
            "rowCallback": function( row, proyecto, index ){
                $('td', row).eq(2).css('display', 'flex'); 
            }
        });
        estilo_tabla(idtabla);

    }


//------------------------------------------------------------------------------------------------//
//********************************** GESTION ESTADO REVISIÓN ACTIVIDAD ***************************//
//------------------------------------------------------------------------------------------------//

    $("#frm_er").submit(function(e){

        e.preventDefault();
        var formulario = this; // obtenemos el formulacion
        var bts = "";

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

                var FrmData = $(formulario).serialize();
                var ruta = $(formulario).attr('action');
                var metodo = $(formulario).find('.input_metodo').val();

                $(formulario).addClass('disabled_content');
                bts = $(formulario).find('button[type=submit]').html();
                $(formulario).find('button[type=submit]').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere`);                
                
                $.ajax({
                    url: ruta,
                    method: metodo,
                    data: FrmData,
                    dataType: 'json',
                    success: function(retorno){
                        // si es completado                        
                        alertNotificar(retorno.mensaje, retorno.status);
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                       
                        if(!retorno.error){                                                      
                            er_cargar_tabla(retorno.lista_data);
                            $(formulario).find('input').val("");
                            $(formulario).find('.btn_cancelar_cat').hide(200);
                            $(formulario).attr('action', $(formulario).attr('data-id'));
                            $(formulario).find('.input_metodo').val("POST");
                        }
                    },
                    error: function(error){                        
                        alertNotificar("No se pudo realizar el registro, por favor intente más tarde.");
                        $(formulario).removeClass('disabled_content');
                        $(formulario).find('button[type=submit]').html(bts);                                         
                    }
                }); 

            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 

    });

    function er_editar_catalogo(iddata_encrypt){

        vistacargando("M", "Espere...");
        $.get(`/controlProyecto/estadoRevision/${iddata_encrypt}/edit`, function(retorno){

            vistacargando();
            if(!retorno.error){
                $("#er_descripcion").val(retorno.data.descripcion);
                $("#er_codigo").val(retorno.data.codigo);
                $("#frm_er").attr('action', $("#frm_er").attr('data-id')+'/'+iddata_encrypt);
                $("#frm_er").find('.input_metodo').val("PUT");
                $("#frm_er").find('.btn_cancelar_cat').show(200);
            }else{
                alertNotificar(retorno.mensaje, retorno.status);
            }

        }).fail(function(){            
            vistacargando(); // ocultamos la ventana de espera
            alertNotificar("No se pudo obtener el registro, por favor intente más tarde.");
        });
    }

    function er_eliminar_catalogo(iddata_encrypt){
        
        swal({
            title: "",
            text: "¿Está seguro que desea eliminar el registro?",
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
                    url: '/controlProyecto/estadoRevision/'+iddata_encrypt,
                    contentType: false,
                    cache: false,
                    processData:false,
                    success: function(retorno){ 
                        alertNotificar(retorno.mensaje, retorno.status);
                        vistacargando(); // ocultamos la ventana de espera
                        if(!retorno.error){
                            er_cargar_tabla(retorno.lista_data);
                        }
                    },
                    error: function(error){
                        alertNotificar("No se pudo eliminar el registro, por favor intente más tarde.");
                        vistacargando(); // ocultamos la ventana de espera
                    }
                }); 
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
        
    }

    function er_cargar_tabla(lista_data){

        var idtabla = "er_tabla";
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
            data: lista_data,
            columnDefs: [
                { className: "", targets: 0 },
                { className: "", targets: 1 },
                { className: "", targets: 2 }
            ],
            columns:[
                {data: "descripcion" , render : function (item, type, row_data, row){ return row.row+1; } },
                {data: "descripcion" },
                {data: "codigo" },
                {data: "descripcion", render : function (item, type, row_data, row){
                    return (`
                        <button class="btn btn-xs btn-primary" onclick="er_editar_catalogo('${row_data.idcon_estado_revision_encrypt}')"><i class="fa fa-edit"></i> Editar</button>
                        <button class="btn btn-xs btn-danger" onclick="er_eliminar_catalogo('${row_data.idcon_estado_revision_encrypt}')"><i class="fa fa-trash"></i> Eliminar</button>  
                    `);
                }}
            ],
            "rowCallback": function( row, proyecto, index ){
                $('td', row).eq(3).css('display', 'flex'); 
            }
        });
        estilo_tabla(idtabla);

    }
