function modalObservacion(iddetalle_tramite){
    // if(obs==''){
    //     obs='<p align="center">No hay observación</p>';
    // }
    var obs='';
    vistacargando('m','Cargando observaciones....')
    $.get("/detalleTramite/obtenerObservacionRevision/"+iddetalle_tramite, function(data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }
        if(data['det_revision']==true){
            obs=`<p align="center">${data['detalle']}</p>`;
            $('#detalleObs').html(obs);
            vistacargando();
            $('#modalObservacion').modal();
            return;
        }
        if(data['detalle'].length>0){
            $.each(data['detalle'],function(i,item){
                obs=obs+`<p align="left"> <b><li> ${item['created_at']} </b> | ${item['usuario']['name']} <br> <span style="padding-left:30px">${item['descripcion']}</span></li></p><br>`
            })
        }else{
            obs='<p align="center">No hay observación</p>';
        }
        $('#detalleObs').html(obs);
        vistacargando();
        $('#modalObservacion').modal();
    }).fail(function(){
        alertNotificar('Inconvenientes al obtener observaciones, intente nuevamente','error');
        vistacargando();
    });

}

function modalObservacionActividad(iddetalle_actividad){
    var obs='';
    vistacargando('m','Cargando observaciones....')
    $.get("/detalleActividad/obtenerObservacionRevision/"+iddetalle_actividad, function(data){
        if(data['error']==true){
            alertNotificar(data['detalle'],'error');
            vistacargando();
            return;
        }
        if(data['det_revision']==true){
            obs=`<p align="center">${data['detalle']}</p>`;
            $('#detalleObs').html(obs);
            vistacargando();
            $('#modalObservacion').modal();
            return;
        }
        if(data['detalle'].length>0){
            $.each(data['detalle'],function(i,item){
                obs=obs+`<p align="left"> <b><li> ${item['created_at']} </b> | ${item['usuario']['name']} <br> <span style="padding-left:30px">${item['descripcion']}</span></li></p><br>`
            })
        }else{
            obs='<p align="center">No hay observación</p>';
        }
        $('#detalleObs').html(obs);
        vistacargando();
        $('#modalObservacion').modal();
    }).fail(function(){
        alertNotificar('Inconvenientes al obtener observaciones, intente nuevamente','error');
        vistacargando();
    });
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
            $("#btn_revision_corregir").prop('href', '/detalleTramite/editarDetalleTramiteReasignado?iddetalle_tramite='+iddetalle_tramite);
        }else{
            $("#btn_revision_corregir").prop('href', '/detalleTramite/editarDetalleTramite?iddetalle_tramite='+iddetalle_tramite);
            
            //mostramos el boton de subir solo cuando el trámite
            $("#btn_subtramite_bandeja").show();
        }
        $("#btn_revision_corregir").show();

        if(retorno.detalle_tramite.iddetalle_tramite_padre != null){
            //buscamos el codigo del documento redactado
            $("#btn_delegar").attr("onclick", `delegarIndex('/detalleActividad/delegarDetalleTramite?iddetalle_tramite=${retorno.detalle_tramite.iddetalle_tramite_padre_encrypt}', 0)`);
            $("#btn_delegar").show();
            $.each(retorno.detalle_tramite.documento, function(d, documento){
                if(documento.tipo_creacion == "E"){    
                    $("#btn_delegar").attr("onclick", `delegarIndex('/detalleActividad/delegarDetalleTramite?iddetalle_tramite=${retorno.detalle_tramite.iddetalle_tramite_padre_encrypt}', '${documento.codigoDocumento}')`);
                    $("#btn_delegar").show();
                }
            });            
        }


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

// funcion para mostrar el mensaje para delegar el tramite
function delegarIndex(ruta, codigoDocumento){
    
    if(codigoDocumento!=0){
        swal({
            title: "Si delega el proceso se eliminará el documento "+codigoDocumento,
            text: "¿Está seguro que desea continuar?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-info btn-sm redireccionar_vista",
            cancelButtonClass: "btn-default btn-sm",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
            },
        function(isConfirm) {
            if (isConfirm) {
                window.location.href = ruta;
            }
            sweetAlert.close();
        }); 
    }else{
        window.location.href = ruta;
    }


}


// ================ FUNCIONES PARA PARA LOS TRÁMITES INTERNOS ====================================


        function verTramiteInterno(iddetalle_tramite_encrypt, iddetalle_actividad_encrypt, btn){

            $("#listaTramites_enElaboracion").hide(200);
            $("#contet_ver_tramite").show(200);
            mostrarDetalleTramite(iddetalle_tramite_encrypt);
            $("#botones_para").html("");

            //cargar información de los botones
            $("#btn_revision_corregir").prop('href', '/detalleActividad/editarDetalleActividad?iddetalle_actividad='+iddetalle_actividad_encrypt);
            $("#btn_subtramite_bandeja").attr('onclick', ``);
            $("#btn_subtramite_bandeja").hide();
            $("#btn_revision_eliminar").attr('onclick', `eliminarTramiteInterno('${iddetalle_actividad_encrypt}',this)`);
            // $("#btn_revision_eliminar").hide();
            $("#btn_delegar").hide();

        }


        function eliminarTramiteInterno(iddetalle_actividad_encrypt, boton){
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
                    $(boton).parent('form').attr('action','/detalleActividad/eliminar/'+iddetalle_actividad_encrypt);
                    $(boton).parent('form').submit();          
                }
        
                sweetAlert.close();   // ocultamos la ventana de pregunta
            }); 
        
        }