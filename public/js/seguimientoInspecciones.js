


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





 //FUNCION PARA FILTRAR LAS INSPECCIONES
    function filtrarInspecciones(){
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
      url: '/seguimientoInspecciones/filtrar', 
      method: "POST", 
            data: FrmData,
            type: "json",             
      complete: function (request)   
      {
                vistacargando();
                //console.log(data);
                var retorno = request.responseJSON;

                if(retorno.error == true){
                    mostrarMensaje(retorno.mensaje,retorno.status,'mensaje_info');
                }else{

                    //cargamos le resumen de la búsqueda
                    // $("#r_totales").html(retorno.lista_tramites.length);
                    // $("#r_pendientes").html(retorno.pendientes);
                    // $("#r_finalizados").html(retorno.finalizados);
                    // $("#content_resultado").show(); console.log();

                    var idtabla = "datatable";
                    $(`#${idtabla}`).DataTable({
                        dom: ""
                        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                        +"<rt>"
                        +"<'row'<'form-inline'"
                        +" <'col-sm-6 col-md-6 col-lg-6'l>"
                        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                        "destroy":true,
                        order: [[ 0, "desc" ]],
                        pageLength: 5,
                        sInfoFiltered:false,
                        "language": lenguajeTabla,
                        data: retorno.lista_inspecciones,
                        columnDefs: [
                            {  width:"15%", targets: 0 },
                            {  width:"15%", targets: 1 },
                            {  width:"46%", targets: 2 },
                            {  width:"12%", targets: 3 },
                            {  width:"12%", targets: 4 }
                        ],
                        columns:[
                            {data: "agenda.fechaAgenda" },
                            {data: "estado" },
                            {data: "estado" },
                            {data: "estado" },
                            {data: "estado" },
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, turno, index ){
                            
                            //columna de fecha
                                //$('td', row).eq(0).addClass('center_vertical user_selec');
                                $('td', row).eq(0).html(`
                                    <center>${turno['agenda']['fechaAgenda']}</center>
                                `);

                            //columna informacion general del trámite
                                // var area_responsable = retorno['listaAreaResp'][tramite['tramite']['codigoTramite']];
                                // if(area_responsable==null) {area_responsable=""; }
                                if(turno.idemision_certificado==null){ var certificado=""}
                                else{var certificado=turno.emision.lista_certificado.descripcion;}
                                if(turno.usuario==null){ var cedula=""}
                                else{var cedula=turno.usuario.cedula;}
                                var codigo=turno.codigo;
                                var inspector=turno.agenda.inspector.persona.name;
                                var detalle=turno.detalle;
                                
                                var obsCont=turno.observacionPersona;
                                var obsFunc=turno.observacionFuncionario;
                                if(cedula==null){cedula="";}
                                if(codigo==null){codigo="";}
                                if(inspector==null){inspector="";}
                                if(detalle==null){detalle="";}
                                if(certificado==null){certificado="";}
                                if(obsCont==null){obsCont="";}
                                if(obsFunc==null){obsFunc="";}
                                if(turno.usuario==null){cedula=""}


                                $('td', row).eq(2).addClass('center_vertical td_info_tramite');
                                $('td', row).eq(2).html(`                    
                                    <div style="min-width:300px;"></div>
                                    <b><i class="fa fa-tags"></i> Contibuyente:</b> ${cedula}<br>
                                    <b><i class="fa fa-tags"></i> Código:</b> ${codigo}<br>
                                    <b><i class="fa fa-user"></i> Inspector encargado:</b> ${inspector}<br>                                    
                                    <b><i class="fa fa-exclamation-circle"></i> Detalle:</b> ${detalle}<br>                
                                    <b><i class="fa fa-file-text"></i> Certificado:</b> <span style="color: #337ab7; font-weight: 800;">${certificado}</span><br>
                                    
                                `);
                                var estad=turno.estadoAtencion;
                                if(estad=='P'){
                                    // estad="Pendiente";
                                    $('td',row).eq(3).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-danger estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>');
                                }
                                if(estad=='A'){
                                    // estad="Atendido"
                                   $('td',row).eq(3).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>'); 
                            }  

                            if(turno.emision==null)
                            {var fechasolicitud="";
                            }
                            else{
                             var fechasolicitud=turno.emision.fechaSolicitud;       
                            } 
                            $('td', row).eq(1).html(`
                                    <center>${fechasolicitud}</center>
                                `);

                                

                                ///$('td', row).eq(2).html(estad);    
                                //columna estado del trámite
                                // var estado_tramite = "EN PROCESO";
                                // var color_dias = "danger";
                                // var mensaje_dias = "Han transcurrido";
                                // if(tramite['tramite']['finalizado']==1){ 
                                //     estado_tramite = "FINALIZADO"; 
                                //     color_dias="success"; 
                                //     mensaje_dias="Tardó un total de"
                                // }
                                // $('td', row).eq(2).addClass('center_vertical user_selec');
                                // $('td', row).eq(2).html(`
                                //     <b style="text-align: center; font-weight: 800; display: block;">${estado_tramite}</b>
                                
                                // `);

                                $('td', row).eq(4).html(turno.estado);
                            //columna de botones de acción
                                $('td', row).eq(4).addClass('center_vertical');
                                $('td', row).eq(4).html(`
                                    <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleInspeccion
                                    ('${turno.idturno}', this)"> 
                                        <i class="fa fa-check"></i> Detalle
                                    </button>
                                `);        
                                $('td', row).eq(4).find("button").tooltip();
    
                        }                                
                    }); 

                    // para posicionar el input del filtro
                    $(`#${idtabla}_filter`).css('float', 'left');
                    $(`#${idtabla}_filter`).children('label').css('width', '100%');
                    $(`#${idtabla}_filter`).parent().css('padding-left','0');
                    $(`#${idtabla}_wrapper`).css('margin-top','10px');
                    $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
                    //buscamos las columnas que deceamos que sean las mas angostas
                    $(`#${idtabla}`).find('.col_sm').css('width','10px');
                    // $(`#${idtabla}`).find('.col_lg').css('width','300px');
                    
                }
                
      },error: function(){
                mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                vistacargando();
            }
      });

    }



    function cargarDetalleInspeccion(id){
    
          //  alert(id);
    $('#detallehorario').html('');
    vistacargando("M", "Espere..");
    $.get("/seguimientoInspecciones/detalle/"+id+"/edit", function (data) {
         vistacargando();
        $('#listado').hide(300);
        $('#detalle').show(300);
        console.log(data);
        if(data.resultado.usuario==null){
        var datosnull="";
        $('#cedula').html(datosnull);
        $('#nombres').html(datosnull);
        $('#celular').html(datosnull);
        $('#correo').html(datosnull);
        $('#profesion').html(datosnull);
        $('#sexo').html(datosnull);
    
        }
        else{
        $('#cedula').html(data.resultado.usuario.cedula);
        $('#nombres').html(data.resultado.usuario.name);
        $('#celular').html(data.resultado.usuario.celular);
        $('#correo').html(data.resultado.usuario.email);
        $('#profesion').html(data.resultado.usuario.profesion);
        $('#sexo').html(data.resultado.usuario.sexo);
    }
        $('#cedulainspector').html(data.resultado.agenda.inspector.persona.cedula);
        $('#nombresinspector').html(data.resultado.agenda.inspector.persona.name);
        $('#celularinspector').html(data.resultado.agenda.inspector.persona.celular);
        $('#correoinspector').html(data.resultado.agenda.inspector.persona.email);
        $('#profesioninspector').html(data.resultado.agenda.inspector.persona.profesion);
        $('#sexoinspector').html(data.resultado.agenda.inspector.persona.sexo);

        if(data.resultado.emision==null)
        {var tipocertificado="";
         var fechaapr="";
         var detalecert="";
        }
        else{ 
        var tipocertificado=data.resultado.emision.lista_certificado.descripcion;
        var detalecert=data.resultado.emision.lista_certificado.detale;
        var fechaapr=data.resultado.emision.fechaGeneracion;
        if(fechaapr==null){fechaapr=""
         }
        }

        $('#tipocertificado').html(tipocertificado);
        $('#detallece').html(detalecert);
        $('#observacion').html(data.resultado.observacionFuncionario);
        // $('#horario').html(data.resultado.agenda.inspector.usuarios.celular);
        // $('#fechaaprobacion').html(fechaapr);
        

      //  console.log(data.resultado.emision.fechaAprobacion);
        console.log(data.resultado.observacionFuncionario);
//        $('#sexoinspector').html(data.resultado.agenda.inspector.usuarios.sexo);

        //$.each(data.resultado.agenda.inspector.horarios.detalle, function(i,item){

            if(data.resultado.estadoAtencion=='A'){var estadoinsp="Atendido";}else{ var estadoinsp="Por atender";}
             $('#detallehorario').append(
             `<tr>
                 <td>${data.resultado.agenda.fechaAgenda}</td>
                 <td>${data.resultado.horaInicio}</td>
                 <td>${data.resultado.horaFin}</td>
                 <td>${estadoinsp}</td>
                 <td>${fechaapr}</td>
                 
                 </tr>`);
                        
        

        // });



       })
}



function salirDetalle(){
            
            $('#detalle').hide(300);
            $('#listado').show(300);

        }












     //FUNCION PARA FILTRAR LOS TRÁMITES
    function filtrarTramitesPorCodigo(){
       var estado_tramite_au="F";
       var check_filtrar_fecha = false;
        if($("#check_filtrar_fecha_Cod").is(':checked')){
            check_filtrar_fecha = true;
        }

       var FrmData = {
          
            codigo:$('#codigo').val(),
            check_filtrar_fecha: check_filtrar_fecha,
            fechaInicio: $("#fechaInicioCod").val(),
            fechaFin: $("#fechaFinCod").val(),
            estado_tramite: estado_tramite_au
        } 

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });  

        vistacargando("M", "Espere...");

        $.ajax({
      url: '/gestionCargaDocumentos/filtrarTramitesPorCodigo', 
      method: "POST", 
            data: FrmData,
            type: "json",             
      complete: function (request)   
      {
                vistacargando();
                var retorno = request.responseJSON;
                console.clear(); console.log(retorno);

                if(retorno.error == true){
                    mostrarMensaje(retorno.mensaje,retorno.status,'mensaje_info');
                }else{

                    //cargamos le resumen de la búsqueda
                    $("#r_totales").html(retorno.lista_tramites.length);
                    $("#r_pendientes").html(retorno.pendientes);
                    $("#r_finalizados").html(retorno.finalizados);
                    $("#content_resultado").show(); console.log();

                    var idtabla = "table_tramites";
                    $(`#${idtabla}`).DataTable({
                        dom: ""
                        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                        +"<rt>"
                        +"<'row'<'form-inline'"
                        +" <'col-sm-6 col-md-6 col-lg-6'l>"
                        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                        "destroy":true,
                        order: [[ 1, "asc" ]],
                        pageLength: 5,
                        sInfoFiltered:false,
                        "language": lenguajeTabla,
                        data: retorno.lista_tramites,
                        columnDefs: [
                            {  className: "col_m", targets: 0 },
                            {  className: "sorting", targets: 1 },
                            {  className: "sorting col_m", targets: 2 },
                            // {  className: "sorting col_sm", targets: 3 }
                        ],
                        columns:[
                            {data: "tramite.fechaCreacion" },
                            {data: "tramite.index" },
                            {data: "tramite", render : function (tramite, type, row){ 
                                // para que busque por todos estos criterios
                                return `${tramite.cedula} ${tramite.proceso} ${tramite.asunto} ${tramite.descripcionTramite} ${retorno['listaAreaResp'][tramite.codigoTramite]}` 
                            }},
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, tramite, index ){
                            
                            //columna de fecha
                                $('td', row).eq(0).addClass('center_vertical user_selec');
                                $('td', row).eq(0).html(`
                                    <center><b>${tramite['tramite']['fechaCreacion'].substr(0,10)}</b></center>
                                `);

                            //columna informacion general del trámite
                                var area_responsable = retorno['listaAreaResp'][tramite['tramite']['codigoTramite']];
                                if(area_responsable==null) {area_responsable=""; }

                                $('td', row).eq(1).addClass('center_vertical td_info_tramite');
                                $('td', row).eq(1).html(`                    
                                    <div style="min-width:300px;"></div>
                                   <b><i class="fa fa-user"></i> Contribuyente:</b> ${tramite['tramite']['cedula']}<br>
                                    <b><i class="fa fa-tags"></i> Código:</b> ${tramite['tramite']['proceso']}<br>
                                    <b><i class="fa fa-exclamation-circle"></i> Asunto:</b> ${tramite['tramite']['asunto']}<br>                
                                    <b><i class="fa fa-file-text"></i> Tipo Trámite:</b> <span style="color: #337ab7; font-weight: 800;">${tramite['tramite']['descripcionTramite']}</span><br>
                                    <b><i class="fa fa-users"></i> Área Responsable:</b> ${area_responsable}
                                `);

                            //columna estado del trámite
                                var estado_tramite = "EN PROCESO";
                                var color_dias = "danger";
                                var mensaje_dias = "Han transcurrido";
                                if(tramite['tramite']['finalizado']==1){ 
                                    estado_tramite = "FINALIZADO"; 
                                    color_dias="success"; 
                                    mensaje_dias="Tardó un total de"
                                }
                                // $('td', row).eq(2).addClass('center_vertical user_selec');
                                // $('td', row).eq(2).html(`
                                //     <b style="text-align: center; font-weight: 800; display: block;">${estado_tramite}</b>
                                
                                // `);

                            //columna de botones de acción
                                $('td', row).eq(2).addClass('center_vertical');
                                $('td', row).eq(2).html(`
                                    <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleTramite
                                    ('${tramite['tramite']['proceso']}', '${tramite['tramite']['cedula']}', this)"> 
                                        <i class="fa fa-check"></i> Seleccionar
                                    </button>
                                `);        
                                $('td', row).eq(2).find("button").tooltip();
    
                        }                                
                    }); 

                    // para posicionar el input del filtro
                    $(`#${idtabla}_filter`).css('float', 'left');
                    $(`#${idtabla}_filter`).children('label').css('width', '100%');
                    $(`#${idtabla}_filter`).parent().css('padding-left','0');
                    $(`#${idtabla}_wrapper`).css('margin-top','10px');
                    $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
                    //buscamos las columnas que deceamos que sean las mas angostas
                    $(`#${idtabla}`).find('.col_sm').css('width','10px');
                    // $(`#${idtabla}`).find('.col_lg').css('width','300px');
                    
                }
                
      },error: function(){
                mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                vistacargando();
            }
      });

    }


     //FUNCION PARA FILTRAR LOS TRÁMITES
    function filtrarTramitesPorCedula(){
       //var cmb_tipoTramite=$("#cmb_tipoTramite").val();
       var estado_tramite_au="F";
       //var fechaInicio=$("#fechaInicio").val();
      // var fechaFin=$("#fechaFin").val();
       var check_filtrar_fecha = false;
        if($("#check_filtrar_fecha_cedula").is(':checked')){
            check_filtrar_fecha = true;
        }

      

        var FrmData = {
          //  cmb_tipoTramite: $("#cmb_tipoTramite").val(),
            cedula:$('#cedula').val(),
            check_filtrar_fecha: check_filtrar_fecha,
            fechaInicio: $("#fechaInicioCedu").val(),
            fechaFin: $("#fechaFinCedu").val(),
            estado_tramite: estado_tramite_au
        } 

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });  

        vistacargando("M", "Espere...");

        $.ajax({
      url: '/gestionCargaDocumentos/filtrarTramitesPorCedula', 
      method: "POST", 
            data: FrmData,
            type: "json",             
      complete: function (request)   
      {
                vistacargando();
                var retorno = request.responseJSON;
                console.clear(); console.log(retorno);

                if(retorno.error == true){
                    mostrarMensaje(retorno.mensaje,retorno.status,'mensaje_info');
                }else{

                    //cargamos le resumen de la búsqueda
                    $("#r_totales").html(retorno.lista_tramites.length);
                    $("#r_pendientes").html(retorno.pendientes);
                    $("#r_finalizados").html(retorno.finalizados);
                    $("#content_resultado").show(); console.log();

                    var idtabla = "table_tramites";
                    $(`#${idtabla}`).DataTable({
                        dom: ""
                        +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                        +"<rt>"
                        +"<'row'<'form-inline'"
                        +" <'col-sm-6 col-md-6 col-lg-6'l>"
                        +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                        "destroy":true,
                        order: [[ 1, "asc" ]],
                        pageLength: 5,
                        sInfoFiltered:false,
                        "language": lenguajeTabla,
                        data: retorno.lista_tramites,
                        columnDefs: [
                            {  className: "col_m", targets: 0 },
                            {  className: "sorting", targets: 1 },
                            {  className: "sorting col_m", targets: 2 },
                            // {  className: "sorting col_sm", targets: 3 }
                        ],
                        columns:[
                            {data: "tramite.fechaCreacion" },
                            {data: "tramite.index" },
                            {data: "tramite", render : function (tramite, type, row){ 
                                // para que busque por todos estos criterios
                                return `${tramite.cedula} ${tramite.proceso} ${tramite.asunto} ${tramite.descripcionTramite} ${retorno['listaAreaResp'][tramite.codigoTramite]}` 
                            }},
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, tramite, index ){
                            
                            //columna de fecha
                                $('td', row).eq(0).addClass('center_vertical user_selec');
                                $('td', row).eq(0).html(`
                                    <center><b>${tramite['tramite']['fechaCreacion'].substr(0,10)}</b></center>
                                `);

                            //columna informacion general del trámite
                                var area_responsable = retorno['listaAreaResp'][tramite['tramite']['codigoTramite']];
                                if(area_responsable==null) {area_responsable=""; }

                                $('td', row).eq(1).addClass('center_vertical td_info_tramite');
                                $('td', row).eq(1).html(`                    
                                    <div style="min-width:300px;"></div>
                                   <b><i class="fa fa-user"></i> Contribuyente:</b> ${tramite['tramite']['cedula']}<br>
                                    <b><i class="fa fa-tags"></i> Código:</b> ${tramite['tramite']['proceso']}<br>
                                    <b><i class="fa fa-exclamation-circle"></i> Asunto:</b> ${tramite['tramite']['asunto']}<br>                
                                    <b><i class="fa fa-file-text"></i> Tipo Trámite:</b> <span style="color: #337ab7; font-weight: 800;">${tramite['tramite']['descripcionTramite']}</span><br>
                                    <b><i class="fa fa-users"></i> Área Responsable:</b> ${area_responsable}
                                `);

                            //columna estado del trámite
                                var estado_tramite = "EN PROCESO";
                                var color_dias = "danger";
                                var mensaje_dias = "Han transcurrido";
                                if(tramite['tramite']['finalizado']==1){ 
                                    estado_tramite = "FINALIZADO"; 
                                    color_dias="success"; 
                                    mensaje_dias="Tardó un total de"
                                }
                                // $('td', row).eq(2).addClass('center_vertical user_selec');
                                // $('td', row).eq(2).html(`
                                //     <b style="text-align: center; font-weight: 800; display: block;">${estado_tramite}</b>
                                
                                // `);

                            //columna de botones de acción
                                $('td', row).eq(2).addClass('center_vertical');
                                $('td', row).eq(2).html(`
                                    <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleTramite
                                    ('${tramite['tramite']['proceso']}', '${tramite['tramite']['cedula']}', this)"> 
                                        <i class="fa fa-check"></i> Seleccionar
                                    </button>
                                `);        
                                $('td', row).eq(2).find("button").tooltip();
    
                        }                                
                    }); 

                    // para posicionar el input del filtro
                    $(`#${idtabla}_filter`).css('float', 'left');
                    $(`#${idtabla}_filter`).children('label').css('width', '100%');
                    $(`#${idtabla}_filter`).parent().css('padding-left','0');
                    $(`#${idtabla}_wrapper`).css('margin-top','10px');
                    $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
                    //buscamos las columnas que deceamos que sean las mas angostas
                    $(`#${idtabla}`).find('.col_sm').css('width','10px');
                    // $(`#${idtabla}`).find('.col_lg').css('width','300px');
                    
                }
                
      },error: function(){
                mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                vistacargando();
            }
      });

    }

    // función que se desencade al cambiar un combo de los tipo de trámite 
    function seleccionarComboTipoTramite(cmb){
        var option_sel= $(cmb).find('option:selected');
        var valor_sel=$(option_sel).attr('data-id'); console.log(valor_sel);
        if(valor_sel==0){
            $(option_sel).prop('selected', false);
            $(cmb).find('.option').prop('selected', true);
            $(cmb).trigger("chosen:updated");
        }
    }

     //FUNCION PARA AGREGAR UN MENSAJE EN LA PANTALLA
    function mostrarMensaje(mensaje, status, idelement){
        var contenidoMensaje=`
            <div style="font-weight: 700;" class="alert alert-${status} alert-dismissible alert_sm" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>MENSAJE! </strong> <span> ${mensaje}</span>
            </div>
        `;
        $("#"+idelement).html(contenidoMensaje);
        $("#"+idelement).show(500);
        
        setTimeout(() => {
            $("#"+idelement).hide(500);
        }, 8000);
    }


      function limpiarcampos_(){
            $('#codigo').val('');
            $('#cedula').val('');
            $('#fechaInicioTipoP').val('');
            $('#fechaFinTipoP').val('');
            $('#fechaInicioCedu').val('');
            $('#fechaFinCedu').val('');
            // $('#check_busq_codigo').iCheck('uncheck');
            // $('#check_busq_cedula').iCheck('uncheck');
            // $('#check_busq_tipoProceso').iCheck('uncheck');
            $('#check_filtrar_fecha_tipoproc').iCheck('uncheck');
            $('#check_filtrar_fecha_cedula').iCheck('uncheck');
            $('.option').prop('selected',false); 
            $("#cmb_tipoTramite").trigger("chosen:updated"); 
        }


       //FUNCIÓN PARA CARGAR LOS DETALLES DE UN TRÁMITE
    function cargarDetalleTramite(codigoTramite, cedula, observacion, btn){

        $(btn).tooltip('hide');
        vistacargando("M", "Espere..");
        
        $.get(`/gestionCargaDocumentos/getDetalleTramite/${codigoTramite}/${cedula}`, function(retorno){
         console.clear(); console.log(retorno);
            vistacargando();
            if(retorno.error==true){
                mostrarMensaje(retorno['mensaje'],retorno['status'],'mensaje_info');
            }else{
                //cargamos mos la informacion del contribuyente

                      //$('#descripcion').val(retorno['contribuyente']['name']);
                      $('#codigo_tramite').val(retorno['tramite']['codigoRastreo']);
                      $('#idtramite').val(retorno['tramite']['idtramiteCiudadano']);
                      limpiarcampos_();  
                      $('#DetalleSolicitud').modal("hide");                                
                
            }
            
        }).fail(function(){
            mostrarMensaje('Error al obtener el detalle del trámite, Inténtelo más tarde','danger','mensaje_info');
            vistacargando();
        });
    }

    //FUNCIÓN PARA SALIR DEL A VISTA DE DETALLE TRÁMITE
    function salirDetalleTramite(){       
        $("#content_historial").hide(200);
        $("#content_contSeg").show(200);
        $(".info_cont").html("--");
        $("#datosTabla").html(`<tr><td colspan="7"><center>Sin resultados</center></td></tr>`); 
    }
