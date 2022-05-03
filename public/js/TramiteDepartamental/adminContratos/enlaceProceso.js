

    $(document).ready(function () {
        updateTable('tabla_usuario_contratos');
        updateTable('tabla_tramites');
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


    function updateTable(idtabla){
        $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});
        
        $("#"+idtabla).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            pageLength: 10,
            "language": {
                "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                            '<option value="5">5</option>'+
                            '<option value="10">10</option>'+
                            '<option value="15">15</option>'+
                            '<option value="20">20</option>'+
                            '<option value="30">30</option>'+
                            '<option value="-1">Todos</option>'+
                            '</select> registros',
                "search": "<b><i class='fa fa-search'></i> Buscar: </b>",
                "searchPlaceholder": "Ejm: 00342",
                "zeroRecords": "No se encontraron registros coincidentes",
                "infoEmpty": "No hay registros para mostrar",
                "infoFiltered": " - filtrado de MAX registros",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente"
                }
            }
        });
    }


    $(document).ready(function () {
        $.get('/adminContratos/listaAdministradores',function(data){
            cargarTablaAdministradores(data['detalle']);
        });
    });



    $("#frm_buscar_Proceso").submit(function(event){
            
        event.preventDefault();
        if($('#cmb_usuario').val()==0){
            alertNotificar('Por favor seleccione el usuario','warning');
            return;
        }

        var formulario = this; // obtenemos el formulacion

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var FrmData = new FormData(formulario);
        var btn_submit = $(formulario).find('[type=submit]');
        var txt_submit = $(btn_submit).html();
        $(formulario).addClass('disabled_content');
        $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);
        
        $.ajax({
            url: `/adminContratos/buscarProceso`,
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

                vistacargando();
                if(retorno.error){
                   alertNotificar(retorno.resultado.mensaje, "error");
                }else{
                    cargarTablaBusqueda(retorno.resultado.listaTramite);
                }

            },
            error: function(error){
                $(formulario).removeClass('disabled_content');
                $(btn_submit).html(txt_submit);
                alertNotificar("No se pudo realizar la petición, por favor intente más tarde.", "error");                    
            }
        });

    });



    function cargarTablaBusqueda(listaTramite){
        // cargamos los datos a la tabla
        var tablatramite = $('#tabla_tramites').DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "desc" ]],
            pageLength: 10,
            sInfoFiltered:false,
            language: lenguajeTabla,
            data: listaTramite,
            columnDefs: [
                {  className: "todo_mayus", targets: 0 },
                {  className: "todo_mayus", targets: 1 },
                {  className: "todo_mayus", targets: 2 },
            ],
            columns:[
                { data: "codTramite" },
                { data: "fechaCreacion" },
                { data: "codTramite" },
                { data: "asunto" }, 
                { data: "idtramite" },                                
            ],

              "rowCallback": function( row, detalle, index ){  
                  
                //cargamos el índice de la columna
                $('td', row).eq(0).html(`<center>${index+1}</center>`);
                $('td', row).eq(2).css(`background-color`,'#E1FCAE');
                $('td', row).eq(4).html(`
                    <div align="center">
                        <button onclick="asignarContrato('${detalle['idtramite']}','${$('#cmb_usuario').val()}')" class="btn btn-sm btn-success">Asignar <span class="fa fa-arrow-right"></span></button>
                    </div>
                `);
            }
                                      
        });

        // quitamos la clase solo "bg-warning" y "todo_mayus" solo en la cabecera
        var columnas = $(tablatramite.table().header()).children('tr').find('th');
        $(columnas.eq(0)).css({'width':'1px'});
        $(columnas.eq(4)).css({'width':'1px'});
        $(columnas).removeClass('bg-warning');
        $(columnas).removeClass('todo_mayus');
        console.warn("Tabla de trámites actualizada");
    }


    function cargarTablaAdministradores(listaProcesos){
        // cargamos los datos a la tabla
        // console.log(listaProcesos);
        var tablatramite = $('#tabla_usuario_contratos').DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 4, "desc" ]],
            pageLength: 10,
            sInfoFiltered:false,
            language:lenguajeTabla ,
            data: listaProcesos,
            columnDefs: [
                {  className: "todo_mayus", targets: 0 },
                {  className: "todo_mayus", targets: 1 },
                {  className: "todo_mayus", targets: 2 },
                {  className: "todo_mayus", targets: 3 },
                {  className: "todo_mayus", targets: 4 },

            ],
            columns:[
                { data: "us001.name" },
                { data: "tramite.codTramite" },
                { data: "codigo" },
                { data: "objeto_contratacion" },
                { data: "idadmin_contrato" },

            ],

              "rowCallback": function( row, detalle, index ){  
                $('td', row).eq(4).html(`<div align="center"><button onclick="eliminacionAdmin('${detalle['idadmin_contrato']}')" class="btn btn-sm btn-danger"><span class="fa fa-times"></span> </button></div>`);



            }
                                      
        });

        // quitamos la clase solo "bg-warning" y "todo_mayus" solo en la cabecera
        var columnas = $(tablatramite.table().header()).children('tr').find('th');
        $(columnas.eq(0)).css({'width':'1px'});
        $(columnas.eq(3)).css({'width':'1px'});
        $(columnas).removeClass('bg-warning');
        $(columnas).removeClass('todo_mayus');
        // console.warn("Tabla de trámites actualizada");
    }

    //funcion para preguntar el codigo y objeto del administrador de contratos
    function asignarContrato(idtramite, idusuario){
        swal({
            title: "¡Todos los campos son obligatorios!",
            html: true,
            text: `<input id="codigo_contrato" placeholder="Ingrese el código de contrato" class="form-control" type="text"><br><textarea  rows="6" style="resize:none" placeholder="Ingrese el objeto de contratacion" class="form-control" cols="50" id="objeto_contratacion"></textarea>`,
            // type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            inputPlaceholder: "Escribir aquí",
            confirmButtonClass: "btn-sm btn-success",
            cancelButtonClass: "btn-sm btn-default",
            confirmButtonText: "Asignar",
            cancelButtonText: "Cancelar",
        }, function () {
            if ($('#codigo_contrato').val()=='' || $('#objeto_contratacion').val()==''){
                alertNotificar('Por favor llenar todos los campos','error'); 
                return false;
            }
            // if (codigo === "") {
            //   swal.showInputError("Campo requerido!");
            //   return false
            // }
            guardarAdminContrato(idtramite, $('#codigo_contrato').val(),$('#objeto_contratacion').val(), idusuario);
            sweetAlert.close();        
        });
    }


    function guardarAdminContrato(idtramite,codigo,objeto,idusuario){
        vistacargando('M','Por Favor Espere..');
        // console.log(codigo);
        // event.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: `/adminContratos/enlaceProceso`,
            method: "POST",
            data: {
                'idtramite':idtramite,
                'codigo':codigo,
                'objeto':objeto,
                'idusuario':idusuario},
            success: function(retorno){

                vistacargando();
                if(retorno.error){
                   alertNotificar(retorno.detalle, "error");
                }else{
                    cargarTablaAdministradores(retorno['listaAdministradores']);
                    alertNotificar(retorno.detalle, "success");

                }
                vistacargando();
            },
            error: function(error){
                alertNotificar("No se pudo realizar la petición, por favor intente más tarde.", "error");    
                vistacargando();                
            }
        });
    }

    function eliminacionAdmin(id){
        swal({
            title: "",
            text: "¿Está seguro de eliminar este Administrador de Contraro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-sm btn-info",
            cancelButtonClass: "btn-sm btn-danger",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que si
                acccioneliminarAdministrador(id);
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    }

function acccioneliminarAdministrador(id){
    vistacargando("M",'Eliminando..');
    $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

    $.ajax({
        type: "DELETE",
        url: '/adminContratos/enlaceProceso/'+id,
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){ 
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                return;
            }
            if(data['error']==false){
                cargarTablaAdministradores(data['listaAdministradores']);
                alertNotificar(data['detalle'], "success");
            }
            vistacargando();
        }
    }); 
}
    
