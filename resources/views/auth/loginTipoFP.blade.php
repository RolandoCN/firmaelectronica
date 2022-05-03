<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Sistema Intranet</title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="{{ asset('/vendors/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet">
    {{-- nuevos estilos de boostrap botones --}}
    <link rel="stylesheet" href="{{asset('/css/nuevosEstilosBootstrap4.css')}}">
    {{-- estilos para login y selecicon de tipo fp--}}
    <link rel="stylesheet" href="{{asset('/css/estilosLoginTipoFP.css')}}">
     <link rel="shortcut icon" href="/logotitulo.ico" />

  </head>

  <body class="login">
    <div class="full-page-background-1">
    <div class="full-page-background-2">
      <a class="hiddenanchor" id="signup"></a>
      <a class="hiddenanchor" id="signin"></a>

      <div class="login_wrapper">
        <div class="animate form login_form" style="margin-top: 15%;">
          <section class="login_content contenedorSelecTipoFP">
              <center>
                <div class="contenAvatar">
                    @guest
                          <img src="{{asset('/images/img.jpg')}}" alt="">
                    @else
                      @if(Auth::user()->sexo=="M")
                          <img src="{{asset('/images/user.png')}}" alt="">
                      @elseif(Auth::user()->sexo=="F")
                          <img  src="{{asset('/images/user_fem.png')}}" alt="">
                      @else
                          <img src="{{asset('/images/negocio.png')}}" alt="">
                      @endif
                    @endguest
                </div>
              </center>
             <form class="form-horizontal" method="POST" action="{{ route('seleccionarTipoFP') }}">
                {{ csrf_field() }}

                <h4>
                  <span class="border-nombre-user">
                    @guest
                      <span class="nombre-user">No logueado (este texto no se muestra</span>
                    @else
                      <span class="nombre-user">{{auth()->user()->name}}</span>
                    @endguest
                    
                  </span>
                </h4>

                <div class="form-group comboTipoFP">
                  <label class="control-label col-md-1 col-sm-1 col-xs-12"></label>
                  <div class="col-md-10 col-sm-10 col-xs-12">
                    <select class="form-control" name="cmb_seleccionarTipoFP" id="cmb_seleccionarTipoFP"  required="required" style="margin-bottom: 6px">
                      <option value="" selected disabled="true">Seleccione un Tipo</option>
                      @isset($listatipoFPasignados)
                          @if(userEsTipo('ADFP'))
                            <option data-id="sel_0" value="{{encrypt(0)}}">Administrador</option>
                          @endif
                          @foreach ($listatipoFPasignados as $tipoFPasignado)
                              <option data-id="sel_{{$tipoFPasignado->idus001_tipofp}}" value="{{encrypt($tipoFPasignado->tipofp->idtipoFP)}}">
                                {{$tipoFPasignado->tipofp->descripcion}}
                              </option>
                          @endforeach
                      @endisset                      
                    </select>

                    <div style="color: #3b3b3b; font-size: 12px;">
                      @isset($listatipoFPasignados)
                        @foreach ($listatipoFPasignados as $tipoFPasignado)
                          <span id="sel_{{$tipoFPasignado->idus001_tipofp}}" class="depa_tipofp" style="display: none;">
                            <i class="fa fa-university"></i> {{$tipoFPasignado->departamento->nombre}}
                          </span>
                        @endforeach
                      @endisset                 
                    </div>
                    
                  </div>
                  <label class="control-label col-md-1 col-sm-1 col-xs-12"></label>
                </div>
      
                


                <div>
                  <button type="submit" class="btn btn-outline-primary submit"><i class="fa fa-sign-in"></i> Continuar</button>
                </div>

              <div class="clearfix"></div>

              <div class="separator">
                <div class="clearfix"></div><br/>
                <div>
                  <i class="fa fa-file-text-o" style="font-size: 20px; margin-right: 5px;"></i> Sistema Intranet Chone
                  <p>©2019 Todos los derechos Reservados</p>
                </div>
              </div>

            </form>
          </section>
        </div>

        <div id="register" class="animate form registration_form">
          <section class="login_content">
            
          </section>
        </div>
      </div>
    </div>
    
    </div>

    <!-- jQuery -->
    <script src="../vendors/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="../vendors/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- Custom Theme Scripts -->
    <script src="../build/js/custom.min.js"></script>

    <script type="text/javascript">
      $("#cmb_seleccionarTipoFP").change(function (e) { 
          var id_depa = $("#cmb_seleccionarTipoFP option:selected").attr('data-id');
          $(".depa_tipofp").hide();
          $(`#${id_depa}`).show();
      });
    </script>

  </body>
</html>

