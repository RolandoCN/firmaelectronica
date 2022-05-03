



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
        // $('#local').removeAttr('disabled');
        // $('#local').addClass('flat check_inspecciones');
        checkear_actividades();  
    });

      $('#local').on('ifChecked', function(event){
        
            //var local="Si";
            checkear_actividades();  


        });
         $('#local').on('ifUnchecked', function(event){
        
            //var local="No";
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


     function actualizar_actividad(idactividades_sri, check, local){
        //
        var idactividad = $("#SelectCertificado").val();
        //var local=$('#local').val();

        if( $('#local').prop('checked') )
        {
            //alert("si");
        
            local="Si";
        }
        else
        {
           // alert("no");
            local='No';
        }
        if(idactividad==""){
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
            url: "/gestionActividadesGadSri/actividades/"+idactividades_sri,
            method: "PUT",
            data: { idactividad: idactividad,
                    local,local},
            dataType: "json"
        });
        

        request.complete(function(request){
            vistacargando();
        });


    }


    



    function checkear_actividades(){
        var idactividad = $("#SelectCertificado").val();
           
        if(idactividad==""){
            return;
        }
      
        var local="No";
        if($('#local').prop('checked') )
        {
            local="Si";
        }

        vistacargando("M","Espere...");
        $.get(`/gestionActividadesGadSri/actividades/${idactividad}/${local}/filtrarporlocal`, function(request){
            console.log(request);
            $("#div_content_actividades").removeClass("disabled_content");
            noActualizar = true;
            $("#tb_listaActividades").find('input').iCheck('uncheck');
            $.each(request.resulado, function(i, item){
                $("#tb_listaActividades").find('#check_id_'+item.idactividades_sri).iCheck('check');
            });
            noActualizar = false;
            vistacargando();            
        });



        }

        


