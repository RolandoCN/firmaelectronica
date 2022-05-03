



 $("#datatable").DataTable( {
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
});



function btn_eliminar_actividad_condicionada(btn){
        if(confirm('¿Quiere eliminar el registro?')){
            $(btn).parent('.frm_eliminar').submit();
        }
    }
    //-----------------------------------------------


    // VARIABLE GLOBAL PARA ALMACENAR

    var noActualizar = false;

    $("#SelectCertificado").change(function(e){
        checkear_actividades();  
    });


    
    // FUNCION PARA CARGAR ESTILOS DE CHECK CUANDO SE CAMBIA LA PAGINACION
    $('#datatable').on( 'draw.dt', function () {
        setTimeout(function() {
            $('#tb_listaActividades').find('input').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green' // If you are not using radio don't need this one.
            });
            checkear_actividades();
        }, 200);
    });



    $("#tb_listaActividades").delegate("input", "ifChecked", function(e){
        actualizar_actividad($(this).val(),this);
    });

    $("#tb_listaActividades").delegate("input", "ifUnchecked", function(e){
        actualizar_actividad($(this).val(),this);
    });


    function actualizar_actividad(idactividad, check){
        //
        var idcertificado = $("#SelectCertificado").val();
        if(idcertificado==""){
            return;
        }

        if(noActualizar){
            return;
        }

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });


        vistacargando("M","Actualizando...");

        var request = $.ajax({
            url: "/gestionSuelo/actividadesCondicionadas/"+idactividad,
            method: "PUT",
            data: { idcertificado: idcertificado},
            dataType: "json"
        });
        

        request.complete(function(request){
            vistacargando();
        });


    }



    function checkear_actividades(){
        var idcertificado = $("#SelectCertificado").val();
    
        if(idcertificado==""){
            return;
        }
        vistacargando("M","Espere...");
        $.get("/gestionSuelo/actividadesCondicionadas/"+idcertificado, function(request){
            $("#div_content_actividades").removeClass("disabled_content");
            noActualizar = true;
            $("#tb_listaActividades").find('input').iCheck('uncheck');
            $.each(request.resulado, function(i, item){
                $("#tb_listaActividades").find('#check_id_'+item.idactividades).iCheck('check');
            });
            noActualizar = false;
            vistacargando();            
        });
    }




