
    function editar(id){
      //  alert(id);
    vistacargando("M", "Espere..");
    $.get("/patentesRegistradas/detalle/"+id+"/edit", function (data) {
         vistacargando();
        $('#listado').hide(300);
        $('#detalle').show(300);
        console.log(data);

         $('#cedula').html(data.resultado.usuario.cedula);
        $('#nombres').html(data.resultado.usuario.name);
        $('#celular').html(data.resultado.usuario.celular);
        $('#correo').html(data.resultado.usuario.email);
        $('#profesion').html(data.resultado.usuario.profesion);
        $('#sexo').html(data.resultado.usuario.sexo);

        if(data.resultado.usuario.artesano=="No")
        {
        $('#artesano').html("No");
        }
       if(data.resultado.usuario.artesano=="Si")
        {
         $('#artesano').html("Si");   
        }
        else{
         $('#artesano').html("No");   
        }


   //////SI ES ARTESANO MOSTRAMOS UN BOTON PARA VISUALIZAR Y DESCARGAR  EL DOCUMENTO ARTESANO SERVIDOR SFTP     

       //$('#artesano').html(data.resultado.patente.usuario.artesano);
        var esartesano=data.resultado.usuario.artesano;
       // alert(esartesano);
        $('#docartesano').html('');
        if(esartesano=="Si")
        {
          
         $('#docartesano').append(`<button type="button" onclick="verdocumentoartesano('${data.resultado.usuario.docartesano}')" class="btn btn-sm btn-primary pull-left" ><i class="fa fa-eye"></i> Ver</button>`);

        }
      if(esartesano=="No")  {      

    }



        
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
            data: data.resultado.establecimientopatentereg,
            columnDefs: [

                    { "width": "40%", "targets": 0 },
                    { "width": "40%", "targets": 1 },
                    { "width": "20%", "targets": 2 }
                        ],
            columns:[
                    {data: "estado",className: ""},
                    {data: "estado" ,className: ""},
                    {data: "estado",className: ""},
                                  
           ],
           "rowCallback": function( row, data, index ){
            var set=[''];
            var hr='';

            $.each(data.actividadpatente,function(i,item2){

                if(i>=0){hr=`<li style="padding-bottom:10px">`;}
                if(item2.profesional!="N"){
                    retornar = `<span style="min-width: 80px !important;font-size:12px" class="label label-success estado_firma"><i class="fa fa-check-circle"></i> Profesional</span>`;
                 }
                 else{
                    retornar ="";

                 }

                 set[i]= ` ${hr} ${item2.descripcionactividad} ${retornar} `;

             });

            if(data.reinicioactividades==null){
                var reinicio="";
            }
            else{
                var reinicio=data.reinicioactividades;
            }

            $('td', row).eq(0).html(`                    
                                   
                                   <i class="fa fa-home" style="color: green"></i> <b>${data.descripcion} 00${data.numero}</b><br>
                                   <div style="padding-left: 15px">
                                   <b>Ubicacion</b> ${data.ubicacion}<br>
                                    <b>Inicio de actividades:</b> ${data.inicioactividades}<br>
                                    <b>Reinicio de actividades:</b> ${reinicio}<br>
                                   </div>
                                    
                                `);
            $('td', row).eq(1).html(set);
            if(data.local=="N"){
                $('td', row).eq(2).html('No requiere local');
            }
            else{
                if(data.establecimientofisico==null){
                    $('td', row).eq(2).html('');
                }
                else{
                $('td', row).eq(2).html(data.establecimientofisico.establecimientopatente.nombre+ " "+data.establecimientofisico.establecimientopatente.direccion);
                }
            }


           }
            

         });
               
       

       // console.log(data);
           
            
                   

        });


}

function salirDetalleTramite(){
            
            $('#detalle').hide(300);
            $('#listado').show(300);

        }


        /// VER PDF DOCUMENTO ARTESANO//////////////////////
       function verdocumentoartesano(ruta){
        console.log(ruta);
        var iframe=$('#iframePdfArtesano');
         // /iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizardocartesano/"+ruta);   
         $("#vinculoartesano").attr("href", '/patentesRegistradas/'+ruta+'/descargardocArtesano');
         $("#documentoartesanopdf").modal("show");
         //alert("dsd");
     }

      $('#documentoartesanopdf').on('hidden.bs.modal', function (e) {
        
          var iframe=$('#iframePdfArtesano');
          iframe.attr("src", null);

         });

///DESCARGAR DOCUMENTO ARTESANO/////////////////////
      $('#descargardocartesano').click(function(){
          $('#documentoartesanopdf').modal("hide");
      });

