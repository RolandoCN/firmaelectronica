

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

    $(document).ready(function(){
        var idtabla = "table_tramites";
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 2, "desc" ]],
            pageLength: 10,
            sInfoFiltered:false,
            "language": lenguajeTabla
        });

        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
    });


    function vermodal1(){
     $('#DetalleSolicitud').modal("show");
      limpiarcampos_();  
      var table = $('#table_tramites').DataTable();
     table.clear();
            table.draw()
    }

    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#check_filtrar_fecha_cedula').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha_cedula").show(200);
    });
    
    $('#check_filtrar_fecha_cedula').on('ifUnchecked', function(event){ // si se deschekea.
        $("#content_filtrar_fecha_cedula").hide(200);
    });

     // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#check_filtrar_fecha_tipoproc').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha_tipoproc").show(200);
    });
    
    $('#check_filtrar_fecha_tipoproc').on('ifUnchecked', function(event){ // si se deschekea.
        $("#content_filtrar_fecha_tipoproc").hide(200);
    });



//ELIMINAR CERTIFICADO
function btn_eliminar(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        vistacargando('M','Eliminando...');
        $(btn).parent('.frm_eliminar').submit();
    }
}





 //FUNCION PARA FILTRAR LOS TRÁMITES
    function filtrarTramitesPorProceso(){
       var estado_tramite_au="F";
       var check_filtrar_fecha = false;
        if($("#check_filtrar_fecha_tipoproc").is(':checked')){
            check_filtrar_fecha = true;
        }

      
        var FrmData = {
            cmb_tipoTramite: $("#cmb_tipoTramite").val(),
            check_filtrar_fecha: check_filtrar_fecha,
            fechaInicio: $("#fechaInicioTipoP").val(),
            fechaFin: $("#fechaFinTipoP").val(),
            estado_tramite: estado_tramite_au
        } 

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });  

        vistacargando("M", "Espere...");

        $.ajax({
      url: '/gestionCargaDocumentos/filtrarTramitePorProceso', 
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

     function submit_subir(){
         if($('#codigo_tramite').val()==''){
             alertNotificar('Por favor seleccione el tramite','warning');
             vistacargando();
             return;
         }
         if($('#cmb_tipo_doc').val()==''){
            alertNotificar('Por favor seleccione el tipo de documento','warning');
            vistacargando();
            return;
        }
        if($('#descripcion').val()==''){
            alertNotificar('Por favor ingrese la descripcion','warning');
            vistacargando();
            return;
        }
        if($('#descripcion').val()==''){
            alertNotificar('Por favor ingrese la descripcion','warning');
            vistacargando();
            return;
        }
        if($('#formato').val()==''){
            alertNotificar('Por favor subir el documento','warning');
            vistacargando();
            return;
        }
         vistacargando('M','Subiendo documento...');
         $('#frm_Doc').submit();
     }

     //FUNCION PARA FILTRAR LOS TRÁMITES
    function filtrarTramitesPorCodigo(){
       var estado_tramite_au="F";
       var check_filtrar_fecha = false;
        if($("#check_filtrar_fecha_Cod").is(':checked')){
            check_filtrar_fecha = true;
        }
        if($('#codigo').val()==''){
            alertNotificar('Por ingrese el código','warning');
            return;
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
                    alertNotificar(retorno.mensaje,retorno.status);
                }else{

                    //cargamos le resumen de la búsqueda
                    // $("#r_totales").html(retorno.lista_tramites.length);
                    // $("#r_pendientes").html(retorno.pendientes);
                    // $("#r_finalizados").html(retorno.finalizados);
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
                            {data: "codTramite" },
                            {data: "codTramite" },
                            {data: "asunto" },
                            {data: "fechaCreacion" },
                            {data: "codTramite", render : function (tramite, type, row){ 
                                // para que busque por todos estos criterios
                                return `${tramite.codTramite} ${tramite.asunto}}` 
                            }},
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, tramite, index ){
                            
                            //columna de fecha
                                $('td', row).eq(0).addClass('center_vertical user_selec');
                                $('td', row).eq(0).html(`
                                    <center><b>${tramite['fechaCreacion'].substr(0,10)}</b></center>
                                `);
                                $('td', row).eq(1).addClass('center_vertical user_selec');
                                $('td', row).eq(1).html(`${tramite['codTramite']}`);
                                $('td', row).eq(2).addClass('center_vertical user_selec');
                                $('td', row).eq(2).html(`${tramite['asunto']}`);


                            // //columna informacion general del trámite
                            //     var area_responsable = retorno['listaAreaResp'][tramite['tramite']['codigoTramite']];
                            //     if(area_responsable==null) {area_responsable=""; }

                                $('td', row).eq(3).addClass('center_vertical td_info_tramite');
                                // $('td', row).eq(1).html(`                    
                                //     <div style="min-width:300px;"></div>
                                //    <b><i class="fa fa-user"></i> Contribuyente:</b> ${tramite['tramite']['cedula']}<br>
                                //     <b><i class="fa fa-tags"></i> Código:</b> ${tramite['tramite']['proceso']}<br>
                                //     <b><i class="fa fa-exclamation-circle"></i> Asunto:</b> ${tramite['tramite']['asunto']}<br>                
                                //     <b><i class="fa fa-file-text"></i> Tipo Trámite:</b> <span style="color: #337ab7; font-weight: 800;">${tramite['tramite']['descripcionTramite']}</span><br>
                                //     <b><i class="fa fa-users"></i> Área Responsable:</b> ${area_responsable}
                                // `);
                                $('td', row).eq(3).html(`${tramite['observacion']}`);

                            // //columna estado del trámite
                            //     var estado_tramite = "EN PROCESO";
                            //     var color_dias = "danger";
                            //     var mensaje_dias = "Han transcurrido";
                            //     if(tramite['tramite']['finalizado']==1){ 
                            //         estado_tramite = "FINALIZADO"; 
                            //         color_dias="success"; 
                            //         mensaje_dias="Tardó un total de"
                            //     }
                            //     // $('td', row).eq(2).addClass('center_vertical user_selec');
                            //     // $('td', row).eq(2).html(`
                            //     //     <b style="text-align: center; font-weight: 800; display: block;">${estado_tramite}</b>
                                
                            //     // `);

                            //columna de botones de acción
                                // $('td', row).eq(2).addClass('center_vertical');
                                // $('td', row).eq(2).html(`
                                //     <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleTramite
                                //     ('${tramite['tramite']['proceso']}', '${tramite['tramite']['cedula']}', this)"> 
                                //         <i class="fa fa-check"></i> Seleccionar
                                //     </button>
                                // `);        
                                // $('td', row).eq(2).find("button").tooltip();

                                $('td', row).eq(4).addClass('center_vertical');
                                $('td', row).eq(4).html(`
                                    <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleTramite
                                    ('${tramite['codTramite']}', '${tramite['idtramite']}')"> 
                                        <i class="fa fa-check"></i> 
                                    </button>
                                `);        
                                $('td', row).eq(3).find("button").tooltip();
    
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
                                        <i class="fa fa-check"></i> 
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
    function cargarDetalleTramite(codigoTramite,idtramite){

        // $(btn).tooltip('hide');
        vistacargando("M", "Espere..");
        
        // $.get(`/gestionCargaDocumentos/getDetalleTramite/${codigoTramite}/${cedula}`, function(retorno){
        //  console.clear(); console.log(retorno);
        //     vistacargando();
        //     if(retorno.error==true){
        //         mostrarMensaje(retorno['mensaje'],retorno['status'],'mensaje_info');
        //     }else{
        //         //cargamos mos la informacion del contribuyente

                      //$('#descripcion').val(retorno['contribuyente']['name']);
                      $('#codigo_tramite').val(codigoTramite);
                      $('#idtramite').val(idtramite);
                      limpiarcampos_();  
                      $('#DetalleSolicitud').modal("hide");       
                      vistacargando();                         
                    
        //     }
            
        // }).fail(function(){
        //     mostrarMensaje('Error al obtener el detalle del trámite, Inténtelo más tarde','danger','mensaje_info');
        //     vistacargando();
        // });
    }

    //FUNCIÓN PARA SALIR DEL A VISTA DE DETALLE TRÁMITE
    function salirDetalleTramite(){       
        $("#content_historial").hide(200);
        $("#content_contSeg").show(200);
        $(".info_cont").html("--");
        $("#datosTabla").html(`<tr><td colspan="7"><center>Sin resultados</center></td></tr>`); 
    }


        $("#frm_Doc").keypress(function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if(code==13){
                e.preventDefault();
                return;
            }
        });
    
        $("#form_busqueda").keypress(function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if(code==13){
                e.preventDefault();
               filtrarTramitesPorCodigo();
            }
        });
    
