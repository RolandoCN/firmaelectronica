
    // evento al darle enter sobre input identificacion
    $("#identificacion").keypress(function(e){
        if(e.which == 13) { // codigo del enter
            e.preventDefault();
            $("#buscarIdentificacion").click();        
        }
    });

    // al darle click a continuar
    $("#buscarIdentificacion").click(function(){
        var identificacion = $("#identificacion").val();
        if(identificacion==""){            
            alertNotificar("Ingrese la identificación","info");
            return;
        }else{
            buscarPorIdentificacion(identificacion);
        }
    });


    function buscarPorIdentificacion(identificacion){
        vistacargando("M","Espere...");
        $.get("/gestionContribuyente/contribuyente/"+identificacion, function(data){
            console.clear();
            console.log(data);

            if(data.error==false){
                if(data.resultado==null){
                    alertNotificar("Se produjo un error, por favor intentelo más tarde");
                    vistacargando();
                }
                if(data.dinardap){ // si la informacion viene de DINARDAP
                    $("#btn_submit").html("Guardar");

                    // obtenemos el codigo del estado civil
                    var codEstadoCivil = "";
                    var estadoCivil = data.resultado[3].valor;
                    if(estadoCivil=="SOLTERO"){codEstadoCivil="S";}
                    else if(estadoCivil=="CASADO"){codEstadoCivil="C";}
                    else if(estadoCivil=="VIUDO"){codEstadoCivil="V";}
                    else if(estadoCivil=="DIVORCIADO"){codEstadoCivil="D";}

                    // cargamos la informacion en el formulario
                    $("#nombres").val(data.resultado[9][0]);
                    $("#apellidos").val(data.resultado[9][1]);
                    $(`#estadocivil option[value=${codEstadoCivil}]`).prop("selected",true);
                    $("#fechanacimiento").val(data.resultado[7]);
                    
                    // ponenos la identificacion a ingresar
                    $("#codigo_update_cabildo").val("");
                    $("#identificacion_encrypt").val(data.identificacion_encrypt);

                    //mostramos los datos solo para persona
                    $(".datoSoloPersona").prop("required", true);
                    $("#content_datosSoloPersona").show();

                    // no actualiar la cedula
                    $("#content_cedulaUpdate").hide();
                    $("#cedulaUpdate").prop("required",false);

                }else if(data.SRI){

                    $("#btn_submit").html("Guardar");

                    // cargamos la informacion en el formulario
                    $("#nombres").val(data.resultado[1][0]);
                    $("#apellidos").val(data.resultado[1][1]);

                    // ponenos la identificacion a ingresar
                    $("#codigo_update_cabildo").val("");
                    $("#identificacion_encrypt").val(data.identificacion_encrypt);

                    //no mostramos los datos solo para persona
                    $(".datoSoloPersona").prop("required", false);
                    $("#content_datosSoloPersona").hide();

                    //damos datos por defecto a los campos ocultos
                    $("#estadocivil").val("S");
                    $("#sexoM").iCheck('check');
                    $("#fechanacimiento").val("");

                    // no actualizar la cedula
                    $("#content_cedulaUpdate").hide();
                    $("#cedulaUpdate").prop("required",false);

                }else if(data.cabildo){ // si la información viene de cabildo (ya esta registrado)

                    $("#btn_submit").html("Actualizar");

                    // cargamos la informacion en el formulario
                    $("#nombres").val(data.resultado.nombre);
                    $("#apellidos").val(data.resultado.apellido);
                    $(`#estadocivil option[value=${data.resultado.estadocivil}]`).prop("selected",true);
                    $("#telefono").val(data.resultado.telefono);
                    $(`.input_sexo[value=${data.resultado.sexo}]`).iCheck('check');
                    $("#fechanacimiento").val(data.resultado.fechanacimiento);
                    $("#direccion").val(data.resultado.direccion);
                    $("#email").val(data.resultado.email);

                    // ponenos la identificacion a ingresar
                    $("#identificacion_encrypt").val(data.identificacion_encrypt);
                    $("#codigo_update_cabildo").val(data.resultado.codigo); // codigo cabildo


                    if(data.resultado.tipoidentificacion==1){
                        //no mostramos los datos solo para persona
                        $(".datoSoloPersona").prop("required", false);
                        $("#content_datosSoloPersona").hide();
                    }else{
                        //mostramos los datos solo para persona
                        $(".datoSoloPersona").prop("required", true);
                        $("#content_datosSoloPersona").show();                     
                    }

                    $("#content_cedulaUpdate").show();
                    $("#cedulaUpdate").val(data.resultado.cedula);
                    $("#cedulaUpdate").prop("required",true);

                }

                $("#datosPersona").show(300); // mostramos el formulario de datos de la persona
                $("#content_identificacion").hide();

            }else{
                alertNotificar(data.mensaje,"error");
            }
            
            vistacargando();
        }).fail(function(){
            vistacargando();
        });    
    }

    //FUNCION PARA INGRESO O ACTUALIZACION DE UN CONTRIBUYENTE EN CABILDO
    $("#frm_guardarContrigullente").submit(function(e){
        e.preventDefault();
       
        var FrmData = new FormData(this);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        vistacargando("M", "Espere...");
        $.ajax({
			url: '/gestionContribuyente/contribuyente', 
			method: "POST", 
            data: FrmData,
            type: "json",
            contentType:false,
            cache:false,
            processData:false,             
			complete: function (request)   
			{
                var resultado = request.responseJSON;
                console.clear();
                console.log(resultado);
                if(resultado.error==false){
                    limiarFrmRegistro();
                    if($("#busquedaC").val()!=""){
                        buscarContribuyentePorNombre();
                    }
                }
                alertNotificar(resultado.mensaje, resultado.status);
                vistacargando();
			},error: function(){
                vistacargando();
            }
	    });

    });


    $("#btnCancelar").click(function(){
        limiarFrmRegistro();
    });

    // funcion al darle enter al input de busqueda
    $("#busquedaC").keypress(function(e){
        if(e.which == 13) { // codigo del enter
          e.preventDefault();
          buscarContribuyentePorNombre();
        }
    });

    $("#btn_buscarContrubuyente").click(function(){
        buscarContribuyentePorNombre();
    });

    // FUNCION PARA BUSCAR UN CONTRIBUYENTE POR CIU CEDULA O NOMBRE
    var eventos=0; // para controlar que solo se agregue un evento para editar y uno para eliminar
    function buscarContribuyentePorNombre(){
        
        var busqueda = $("#busquedaC").val();
        if(busqueda==""){
            alertNotificar("Ingrese un criterio de busqueda","default");
            return;
        }

        vistacargando("M","Buscando...");
        $("#table_buscarContribuyente").hide();
        $.get(`/gestionContribuyente/buscar/${busqueda}`, function(requestData){
            
            console.clear();
            console.log(requestData);

            if(requestData.error==false){

                if(requestData.resultado.length>0){
                    $("#table_buscarContribuyente").show();
                }else{
                    alertNotificar("No se encontró ningun registro", "default");
                }


                // cargamos los datos a la tabla

                var objTable = $('#tablaResultado').DataTable({
                    "destroy":true,
                    pageLength: 10,
                    sInfoFiltered:false,
                    language: {
                        url: '/json/datatables/spanish.json',
                    },
                    data: requestData.resultado,
                    columnDefs: [
                        {  className: "priority-1 optionColl", targets: 0 },
                        {  className: "priority-5", targets: 1 },
                        {  className: "priority-5", targets: 2 },
                        {  className: "priority-5", targets: 3 }
                    ],
                    columns:[
                        {data:"codigo"},
                        {data: "cedula"},
                        {data: "nombrecompleto"},
                        {data:"fechanacimiento"},
                        {defaultContent: "<button type='button' class='editar btn btn-primary btn-sm'><i class='fa fa-pencil-square-o'></i></button>	<button type='button' class='eliminar btn btn-danger btn-sm' data-toggle='modal' data-target='#modalEliminar' ><i class='fa fa-trash-o'></i></button>"}
                    ],
                    "rowCallback": function( row, data ) {
                        if ( data.cedula == "ELIMINADO" ) {
                          $('td', row).remove(); // quitamos la fila que tengan cedulas eliminadas
                        }
                    }                                
               });

               if(eventos==0){ // si no se a agregado evento
                    obtener_dato("#tablaResultado tbody", objTable); // cargamos los eventos de la tabla
                    eventos=1; // agregamos los eventos
               }

            }
            vistacargando();
        });
    }

    
    //EVENTOS AL DAR CLICK A LOS BOTONES DE LA TABLA

    var obtener_dato = function(tbody, table){
        $(tbody).on("click", "button.editar", function(){ //eveto al dar click en editar
            var codigo = table.row($(this).parents("tr")).data().codigo;
            $('html,body').animate({scrollTop:$('.main_container').offset().top},400);
            buscarPorIdentificacion(codigo);
        });

        $(tbody).on("click", "button.eliminar", function(){ // evento al dar click en eliminar
            var codigo = table.row($(this).parents("tr")).data().codigo;
            var nombrecompleto = table.row($(this).parents("tr")).data().nombrecompleto;
            if(confirm(`¿Está seguro que quiere eliminar a ${nombrecompleto}?`)){
                eliminarContribuyente(codigo);
            }
        });
    }



    // funcion para eliminar un contribuyente
    function eliminarContribuyente(codigo){
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        vistacargando("M", "Espere...");
        $.ajax({
			url: '/gestionContribuyente/contribuyente/'+codigo, 
			method: "DELETE",
            contentType:false,
            cache:false,
            processData:false,             
			complete: function (request)   
			{
                var requestData = request.responseJSON;
                console.log(requestData);
                alertNotificar(requestData.mensaje, requestData.status);
                buscarContribuyentePorNombre(); // recargamos la tabla
                vistacargando();
            }, error: function(){
                vistacargando();
            }
        });
    }


    function limiarFrmRegistro(){
        $("#datosPersona").hide(200);
        $("#identificacion").removeClass("soloinfo");
        $("#buscarIdentificacion").attr("disabled", false);

            // limpiamos los input del formulario
            $("#identificacion").val("");
            $("#nombres").val("");
            $("#apellidos").val("");
            $("#direccion").val("");
            $("#telefono").val("");
            $("#fechanacimiento").val("");
            $("#email").val("");
        // limpiamos los codigos encryptados
        $("#identificacion_encrypt").val("");
        $("#codigo_update_cabildo").val("");

        $("#content_cedulaUpdate").hide();
        $("#cedulaUpdate").prop("required",false);

        $("#content_identificacion").show();
        $('html,body').animate({scrollTop:$('.main_container').offset().top},400);
    }