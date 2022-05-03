
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
        cargar_estilos_tabla("id_tablagestion");
        cargar_estilos_tabla("tabla_tramites");
    });


    function cargar_estilos_tabla(idtabla){

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
        $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
        $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','10px');
        $(`#${idtabla}`).find('.resp').css('width','150px');  
        $(`#${idtabla}`).find('.flex').css('display','flex');   
        $('[data-toggle="tooltip"]').tooltip();

    }


    function gestionarchivo_editar(id_gestion_archivo){
        
        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get("listado/"+id_gestion_archivo+"/edit", function (data) {

            vistacargando();
            
            $('#adm_edicion').removeClass('hidden'); //quito la clase hidden para mostrar el contenido del formulario de edicion            
            $('#admlistado').addClass('hidden'); //oculto el contenido del listado de los tramites archivados
            $('#contenedor_bod').html('');
            $('#id_tablaprioridadtramite_editar').html('');
            $('.bodega').hide();   
            $('#tablaeditar').removeClass('hidden');
            $("#id_tablaprioridadtramite").html("");

            //obtenemos el nombre del lugar de almacenamiento del archivo
            var bodegaTexto=data.resultado.seccion.sector.bodega.nombre+" "+data.resultado.seccion.sector.descripcion
            +" "+data.resultado.seccion.descripcion;
            //obtenemos el id del lugar de almacenamiento del archivo
            var idlugarBodega =data.resultado.id_seccion;        

            //mostramos el contendor lugar de almacenamiento
            $(".modal_Bodega").modal("hide"); //ocultamos la modal para ver la animación
            $("#area_listaBodega").show(250); //damos animación de entrada

            //agregamos el lugar de almacenamiento de seleccionado
            $("#contenedor_bod").append(`
                <div class="alert f_documento fade in" style="margin-bottom: 5px;">
                    <button type="button" class="close" onclick="quitar_lugar_bodega(this)"><span aria-hidden="true">×</span>
                    </button>
                    <strong><i class="fa fa-archive"></i></strong> ${bodegaTexto}
                    <input type="hidden" name="input_lugar_bod" value="${idlugarBodega}">
                </div>
            `);

            var carpetavalor=(data.resultado.folder);
            $('#carpeta').val(data.resultado.folder);
            $('#codigotramite').val(data.resultado.seccion.descripcion);
            $('#asunto').val(data.resultado.seccion.descripcion);

            $('#id_tablaprioridadtramite_editar').append('<tr><td>' + 1 + '</td><td>' 
            + data.resultado.tramitedoc.codTramite +
            '</td><td>' + data.resultado.tramitedoc.asunto + '</td><td>' 
            + data.resultado.tramitedoc.observacion + '</td></tr>');
                        
        }).fail(function(){
            // si ocurre un error
            vistacargando(); // ocultamos la vista de carga
            alert('Se produjo un error al realizar la petición. Comuniquese el problema al departamento de tecnología');
        });

        $('#method_gestionarchivo').val('PUT'); // decimo que sea un metodo put
        $('#id_frmgestionarchivo').prop('action',window.location.protocol+'//'+window.location.host+'/archivo/listado/'+id_gestion_archivo);
        $('#btn_gestionarchivo_cancelar').removeClass('hidden');

        $('html,body').animate({scrollTop:$('#adm_edicion').offset().top},400);
    }


    $('#btn_gestionarchivo_cancelar').click(function(){

        $('#tablaeditar').addClass('hidden');
        $('#tablaregistro').removeClass('hidden');
        $('#carpeta').val('');
        $('#id_ubicacion').val('');
        $(".modal_Bodega").modal("hide");

        $('#adm_edicion').addClass('hidden');
        $('#admlistado').removeClass('hidden');        
        $(this).addClass('hidden');

        //revisamos el filtro
        if($("#check_fecha").is(':checked')){
            filtratArchivoporfechas();
        }else if($("#check_tramite").is(':checked')){
            filtrarArchivoportexto();
        }else if($("#check_lugar").is(':checked')){
            filtrarArchivoporlugar();
        }else{
            $("#check_ultmio").iCheck('uncheck');
            $("#check_ultmio").iCheck('check');
        }

        num_celdas = $("#tabla_tramites thead th").length;
        $("#tabla_tramites tbody").html(`<tr><td colspan="${num_celdas}"><center>Cargando...</center></td></tr>`)

    });



    //funcion para quitar un tipo de documento al dar a la X de cerrar
    function quitar_lugar_bodega(boton){
        
        $(boton).parent().hide(200); // ocultamos el tipo de documento
        setTimeout(function(){ // esperamos unos segundos para dar animacion

            $(boton).parent().remove();
            // comprobamos si hay o no tipo de documentos agregados
            // preguntamos si no hay tipos de documentos "div"

            if($("#contenedor_bod").find('div').length==0){
                //ocultamos el contenedor de tipo de documentos
                $('#area_listaBodega').hide(200);
                $('.bodega').show();

            }

            //mostramos en la modal el tipo de documento quitado
            var idTDeliminado=$(boton).siblings('input').val(); // id del tipo de documento quitado

            // mostramos en la modal el tipo de documento quitado
            $(`#li_lugar_bod_${idTDeliminado}`).show();

        }, 250);
        
    }


    //////////////////////////////////////////////////////////////////////////////////////

 
   //cuando selecciono una bodega de la modal 
    $('input:checkbox[name=chk]').on('ifChecked', function() {
       
        $("#contenedor_bod").html("");
        $('.bodega').hide();

        // recorremos todos los input que tengan la clase 'td_seleccionado' ya que son los checked de la modal
        $(".td_seleccionado").each(function(index, input){

            //preguntamos solo por los que estan seleccionados con el checked
            if( $(input).prop('checked')){
                //obtenemos el texto del lugar de almacenamiento seleccionado
                var bodegaTexto=$(input).parents(".label_doc_act_select").text();
                //obtenemos el id del lugar de almacenamiento seleccionado
                var idlugarBodega = $(input).val();

                //ocultamos la modal
                $(".modal_Bodega").modal("hide"); //ocultamos la modal para ver la animación
                $("#area_listaBodega").show(250); //damos animación de entrada

                //agregamos el tipo de documento seleccionado al listado de documentos requeridos
                $("#contenedor_bod").append(`
                    <div class="alert f_documento fade in" style="margin-bottom: 5px;">
                        <button type="button" class="close" onclick="quitar_lugar_bodega(this)"><span aria-hidden="true">×</span>
                        </button>
                        <strong><i class="fa fa-archive"></i></strong> ${bodegaTexto}
                        <input type="hidden" name="input_lugar_bod" value="${idlugarBodega}">
                    </div>
                `);

                //deseleccionamos el tipo de documento y quitamos el efecto de checkeado
                $(input).iCheck('uncheck');
                $('input[type=checkbox]').ifChecked('uncheck');
                 $(input).parent(".checked").removeClass("checked");
                //ocultamos el tipo de documento de la lista en la modal

            }
        });
    
    });
 

    function filtrarArchivoportexto(){

       var busqueda = $("#busqueda").val();
        if(busqueda === ''){
            alert("Ingrese una descripción");
            return false;
        }else{

            vistacargando("M", "Filtrando...");
            $.get(`/archivo/listado/${busqueda}/filtrarportexto`, function(retorno){
          
                vistacargando();
                cargar_tabla_filtro(retorno.resultado);

            });
        
        }  
    }


    function filtratArchivoporfechas(){
        
        var inicio = $("#inicio").val();
        var fin = $("#fin").val();  

        if(inicio ==''){
            alert("Seleccione un rango de fecha");
            return false;
        }
        if(fin ==''){
            alert("Seleccione un rango de fecha");
            return false;
        }

        vistacargando("M", "Filtrando...");
        $.get(`/archivo/listado/${inicio}/${fin}/filtrar`, function(retorno){

            vistacargando();
            cargar_tabla_filtro(retorno.resultado);

        });
         
    }



    function filtrarArchivoporlugar(){
   

        var lugar = $("#cmb_lugar").val();
        if(lugar === ''){
            alert("Seleccione una opción");
            return false;
        }else{
    
            vistacargando("M", "Filtrando...");
            $.get(`/archivo/listado/${lugar}/filtrarporlugar`, function(retorno){
                
                vistacargando();
                cargar_tabla_filtro(retorno.resultado);                                   

            });


        }  
    }


    $('#check_ultmio').on('ifChecked', function(event){
   
        var ultimo = 'ultimo';
 
        vistacargando("M", "Filtrando...");
        $.get(`/archivo/listado/${ultimo}/filtrarporultimo`, function(retorno){
            
            vistacargando();
            cargar_tabla_filtro(retorno.resultado);

        });
          
    });


    function cargar_tabla_filtro(lista_gestion_archivo){

        $("#tabla_tramites").DataTable().destroy();
        $('#tabla_tramites tbody').empty();

        $.each(lista_gestion_archivo, function (index, gestion_archivo) { 

            var f_motivo = "";
            if(gestion_archivo.fecha_movimiento!=null){
                f_motivo = gestion_archivo.fecha_movimiento;
            }

            $('#tabla_tramites tbody').append(`
                <tr>
                    <td>${gestion_archivo.tramitedoc.codTramite}</td>
                    <td>${gestion_archivo.tramitedoc.asunto}</td>
                    <td>${gestion_archivo.tramitedoc.observacion}</td>
                    <td>${gestion_archivo.fecha_gestion}</td>
                    <td>${f_motivo}</td>
                    <td>${gestion_archivo.seccion.sector.bodega.nombre} - ${gestion_archivo.seccion.sector.descripcion} - ${gestion_archivo.seccion.descripcion}</td>
                    <td>${gestion_archivo.folder}</td>
                    <td><button type="button" onclick="gestionarchivo_editar('${gestion_archivo.id_gestion_archivo_encrypt}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-edit"></i> </button></td>
                </tr>
            `);
        });

        cargar_estilos_tabla("tabla_tramites");

    }


    $('#check_fecha').on('ifChecked', function(event){

        $("#busqueda").val('');
        $('.option_lugar').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#cmb_lugar").trigger("chosen:updated"); // actualizamos el combo de zonas

        $('#check_tramite').iCheck('uncheck');
        $('#check_ultmio').iCheck('uncheck');
        $('#check_lugar').iCheck('uncheck');
        
        $('#busquedafecha').removeClass('hidden');
        $('#busquedalugar').addClass('hidden');
        $('#busquedatexto').addClass('hidden');
        
        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();

  });


    $('#check_fecha').on('ifUnchecked', function(event){

        $('#busquedafecha').addClass('hidden');
        // $("#inicio").val("");
        // $("#fin").val("");
        
        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();

    });

    
    $('#check_tramite').on('ifChecked', function(event){

        // $("#inicio").val("");
        // $("#fin").val("");
        $('.option_lugar').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#cmb_lugar").trigger("chosen:updated"); // actualizamos el combo de zonas
        
        $('#check_fecha').iCheck('uncheck');
        $('#check_lugar').iCheck('uncheck');
        $('#check_ultmio').iCheck('uncheck');
        $('#busquedatexto').removeClass('hidden');
        $('#busquedalugar').addClass('hidden');
        $('#busquedafecha').addClass('hidden');

        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();

     });

    
    $('#check_tramite').on('ifUnchecked', function(event){

        $('#busquedatexto').addClass('hidden');
        $("#busqueda").val('');
        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();

  });


    $('#check_lugar').on('ifChecked', function(event){

        $("#inicio").val("");
        $("#fin").val("");
        $("#busqueda").val('');
        $('#check_tramite').iCheck('uncheck');
        $('#check_fecha').iCheck('uncheck');
        $('#check_ultmio').iCheck('uncheck');
        $('#busquedalugar').removeClass('hidden');
        $('#busquedatexto').addClass('hidden');
        $('#busquedafecha').addClass('hidden');

        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();

    });


    $('#check_lugar').on('ifUnchecked', function(event){

        $('#busquedalugar').addClass('hidden');
        $('.option_lugar').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#cmb_lugar").trigger("chosen:updated"); // actualizamos el combo de zonas
        
        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();

    });
   

    $('#check_ultmio').on('ifChecked', function(event){
    
        $('#check_tramite').iCheck('uncheck');
        $('#check_fecha').iCheck('uncheck');
        $('#check_lugar').iCheck('uncheck');
        $('#busquedalugar').addClass('hidden');
        $('#busquedatexto').addClass('hidden');
        $('#busquedafecha').addClass('hidden');

        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();
        
    });

   
    $('#check_ultmio').on('ifUnchecked', function(event){

        // $('#busquedalugar').addClass('hidden');
        // $('.option_lugar').prop('selected',false); // deseleccionamos las zonas seleccionadas
        // $("#cmb_lugar").trigger("chosen:updated"); // actualizamos el combo de zonas
        
        var tablatramite = $('#tabla_tramites').DataTable();
        tablatramite
        .clear()
        .draw();

    });