 function abrirmodal(identificador_url)
    {       
        $('#DetalleTramite').modal("show");
    }

    function editar(id){
     //var id=351;
     $('#tabla_archivo').html('');
     $('#tablactivos').html('');
     $('#botonaprobadoreprobado').html('');
      vistacargando("M", "Espere..");
    $.get("/patentesPendientes/detalle/"+id+"/edit", function (data) {
         vistacargando();
       //  console.log(data);
        if(data['error']==true){
          $('#infoBusqueda').html('');
            $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>¡Atención!</strong>${data['resultado']}.
                      </div>`);
            $('#infoBusqueda').show(200);
            setTimeout(function() {
            $('#infoBusqueda').hide(200);
            },  3000);

          ///$("#boton_guardar").prop("disabled",false);
          return;
        }



        $('#listado').hide(300);
        $('#detalle').show(300);
        
     ///
     //   console.log(data);
        //console.log(data.resultado.mes);
        //console.log(data.resultado.patente.usuario.cedula);
        $('#cedula').html(data.resultado.patente.usuario.cedula);
        $('#nombres').html(data.resultado.patente.usuario.name);
        $('#celular').html(data.resultado.patente.usuario.celular);
        $('#correo').html(data.resultado.patente.usuario.email);
        $('#profesion').html(data.resultado.patente.usuario.profesion);
        $('#sexo').html(data.resultado.patente.usuario.sexo);


        ///////////////////////////////////////////////////////
        $('#anio').html(data.resultado.anio);
        var mesletra=(data.resultado.mes);
        if(mesletra==1){$('#mes').html('Enero');}
        if(mesletra==2){$('#mes').html('Febrero');}
        if(mesletra==3){$('#mes').html('Marzo');}
        if(mesletra==4){$('#mes').html('Abril');}
        if(mesletra==5){$('#mes').html('Mayo');}
        if(mesletra==6){$('#mes').html('Junio');}
        if(mesletra==7){$('#mes').html('Julio');}
        if(mesletra==8){$('#mes').html('Agosto');}
        if(mesletra==9){$('#mes').html('Septiembre');}
        if(mesletra==10){$('#mes').html('Octubre');}
        if(mesletra==11){$('#mes').html('Noviembre');}
        if(mesletra==12){$('#mes').html('Diciembre');}


       //$('#mes').html(data.resultado[0].mes);
       $('#femision').html(data.resultado.fechaGeneracion);
        $('#fregistro').html(data.resultado.patente.fecharegistro);
        $('#freapertura').html(data.resultado.patente.fechareapertura);
        $('#fcierre').html(data.resultado.patente.fechacierre);

       // $('#tipodeclaracion').html(data.resultado[0].auditoria[0].tipodecla);

        var aud=jQuery.parseJSON(data.resultado.auditoria);
        $('#tipodeclaracion').html(aud.tipodecla);
       // alert(aud.obligadoCont);
       // $('#obligadocont').html(aud.obligadoCont);
        if(aud.obligadoCont==="N")
        {
        $('#obligadocont').html("No");
        }
        else
        {
         $('#obligadocont').html("Si");   
        }

        if(aud.ldiscapacidad==="N")
        {
        $('#discapacidad').html("No");
        }
        else
        {
         $('#discapacidad').html("Si");   
        }

        if(aud.lanciano=="N")
        {
        $('#anciano').html("No");
        }
        else
        {
         $('#anciano').html("Si");   
        }

        if(aud.artesano=="N")
        {
        $('#artesano').html("No");
        }
        else
        {
         $('#artesano').html("Si");   
        }






   /////EN  CASO DE Q SE ARREGELE EL DOCUMENTO ARTESANO SERVIDOR SFTP     

       //$('#artesano').html(data.resultado.patente.usuario.artesano);
        var esartesano=aud.artesano;
       // alert(esartesano);
        $('#docartesano').html('');
        if(esartesano=="S")
        {
            //$('#docartesano').prop("disabled",false);
          //  $('#docartesano').removeClass('hidden');

         $('#docartesano').append(`<button type="button" onclick="verdocumentoartesano('${aud.docartesano}')" class="btn btn-sm btn-primary pull-left" ><i class="fa fa-eye"></i> Ver</button>`);

          
            // $('#docartesano').append(`<h5  style="text-align: left;color: black"><span style="color: green" class="glyphicon glyphicon-check"></span> <strong>LEY ARTESANO:</strong>Si
                                        
            //                  <button type="button" onclick="verdocumentoartesano('${data.resultado.patente.usuario.docartesano}')" class="btn btn-outline-primary btn-sm" ><i class="fa fa-eye"></i> Ver</button></h5>`);
      
        }
      if(esartesano=="No")  {      

           // $('#docartesano').addClass('hidden');
           // $('#docartesano').prop("disabled",true);
           // $('#docartesano').append(`<button type="button" class="btn btn-sm btn-success pull-left hidden" ><i class="fa fa-eye"></i> Ver</button></h5>`);
            
             // $('#docartesano').append(`<h5  style="text-align: left;color: black"><span style="color: green" class="glyphicon glyphicon-check"></span> <strong>LEY ARTESANO:</strong>No
                                        
             //                 </h5>`);

    }



        var totalbase=(data.resultado.baseImponible-0).toFixed(2); 
        $('#base').html('$ '+totalbase);

        // var semestre_=(aud.semestre);
        // var totalprimersemestre=(semestre_.primerSemestre-0).toFixed(2);
        // var totalsegundosemestre=(semestre_.segundoSemestre-0).toFixed(2);


        // $('#psemestre').html('$ '+totalprimersemestre);
        // $('#ssemestre').html('$ '+totalsegundosemestre); 
       // $('#base').html('$ '+totalbase) 


    ///////////////////INFORMACION DEL CONTRIBUYRNTE///////////////////

       


        
        
            

           //console.log(item.auditoria);
            var obj= jQuery.parseJSON(data.resultado.auditoria);
           

           // alert(obj.EsblecimientosSRI.Ubicacion);
             var subtotal=0;
             var totalexoneracion=0;
             var totalpermiso=0;
             var totalserv=0;
             var totalbipor=0;
             var totalvalorbipor=0;
             var totalbi=0;
            $.each(obj.EsblecimientosSRI, function(i,item){
             //  alert(item.Ubicacion);
              // alert(item.calculoPatente.patente);
               var pat=item.calculoPatente.patente;

                
                subtotal+=Number(pat);
                var subtotal_f=(subtotal-0).toFixed(2);
                $('#subtotal').html('$' +subtotal_f);
              //  alert(subtotal_f);

               var ex=item.calculoPatente.exoneracion;
               totalexoneracion+=Number(ex);
                var totalexoneracion_f=(totalexoneracion-0).toFixed(2);
                $('#exon').html('$' +totalexoneracion_f);

                var perm=item.calculoPatente.permiso_func;
                totalpermiso+=Number(perm);
                var totalpermiso_f=(totalpermiso-0).toFixed(2);
                $('#permiso').html('$' +totalpermiso_f);

                var ser=item.calculoPatente.servicios_adm;
                 totalserv+=Number(ser);
                var totalserv_f=(totalserv-0).toFixed(2);
                $('#servicio').html('$' +totalserv_f);

                var baseimppor=item.porcentajeDeclaracion;
                totalbipor+=Number(baseimppor);


                var baseim=item.baseImponible;
                totalbi+=Number(baseim);
                var totalbim=(totalbi-0).toFixed(2);
                $('#baseimp').html('$' +totalbim);


                 // var valorbipor=item.baseImponibleInclPorc;
                 // totalvalorbipor+=Number(valorbipor);
                 // var totalvalorpor=(totalvalorbipor-0).toFixed(2);

                        
            });
            // var cantidadEstablecimiento=obj.EsblecimientosSRI.length;
            // if(cantidadEstablecimiento==1)
            // {
            //       var totalbaseimp=(data.resultado.baseImponible-0).toFixed(2);

            //       $('#baseimp').html(`      

            //                        $ ${totalbaseimp}<br>
                                    
                                                                       
            //                     `);


            // }

            
            // // alert(totalvalorbipor);
            // // alert(totalvalorpor);
            // else{
            // var totalbaseimp=(data.resultado.baseImponible-0).toFixed(2);

            // $('#baseimp').html(`      
                                  
            //                      $ ${totalbaseimp}<br>
                                    
                                                                       
            //                     `);
            // }

             // var baseimp=(totalserv-0).toFixed(2);
             //    $('#servicio').html('$' +totalserv_f);


            var subt=$('#subtotal').val();
            var ex=$('#exon').val();
            var per=$('#permiso').val();
            var serv=$('#servicio').val();
            var totalp=(subtotal-totalexoneracion)+Number(totalpermiso)+Number(totalserv);
            var totalfinal=(totalp-0).toFixed(2);
            $('#totalp').html('$' +totalfinal).css({'font-weight':'bold'});



          //tablapat
        // $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow':'auto'});
         
         $('#tb').removeClass('overx');
         $('#tb').addClass('overauto');
         $('#tbact').removeClass('overx');
         $('#tbact').addClass('overauto');
       
                 
                $.each(obj.EsblecimientosSRI, function(i,item){   
              //  alert("sas" +item.Ubicacion);

           //  alert(obj.patenteRegistrada.fecharegistro);

            var tabla = $('#datatable2').DataTable({

            dom: ""
                +"<'row' <'form-inline' <'col-sm-12 inputsearch'>>>"
                +"<rt>"
                +"<'row'<'form-inline'"
                +" <'col-sm-6 col-md-6 col-lg-6'>"
                +"<'col-sm-6 col-md-6 col-lg-6'>>>",
                "destroy":true,
                pageLength: 10,
                sInfoFiltered:false,
               //language: datatableLenguaje(datatable),
            data: obj.EsblecimientosSRI,
            columns:[
                    {data: "Ubicacion",className: ""},
                    {data: "Ubicacion" ,className: ""},
                    {data: "Ubicacion",className: ""},
                    {data: "Ubicacion",className: "text-right"},
                    {data:  "calculoPatente.patente", className: "text-right" },
                    {data:  "calculoPatente.patente", className: "text-right" },
                    {data:  "calculoPatente.patente", className: "text-right" },
                    {data:  "calculoPatente.patente", className: "text-right" },
                    {data:  "calculoPatente.patente", className: "text-right" },
                    {data:  "calculoPatente.patente", className: "text-right" },
              
           ],
            "rowCallback": function( row, data, index ){
                var set=[''];
                   var hr='';
      
            $.each(data.actividades,function(i,item2){
               // console.log(item2);
            //    alert(item2.descripcion);
                if(i>=0){hr=`<li style="padding-bottom:10px">`;}

                if(item2.profesional!="N"){
                    retornar = `<span style="min-width: 80px !important;font-size:12px" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Profesional</span>`;
                 }
                 else{
                    retornar ="";

                 }

                 set[i]= ` ${hr} ${item2.descripcion} ${retornar} `;

             });
                //console.log(data.auditoria);
               
               
               // var exoneracion=obj.calculoPatente.exoneracion;
               
                // var valorp=(data.calculoPatente.patente-0).toFixed(2);
                // $('td', row).eq(3).html('$' +valorp);
                
             if(data.tienelocalfisico=="S"){
                $('td', row).eq(2).html(data.localfisico);
             }
             else{
                $('td', row).eq(2).html("No requiere local");
             }

             if(obj.patenteRegistrada.fechareapertura==null){
               // console.log("SDsd");
                var fechareapertura="";
             }
             else{
                var fechareapertura=obj.patenteRegistrada.fechareapertura;
             }
             var valorporcbi=(data.baseImponibleInclPorc-0).toFixed(2);

               // $('td', row).eq(0).html(data.establecimientopatente.descripcion);;
                var inicio_Actividad=data.inicioactividades;
                if(inicio_Actividad==undefined){
                  inicio_Actividad='-----';
                } 
                 $('td', row).eq(0).html(`                    
                                   
                                   <i class="fa fa-home" style="color: green"></i> <b>${data.Descripcion} 00${data.numero}</b><br>
                                   <div style="padding-left: 15px">
                                   <b>Ubicacion</b> ${data.Ubicacion}<br>
                                    <b>Inicio de actividades:</b> ${inicio_Actividad}<br>
                                   </div>
                                    
                                `);

            var cantidadEstablecimiento_=obj.EsblecimientosSRI.length;
            if(cantidadEstablecimiento_==1)
            {
                  var totalbaseimp=(data.baseImponible-0).toFixed(2);

                  $('td', row).eq(3).html(`     
                                    ${data.porcentajeDeclaracion}%

                                                                       
                                `);

                  $('td', row).eq(4).html(`     
                                  
                                    $ ${totalbaseimp}
                                    
                                                                       
                                `);
                  


            }
            else{
                 $('td', row).eq(3).html(`                    
                                   
                                   
                                    ${data.porcentajeDeclaracion}%
                                    
                                                                       
                                `);
                 $('td', row).eq(4).html(`                    
                                   
                                   
                                    $ ${valorporcbi }
                                    
                                                                       
                                `);
                
                
                 }
                  
                var impPatente=(data.calculoPatente.patente-0).toFixed(2);
                $('td', row).eq(5).html('$'+impPatente);
                var exone=(data.calculoPatente.exoneracion-0).toFixed(2);
                $('td', row).eq(6).html('$'+exone);
                var permi=(data.calculoPatente.permiso_func-0).toFixed(2);
                $('td', row).eq(7).html('$'+permi);
                var servi=(data.calculoPatente.servicios_adm-0).toFixed(2);
                $('td', row).eq(8).html('$'+servi);
                var tot=(impPatente-exone)+Number(permi)+Number(servi);
                var tt=(tot-0).toFixed(2);
                $('td', row).eq(9).html('$'+tt).css({'font-weight':'bold'});
                $('td', row).eq(1).html(set);
                               
             
             }


         });

        });

 /////////////////////////////TABLA DOCUMENTOS//////////////////////////////////////////////
 //console.log(data.resultado);



        // var f=obj.EsblecimientosSRI[0].Ubicacion;
        // alert(f);


        // var tabla = $('#tabla_archivo').DataTable({
        //     dom: ""
        //         +"<'row' <'form-inline' <'col-sm-12 inputsearch'>>>"
        //         +"<rt>"
        //         +"<'row'<'form-inline'"
        //         +" <'col-sm-6 col-md-6 col-lg-6'>"
        //         +"<'col-sm-6 col-md-6 col-lg-6'>>>",
        //         "destroy":true,
        //         pageLength: 10,
        //         sInfoFiltered:false,
        //        //language: datatableLenguaje(datatable),
        //     data: data.resultado,
        //     columns:[
        //             {data: "estado",className: ""},
        //             {data: "estado" ,className: ""},
                    
                   
        //    ],
        //     "rowCallback": function( row, data, index ){
        //         // var set=[''];
        //         //    var hr='';
        //         $('td', row).eq(0).html(`${index+1}
        //             `);
        //          $('td', row).eq(1).html(`${index+1}
        //             `);

        //         // if(obj.tipodecla=="Semestral"){
               

        //         //  $('td', row).eq(1).html(`                    
                                   
                                   
        //         //                    <b>Semestre 1</b> ${obj.semestre.archivo1s}<i class="fa fa-eye"></i><br>
        //         //                    <b>Semestre2</b>  ${obj.semestre.archivo2s}<i class="fa fa-eye"></i><br>
                                    
                                                                       
        //         //                 `);
                
                    
        //         // }
      
                               
             
        //      }

        //  });

////
       
       /////////////////TABLA DE CERTIFICADOS ASOCIADOS ///////////////////////////////////
//console.log(obj.EsblecimientosSRI[0].tienelocalfisico);
    var tienelocalf=obj.EsblecimientosSRI[0].tienelocalfisico;

    $('#tabla_certificado').html('');


    //if(tienelocalf=="S"){
    if(obj.CertificadosRequisitos==undefined){
        console.log(obj.CertificadosRequisitos);
        $('#panel_certificados').addClass("hidden");
    }
    else{
    //console.log(obj.CertificadosRequisitos);
     $('#panel_certificados').removeClass("hidden");
     $.each(obj.CertificadosRequisitos, function(i,item){
       //console.log(item);
       // console.log(item.certificados.MedioA);

        $('#tabla_certificado').append(`<tr>
                     <td style="text-align:right"> ${item.Nombre}</td>
                      <td style="text-align:right"><span>Medio Ambiente</span>&nbsp;<button type="button" onclick="vercertificado('${item.certificados.MedioA}')" class="btn btn-sm btn-primary"><i class="fa fa-eye"></i> Ver</button>
                            <br>
                            </span>Permiso de Funcionamiento</span>&nbsp;<button type="button" onclick="vercertificado('${item.certificados.PermisoF}')" class="btn btn-sm btn-primary"><i class="fa fa-eye"></i> Ver</button>
                            <br>
                            <span>Uso de Suelo</span>&nbsp;<button type="button" onclick="vercertificado('${item.certificados.UsoSuelo}')" class="btn btn-sm btn-primary"><i class="fa fa-eye"></i> Ver</button>
                           

                      </td>               
                </tr>`);



    });
    }
 // if(tienelocalf=="N"){
    
 //    $('#panel_certificados').addClass("hidden");
 // }

        













        //si es obligado a llevar contabilidad mostramos seccion activo totales

        if(data.resultado.estadoObligado=="S")
        {
            var valoractivo=(obj.valoractivo-0).toFixed(2);
            var valorpasivo=(obj.valorpasivo-0).toFixed(2);
            var valorpasivocorriente=(obj.valorpasivoCorriente-0).toFixed(2);
            var valoringresobruto=(obj.valoringresoBruto-0).toFixed(2);
            var valorbaseimponible=(obj.ActivosTotales.baseImponible-0).toFixed(2);
            var valorimpactivo=(obj.ActivosTotales.calculoActivos.activos-0).toFixed(2);
            var valorexoneracion=(obj.ActivosTotales.calculoActivos.exoneracion-0).toFixed(2);
            var valorservicioadm=(obj.ActivosTotales.calculoActivos.servicios_adm-0).toFixed(2);
            var totalactivototales=(obj.ActivosTotales.totalActivos-0).toFixed(2);

            $('#panel_totalactivos').removeClass("hidden");

            $('#tablactivos').append(
             `<thead>
              <tr role="row">
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Activo</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Pasivo</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Pasivo Corriente</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Ingreso Bruto</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Base Imponible</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Imp. Activos</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Exoneración</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Serv. Admin.</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Total</th>





                
              </tr>                       
            </thead>

            <tbody>

             <tr>
                 <td style="text-align:right">$ ${valoractivo}</td>
                 <td style="text-align:right">$ ${valorpasivo} </td>
                 <td style="text-align:right">$ ${valorpasivocorriente} </td>
                 <td style="text-align:right">$ ${valoringresobruto} </td>
                 <td style="text-align:right">$ ${valorbaseimponible} </td>
                 <td style="text-align:right">$ ${valorimpactivo}</td>
                 <td style="text-align:right">$ ${valorexoneracion} </td>
                 <td style="text-align:right">$ ${valorservicioadm} </td>
                 <td style="text-align:right"><b>$ ${totalactivototales} </b></td>                 
                  
                  
                  
                   
                   </tr>
                   </tbody>`);

        }
        if(data.resultado.estadoObligado=="N")
        {
            $('#panel_totalactivos').addClass("hidden");
        }


        if(obj.tipodecla=="Sustitutiva")  
        {
        $('#tabla_archivo').append(
             `<thead>
              <tr role="row">
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Detalle</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Documemto</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;"></th>
              </tr>                       
            </thead>

            <tbody>
             <tr>
                 <td>Declaración Original</td>
                  <td>${obj.archivoSustitutiva.archivoDOR} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.archivoSustitutiva.archivoDOR}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                  <td>Declaración Sustitutiva</td>
                    <td>${obj.archivoSustitutiva.archivoDST} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.archivoSustitutiva.archivoDST}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>
                   </tr> 

                   <tr>
                  <td>Informe de Contador/a</td>
                  <td>${obj.archivoSustitutiva.archivoIFC} </td>
                 
                   
                    <td>
                    <center>
                   <button type="button" onclick="verpdf('${obj.archivoSustitutiva.archivoIFC}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>

                  
                  
                   </tr>
                   </tbody>`);
                        
        }

        if(obj.tipodecla=="Original")  
        {
        $('#tabla_archivo').append(
             `<thead>
              <tr role="row">
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Detalle</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Documemto</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;"></th>
              </tr>                       
            </thead>

            <tbody>

             <tr>
                 <td>Declaración Original</td>
                  <td>${obj.archivoOriginal} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.archivoOriginal}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>
                    </td>

                  
                  
                   
                   </tr>
                   </tbody>`);
                        
        }


        if(obj.tipodecla=="Semestral")  
        {
        var valorprimersemestre=(obj.semestre.primerSemestre-0).toFixed(2);
        var valorsegundosemestre=(obj.semestre.segundoSemestre-0).toFixed(2);

        $('#tabla_archivo').append(
             `<thead>
              <tr role="row">
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Detalle</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Valor</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Documemto</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;"></th>

              </tr>                       
            </thead>

            <tbody>


             <tr>
                 <td>Primer Semestre</td>
                 <td style="text-align:right">$ ${valorprimersemestre} </td>
                 <td>${obj.semestre.archivo1s} </td>
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.semestre.archivo1s}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                  <td>Segundo Semestre</td>
                    <td style="text-align:right">$ ${valorsegundosemestre} </td>
                     <td>${obj.semestre.archivo2s} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.semestre.archivo2s}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>
                   </tr>
                   </tbody>`);
                        
        }


        if(obj.tipodecla=="Mensual")  
        {
        var valorEnero=(obj.ValorMes.Enero-0).toFixed(2);
        var valorFebrero=(obj.ValorMes.Febrero-0).toFixed(2);
        var valorMarzo=(obj.ValorMes.Marzo-0).toFixed(2);
        var valorAbril=(obj.ValorMes.Abril-0).toFixed(2);
        var valorMayo=(obj.ValorMes.Mayo-0).toFixed(2);
        var valorJunio=(obj.ValorMes.Junio-0).toFixed(2);
        var valorJulio=(obj.ValorMes.Julio-0).toFixed(2);
        var valorAgosto=(obj.ValorMes.Agosto-0).toFixed(2);
        var valorSeptiembre=(obj.ValorMes.Septiembre-0).toFixed(2);
        var valorOctubre=(obj.ValorMes.Octubre-0).toFixed(2);
        var valorNoviembre=(obj.ValorMes.Noviembre-0).toFixed(2);
        var valorDiciembre=(obj.ValorMes.Diciembre-0).toFixed(2);
        $('#tabla_archivo').append(
             `<thead>
              <tr role="row">
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Detalle</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Valor</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;">Documemto</th>
                <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" style="width: 10px;text-align: center;"></th>

              </tr>                       
            </thead>

            <tbody>


             <tr>
                 <td>Enero</td>
                 <td style="text-align:right">$ ${valorEnero} </td>
                 <td>${obj.ValorMes.archivoEnero} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoEnero}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                  <td>Febrero</td>
                  <td style="text-align:right">$ ${valorFebrero} </td>
                    <td>${obj.ValorMes.archivoFebrero} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoFebrero}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>
                   </tr> 

                   <tr>
                  <td>Marzo</td>
                  <td style="text-align:right">$ ${valorMarzo} </td>
                  <td>${obj.ValorMes.archivoMarzo} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoMarzo}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                  <td>Abril</td>
                  <td style="text-align:right">$ ${valorAbril} </td>
                    <td>${obj.ValorMes.archivoAbril} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoAbril}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>
                  </tr>

                <tr>
                  <td>Mayo</td>
                  <td style="text-align:right">$ ${valorMayo} </td>

                  <td>${obj.ValorMes.archivoMayo} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoMayo}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                  <td>Junio</td>
                  <td style="text-align:right">$ ${valorJunio} </td>

                    <td>${obj.ValorMes.archivoJunio} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoJunio}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                 </center>
                  </td>
                  </tr>

                <tr>
                  <td>Julio</td>
                  <td style="text-align:right">$ ${valorJulio} </td>

                  <td>${obj.ValorMes.archivoJulio} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoJulio}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                 <td>Agosto</td>
                  <td style="text-align:right">$ ${valorAgosto} </td>

                    <td>${obj.ValorMes.archivoAgosto} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoAgosto}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>
                  </tr>

                <tr>
                  <td>Septiembre</td>
                  <td style="text-align:right">$ ${valorSeptiembre} </td>

                  <td>${obj.ValorMes.archivoSeptiembre} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoSeptiembre}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                  <td>Octubre</td>
                  <td style="text-align:right">$ ${valorOctubre} </td>

                    <td>${obj.ValorMes.archivoOctubre} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoOctubre}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>
                  </tr>

                <tr>
                  <td>Noviembre</td>
                  <td style="text-align:right">$ ${valorNoviembre} </td>

                  <td>${obj.ValorMes.archivoNoviembre} </td>
                 
                   <td>
                   <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoNoviembre}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                    </center>

                  </tr>
                  <tr>
                  <td>Diciembre</td>
                  <td style="text-align:right">$ ${valorDiciembre} </td>

                    <td>${obj.ValorMes.archivoDiciembre} </td>

                  <td>
                  <center>
                   <button type="button" onclick="verpdf('${obj.ValorMes.archivoDiciembre}')" class="btn btn-sm btn-primary marginB0"><i class="fa fa-eye"></i> Visualizar</button>                   </td>
                  </center>
                  </td>
                   </tr>
                   </tbody>`);
                        
        }

        ////mostrar boton para aprobar o reprobar una patente///////////////

        // if(data.resultado.observacion==null || data.resultado.observacion=="No aprobado")
        // {
        //    var estadoobs="No aprobado";
        //    $('#botonaprobadoreprobado').append(`<center><button type="button" onclick="estadopatente('${data.resultado.idcertificado_patente}','${estadoobs}')" class="btn btn-sm btn-success" ><i class="fa fa-thumbs-up"></i> Aprobar</button></center>`);

        // }

        // if(data.resultado.observacion=="Aprobado")
        // {
        //    var estadoobs="Aprobado";
        //    $('#botonaprobadoreprobado').append(`<center><button type="button" onclick="estadopatente('${data.resultado.idcertificado_patente}','${estadoobs}')" class="btn btn-sm btn-danger" ><i class="fa fa-thumbs-down"></i> Revertir</button></center>`);
        // }

     });

    
      
}
        function estadopatente(id,estado){
           // alert(id);


             vistacargando("M", "Espere..");
            $.get("/patentesPendientes/"+id+"/"+estado+"/observacionpatente", function (data) {
                 vistacargando();
                 salirDetalleTramite();
               //  console.log(data);
                if(data['error']==true){
                  $('#infoBusqueda').html('');
                    $('#infoBusqueda').append(`<div style="background-color: #f8d7da;color: black" class="alert  alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>¡Atención!</strong>${data['resultado']}.
                              </div>`);
                    $('#infoBusqueda').show(200);
                    setTimeout(function() {
                    $('#infoBusqueda').hide(200);
                    },  3000);

                  ///$("#boton_guardar").prop("disabled",false);
                  return;
                }

                if(data.respuesta=="Aprobado"){
                
                $('.content_validar_'+data.codigoid).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-success estado_validado"><i class="fa fa-thumbs-up"></i>&nbsp; Aprobado &nbsp;&nbsp;</span>');

                $('#infoBusqueda').html('');
                    $('#infoBusqueda').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>¡Atención!</strong>Patente aprobada con éxito.
                              </div>`);
                    $('#infoBusqueda').show(200);
                    setTimeout(function() {
                    $('#infoBusqueda').hide(200);
                    },  3000);

                }
                if(data.respuesta=="No aprobado"){
                
                $('.content_validar_'+data.codigoid).html('<span style="min-width: 90px !important;font-size: 12px" class="label label-danger estado_validado"><i class="fa fa-thumbs-down"></i> No aprobado</span>');
                
                $('#infoBusqueda').html('');
                    $('#infoBusqueda').append(`<div class="alert alert-danger  alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>¡Atención!</strong>Patente no aprobada.
                              </div>`);
                    $('#infoBusqueda').show(200);
                    setTimeout(function() {
                    $('#infoBusqueda').hide(200);
                    },  3000);


                }


          //      vistacargando();
            });

        }

        function salirDetalleTramite(){
             //$('.table-responsive').css({'overflow-x':'inherint'});

            $('#tb').addClass('overx');
            $('#tb').removeClass('overauto');
            $('#tbact').addClass('overx');
            $('#tbact').removeClass('overauto');
            $('#detalle').hide(300);
            $('#listado').show(300);

        }



        /// VER DOCUMENTOPDF SECCION CERTIFICADO ASOCIADO //////////////////
        function vercertificado(ruta){
       
        var iframe=$('#iframePdfCertificado');
         // /iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizarcertasoc/"+ruta);   
         $("#vinculocert").attr("href", '/patentesGeneradas/'+ruta+'/descargarcert');
         $("#certpdf").modal("show");
         //alert("dsd");
     }

      $('#certpdf').on('hidden.bs.modal', function (e) {
        
          var iframe=$('#iframePdfCertificado');
          iframe.attr("src", null);

         });
//// DESCARGAR DOCUEMTNO SUBIDO/////////////////////////
      $('#descargarcertificado').click(function(){
          $('#certpdf').modal("hide");
      });






        function verpdf(ruta){
        var iframe=$('#iframePdf');
         // /iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizardoc/"+ruta);   
         $("#vinculo").attr("href", '/patentesPendientes/'+ruta+'/descargar');
         $("#documentopdf").modal("show");
         //alert("dsd");
     }

      $('#documentopdf').on('hidden.bs.modal', function (e) {
        
          var iframe=$('#iframePdf');
          iframe.attr("src", null);

         });

      $('#descargar').click(function(){
          $('#documentopdf').modal("hide");
      });

       function verdocumentoartesano(ruta){
        console.log(ruta);
        var iframe=$('#iframePdfArtesano');
         // /iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizardocartesano/"+ruta);   
         $("#vinculoartesano").attr("href", '/patentesPendientes/'+ruta+'/descargardocArtesano');
         $("#documentoartesanopdf").modal("show");
         //alert("dsd");
     }

      $('#documentoartesanopdf').on('hidden.bs.modal', function (e) {
        
          var iframe=$('#iframePdfArtesano');
          iframe.attr("src", null);

         });

      $('#descargardocartesano').click(function(){
          $('#documentoartesanopdf').modal("hide");
      });

