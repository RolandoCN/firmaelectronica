
function add(){
    $('#addImpuestos').append('<input type="input" class="form-control" id="impuesto'+$('#impuestos').val()+'" name="impuestos'+$('#impuestos').val()+'" disabled>');
    $('#impuesto'+$('#impuestos').val()).val($('#impuestos').val());
}
