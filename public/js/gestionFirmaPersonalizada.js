


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