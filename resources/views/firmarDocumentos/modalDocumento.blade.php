
    <div class="modal fade" id="documentopdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
   
                <div class="modal-body">

                    <span style="font-size: 150%; color: green" class="fa fa-file"></span> <label id="titulo" class="modal-title" style="font-size: 130%; color: black ;">Documento</label>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span style="font-size: 35px"aria-hidden="true">&times;</span>
                    </button>
                    <br><br>
                    <div class="row">

                        <div class="col-sm-12 col-xs-11 "style="height: auto " >
                            <iframe width="100%" height="500"  frameborder="0"id="iframePdf">

        
                            </iframe>
                            <p style="color: #747373;font-size:15px"></p>
                        </div>
                    </div>
                  
             
                </div>

                <div class="modal-footer"> 
                    <div id="btn_documento"></div>
                                    
                </div>
            </div>
        </div>
    </div>

    
    <div class="modal fade" id="config_pdf"  data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
   
                <div class="modal-body">

                    <span style="font-size: 150%; color: green" class="fa fa-file"></span> <label id="titulo" class="modal-title" style="font-size: 130%; color: black ;">Documento</label>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span style="font-size: 35px"aria-hidden="true">&times;</span>
                    </button>
                    <br><br>
                    <div class="row">
                        <div id="form_conf">
                            <form id="frm_configuracion" method="POST" autocomplete="off" action=""  enctype="multipart/form-data" class="form-horizontal form-label-left">

                                
                                {{-- <div class="contet_documento_selec"> <!-- contenido se carga con jquery --> </div> --}}
                                <input id="documnento_id_conf" type="hidden" name="documnento_id_conf">
                                <div id="content_clave_certificado" class="form-group" style="margin-bottom: 20px;">                            
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Formato:</label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <select data-placeholder="Seleccione Un Formato" style="width: 100%;" class="form-control select2" id="formato" name="formato" >  
                                            <option value="" class="class_formato">Selecccione un formato</option>                                      
                                            <option value="A4" class="class_formato">A4</option>
                                            <option value="A5" class="class_formato">A5</option>
                                            <option value="A3" class="class_formato">A3</option>
                                        </select>                     
                                    </div>
                                </div>   

                                <div id="content_clave_certificado" class="form-group" style="margin-bottom: 20px;">                            
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Orientación:</label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <select data-placeholder="Seleccione Un Orientación" style="width: 100%;" class="form-control select2" id="orientacion" name="orientacion" >  
                                            <option value=""class="class_orientacion">Selecccione una orientación</option>      
                                            <option value="V" class="class_orientacion">Vertical</option>                                
                                            <option value="H"class="class_orientacion">Horizontal</option>
                                           
                                        </select>                     
                                    </div>
                                </div> 

                                <div id="content_clave_certificado" class="form-group" style="margin-bottom: 20px;">                            
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Página:</label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <select data-placeholder="Seleccione La Pagina" onchange="pagina_seleccionada()" style="width: 100%;" class="form-control select2" id="pagina" name="pagina" >  
                                            <option value=""class="class_pagina">Selecccione una página</option>                                     
                                            <option value="P" class="class_pagina">Primera</option>
                                            <option value="U" class="class_pagina">Ultima</option>
                                            <option value="O" class="class_pagina">Otra</option>
                                        </select>                     
                                    </div>
                                </div>   

                                <div id="content_X" class="form-group pagina_firma" style="margin-bottom: 20px;display:none">                            
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Página:</label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <input id="num_pag" name="num_pag" class="form-control" type="number" value="">                        
                                    </div>
                                </div>


                                <div id="content_X" class="form-group" style="margin-bottom: 20px;">                            
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">X:</label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <input id="x" name="x" class="form-control" type="number" value="">                        
                                    </div>
                                </div>
            
                                <div id="content_clave_certificado" class="form-group" style="margin-bottom: 20px;">                            
                                    <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Y:</label>
                                    <div class="col-md-8 col-sm-8 col-xs-12">
                                        <input id="y" name="y" class="form-control" type="number" value="">                        
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div class="col-sm-12 col-xs-11 "style="height: auto; display:none " id="visualizar_conf" >
                            <iframe width="100%" height="500"  frameborder="0"id="iframePdfConf">

        
                            </iframe>
                            <p style="color: #747373;font-size:15px"></p>
                        </div>
                    </div>
                  
             
                </div>

                <div class="modal-footer"> 
                    
                    <center>
                        <button type="button" onclick="simular()" class="btn btn-success configurar_test">Comprobar</button>
                        <button type="button" data-dismiss="modal" class="btn btn-danger configurar_test">Regresar</button>
                        <button type="button" id="atras" style="display: none" onclick="atras_conf()" class="btn btn-danger">Regresar</button>
                    </center>
                                    
                </div>
            </div>
        </div>
    </div>