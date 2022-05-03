
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
        var idtabla = "table_certificados";
        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "asc" ]],
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


        //FUNCION PARA FILTRAR LOS TRÁMITES
        function filtrar_certificados(){
           
            var check_filtrar_fecha = false;
            if($("#check_filtrar_fecha").is(':checked')){
                check_filtrar_fecha = true;
            }
    
            var FrmData = {
                cmb_tipo_certificado: $("#cmb_tipo_certificado").val(),
                check_filtrar_fecha: check_filtrar_fecha,
                fechaInicio: $("#fechaInicio").val(),
                fechaFin: $("#fechaFin").val(),
                origen_cert: $(".origen_cert:checked").val()
            }
    
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
    
            vistacargando("M", "Espere...");
            $("#mensaje_info").hide(100);
    
            $.ajax({
                url: '/seguimientoCertificado/filtrarCertificado',
                method: "POST",
                data: FrmData,
                type: "json",
                success: function (retorno)
                {
                    vistacargando();
    
                    if(retorno.error == true){
                        mostrarMensaje(retorno.mensaje,retorno.status,'mensaje_info');
                    }else{
    
                        //cargamos le resumen de la búsqueda
                        $("#r_totales").html(retorno.lista_certificados.length);
                        $("#content_resultado").show();
    
                        var idtabla = "table_certificados";
                        $(`#${idtabla}`).DataTable({
                            dom: ""
                            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
                            +"<rt>"
                            +"<'row'<'form-inline'"
                            +" <'col-sm-6 col-md-6 col-lg-6'l>"
                            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                            "destroy":true,
                            order: [[ 0, "desc" ]],
                            pageLength: 10,
                            sInfoFiltered:false,
                            "language": lenguajeTabla,
                            data: retorno.lista_certificados,
                            columnDefs: [
                                { className: "col_sm", targets: 0 },
                                { className: "sorting", targets: 1 },
                                { className: "sorting", targets: 2 },
                                { className: "sorting", targets: 3 },
                                { className: "col_sm", targets: 4 },
                                { className: "col_sm", targets: 5 }
                            ],
                            columns:[
                                {data: "fechaGeneracion" },
                                {data: "lista_certificado.descripcion" },                               
                                {data: "fechaGeneracion", render : function (item, type, row){
                                    if(row.usuario != null){
                                        return row.usuario.name;
                                    }else{
                                        return `<span class="badge badge-warning">Sin Usuario</span>`;
                                    }                                    
                                }},
                                {data: "fechaGeneracion", render : function (item, type, row){                   
                                    if(row.usuario != null){
                                        return row.usuario.cedula;
                                    }else{
                                        return `<span class="badge badge-warning">Sin Cedula</span>`;
                                    }                                    
                                }},
                                {data: "origen", render : function (item, type, row){                         
                                    return `<center><span class="badge badge-info">${item}</span></center>`;
                                }},
                                {data: "fechaGeneracion" },
                            ],
                            "rowCallback": function( row, em_cer, index ){
                                var fecha_generacion = `<center><span class="badge badge-warning">Sin Fecha</span></center>`;
                                if(em_cer['fechaGeneracion']!=null){
                                    fecha_generacion = `<center><span class="badge badge-success">${em_cer['fechaGeneracion'].substr(0,10)}</span>`;
                                }
                                var user_crea='----------';
                                if(em_cer['usuarioCrea']>0){
                                    user_crea = em_cer['user_crea']['name'];
                                }
                                $('td', row).eq(0).html(fecha_generacion);
                                $('td', row).eq(0).addClass('col_sm');
                                $('td', row).eq(4).addClass('col_sm');
                                $('td', row).eq(5).html(user_crea);
                                $('td', row).eq(5).css('width', '100px');
                                
                            }
                        });
    
                        // para posicionar el input del filtro
                        $(`#${idtabla}_filter`).css('float', 'left');
                        $(`#${idtabla}_filter`).children('label').css('width', '100%');
                        $(`#${idtabla}_filter`).parent().css('padding-left','0');
                        $(`#${idtabla}_wrapper`).css('margin-top','10px');
                        $(`input[aria-controls="${idtabla}"]`).css('width', '100%');
                        //buscamos las columnas que deceamos que sean las mas angostas
                        $(`#${idtabla}`).find('.col_sm').css('width','1px');
                        // $(`#${idtabla}`).find('.col_lg').css('width','300px');
    
                    }
    
                },error: function(){
                    mostrarMensaje('Error al realizar la solicitud, Inténtelo más tarde','danger','mensaje_info');
                    vistacargando();
                }
            });
    
        }

        function limpiar_formulario(){
            $("#cmb_tipo_certificado").find('option').prop('selected', false);
            $("#cmb_tipo_certificado").trigger("chosen:updated");
            $("#fechaInicio").val("");
            $("#fechaFin").val("");
            $("#check_filtrar_fecha").iCheck('uncheck');
            $("#origen_todos").iCheck('check');    
            $("#origen_enlinea").iCheck('uncheck');    
            $("#origen_intranet").iCheck('uncheck');  
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

    // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
    $('#check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
        $("#content_filtrar_fecha").show(200);
    });

    $('#check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea
        $("#content_filtrar_fecha").hide(200);
    });

    // función que se desencade al cambiar un combo de los tipo de trámite
    function seleccionarCombo(cmb){       
        var option_sel= $(cmb).find('option:selected');
        var valor_sel=$(option_sel).attr('data-id');    
        if(valor_sel==0){            
            $(option_sel).prop('selected', false);
            $(cmb).find('.option').prop('selected', true);
            $(cmb).trigger("chosen:updated");
        }
    }