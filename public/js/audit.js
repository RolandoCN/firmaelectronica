   $(document).ready(function () {
        $(`#table_audits`).DataTable({
            pageLength: 10,
            order: [[4,'desc']],
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
                "infoFiltered": " - filtrado de MAX registros",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente"
                }
            }
        });
    });


    $('#filtrar_audit').submit(function(e){
        e.preventDefault();
        vistacargando('M','Por favor espere...');
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

		$.ajax({
			type: "POST",
			url: '/filtrarAuditoria',
			data: new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
			success: function(data){
				console.log(data);
				if(data['error']==true){
					alertNotificar(data['detalle'], "error");
					
				}
				if(data['error']==false){
					cargartable(data);
                    vistacargando();
				}
		},
		error: function(e){
  	 		alertNotificar('Ocurrió un error intente nuevamente', "error");
			return;
	    }
	});


    function cargartable(data){
        $('#audits').html('');
        $("#table_audits").DataTable().destroy();
        $('#table_audits tbody').empty();
        contadorGenerado=0;
        $.each(data['detalle'], function(i, item){
            
            if(item['user']!=null){
                var user=item['user']['name'];
            }else{
                var user='Creado por sistema';
            }
            $('#audits').append(`<tr role="row" class="odd">
                         
                           
                               <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['auditable_type']} (id: ${item['auditable_id']})
                                </td>
                                <td  width="1%" colspan="1">
                                    ${item['event']}
                                </td>
                                <td style=" vertical-align: middle;"  class="paddingTR">
                                    ${user}
                                </td>
                                <td style=" vertical-align: middle; "  class="paddingTR">
                                    ${item['ip_address']}
                                </td>
                                <td style="vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['created_at']}
                                </td>
                                <td>
                                    <table id="table_old${i}" class="table"></table>
				                </td>
                                <td>
                                <table id="table_new${i}" class="table"></table>

                                </td>
                                
                            </tr>  `);

                            $.each(item['old_values'], function(i_old, item_old){
                                if(i_old!='firma_conductor'){
                                $(`#table_old${i}`).append(`<tr>
                                    <td><b>${i_old}</b></td>
                                    <td width="10px">${item_old}</td>
                                </tr>`);
                                }
                            });
                            $.each(item['new_values'], function(i_new, item_new){
                                if(i_new!='firma_conductor'){
                                $(`#table_new${i}`).append(`<tr>
                                <td><b>${i_new}</b></td>
                                <td width="10px">${item_new}</td>
                                </tr>`);
                                }
                            });
    
        });



        cargar_estilos_tabla("table_audits");
       
    
    }
    
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

function cargar_estilos_tabla(idtabla){

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
        dom: 'Bfrtip',
        buttons: [
            'print'
        ]
    });

    // para posicionar el input del filtro
    // $(`#${idtabla}_filter`).css('float', 'left');
    // $(`#${idtabla}_filter`).children('label').css('width', '100%');
    // $(`#${idtabla}_filter`).parent().css('padding-left','0');
    // $(`#${idtabla}_wrapper`).css('margin-top','10px');
    // $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
    // $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
    // //buscamos las columnas que deceamos que sean las mas angostas
    // $(`#${idtabla}`).find('.col_sm').css('width','1px');
    // $(`#${idtabla}`).find('.resp').css('width','150px');  
    // $(`#${idtabla}`).find('.flex').css('display','flex');   
    // $('[data-toggle="tooltip"]').tooltip();
    
}
   