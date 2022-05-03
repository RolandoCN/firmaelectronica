@extends('layouts.service')
@section('contenido')
<!DOCTYPE html>
<html>
<head>
    <title>Registro</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
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

    <style type="text/css">
        .ingresar{
            border: 1px solid #969696 !important;
        }
        .ingresar:focus{
            border: 1px solid #969696 !important;
        }
        .input_menu_buscar{
          width: -webkit-fill-available; 
          margin: 0px 5px; 
          height: 25px; 
          border: 1px solid #374850; 
          border-radius: 4px;
        }
    </style>

</head>
<body>
    <br><br><br>
    {{-- <div class="title_left">
        <h3>Gestión de usuarios</h3>
    </div> --}}
    <br><br>
    
    <div class="container">
            
        <div class="row">
            <div class="col-md-2">
            
            </div>
            {{-- {{session()->has('FPencontrado') || sizeof($errors)>0 ? '12':'6'}} --}}
            <div class="col-md-{{session()->has('FPencontrado') || sizeof($errors)>0 ? '12':'6'}}">
                <div class="panel panel-default">
                    <div class="panel-body">

                        <div>
                            <div class="divborde">
                                <h2>Crear un nuevo usuario</h2>
                            </div>
                            @if(!session()->has('FPencontrado') && sizeof($errors)==0)
                                <p>Ingrese la <code>Cédula o Ruc </code> del nuevo usuario</p>
                            @else
                                <p>Ingrese los datos del nuevo usuario</p>
                            @endif
                            <span class="section" style="margin:0;"></span>                             
                        </div>

                        @if(session()->has('mensajeR'))
                            @if(session('mensajeR')!=false)
                                <div class="form-group">
                                    <div class="col-xs-12 alertH">
                                        <div  class="alert alert-{{session('mensajeR')}} alert-dismissible fade in" role="alert">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                                            <strong>IMPORTANTE: </strong> @php print(session('mensajeInfo')); @endphp 
                                        </div>
                                    </div>
                                </div>
                            @endif
                        @endif


                    @if(!session()->has('FPencontrado') && sizeof($errors)==0)
                        <!-- este bloque de codigo solo aparece cuando no se buscado una cedula-->                   
                        
                        <form class="form-horizontal" method="POST" action="{{ url('buscarFP') }}">
                            @if(session()->has('mensajePregunta')) 
                                <input type="hidden" name="mensajePregunta" value="{{session('mensajePregunta')}}"> 
                                <input type="hidden" name="mensajeCedula" value="{{session('mensajeCedula')}}"> 
                            @endif
                            {{ csrf_field() }}
                            <br>
                            <div class="form-group">
                                <div class="col-xs-12 {{session()->has('ErrorCedula') ? 'has-error':''}}">
                                    @if(session()->has('mensajePregunta'))
                                        <input type="text" value="{{ decrypt(session('mensajeCedula')) }}" name="cedula" class="form-control form-control-1 has-feedback-left soloinfo" placeholder="Cédula o RUC">
                                    @else
                                        <input type="text" value="{{session()->has('dataOld') ? session('dataOld')['cedula']:''}}" name="cedula" class="form-control form-control-1 has-feedback-left" placeholder="Cédula o RUC">
                                    @endif
                                    
                                    <span class="glyphicon glyphicon-credit-card form-control-feedback left" aria-hidden="true"></span>
                                    @if (session()->has('ErrorCedula'))
                                        <span class="help-block">
                                            <strong>
                                                {{ session('ErrorCedula') }}
                                            </strong>
                                        </span>
                                    @endif
                                </div>
                            </div>
                            <div class="form-group">                               
                                @if(session()->has('mensajePregunta'))
                                    <div class="col-xs-6">
                                        <button type="submit" class="btn btn-primary btn-block btn_registrarUsuario">
                                            Confirmar Registro
                                        </button>
                                    </div>
                                    <div class="col-xs-6">
                                        <a href="{{url('/registrarUsuario')}}" class="btn btn-warning btn-block btn_registrarUsuario">
                                            Cancelar
                                        </a>
                                    </div>
                                @else                           
                                    <div class="col-xs-12">
                                        <button type="submit" class="btn btn-primary btn-block btn_registrarUsuario">
                                            Buscar Datos
                                        </button>
                                    </div>                                                                                     
                                @endif
                            </div>
                        </form>
                    @else
                    <!-- este bloque de codigo solo aparece cuando se a encontrado la cedula -->
                        <!-- B1: formulacrio para registrar todos los datos del nuevo usuario -->
     
                        <form id="frmRegisterAll" class="form-horizontal frm_registrar" method="POST" autocomplete="off" action="{{ url('registrarUsuario') }}">
                            {{ csrf_field() }}
                            <br>
                            <div>
                            
                                @if(session()->has('mensajeR'))
                                    <input type="hidden" name="cedencrypt" value="{{session()->has('mensajeR') ? encrypt(session('dataOld')['cedula']) : ''}}">
                                @else
                                    <input type="hidden" name="cedencrypt" value="{{old('cedencrypt')}}">
                                @endif

                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Cédula o RUC</label>
                                    <div class="col-sm-6 col_100  form-group{{ $errors->has('cedula') || session()->has('ErrorCedula') ? ' has-error' : '' }} has-feedback">
                                        <input id="cedula"  value="{{session()->has('mensajeR') ? session('dataOld')['cedula'] : old('cedula')}}" type="number" class="form-control has-feedback-left soloinfo" placeholder="Cédula" name="cedula">
                                        <span class="glyphicon glyphicon-credit-card form-control-feedback left" aria-hidden="true"></span>
                                        @if ($errors->has('cedula') || session()->has('ErrorCedula'))
                                            <span class="help-block">
                                                <strong>
                                                    @if(session()->has('ErrorCedula'))
                                                        {{ session('ErrorCedula') }}
                                                    @else
                                                        {{ $errors->first('cedula') }}
                                                    @endif
                                                </strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Nombre y Apellido</label>
                                    <div class="col-sm-6 col_100 form-group{{ $errors->has('name') ? ' has-error' : '' }} has-feedback">
                                        <input id="name" value="{{session()->has('mensajeR') ? session('dataOld')['name'] : old('name')}}" type="text" class="form-control has-feedback-left soloinfo" placeholder="Nombres y Apellidos" name="name">
                                        <span class="fa fa-user form-control-feedback left" aria-hidden="true"></span>
                                        @if ($errors->has('name'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('name') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Telefono</label>
                                    <div class="col-sm-6 col_100 form-group{{ $errors->has('telefono') ? ' has-error' : '' }} has-feedback">
                                        @if(is_null(session('dataOld')['telefono']))
                                            <input id="telefono" value="" type="number" class="form-control has-feedback-left ingresar" placeholder="Telefono" name="telefono">
                                        @else
                                            <input id="telefono" value="{{session()->has('mensajeR') ? session('dataOld')['telefono'] : old('telefono')}}" type="number" class="form-control has-feedback-left" placeholder="Telefono" name="telefono">
                                        @endif
                                        <span class="glyphicon glyphicon-earphone form-control-feedback left" aria-hidden="true"></span>
                                        @if ($errors->has('telefono'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('telefono') }}</strong>
                                            </span>
                                        @endif                                    
                                    </div>
                                </div>

                                <div class="form-group">
                                
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Sexo</label>
                                    <div class="col-sm-6 col_100 form-group{{ $errors->has('sexo') ? ' has-error' : '' }} has-feedback">
                                        @if(is_null(session('dataOld')['sexo']))
                                            <select id="sexo" class="form-control has-feedback-left ingresar" name="sexo" required="" autofocus="">
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                            </select>
                                        @else

                                            <select id="sexo" class="form-control has-feedback-left ingresar" name="sexo" required="" autofocus="">
                                                <option {{session()->has('mensajeR') ? (session('dataOld')['sexo']=='M' ? 'selected':'') : (old('sexo')=="M") ? 'selected':''}} value="M">Masculino</option>
                                                <option {{session()->has('mensajeR') ? (session('dataOld')['sexo']=='F' ? 'selected':'') : (old('sexo')=="F") ? 'selected':''}} value="F">Femenino</option>
                                            </select>
                            
                                        @endif
                                        
                                        <span class="glyphicon glyphicon-phone form-control-feedback left" aria-hidden="true"></span>
                                        @if ($errors->has('sexo'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('sexo') }}</strong>
                                            </span>
                                        @endif                                     
                                    </div>
                                </div>

                                <div class="form-group">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Dirección</label>
                                    <div class="col-sm-6 col_100 form-group{{ $errors->has('direccion') ? ' has-error' : '' }} has-feedback">
                                        @if(is_null(session('dataOld')['direccion']))
                                            <input id="direccion" value="" type="text" class="form-control has-feedback-left ingresar" placeholder="Dirección" name="direccion">                                            
                                        @else                                       
                                            <input id="direccion" value="{{session()->has('mensajeR') ? session('dataOld')['direccion'] : old('direccion')}}"  type="text" class="form-control has-feedback-left" placeholder="Dirección" name="direccion">
                                        @endif                                            
                                        <span class="glyphicon glyphicon-map-marker form-control-feedback left" aria-hidden="true"></span>
                                        @if ($errors->has('direccion'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('direccion') }}</strong>
                                            </span>
                                        @endif                                      
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Celular</label>
                                    <div class="col-sm-6 col_100 form-group{{ $errors->has('celular') ? ' has-error' : '' }} has-feedback">
                                        <input id="celular" value="{{session()->has('mensajeR') ? session('dataOld')['celular'] : old('celular')}}" type="number"  class="form-control form-control-1 has-feedback-left ingresar" placeholder="Celular" name="celular" autofocus>
                                        <span class="glyphicon glyphicon-phone form-control-feedback left" aria-hidden="true"></span>
                                        @if ($errors->has('celular'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('celular') }}</strong>
                                            </span>
                                        @endif                                    
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">E-mail *</label>
                                    <div class="col-sm-6 col_100 form-group{{ $errors->has('email') ? ' has-error' : '' }} has-feedback">
                                        <input id="email" name="email" value="{{session()->has('mensajeR') ? session('dataOld')['email'] : old('email')}}"  type="email" class="form-control has-feedback-left ingresar" placeholder="E-mail" required>
                                        <span class="glyphicon glyphicon-envelope form-control-feedback left" aria-hidden="true"></span>
                                        @if ($errors->has('email'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('email') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                {{-- <div class="form-group{{ $errors->has('password') || session()->has('ClaveInsegura') ? ' has-error' : '' }}">                                    
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Contraseña <span class="required">*</span></label>
                                    <div class="col-sm-6 col_100 form-group has-feedback">
                                        <input id="password" type="password" class="inputValClave form-control form-control-1 has-feedback-left" placeholder="Contraseña" name="password" required>
                                        <span class="glyphicon glyphicon-lock form-control-feedback left" aria-hidden="true"></span>
                                        <div class='mserror'>
                                            @if ($errors->has('password') || session()->has('ClaveInsegura'))                        
                                                <span class="help-block">
                                                    @if(session()->has('ClaveInsegura'))
                                                        {{ session('ClaveInsegura') }}
                                                    @else
                                                        <strong>{{ $errors->first('password') }}</strong>
                                                    @endif
                                                </span>
                                            @endif
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Confirme Contraseña <span class="required">*</span></label>
                                    <div class="col-sm-6 col_100 form-group has-feedback">
                                        <input id="password-confirm" name="password_confirmation" type="password" class="inputConfClave form-control form-control-1 has-feedback-left" placeholder="Confirmar contraseña"  required>
                                        <span class="glyphicon glyphicon-ok-circle form-control-feedback left" aria-hidden="true"></span>
                                        <div class='mserror'></div>
                                    </div>
                                </div> --}}

                            </div>
                            
                            <div class="form-group">
                                <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3" style="display: flex">
                                
                                    <button type="submit" class="btn btn-primary btn_registar">
                                        @if(session()->has('FPlocal'))
                                            @if(session('FPlocal')==true)
                                                <i class="fa fa-save"></i> Actualizar
                                            @else
                                                <i class="fa fa-save"></i> Registrar
                                            @endif
                                        @else
                                            <i class="fa fa-save"></i> Registrar
                                        @endif                                        
                                    </button>
                                    
                                    <a href="{{asset('registrarUsuario')}}" class="btn btn-warning btn_registar" onclick="vistacargando('M', 'Espere')">
                                        <i class="fa fa-remove"></i> Cancelar
                                    </a>
                                    
                            </div>
                        </form>
                        <!-- fin B1 -->
                    @endif
                    </div>
                </div>
            </div>
            <div class="col-md-2">
            </div>
        </div>
    </div>
    <script src="{{ asset('js/registroUsuario.js') }}"></script>
</body>
</html>
@endsection 