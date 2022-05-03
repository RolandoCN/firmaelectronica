
  $("#input_buscar").keyup(function(e){
        if(e.keyCode==13){ //solo si se da enter
            buscarParaOCopia();
        };       
    });

var time = null;

$("#input_buscar").keyup(function(e){
    clearTimeout(time);
    time = setTimeout(function(){
        buscarParaOCopia();
    }, 400);
});

function buscarParaOCopia(){
       
    var busqueda = $("#input_buscar").val();
    //validamos que la busqueda no este vacia
    if(busqueda==""){return;}

    addSpinner("Buscando...", "#label_buscar"); // ponemos el mensaje de cargando

    $.get('/adminContratos/buscarAdministradores/'+busqueda,function (resultado){
     
        // limpiamos el mensaje de buscando
        removeSpinner("Buscar:", "#label_buscar");
        if(resultado.error){
            // vistacargando(); // ocultamos la ventana de espera
            alertNotificar("Resultados no encontrados","default");
            $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
        }else{
            // si la consulta retorna con resultado nulo limpiamos la tabla
            if(resultado.resultado.length == 0 ){
                // alertNotificar("Resultados no encontrados","default");
                $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
                $('#resultado_busqueda').hide();
                alertNotificar('No se encuentran registros','info');
                return;
            }
            $('#resultado_busqueda').show();
            var tb_thead = "";
            var tb_tbody = "";
            //---------------- LLENAR TABLA DE RESULTADO DE BUSQUEDA ---------------------------
                    // agregamos la cabecera a la tabla
                    tb_thead=(`
                        <th>Cédula</th>
                        <th>Funcionario Público</th>
                        <th style="width: 195px;">Cod. trámite</th>
                        <th>Detalle</th>
                        <th style="width: 145px;">Acción</th>
                    `);

                    $("#tbody_resultado_busqueda").html(""); // limpiamos la tabla de resultados de busqueda
                
                    $.each(resultado.resultado, function (i,index){  // rellenamos la tabla con los datos de los departamentos resultado
                            tb_tbody=tb_tbody+(`  
                                <tr>
                                    <td scope="row">${index['us001']['cedula']}</td>
                                    <td scope="row">${index['us001']['name']}</td>
                                    <td>${index['tramite']['codTramite']}</td>
                                    <td>${index['tramite']['asunto']}</td>
                                    <td>
                                        <center>
                                            <a  onclick="generar_atencion('${index['tramite']['idtramite_encrypt']}')"  class="btn btn-info btn-xs" type="button" ><i class="fa fa-check"></i> Aceptar</a>
                                        </center>
                                    </td>
                                </tr>
                            `);
                    });
            // cargamos con jquery la tabla completa para que se carguen los estilos
            $("#div_tabla_resutado_busqueda").html(`
                <table class="table table-bordered table-td-sm table-td-center-vertical">
                    <thead id="thead_resultado_busqueda">
                        ${tb_thead}
                    </thead>
                    <tbody id="tbody_resultado_busqueda">
                    ${tb_tbody}
                    </tbody>
                </table>
            `);

        }
    }).fail(function(){
        alertNotificar("Error al ejecutar la petición","error");
        $("#div_tabla_resutado_busqueda").html(`<div class="contentDePara"><br><br><br></div>`);
        removeSpinner("Buscar:", "#label_buscar"); // limpiamos el mensaje de buscando
    });
}

function generar_atencion(id_tramite){
    swal({
        title: '',
        text: '¿Desea generar un proceso al administrador de contrato?',
        type: "info",
        showCancelButton: true,
        confirmButtonClass: "btn-sm btn-info",
        cancelButtonClass: "btn-sm btn-danger",
        confirmButtonText: "Si, Aceptar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {
        if (isConfirm) { // si dice que si
            vistacargando('m','Por favor espere..');
            window.location.href = `/detalleTramite/generarAtencion/${id_tramite}`;
        }
        sweetAlert.close();   // ocultamos la ventana de pregunta
    });
}