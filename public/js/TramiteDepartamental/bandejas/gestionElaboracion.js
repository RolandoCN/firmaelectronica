

$(document).ready(function () {
    cargar_estilo_tabla("tabla_tramites");
});


function cargar_estilo_tabla(idtabla){

    $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});
    
    $("#"+idtabla).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        pageLength: 10,
        "language": {
            "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                        '<option value="5">5</option>'+
                        '<option value="10">10</option>'+
                        '<option value="15">15</option>'+
                        '<option value="20">20</option>'+
                        '<option value="30">30</option>'+
                        '<option value="-1">Todos</option>'+
                        '</select> registros',
            "search": "<b><i class='fa fa-search'></i> Buscar: </b>",
            "searchPlaceholder": "Ejm: GADM-000-2020-N",
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

}


function verTramite(iddetalle_tramite){

    $("#listaTramites_enElaboracion").hide(200);
    $("#contet_ver_tramite").show(200);
    mostrarDetalleTramite(iddetalle_tramite);

    //cargar información de los botones
    $("#btn_elaboracion_editar").prop('href', '/detalleTramite/editarDetalleTramite?iddetalle_tramite='+iddetalle_tramite);
    $("#btn_subtramite_bandeja").attr('onclick', `bandejaEntradaSubirDetalleTramiteEdit('${iddetalle_tramite}')`);
    $("#btn_elaboracion_eliminar").attr('onclick', `eliminarTramite('${iddetalle_tramite}',this)`);
    $("#btn_elaboracion_eliminar").show();
    $("#btn_subtramite_bandeja").removeClass('hidden');
    $("#btn_subtramite_bandeja").hide();
    
}

function existeDocumentoPrincipal(){
    $("#btn_subtramite_bandeja").show();
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

    //limpiar información de los botones
    $("#btn_elaboracion_editar").prop('href','');
}


// funcion para enviar el trámite a la bandeja del jefe desde la bandeja de elaboracion
function bandejaEntradaSubirDetalleTramiteEdit(iddetalle_tramite_encrypt){

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
                    window.location.href = `/gestionBandeja/enElaboracion`;
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

// ================ FUNCIONES PARA PARA LOS TRÁMITES INTERNOS ====================================


function verTramiteInterno(iddetalle_tramite_encrypt, iddetalle_actividad_encrypt, btn){

    $("#listaTramites_enElaboracion").hide(200);
    $("#contet_ver_tramite").show(200);
    mostrarDetalleTramite(iddetalle_tramite_encrypt);
    $("#botones_para").html("");

    //cargar información de los botones
    $("#btn_elaboracion_editar").prop('href', '/detalleActividad/editarDetalleActividad?iddetalle_actividad='+iddetalle_actividad_encrypt);
    $("#btn_subtramite_bandeja").attr('onclick', ``);
    $("#btn_subtramite_bandeja").hide();
    $("#btn_subtramite_bandeja").addClass('hidden');
    $("#btn_revision_eliminar").attr('onclick', ``);
    $("#btn_revision_eliminar").hide();
    $("#btn_elaboracion_eliminar").attr('onclick', `eliminarTramiteInterno('${iddetalle_actividad_encrypt}',this)`);
    $("#btn_elaboracion_eliminar").show();
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