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
    <!-- Font Awesome -->
    <link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- Animate.css -->
    <link href="../vendors/animate.css/animate.min.css" rel="stylesheet">
    {{-- estilos para login y selecicon de tipo fp--}}
    <link rel="stylesheet" href="{{asset('/css/documental/estilosLoginTipoFP.css')}}">
    {{-- nuevos estilos de boostrap botones --}}
    <link rel="stylesheet" href="{{asset('/css/nuevosEstilosBootstrap4.css')}}">
    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
    <link rel="shortcut icon" href="/logotitulo.ico" />
    
  </head>

  <body class="login">
    <div class="full-page-background-1">
    <div class="full-page-background-2">
      <a class="hiddenanchor" id="signup"></a>
      <a class="hiddenanchor" id="signin"></a>

      <div class="login_wrapper">
        <div class="animate form login_form animate-margin-mobil">
          <section class="login_content contenedorSelecTipoFP">
              <center>
                  <div class="contenAvatar" style="margin-top: -65px;">
                      <img src="{{asset('/images/img.jpg')}}" alt="">
                  </div>
                </center>
             <form class="form-horizontal" method="POST" action="{{ route('login') }}">
                {{ csrf_field() }}
                <h4>
                  <span class="border-nombre-user" style="background-color: rgb(254, 231, 231);">                 
                      <span class="nombre-user">Iniciar Sesión</span>                   
                  </span>
                </h4>
                <br>
                
                @if(session()->has('user_baja'))
                  <div class="alert alert-danger alert-dismissible" role="alert" style="margin: 0px 25px 15px 25px;">            
                    <strong>El usuario ha sido dado de baja</strong>.
                  </div>
                @endif

              <div class="col-xs-12 form-group{{ $errors->has('email') ? ' has-error' : '' }} has-feedback div_input_login">
                  <input id="email" type="email" class="form-control has-feedback-left" name="email" placeholder="Email" value="" style="margin-bottom: 8px;" required autofocus>
                  <span class="fa fa-user form-control-feedback left" aria-hidden="true"></span>
                  @if ($errors->has('email'))
                      <span class="help-block" role="alert" style="margin-bottom: 0px;">
                          <strong>{{ $errors->first('email') }}</strong>
                      </span>
                  @endif
              </div>

              <div class="col-xs-12 form-group{{ $errors->has('password') ? ' has-error' : '' }} has-feedback div_input_login">
                  <input id="password" type="password" class="form-control has-feedback-left" name="password" placeholder="Clave" value="" style="margin-bottom: 8px;" required>
                  <span class="glyphicon glyphicon-lock form-control-feedback left" aria-hidden="true"></span>
                  @if ($errors->has('password'))
                      <span class="help-block" role="alert" style="margin-bottom: 0px;">
                          <strong>{{ $errors->first('password') }}</strong>
                      </span>
                  @endif
              </div>
              
             
              
              

              <div>
                <button type="submit" class="btn btn-outline-primary submit"><i class="fa fa-sign-in"></i> Entrar</button>
                @if ($errors->has('email'))
                  <a class="reset_pass reset_log" style="margin-top: 7px !important;" href="{{route('restaurarCont')}}">Restablecer Clave Aquí <i class="fa fa-hand-o-left"></i></a>
                @else
                  <a class="reset_pass" href="{{route('restaurarCont')}}">¿Olvidó su clave?</a>
                @endif
              </div>
              <div class="clearfix"></div>

              <div class="separator">
                <!-- <p class="change_link">Tienes cuenta?
                  <a href="{{route('register')}}" class="to_register"> Registrarse </a> -->
                </p>

                <div class="clearfix"></div>
                <br/>

                <div >
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

  <script src='https://www.google.com/recaptcha/api.js'></script> -->
  <script src='https://www.google.com/recaptcha/api.js?hl=es'></script>
  </body>
</html>













{{-- LOS QUE SIGUE ES DEL LOGUIN NORMAL --}}

{{-- <!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>ServicesOnlineChone</title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- Animate.css -->
    <link href="../vendors/animate.css/animate.min.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
  </head>

  <body class="login">
    <div>
      <a class="hiddenanchor" id="signup"></a>
      <a class="hiddenanchor" id="signin"></a>

      <div class="login_wrapper">
        <div class="animate form login_form">
          <section class="login_content">
             <form class="form-horizontal" method="POST" action="{{ route('login') }}">
                        {{ csrf_field() }}
              <img  class="" src="{{asset('images/logochone.png')}}" width="36%">
              <h2>Inciar Sesión</h2>
              <div class="col-xs-12 form-group{{ $errors->has('email') ? ' has-error' : '' }} has-feedback">
                  <input id="email" type="email" class="form-control has-feedback-left" name="email" placeholder="Email" style="margin-bottom: 8px;" required autofocus>
                  <span class="fa fa-user form-control-feedback left" aria-hidden="true"></span>
                  @if ($errors->has('email'))
                      <span class="help-block" role="alert" style="margin-bottom: 0px;">
                          <strong>{{ $errors->first('email') }}</strong>
                      </span>
                  @endif
              </div>

              <div class="col-xs-12 form-group{{ $errors->has('password') ? ' has-error' : '' }} has-feedback">
                  <input id="password" type="password" class="form-control has-feedback-left" name="password" placeholder="Clave" style="margin-bottom: 8px;" required>
                  <span class="glyphicon glyphicon-lock form-control-feedback left" aria-hidden="true"></span>
                  @if ($errors->has('password'))
                      <span class="help-block" role="alert" style="margin-bottom: 0px;">
                          <strong>{{ $errors->first('password') }}</strong>
                      </span>
                  @endif
              </div>

              <!-- el recaptcha  -->
              <!-- <div class="g-recaptcha" style="display: inline-table; padding-bottom: 20px;" data-sitekey="6Lfzup0UAAAAADVKrqLTY_K8frn7l2eme6S50yNq"></div> -->

              <div style="display: inline-table; ">{!! Recaptcha::render() !!}</div>
                <div id="contenedorredca"></div>
                @if ($errors->has('g-recaptcha-response'))
                    <span class="help-block" style="color: #A70E03"> <strong>{{ $errors->first('g-recaptcha-response') }}</strong></span>
                @endif


              <div>
                <button type="submit" class="btn btn-default submit">Aceptar</button>
                <a class="reset_pass" href="{{asset('restaurarCont')}}">¿Olvidó su contraseña?</a>
              </div>
              <div class="clearfix"></div>

              <div class="separator">
                <!-- <p class="change_link">Tienes cuenta?
                  <a href="{{route('register')}}" class="to_register"> Registrarse </a> -->
                </p>

                <div class="clearfix"></div>
                <br/>

                <div>
                  <i class="fa fa-"></i> ServicesOnlineChone
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

  <!-- <script src='https://www.google.com/recaptcha/api.js'></script> -->
    <!-- <script src='https://www.google.com/recaptcha/api.js?hl=es'></script> -->
  </body>
</html>
 --}}
