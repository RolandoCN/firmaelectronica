// $(document).ready(function(){
//     $('#id_tablaformato').DataTable( {
//            "language": {
//                "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
//                            '<option value="5">5</option>'+
//                            '<option value="10">10</option>'+
//                            '<option value="20">20</option>'+
//                            '<option value="30">30</option>'+
//                            '<option value="40">40</option>'+
//                            '<option value="-1">Todos</option>'+
//                            '</select> registros',
//                "search": "Buscar:",
//                "zeroRecords": "No se encontraron registros coincidentes",
//                "infoEmpty": "No hay registros para mostrar",
//                "infoFiltered": " - filtrado de _MAX_ registros",
//                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
//                "paginate": {
//                    "previous": "Anterior",
//                    "next": "Siguiente"
//            }
//        }
// } );
// });

// FUNCION PARA PONER VALORES POR DEFECTO AL FORMATO DEL DOCUMENTO
$('#btn_resetearValores').click(function(){
    // Valores por defecto de la hoja
    $("#p_margin_top").val(110);
    $("#p_margin_right").val(10);
    $("#p_margin_bottom").val(140);
    $("#p_margin_left").val(10);

    //Valores por defecto de la cebecera
    $("#header_top").val(-100);
    $("#header_height").val(100);

    //Valores por defecto del pie de página
    $("#footer_bottom").val(-130);
    $("#footer_height").val(450);

    //Valores por defecto del cuerpo del documento
    $("#main_left").val(40);
    $("#main_right").val(40);
});

function verFormato(){
    $('#content_visualizar').html(`<iframe src="/tdFormato/visualizarFormatoDocumento.pdf" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
    $("#modal_visualizarFormatoDocumento").modal();
}
