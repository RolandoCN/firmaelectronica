
<!-- iCheck -->
<link href="{{asset('../vendors/iCheck/skins/flat/green.css')}}" rel="stylesheet">

<style type="text/css">

    .btn_revision{
        padding: 5px 30px;
    }

    .col_subir_doc{
        display: none;
    }
    .titulo_moda{
        font-weight: 300;
        color: #555;
        margin-top: 0px;
        margin-bottom: 32px;
        text-align: center;
        margin-left: 20px;
        margin-right: 20px;
    }
    .btn_firma{
        border-radius: 20px;
    }
    .btn_firma img{
        width: 100%;
    }
    .icon_success{
        font-size: 25px;
        color: #26ae2d;
    }
    .icon_danger{
        font-size: 25px;
        color: #db3131;
    }

    .lable_estado{
        padding: 5px;
        font-size: 14px;
        display: block;
        text-transform: none;
        font-weight: 500;
    }

    .btn_regresar{
        margin-left: 15px; margin-left: 0px; font-size: 14px; font-weight: 700; color: #446684;
    }

    /* success */
        .icon_success{
            color: #5cb85c !important;
        }
        .tile-stats:hover .icon_success i{
            color: #5cb85c !important;
        }
    /* danger */
        .icon_danger{
            color: #d9534f !important;
        }
        .tile-stats:hover .icon_danger i{
            color: #d9534f !important;
        }
    /* warning */
        .icon_warning{
            color: #ff851d !important;
        }
        .tile-stats:hover .icon_warning i{
            color: #ff851d !important;
        }
    /* ------------ */

    .tile-stats .icon{   
        top: -5px !important;         
        right: 35px;
    }

    .tile-stats .icon i{
        font-size: 50px !important;
    }

</style>

<style type="text/css">
    .check_filtro{
        background-color: transparent;
        border: 1px solid #ccc;
        padding: 8px 5px 6px 15px;
        width: 100%;
    }
    .check_filtro label{
        margin-bottom: 0px !important;
        margin-right: 10px !important;
    }
    .check_filtro .icheckbox_flat-green{
        margin-right: 8px !important;
    }

    /* estilos solo para telefonos */
    @media screen and (max-width: 767px){
        .check_filtro{
            width: 100%;
        }
    }
</style>


{{-- modal para realizar la firma electrónica del documento --}}

<div id="modal_firma_electronica" data-backdrop="static" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg ">
        <div class="modal-content">
            <div class="modal-header">
                <button id="btn_modal_cerrar" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
                <h4 class="modal-title" id="myModalLabel"><b> <span class="fa fa-file-o"></span> Firmar Documentos</b></h4>
            </div>
            <div class="modal-body">



              <div class="panel panel-success" style="display:none;" id="procesing">
                  <div class="panel-heading">
                      <div class="row">
                      <blockquote class="blockquote text-center">

                        <!--<div row="col-lg-12 col-md-12 col-sm-12 col-xs-12" >-->
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
                              ¡Generando, por favor espere..!
                              </strong>
                            </p>
                      
                      </blockquote>     
                          
                      </div>
                  </div>
                </div>
                <form id="frm_firma_electronica_titulos" method="POST" action=""  enctype="multipart/form-data" class="form-horizontal form-label-left">
                    <input type="hidden" name="_method" value="POST">
                    <input type="hidden" id="valdatorfirma" >
                   
                   
                    <div id="informacion_certificado">
                        {{-- INFORMACIÓN DEL CERTIFICADO GUARDADO --}}                            
                    </div>


                    <div class="form-group" style="margin-bottom: 0px;">                            
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for=""></label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <center><h4 style="margin-bottom: 10px;"><i><b id="titulo_firmar"><!-- titulo se carga con jquery--></b></i></h4></center>
                        </div>
                    </div>
                    
                    <div id="content_archivo_certificado" class="form-group" style="margin-bottom: 0px;">                            
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Archivo:</label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <div class="input-prepend input-group">
                                <label  title="No seleccionado" class=" control-label btn btn-primary btn-upload add-on input-group-addon" for="archivo_certificado">                            
                                    <input name="archivo_certificado" id="archivo_certificado" class="seleccionar_archivo sr-only" type="file" accept="" >                                    
                                    <span class="fa fa-upload"></span>
                                </label>
                                <input id="text_archivo_certificado" class="form-control" type="text" value="No seleccionado" style="pointer-events: none;">
                            </div> 
                        </div>
                    </div>                            

                   
                    <div id="content_clave_certificado" class="form-group">                            
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Contraseña:</label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <input id="input_clave_certificado" name="clave_certificado" class="form-control" type="password" value="">                        
                        </div>
                    </div>


                    <div id="content_clave_certificado" class="form-group" style="margin-bottom: 20px;">                            
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Razon:</label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <input id="input_razon" name="input_razon" class="form-control" type="text" value="">                        
                        </div>
                    </div>

                    <div id="content_clave_certificado" class="form-group" style="margin-bottom: 20px;">                            
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Localizacion:</label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <input id="input_localizacion" name="input_localizacion" class="form-control" type="text" value="">                        
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for=""></label>
                        <div class="col-md-8 col-sm-8 col-xs-12 ">
                            <div class="check_filtro">
                                <label class="" for="check_filtrar_visible" style="user-select: none;">
                                    <input type="checkbox" id="check_filtrar_visible" checked name="check_filtrar_visible" class="flat"> <strong class="no_selecionar">Firma Visible</strong>
                                </label>
                            </div>
                        </div>
                    </div>

                    
                    <div class="contet_documento_selec"> <!-- contenido se carga con jquery --> </div>

                    <div class="modal-footer"> 
                        <center>
                            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-mail-reply-all"></i> Salir</button>  
                            <button id="btnFirmaElectronica" onclick="realizar_firma()" type="button" class="btn btn-success"><i class="fa fa-pencil"></i> Firmar Documentos </button> 
                            
                            <button type="button" onclick="configurar_firma()"class="btn btn-primary"><i class="fa fa-edit"></i> Configurar </button> 

                        </center>               
                    </div>

                </form>

                {{-- <form id="frm_configurar" style="display: none"method="POST" action=""  enctype="multipart/form-data" class="form-horizontal form-label-left">
                    <input type="hidden" name="_method" value="POST">
                   


                    <div id="content_raz" class="form-group" style="margin-bottom: 20px;">                            
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">X:</label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <input id="valorx" name="valorX" class="form-control" type="text" value="">                        
                        </div>
                    </div>

                    <div id="content_2" class="form-group" style="margin-bottom: 20px;">                            
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for="">Y:</label>
                        <div class="col-md-8 col-sm-8 col-xs-12">
                            <input id="input_localizacion" name="input_localizacion" class="form-control" type="text" value="">                        
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2 col-sm-2 col-xs-12" for=""></label>
                        <div class="col-md-8 col-sm-8 col-xs-12 ">
                            <div class="check_filtro">
                                <label class="" for="check_filtrar_visible" style="user-select: none;">
                                    <input type="checkbox" id="check_filtrar_visible" checked name="check_filtrar_visible" class="flat"> <strong class="no_selecionar">Firma Visible</strong>
                                </label>
                            </div>
                        </div>
                    </div>

                    
                 

                    <div class="modal-footer"> 
                        <center>
                            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-mail-reply-all"></i> Salir</button>  
                            <button id="btnFirmaElectronica" type="submit" class="btn btn-success"><i class="fa fa-pencil"></i> Firmar Documentos </button> 
                            
                            <button type="button" class="btn btn-primary"><i class="fa fa-edit"></i> Configurar </button> 

                        </center>               
                    </div>

                </form> --}}


                <div id="catn_emisiones_generadas" class="form-horizontal form-label-left" >

                    <div class="form-group infoDepFlujGen content_info_certificado" style="margin-bottom: 0px; margin-top: 16px; margin-bottom: 26px;">
                        <label class="control-label col-md-1 col-sm-1 col-xs-12"></label>
                        <div class="col-md-10 col-sm-10 col-xs-12">
                            <div class="tile-stats" style="margin-bottom: 0px; border-color: #cccccc;">
                                <div class="icon" style="font-size: 25px;"><i class="fa fa-file-pdf-o"></i></div>
                                <div class="count icon_success" style="font-size: 20px; margin-top: 5px;">
                                    <i class="fa fa-check-square"></i> Proceso Finalizado
                                </div>                    
                                <p style="margin-top: 10px; font-size: 17px;"><b><i class="fa fa-info-circle"></i> INFORMACIÓN FINAL DEL PROCESO</b></p>
                                <p style="margin-top: 0px; font-size: 17px;">
                                    <b>Total a Generar:</b> <span id="cantXgenerar" style="font-weight: bold"> 50</span><br>
                                    <b>Documentos Firmados:</b> <span id="cantGeneradas" style="font-weight: bold"> 50</span>
                                </p> 
                                                                                                               
                            </div>                                                             
                        </div>
                    </div>

                    <div class="modal-footer"> 
                        <center>
                            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-mail-reply-all"></i> Salir</button> 
                            <span id="btn_documento_firmado"></span>                                                     
                        </center>               
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- iCheck -->
<script src="http://localhost:8000/vendors/iCheck/icheck.min.js"></script>