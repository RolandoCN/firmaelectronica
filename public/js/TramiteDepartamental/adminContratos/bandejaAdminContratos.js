
    $(document).ready(function () {
        cargar_estilos_tabla();
    });


    function cargar_estilos_tabla(){

        $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});
        
        $("#tabla_contratos").DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            pageLength: 10,
            "language": {
                "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                            '<option value="5">5</option>'+
                            '<option value="10">10</option>'+
                            '<option value="15">15</option>'+
                            '<option value="20">20</option>'+
                            '<option value="30">30</option>'+
                            '<option value="-1">Todos</option>'+
                            '</select> registros',
                "search": "<b><i class='fa fa-search'></i> Buscar: </b>",
                "searchPlaceholder": "Ejm: GADM-000-2020-N",
                "zeroRecords": "No se encontraron registros coincidentes",
                "infoEmpty": "No hay registros para mostrar",
                "infoFiltered": " - filtrado de MAX registros",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente"
                }
            }
        });

    }


    function verTramite(iddetalle_tramite, idtramite){

        //definimos la pestaña general como principal
        $("#a_datos_generales").click();
        //eliminamos pestaña de documento principal
        $("#tab_informacion_documento").remove();
        $("#informacion_documento").html("");
        //eliminamos pestaña de asociar documentos
        $("#tab_asociar_tramite").remove();
        $("#asociar").html("");

        $("#listaTramites_contrato").hide(200);
        $("#contet_ver_tramite").show(200);
        mostrarDetalleTramite(iddetalle_tramite); // reutilizada de otro jquery

        //cargamos la informacion del boton
        $("#btn_informe_administrador").attr('href',`/adminContratos/informeContrato?idtramite=`+idtramite);
    }

    function cerrarDetalleTramite(){
        $("#listaTramites_contrato").show(200);
        $("#contet_ver_tramite").hide(200);
        $("#btn_informe_administrador").attr('href','');
    }


    //funcion para filtrar los contratos 
    $("#frm_buscar_contratos").submit(function(e){

        e.preventDefault();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var formulario = this;
        var FrmData = new FormData(formulario);
        var urlFrm = $(formulario).attr('action');
        var btn_submit = $(formulario).find('[type=submit]');
        var txt_submit = $(btn_submit).html();
        $(formulario).addClass('disabled_content');
        $(btn_submit).html(`<span class="spinner-border " role="status" aria-hidden="true"></span> Espere..`);
        
        $.ajax({
            url: urlFrm,
            method: "POST",
            data: FrmData,
            dataType: 'json',
            contentType:false,
            cache:false,
            processData:false,
            success: function(retorno){
                // si es completado                    
                $(formulario).removeClass('disabled_content');
                $(btn_submit).html(txt_submit);
                
                console.log(retorno)

                if(retorno.error){ //en caso de error
                    alertNotificar(retorno.mensaje, retorno.status);                    
                }else{
                    cargarTablaContratos(retorno.listaTramiteContrato);
                }
            },
            error: function(error){                    
                $(formulario).removeClass('disabled_content');
                $(btn_submit).html(txt_submit);
                alertNotificar("No se pudo obtener la información por favor intente más tarde.");                        
            }

        }); 

    });


    function cargarTablaContratos(listaTramiteContrato){
        
        $("#tabla_contratos").DataTable().destroy();
        $('#tabla_contratos tbody').empty();

        $.each(listaTramiteContrato, function(key, tramite){

            var fecha_in = tramite.fechaCreacion.split("-");
            var anio = fecha_in[0];
            var mes = fecha_in[1];
            var dia = fecha_in[2];
            dia = dia.split(" ")[0];          

            $('#tabla_contratos tbody').append(`
                <tr>
                    <td>${(key+1)}</td>
                    <td>${tramite.codTramite}</td>
                    <td>${anio}-${mes}-${dia}</td>
                    <td>${tramite.asunto}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="verTramite('${tramite.detalle_tramite[0].iddetalle_tramite_encrypt}', '${tramite.idtramite_encrypt}')" style="margin-bottom: 0;"><i class="fa fa-eye"></i> Ver Detalle</button>
                    </td>
                </tr>
            `);

        });

        cargar_estilos_tabla();

    }
