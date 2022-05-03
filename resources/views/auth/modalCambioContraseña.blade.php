
@if(session()->has('estado'))
  <script type="text/javascript">
     $(document).ready(function() {
        $("#Cambio_Contraseña_Modal").modal("show");
     });
  </script>
@endif

<div id="Cambio_Contraseña_Modal" class="modal">
  <div class="modal-dialog" >
    <div class="modal-content">
	    <div class="modal-header">
	        <span style="font-size: 150%; color: green" class="fa fa-key"></span> <label class="modal-title" style="font-size: 130%; color: black ;">CAMBIO DE CONTRASEÑA</label>
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	    </div>
	    <div class="modal-body" style="color: black">
    			<form class="form-horizontal" method="POST" action="{{ route('cambiocontrasena') }}">
                                {{ csrf_field() }}
              <div id="divalerta">
                @if(session()->has('mensajeCambio'))
                    <div  class="alert alert-success alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>IMPORTANTE: </strong> {{session('mensajeCambio')}} 
                    </div>
                @endif
                @if(session()->has('errorcoincide'))
                    <div  class="alert alert-danger alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>IMPORTANTE: </strong> {{session('errorcoincide')}} 
                    </div>
                @endif
                @if(session()->has('errorclaveactual'))
                    <div  class="alert alert-danger alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>IMPORTANTE: </strong> {{session('errorclaveactual')}} 
                    </div>
                @endif
                @if(session()->has('validaclave'))
                    <div  class="alert alert-danger alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>IMPORTANTE: </strong> {{session('validaclave')}} 
                    </div>
                @endif
                @if(session()->has('mensajeigualActual'))
                    <div  class="alert alert-danger alert-dismissible fade in" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                        </button>
                        <strong>IMPORTANTE: </strong> {{session('mensajeigualActual')}} 
                    </div>
                @endif
              </div>
              <div class="form-group row">
                <div class="col-md-2"></div>
                <div class="col-md-8 has-feedback">
                    <label style="color: #0C3562">Contraseña Actual:</label>
                    <input id="passwordActaul" type="password" class="form-control has-feedback-left" placeholder="Contraseña Actual" name="passwordActaul" required>
                    <span class="glyphicon glyphicon-lock form-control-feedback left" aria-hidden="true"></span>
                </div>
                <div class="col-md-2"></div>
              </div>        
              <div class="form-group row">
              	<div class="col-md-2"></div>
                <div class="col-md-8 has-feedback">
                    <label style="color: #0C3562">Nueva Contraseña:</label>
                    <input id="passwordCambio" type="password" class="form-control has-feedback-left" placeholder="Nueva Contraseña" name="passwordCambio" required>
                    <span class="glyphicon glyphicon-lock form-control-feedback left" aria-hidden="true"></span>
                </div>
                <div class="col-md-2"></div>
              </div>
              <div class="form-group row">
                	<div class="col-md-2"></div>
                	<div class="col-md-8 form-group has-feedback">
                		<label style="color: #0C3562">Confirmar Contraseña:</label>
                        <input  id="password-confirmCambio" type="password" class="form-control has-feedback-left" placeholder="Confirmar contraseña" name="password_confirmationCambio" required>
                        <span class="glyphicon glyphicon-ok-circle form-control-feedback left" aria-hidden="true"></span>
                    </div>
                    <div class="col-md-2"></div>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Aceptar</button>
              </div>
          </form>
      </div>
    </div>
  </div>
</div>
<!-- <script src="{{ asset('js/registroUser.js') }}"></script> -->