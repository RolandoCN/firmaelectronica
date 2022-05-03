<!DOCTYPE html>
<html>
<head>
    <title>Recuperación de Contraseña</title>
    <style type="text/css">
        .btn-outline-primary {
            color: #007bff;
            border: 1px solid #007bff;
            background-color: transparent;
            text-decoration: none;
        }
        
        .btn-outline-primary:hover {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        
        .btn-outline-primary:focus, .btn-outline-primary.focus {
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
        }
        
        .btn-outline-primary.disabled, .btn-outline-primary:disabled {
            color: #007bff;
            background-color: transparent;
        }
        
        .btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active,
        .show > .btn-outline-primary.dropdown-toggle {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        
        .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus,
        .show > .btn-outline-primary.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
        }

        .btn {
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-image: none;
            border-radius: 4px;
        }
        
    </style>
</head>
<body style="color: black">

   <center>
     
	    <div style="border: 1px solid #CDCACA; border-radius: 10px;width: 60%;height: auto; text-align: justify;padding: 3%;" >
	    	<br>
	    	<h2 style="text-align: center; text-transform: uppercase;">Bienvenido {{$usuario->name}} al Sistema Intranet</h2>
	    	<hr>
	    	<br>
		   <center><b>RECUPERACIÓN DE CONTRASEÑA</b></center>
		   <p>
		   	<ul>
		   		<br>
		        <li style="color:blue"><b> Haga clic en el enlace para restaurar su contraseña<b></li>
		        <li style="color:blue"><b>En caso de presentar algún error al presionar en el enlace por favor repita el preceso de envio de 
		        correo en la opción recuperar clave<b></li>
		   </ul>
		   </p>
		   <br>
		   <center>
             <a class="btn btn-outline-primary"
                href="{{url('/cambiarContrasenia/'.$usuario->email_token)}}">
                Restaurar Contraseña
             </a>
             <br><br><br><br>
            </center> 
    	</div>
    </center>
</body>
</html>
