
  
  //ELIMINAR 
  function revertir(btn){
      //alert(btn);
       if(confirm('¿Quiere revertir el registro?')){
           // $(btn).parent('.frm_revertir').submit();
        var ideg=$('#idegreso').val();
        //alert(ideg);
        //revertimos
        revertirdato(ideg);

       }
  }

  function revertirdato(id){
    console.log(id);
      location.href="/reversionRepuesto/"+id+"/revertir";


  }

   


    //visualizar archivo  
    function verpdf(ruta,codigo){
         var iframe=$('#iframePdf');
         // iframe.attr("src", "visualizardoc/RP_504_64b35bd288536b87917f53da0019a319.pdf");
         iframe.attr("src", "visualizardoc/"+ruta);   
         $("#vinculo").attr("href", '/actualizacionRepuesto/'+codigo+'/descargar');
         $("#documentopdf").modal("show");
     }

    $('#documentopdf').on('hidden.bs.modal', function (e) {
          
            var iframe=$('#iframePdf');
            iframe.attr("src", null);

    });

    $('#descargar').click(function(){
       $('#documentopdf').modal("hide");
    });

    $('#modal_detalle').on('hidden.bs.modal', function (e) {
          
            $('#archivomodal').val('');
            $('#modal_sincronizacion').modal('show');

    });

    function verdetalle(codigo,detalle,numero,id){
     // alert(detalle);
      var det = encodeURIComponent(detalle);
      console.log(det);
      //console.log(det);
        
        vistacargando("M", "Espere..");
        $.get("/actualizacionRepuesto/"+codigo+"/"+det+"/"+numero+"/consultar", function(retorno){
        vistacargando();
        console.log(retorno);

        $('#datos').hide(300);
        $('#detalle').show(300);

        $('#idegreso').val(id);

        $('#form_revertir').prop('action',window.location.protocol+'//'+window.location.host+'/reversionRepuesto/listado/'+id);

        var lista_det=[];
        $.each(retorno.resultado, function(i,repuesta){

            $.each(repuesta.detalle_items, function(i,item){
               console.log(item);
               lista_det.push(item);

             })
         })
        console.log(lista_det)

         var idtabla = "datatable2";
                          $(`#${idtabla}`).DataTable({
                             dom: ""
                          +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
                          +"<rt>"
                          +"<'row'<'form-inline'"
                          +" <'col-sm-6 col-md-6 col-lg-6'l>"
                          +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                          "destroy":true,
                           "order": [[ 0, "desc" ]],
                          pageLength: 10,
                          sInfoFiltered:false,
                           language: {
                              lengthMenu: "Mostrar _MENU_ registros por pagina",
                              zeroRecords: "No se encontraron resultados en su busqueda",
                              searchPlaceholder: "Buscar registros",
                              info: "Mostrando registros de _START_ al _END_ de un total de  _TOTAL_ registros",
                              infoEmpty: "No existen registros",
                              infoFiltered: "(filtrado de un total de _MAX_ registros)",
                              search: "Buscar:",
                              paginate: {
                                  first: "Primero",
                                  last: "Último",
                                  next: "Siguiente",
                                  previous: "Anterior"
                              },
                          },
                              
                              data: lista_det,

                               columnDefs: [
                                  {  width:"15%", targets: 0 },
                                  {  width:"65%", targets: 1 },
                                  {  width:"20%", targets: 2 },
                                 
                                                            
                              ],
                             
                              columns:[
                                 
                                  {data: "codigo" },
                                  {data: "descripcion" },
                                  {data: "cantentrega" },
                                                              
                               ]
                        // "rowCallback": function( row, data, index ){

                        //   $.each(data.detalle_items, function(i,item){
                        //       $('td', row).eq(0).html(item.codigo);
                        //       $('td', row).eq(1).html(item.codigo);
                        //       $('td', row).eq(2).html(item.codigo);
                        //   });


                        // }
                            
                        });
                  


       })

    }

 function salirDetalle(){
  $('#detalle').hide(300);
  $('#datos').show(300);
 // limpiardetallerevision();

 }


