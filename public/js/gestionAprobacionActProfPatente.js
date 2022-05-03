
    ////////////////FIN SECCION ACTIVOS TOTALES (SI ES OBLIGADO)/////////////////////////////

        ////mostrar boton para aprobar o reprobar una patente///////////////

      

      /////////FIN BOTON APROBAR REPROBAR////////////////////////////////  

  

/////FUNCION ESTADO PATENTE PARA CAMBIAR ESTADO REVISADO O NO REVISADO
        function cambioestado(id,estado){
            //alert(id);


             vistacargando("M", "Espere..");
            $.get("/aprobacionActividades/"+id+"/"+estado+"/cambiarestados", function (data) {
                 vistacargando();
                 
                 $('html,body').animate({scrollTop:$('#adm').offset().top},400);


                 
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

                if(data.estado=="S"){
                    cargartabla();
                    $('#infoBusqueda').html('');
                    $('#infoBusqueda').append(`<div class="alert alert-success  alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>¡Atención!</strong> Actividad aprobada con éxito.
                              </div>`);
                    $('#infoBusqueda').show(200);
                    setTimeout(function() {
                    $('#infoBusqueda').hide(200);
                    },  3000);

                }
               

                if(data.estado=="N"){
                var valor="Aprobar";
                
                //$('#btn_'+data.idbtn).css({'btn btn-sm btn-success marginB0'});
                cargartabla();

                $('#infoBusqueda').html('');
                $('#infoBusqueda').append(`<div class="alert alert-danger  alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>¡Atención!</strong> Actividad reprobada.
                              </div>`);
                    $('#infoBusqueda').show(200);
                    setTimeout(function() {
                    $('#infoBusqueda').hide(200);
                    },  3000);

                }

          //      vistacargando();
            });

        }

        // la funcion recive el id del div donde se quier cargar el mensaje
    function mensajeCarga(contenedor,mensaje){
        $(`#${contenedor}`).hide();
        $(`#${contenedor}`).html(`
                  
                <div class="row">
                    <blockquote class="blockquote text-center" style="border: 0; margin-bottom: 10px;">
                        <div class="d-flex justify-content-center">
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <p class="text-center">
                            <strong>
                            ${mensaje}
                            </strong>
                        </p>                
                    </blockquote>                                      
                </div>                    

        `);
        $(`#${contenedor}`).show(200);
    }

     function cargartabla(){
      var id=1;
      //
               //obtenemos el numero de columnas de la tabla
             

               $.get("/aprobacionActividades/actividades/"+id+'/edit', function (resultado) {    

               $('#content_tipo_proceso').html("");
               $('#listado').removeClass('hidden');
               console.log(resultado); 
              // alert(resultado.resultado);

                    var idtabla = "datatable";
                    $(`#${idtabla}`).DataTable({
                         dom: ""
                    +"<'row' <'form-inline' <'col-sm-12 inputsearch'f>>>"
                    +"<rt>"
                    +"<'row'<'form-inline'"
                    +" <'col-sm-6 col-md-6 col-lg-6'l>"
                    +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
                    "destroy":true,
                     "order": [[ 2, "asc" ]],
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
                        columnDefs: [

                            { "width": "40%", "targets": 0 },
                            { "width": "18%", "targets": 1 },
                            { "width": "12%", "targets": 2 },
                            { "width": "10%", "targets": 3 },
                            { "width": "20%", "targets": 4 }
                        ],
                       
                        columns:[
                            {data: "descripcion"},
                           {data: "descripcion" },
                            {data: "fechaAprobacion" },
                            {data: "descripcion" },
                            {data: "descripcion" },
                            
                            
                            //{data: "tramite.asunto" }
                        ],
                        "rowCallback": function( row, data, index ){

                          if(data.usuariocreare==null){
                            $('td', row).eq(1).html("");
                          }
                          else{
                           $('td', row).eq(1).html(data.usuariocreare.name); 
                          }
                           
                           if(data.estado=='S'){ 
                           $('td', row).eq(4).html(`<center><button type="button" id="btn_${data.idactividades_prof_patente}
                            "onclick="cambioestado('${data.idactividades_prof_patente}','${data.estado}')" 
                            class="btn btn-sm btn-success marginB0"disabled><i class="fa fa-check"></i> Aprobar</button>
                            <button type="button" id="btn_${data.idactividades_prof_patente}
                            "onclick="cambioestado('${data.idactividades_prof_patente}','${data.estado}')" 
                            class="btn btn-sm btn-danger marginB0"><i class="fa fa-close"></i> Reprobar</button>
                            
                            </center>
                                `);
                           $('td', row).eq(3).html("Aprobado");
                          
                          }

                           if(data.estado=='N'){ 
                           $('td', row).eq(4).html(`<center><button type="button" id="btn_${data.idactividades_prof_patente}
                            "onclick="cambioestado('${data.idactividades_prof_patente}','${data.estado}')" 
                            class="btn btn-sm btn-success marginB0"><i class="fa fa-check"></i> Aprobar</button>
                            <button type="button" id="btn_${data.idactividades_prof_patente}
                            "onclick="cambioestado('${data.idactividades_prof_patente}','${data.estado}')" 
                            class="btn btn-sm btn-danger marginB0"disabled><i class="fa fa-close"></i> Reprobar</button>
                            </center>
                                `);
                            $('td', row).eq(3).html("No aprobado"); 
                          }
                        
                         if(data.estado=='P'){ 
                          var aprob="A";
                          var rep="R"
                           $('td', row).eq(4).html(`<center>
                            <button type="button" id="btn_${data.idactividades_prof_patente}
                            "onclick="cambioestado('${data.idactividades_prof_patente}','${aprob}')" 
                            class="btn btn-sm btn-success marginB0"><i class="fa fa-check"></i> Aprobar</button>
                            <button type="button" id="btn_${data.idactividades_prof_patente}
                            "onclick="cambioestado('${data.idactividades_prof_patente}','${rep}')" 
                            class="btn btn-sm btn-danger marginB0"><i class="fa fa-close"></i> Reprobar</button>
                            </center>
                                `);
                           $('td', row).eq(3).html("Pendiente");
                          
                          }    

                        } 

                        }); 

                        });                               
                    

     }
