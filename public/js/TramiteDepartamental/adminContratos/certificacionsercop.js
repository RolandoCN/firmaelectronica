$('#frm_buscar').submit(function(e){
    e.preventDefault();
    vistacargando('M','Buscando información...');
    $('#panelInfor').html('');
    $('#tittle_resultado').hide(200);
    $('#panelInfor').hide(200);
    $('#panelInformacion').hide(200);
    $('#panelProceso').hide(200);
    $('#div_tabla_procesos').hide(200);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: '/adminContratos/busquedacer',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            if(data['error']==true){
                alertNotificar(data['detalle'],'error');
                vistacargando();
                return;
            }
            var cedula, name,certifcion_status;

            $.each(data['detalle'],function(i,item){
                if(data['certificacion']==true){
                    cedula=item['cedula'];
                    name=item['name'];
                    certifcion_status='<span  style="background-color:#2ea631" class="badge badge-secondary">SI</span>';
                }else{
                    cedula=item['usuarios']['cedula'];
                    name=item['usuarios']['name'];
                    certifcion_status='<span style="background-color:#e72c2c" class="badge badge-secondary">NO</span>';
                }
                $('#panelInfor').append(` <div style="background-color: cornsilk;text-align: left; vertical-align: middle;" class="row">
                            <div class="col-md-7 col-xs-7 col-lg-7">
                               ${name}
                               <div style="font-size:10px;padding-left:20px"><b> Identificación:</b> ${cedula}</div> 
                            </div>
                            <div class="col-md-2 col-xs-2 col-lg-2">
                                Certificación
                               <div style="font-size:10px;padding-left:20px">${certifcion_status}</div> 
                            </div>
                            <div class="col-md-3 col-xs-3 col-lg-3" style="padding-top:9px">
                                <button class="btn btn-xs btn-primary" onclick="seleccionar('${cedula}','${name}')"><i class="fa fa-check"></i> Seleccionar</button>
                            </div>
                        </div><br>`);
            });
            $('#tittle_resultado').show(200);
            $('#panelInfor').show(200);
            vistacargando();
        },
        error: function(e){
            alertNotificar('Ocurrio un error intente nuevamente','error');
            vistacargando();
        }
    });
});

function seleccionar(cedula,nombre){
    vistacargando('M','Por favor espere...');
    $('#bodyInformacionCont').html('');
    $("#btn_imprimir").hide();
    $("#btn_imprimir").attr("href", '#');

    $.get('/adminContratos/seleccionar/'+cedula,function(data){
        vistacargando();
        if(data['error']==true){
           
            alertNotificar(data['detalle'], data['status']);
            vistacargando();
            // return;
        }
        if(data['error']==false){
            $('#panelInformacion').hide(200);
            $('#panelProceso').hide(200);
            $('#tittle_resultado').hide(200);
            $('#panelInfor').html('');
            $('#panelInfor').hide(200);
            // $("#btn_imprimir").attr("href", '/estadocuenta/pdf/'+cedula);
            var intranet='<span style="background-color:#e72c2c" class="badge badge-secondary">NO</span>';
            var certificacion='<span  style="background-color:#e72c2c" class="badge badge-secondary">NO</span>';
            var fecha_Certifi='';
            var certificado='';
            console.log(data['certificacion']);
            if(data['certificacion']!=null){
                 certificacion='<span  style="background-color:#2ea631" class="badge badge-secondary">SI</span>';
                 fecha_Certifi=`<div class="form-group">
                    <label class="control-label col-md-3 col-sm-4 col-xs-12" >Fecha certificación: 
                    </label>
                    <div class="col-md-9 col-sm-9 col-xs-12">
                        <p >${data['certificacion']['fecha_certificacion']}</p>
                    </div>
                </div>`;
                certificado=`<div class="form-group">
                                <label class="control-label col-md-3 col-sm-4 col-xs-12" >Certificado: 
                                </label>
                                <div class="col-md-9 col-sm-9 col-xs-12">
                                    <p ><button class="btn btn-sm btn-info" type="button" onclick="verdocumento('${data['certificacion']['documentosercop']}')" ><span class="fa fa-eye"></span> Ver certificado</button></p>
                                </div>
                            </div>`;
                                
            }
            if(data['usuario']!=null){
                intranet='<span  style="background-color:#2ea631" class="badge badge-secondary">SI</span>';
               
           }
            $('#bodyInformacionCont').html(`
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-4 col-xs-12" >Nombre: 
                            </label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <p >${nombre}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-4 col-xs-12" >Identificación: 
                            </label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <p >${cedula}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-4 col-xs-12" >Registrado Intranet: 
                            </label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <p >${intranet}</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-4 col-xs-12" >Certificación SERCOP: 
                            </label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <p >${certificacion}</p>
                            </div>
                        </div>
                        ${fecha_Certifi}
                        ${certificado}
                        
                    `);
                    $('#panelInformacion').show(200);
                    if(data['procesos'].length>0){
                        cargartableLocales(data['procesos']);
                        $('#panelProceso').show(200);
                    }
        }
    }).fail(function(){
        vistacargando();
        alertNotificar('Ocurrió un error intente nuevamente', 'error');
        
    });
}

function cargartableLocales(data){
	$('#tb_procesosBody').html('');
	$("#Tabla_procesos_admi").DataTable().destroy();
    $('#Tabla_procesos_admi tbody').empty();
    $.each(data, function(i, item){
        if(item['objeto_contratacion']!=null){
            var objeto=item['objeto_contratacion'];
        }else{
            var objeto='Sin objeto de contratación';
        }
            $('#tb_procesosBody').append(`<tr role="row" class="odd">
                    <td   width="15%" align="center"  colspan="1">
                        ${item['tramite']['codTramite']}
                    </td>
                    <td colspan="1">
                        ${item['tramite']['asunto']}
                    </td>
                    <td  colspan="1">
                        ${item['codigo']}
                    </td>
                    <td width="30%"  colspan="1">
                        ${objeto}
                    </td>
                </tr>  `);
    });
    cargar_estilos_tabla("Tabla_procesos_admi");
    $('#div_tabla_procesos').show(200);
}

function cargar_estilos_tabla(idtabla){

    $(`#${idtabla}`).DataTable({
        dom: ""
        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
        +"<rt>"
        +"<'row'<'form-inline'"
        +" <'col-sm-6 col-md-6 col-lg-6'l>"
        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
        "destroy":true,
        order: [[ 3, "desc" ]],
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

function verdocumento(ruta){
    // var iframe=$('#iframePdf');
    $('#documentoiframe').html(`<iframe width="100%" height="500" frameborder="0"id="iframePdf"></iframe>`);
    $('#iframePdf').attr("src", "/buscarDocumento/certificacionesSercop/"+ruta);   
    $("#vinculo").attr("href", '/buscarDocumentoDownload/certificacionesSercop/'+ruta);
    $("#documentopdf").modal("show");
}


