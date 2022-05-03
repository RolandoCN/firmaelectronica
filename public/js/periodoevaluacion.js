    function cargarevaluacion(){
        var idperiodio=$('#SelecteriodoPoa').val();
        vistacargando('M',"Espere..."); // mostramos una ventana de carga
        $('#tb_listaEvaluacion').html('');
        $.get("/gestionEvaluacionPoa/evaluacProyecto/"+idperiodio, function (data) {
            console.log(data);
            if(data['error']==false){   
            cargartablejs(data['detalle']);          
                // $.each(data['detalle'],function(i,item){
                // $('#tb_listaEvaluacion').append(`<tr role="row" class="odd">
                //                             <td>${item['fecha_inicio']}</td>
                //                             <td>${item['fecha_fin']}</td>
                //                             <td>${item['numero']}</td>
                //                             <td>${item['estadoEval']}</td>
                //                             <td><div clas="row"> <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12"><button type="button"  class="btn btn-sm btn-primary marginB0"><i class="fa fa-edit"></i> Editar</button></div>
                //                             <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12 "><button type="button"  class="btn btn-sm btn-success marginB0"><i class="fa fa-hand-pointer-o"></i> Evaluar</button></div></div></td></tr>`)
                // });
            }
           
           
            // $("#SelecSector").trigger("chosen:updated"); // actualizamos el combo de sector
            vistacargando(); // ocultamos la ventana de carga

        }).fail(function(error){
            vistacargando(); // ocultamos la ventana de carga
        });
    }


function cargartablejs(data){
     $('#idtable_evaluacion').DataTable({
         // dom: ""
         // +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
         // +"<rt>"
         // +"<'row'<'form-inline'"
         // +" <'col-sm-6 col-md-6 col-lg-6'l>"
         // +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
         "destroy":true,
         pageLength: 10,
         sInfoFiltered:false,
         data: data,
         order: [[1,'asc']],
         columnDefs: [
         { className: "todo_mayus", targets: 0 },
         { className: "todo_mayus", targets: 1 },
         { className: "todo_mayus", targets: 2 },
         { className: "todo_mayus", targets: 3 },
         { className: "todo_mayus", targets: 4 },
         ],
         columns:[
         {data: "periodo" },
         {data: "numero"},
         {data : "estadoEval",
         // render : function (estadoEval, type, row) {
         // return estadoEval == 'Creacion' ? '<span style="background-color:red">'+estadoEval+'</span>' : '<span style="background-color:blue">'+estadoEval+'</span>'
         // }
         },
         {data: "periodoevaluacion"},
         {data: "numero" },
         ],
         "rowCallback": function( row, detalle, index ){
         
          if(detalle['estadoEval']=='Creacion'){
            
            $('td', row).eq(4).html(`<button type="button" onclick="showModal('${detalle['idevaluacion_poa_encrypt']}')"  class="btn btn-sm btn-warning marginB0"><i class="fa fa-hand-pointer-o"></i> Evaluar</button>`);
          }else if(detalle['estadoEval']=='Evaluacion'){
            var color='#ffeeba';
            $('td', row).eq(4).html(`<button type="button" onclick="showModalEditar('${detalle['idevaluacion_poa_encrypt']}')"  class="btn btn-sm btn-primary marginB0"><i class="fa fa-edit"></i> Editar</button>
                                                <button type="button" onclick="finalizar('${detalle['idevaluacion_poa_encrypt']}')"  class="btn btn-sm btn-success marginB0"><i class="fa fa-check"></i> Finalizar</button>`);
          }else{
            $('td', row).eq(4).html(`<i style="font-size: 180%; color: green" class="fa fa-check-circle-o" aria-hidden="true"></i>`);
            var color='#c3e6cb';
            $('td', row).eq(4).css('text-align','left');
          }
          $('td', row).eq(0).css('background-color',color);
          $('td', row).eq(1).css('background-color',color)
          $('td', row).eq(2).css('background-color',color)
          $('td', row).eq(3).css('background-color',color)
          $('td', row).eq(4).css('background-color',color)
          $('td', row).eq(4).css('text-align','center');
         } 

    })
}

function showModal(id){
    $('#info').hide();
    $('#fechaInicio').val('');
    $('#fechaFin').val('');
    $('#idevaluacion').val(id);
    $('#modalperiodoEvaluacion').modal();
}

function showModalEditar(id){
    $('#fechaInicio').val('');
    $('#fechaFin').val('');
    vistacargando('M',"Espere..."); // mostramos una ventana de carga
    $('#info').hide();
    $('#idevaluacion').val(id);
    $.get("/gestionEvaluacionPoa/editarperiodoEvaluacion/"+id, function (data) {
        vistacargando();
         $('#fechaInicio').val(data['detalle']['fecha_inicio']);
         $('#fechaFin').val(data['detalle']['fechafinEval']);
    });
    $('#modalperiodoEvaluacion').modal();
}


$('#formabrirEvaluacion').submit(function (e) {

        e.preventDefault();
        vistacargando('M',"Espere..."); // mostramos una ventana de carga
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: "POST",
            url: '/gestionEvaluacionPoa/storeperiodoEvaluacion',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            success: function(data){
                // console.log(data);
                if(data['error']==false){
                   $('#modalperiodoEvaluacion').modal('hide');
                   cargartablejs(data['detalle']);
                    vistacargando(); 
                }else
                {
                    vistacargando(); 
                    $('#info').html(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong>  ${data['detalle']}
                    </div>`);
                    $('#info').show(200);
                   
                }
        
            },
        });
});

function finalizar(id){
    swal({
            title: "",
            text: "¿Está seguro que desea finalizar",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            cancelButtonClass: "btn-danger",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que si
            vistacargando('M',"Espere..."); // mostramos una ventana de carga
            $.get("/gestionEvaluacionPoa/finalizarperiodoEvaluacion/"+id, function (data) {
                if(data['error']==false){
                   $('#modalperiodoEvaluacion').modal('hide');
                   cargartablejs(data['detalle']);
                    vistacargando(); 
                }
            });
                       
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
    
}