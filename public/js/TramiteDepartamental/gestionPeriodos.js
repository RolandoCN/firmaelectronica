
// funciona para cargar los periodos en la ventana modal de gestion de periodos
function gestionar_periodos() {
    $.get("/periodo/gestion",function(lista_periodos){
        // recorremos todos los periodos obtenidos en la consulta
        // para cargarlos en la tabla de periodos
        $("#tbody_periodos").html("");
        $.each(lista_periodos, function (i, periodo){
            var estado="Desactivo"; // D: Periodo Desactivado por defecto
            if(periodo.estado=="A"){estado="Activo"}; //A: periodo Acivo 
            $("#tbody_periodos").append(`
                <tr>
                    <th>${i+1}</th>
                    <td>${periodo.fecha_inicio}</td>
                    <td>${periodo.fecha_fin}</td>
                    <td>${estado}</td>
                    <td>
                        <button onclick="eliminarPeriodo(${periodo.idperiodo})" class="btn btn-sm btn-danger btn_tabla"><i class="fa fa-trash-o"></i> Eliminar</button>
                        <button onclick="editarPeriodo(${periodo.idperiodo})" class="btn btn-sm btn-primary btn_tabla"> <i class="fa fa-edit"></i> Editar</button>
                    </td>
                </tr>
            `);
        });
    });
}

// METODO PARA GUARDAR UN NUEVO PERIODO
function guardarPeriodo(){

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.post("/periodo/gestion",
    {
        fecha_inicio: $('#fecha_inicio').val(),
        fecha_fin: $('#fecha_fin').val(),
        estado: $('#estado_periodo').val()
    },
    function(request){
        vistacargando(); // ocultamos la vista de carga
        
        new PNotify({
            title: 'Mensaje de Información',
            text: request.mensaje,
            type: request.status,
            hide: true,
            delay: 2000,
            styling: 'bootstrap3',
            addclass: ''
        });
        // recargamos la tabla de periodos
        gestionar_periodos();

    });
}

// METODO PARA EDITAR (MODIFICAR) UN PERIODO ESPECIFICO
function editarPeriodo(idperiodo) {
    $.get(`/periodo/gestion/${idperiodo}/edit`,function(periodo){
        
        //agregamos la fecha de inicio en el input
        $('#fecha_inicio').val(periodo.fecha_inicio);
        // $('#fecha_inicio').keyup(); // actulizamos la seleciona en el cuadro de fecha de inicio

        //agergamos la fecha final en el input
        $('#fecha_fin').val(periodo.fecha_fin);
        // $('#fecha_fin').keyup(); // actulizamos la seleciona en el cuadro de fecha de fin

        $('#estado_periodo').val(periodo.estado);

        // cambiamos el metodo del boton guardar para que modifique el periodo seleccionado
        $('#btn_guardarPeriodo').attr('onclick',`actulizarPeriodo(${periodo.idperiodo})`);
        $('#btn_guardarPeriodo').html('<i class="fa fa-thumbs-up"></i> Guardar');

        // mostramos el boton de cancelar una ediccion de periodo
        $('#btn_cancelarPeriodo').removeClass('hidden');

    });
}

// METODO PARA ACTULIZAR UN PERIODO ESPECIFICO
function actulizarPeriodo(idperiodo) {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    vistacargando('M','Espere...'); // mostramos la ventana de espera
    $.ajax({
        url: '/periodo/gestion/'+idperiodo,
        type: 'PUT',
        data:{
            fecha_inicio: $('#fecha_inicio').val(),
            fecha_fin: $('#fecha_fin').val(),
            estado: $('#estado_periodo').val()
        },
        success: function(request) {
            vistacargando(); // ocultamos la vista de carga
        
            new PNotify({
                title: 'Mensaje de Información',
                text: request.mensaje,
                type: request.status,
                hide: true,
                delay: 2000,
                styling: 'bootstrap3',
                addclass: ''
            });
            // recargamos la tabla de periodos
            gestionar_periodos();
        }
    });
}

// METODO PARA ELIMINAR UN PERIODO ESPECIFICO
function eliminarPeriodo(idperiodo){
    if(!confirm("Esta seguro que quiere eliminar el periodo")){
        return;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        url: '/periodo/gestion/'+idperiodo,
        type: 'DELETE',
        success: function(request){      
            new PNotify({
                title: 'Mensaje de Información',
                text: request.mensaje,
                type: request.status,
                hide: true,
                delay: 2000,
                styling: 'bootstrap3',
                addclass: ''
            });
            // recargamos la tabla de periodos
            gestionar_periodos();
        }
    });
}

// METODO PARA LIMPIAR SI UN PERIODO ESTA SELECCIONADO
function cancelarPeriodo(){

    var fecha_actual = $('#fecha_inicio').attr('data-id');
    var fecha_fin = $('#fecha_fin').attr('data-id');

    // deseleccionamos las fechas editadas

            //agregamos la fecha de inicio en el input
            $('#fecha_inicio').val(fecha_actual);
            // $('#fecha_inicio').keyup(); // actulizamos la seleciona en el cuadro de fecha de inicio
    
            //agergamos la fecha final en el input
            $('#fecha_fin').val(fecha_fin);
            // $('#fecha_fin').keyup(); // actulizamos la seleciona en el cuadro de fecha de fin

    // seleccionanos el estado de periodo por defecto
    $('#estado_periodo').val("");

    // cambiamos el metodo del boton guardar para que guarde el periodo seleccionado
    $('#btn_guardarPeriodo').attr('onclick','guardarPeriodo()');
    $('#btn_guardarPeriodo').html('<i class="fa fa-cloud-upload"></i> Registrar');

    // ocultamos el boton de cancelar una ediccion de periodo
    $('#btn_cancelarPeriodo').addClass('hidden');
}


