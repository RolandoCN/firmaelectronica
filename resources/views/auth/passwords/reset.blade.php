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
        <div class="animate form login_form" style="margin-top: 5%;">
          <section class="login_content contenedorSelecTipoFP">

              @if(session()->has('mesajeEnvio'))
                  <div class="form-horizontal">
                    <h4>
                      <span class="border-nombre-user" style="padding: 20px 7px 20px 7px; margin: 0px 5px 0px 5px;">                    
                          <span class="nombre-user" style="line-height: 1.3; text-transform: none; font-size: 16px;">
                            {{session('mesajeEnvio')}}
                          </span>
                          <br><br>
                          @if(session('status')=="success")
                            <i class="fa fa-check-circle" style="font-size: 70px; color: #178e32"></i>
                          @else
                            <i class="fa fa-times-circle" style="font-size: 70px; color: #c72b2f"></i>
                          @endif                                   
                      </span>
                    </h4>                    
                  </div>
                  <br>
                  @if(session('status')=="success")
                    <a href="{{route('login')}}" class="btn btn-outline-success" style="text-decoration: none"><i class="fa fa-sign-in"></i> Iniciar Sesión</a>
                  @else
                    <a href="{{route('restaurarCont')}}" class="btn btn-outline-primary" style="text-decoration: none"><i class="fa fa-history"></i> Reintentar</a>
                  @endif   
                  <br><br> 
              @else
              {{-- FORMULARIO PARA REALIZAR EL CAMBIO DE CONTRASEÑA --}}
                <form class="form-horizontal" method="POST" action="{{ route('solicitarRestauracionClave') }}">
                    {{ csrf_field() }}

                    <h4>
                      <span class="border-nombre-user"  style="margin: 0px 5px 0px 5px;">                    
                          <span class="nombre-user">Restablecer mi Contraseña</span>              
                      </span>
                    </h4>


                    <div class="form-group row">


                      @if(session()->has('mensajeR'))
                          @if(session('mensajeR')!=false)
                              <div class="form-group">
                                  <div class="col-xs-12 alertH">
                                      <div  class="alert alert-{{session('mensajeR')}} alert-dismissible fade in" role="alert" style="margin-bottom: 0px;">
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                          </button>
                                          {{session('mensajeInfo')}} 
                                      </div>
                                  </div>
                              </div>
                          @endif
                      @else
                        <div class="form-group row">
                            <div class="col-xs-12">
                                <p style="color: black; font-size: 14px; line-height: 1.2; text-align: justify;">Ingrese la dirección de correo electrónico con la que se registró y le enviaremos instrucciones sobre cómo restablecer su contraseña.</p>
                            </div>
                        </div>                      
                      @endif
                      
                      <div class="col-xs-12 form-group{{ session()->has('mensajeR') ? ' has-error' : '' }} has-feedback">
                          <input id="email" name="email" value="" type="text" class="form-control has-feedback-left" placeholder="Ingrese su correo electrónico" required style="margin-bottom: 10px;" autofocus>      
                          <span class="glyphicon glyphicon-credit-card form-control-feedback left" aria-hidden="true"></span>
                          @if ($errors->has('email'))                  
                              <span class="help-block" style="color: #A70E03"> <strong>{{ $errors->first('email') }}</strong></span>                                                        
                          @endif
                          @if (session()->has('error_email'))
                            <span class="help-block" style="color: #A70E03"> <strong>{{ session('error_email') }}</strong></span> 
                          @endif
                      </div>

                      <div class="form-group row"> 
                          <center>
                            <div class="col-xs-12">
                              <div  style="display: inline-table; padding-bottom: 0px;">{!! Recaptcha::render() !!}</div>
                                @if ($errors->has('g-recaptcha-response'))                  
                                    <span class="help-block" style="color: #A70E03"> <strong>{{ $errors->first('g-recaptcha-response') }}</strong></span>                              
                                @endif
                            </div>
                          </center>
                      </div>

                      <button type="submit" class="btn btn-outline-primary submit"><i class="fa fa-envelope"></i> Enviar Correo</button>

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

