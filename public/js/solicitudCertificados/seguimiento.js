


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

    

    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha").show(200);
    });
    
    $('#check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea.
        $("#content_filtrar_fecha").hide(200);
    });





 //FUNCION PARA FILTRAR LAS SOLICITUDES
    function filtrarCertificados(){
        $('#divTabla').hide();
       //var estado_tramite_au="F";
       var check_filtrar_fecha = false;
        if($("#check_filtrar_fecha").is(':checked')){
            check_filtrar_fecha = true;
        }
      
        var FrmData = {
            
            check_filtrar_fecha: check_filtrar_fecha,
            fechaInicio: $("#fechaInicio").val(),
            fechaFin: $("#fechaFin").val(),
            estado: $(".estado_tramite:checked").val()
        } 

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });  

        vistacargando("M", "Espere...");

        $.ajax({
        url: '/solicitudCertificado/seguimientoFiltro', 
        method: "POST", 
                data: FrmData,
                type: "json",             
        success: function (data)   
        {
            if(data['error']==true){
                alertNotificar('Ocurrión un error intente nuevamente','error');  
                vistacargando();
                return ;
            }
            cargartableemisiones(data);
                    
        },error: function(){
                    mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                    vistacargando();
                }
        });

    }

    function cargartableemisiones(data){
        $('#bodyTableCertificados').html('');
        $("#datatableCertificados").DataTable().destroy();
        $('#datatableCertificados tbody').empty();
        $.each(data['detalle'], function(i, item){
            // if(item['unificado']=='1'){
            //     var unificado=`<span class="badge badge-danger" style="background-color:#007bff">Solicitud Unificada</span>`;
            // }else{
            //     var unificado='';
            // }
            // if(item['turno'].length>0){                             
            //     // var informacionAdicional=`<p>Se ha generado un turno para inspecci&oacute;n con el siguiente detalle: </p>
               

            //      var informacionAdicional='Tiene Agendamiento'
                
            //  }else{
            //      var informacionAdicional='';
            
            //  }
            // if(item['lista_certificado']['certificado_cod']!='ND'){
                Date.prototype.yyyymmdd = function() {
                    var yyyy = this.getFullYear().toString();
                    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
                    var dd  = this.getDate().toString();
                    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
                };   
                
                if(item['estado']=='P' || item['estado']=='C'){
                    var color='danger';
                    var estado=`PENDIENTE`;
                    var texto='Han transcurrido';
                    var fecha_actual = new Date().yyyymmdd();
                    var date_1 = new Date(obtenerfecha(fecha_actual));
                    var date_2=new Date(obtenerfecha(item['fechasolicitud']));
                    var day_as_milliseconds = 86400000;
                    var diff_in_millisenconds = date_1 - date_2;
                    var dias = diff_in_millisenconds / day_as_milliseconds;
                    if(dias<0){
                        dias=0;
                    }
                }else if(item['estado']=='G'){
                    var color='success';
                    var estado=`GENERADO`;
                    var texto='Tardó un total de';

                    var date_1=new Date(obtenerfecha(item['fechasolicitud']));
                    var date_2 = new Date(obtenerfecha(item['fechaaprueba']));
                    var day_as_milliseconds = 86400000;
                    var diff_in_millisenconds = date_2 - date_1;
                    var dias = diff_in_millisenconds / day_as_milliseconds;
                    if(dias<0){
                        dias=0;
                    }
                }else if(item['estado']=='R'){
                    var color='primary';
                    var estado=`<b style="color:red">REPROBADO</b>`;
                    var texto='Tardó un total de';

                    var date_1=new Date(obtenerfecha(item['fechasolicitud']));
                    var date_2 = new Date(obtenerfecha(item['fechaaprueba']));
                    var day_as_milliseconds = 86400000;
                    var diff_in_millisenconds = date_2 - date_1;
                    var dias = diff_in_millisenconds / day_as_milliseconds;
                    if(dias<0){
                        dias=0;
                    }
                }
                $('#bodyTableCertificados').append(`<tr style='background-color:${color}' role="row" class="odd">
                                    <td   style=" vertical-align: middle; text-align:center;width: 10%"  class="paddingTR">
                                        ${item['fechasolicitud']}
                                    </td>
                                    <td style=" vertical-align: middle; "  class="paddingTR">
                                        ${item['usuario']['name']}
                                    </td>
                     
                                    <td style="vertical-align: middle; text-align:center;width: 10%"  class="paddingTR center_vertical user_selec">
                                    <b style="text-align: center; font-weight: 800; display: block;">${estado}</b>
                                    <span class="label2 label2-${color}">${texto} <br> ${dias} días</span>
                                    </td>
                                
                                    <td style="text-align: center; vertical-align: middle; width: 10%"  class="paddingTR">
                                        <center>
                                            <button onclick="cargarDetalle(${item['idsolicitud_emision_certificado']},'${item['estado']}')" type="button" class="btn btn-sm btn-info marginB0" >
                                                    <i class="fa fa-eye" >
                                                        
                                                    </i> Ver detalle
                                                </button>
                                        </center>
                                    </td>
                                    
                                </tr>  `);
            // }
        
        });

        cargar_estilos_tabla("datatableCertificados",10);
        $('#divTabla').show();
        vistacargando();
    
    }

    function obtenerfecha(fecha){
        var dia = new Date(fecha).getDate();
        var mes = new Date(fecha).getMonth();
        var anio= new Date(fecha).getFullYear();
        return String(anio+"-"+mes+"-"+dia);
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
            order: [[ 1, "desc" ]],
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

    function cargarDetalle(id,estado){
        
        $('#detallepri').html('');
        vistacargando("M", "Espere..");
        $.get("/solicitudCertificado/seguimientoDetalle/"+id+'/'+estado, function (data) {
            if(data['error']==true){
                alertNotificar('Inconveniente al obtener detalle','error');
                vistacargando();
                return;
            }
         
            if(data['error']==false){
                var estadofinal=estado;
                $.each(data['detalle'],function(i2,itemdetalle){
                    if(estadofinal=='P'){
                        console.log(itemdetalle['emisioncertificado'][0]);
                        itemJson=itemdetalle['emisioncertificado'][0];
                    }else{
                        itemJson=JSON.parse(itemdetalle['emisioncertificado'][0]['json']);
                    }
                    console.log(itemJson);
                    if(i2==0){
                        var sexo='';
                        if(itemJson['us001']['sexo']=='M'){
                            sexo='Masculino';
                        }else if(itemJson['us001']['sexo']=='F'){
                            sexo='Femenino';
                        }

                        $('#identificacion').html(itemJson['us001']['cedula']);
                        $('#razonSocial').html(itemJson['us001']['name']);
                        $('#celular').html(itemJson['us001']['celular']);
                        $('#correo').html(itemJson['us001']['email']);
                        $('#direccion').html(itemJson['us001']['direccion']);
                        $('#sexo').html(sexo);
                    }
                    console.log(itemJson['estado']);
                    if(itemJson['estado']=='P' || itemJson['estado']=='C' ){
                        var estado=`<span class="badge badge-danger" style="background-color:#dc3545">Pendiente</span>`;
                        var fechaGeneracion='';
                    }else if(itemJson['estado']=='G'){
                        var estado=`<span class="badge badge-success" style="background-color:#28a745">Generado</span>`;
                        var fechaGeneracion=`<b>Fecha Generación:</b> ${itemJson['fechaGeneracion']}  <br>`;
                    }else if(itemJson['estado']=='R'){
                        var estado=`<span class="badge badge-danger" style="background-color:#dc3545">Reprobado</span>`;
                        var fechaGeneracion=`<b>Fecha Reprobacion:</b> ${itemJson['fechaAprobacion']}  <br>`;
                    }
                    $('#detallepri').append(`<div class="panel panel-primary" id="detalleSolicitud${i2}">
            
                    </div>`);
                    $('#detalleSolicitud'+i2).html(`<div style="color:white; text-transform: uppercase;" class="panel-heading"><b>CERTIFICADO ${itemJson['lista_certificado']['descripcion']}</b> </div>
                                <div class="panel-body">
                                    <div class="col-md-12">
                                        <div class="row" id="bodydetalle${i2}" >
                                        </div>
                                    </div>
                                </div>    
                                `);
                    var actividades='';
                    $.each(itemJson['establecimientoresponsable']['establecimiento_actividades'],function(i,item2){
                        actividades=`${actividades}<li>${item2['actividades']['Descripcion']}</li>`
                    })

                    $('#bodydetalle'+i2).append(`
                                    <div class="x_panel">
                                        <div  class="x_content x_content_border_mobil">
                                            <div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">
                                                <div class="form-group" style="color: black">
                                                        <b>Estado:</b> ${estado}<br>
                                                        <b>Fecha Solicitud:</b> ${itemJson['fechaSolicitud']}  <br>
                                                        ${fechaGeneracion}
                                                        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="x_panel">
                                        <div  class="x_content x_content_border_mobil">
                                            <p style="color:black;text-transform: uppercase;"><b>DETALLE DEL ESTABLECIMIENTO </b></p>
                                            <div   class=" x_content_border_mobil ">
                                                <div  style="color: black; display: none font-size: 12px;  ">
                                                    <div class="">
                                                        <div class="row">
                                                            <div class="col-sm-12">
                                                                <table style="color: black"  id="TablaEstablecimientosAtc" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
                                                                    <thead>
                                                                        <tr role="row">
                                                                            <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" >Predio</th>
                                                                            <th style="text-align: center" class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" >Establecimiento</th>
                                                                            <th style="text-align: center" class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1"  aria-label="Office: activate to sort column ascending" style="width: 10px;" >Actividades</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody >
                                                                    <tr role="row" class="odd">
                                                                        <td width="30%" colspan="1">
                                                                            <b>Clave:</b> ${itemJson['establecimientoresponsable']['establecimiento']['clave_catastral']}<br>
                                                                            <b>Dirección:</b> ${itemJson['establecimientoresponsable']['establecimiento']['direccion']}<br>
                                                                        </td>
                                                                        <td style="font-size: 12px" >
                                                                            
                                                                            <b>Nombre comercial: ${itemJson['establecimientoresponsable']['nombreComercial']}</b> 
                                                                            <br>
                                                                            <b>Área: ${itemJson['establecimientoresponsable']['area']} </b> <br>
                                                                            <b>Aforo: ${itemJson['establecimientoresponsable']['aforo']}</b>
                                                                        </td>
                                                                        <td>
                                                                        ${actividades}
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>                      
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            `);

                    if(itemJson['turno'].length>0){  
                        if(itemJson['turno'][0]['observacionPersona']!=null){
                            var observacion=itemJson['turno'][0]['observacionPersona'];
                        }else{
                            var observacion='';
                        }
                        $('#bodydetalle'+i2).append(`
                                <div class="x_panel">
                                    <div  class="x_content x_content_border_mobil">
                                        <p style="color:black;text-transform: uppercase;"><b>DETALLE DE AGENDAMIENTO </b></p>
                                        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                                            <div class="form-group" style="color: black">
                                            <table align="left">
                                            <tr align="left" >
                                                <td><strong>Establecimiento: </strong></td>
                                                <td >${itemJson['establecimientoresponsable']['nombreComercial']}</td>
                                            </tr>
                                            <tr align="left">
                                                <td><strong>Fecha: </strong></td>
                                                <td >${itemJson['turno'][0]['agenda']['fechaAgenda']}</td>
                                            </tr align="left">
                                            <tr align="left">
                                                <td><strong>Hora: </strong></td>
                                                <td >${itemJson['turno'][0]['horaInicio']} -${itemJson['turno'][0]['horaFin']}</td>
                                            </tr>
                            
                                            <tr align="left">
                                                <td><strong>Técnico asignado: </strong></td>
                                                <td >
                                                    ${itemJson['turno'][0]['agenda']['inspector']['persona']['name']}
                                                </td>
                                            </tr align="left">
                                            <tr align="left">
                                                <td><strong>Contacto Técnico: </strong></td>
                                                <td >
                                                    ${itemJson['turno'][0]['agenda']['inspector']['persona']['telefono']}
                                                </td>
                                            </tr>
                                            <tr align="left">
                                                <td><strong>Observación: </strong></td>
                                                <td>
                                                    ${observacion}
                                                </td>
                                            </tr>
                                        </table>
                                                
                                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `);
                    }

                    vistacargando();
                    $('#listado').hide(300);
                    $('#detalle').show(300);
                });
            }

            return;
        })
    }



function salirDetalle(){
    $('#detalle').hide(300);
    $('#listado').show(300);
}



