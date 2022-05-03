

// FUNCION PARA SELECCIONAR UN ARCHVO --------------

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



    function cambiar_archivo_certificado(){
        $(".content_info_certificado").hide(200);
        $(".content_info_clave").hide(200);
        $("#frm_actualizar_calve").hide();
        $("#frm_actualizar_ceritificado").show(200);
    }

    function cambiar_clave_certificado(){
        $(".content_info_certificado").hide(200);
        $(".content_info_clave").hide(200);
        $("#frm_actualizar_ceritificado").hide();
        $("#frm_actualizar_calve").show(200);
    }

    function cancelar_edicion(){
        $(".content_info_certificado").show(200);
        $(".content_info_clave").show(200);
        $("#frm_actualizar_ceritificado").hide(200);
        $("#frm_actualizar_calve").hide(200);
    }



    function eliminar_archivo_certificado_clave(ruta){

        swal({
            title: "",
            text: "¿Está seguro que desea eliminar?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, Eliminar!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) { // si dice que quiere eliminar
                window.location.href = ruta;
            }
            sweetAlert.close();   // ocultamos la ventana de pregunta
        });
        
    }


    