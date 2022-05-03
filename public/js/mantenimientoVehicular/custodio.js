function modalVehiculo(){
      cargartablaVehiculo();
      $("#modalvehiculo").modal("show");
    }

     $('#modalvehiculo').on('hidden.bs.modal', function (e) {
        
       // $('#idmv_marca').val('');
       // $('marcam').val('');
       // actualizarcombomarca();
         })

     
         
        //ELIMINAR 
        function btn_eliminarcustodio(btn){
            if(confirm('¿Quiere eliminar el registro?')){
                $(btn).parent('.frm_eliminar').submit();
            }
        }
        function custodio_editar(id){
            $.get("/custodio/registro/"+id+"/edit", function (data) {
            console.log(data);
            $('#idvehiculo').val(data.resultado.idmv_vehiculo);
            $('#codigo_vehiculo').val(data.resultado.vehiculo.codigo_institucion);
            $('.option_persona').prop('selected',false); 
            $(`#cmb_persona option[value="${data.resultado['idmv_persona']}"]`).prop('selected',true); 
            $("#cmb_persona").trigger("chosen:updated");
            $('.act').prop('selected',false);
            $('.inac').prop('selected',false); 
            $(`#cmb_estado option[value="${data.resultado['estado']}"]`).prop('selected',true); 
            $("#cmb_estado").trigger("chosen:updated");
            $('#fechaini').val(data.resultado.fecha_ini);
            $('#fechafin').val(data.resultado.fecha_fin);
            $('#acta').val(data.resultado.acta);
                      
        
         });

        $('#method_Custodio').val('PUT'); 
        $('#frm_Custodio').prop('action',window.location.protocol+'//'+window.location.host+'/custodio/registro/'+id);
        $('#btn_vehicom_cancelar').removeClass('hidden');

        $('html,body').animate({scrollTop:$('#administradorCustodio').offset().top},400);
    }

        // la funcion del boton cancelar, vacia los campos y el mismo se vuelve a desaparecer
        $('#btn_vehicom_cancelar').click(function(){
            $('#idvehiculo').val('');
            $('#codigo_vehiculo').val('');
            $('.option_persona').prop('selected',false); //
            $("#cmb_persona").trigger("chosen:updated"); 
            $('.act').prop('selected',false); //
            $('.inac').prop('selected',false); //
            $("#cmb_estado").trigger("chosen:updated");
            $('#fechaini').val('');
            $('#fechafin').val('');
            $('#acta').val('');

            
            $('#method_Custodio').prop('action',window.location.protocol+'//'+window.location.host+'/custodio/registro/');
            $(this).addClass('hidden');
        });

      function cargartablaVehiculo(){
      var id=1;

               $.get("/servicios/"+id+'/llenarvehiculo', function (resultado) {    
               console.log(resultado); 

                    var idtabla = "table_vehiculo";
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
                        
                        data: resultado.resultado,
                       
                        columns:[
                            {data: "codigo_institucion" },
                            {data: "placa" },
                            {data: "num_chasis" },
                            {data: "año_fabricacion" },
                            {data: "marca.detalle" },
                            {data: "modelo" },
                            {data: "tipo_uso.detalle" },
                            {data: "placa" },
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){
                            
                           $('td', row).eq(7).html(`
                                     <button type="button" class="btn btn-info btn-sm btn-block" onclick="cargarDetalleVehiculo
                                    ('${data.idmv_vehiculo}', '${data.codigo_institucion}', this)"> 
                                        <i class="fa fa-check"></i> Seleccionar
                                    </button>
          
                                `);
    
                        } 

                        }); 

                        });                               
                    

     }

     function cargarDetalleVehiculo(id,codigo){
        $('#codigo_vehiculo').val(codigo);
        $('#idvehiculo').val(id);
        $('#modalvehiculo').modal('hide');
     }