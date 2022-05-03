$(document).ready(function () {
    $(`#table_audits`).DataTable({
        pageLength: 10,
        order: [[0,'desc']],
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
        url: '/alcanceDocumento/filtrarAuditoria',
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
    $.each(data['detalle'], function(i, item){
        if(item['fecha_solicitud']!=null){
            var fecha_s=item['fecha_solicitud'];
        }else{
            var fecha_s='------';
        }
        if(item['fecha_cambio']!=null){
            var fecha_c=item['fecha_cambio'];
        }else{
            var fecha_c='------';
        }
        if(item['fecha_aprobacion']!=null){
            var fecha_a=item['fecha_aprobacion'];
        }else{
            var fecha_a='------';
        }
        if(item['fecha_cancela']!=null){
            var fecha_cance=item['fecha_cancela'];
        }else{
            var fecha_cance='------';
        }
        if(item['user_solicita']!=null){
            var user_s=item['usuario_solicita']['name'];
        }else{
            var user_s='------';
        }
        if(item['user_cambio']!=null){
            var user_c=item['usuario_cambia']['name'];
        }else{
            var user_c='------';
        }
        if(item['user_aprueba']!=null){
            var user_a=item['usuario_aprueba']['name'];
        }else{
            var user_a='------';
        }
        if(item['user_cancela']!=null){
            var user_cance=item['usuario_cancela']['name'];
        }else{
            var user_cance='------';
        }
        if(item['doc_anterior']!=null){
            var doc_anterior=`<a type="button" class="btn btn-xs btn-info" href="/buscarDocumento/disksServidorSFTPcambio_documento_auditoria/${item['doc_anterior']}" target="_blank" ><i class="fa fa-eye"></i> Visualizar</a>`;
        }else{
            var doc_anterior='------';
        }
        if(item['doc_nuevo']!=null){
            var doc_nuevo=`<a type="button" class="btn btn-xs btn-info"  href="/buscarDocumentov2/${item['doc_nuevo']}" target="_blank" ><i class="fa fa-eye"></i> Visualizar</a>`;
        }else{
            var doc_nuevo='------';
        }
        var estado='';
        if(item['estado']=='P'){
            estado=`<span class="label lable_estado label-info">Pendiente</span>`;
        }else if(item['estado']=='S'){
            estado=`<span class="label lable_estado label-warning">Subido</span>`;
        }else if(item['estado']=='A'){
            estado=`<span class="label lable_estado label-success">Aprobado</span>`;
        }else if(item['estado']=='C'){
            estado=`<span class="label lable_estado label-danger">Cancelado</span>`;
        }
        if(item['cambio_doc']!=null){
            var cambio=item['cambio_doc']['departamento_cambia']['nombre'];
        }else{
            var cambio ='---------';
        }
       
        $('#audits').append(`<tr role="row" class="odd">
                           <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${fecha_s}
                            </td>
                            <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                ${cambio}
                            </td>
                            <td style=" vertical-align: middle;"  class="paddingTR" >
                                ${user_s}
                            </td>
                            <td style=" vertical-align: middle;"  class="paddingTR">
                                ${fecha_c}
                            </td>
                            <td style=" vertical-align: middle; "  class="paddingTR">
                                ${user_c}
                            </td>
                            <td style="vertical-align: middle; "  class="paddingTR">
                                ${fecha_a}
                            </td>
                            <td style="vertical-align: middle; "  class="paddingTR">
                                ${user_a}
                            </td>
                            <td style="vertical-align: middle; "  class="paddingTR">
                                ${fecha_cance}
                            </td>
                            <td style="vertical-align: middle; "  class="paddingTR">
                                ${user_cance}
                            </td>
                            <td style="vertical-align: middle; text-align:center; font-size:16px "  class="paddingTR">
                                ${estado}
                            </td>
                            <td style="vertical-align: middle; text-align:center  "  class="paddingTR">
                                ${doc_anterior}
                            </td>
                            <td style="vertical-align: middle; "  class="paddingTR">
                                ${doc_nuevo}
                            </td>

                        </tr>  `);

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
    order: [[ 0, "desc" ]],
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
$(`#${idtabla}`).find('.col_sm').css('width','1px');
$(`#${idtabla}`).find('.resp').css('width','150px');  
$(`#${idtabla}`).find('.flex').css('display','flex');   
$('[data-toggle="tooltip"]').tooltip();

}
