
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="{{asset('images/logotitulo.ico')}}" type="image/png">

    <title>Sistema Intranet</title>

    <!-- Bootstrap -->
      <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
      <link href="{{ asset('/vendors/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet">
    <!-- NProgress -->
      <link href="{{ asset('/vendors/nprogress/nprogress.css') }}" rel="stylesheet">
    <!-- jQuery custom content scroller -->
      <link href="{{ asset('/vendors/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css') }}" rel="stylesheet">
    <!-- Custom Theme Style -->
      <link rel="stylesheet" href="{{asset('/css/nuevosEstilosBootstrap4.css')}}">
      <link href="{{ asset('/build/css/custom.min.css') }}" rel="stylesheet">
    <!-- estilo para modulo registro  -->
      <link href="{{ asset('/css/documental/estilosRegistrar.css') }}" rel="stylesheet">
      <link href="{{ asset('/css/documental/estilosGenerales.css') }}" rel="stylesheet">
      <link href="{{ asset('/css/iconosdecarga.css') }}" rel="stylesheet">
      <link href="{{ asset('/css/documental/estilosGestionPermisos.css') }}" rel="stylesheet">

    <!-- Librerias para Sweet Alert -->
      <link rel="stylesheet" href="{{asset('sweetalert/sweetalert.css')}}">
    
    <!-- PNotify -->
      <link href="{{asset('vendors/pnotify/dist/pnotify.css')}}" rel="stylesheet">
      <link href="{{asset('vendors/pnotify/dist/pnotify.buttons.css')}}" rel="stylesheet">
      <link href="{{asset('vendors/pnotify/dist/pnotify.nonblock.css')}}" rel="stylesheet">
    {{-- fin --}}

    <style type="text/css">
      .input_menu_buscar{
          width: -webkit-fill-available !important; 
          margin: 0px 5px !important; 
          height: 25px !important; 
          border: 1px solid #374850 !important; 
          border-radius: 4px !important;
      }
    </style>

    {{-- estilos para el spinner de cargando --}}
      <link rel="stylesheet" href="{{asset('css/spinners.css')}}">


  </head>

  <body class="nav-md footer_fixed">
    <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col">
          <div class="left_col scroll-view">
            <div class="navbar nav_title" style="border: 0;">
              <a href="#" class="site_title">

                <img src=" {{asset('images/logo-icon.png')}}" width="25%">
                @guest
                  <img class="imagen_nav soloMobil" src="{{asset('/images/img.jpg')}}" alt="">
                @else
                  @if(Auth::user()->sexo=="M")
                      <img class="imagen_nav soloMobil" src="{{asset('/images/user.png')}}" alt="">
                  @elseif(Auth::user()->sexo=="F")
                      <img class="imagen_nav soloMobil" src="{{asset('/images/user_fem.png')}}" alt="">
                  @else
                      <img class="imagen_nav soloMobil" src="{{asset('/images/negocio.png')}}" alt="">
                  @endif
                @endguest
                
                <span  style="font-size: 14px">Sistema Intranet</span>
              </a>
            </div>

            <div class="clearfix"></div>

            {{-- variable para comparar --}}
            @php
                $departamentoLogueado = departamentoLogueado();
            @endphp

            <!-- menu profile quick informacion -->
            <div class="profile clearfix">
              <div class="profile_pic" style="width: 30%;">
                 @guest
                  <img class="imagen_nav soloMobil" src="{{asset('/images/img.jpg')}}" alt="">
                @else
                  @if(Auth::user()->sexo=="M")
                      <img class="img-circle profile_img" src="{{asset('/images/user.png')}}" alt="">
                  @elseif(Auth::user()->sexo=="F")
                      <img class="img-circle profile_img" src="{{asset('/images/user_fem.png')}}" alt="">
                  @else
                      <img class="img-circle profile_img" src="{{asset('/images/negocio.png')}}" alt="">
                  @endif
                @endguest
              </div>
              <div class="profile_info" style="width: 70%; padding-left:0 !important;">
                {{-- <span>Bienvenido</span> --}}
                @guest
                  <span>Bienvenido</span>
                  <h2><a href=" {{route('login')}}" > <strong>Iniciar Sesión</strong></a></h2>
                @else                  
                  {{-- <h2 class="nameMenu">{{ Auth::user()->name }}</h2> --}}
                  <h2 class="tipoFPMenu">{{$departamentoLogueado["tipoFP"]}}</h2>
                @endguest
              </div>
            </div>
            <!-- /menu profile quick info -->

            <br/>
            <!-- sidebar menu -->
            <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
              <div class="menu_section">
                @if($departamentoLogueado["iddepartamento"]==0)                    
                  <input type="text" id="input_menu_buscar" class="form-control input_menu_buscar" placeholder="Buscar...">
                @else
                  <h3>{{$departamentoLogueado["departamento"]}} </h3>
                @endif
                <ul class="nav side-menu" id="ul_listarMenu">

                    <li><a href="{{asset('/')}}"><i class="fa fa-home"></i> Inicio </span></a></li>

                    @foreach(listarMenuSession() as $menu)
                        <li>
                          <a class="span_menu">
                            <i class="{{$menu->icono}}"></i>{{$menu->nombremenu}} <span class="fa fa-chevron-down"></span>
                            <span style="display: none;">{{strtolower($menu->nombremenu)}}</span>
                          </a>
                          <ul class="nav child_menu">
                            @foreach($menu->gestion as $gestion)
                              <li>
                                <a class="submenu_a span_gestion" href="{{url($gestion->ruta)}}">
                                  <i style="font-size: 12px; width: 18px;"  class="{{$gestion->icono}} i_submenu"></i>
                                  <span>{{$gestion->nombregestion}}</span><span style="display: none;">{{strtolower($gestion->nombregestion)}}</span>
                                </a>
                              </li>
                            @endforeach
                          </ul>
                        </li>
                    @endforeach

                </ul>
              </div>

            </div>
            <!-- /sidebar menu -->

            <!-- /menu footer buttons -->
            <div class="sidebar-footer hidden-small">
              <a data-toggle="tooltip" data-placement="top" title="Settings">
                <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
              </a>
              <a data-toggle="tooltip" data-placement="top" title="FullScreen">
                <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
              </a>
              <a data-toggle="tooltip" data-placement="top" title="Lock">
                <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
              </a>

              <a data-toggle="tooltip" data-placement="top" title="Cerrar Sesión" href="{{ route('logout') }}"
                  onclick="event.preventDefault();
                           document.getElementById('logout-form').submit();">
               <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
              </a>

            </div>
            <!-- /menu footer buttons -->
          </div>
        </div>

        <!-- top navigation -->
        <div class="top_nav">
          <div class="nav_menu">
            <nav>
              <div class="nav toggle" style="width: auto;">
                <a id="menu_toggle"><i class="fa fa-bars"></i></a>
              </div>

              <ul class="nav navbar-nav navbar-right" style="width: 80%;">

                @guest

                    <li class="li_nav_name_mobil">
                      <a href="{{route('login')}}" style="float:right; text-align: right; height: inherit;" class="user-profile dropdown-toggle" style="text-align: right;">
                        <img src="{{asset('/images/img.jpg')}}" alt="">
                        Iniciar Sesión
    <!--                     <span class=" fa fa-angle-down"></span> -->
                      </a>
                    </li>

                @else

                    <li class="li_nav_name_mobil">
                      <a href="javascript:;" style="float:right; text-align: right;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <div style="float:left;" class="soloEscritorio">                        
                            @if(Auth::user()->sexo=="M")
                                <img src="{{asset('images/user.png')}}" alt="">
                            @elseif(Auth::user()->sexo=="F")
                                <img src="{{asset('images/user_fem.png')}}" alt="">
                            @else
                                <img src="{{asset('images/negocio.png')}}" alt="">
                            @endif
                        </div>
                        <div style="float:right;" class="div_nav_name_mobil">{{ Auth::user()->name }} <span class=" fa fa-angle-down"></span></div>
                        
                      </a>
                      <ul class="dropdown-menu dropdown-usermenu pull-right">
                        <li><a onclick="$('#Perfil_ModalFP').modal();"><i class="fa fa-user pull-right"></i>Ver Perfil</a></li>
                        <li><a onclick="$('#Cambio_Contraseña_Modal').modal();"><i class="fa fa-key pull-right"></i>Cambiar Contraseña</a></li>

                        @php
                            $usuarioTieneVariosRoles = usuarioTieneVariosRoles();
                        @endphp

                        @if($usuarioTieneVariosRoles->status == true)                            

                            <li><a><i class="fa fa-group pull-right"></i>Cambiar Tipo FP</a>
                              <ul class="nav nav_rol child_menu" style="display: block;">

                                @if(userEsTipo('ADFP'))
                                  <li class="sub_men">
                                      @if($departamentoLogueado["tipoFP"] == "Sin Tipo")  
                                        <a onclick="cambiarTipoFp(this, false)" style="color: #00a65a;">Administrador<b><i style="padding-left: 5px;" class="fa fa-check-circle"></i></b></a>
                                      @else
                                        <a onclick="cambiarTipoFp(this, true)" style="color: #5A738E;">Administrador</a>
                                      @endif                      

                                      <form class="form-horizontal form_cambiar_rol" method="POST" action="{{ route('seleccionarTipoFP') }}">
                                        {{ csrf_field() }}
                                        <input type="hidden" name="cmb_seleccionarTipoFP" value="{{encrypt(0)}}">
                                      </form>
                                  </li>
                                @endif                  

                                @foreach ($usuarioTieneVariosRoles->listatipoFPasignados as $tipoFPasignado)
                               
                                  <li class="sub_menu" data-toggle="tooltip" data-placement="left" title="{{$tipoFPasignado->departamento->nombre}}">
                                    @if($departamentoLogueado["tipoFP"] == $tipoFPasignado->tipofp->descripcion)  
                                      <a onclick="cambiarTipoFp(this, false)" style="color: #00a65a;">{{$tipoFPasignado->tipofp->descripcion}} <b><i style="padding-left: 5px;" class="fa fa-check-circle"></i></b></a>
                                    @else
                                      <a onclick="cambiarTipoFp(this, true)" style="color: #5A738E;">{{$tipoFPasignado->tipofp->descripcion}}</a>
                                    @endif                      

                                    <form class="form-horizontal form_cambiar_rol" method="POST" action="{{ route('seleccionarTipoFP') }}">
                                      {{ csrf_field() }}
                                      <input type="hidden" name="cmb_seleccionarTipoFP" value="{{encrypt($tipoFPasignado->tipofp->idtipoFP)}}">
                                    </form>
                                  </li>
                                
                                @endforeach
                                
                              </ul>
                            </li>

                        @endif
                        <li>
                            <a  href="{{ route('logout') }}"
                                onclick="event.preventDefault();
                                        document.getElementById('logout-form').submit();">
                                <i class="fa fa-sign-out pull-right"></i>Cerrar Sesión 
                            </a>

                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                {{ csrf_field() }}
                            </form>
                        </li>
                      </ul>
                    </li>

                @endguest

                
                @if(!auth()->guest())
                  <li role="presentation" class="dropdown li_nav_notif_mobil">
                    <a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false">
                      <i style="font-size: x-large;" class="fa fa-inbox"></i>
                      <span id="numNotificaciones" class="badge bg-green" style="display: none;">0</span>
                    </a>
                    <ul id="notificacion_tramites" class="dropdown-menu list-unstyled msg_list" role="menu" style="">

                    </ul>
                  </li>                    
                @endif

              </ul>
            </nav>
          </div>

        </div>
        <!-- /top navigation -->

        <!-- page content -->
         <!-- jQuery -->
        <script src="{{ asset('../vendors/jquery/dist/jquery.min.js') }}"></script>
        {{-- Archivo de config inicio --}}
        <script src="{{ asset('/js/TramiteDepartamental/cargarInicio.js?v=0.1')}}"></script>

        <div id="main_content" class="right_col" role="main">
                @yield('contenido')
        </div>
        @if(!auth()->guest())
          @include('auth.modalperfil')
          @include('auth.modalCambioContraseña')
        @endif

      </div>
    </div>
    <div class="modal fade" id="modalvideo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <span style="font-size: 150%; color: green" class="fa fa-edit"></span> <label class="modal-title" style="font-size: 130%; color: black ;">Información</label>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                </div>
              

              <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 profile_details text-center">
                          <p style="color:red; font-size: 18px"><b id="detalle_informacion"></b></p>
                              <div id="conten_video">
                                <!-- <video src="/videosSoporte/202102181613684433.mp4"  width=320  height=240 controls></video> -->
                              </div>
                              <hr>
                              <div id="conten_guia">
                              </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"> 
                    <center>
                          <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-mail-reply-all"></i> Salir</button>  
                                                          
                    </center>               
                </div>
      </div>
    </div>


</div>
    {{-- para almecenar los parametros generales --}}
    <input type="hidden" id="inputJsonParaetrosGenerales" data-field-id="{{parametros_generales()}}">
   
    <!-- Bootstrap -->
     <script src="{{ asset('../vendors/bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <!-- FastClick -->
     <script src="{{ asset('../vendors/fastclick/lib/fastclick.js') }}"></script>
    <!-- NProgress -->
     <script src="{{ asset('../vendors/nprogress/nprogress.js') }}"></script>
    <!-- jQuery custom content scroller -->
     <script src="{{ asset('../vendors/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js') }}"></script>
    <!-- Custom Theme Scripts -->
     <script src="{{ asset('../build/js/custom.min.js') }}"></script>
    <!-- libreria par cambiar el tipo de fp (rol de usuario) -->
      <script src="{{asset('js/TramiteDepartamental/cambiarTipoFP.js')}}"></script>

    {{-- Libreria para usar el combo filter --}}
      <link href="{{ asset('/css/bootstrap_combofilter.css') }}" rel="stylesheet">
      <script src="{{ asset('/css/chosen.jquery.js') }}"></script>
      <script>
          $(function() {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: false });
          });
      </script>

      <script>
        $(function() {
          $('.chosen-select').chosen();
          $('.chosen-select-deselect').chosen({ allow_single_deselect: false });
        });
      </script>
      @php 
        $estado=0; $urlvideo=''; $soporte=null;
      @endphp

      @php 
        $rutaactual=\Request::route()->uri;
        $rutaactual2='/'.$rutaactual;
        $soporte=\App\SoporteVideosModel::with('gestion')->whereHas('gestion',function($query) use($rutaactual,$rutaactual2){
                      $query->where('ruta',$rutaactual)->orwhere('ruta',$rutaactual2);
                    })->where('estadovisualizacion','1')->first();
        if($soporte!=null){
            if(!isset($_SESSION['a'.$soporte->idsoporte_videos])){
              $_SESSION['a'.$soporte->idsoporte_videos]='true';
              $estado=1;
              $urlvideo=$soporte->rutavideo;
            }
        }

      @endphp
      <script type="text/javascript">
        $(document).ready(function() {
          @if($estado==1)
            @if($soporte->extension=='png' || $soporte->extension=='jpg')
              $('#detalle_informacion').html('{{$soporte->descripcion}}')
              $('#conten_video').html(`<img src="/videosSoporte/{{$urlvideo}}" width=100% ></img>`);
              @if($soporte->visualizar_guia!=0)
                $('#conten_guia').html(`<a href="/buscarDocumentoDownload/diskVideoSoporte/{{$soporte->guia}}" type="button" class="btn btn-sm btn-primary" > <i class="fa fa-download"></i> Descargar guía PDF</a>`);
              @endif
              $('#modalvideo').modal();
            @else        
              $('#detalle_informacion').html('{{$soporte->descripcion}}')    
              $('#conten_video').html(`<video src="/videosSoporte/{{$urlvideo}}" width=80% controls></video>`);
              @if($soporte->visualizar_guia!=0)
                $('#conten_guia').html(`<a href="/buscarDocumentoDownload/diskVideoSoporte/{{$soporte->guia}}" type="button" class="btn btn-sm btn-primary" > <i class="fa fa-download"></i> Descargar guía PDF</a>`);
              @endif
              $('#modalvideo').modal();
            @endif
          @endif
        });
      </script>

  
  
    </div>
      <!-- Librerias para Sweet Alert -->
        <script src="{{asset('sweetalert/sweetalert.js')}}"></script>

      <!-- PNotify -->
        <script src="{{asset('vendors/pnotify/dist/pnotify.js')}}"></script>
        <script src="{{asset('vendors/pnotify/dist/pnotify.buttons.js')}}"></script>
      {{-- FIN --}}

      @include('divcargando')
  </body>
</html>