
    function cambiarTipoFp(boton, cambiar){
        if(cambiar == false){ return; }
        swal({
            title: "",
            text: "Si cambia de rol perderá los cambios actuales ¿Está seguro que desea cambiarlo?",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Si, cambiar!",
            cancelButtonText: "No, cancela!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            
            if (isConfirm) { // si dice que quiere eliminar
               $(boton).siblings('.form_cambiar_rol').submit();
            }

            sweetAlert.close();   // ocultamos la ventana de pregunta
        }); 
    }