
$(document).ready(function () {
    cargar_notificaciones();
});


function cargar_notificaciones(){
    $.get('/controlProyecto/cargarNotificacionesProyecto', function(retorno){

        // $("#numero_notific").html("");
        // $("#ul_notificaciones").html("");

        if(retorno.error==false){

            var numero_notific = retorno.act_estado_solicitud.length;
            numero_notific = numero_notific+retorno.act_solicitudes_reprog.length;
            numero_notific = numero_notific+retorno.act_por_vencer.length;

            if(numero_notific>0){
                $("#numero_notific").html(`<span class="badge bg-red">${numero_notific}</span>`);
            }

            //Notificaciones para cargar actividades por vencer
            $.each(retorno.act_por_vencer, function(i, actividad){

                // var fecha1 = actividad.fechaFin.split("-");
                // var fecha2 = retorno.fecha_actual.split("-");
                var fecha1 = actividad.fechaFin;
                var fecha2 = retorno.fecha_actual;
            
                //Cambiamos el orden al formato americano, de esto dd/mm/yyyy a esto mm/dd/yyyy
                // fecha1 = fecha1[1]+"-"+fecha1[0]+"-"+fecha1[2];
                // fecha2 = fecha2[1]+"-"+fecha2[0]+"-"+fecha2[2];

                var act_color = "color: #ef910e;";
                var act_estado = "ACTIVIDAD POR VENCER";
                var mensaje_vence = "La actividad vence el "+fecha1;
                console.log(fecha1+" - "+fecha2);
                if(Date.parse(fecha1) < Date.parse(fecha2)){
                    act_color = "color: #e74c3c;";
                    act_estado = "ACTIVIDAD VENCIDA";
                    var mensaje_vence = "La actividad venció el "+fecha1;
                }

                $("#ul_notificaciones").append(`
                    <li style="padding:10px 2px;">
                        <a>
                            <span class="image" style="${act_color}"><i class="fa fa-exclamation-triangle"></i></span>
                            <span style="${act_color}">
                                <span><b>${act_estado}</b></span>
                                <br><span class="time" style="position: inherit;">${mensaje_vence}</span>                             
                            </span>                            
                            <hr style="margin: 4px 0px; border-top: 1px solid #d8d8d8;">
                            <span class="message"><b>ACTIVIDAD: </b> ${actividad.descripcion} </span>
                            <span class="message"><b>PROYECTO: </b> ${actividad.proyecto.descripcion} </span>                            
                        </a>
                    </li>
                `);
            });

            $.each(retorno.act_estado_solicitud, function(index, actividad){

                var sol_act_color = "color: #e74c3c;";
                var sol_act_estado = "SOLICITUD DENEGADA";
                if(actividad.reprogramar=="A"){
                    sol_act_color = "color: #2fad19;";
                    sol_act_estado = "SOLICITUD APROBADA";
                }

                $("#ul_notificaciones").append(`
                    <li style="padding:10px 2px;">
                        <a>
                            <span class="image"><i class="fa fa-exclamation-triangle"></i></span>
                            <span>
                                <span><b>REPROGRAMACIÓN DE ACTIVIDAD</b></span>
                                <br><span class="time" style="position: inherit; ${sol_act_color}">${sol_act_estado}</span>
                            </span>                            
                            <hr style="margin: 4px 0px; border-top: 1px solid #d8d8d8;">
                            <span class="message"><b>ACTIVIDAD: </b> ${actividad.descripcion} </span>
                            <span class="message"><b>PROYECTO: </b> ${actividad.proyecto.descripcion} </span>
                        </a>
                    </li>     
                `);
            });


            if(retorno.act_solicitudes_reprog.length>0){

                num_solicitudes = retorno.act_solicitudes_reprog.length;
                if(num_solicitudes==1){
                    mensaje_solicitudes = `Tiene ${num_solicitudes} solicitud en bandeja`;
                }else{
                    mensaje_solicitudes = `Tiene ${num_solicitudes} solicitudes en bandeja`;
                }
                

                $("#ul_notificaciones").append(`
                    <li style="padding:10px 2px;">
                        <a href="/controlProyecto/bandejaSolicitudes">
                            <span class="image"><i class="fa fa-exclamation-triangle"></i></span>
                            <span>
                                <span><b>SOLICITUDES PARA REPROGRAMAR ACTIVIDAD</b></span>
                                <br><span class="time" style="position: inherit; color: #2fad19;">${mensaje_solicitudes}</span>
                            </span>                            
                            <hr style="margin: 4px 0px; border-top: 1px solid #d8d8d8;">
                        </a>
                    </li>     
                `);
            }

        }

    })
}