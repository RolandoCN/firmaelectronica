function modalObservacion(obs){
    if(obs==''){
        obs='<p align="center">No hay observación</p>';
    }
    $('#detalleObs').html(obs);
    $('#modalObservacion').modal();
}

function verTramite(iddetalle_tramite){
   
    $("#listaTramites_enElaboracion").hide(200);
    $("#contet_ver_tramite").show(200);
    mostrarDetalleTramite(iddetalle_tramite);

    //cargar información de los botones
    $("#btn_revision_corregir").hide();
    $("#btn_subtramite_bandeja").hide();
    $("#btn_delegar").hide();
    $.get("/tramite/detalleTramite/"+iddetalle_tramite, function(retorno){
        console.log(retorno);
        if(retorno.detalle_tramite.reasignado==1){
            $("#btn_revision_corregir").prop('href', '/adminContratos/editarDetalleTramiteReasignado?iddetalle_tramite='+iddetalle_tramite);
        }else{
            $("#btn_revision_corregir").prop('href', '/adminContratos/editarDetalleTramite?iddetalle_tramite='+iddetalle_tramite);
            
            //mostramos el boton de subir solo cuando el trámite
            $("#btn_subtramite_bandeja").show();
        }
        $("#btn_revision_corregir").show();


    });

    $("#btn_subtramite_bandeja").attr('onclick', `bandejaRevisionSubirDetalleTramiteEdit('${iddetalle_tramite}')`);   
    $("#btn_revision_eliminar").attr('onclick', `eliminarTramite('${iddetalle_tramite}',this)`);
    $("#btn_revision_eliminar").show();
}


function eliminarTramite(iddetalle_tramite,boton){

    swal({
        title: "",
        text: "¿Está seguro que desea eliminarlo?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        
        if (isConfirm) { // si dice que quiere eliminar
            $(boton).parent('form').attr('action','/detalleTramite/eliminar/'+iddetalle_tramite);
            $(boton).parent('form').submit();          
        }

        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 

}



function cerrarDetalleTramite(){
    $("#listaTramites_enElaboracion").show(200);
    $("#contet_ver_tramite").hide(200);

    //quitar información de los botones
    $("#btn_revision_corregir").prop('href', '');

}


// funcion para enviar el trámite a la bandeja del jefe desde la bandeja de revision
function bandejaRevisionSubirDetalleTramiteEdit(iddetalle_tramite_encrypt){

    swal({
        title: "",
        text: "¿Está seguro que desea subir el trámite?",
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si, subirlo!",
        cancelButtonText: "No, cancela!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que quiere eliminar
            
            vistacargando("M", "Subiendo...");
            
            $.get("/detalleTramite/subirDetalleTramite/"+iddetalle_tramite_encrypt, function(retorno){
                
                alertNotificar(retorno.resultado.mensaje, retorno.resultado.status);
                if(!retorno.error){ // si no hay error
                    window.location.href = `/gestionBandeja/enRevision`;
                }else{
                    vistacargando();
                }

            }).fail(function(){
                vistacargando();
            });
        }

        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}

