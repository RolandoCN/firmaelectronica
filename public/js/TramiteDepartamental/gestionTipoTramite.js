    
    $(document).ready(function(){
            $('#id_tablatipotramite').DataTable( {
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
    function agregar_departamento(){
        
        //obtenemos el valor del departamento seleccionado en el combo (value)
        var departamento = $('#iddepartamento').val();
        //ocultamos en el combo el valor selecciona y agreagado para que no se repite la informacion
        $('select[name="iddepartamento"] option:selected').hide();
        //obtenemos el valor del texto seleccionado en el combo, lo almaceno en (var c)
        var c=$('select[name="iddepartamento"] option:selected').text();
        //actualizo el combo       
            $("#iddepartamento").trigger("chosen:updated"); 
            
            $('.TP_option').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#iddepartamento").trigger("chosen:updated"); // actualizamos el combo de zonas

            //alert(departamento);

    // validamos que le textarea no esté vacio
        if(departamento==""){
            alertNotificar("Ingrese un departamento", "default");
            return; // no agregamos la actividad
        }

        // si el contenedor de departamento esta oculto lo mostramos
        if($('#content_departamentos').hasClass('hidden') || $('#content_departamentos').is(':hidden')){
            // quidamos la clase hidden que oculta por defecto el contenedor de actividades
            $('#content_departamentos').removeClass('hidden');
            //coultamos y mostramos con animacion
            $('#content_departamentos').hide();
            $('#content_departamentos').show(200);
        }



        //agregamos un alert con una visualizacion del departamaneto agregado
        $('#conten_add_departamentos').append(`
            <div class="alert alert-info alert-dismissible fade in" role="alert" style="margin-bottom: 5px;">
                <button type="button" class="close" onclick="quitar_tipo_documento(this)" data-dismiss="alert" ><span aria-hidden="true">×</span>
                </button>
                <strong>Departamento!</strong> ${c}
                <input type="hidden" name="input_actividad[]" value="${departamento}">
            </div>
        `);

        $("#content_departamentos").show(200);
        
    }


    //funcion para quitar un departmaneto al dar a la X de cerrar
    function quitar_tipo_documento(boton){
        
        $(boton).parent().hide(200); // ocultamos el tipo de documento
        setTimeout(function(){ // esperamos unos segundos para dar animacion

            $(boton).parent().remove();
            // comprobamos si hay o no tipo de documentos agregados
            // preguntamos si no hay tipos de documentos "div"
            if($("#conten_add_departamentos").find('div').length==0){
                //ocultamos el contenedor de tipo de documentos
                $('#content_departamentos').hide(200);
            }

            //mostramos en la modal el tipo de documento quitado
            var iddepartamento=$(boton).siblings('input').val(); // id del tipo de documento quitado

            // mostramos en la modal el tipo de documento quitado
            $(`#iddepartamento option[value="${iddepartamento}"]`).show();
            $('.TP_option').prop('selected',false); // deseleccionamos las zonas seleccionadas
            $("#iddepartamento").trigger("chosen:updated"); // actualizamos el combo de zonas

        }, 250);
        
    }

      

    $('#input_tramite_global').on('ifChecked', function(event){
        //alert(event.type + ' callback');
        $('.departamento').hide(200); 
        $("#conten_add_departamentos").html(""); // primero limpiamos la tabla
        $('#content_departamentos').addClass('hidden');
        $('#content_departamentos').val('');
    });



    $('#input_tramite_global').on('ifUnchecked', function(event){
        //alert(event.type + ' callback');
        $('.departamento').show(200);
    });


    
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
        if(data.institucion=='EP'){
            $('#input_aguas').iCheck('check');
        }else{
            $('#input_aguas').iCheck('uncheck');
        }
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
                $('#conten_add_departamentos').append(`
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