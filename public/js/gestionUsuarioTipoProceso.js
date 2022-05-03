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
        var idtabla = "table_usuario_tipoProceso";
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


    function editar_asignacion(idusuario){
        vistacargando("M", "Espere...");

        $.get(`/usuarioTipoProceso/gestion/${idusuario}/edit`, function(retorno){
            vistacargando();

            //Cambiamos los botones para editar
            $("#btn_cancelar_edicion").show(200);
            $("#btn_asignar").find('span').html("Actualizar");

            $("#metodo_post").val('UPD'); // para decir aga una actualización
            
            //limpiamos todos los combos
            $("#cmb_usuarios").find('option').prop('selected', false);
            $("#cmb_tipoTramite").find('option').prop('selected', false);
            
            $.each(retorno.usuario_tipo_proceso, function(index, us_tp){

                $("#cmb_usuarios").find(`.user_${us_tp.idus001}`).prop('selected', true);
                $("#cmb_usuarios").trigger("chosen:updated");

                $("#cmb_tipoTramite").find(`.tipoproc_${us_tp.idtipoProceso}`).prop('selected', true);
                $("#cmb_tipoTramite").trigger("chosen:updated");

            });
            

        }).fail(function(){
            vistacargando();
        });
    }


    $("#btn_cancelar_edicion").click(function(){
        //limpiamos los combos
            $("#cmb_usuarios").find('option').prop('selected', false);
            $("#cmb_usuarios").trigger("chosen:updated");
            $("#cmb_tipoTramite").find('option').prop('selected', false);
            $("#cmb_tipoTramite").trigger("chosen:updated");
        
        //reiniciamos los botones
            $("#metodo_post").val('INST'); // para decir que aga una inserción
            $(this).hide(200);
            $("#btn_asignar").find('span').html("Guardar");
    });



    // función que se desencade al cambiar un combo de los tipo de trámite 
    function seleccionarCombo(cmb){
        var option_sel= $(cmb).find('option:selected');
        var valor_sel=$(option_sel).attr('data-id'); console.log(valor_sel);
        if(valor_sel==0){
            $(option_sel).prop('selected', false);
            $(cmb).find('.option').prop('selected', true);
            $(cmb).trigger("chosen:updated");
        }
    }