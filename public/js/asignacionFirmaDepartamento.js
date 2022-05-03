

    $(document).ready(function () {
        $(`#table_firmas_depa`).DataTable({
            pageLength: 10,
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
                "infoFiltered": " - filtrado de MAX registros",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente"
                }
            }
        });
    });
   
   
   $(document).ready(function(e){

        $(document).ready(function() {
            $('#signArea').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:90});
            $('#signArea_edit').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:90});
        });            

    });

    // funcion para limpiar una firma dibujada
    function limpiarSingArea(){
        $('#signArea').signaturePad().clearCanvas();
    }


    // functión para actualizar la firma de un departamento
    $("#frm_asignarFirma").submit(function(e){
        e.preventDefault();
        vistacargando("M", "Espere...");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var FrmData = new FormData(this);

        var iddepartamento = $("#cmb_departamento").val();

        html2canvas([document.getElementById('sign-pad')], {
            onrendered: function (canvas) {
                var canvas_img_data = canvas.toDataURL('image/png');
                var img_data = canvas_img_data.replace(/^data:image\/(png|jpg);base64,/, "");

                FrmData.append("b64_firma",img_data);
                FrmData.append("iddepartamento",iddepartamento);

                //ajax call to save image inside folder
                $.ajax({
                    url: '/departamento/guardarFirma',
                    method: 'POST',
                    data: FrmData,
                    dataType: 'json',
                    contentType:false,
                    cache:false,
                    processData:false,
                    complete: function(request){                    
                        requestData = request.responseJSON; // obtenemos el json que se retorna
                        console.clear();
                        console.log(requestData);
                        // control de request
                        alertNotificar(requestData.mensaje, requestData.status);
                        vistacargando();
                        if(!requestData.error){
                            actualizarFirmaTabla(requestData.departamento); // actualizamos la imagen de la firma editada
                            limpiarSingArea();
                            $("#preview_firma").hide();
                        }
                    }
                }).fail(function(){            
                    alertNotificar("Error el enviar la información", "error");
                    vistacargando();
                });
            }
        }); 


    });

    $("#cmb_departamento").change(function(){
        editarFirmaDepa($(this).val());
    });

    function editarFirmaDepa(iddepartamento){

        //reiniciamos la opcion para ingresar la imagen de la firma del documento
            $('#check_imagen_firma').iCheck('uncheck');
            if($("#signArea").find('.error').length>0){
                $("#signArea").find('.error').remove();
            }
            $(".seleccionar_archivo").parent().siblings('input').val($(".seleccionar_archivo").parent().prop('title'));
        //-----------------------------------------------------------------------------------------------------------------

        vistacargando("M","Espere...");
        $.get("/departamento/gestion/"+iddepartamento+"/edit", function(request){
            var departamento = request.resultado;

            // seleccionamos el departamento en el combo
            $(".cmb_departamento").prop("selected",false);
            $("#depa_"+departamento.iddepartamento).prop("selected",true);
            $("#cmb_departamento").trigger("chosen:updated");
            // cargamos la imagen de la firma en caso de que tenga
            if(departamento.firma!=null && departamento.firma!=""){
                $("#img_preview_firma").prop("src","data:image/png;base64,"+departamento.firma);
                $("#preview_firma").show();
            }else{
                $("#preview_firma").hide();                
            }

            vistacargando();
            $('html,body').animate({scrollTop:$('.main_container').offset().top},400);
            limpiarSingArea();
        });
    }


    function actualizarFirmaTabla(departamento){
        
        //reiniciamos la opcion para ingresar la imagen de la firma del documento
            $('#check_imagen_firma').iCheck('uncheck');
            if($("#signArea").find('.error').length>0){
                $("#signArea").find('.error').remove();
            }
            $(".seleccionar_archivo").parent().siblings('input').val($(".seleccionar_archivo").parent().prop('title'));
        //-----------------------------------------------------------------------------------------------------------------

        $("#content_firma_"+departamento.iddepartamento).html(`
            <img src="data:image/png;base64,${departamento.firma}" class="img_firma">
        `);
    }

    //funciones para seleccionar una imagen de la firma
        $('#check_imagen_firma').on('ifChecked', function(event){
            $("#content_firma").hide(200);
            $("#content_subir_foto").show(200);
        });

        $('#check_imagen_firma').on('ifUnchecked', function(event){
            $("#content_subir_foto").hide(200);
            $("#content_firma").show(200);
        });


        
    // funciones para seleccionar un archivo

        $(".seleccionar_archivo").click(function(e){
            $(this).parent().siblings('input').val($(this).parent().prop('title'));
            this.value = null; // limpiamos el archivo
        });

        $(".seleccionar_archivo").change(function(e){

            if(this.files.length>0){ // si se selecciona un archivo
                archivo=(this.files[0].name);
                $(this).parent().siblings('input').val(archivo);
            }else{
                return;
            }

        });
