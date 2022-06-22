@extends('layouts.service')
@section('contenido')
    <link href="../vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet">
        <!-- bootstrap-progressbar -->
    <link href="../vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">
    <script src="../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js"></script>
    <link href="{{asset('../vendors/iCheck/skins/flat/green.css')}}" rel="stylesheet">

    <div class="row">
        <div class="col-md-12">
            <div class="title_left">
            </div>
            <br>
        </div>
    </div>

   
    @if(Session::has('error'))
        <input type="hidden" name="error" id="error" value="{{session('mensajePInfoDocumento')}}" >
    @endif

    @if(Session::has('correcto'))  
        <input type="hidden" name="correcto" id="correcto_" value="{{session('mensajePInfoDocumento')}}" >
    @endif

    <div class="clearfix"></div>

    <div class="" >
        <div class="x_panel">
            <div class="x_title">
            <h2><i class="fa fa-bars"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font> <b>FIRMA DE DOCUMENTOS</b></font></h2>
            <ul class="nav navbar-right panel_toolbox">
                <li style="float: right;"><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>
            </ul>
            <div class="clearfix"></div>
            </div>
            <div class="x_content x_content_border_mobil" >
                    <div class="row">
                        <div class="col-md-3 col-sm-3 col-xs-12"></div>
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <div style="display: none"  id="infoBusqueda"></div>
                        </div>
                        <!-- <div class="col-md-4 col-sm-4 col-xs-12"></div> -->
                    </div>
                  

                    <div id="panelEmisiones" class="x_panel " >
                        <div class="x_title ">
                            <h2><i class="fa fa-file-o"></i><font style="vertical-align: inherit;"> <b>LISTA DE DOCUMENTOS</b></font></font></h2>
                            <ul class="nav navbar-right panel_toolbox">
                                <li style="float: right;"><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>
                            </ul>
                            <div class="clearfix"></div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-12 col-sm-12" align="center">
                                <button type="button" class="btn btn-default" style="display: none" id="btnSeleccionar" onclick="seleccionarTodos()"> <span class="fa fa-check"></span> Seleccionar Todos</button>
                                <button type="button" onclick="firmarEmisiones()" class="btn btn-success"><span class="fa fa-file-o"></span> Firmar Documentos</button>
                                <button type="button" class="btn btn-primary" id="btnSub" onclick="subirNuevoArchivo()"> <span class="fa fa-check"></span> Nuevo Documento</button>
                                <button type="button" class="btn btn-warning" style="display: none" id="btnEliminar" onclick="eliminarArchivo()"> <span class="fa fa-trash"></span> Eliminar</button>

                            </div>
                   
                        </div>
                        
                        <div   class=" x_content_border_mobil ">
                            <div  style="color: black; display: block; font-size: 12px;  " id="bodyemisiones" >
                                <div class="table-responsive">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <table style="color: black"  id="TablaDocumentos" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
                                                <thead>
                                                    <tr role="row">
                                                        <th class="sorting_desc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" aria-sort="descending" >#</th> 
                                                        <th style="text-align: center" class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" > Seleccionar</th>
                                                        <th style="text-align: center" class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1"  aria-label="Office: activate to sort column ascending" style="width: 10px;"> Descripcion</th>
                                                        <th style="text-align: center" class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 10px;">Documento</th>

                                                        <th style="text-align: center" class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 10px;"></th>
                                                        
                                                    </tr>
                                                </thead>

                                                <tbody id="tb_listaDocumento">
                                                   
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>                      
                            </div>

                        </div>
                    </div>  
                   
                    <!-- </form> -->
            </div>
        </div>
    </div>
    @include('firmarDocumentos.modalFirma')
    @include('firmarDocumentos.modalDocumento')

    

    <div class="modal fade" id="nuevoDoc_modal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
         
                <div class="modal-body">
                <span style="font-size: 150%; color: green" class="fa fa-list"></span> <label id="titulo" class="modal-title" style="font-size: 130%; color: black ;">NUEVO DOCUMENTO</label>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span style="font-size: 35px"aria-hidden="true">&times;</span>
                    </button>
                        <div class="">
                            
                            <br>
                            <div class="row">
                                <form id="frm_NuevoDoc" autocomplete="off" onsubmit="return validarFormNew()" method="POST" action="{{url('/firmaArchivo/nuevoDocumento')}}" enctype="multipart/form-data"  class="form-horizontal form-label-left">
                                    {{csrf_field() }}
                                    <input id="method_NuevoDoc" type="hidden" name="_method" value="POST">
                                    <input type="hidden" name="iddocumento" id="iddocumento">
                                    
                                    <div class="form-group">
                                        <label for="tipo_reb_exo_id" class="col-sm-2 control-label">Descripcion</label>
                                        <div class="col-sm-10">
                                            <input type="text" name="descripcion"  id="descripcion" class="form-control">
                                        </div>
                                    </div> 
        
                                    <div class="form-group">
                                        <label for="tipo_reb_exo_id" class="col-sm-2 control-label">Archivo</label>
                                        <div class="col-sm-10">
                                            <input type="file" name="archivo" id="archivo"  class="form-control"  accept="application/pdf">
                                        </div>
                                    </div> 
        
        
                                    <div id="emisiones_in_otro"></div>                             
                                
                                    <div class="form-group">
                                        <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                            <center>
                                                <button type="submit"  id="btn_otra"class="btn btn-info">Guardar</button>
                                            </center>
                                        </div>
                                    </div>
                                    <div class="ln_solid"></div>
        
                                </form>
                            </div>
                        </div>   
                </div>
    
            </div>
        </div>
    </div>
  
    <!-- Datatables -->
    <script src="../vendors/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="../vendors/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
    <link href="{{ asset('/css/spinners.css') }}" rel="stylesheet">
    <script src="{{asset('js/firmaDocumento/firmaDocumento.js?v=0.2')}}"></script>
    <script>
        $('.collapse-link').click();
        $('.datatable_wrapper').children('.row').css('overflow','inherit !important');
        $('.table-responsive').css({'padding-top':'12px','padding-bottom':'12px', 'border':'0','overflow-x':'inherit'});
    </script>
@endsection

















