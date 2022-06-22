$(document).ready(function(){
    cargar_listado();
    var error=$('#error').val();
    var correcto=$('#correcto_').val();   
   
    console.log("correcto "+correcto);
    console.log("error "+error);
    if(error=="" || error==undefined){
       
    }else{
        alertNotificar(error,"error");
      
    }
   
    if(correcto=="" || correcto==undefined){
       
    }else{
        alertNotificar(correcto,"success");
    }

});

//carga listado en la tabla
function cargar_listado(){
	$('#tb_listaDocumento').html('');
	$("#TablaDocumentos").DataTable().destroy();
    $('#TablaDocumentos tbody').empty();
    var num_col = $("#TablaDocumentos thead tr th").length; //obtenemos el numero de columnas de la tabla
	$("#TablaDocumentos tbody").html(`<tr><td colspan="${num_col}" style="padding:40px; 0px; font-size:20px;"><center><span class="spinner-border" role="status" aria-hidden="true"></span><b> Obteniendo información</b></center></td></tr>`);   
   
    $.get("/firmaArchivo/cargarListado", function(data){
       
        if(data.error==true){
            ('#btnSeleccionar').hide();
            $('#btnEliminar').hide();
            $("#TablaDocumentos tbody").html('');
            $("#TablaDocumentos tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            alertNotificar(data.mensaje,'error');
            return;                      
        }
        if(data.resultado.length==0){
            ('#btnSeleccionar').hide();
            $('#btnEliminar').hide();
            $("#TablaDocumentos tbody").html('');
            $("#TablaDocumentos tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
            return;                      

        }
        $('#btnSeleccionar').show();
        $('#btnEliminar').show();
        $("#TablaDocumentos tbody").html('');
        var contador=0;
        $.each(data['resultado'], function(i, item){
            if(item.firmado=="Si"){
                contador=contador+1;
                var bloquear="disabled";
                var btn=`<button type="button" class="btn btn-primary" onclick="verpdf('${item.documento}','${item.idcoact_firma_documentos}')">
                            Ver Documento
                        </button>    
                        `;
                var estado=(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Firmado &nbsp;&nbsp;</span>`
                );  

                var inp=(`<input value="" name="cod_emision2[]" class="" style="width:20px;height:20px;;cursor: pointer;" type="checkbox" ${bloquear}>`
                );           
            }else{
                var bloquear="";
                var btn=`<button type="button" class="btn btn-primary" onclick="verpdf('${item.documento}','${item.idcoact_firma_documentos}')">
                            Ver Documento
                        </button>    
                        `;
                var estado=(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`
                ); 

                var inp=(`<input data-id="${item['idcoact_firma_documentos']}" class="check" id="cod_${item['idcoact_firma_documentos']}" value="${item['idcoact_firma_documentos']}" name="cod_emision[]"  style="width:20px;height:20px;;cursor: pointer;" type="checkbox" ${bloquear}>`
                ); 
            }
            
            $('#TablaDocumentos').append(`<tr role="row" class="odd">
                                <td  width="1%" colspan="1">
                                    ${i+1}
                                </td>

                                <td width="5%" align="center" style="font-size: 12px;text-align: center; vertical-align: middle" class="paddingTR">
                                ${inp}
	                            </td>

								<td style=" vertical-align: middle; text-align:center"  class="paddingTR">
									${item['descripcion']}
								</td>
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${item['documento']}
                                </td> 
                               
                                
                                <td style=" vertical-align: middle; text-align:center"  class="paddingTR">
                                    ${btn}
                                </td>  
                                
                            </tr>  `);

                            $(`#cod_${item['idcoact_firma_documentos']}`).click(function(){
                                if($(`#cod_${item['idcoact_firma_documentos']}`).prop('checked')){
                                    // comprobar_marcado();
                                    $(".contet_documento_selec").append(`<input id="input_${item['idcoact_firma_documentos']}" type="hidden" name="list_cod_documento[]" value="${item['idcoact_firma_documentos']}">`);
                                }else{
                                  $(`#input_${item['idcoact_firma_documentos']}`).remove();
                                }
                          });
                       
        });

        globalThis.cantidad_firmado=contador;
        globalThis.cantidad_data=data.resultado.length;
    
        cargar_estilos_tabla("TablaDocumentos",10);
    
    }).fail(function(){
        ('#btnSeleccionar').hide();
        $('#btnEliminar').hide();
        $("#TablaDocumentos tbody").html('');
        $("#TablaDocumentos tbody").html(`<tr><td colspan="${num_col}"><center>No existen registros</center></td></tr>`);
        alertNotificar("Se produjo un error, por favor intentelo más tarde","error");  
    });
   

}


function cargar_estilos_tabla(idtabla,pageLength){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 0, "asc" ]],
        pageLength: pageLength,
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

//ESTILOS DE TABLA

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

function seleccionarTodos(){
    if(cantidad_firmado==cantidad_data){
        alertNotificar("Todos los documentos estan firmados","info");
        return;
    }
    cargar_estilos_tabla('TablaDocumentos',-1);
    $(".contet_documento_selec").html('');
    var inputs=$('#tb_listaDocumento').find('.check');
    $.each(inputs,function(i,item){
    $(".contet_documento_selec").append(`<input id="input_${item.attributes[0].value}" type="hidden" name="list_cod_documento[]" value="${item.attributes[0].value}">`);
        $(`#${item.id}`).prop('checked',true);
    })
    $('#btnSeleccionar').html(`<span class="fa fa-times"></span> Deseleccionar Todos`);
    $('#btnSeleccionar').removeClass('btn-default');
    $('#btnSeleccionar').addClass('btn-danger');
    $('#btnSeleccionar').attr('onClick','deseleccionarTodos()');    
    // cargar_estilos_tabla('TablaDocumentos',10);
  }
  
  
  
function deseleccionarTodos(){
    cargar_estilos_tabla('TablaDocumentos',-1);
    var inputs=$('#tb_listaDocumento').find('input');
    $(".contet_documento_selec").html('');
    $.each(inputs,function(i,item){
        $(`#${item.id}`).prop('checked',false);
    })
    reseterarBtnSeleccion();
    cargar_estilos_tabla('TablaDocumentos',10);

}

function reseterarBtnSeleccion(){
    $('#btnSeleccionar').html(`<span class="fa fa-check"></span> Seleccionar Todos`);
    $('#btnSeleccionar').removeClass('btn-danger');
    $('#btnSeleccionar').addClass('btn-default');
    $('#btnSeleccionar').attr('onClick','seleccionarTodos()');
}

function eliminarArchivo(){
    var inputs=$('.contet_documento_selec').find('input');
    if(inputs.length==0){
        alertNotificar("Por favor seleccione los documentos", "default"); return;
    }

    var array_documentos=[];
    $("input[name='list_cod_documento[]']").each(function(indice, elemento) {
        array_documentos.push($(elemento).val());
    });

    
    swal({
        title: "¿Desea eliminar los documentos?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, continuar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { 
        
            vistacargando("m","Espere por favor");          

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            
            $.ajax({
                type: "POST",
                url: '/firmaArchivo/eliminarDocumentos',
                data: { _token: $('meta[name="csrf-token"]').attr('content'),
                iddocumentos:array_documentos},
                success: function(data){
                   
                    vistacargando("");                
                    if(data.error==true){
                        alertNotificar(data.mensaje,'error');
                        return;                      
                    }
                    alertNotificar(data.mensaje,"success");
                    cargar_listado();
                    reseterarBtnSeleccion();
                    $(".contet_documento_selec").html('');
                }, error:function (data) {
                    vistacargando("");
                    alertNotificar('Ocurrió un error','error');
                }
            });

        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    }); 
}


function firmarEmisiones(){
    $("#content_check_sinfirma").hide();
    $('#ckeckp_nofirma').prop('checked',false);
    $('#frm_firma_electronica_titulos').show();
    $("#catn_emisiones_generadas").hide();
    $("#procesing").hide();
    $('#archivo_certificado').val('');
    $('#text_archivo_certificado').val('');
    $('#input_clave_certificado').val('');
    $('#input_localizacion').val('');
    $('#input_razon').val('');
   
    $("#btn_modal_cerrar").attr("disabled", false);
    $("#informacion_certificado").html("");
    var inputs=$('.contet_documento_selec').find('input');
    if(inputs.length==0){
        alertNotificar("Por favor seleccione los documentos", "default"); return;
    }

    if(inputs.length>1){
        alertNotificar("Por favor seleccione solo un documento", "default"); return;
    }

    vistacargando('M','Espere..');
    $.get("/rolesPago/verificarConfigFirmado/", function(retorno){

        vistacargando();
        if(!retorno.error){ // si no hay error

            var config_firma = retorno.config_firma;

            // cargamos la configuracion de la firma electronica
            if(config_firma.archivo_certificado==false || config_firma.clave_certificado==false){
                $("#titulo_firmar").html("Ingrese los datos necesarios para realizar la firma");
            }else{
                $("#titulo_firmar").html("");
            }

            // verificiamos la vigencia del certificado
            vertificado_vigente = false;
            if(config_firma.dias_valido >= config_firma.dias_permitir_firmar){
                vertificado_vigente = true;
            }

            // cargamos el input para subir el certificado
            if(config_firma.archivo_certificado==true && vertificado_vigente==true){
                $("#content_archivo_certificado").hide();
            }else{
                $("#content_archivo_certificado").show();
            }

            // cargamos el input para la contraseña
            if(config_firma.clave_certificado==true && vertificado_vigente==true){
                $("#content_clave_certificado").hide();                        
            }else{
                $("#content_clave_certificado").show();
            }

            //cargamos la informacion del certificado
                if(config_firma.archivo_certificado==true){
                    color_mensaje_certificado = "icon_success";
                    mensaje_certificado = "Certificado vigente";
                    icono_mensaje_certificado = "fa fa-check-square";
                    if(config_firma.archivo_certificado==true && config_firma.dias_valido<=0){
                        color_mensaje_certificado = "icon_danger";
                        mensaje_certificado = "Certificado expirado";
                        icono_mensaje_certificado = "fa fa-times-circle";
                    }else if(config_firma.archivo_certificado==true && config_firma.dias_valido <= config_firma.dias_notific_expira){
                        color_mensaje_certificado = "icon_warning";
                        mensaje_certificado = "Certificado casi expirado";
                        icono_mensaje_certificado = "fa fa-warning";
                    }   
                    
                    $("#informacion_certificado").html(`
                        <div id="infoDepFlujGen_1" class="form-group infoDepFlujGen content_info_certificado" style="margin-bottom: 0px; margin-top: 16px;">
                            <label class="control-label col-md-2 col-sm-2 col-xs-12"></label>
                            <div class="col-md-8 col-sm-8 col-xs-12">
                                <div class="tile-stats" style="margin-bottom: 0px; border-color: #cccccc;">
                                    <div class="icon ${color_mensaje_certificado}" style="font-size: 25px;"><i class="${icono_mensaje_certificado}"></i></div>
                                    <div class="count ${color_mensaje_certificado}" style="font-size: 20px;">${mensaje_certificado}</div>                                    
                                    <p>El certificado cargado es válido durante los siguientes <b>${config_firma.dias_valido} días</b>.</p>                                                                                
                                </div>
                                <hr style="margin-bottom: 2px;">                                        
                            </div>
                        </div>
                    `);
                    $('#valdatorfirma').val('S');
                    
                }else{
                    $('#valdatorfirma').val('N');
                }

            $("#input_clave_certificado").val("");
            $('#input_localizacion').val('');
            $('#input_razon').val('');
        
            $("#text_archivo_certificado").val("No seleccionado");

            //reiniciamos el icono de documento firmado
            $("#icono_estado_firma").html('<span class="fa fa-times-circle"></span>');
            $("#icono_estado_firma").parent().removeClass('btn_verde');
            $("#icono_estado_firma").parent().addClass('btn_rojo');
            $("#icono_estado_firma").parent().siblings('input').val("No seleccionado");

            $('#content_tipo_firma').hide();
            $('#informacion_certificado').show();
            $('#btnFirmaElectronica').show();
            
            //mostramos la modal de la firma electrónica
            $("#modal_firma_electronica").modal("show");                    
            
        }else{
            alertNotificar(retorno.mensaje, retorno.status);

        }
        $("#modal_firma_electronica").modal("show");   

    }).fail(function(){
        alertNotificar("No se pudo completar la acción", "error");

    });     

   


              
}
  
// FUNCION PARA SELECCIONAR UN ARCHVO --------------

$(".seleccionar_archivo").click(function(e){
    $(this).parent().siblings('input').val($(this).parent().prop('title'));
    this.value = null; // limpiamos el archivo
});

$(".seleccionar_archivo").change(function(e){

    if(this.files.length>0){ // si se selecciona un archivo

        //verificamos si es un archivo p12
        if(this.files[0].type != "application/x-pkcs12"){
            alertNotificar("El archivo del certificado debe ser formato .p12", "default");
            this.value = null;
            return;
        }            

        archivo=(this.files[0].name);
        $(this).parent().siblings('input').val(archivo);
    }else{
        return;
    }

});

function realizar_firma(){
    swal({
        title: '',
        text: 'Está seguro de firrma el documento',
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-sm btn-info",
        cancelButtonClass: "btn-sm btn-danger",
        confirmButtonText: "Si, Aceptar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que si
            $('#btn_documento_firmado').html('');
            $("#frm_firma_electronica_titulos").submit();
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    
    });
}

// FUNCION PARA FIRMAR ELECTRONICAMENTE DOCUMENTO -------------------
  
var cant_generados = 0;
var total_generar = 0;  

$("#frm_firma_electronica_titulos").submit(function(e){ 
    $('#cantGeneradas').html('');
    $('#cantXgenerar').html('');
    
    e.preventDefault();
    if(!$('#ckeckp_nofirma').prop('checked')){
        if($('#valdatorfirma').val()!='S'){
            if($('#archivo_certificado').val()==''){
                alertNotificar("Seleccione su archivo de firma electrónica", "default");
                return;
            }else{
                if($('#input_clave_certificado').val()==''){
                    alertNotificar("Por favor ingrese la contraseña", "default");
                    return;
                }
            }
        }else{
            if($('#input_clave_certificado').val()==''){
                alertNotificar("Por favor ingrese la contraseña", "default");
                return;
            }
        }

      

    }

    
    $('#btn_modal_cerrar').prop('disabled',true);
    var FrmData = new FormData(this);
    $.ajaxSetup({
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
    });
    $('#procesing').show();
    $('#frm_firma_electronica_titulos').hide();
    // vistacargando('M','Generando emisiones...'); // mostramos la ventana de espera

    $.ajax({
        url: "/firmaArchivo/firmar",
        method: 'POST',
        data: FrmData,
        dataType: 'json',
        contentType:false,
        cache:false,
        processData:false,
        success: function(retorno){
            console.log(retorno)
            if(retorno['error']==true){
            $('#procesing').hide();
            $('#frm_firma_electronica_titulos').show();
            alertNotificar(retorno.mensaje, "error");
                return;
            }
            if(retorno['error']==false){
                alertNotificar(retorno.mensaje, "success");
                $('#cedula').val(retorno['cedula']);
                if($('#cedula').val()!=null){
                    $('#btnBuscars').click();
                }
                $('#procesing').hide();
                $('#cantGeneradas').html(retorno.cantidad_generados);
                $('#cantXgenerar').html(retorno.cantidad_generar);
                $('#catn_emisiones_generadas').show();
                $('#btn_modal_cerrar').prop('disabled',false);
                cargar_listado();
                reseterarBtnSeleccion();
                $(".contet_documento_selec").html('');

                $('#btn_documento_firmado').append(`<button type="button" class="btn btn-primary"
                                                    onclick="verpdf('${retorno.archivo}','${retorno.id}')">
                                                    Ver Documento
                                                    </button>`)

            }

            
        },
        error: function(error){
            alertNotificar("Ocurrió un error intente nuevamente", "error");
            $('#frm_firma_electronica_titulos').show();
            $("#procesing").hide();
        }
    }); 
});

function verpdf(ruta, id){
    $('#btn_documento').html('');
    var iframe=$('#iframePdf');
    iframe.attr("src", "/firmaArchivo/visualizardoc/"+ruta);   
    // $("#vinculo").attr("href", '/firmaArchivo/descargarDoc/'+ruta);
    $("#documentopdf").modal("show");

    $('#btn_documento').append(`<center>
                                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-mail-reply-all"></i> Salir</button>  
                                    <a href='/firmaArchivo/descargarDoc/${ruta}' id="vinculo"><button  type="button" id="descargar"class="btn btn-primary"><i class="fa fa-download"></i> Descargar</button> </a>    
                                    <button type="button" onclick="eliminarDoc(${id})" class="btn btn-danger"><i class="fa fa-trash"></i> Eliminar</button> 
                                    <button type="button" onclick="reemplazarDoc(${id})" class="btn btn-warning"><i class="fa fa-edit"></i> Reemplazar</button>                              
                                </center> 
                                 `);
}

$('#documentopdf').on('hidden.bs.modal', function (e) {
       var iframe=$('#iframePdf');
       iframe.attr("src", null);

});
$('#descargar').click(function(){
       $('#documentopdf').modal("hide");
});

///funcion que muestra la modla para registrar un nuevo documento
function subirNuevoArchivo(){
    $('#nuevoDoc_modal').modal('show');
}

//validamos los datos del nuevo documento
function validarFormNew(){
    var documento=$('#archivo').val();
   
    if(documento=="" || documento==null){
        alertNotificar("Debe seleccionar un documento","error");
        return false;
    }else{
        return true;
    }
    
}

//eliminamos el documento selecciomnado
function eliminarDoc(id){

    swal({
        title: '',
        text: 'Está seguro de eliminar el documento',
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-sm btn-info",
        cancelButtonClass: "btn-sm btn-danger",
        confirmButtonText: "Si, Aceptar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que si
            window.location.href="/firmaArchivo/eliminar/"+id;

        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
       
    });

   
}

//reemplazar archivo
function reemplazarDoc(id){
    $('#documentopdf').modal('hide');
    $('#nuevoDoc_modal').modal('show');
    $('#iddocumento').val(id);
}

$('#nuevoDoc_modal').on('hidden.bs.modal', function (e) {
    $('#iddocumento').val('');//limpiamos el campo al cerrar la modal
    
});

function configurar_firma(){
    $('#documnento_id_conf').val('');
    $('.pagina_firma').hide();
    $('#num_pag').val('');
    $('#x').val('');
    $('#y').val('');
    $('.class_orientacion').prop('selected',false); 
    $("#orientacion").trigger("chosen:updated"); 
    $('.class_pagina').prop('selected',false); 
    $("#pagina").trigger("chosen:updated"); 
    $('.class_formato').prop('selected',false); 
    $("#formato").trigger("chosen:updated"); 



    $("input[name='list_cod_documento[]").each(function(indice, elemento) {
        $('#documnento_id_conf').val($(elemento).val())
    });

    $('#config_pdf').modal('show');
    $('#modal_firma_electronica').modal('hide');
    // $('#nuevoDoc_modal').modal('show');
}

function simular(){

    var x=$('#x').val();
    var y=$('#y').val();
    var formato=$('#formato').val();
    var orientacion=$('#orientacion').val();
    var pagina=$('#pagina').val();
    var num_pag=$('#num_pag').val();
    
    if(formato=="" || formato==null){
        alertNotificar("Debe seleccionar un formato","error");
        return;
    }

    if(orientacion=="" || orientacion==null){
        alertNotificar("Debe seleccionar un orientacion","error");
        return;
    }

    if(pagina=="" || pagina==null){
        alertNotificar("Debe seleccionar la pagina","error");
        return;
    }else{
        if(pagina=="O"){
            if(num_pag=="" || num_pag==null){
                alertNotificar("Debe ingresar un nmúmeo de página","error");
                return;
            }
            if(num_pag<=0){
                alertNotificar("Ingrese un númeo de página mayor a cero","error");
                return;
            }
        }
    }
   
    if(x=="" || x==null){
        alertNotificar("Debe registrar un valor de coordenada X","error");
        return;
    }else{
        if(formato=="A4" && orientacion=="V"){
            if(x>160 || x<=0){
                alertNotificar("El valor de la coordenada X no debe ser mayor a 160, ni menor o igual a cero","error");
                return;
            }
            
        }

        if(formato=="A4" && orientacion=="H"){
            if(x>245 || x<=0){
                alertNotificar("El valor de la coordenada X no debe ser mayor a 245, ni menor o igual a cero","error");
                return;
            }
            
        }

        if(formato=="A3" && orientacion=="H"){
            if(x>360 || x<=0){
                alertNotificar("El valor de la coordenada X no debe ser mayor a 360, ni menor o igual a cero","error");
                return;
            }
            
        }
    }
    if(y=="" || y==null){
        alertNotificar("Debe registrar un valor de coordenada Y","error");
        return;
    }else{
        if(formato=="A4" && orientacion=="V"){
            if(y>275 || y<=0){
                alertNotificar("El valor de la coordenada Y no debe ser mayor a 275, ni menor o igual a cero","error");
                return;
            }

        }

        if(formato=="A4" && orientacion=="H"){
            if(y>190 || y<=0){
                alertNotificar("El valor de la coordenada Y no debe ser mayor a 190, ni menor o igual a cero","error");
                return;
            }

        }

        if(formato=="A3" && orientacion=="H"){
            if(y>280 || y<=0){
                alertNotificar("El valor de la coordenada Y no debe ser mayor a 280, ni menor o igual a cero","error");
                return;
            }

        }
    }
    $("#frm_configuracion").submit();

   
    
     
}

$('#config_pdf').on('hidden.bs.modal', function (e) {
    $('#modal_firma_electronica').modal('show');
    
});


function atras_conf(){
    $('#visualizar_conf').hide();
    $('#form_conf').show();
    $('#atras').hide();
    $('.configurar_test').show();
}

   //proceder a dar bajas
   $("#frm_configuracion").submit(function(e){
    e.preventDefault();
   
    
    vistacargando("m","Espere por favor");        
   
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
       
    var FrmData = new FormData(this);
    $.ajax({
        type: "POST",
        url: '/firmaArchivo/simulacionFirma',
        data: FrmData,
        contentType:false,
        cache:false,
        processData:false, 
        success: function(data){
            console.log(data)
            vistacargando("");                
            if(data.error==true){
                alertNotificar(data.mensaje,'error');
                return;                      
            }
            
            $('#visualizar_conf').show();
            $('#form_conf').hide();
            $('.configurar_test').hide();
            $('#atras').show();
            var iframe=$('#iframePdfConf');
            iframe.attr("src", "/firmaArchivo/visualizardoc/"+data.archivo); 

            alertNotificar(data.mensaje,"success");
                            
        }, error:function (data) {
            vistacargando("");
            alertNotificar('Ocurrió un error','error');
        }
    });
        
})


function pagina_seleccionada(){
    var pag_cmb=$('#pagina').val();
    if(pag_cmb=='O'){
        $('.pagina_firma').show();
    }else{
        $('.pagina_firma').hide();
        $('#num_pag').val('');
    }
}