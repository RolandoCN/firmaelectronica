<div class="modal fade" id="Perfil_ModalFP" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
	    <div class="modal-header">
	        <span style="font-size: 150%; color: green" class="fa fa-user"></span> <label class="modal-title" style="font-size: 130%; color: black ;">INFORMACIÓN PERSONAL</label>
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	    </div>
	    <div class="modal-body">
			<div class="row">
		        <div class="col-md-12 profile_details text-center">
		            <div class="well profile_view">
		                <div class="col-sm-12" style="color:black">
			                <h4 class="brief"><b>{{ Auth::user()->name }}</b></h4>
			                <hr>
			                <div class="left col-xs-9">
			                	<div class="row">
			                		<div class="col-md-6">
									  <h5  style="text-align: left"><span style="color: green" class="glyphicon glyphicon-credit-card"></span> <strong>DNI/RUC:</strong>  {{ Auth::user()->cedula }}</h5>
			                		</div>
				                	<div class="col-md-6">
				                	  @if(Auth::user()->tipopersona=="Natural")
									  <h5  style="text-align: left"><span style="color: green" class="glyphicon glyphicon-credit-card"></span> <strong>Sexo:</strong>
									  	@if(Auth::user()->sexo =='M')
									   		 Masculino
										@else
											 Femenino
										@endif
									</h5>
									  @else
									  	<h5 style="text-align: left"><span style="color: green" class="glyphicon glyphicon-briefcase"></span> <strong>Persona:</strong>  {{ Auth::user()->tipopersona }}</h5>
									  @endif
			                		</div>
			                	</div>
			                    <div class="row">
			                		<div class="col-md-6">
									  <h5  style="text-align: left"><span style="color: green" class="glyphicon glyphicon-earphone"></span> <strong>Teléfono:</strong>  {{ Auth::user()->telefono}}</h5>
			                		</div>
				                	<div class="col-md-6">
									  <h5  style="text-align: left"><span style="color: green" class="glyphicon glyphicon-phone"></span> <strong>Celular:</strong>  {{ Auth::user()->celular}}</h5>
			                		</div>
			                	</div>
			                	<div class="row">
			                		<div class="col-md-6">
									  <h5  style="text-align: left"><span style="color: green" class="glyphicon glyphicon-map-marker"></span> <strong>Dirección:</strong>  {{ Auth::user()->direccion}}</h5>
			                		</div>
			                	    <div class="col-md-6">
									  <h5  style="text-align: left"><span style="color: green" class="glyphicon glyphicon-envelope"></span> <strong>Email:</strong>{{ Auth::user()->email}}</h5>
			                		</div>
			                	</div>
			                </div>
			                <div class="right col-xs-3 text-center">
			                    @if(Auth::user()->sexo=="M")
			                       <img src="{{asset('images/user.png')}}" alt="" class="img-circle img-responsive" width="70%">
								@elseif(Auth::user()->sexo=="F")
			                       <img src="{{asset('images/user_fem.png')}}" alt="" class="img-circle img-responsive" width="70%">
								@else
									<img src="{{asset('images/negocio.png')}}" alt="" class="img-circle img-responsive" width="70%">
								@endif

			                </div>
		                </div>
			            <div class="col-xs-12 bottom text-center">
			                <div class="col-xs-12 col-sm-12 emphasis">
								<center><a href="{{route('home')}}"><img src="{{asset('images/logochone.png')}}" width="10%"></a></center>	
			                </div>
		                </div>
		         
		            </div>
				</div>
		    </div>
        </div>
  </div>
</div>
</div>   