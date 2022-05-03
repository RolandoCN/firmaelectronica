function datosempresa(){
	$('#resultadoempresa').hide();
	$('#mensajeRUCbuscar').hide();

	$('#buscarEmpresa').html(`<button disabled=true  type="button"  class="btn btn-primary"><span class="spinner-border " role="status" aria-hidden="true"></span> Buscando</button>`);  

	 $.get('/comprobantes/datosEmpresa/'+$('#rucBuscar').val(), function (data) { 
	 	if(data['error']==true){
      $('#mensajeRUCbuscar').html(`<label class="control-label col-md-3 col-sm-3 col-xs-12" for="nombre_menu"></label>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <div class="alert alert-info alert-dismissible fade in" role="alert" style="margin-bottom: 0;">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                            </button>
                                            <strong>Información: </strong> No existe registro con este RUC
                                        </div>
                                    </div>`);
	 		$('#mensajeRUCbuscar').show(200);
	 	}
	 	if(data['error']==false){
		 	
		 	$('#razonsocialResul').html(data['detalle']['razonSocial']);
		 	$('#logoResul').html(`<img  src="data:image/png;base64, ${data['detalle']['logo']}" width="40%">`);
		 	$('#resultadoempresa').show(200);
	 	}	
		$('#buscarEmpresa').html(`<button type="button"  onclick="datosempresa()" class="btn btn-success"><i class="fa fa-search"></i>  Aceptar</button>`);  

	 });
}

$("#rucBuscar").keypress(function(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code==13){
    e.preventDefault();
    datosempresa();
  }
});

$('#rucEmpresa').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});
$('#rucBuscar').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});
$('#rucEmpresaCerti').on('input', function() {
   this.value = this.value.replace(/[^0-9]/g,'');
});
