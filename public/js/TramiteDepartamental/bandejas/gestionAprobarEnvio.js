

function verTramite(iddetalle_tramite){

    $("#listaTramites_enElaboracion").hide(200);
    $("#contet_ver_tramite").show(200);
    mostrarDetalleTramite(iddetalle_tramite);

    $("#id_detalle_tramite_encrypt").val(iddetalle_tramite); // para tenerlo a la mano

    //cargar información a los botones
    $("#btn_rev_aprobar").attr('onclick', `aprobarTramite('${iddetalle_tramite}')`);

    //cargamos las rutas de los formularios
    $("#frm_enviaraRevision").prop('action', "/revisionTramite/enviaraRevisionDetalleTramite/"+iddetalle_tramite);
    $("#frm_firma_electronica").prop('action', "/revisionTramite/firmarElectronicamenteDocumento/"+iddetalle_tramite);
    $("#btn_rev_editar").prop('href', '/revisionTramite/editarDetalleTramite?iddetalle_tramite='+iddetalle_tramite);
    $("#form_subir_documento_firmado").prop('action',"/revisionTramite/subirDocumentoFirmado/"+iddetalle_tramite);

    //validamos los botones
    $("#btn_rev_aprobar").hide();
    $("#btn_rev_revision").hide();
    $("#btn_rev_revisionInt").hide();
    $("#btn_rev_editar").html('<i class="fa fa-edit"></i> Editar');

    $.get("/tramite/detalleTramite/"+iddetalle_tramite, function(retorno){
        console.log(retorno);
        detalle_tramite = retorno.detalle_tramite;
        
        if(detalle_tramite.idus001_responsable==null){ // tramite normal
            $("#btn_rev_aprobar").show();
            $("#btn_rev_revision").show();
        }else{
            $("#btn_rev_revisionInt").show();
            $("#btn_rev_revisionInt").attr('onclick', `devolverTramiteInternoA('${detalle_tramite.iddetalle_tramite_encrypt}')`);
            if(detalle_tramite.destino.length>0){ //tramite con responsable pero con destino definido
                $("#btn_rev_aprobar").show();
            }else{ //tramite con responsable pero sin destino definido
                $("#btn_rev_editar").html('<i class="fa fa-edit"></i> Editar para continuar');
            }
        }
        if(retorno.documentoPrincipal!=null){
            // $("#btn_rev_revisionInt").hide();
            $('#descargar_doc_firma').html(`<p > <a  data-toggle="tooltip" data-placement="right" title="Recuerde que puede descargar el documento y firmarlo." id="btn_descargar_documento_firmar" class="btn btn-info btn-sm"  id="btn_descargar_documento_firmar" href="/tramite/descargarDocumentoRedirect/${retorno.documentoPrincipal.iddocumento_encrypt}" class="btn btn-info btn-sm" ><i class="fa fa-download"></i> Descargar documento</a></p>`);
        }else{
            $('#descargar_doc_firma').html(`<p > Para que pueda descargar el documento a firmar, primero debe dar clic en el botón editar y luego guardar</p>`);
        }
    });
}


function cerrarDetalleTramite(){
    $("#listaTramites_enElaboracion").show(200);
    $("#contet_ver_tramite").hide(200);

    //limpiamos la información de los botones 

}


//funciones para devolver un tramite interno

function devolverTramiteInternoA(iddetalle_tramite_borrador_encrypt){

    vistacargando("M", "Espere...");
    $("#table_devolver_interno tbody").html("");
    $("#js_textarea_detalle_revision").val("");
    $.get('/detalleActividad/getDetallesEnvia/'+iddetalle_tramite_borrador_encrypt, function(retorno){
        
        vistacargando();
        console.log(retorno);

        $.each(retorno.lista_detalle_actividad, function(i, detalle_actividad){
            $("#table_devolver_interno tbody").append(`
                <tr>
                    <td style="padding: 4px;">
                        <div class="check_dias">
                            <label class="" for="check_detact" style="user-select: none;">
                                <input type="checkbox" name="check_iddetact[]" class="flat icheck" value="${detalle_actividad.iddetalle_actividad_encrypt}">
                            </label>
                        </div>
                    </td>
                    <td style="padding: 4px 8px; text-align: left;">${detalle_actividad.us001_envia.name}</td>
                    <td style="padding: 4px 8px; text-align: left;">${detalle_actividad.asunto}</td>
                    <td style="padding: 4px 8px; text-align: left;">${detalle_actividad.fecha}</td>
                </tr>
            `);

            $("#table_devolver_interno tbody").find('.icheck').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });

        });
        $("#modal_js_devolver_interno").modal("show");

    }).fail(function(){
        vistacargando();
    });
}

$("#frm_js_devolver_interno").submit(function(e){
    e.preventDefault();

    var ruta = $(this).attr("action");
    var FrmData = new FormData(this);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    
    vistacargando('M','Devolviendo...'); // mostramos la ventana de espera

    $.ajax({
        url: ruta,
        method: 'POST',
        data: FrmData,
        dataType: 'json',
        contentType:false,
        cache:false,
        processData:false,
        success: function(retorno){                                      
            vistacargando(); // ocultamos la ventana de espera 
            alertNotificar(retorno.mensaje, retorno.status);
            if(!retorno.error){                        
                // refrescamos la tabla de trámites
                // cerrarDetalleTramite();
                // filtratTramiteEntrada();
                // $("#modal_js_devolver_interno").modal("hide");
                vistacargando("M", "Espere...");
                window.location.href = "/gestionBandeja/entrada";
            }                    
            
        },
        error: function(error){
            // alertNotificar(","error");
            vistacargando(); // ocultamos la ventana de espera
        }
    }); 
});


// cargamos la tabla
$(document).ready(function () {

    $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});
   
    $("#tabla_tramites").DataTable({
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

});