    
    var lenguajeTablarp = {
        "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                    '<option value="5">5</option>'+
                    '<option value="10">10</option>'+
                    '<option value="20">20</option>'+
                    '<option value="30">30</option>'+
                    '<option value="40">40</option>'+
                    '<option value="-1">Todos</option>'+
                    '</select> registros',
        "search": "Buscar:",
        "searchPlaceholder": "Criterio de búsqueda",
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
        $(`#tableProyectos`).DataTable({
            pageLength: 10,
            order: [[0,'desc']],
            "language": lenguajeTablarp
        });
    });



$('#frm_Proyecto').submit(function(){
        event.preventDefault();

        if( (new Date($('#fecha_inicio').val()).getTime() > new Date($('#fecha_fin').val()).getTime()))
        {
          alertNotificar('Por favor verifique las fechas de inicio y fin del proyecto.', "error");
            return;
        }

        if($('#tipoP').val()==0){
            alertNotificar('Seleccione el tipo de proyecto', "error");
            return;
        }
        if($('#prioridadP').val()==0){
            alertNotificar('Seleccione la prioridad del proyecto', "error");
            return;
        }
        if($('#componenteP').val()==0){
            alertNotificar('Seleccione el componente del proyecto', "error");
            return;
        }

        if($('#cmb_departamento').val()==0){
            alertNotificar('Seleccione el o los departamentos del proyecto', "error");
            return;
        }
        

        $('#btnGuardar').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Registrando Proyecto`); 
        $('#btnGuardar').prop('disabled',true); 
        
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: '/controlProyecto/registro',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            success: function(data){
                
                if(data['error']==true){
                    $('#btnGuardar').prop('disabled',false); 
                    $('#btnGuardar').html(`<span class="fa fa-save"></span> <b>Registrar proyecto</b>`); 
                    alertNotificar(data['detalle'], "error");
                    return;
                }
                if(data['error']==false){
                    listaproyectos('I');
                }

                
        },
        error: function(e){
            $('#btnGuardar').prop('disabled',false); 
            $('#btnGuardar').html(`<span class="fa fa-save"></span> <b>Registrar proyecto</b>`); 
            alertNotificar(data['detalle'], "error");
            return;
        }
    });
});

function cargartablejs(data){
    $('#tbodyProyectos').html('');
    $('#tableProyectos').DataTable({
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[0,'desc']],

         columns:[
         {data: "fechaCreacion"},
         {data: "descripcion" },
         {data: "codigo"},
         {data: "codigo"},
         {data : "fechaInicio"},
         {data : "antecedente"},
         {data : "total"},
         {data : "idcon_etapa"},
         {data: "codigo"},
         ],
         "rowCallback": function( row, detalle, index ){
            $('td', row).eq(2).html(`
                <span style="display: flex; line-height: inherit;"><i class="fa fa-tag" style="color: green"></i>     <b style="padding: 0px 2px 0px 3px;">Tipo: </b> ${detalle['tipo_proyecto']['descripcion']}</span>
                <span style="display: flex; line-height: inherit;"><i class="fa fa-clone" style="color: orange"></i>  <b style="padding: 0px 2px 0px 3px;">Prioridad: </b> ${detalle['prioridad']['descripcion']}</span>
                <span style="display: flex; line-height: inherit;"><i class="fa fa-group" style="color: #061079"></i> <b style="padding: 0px 2px 0px 3px;">Componente: </b> ${detalle['componente']['descripcion']}</span>
            `);
             $('td', row).eq(3).html('');
             $.each(detalle['dep_responsable'],function(i,item){
                $('td', row).eq(3).append(`
                        <div class="panel panel-default"> <i style="color:#061079" class="fa fa-home"></i> ${item['departamento']['nombre']}</div>
                `);
             });

             $('td', row).eq(4).html(`
                    ${detalle['fechaInicio']}<br> - <br>${detalle['fechaFin']}
            `);
             $('td', row).eq(6).css('text-align','right');
             $('td', row).eq(6).html(`
                   <b> $ ${detalle['total']}</b>
            `);
             if(detalle['etapa']['codigo']=='EJ'){
                var classbtn='success';
             }else if(detalle['etapa']['codigo']=='PD'){
                var classbtn='danger';
             }else if(detalle['etapa']['codigo']=='EE'){
                var classbtn='info';
             }else if(detalle['etapa']['codigo']=='PE'){
                var classbtn='warning';
             }   
            $('td', row).eq(7).html(`
                    <button style="border-radius: 10px" type="button" class="btn btn-${classbtn} btn-xs btn_status">${detalle['etapa']['descripcion']} </button>
            `);
            $('td', row).eq(7).css('text-align','center');

            $('td', row).eq(8).html(`<div align="center">
                <button onclick="editarProyectos('${detalle['idcon_proyecto_encrypt']}')" class="btn btn-xs btn-info"><span class="fa fa-edit"></span> </button> 
                <button onclick="eliminacionProyecto('${detalle['idcon_proyecto_encrypt']}')" class="btn btn-xs btn-danger"><span class="fa fa-trash"></span> </button>
                <button  data-toggle="tooltip" data-placement="top" title="Detalle del proyecto " onclick="mostrar_detalle_proyecto('${detalle['idcon_proyecto_encrypt']}')" class="btn btn-xs btn-warning"><span class="fa fa-eye"></span> </button></div>
            `);
           
         } 

         })
     }

//status E=eliminar
function listaproyectos(status){
    $.get('/controlProyecto/listaProyectos',function(data){
        if(status=='E'){
            cargartablejs(data['detalle']);
            alertNotificar('Proyecto eliminado exitosamente','success');
            vistacargando();
        }else if(status=='I'){
            $('#btnGuardar').prop('disabled',false); 
            $('#btnGuardar').html(`<span class="fa fa-save"></span> <b>Registrar proyecto</b>`);
            cargartablejs(data['detalle']);
            alertNotificar('Proyecto registrado exitosamente', "success");

        }else if(status=='A'){
            $('#btn_P_cancelar').remove(); 
            $('#btnActualizarP').remove();
            $('#botonesForm').html(`
             <button type="submit" id="btnGuardar" class="btn btn-info"><span class="fa fa-save"></span>  <b>Registrar proyecto</b></button>
            `);
            cargartablejs(data['detalle']);
            alertNotificar('Proyecto actualizado exitosamente', "success");
        }
        limpiarcampos();
    });
}

//
function eliminacionProyecto(id){
        swal({
            title: "",
            text: "¿Está seguro de eliminar este proyecto?",
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
                acccioneliminarProyecto(id);
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
}

function acccioneliminarProyecto(id){
    vistacargando("M",'Eliminando Proyecto');
    $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

    $.ajax({
        type: "DELETE",
        url: '/controlProyecto/registro/'+id,
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){ 
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                return;
            }
            if(data['error']==false){
                listaproyectos('E');

                
            }
        }
    }); 
}

function editarProyectos(id){
    vistacargando('M','Cargando Información');
    $.get('/controlProyecto/registro/'+id+'/edit',function(data){
        
      
        $('#codigoP').val(data['detalle']['codigo']);
        $('#descripcionP').val(data['detalle']['descripcion']);
        $('#antecedentesP').val(data['detalle']['antecedente']);
        $('#antecedentesP').val(data['detalle']['antecedente']);
        $('#totalP').val(data['detalle']['total']);
        $('#fecha_inicio').val(data['detalle']['fechaInicio']);
        $('#fecha_fin').val(data['detalle']['fechaFin']);
        //combo tipo
        $('.optiontipoP').prop('selected',false); 
        $(`#tipoP option[data-id="${data['detalle']['idcon_tipoProyecto']}"]`).prop("selected", true);
        $("#tipoP").trigger("chosen:updated"); 
        //combo prioridad
        $('.optionPrioridadP').prop('selected',false); 
        $(`#prioridadP option[data-id="${data['detalle']['idcon_prioridad']}"]`).prop("selected", true);
        $("#prioridadP").trigger("chosen:updated"); 
        //combo componente
        $('.optionComponenteP').prop('selected',false); 
        $(`#componenteP option[data-id="${data['detalle']['idcon_componente']}"]`).prop("selected", true);
        $("#componenteP").trigger("chosen:updated"); 

        //combo departamentos
        $('.optionDepartamento').prop('selected',false); 
        $.each(data['detalle']['dep_responsable'],function(i,item){
            $(`#cmb_departamento option[data-id="${item['iddepartamento']}"]`).prop("selected", true);
        });
        $("#cmb_departamento").trigger("chosen:updated"); 
        // $('#btn_PDOT_cancelar').hide();
        // $('#btncerrarModal').hide();
        // $('#btnguardarPDOT').hide();
        // $('#btnActualizarPDOT').hide();
        $('#botonesForm').html(`
                            <button  onclick="actualizarProyecto('${id}')" id="btnActualizarP" class="btn btn-warning "><span class="fa fa-save"></span>  <b>Actualizar Proyecto</b></button>
                            <button onclick="cancelarProyecto()" type="button" id="btn_P_cancelar" class="btn btn-danger "><span class="fa fa-times"></span> <b>Cancelar</b></button>`);
        vistacargando();
        });
}

function cancelarProyecto(){
        limpiarcampos();
        $('#btn_P_cancelar').remove();
        $('#botonesForm').html(`
         <button type="submit" id="btnGuardar" class="btn btn-info"><span class="fa fa-save"></span>  <b>Registrar proyecto</b></button>
        `);
}


function actualizarProyecto(id){
    if( (new Date($('#fecha_inicio').val()).getTime() > new Date($('#fecha_fin').val()).getTime()))
    {
      alertNotificar('Por favor verifique las fechas de inicio y fin del proyecto.', "error");
        return;
    }

    if($('#tipoP').val()==0){
        alertNotificar('Seleccione el tipo de proyecto', "error");
        return;
    }
    if($('#prioridadP').val()==0){
        alertNotificar('Seleccione la prioridad del proyecto', "error");
        return;
    }
    if($('#componenteP').val()==0){
        alertNotificar('Seleccione el componente del proyecto', "error");
        return;
    }

    if($('#cmb_departamento').val()==0){
        alertNotificar('Seleccione el o los departamentos del proyecto', "error");
        return;
    }
    $('#btnActualizarP').html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Actualizando Proyecto`); 
    $('#btnActualizarP').prop('disabled',true); 
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
           
            $.ajax({
                type: "PUT",
                url: '/controlProyecto/registro/'+id,
                data: { 
                    codigoP:$('#codigoP').val(),
                    descripcionP: $('#descripcionP').val(),
                    tipoP: $('#tipoP').val(),
                    prioridadP: $('#prioridadP').val(),
                    componenteP: $('#componenteP').val(),
                    cmb_departamento: $('#cmb_departamento').val(),
                    fecha_inicio: $('#fecha_inicio').val(),
                    fecha_fin: $('#fecha_fin').val(),
                    antecedentesP: $('#antecedentesP').val(),
                    totalP: $('#totalP').val()
                },

                success: function(data){ 
                        if(data['error']==true){
                            $('#btnActualizarP').html(` Actualizar`);
                            $('#btnActualizarP').prop('disabled',false); 
                            $('#btnActualizarP').html(`<span class="fa fa-save"></span> <b>Actualizar proyecto</b>`); 
                            alertNotificar(data['detalle'], "error");
                            return;
                        }
                        if(data['error']==false){
                             listaproyectos('A');
                        }
                }
            });
        
}
function limpiarcampos(){
    $('#codigoP').val('');
    $('#prioridadP').val('');
    $('#antecedentesP').val('');
    $('#descripcionP').val('');
    $('#totalP').val('');
    $('#codigoP').val('');
    $('.optionPrioridadP').prop('selected',false); 
    $("#prioridadP").trigger("chosen:updated");
    $('.optionComponenteP').prop('selected',false); 
    $("#componenteP").trigger("chosen:updated");
    $('.optiontipoP').prop('selected',false); 
    $("#tipoP").trigger("chosen:updated");
    $('.optionDepartamento').prop('selected',false); 
    $("#cmb_departamento").trigger("chosen:updated");
}


