<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="{{asset('images/logotitulo.ico')}}" type="image/png">

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
    <link rel="stylesheet" href="{{asset('/css/documental/estilosLoginTipoFP.css')}}">

    <style type="text/css">
      .mensaje_formato_clave{
        line-height: 1;
        font-size: 11px;
        padding-top: 5px;
        color: #f90a1bc4;
        margin-bottom: 0px;
        display: none;
      }
    </style>

  </head>

  <body class="login">
    <div class="full-page-background-1">
    <div class="full-page-background-2">
      <a class="hiddenanchor" id="signup"></a>
      <a class="hiddenanchor" id="signin"></a>

      <div class="login_wrapper">
        <div class="animate form login_form" style="margin-top: 15%;">
          <section class="login_content contenedorSelecTipoFP">
              <br><br>
              @if(isset($cambioExitoso))
                  <div class="form-horizontal">
                    <h4>
                      <span class="border-nombre-user" style="padding: 20px 7px 20px 7px; margin: 0px 5px 0px 5px;">                    
                          <span class="nombre-user" style="line-height: 1.3;">La contraseña se cambió con exito</span>
                          <br>
                          <i class="fa fa-check-circle" style="font-size: 70px; color: #178e32"></i>                                   
                      </span>
                    </h4>                    
                  </div>
                  <br>
                  <a href="{{route('login')}}" class="btn btn-outline-success" style="text-decoration: none"><i class="fa fa-sign-in"></i> Iniciar Sesión</a>
                  <br><br> 
              @else
              {{-- FORMULARIO PARA REALIZAR EL CAMBIO DE CONTRASEÑA --}}
                <form class="form-horizontal" method="POST" action="{{ route('restaurarContrasenia') }}">
                    {{ csrf_field() }}
                    @isset($email_token)
                      <input type="hidden" name="email_token" value="{{encrypt($email_token)}}">
                    @endisset
                    <h4>
                      <span class="border-nombre-user">                    
                          <span class="nombre-user">Cambiar Contraseña</span>              
                      </span>
                    </h4>


                    @if(session()->has('mensajeR'))
                        @if(session('mensajeR')!=false)
                            <div class="form-group">
                                <div class="col-xs-12 alertH">
                                    <div  class="alert alert-{{session('mensajeR')}} alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <strong>IMPORTANTE: </strong> {{session('mensajeInfo')}} 
                                    </div>
                                </div>
                            </div>
                        @endif
                    @endif


                    <div class="form-horizontal">
                      <div class="form-group">                                    
                          <label class="control-label col-md-12 col-sm-12 col-xs-12" for="new-password" style="text-align: center; padding-bottom: 5px;">Nueva Contraseña:</label>
                          <div class="col-sm-12 form-group{{ $errors->has('password') || session()->has('ClaveInsegura') ? ' has-error' : '' }} has-feedback" style="width: 100%; margin-bottom: 0px;">
                              <input id="new-password" type="password" class="inputValClave form-control form-control-1 has-feedback-left" placeholder="Contraseña" name="password" style="margin-bottom: 0px;" required>
                              <span class="glyphicon glyphicon-lock form-control-feedback left" aria-hidden="true"></span>
                              {{-- <p class="mensaje_formato_clave">La contraseña debe tener al menos 8 caracteres, incluir letras mayúsculas, minúsculas y numeros.</p> --}}
                              <div class='mserror'>
                                  @if ($errors->has('password'))                                                                                                          
                                    <span class="help-block" style="margin-bottom: 0px;"> 
                                        La contraseña debe tener al menos 8 caracteres, incluir letras mayúsculas, minúsculas y numeros.
                                    </span>
                                  @endif
                              </div>
                          </div>
                      </div>
        
                      <div class="form-group">
                          <label class="control-label col-md-12 col-sm-12 col-xs-12" for="password-confirm" style="text-align: center; padding-bottom: 5px;">Confirme Contraseña:</label>
                          <div class="col-sm-12 form-group{{ $errors->has('password_confirmation') || session()->has('ClaveInsegura') ? ' has-error' : '' }} has-feedback" style="width: 100%;">
                              <input id="password-confirm" name="password_confirmation" type="password" class="inputConfClave form-control form-control-1 has-feedback-left" placeholder="Confirmar contraseña" style="margin-bottom: 0px;"  required>
                              <span class="glyphicon glyphicon-ok-circle form-control-feedback left" aria-hidden="true"></span>
                              <div class='mserror'>
                                @if ($errors->has('password_confirmation'))                        
                                    <span class="help-block" style="margin-bottom: 0px;"> 
                                        Confirme bien la contraseña.
                                    </span>
                                @endif
                              </div>
                          </div>
                      </div>
                              
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
              @endif

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
    <script src="{{asset('js/registroUsuario.js')}}"></script>

    <script type="text/javascript">
     
        $("#new-password").focus(function(){
          console.log("slkdaflkj");
          $('.mensaje_formato_clave').show(200);
        });

    </script>

  </body>
</html>

