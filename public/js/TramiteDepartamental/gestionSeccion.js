    
    $(document).ready(function(){
            $('#id_tablaseccion').DataTable( {
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
   
 function cargartdSector(){
        var idbodega=$('#idbodega').val();
        vistacargando('M',"Espere..."); // mostramos una ventana de carga
        $.get("/seccion/gestion/"+idbodega, function (data) {

               
            
            console.log(data);
            $('#idsector').html('');
            $.each(data.resultado,function(i,item){
                
                console.log(item.descripcion);
                $('#idsector').append(`<option class="option_sector_actividad" value="${item.id_sector}">${item.descripcion}</option>`);
            });
            $("#idsector").trigger("chosen:updated"); // actualizamos el combo de sector
            vistacargando(); // ocultamos la ventana de carga
             if(data.resultado.length === 0)
                {
                 alertNotificar("La bodega seleccionada no tiene asociada un sector","error");  
                }
        }).fail(function(erro){
            vistacargando(); // ocultamos la ventana de carga

        });

    }


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

    function seccion_editar(id_seccion){
       $.get("gestion/"+id_seccion+"/edit", function (data) {
        console.log(data);
        $('#idsector').html('');

    // seleccionamos en el combo sector

        $('#idsector').append(`<option value="${data.resultado.sector.id_sector}">${data.resultado.sector.descripcion}</option>`);
        //$(`#idsector option[value=${data.resultado.sector.id_sector}]`).prop("selected",true);
        $(`#idsector`).trigger("chosen:updated"); // actualizamos el combo de sector
        console.log(data.resultado.sector.id_sector);
        $(`#idbodega option[value=${data.resultado.sector.id_bodega}]`).prop("selected",true);
        $(`#idbodega`).trigger("chosen:updated"); // actualizamos el combo de actividades
        console.log(data.resultado.sector.id_bodega);
        $('#id_descripcion').val(data.resultado.descripcion); // cargamos la descripción del sector a editar
        $('.option_sector').prop('selected',false);   
        $(`#idsector option[value="${data.resultado.sector.id_sector}"]`).prop('selected',true); // seleccionamos la zona que pertenece el sector seleccionado
        $("#idsector").trigger("chosen:updated"); // actualizamos el combo
        }).fail(function(error){
          alert("Error al ejecutar la petición");
        });

        $('#method_seccion').val('PUT'); // decimo que sea un metodo put
        $('#id_frmseccion').prop('action',window.location.protocol+'//'+window.location.host+'/seccion/gestion/'+id_seccion); // actualizamos la ruta del formulario para actualizar
        $('#btn_seccioncancelar').removeClass('hidden'); // mostramos el boton cancelar

        $('html,body').animate({scrollTop:$('#adm').offset().top},400); // realizamos la animación de subir a la parte superior de la pagina        
    }


    $('#btn_seccioncancelar').click(function(){
        $('#idsector').html('');
        $('#id_descripcion').val(''); // limpiamos el input de descripción
        $('.option_sector').prop('selected',false); // deseleccionamos las zonas seleccionadas
        $("#idbodega").trigger("chosen:updated"); // actualizamos el combo de zonas

         $('.option_sector').prop('selected',false); // deseleccioamos todas las zonas del combo
         $("#idsector").trigger("chosen:updated"); // actualizamos el combo de zonas
       //$('#idsector').html('');
       $('#idsector').find('option').remove().end();
        $('#method_seccion').val('POST'); // decimo que sea un metodo put
        $('#id_frmseccion').prop('action',window.location.protocol+'//'+window.location.host+'/seccion/gestion'); // agregamos la ruta post (ruta por defecto)
        $(this).addClass('hidden'); // ocultamos el boton cancelar
    });


 function btn_eliminar_seccion(btn){
    if(confirm('¿Quiere eliminar el registro?')){
        $(btn).parent('.frm_eliminar').submit();
    }
 }
