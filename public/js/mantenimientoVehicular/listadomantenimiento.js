  
   function verdetalle(id){
       vistacargando('M','Espere...'); 
       $("#btn_descargar_todos_documentos_mv").attr("href", "/listadoMantenimiento/descargarTodos/"+id);
       $.get("/listadoMantenimiento/datos/"+id, function (data) {
            vistacargando();
            $('#datos').hide(300);
            $('#detalle').show(300);
            if(data.resultado.ruta_informe_solic!=""){ 
                var estado="";
                if(data.resultado.firma_chofer==1){ 
                    estado=(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`
                        );
                }else{
                     estado=(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`
                        );  
                }    
                $('#listaDoc').append(
                `<tr>
                    <td>Solicitud de Mantenimiento</td>
                    <td>${data.resultado.chofer.usuario.name}</td>
                    <td>${data.resultado.fecha_solicitud_mantenimento}</td>
                    <td>${estado}</td>
                    <td>
                    <center>
                            <button type="button" onclick="vermemo2('${data.resultado.idmv_mantenimiento}','${data.resultado.ruta_informe_solic}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-eye"></i> Visualizar</button>
                    </center>
                    </td>                 
                 </tr>`);
            }
            if(data.resultado.ruta_informe_revision!=null){ 
                var estadoR="";
                if(data.resultado.firma_mecanico==1){ 
                    estadoR=(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`
                        ); 

                }else{
                     estadoR=(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`
                        );
                } 
                 $('#listaDoc').append(
                 `<tr>
                      <td>Revisión Mecánico</td>
                      <td>${data.resultado.mecanico.usuario.name}</td>
                      <td>${data.resultado.fecha_revision_solicitud}</td>
                      <td>${estadoR}</td>
                      <td>
                        <center>
                             <button type="button" onclick="verRevision('${data.resultado.idmv_mantenimiento}','${data.resultado.ruta_informe_revision}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-eye"></i> Visualizar</button>
                        </center>
                      </td>
                   
                 
                 </tr>`);
            }    
            if(data.resultado.ruta_informe_orden!=null){ 
                var estadoOr="";
                if(data.resultado.aprobacion_final_orden==1){ 
                    estadoOr=(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`
                        ); 
                }else{
                     estadoOr=(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`
                        );   
                } 
                 $('#listaDoc').append(
                 `<tr>
                      <td>Orden de Repuesto</td>
                      <td>${data.resultado.usuarioorden.name}</td>
                      <td>${data.resultado.fecha_orden_insumo}</td>
                      <td>${estadoOr}</td>
                      <td>
                        <center>
                             <button type="button" onclick="verorden('${data.resultado.idmv_mantenimiento}','${data.resultado.ruta_informe_orden}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-eye"></i> Visualizar</button>
                        </center>
                      </td>
                   
                 
                 </tr>`);
            }    
            // if(data.resultado.ruta_informe_entrega!=null){ 
            //     var estadoEn="";
            //     if(data.resultado.aprobacion_final_entrega==1){ 
            //         estadoEn=(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`
            //             ); 
            //     }else{
            //          estadoEn=(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`
            //             );     
            //     } 
            //      $('#listaDoc').append(
            //      `<tr>
            //           <td>Entrega de Repuesto</td>
            //           <td>${data.resultado.usuarioentrega.name}</td>
            //           <td>${data.resultado.fecha_entrega_insumo}</td>
            //           <td>${estadoEn}</td>
            //           <td>
            //             <center>
            //                  <button type="button" onclick="verEntrega('${data.resultado.idmv_mantenimiento}','${data.resultado.ruta_informe_entrega}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-eye"> Visualizar</i></button>
            //             </center>
            //           </td>
                   
                 
            //      </tr>`);
            // } 

            if(data.resultado.egreso_cabildo!=null){ 
                var estadoEn="";
                if(data.resultado.egreso_cabildo[0].firmaretira==1){ 
                    estadoEn=(`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>`
                        ); 
                }else{
                     estadoEn=(`<span style="min-width: 90px !important;font-size: 12px" class="label label-primary estado_validado"><i class="fa fa-bell"></i>&nbsp; Pendiente &nbsp;&nbsp;</span>`
                        );     
                } 
                 $('#listaDoc').append(
                 `<tr>
                      <td>Egreso de Repuesto</td>
                      <td>${data.resultado.egreso_cabildo[0].empleado_respons_cabildo}</td>
                      <td>${data.resultado.egreso_cabildo[0].fecha}</td>
                      <td>${estadoEn}</td>
                      <td>
                        <center>
                             <button type="button" onclick="verEntrega('${data.resultado.egreso_cabildo[0].idmv_egresocabildo}','${data.resultado.egreso_cabildo[0].ruta}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-eye"></i> Visualizar</button>
                        </center>
                      </td>
                   
                 
                 </tr>`);
            } 
            // var e=data.resultado.mantegreso;
            // var cont=e.length;
            // if(cont>=1){ 
            //     var set=[''];
            //     var hr='';
            //     $.each(data.resultado.mantegreso, function(index, info){
            //         if(index>=0){hr=`<li style="padding-bottom:10px">`;}
            //         set[index]= ` ${hr} ${info.usuarioregistra.name}`;
                        
            //     })

            //     var set2=[''];
            //     var hr2='';
            //     $.each(data.resultado.mantegreso, function(index2, info2){
            //         console.log(info2);
            //         if(index2>=0){hr2=`<li style="padding-bottom:10px">`;}
            //         set2[index2]= ` ${hr2} ${info2.fecha}`;
                   
            //     })

            //     var set3=[''];
            //     var hr3='';
            //     $.each(data.resultado.mantegreso, function(index3, info3){
            //         console.log(info3);
            //         if(index3>=0){hr3=` <center>
            //                  <button type="button" onclick="verdocumento_egre('${info3.idegreso}','${info3.egreso.ruta}')" class="btn btn-sm btn-danger marginB0"><i class="fa fa-eye"> Visualizar</i></button>
            //             </center>`;}
            //         set3[index3]= ` ${hr3}`;
                   
            //     })

            //     var set4=[''];
            //     var hr4='';
            //     $.each(data.resultado.mantegreso, function(index4, info4){
            //         //console.log(info3);
            //         if(index4>=0){hr4=`<span style="min-width: 90p !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span> `;}
            //         set4[index4]= ` ${hr4}`;
                   
            //     })

            //     var nombre=data.resultado.usuarioentrega.name;
            //     var tipo="Egreso Repuesto";
                
            //      $('#listaDoc').append(
            //      '<tr>'+
            //           '<td>'+tipo+'</center>'+ '</td>'+
            //             '<td>'+set+'</td>'+
            //            '<td>'+set2+'</td>'+
            //            '<td>'+set4+'</td>'+
            //            '<td>'+'<center>'+set3+'</center>'+ '</center>'+ '</td>'+

                      
                 
            //      '</tr>');
            // }   



            //codigo para cargar el organigrama
     var dataOrganigrama = [];
            setTimeout(() => { // esperamos a que la libreria cargue
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Manager');
                data.addColumn('string', 'ToolTip');
                data.addRows(dataOrganigrama);

                // Create the chart.
                var chart = new google.visualization.OrgChart(document.getElementById('flujo_proceso'));
                // Dibuje el grÃ¡fico, estableciendo la opciÃ³n allowHtml en true para la informaciÃ³n sobre herramientas
                chart.draw(data, {'allowHtml':true});
                 $('[data-toggle="tooltip"]').tooltip();
                   // ajutarContenidoOrganigrama("#flujo_proceso_interno");
                }, 200); 
            
            $.each(data.resultado, function(index5, info5){

            var color1="";

            if(data.resultado.ruta_informe_solic!=null){
            var btn_ver_documento = "";
            btn_ver_documento = (`
                    <button type="button" onclick="vermemo2('${data.resultado.idmv_mantenimiento}','${data.resultado.ruta_informe_solic}')" class="btn btn-xs btn-info" style="padding: 2px 8px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Documentos ">
                                <i class="fa fa-file-pdf-o"></i>
                    </button>
            `);
            btn_ver_obser = (`
                    <button type="button" onclick="verSolObs('${data.resultado.idmv_mantenimiento}')"" class="btn btn-xs btn-danger" style="padding: 2px 8px;margin-left:5px" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observacion ">
                                <i class="fa fa-eye"></i>
                    </button>
             `);
            if(data.resultado.firma_chofer==1){
                var estado="Aprobado";
                color1="background: #139556";
            }else{
                var estado="Pendiente";
                color1="background: #eaa330";
            }
            
            var fecha=data.resultado.fecha_solicitud_mantenimento;
            var titulo="<b>Solicitud</b>";    
            var contenido = (`
                        <div class="content_nodo flujo_sm">
                            <div class="content_title_detalle" style="${color1}"><center>${titulo}</center></div>
                            <div class="content_info_detalle">                
                                <p class="info_detalle asunto_sm" style="text-align: left;">
                                    <b><i class="fa fa-calendar"></i> ${fecha}</b>
                                    <br>
                                    <i class="fa fa-question-circle info_input" style="color: #607f9a; font-size: 16px; float:left; margin-right: 5px;" data-toggle="tooltip" data-placement="right" title="" data-original-title='Mantenimiento ${data.resultado.tipo}'></i>
                                    Mantenimiento ${data.resultado.tipo}
                                    <br>
                                    <b>Estado: </b> ${estado} 
                                </p>                                                   
                                ${btn_ver_documento} ${btn_ver_obser}
                            </div>
                        </div> 


                     `);
            }
            if(data.resultado.ruta_informe_revision!=null){
            var btn_ver_documento = "";
            btn_ver_documento = (`
                    <button type="button" onclick="verRevision('${data.resultado.idmv_mantenimiento}','${data.resultado.ruta_informe_revision}')" class="btn btn-xs btn-info" style="padding: 2px 8px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Documentos ">
                                <i class="fa fa-file-pdf-o"></i>
                    </button>
            `);
            btn_ver_obser = (`
                    <button type="button" onclick="verRevObs('${data.resultado.idmv_mantenimiento}')"" class="btn btn-xs btn-danger" style="padding: 2px 8px;margin-left:5px" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observacion ">
                                <i class="fa fa-eye"></i>
                    </button>
             `);
             var color2="";
             if(data.resultado.firma_mecanico==1){
                var estado="Aprobado";
                color2="background: #139556";
            }else{
                var estado="Pendiente";
                color2="background: #eaa330";
            }
            var fecha=data.resultado.fecha_revision_solicitud;
            var titulo="<b>Revisión Mecánico</b>";
            var contenido2 = (`
                        <div class="content_nodo flujo_sm">
                            <div class="content_title_detalle" style="${color2}"><center>${titulo}</center></div>
                            <div class="content_info_detalle">                
                                <p class="info_detalle asunto_sm" style="text-align: left;">
                                    <b><i class="fa fa-calendar"></i> ${fecha}</b>
                                    <br>
                                    <i class="fa fa-question-circle info_input" style="color: #607f9a; font-size: 16px; float:left; margin-right: 5px;" data-toggle="tooltip" data-placement="right" title="" data-original-title='${data.resultado.observacion_mecanico}'></i>
                                     ${data.resultado.observacion_mecanico}
                                    <br>
                                    <b>Estado: </b> ${estado} 
                                </p>                                                   
                                ${btn_ver_documento}${btn_ver_obser}
                            </div>
                        </div> 


                     `);
            }
            if(data.resultado.ruta_informe_orden!=null){
            var btn_ver_documento = "";
            var color3="";
            btn_ver_documento = (`
                    <button type="button" onclick="verorden('${data.resultado.idmv_mantenimiento}','${data.resultado.ruta_informe_orden}')" class="btn btn-xs btn-info" style="padding: 2px 8px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Documentos ">
                                <i class="fa fa-file-pdf-o"></i>
                    </button>
             `);
            btn_ver_obser = (`
                    <button type="button" onclick="verOrdenObs('${data.resultado.idmv_mantenimiento}')"" class="btn btn-xs btn-danger" style="padding: 2px 8px;margin-left:5px" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observacion ">
                                <i class="fa fa-eye"></i>
                    </button>
             `);
            if(data.resultado.aprobacion_final_orden==1){
                var estado="Aprobado";
                color3="background: #139556";
            }else{
                var estado="Pendiente";
                color3="background: #eaa330";
            }
            var fecha=data.resultado.fecha_orden_insumo;
            var titulo="Orden Repuesto";
            var contenido3 = (`
                        <div class="content_nodo flujo_sm">
                            <div class="content_title_detalle" style="${color3}"><center>${titulo}</center></div>
                            <div class="content_info_detalle">                
                                <p class="info_detalle asunto_sm" style="text-align: left;">
                                    <b><i class="fa fa-calendar"></i> ${fecha}</b>
                                    <br>
                                    <i class="fa fa-question-circle info_input" style="color: #607f9a; font-size: 16px; float:left; margin-right: 5px;" data-toggle="tooltip" data-placement="right" title="" data-original-title='Orden Registrada'></i>
                                    Orden Registrada
                                    <br>
                                    <b>Estado: </b> ${estado} 
                                </p>                                                   
                                ${btn_ver_documento} ${btn_ver_obser}
                            </div>
                        </div> 


                     `);
            }

            if(data.resultado.egreso_cabildo!=null){ 
                var btn_ver_documento = "";
                var color4="";
                btn_ver_documento = (`
                        <button type="button" onclick="verEntrega('${data.resultado.egreso_cabildo[0].idmv_egresocabildo}','${data.resultado.egreso_cabildo[0].ruta}')"" class="btn btn-xs btn-info" style="padding: 2px 8px;" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Documentos ">
                                    <i class="fa fa-file-pdf-o"></i>
                        </button>
                `);
                btn_ver_obser = (`
                        <button type="button" onclick="verEntregaObs('${data.resultado.idmv_mantenimiento}')"" class="btn btn-xs btn-danger" style="padding: 2px 8px;margin-left:5px" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Observacion ">
                                    <i class="fa fa-eye"></i>
                        </button>
                        
                `);
           
                if(data.resultado.egreso_cabildo[0].firmaretira==1){ 
                    var estado="Aprobado";
                    color4="background: #139556";
                }else{
                    var estado="Pendiente";
                    color4="background: #eaa330";
                }
            var fecha=data.resultado.egreso_cabildo[0].fecha;
            var titulo="Egreso Repuesto";
            var contenido4 = (`
                        <div class="content_nodo flujo_sm">
                            <div class="content_title_detalle" style="${color4}"><center>${titulo}</center></div>
                            <div class="content_info_detalle">                
                                <p class="info_detalle asunto_sm" style="text-align: left;">
                                    <b><i class="fa fa-calendar"></i> ${fecha}</b>
                                    <br>
                                    <i class="fa fa-question-circle info_input" style="color: #607f9a; font-size: 16px; float:left; margin-right: 5px;" data-toggle="tooltip" data-placement="right" title="" data-original-title='Egreso de Repuesto'></i>
                                     Egreso de Repuesto
                                    <br>
                                    <b>Estado: </b> ${estado} 
                                </p>                                                   
                                ${btn_ver_documento}
                            </div>
                        </div> 


                     `);
             
            }
              dataOrganigrama.push(
                           
                              [{'v':'Jim', 'f':contenido},
                               `<div class="content_title_detalle" style="background:#2277c1; font-weight:bold"><center>Mantenimiento <br> <b style="font-size:12px">${data.resultado.codigo_mantenimiento}</b> </center></div>`, ''],

                               
                               [contenido2, 'Jim', ''],

                               [contenido3, contenido2, ''],

                                [contenido4, contenido3, ''],
                              
                         );
                  
                     })
                     
                    
                       
                 


               }); 
           
         

      
   }

   function verSolObs(id){
        vistacargando("M","Obteniendo información...");
        $.get("/listadoMantenimiento/datos/"+id, function (data) {
        vistacargando();
        $('#chofersolicita').html(data.resultado.chofer.usuario.name);
        $('#fechasolicitud').html(data.resultado.fecha_revision_solicitud);
        $('#vehiculodetalle').html(data.resultado.vehiculo.descripcion+" "+data.resultado.vehiculo.codigo_institucion);
        $('#departamentodetalle').html(data.resultado.vehiculo.departamento.nombre);
        $('#tipodetalle').html(data.resultado.tipo);
        $('#observacióndetalle').html(data.resultado.observaciones);
        $('#chofersolicita').html(data.resultado.chofer.usuario.name);
        $('#DetalleMant').modal('show');
       
        })
   }

   $('#DetalleMant').on('hidden.bs.modal', function (e) {
        $('#chofersolicita').html('');
        $('#fechasolicitud').html('');
        $('#vehiculodetalle').html('');
        $('#departamentodetalle').html('');
        $('#tipodetalle').html('');
        $('#observacióndetalle').html('');
        $('#chofersolicita').html('');
   });

   function verRevObs(id){
        vistacargando("M","Obteniendo información...");
        $.get("/listadoMantenimiento/datos/"+id, function (data) {
            vistacargando();
            console.log(data);
            $('#mecanicorevisa').html(data.resultado.mecanico.usuario.name);
            $('#fecharevision').html(data.resultado.fecha_revision_solicitud);
            
            var items=[];
            $.each(data.resultado.areas_add, function(i,item){
            $('#areasdiag').html('');   
                items.push($('<li/>').text(item.areas.descripcion));
            }); 
            $('#areasdiag').append.apply($('#areasdiag'), items);

            var itemSer=[];
            $.each(data.resultado.servicio_add, function(i,item2){
            $('#serviciomec').html('');   
                itemSer.push($('<li/>').text(item2.servicio.detalle));
            }); 
            $('#serviciomec').append.apply($('#serviciomec'), itemSer);

            var itemRep=[];
            $.each(data.resultado.repuesto_add, function(i,item3){
            $('#repuestomec').html('');   
                itemRep.push($('<li/>').text(item3.cantidad_cabildo+"  "+item3.material_cabildo));
            }); 
            $('#repuestomec').append.apply($('#repuestomec'), itemRep);


            $('#DetalleRev').modal('show');
       
        })
   }

   $('#DetalleRev').on('hidden.bs.modal', function (e) {
        $('#fecharevision').html('');
        $('#mecanicorevisa').html('');
        $('#areasdiag').html('');
        $('#serviciomec').html('');
        $('#repuestomec').html('');
        
   });


   function verOrdenObs(id){
        vistacargando("M","Obteniendo información...");
        $.get("/listadoMantenimiento/datos/"+id, function (data) {
        vistacargando();
        $('#fechaorden').html(data.resultado.fecha_orden_insumo);
        $('#responsableorden').html(data.resultado.usuarioorden.name);
        var fechafinalord=data.resultado.fecha_aprobacion_final_orden;
        if(fechafinalord=="" || fechafinalord==null){
                var fechafinal="Pendiente de aprobación";

        }
        else{
                var fechafinal=fechafinalord;
        }
        var firmaresp=data.resultado.firma_orden;
        //alert(firmaresp);
        if(firmaresp!=1){
                var firmaresp="NO";

        }
        else{
                var firmaresp="SI";
        }
        var reprobacion=data.resultado.reprobacion_orden;
        if(reprobacion=="" || reprobacion==null){
                var reprobacionf="Orden Registrada";

        }
        else{
                var reprobacionf=reprobacion;
        }
        $('#fechafinalorden').html(fechafinal);
        $('#ordenapr').html(firmaresp);
        $('#observaciónorden').html(reprobacionf);       
        $('#OrdenRev').modal('show');
       
        })
   }

   $('#OrdenRev').on('hidden.bs.modal', function (e) {
        $('#fechaorden').html('');
        $('#responsableorden').html('');
        $('#fechafinalorden').html('');
        $('#responsablefinalorden').html('');
        $('#observaciónorden').html('');
        $('#ordenapr').html('');
        //$('#observacióndetalle').html('');
        
   });


   function verEntregaObs(id){
        vistacargando("M","Obteniendo información...");
        $.get("/listadoMantenimiento/datos/"+id, function (data) {
        vistacargando();
        $('#fechaentrega').html(data.resultado.fecha_entrega_insumo);
        $('#responsableentrega').html(data.resultado.usuarioentrega.name);
        var fechafinalent=data.resultado.fecha_final_entrega;
        if(fechafinalent=="" || fechafinalent==null){
                var fechafinale="Pendiente de aprobación";

        }
        else{
                var fechafinale=fechafinalent;
        }
        var firmarespE=data.resultado.firma_entrega;
        if(firmarespE!=1){
                var firmarespEn="NO";

        }
        else{
                var firmarespEn="SI";
        }
        var reprobacionE=data.resultado.rechazo_entrega;
        if(reprobacionE=="" || reprobacionE==null){
                var reprobacionf2="Entrega Registrada";

        }
        else{
                var reprobacionf2=reprobacionE;
        }
        $('#fechafinalentrega').html(fechafinale);
        $('#entregaapr').html(firmarespEn);
        $('#observaciónentrega').html(reprobacionf2);       
        $('#EntregaMod').modal('show');
       
        })
   }

   $('#EntregaMod').on('hidden.bs.modal', function (e) {
        $('#fechaentrega').html('');
        $('#responsableentrega').html('');
        $('#fechafinalentrega').html('');
        $('#responsablefinalorden').html('');
        $('#observaciónentrega').html('');
        $('#entregaapr').html('');
        //$('#observacióndetalle').html('');
        
   });

   function verdocumento_egre(codigo,ruta){
             var iframe=$('#iframePdfegreso');
             iframe.attr("src", "visualizarDoc/"+ruta);   
             $("#vinculo_egreso").attr("href", '/entregaRepuesto/descargaregreso/'+codigo);
             $("#documento_egreso").modal("show");
        }

        $('#documento_egreso').on('hidden.bs.modal', function (e) {
                var iframe=$('#iframePdfegreso');
                iframe.attr("src", null);

        });

        $('#descargar_egre').click(function(){
               $('#documento_egreso').modal("hide");
        }); 

    
  function salirDetalle(){
          $('#detalle').hide(300);
          $('#datos').show(300);
          //limpiardetallerevision();
          $('#listaDoc').html('');
          $('#listaRepuesto').html('');
          $('#listaserv').html('');
 }

    function vermemo2(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         $('#titulo2').html('Informe de Solicitud de Mantenimiento');
         var iframe=$('#iframePdf2');
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo2").attr("href", '/listadoMantenimiento/descargarMemo/'+codigo);
         $("#documentosMant2").modal("show");
    }

    $('#documentosMant2').on('hidden.bs.modal', function (e) {
            
            var iframe=$('#iframePdf2');
            $('#titulo2').html('');
            iframe.attr("src", null);

    });

    $('#descargar2').click(function(){
           $('#documentosMant2').modal("hide");
    });


    function verRevision(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         $('#titulo2').html('Informe de Revisión de Mantenimiento');
         var iframe=$('#iframePdf2');
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo2").attr("href", '/listadoMantenimiento/descargarRevision/'+codigo);
         $("#documentosMant2").modal("show");
    }


    function verorden(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         $('#titulo2').html('Informe de Orden de Insumos');
         var iframe=$('#iframePdf2');
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo2").attr("href", '/listadoMantenimiento/descargarOrden/'+codigo);
         $("#documentosMant2").modal("show");
    }

    function verEntrega(codigo,ruta){
         console.log(ruta);
         console.log(codigo);
         var iframe=$('#iframePdf2');
         $('#titulo2').html('Informe de Egreso');
         iframe.attr("src", "visualizarDoc/"+ruta);   
         $("#vinculo2").attr("href", '/listadoMantenimiento/descargar_egreso/'+codigo);
         $("#documentosMant2").modal("show");
    }
   

 