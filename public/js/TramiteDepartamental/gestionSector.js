    
    $(document).ready(function(){
            $('#id_tablasector').DataTable( {
                    "language": {
                        "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                                    '<option value="5">5</option>'+
                                    '<option value="10">10</option>'+
                                    '<option value="20">20</option>'+
                                    '<option value="30">30</option>'+
                                    '<option value="40">40</option>'+
                                    '<option value="-1">Todos</option>'+
                                    '</select> registros',
                        "search": "Buscar:",
                        "zeroRecords": "No se encontraron registros coincidentes",
                        "infoEmpty": "No hay registros para mostrar",
                        "infoFiltered": " - filtrado de _MAX_ registros",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                        "paginate": {
                            "previous": "Anterior",
                            "next": "Siguiente"
                    }
                }
        } );
    });
    
    //
    //
    //funcion que se ejecuta al dar clic en el boton agregar que permite agregar departamentos
    function agregar_bodega(){
        
        //obtenemos el valor del departamento seleccionado en el combo (value)
        var bodega = $('#idbodega').val();
        //ocultamos en el combo el valor selecciona y agreagado para que no se repite la informacion
        $('select[name="idbodega"] option:selected').hide();
        //obtenemos el valor del texto seleccionado en el combo, lo almaceno en (var c)
        var bodega_text=$('select[name="idbodega"] option:selected').text();
        //actualizo el combo       
            $("#idbodega").trigger("chosen:updated"); 
            
            $('.option_bodega').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#idbodega").trigger("chosen:updated"); // actualizamos el combo de zonas

            //alert(departamento);

    // validamos que le textarea no esté vacio
        if(bodega==""){
            alertNotificar("Ingrese una bodega", "default");
            return; // no agregamos la actividad
        }

        // si el contenedor de departamento esta oculto lo mostramos
        if($('#content_bodegas').hasClass('hidden') || $('#content_bodegas').is(':hidden')){
            // quidamos la clase hidden que oculta por defecto el contenedor de actividades
            $('#content_bodegas').removeClass('hidden');
            //coultamos y mostramos con animacion
            $('#content_bodegas').hide();
            $('#content_bodegas').show(200);
        }



        //agregamos un alert con una visualizacion del departamaneto agregado
        $('#conten_add_bodegas').append(`
            <div class="alert alert-info alert-dismissible fade in" role="alert" style="margin-bottom: 5px;">
                <button type="button" class="close" onclick="quitar_tipo_documento(this)" data-dismiss="alert" ><span aria-hidden="true">×</span>
                </button>
                <strong>Bodega!</strong> ${bodega_text}
                <input type="hidden" name="input_actividad[]" value="${bodega}">
            </div>
        `);

        $("#content_bodegas").show(200);
        
    }


    //funcion para quitar un departmaneto al dar a la X de cerrar
    function quitar_tipo_documento(boton){
        
        $(boton).parent().hide(200); // ocultamos el tipo de documento
        setTimeout(function(){ // esperamos unos segundos para dar animacion

            $(boton).parent().remove();
            // comprobamos si hay o no tipo de documentos agregados
            // preguntamos si no hay tipos de documentos "div"
            if($("#conten_add_bodegas").find('div').length==0){
                //ocultamos el contenedor de tipo de documentos
                $('#content_bodegas').hide(200);
            }

            //mostramos en la modal el tipo de documento quitado
            var idbodega=$(boton).siblings('input').val(); // id del tipo de documento quitado

            // mostramos en la modal el tipo de documento quitado
            $(`#idbodega option[value="${idbodega}"]`).show();
            $('.option_bodega').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#idbodega").trigger("chosen:updated"); // actualizamos el combo de zonas

        }, 250);
        
    }

      



    
    function TipoTramite_editar(idtipotramite){
        $("#conten_add_departamentos").html(""); // primero limpiamos la tabla

        vistacargando('M','Espere...'); // mostramos la ventana de espera
        $.get("gestion/"+idtipotramite+"/edit", function (data) {
            console.log(data);
            //console.log(data.tipotramite_departamento.departamentotramite.nombre);

            // $.each(data.tipotramite_departamento.departamentotramite,function(i,item){
            //     console.log(item.nombre);
            // });
            var condicion_tramite_global=data.tramite_global;

        if(condicion_tramite_global=='0'){
            $('#input_tramite_global').iCheck('uncheck');
            
            $.each(data.tipotramite_departamento,function(i,item){

                if($('#content_departamentos').hasClass('hidden') || $('#content_departamentos').is(':hidden')){
                    // quidamos la clase hidden que oculta por defecto el contenedor de actividades
                    $('#content_departamentos').removeClass('hidden');
                    //coultamos y mostramos con animacion
                    $('#content_departamentos').hide();
                    $('#content_departamentos').show(200);
                }

                
                var idDepartamento = item.departamentotramite.iddepartamento;
                var nombreDep = item.departamentotramite.nombre;

                //agregamos un alert con una visualizacion de la actividad agregada
                $('#conten_add_bodegas').append(`
                <div class="alert alert-info alert-dismissible fade in" role="alert" style="margin-bottom: 5px;">
                    <button type="button" class="close" onclick="quitar_tipo_documento(this)" data-dismiss="alert" ><span aria-hidden="true">×</span>
                    </button>
                    <strong>Departamento!</strong> ${nombreDep}
                    <input type="hidden" name="input_actividad[]" value="${idDepartamento}">
                </div>
                `);

                $("#content_departamentos").show(200);

                $(`#iddepartamento option[value="${idDepartamento}"]`).hide();
                $('.TP_option').prop('selected',false); // deseleccionamos las zonas seleccionadas
                $("#iddepartamento").trigger("chosen:updated"); // actualizamos el co
    
            });

        }else{
            $('#input_tramite_global').iCheck('check');
        }
            //Mostramos los datos para editar
            $('#id_nombre').val(data.tipo);
            $('#id_descripcion').val(data.descripcion);
            $('#id_ayuda').val(data.ayuda);

            $('.TP_option').attr("selected", false);
            $(`#TP_departamento option[value="${data.iddepartamento}"]`).attr("selected", true);
            $('#TP_departamento_chosen').children('a').children('span').html($(`#TP_departamento option[value="${data.iddepartamento}"]`).html());

        
            vistacargando(); // ocultamos la ventana de espera
        }).fail(function(){
            // si ocurre un error
            vistacargando(); // ocultamos la vista de carga
            alert('Se produjo un error al realizar la petición. Comunique el problema al departamento de tecnología');
        });

        $('#method_tipotramite').val('PUT'); // decimo que sea un metodo put
        $('#id_frmtipotramite').prop('action',window.location.protocol+'//'+window.location.host+'/tipotramite/gestion/'+idtipotramite);
        $('#btn_tipotramitecancelar').removeClass('hidden');

        // $('html,body').animate({scrollTop:$('#administrador_permisos').offset().top},400);
    }



    $('#btn_tipotramitecancelar').click(function(){
        $('#id_nombre').val('');
        $('#id_descripcion').val('');
        $('#id_ayuda').val('');
        $('#input_tramite_global').iCheck('uncheck');
        

        // $('.departamento').hide(); 
        $("#conten_add_departamentos").html(""); // primero limpiamos la tabla
        $('#content_departamentos').addClass('hidden');
        $('#content_departamentos').val('');

        $('.TP_option').attr("selected", false); 
        $('#TP_departamento_chosen').children('a').children('span').html('Seleccione un departamento');

        $('#method_tipotramite').val('POST'); // decimo que sea un metodo put
        $('#id_frmtipotramite').prop('action',window.location.protocol+'//'+window.location.host+'/tipotramite/gestion');
        $(this).addClass('hidden');
    });



    function TipoTramite_eliminar(idtipotramite){
        if(!confirm("Esta seguro que quiere eliminar el Tipo de Tramite")){
            return;
        }
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            url: '/tipotramite/gestion/'+idtipotramite,
            type: 'DELETE',
        });
        location.reload();
    }

    function sector_editar(id_sector){
       $.get("gestion/"+id_sector+"/edit", function (data) {
        console.log(data);
            $('#id_descripcion').val(data.resultado.descripcion); // cargamos la descripción del sector a editar
            $('.option_bodega').prop('selected',false); // deseleccioamos todas las zonas del combo
            $(`#idbodega option[value="${data.resultado.bodega.id_bodega}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
            $("#idbodega").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
            alert("Error al ejecutar la petición");
        });

        $('#method_sector').val('PUT'); // decimo que sea un metodo put
        $('#id_frmsector').prop('action',window.location.protocol+'//'+window.location.host+'/sector/gestion/'+id_sector); // actualizamos la ruta del formulario para actualizar
        $('#btn_sectorcancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#adm').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina        
    }


    $('#btn_sectorcancelar').click(function(){
        $('#id_descripcion').val(''); // limpiamos el input de descripción
        $('.option_bodega').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#idbodega").trigger("chosen:updated"); // actualizamos el combo de zonas
        $('#method_sector').val('POST'); // decimo que sea un metodo put
        $('#id_frmsector').prop('action',window.location.protocol+'//'+window.location.host+'/sector/gestion'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });
 function btn_eliminar_sector(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
 }
