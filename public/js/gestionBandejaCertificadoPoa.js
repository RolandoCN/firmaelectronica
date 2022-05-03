//evento del select de la lista de periodo
function selectBuscarDepa() {
    var url=window.location.protocol+'//'+window.location.host;
	if($('#selectDepartamentoCer').val()!=""){
		vistacargando('M','Cargando..');
			window.location=url+"/gestionProyectoPoa/bancertificacion/"+$('#selectDepartamentoCer').val();
	}else{
		vistacargando();
	}
	// vistacargando();
}